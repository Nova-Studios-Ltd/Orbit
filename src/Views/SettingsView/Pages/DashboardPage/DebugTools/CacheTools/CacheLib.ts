import { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import { GETMessageEditTimestamps, GETMessages } from "NSLib/APIEvents";
import { NCChannelCache } from "NSLib/NCChannelCache";

export async function GetCaches() : Promise<string[]> {
  const databases = (await indexedDB.databases());
  const caches = [] as string[];
  for (let d = 0; d < databases.length; d++) {
    const database = databases[d];
    if (database.name !== undefined && database.name.includes("Cache")) caches.push(database.name);
  }
  return caches;
}

export async function HasChannelCache(channel_uuid: string) : Promise<boolean> {
  const names = (await indexedDB.databases()).flatMap((v) => {
    if (v.name !== undefined) return v.name;
    return "";
  });

  if (names.indexOf(`Cache_${channel_uuid}_1`) !== -1) return true;
  else return false;
}

export async function CacheValid(channel_uuid: string) : Promise<boolean> {
  if (!HasChannelCache(channel_uuid)) return false;
  const cache = new NCChannelCache(channel_uuid);
  if (await cache.RequiresRefresh()) return true;
  else return false;
}

export async function CacheIsUptoDate(channel_uuid: string) : Promise<boolean> {
  const res = await (new Promise<boolean>((resolve) => {
    if (!HasChannelCache(channel_uuid)) {
      resolve(false);
      return;
    }
    const cache = new NCChannelCache(channel_uuid);
    GETMessages(channel_uuid, async (messages: IMessageProps[]) => {
      // Check if our last message message matches the one on the server
      if (messages.length === 0) {
        resolve(false);
        return;
      }
      const m = (await cache.GetMessages(1)).Messages[0];
      if (m === undefined) return;
      const m_id = m.message_Id;
      if (messages[0].message_Id !== m_id) {
        resolve(false);
        return;
      }

      // Check if nothings been edited
      const oldest = (await cache.GetOldestMessage()).Last_Id;
      const limit = parseInt(messages[0].message_Id) - oldest;
      const remoteTimestamps = await GETMessageEditTimestamps(channel_uuid, limit, oldest - 1, parseInt(messages[0].message_Id) + 1);
      const localTimestamps = await cache.GetMessageEditTimestamps();

      const keys = remoteTimestamps.keys();
      for (let k = 0; k < keys.length; k++) {
        const key = keys[k];
        if (!localTimestamps.containsKey(key) || remoteTimestamps.getValue(key) !== localTimestamps.getValue(key)) {
          resolve(false);
          return;
        }
      }
      resolve(true);
    }, true, 1);
  }));
  return res;
}

export async function DeleteCache(cache: string) {
  if (!await HasChannelCache(cache)) return;
  indexedDB.deleteDatabase(`Cache_${cache}_1`);
}

export async function InvalidateCache(channel_uuid: string) {
  console.log(channel_uuid);
  if (!await HasChannelCache(channel_uuid)) return;
  const c = new NCChannelCache(channel_uuid);
  c.WriteSession("According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.");
  //await c.InvalidateCache();
}

/**
 * Emptys and then fills the cache with the 30 (or user configured value) new messages
 * @param cache Name of the cache
 */
export async function RefreshCache(cache: string) {
  await DeleteCache(cache);
  await GETMessages(cache, () => {}, false, 30);
}
