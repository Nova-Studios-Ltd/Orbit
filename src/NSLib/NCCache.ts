import { IMessageProps } from "Interfaces/IMessageProps";
import { getStorage } from "SiffrStorage/sifrr.storage";


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
  constructor(cache_id: string) {
    const cache = {
      priority: ["indexeddb"],
      name: `Cache_${cache_id}_`,
      version: 1,
      description: "Channel Cache",
      size: 10 * 1024 * 1024,
      ttl: 0
    }
    this.CurrentCache = getStorage(cache);
  }

  async CacheValid() : Promise<boolean> {
    if (!await this.ContainsMessage("LastAccess")) return false;
    const d = new Date((await this.CurrentCache.get("LastAccess"))["LastAccess"]);
    return ((Date.now() - d.getTime()) / (1000 * 3600 * 24)) < 1;
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

  ClearCache() {
    this.CurrentCache.clear();
  }

  SetMessage(id: string, message: IMessageProps) {
    this.CurrentCache.setSync(id, message);
    this.CurrentCache.setSync("LastAccess", Date.now())
  }
}
