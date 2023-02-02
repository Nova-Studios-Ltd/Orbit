import { Dictionary, KeyValuePair } from "Lib/Objects/Dictionary";
import IndexedDB from "Lib/Storage/IndexedDB";
import IndexedDBStore from "Lib/Storage/IndexedDBStore";
import { RequestKey } from "Lib/API/Endpoints/Keystore";

/**
 * Wrapper to handle the Keystore
 */
export default class KeyStore {

  private static KeyStore() : Promise<IndexedDBStore | undefined> {
    return new Promise((resolve) => {
      new IndexedDB("Keystore", (database: IndexedDB) => {
        resolve(database.CreateStore("Keystore"));
    })});
  }

  static async GetKey(user_uuid: string) : Promise<string | undefined> {
    if (!await this.ContainsKey(user_uuid)) {
      console.log(`Keystore did not contain key for user ${user_uuid}. Attempting fetch from server...`);
      const key = await RequestKey(user_uuid);
      if (key === undefined) return undefined;
      await this.SetKey(user_uuid, key);
      return key;
    }
    return await (await this.KeyStore())?.Get<string>(user_uuid);
  }

  static async SetKey(user_uuid: string, key: string) {
    await (await this.KeyStore())?.Add(user_uuid, key);
  }

  static async ClearKey(user_uuid: string) : Promise<boolean | undefined> {
    return await (await this.KeyStore())?.Remove(user_uuid);
  }

  static async ClearKeys() {
    await (await this.KeyStore())?.Clear();
  }

  static async LoadKeys(keys: Dictionary<string, string>) {
    keys.forEach((pair: KeyValuePair<string, string>) => {
      this.SetKey(pair.Key, pair.Value);
    });
  }

  static async ContainsKey(user_uuid: string) : Promise<boolean> {
    return await (await this.KeyStore())?.Get<string>(user_uuid) === undefined? false : true;
  }
}
