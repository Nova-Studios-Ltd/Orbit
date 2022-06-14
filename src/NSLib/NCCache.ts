import { IMessageProps } from "Interfaces/IMessageProps";
import { getStorage } from "SiffrStorage/sifrr.storage";
import { GETMessage, GETMessageEditTimestamps, GETMessages } from "./APIEvents";
import { Dictionary } from "./Dictionary";


export class NCChannelCacheResult {
  Messages: IMessageProps[];
  Count: number;
  Last_Id: number;
  Satisfied: boolean;

  constructor(Messages: IMessageProps[], Count: number, Last_Id: number, Satisfied: boolean) {
    this.Messages = Messages;
    this.Count = Count;
    this.Last_Id = Last_Id;
    this.Satisfied = Satisfied;
  }
}


export class NCChannelCache {
  private CurrentCache: any;
  constructor(channel_uuid: string) {
    const cache = {
      priority: ["indexeddb"],
      name: `Cache_${channel_uuid}_`,
      version: 1,
      description: "Channel Cache",
      size: 10 * 1024 * 1024,
      ttl: 0
    }
    this.CurrentCache = getStorage(cache);
  }

  async RequiresRefresh() : Promise<boolean> {
    if (!await this.ContainsMessage("LastAccess")) return false;
    const d = new Date((await this.CurrentCache.get("LastAccess"))["LastAccess"]);
    return (((Date.now() - d.getTime()) / (1000 * 3600 * 24)) < 1);
  }

  async IsValidSession(session: string) : Promise<boolean> {
    return (await this.CurrentCache.get("Session"))["Session"] === session;
  }

  async ReadSession() : Promise<string> {
    return (await this.CurrentCache.get("Session"))["Session"];
  }

  WriteSession(session: string) {
    this.CurrentCache.setSync("Session", session);
  }

  async ContainsMessage(id: string) : Promise<boolean> {
    return (await this.CurrentCache.get(id))[id] !== undefined;
  }

  async GetMessage(id: string) : Promise<NCChannelCacheResult> {
    if (!await this.ContainsMessage(id)) return new NCChannelCacheResult([], 0, 0, false);
    const message = (await this.CurrentCache.get(id))[id] as IMessageProps
    return new NCChannelCacheResult([message], 1, parseInt(message.message_Id), true);
  }

