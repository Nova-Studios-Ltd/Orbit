import { IMessageProps } from "Interfaces/IMessageProps";
import { GETMessageEditTimestamps, GETMessages } from "NSLib/APIEvents";
import { NCChannelCache } from "NSLib/NCCache";

export async function GetCaches() : Promise<string[]> {
  const databases = (await indexedDB.databases());
  const caches = [] as string[];
  for (let d = 0; d < databases.length; d++) {
    const database = databases[d];
    if (database.name !== undefined && database.name.includes("Cache")) caches.push(database.name);
  }
  return caches;
}


export async function CacheValid(channel_uuid: string) : Promise<boolean> {
  const cache = new NCChannelCache(channel_uuid);
  if (await cache.CacheValid()) return true;
  else return false;
}

export async function CacheIsUptoDate(channel_uuid: string) : Promise<boolean> {
  return await new Promise((resolve) => {
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
  });
}