  async GetMessages(limit: number, before: number = 2147483647) : Promise<NCChannelCacheResult> {
    const keys = (await this.CurrentCache.keys() as string[]).reverse();
    const messages = [] as IMessageProps[];
    let curLim = 0;
    let lastID = "";
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === "LastAccess" || key === "Session" || curLim >= limit) continue;
      if (parseInt(key) < before) {
        curLim++;
        lastID = key;
        messages.push((await this.GetMessage(key)).Messages[0]);
      }
    }
    return new NCChannelCacheResult(messages, messages.length, parseInt(lastID), curLim === limit)
  }

  async GetOldestMessage() : Promise<NCChannelCacheResult> {
    const keys = (await this.CurrentCache.keys() as string[]).reverse();
    const id = keys[keys.length - 1];
    return new NCChannelCacheResult([(await this.GetMessage(id)).Messages[0]], 1, parseInt(id), true);
  }

  async GetMessageEditTimestamps() : Promise<Dictionary<string>> {
    const keys = (await this.CurrentCache.keys() as string[]).reverse();
    keys.splice(keys.indexOf("LastAccess"), 1);
    keys.splice(keys.indexOf("Session"), 1);
    const timestamps = new Dictionary<string>();
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      timestamps.setValue(key, (await this.GetMessage(key)).Messages[0].editedTimestamp)
    }
    return timestamps
  }

  RemoveMessage(id: string) {
    this.CurrentCache.del(id);
  }

  ClearCache() {
    this.CurrentCache.clear();
  }

  async SetMessage(id: string, message: IMessageProps) {
    this.CurrentCache.setSync(id, message);
    this.CurrentCache.setSync("LastAccess", Date.now())

    // Check cache size and remove oldest message
    const keys = (await this.CurrentCache.keys() as string[]).reverse();
    keys.splice(keys.indexOf("LastAccess"), 1);
    keys.splice(keys.indexOf("Session", 1));
    if (keys.length > 100)
      this.CurrentCache.del(keys[0]);
  }

  // Static Methods
  /**
   * Gets all current channel caches
   * @returns A string array containing all current caches
   */
  static async GetCaches() : Promise<string[]> {
    const caches = (await indexedDB.databases()).flatMap((c) => {
      if (c.name !== undefined && c.name.includes("Cache")) return c.name;
      return "";
    });
    return caches;
  }

  /**
   * Checks if there is a cached created for the specified channel
   * @param channel_uuid The uuid of the channel you wish to find the cache for
   * @returns a NCChannelCache object if the cache is found otherwise undefined
   */
  static async ContainsCache(channel_uuid: string) : Promise<NCChannelCache | undefined> {
    const caches = await this.GetCaches();
    if (caches.indexOf(`Cache_${channel_uuid}_1`) !== -1) new NCChannelCache(channel_uuid);
    else return undefined;
  }

  /**
   * Removes all channel caches
   */
  static async DeleteCaches() {
    const caches = await this.GetCaches();
    for (const c in caches) {
      indexedDB.deleteDatabase(c);
    }
  }

  /**
   * Checks and returns a range of missing messages from the specified cache
   * @param channel_uuid Channel to check out-of-date
   * @returns Returns data as a triple [message-limit, after-id, before-id] or undefined if cache is already up-to-date or is unknown
   */
  static async CacheIsOld(channel_uuid: string) : Promise<[number, number, number] | undefined> {
    const ce = await this.ContainsCache(channel_uuid);
    if (ce === undefined) return undefined;
    const remote_message = parseInt((await GETMessages(channel_uuid, () => {}, true, 1))[0].message_Id);
    const local_message = parseInt((await (ce as NCChannelCache).GetMessages(1)).Messages[0].message_Id);
    if (remote_message !== local_message) {
      const limit = remote_message - local_message;
      return [limit, local_message - 1, remote_message + 1];
    }
    else {
      return undefined;
    }
  }

  /**
   * Updates messages in the cache
   * @param channel_uuid Channel to check for updated messages is
   * @returns A array of strings of message ids that have been updated
   */
  static async UpdateCache(channel_uuid: string) : Promise<string[] | undefined> {
    const ce = await this.ContainsCache(channel_uuid);
    if (ce === undefined) return undefined;
    const cache = ce as NCChannelCache;
    const oldestId = (await cache.GetOldestMessage()).Last_Id;
    const newestID = parseInt((await cache.GetMessages(1)).Messages[0].message_Id);
    const limit = newestID - oldestId;
    const remote = await GETMessageEditTimestamps(channel_uuid, limit, oldestId - 1, newestID + 1);
    const local = await cache.GetMessageEditTimestamps();
    const keys = [] as string[];
    for (const key in remote.keys()) {
      if (!local.containsKey(key) || remote.getValue(key) !== local.getValue(key)) {
        const message = await GETMessage(channel_uuid, key.toString(), true);
        console.log(`Cache for channel '${channel_uuid}' has out-of-date/missing message '${key}'. Attempting update...`)
        if (message === undefined) continue;
        keys.push(key);
        cache.SetMessage(key, message);
      }
    }
    return keys;
  }

  /**
   * Cleans cache of deleted message
   * @param channel_uuid Channel to clean deleted messages from
   * @returns A array of string of message ids that have been removed
   */
  static async CleanCache(channel_uuid: string) : Promise<string[] | undefined> {
    const ce = await this.ContainsCache(channel_uuid);
    if (ce === undefined) return undefined;
    const cache = ce as NCChannelCache;
    const oldestId = (await cache.GetOldestMessage()).Last_Id;
    const newestID = parseInt((await cache.GetMessages(1)).Messages[0].message_Id);
    const limit = newestID - oldestId;
    const remote = await GETMessageEditTimestamps(channel_uuid, limit, oldestId - 1, newestID + 1);
    const local = await cache.GetMessageEditTimestamps();
    const keys = [] as string[];
    for (const key in local.keys()) {
      if (remote.containsKey(key)) continue;
      cache.RemoveMessage(key);
      keys.push(key);
    }
    return keys;
  }
}
