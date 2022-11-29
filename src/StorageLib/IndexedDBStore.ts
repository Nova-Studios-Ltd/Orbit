/**
 * A wrapper around the IDBObjectStore interface
 */
 export class IndexedDBStore {
  private database: IDBDatabase;
  private storeName: string;

  constructor(database: IDBDatabase, storeName: string) {
    this.database = database;
    this.storeName = storeName;
  }

  private OpenTrans() : IDBObjectStore {
    return this.database.transaction(this.storeName, "readwrite").objectStore(this.storeName);
  }

  /**
   * Stores a value with a key
   * @param key The key to be used
   * @param value The value
   * @returns A promise
   */
  async Add(key: string, value: object | string | number) {
    this.OpenTrans().add(value, key);
  }

  /**
   * Gets a value of a specified key
   * @param key The key to get the value of
   * @returns The value of the key as type of T
   */
  async Get<T>(key: string) : Promise<T> {
    return new Promise<T>((resolve) => {
      const req = this.OpenTrans().get(key);
      req.onsuccess = () => {
        resolve(req.result as T);
      };
    });
  }

  /**
   * Returns all values in a object store, optional limited to a specific key
   * @param key Optional. Key to get all entires of
   * @returns A array of all values as type of T[]
   */
  async GetAll<T = []>(key?: string) : Promise<T> {
    return new Promise<T>((resolve) => {
      const req = this.OpenTrans().getAll(key);
      req.onsuccess = () => {
        resolve(req.result as T);
      };
    });
  }

  /**
   * Gets all keys within a object store
   * @returns A array of strings containing all keys
   */
  async GetAllKeys() : Promise<string[]> {
    return new Promise<string[]>((resolve) => {
      const req = this.OpenTrans().getAllKeys();
      req.onsuccess = () => {
        resolve(req.result as string[]);
      }
    });
  }

  /**
   * Update the value of a key asynchronously
   * @param key Key to update value of
   * @param value Value to update the current value with
   */
  async Update(key: string, value: object | string | number) {
    this.OpenTrans().put(value, key);
  }

  /**
   * Remove a key along with it's value asynchronously
   * @param key Key to be removed
   * @returns True if success, otherwise false
   */
  async Remove(key: string) : Promise<boolean> {
    return new Promise((resolve) => {
      const req = this.OpenTrans().delete(key);
      req.onsuccess = () => {
        resolve(!req.result);
      }
    });
  }

  /**
   * Clears all keys (and values) from a object store
   * @returns True if success, otherwise false
   */
  async Clear() : Promise<boolean> {
    return new Promise((resolve) => {
      const req = this.OpenTrans().clear();
      req.onsuccess = () => {
        resolve(!req.result);
      }
    });
  }

  /**
   * Counts all keys or just the specified key
   * @param key Optional. Key to count
   * @returns A number representing the number count of the key or the total number of keys
   */
  async Count(key?: string) : Promise<number> {
    return new Promise((resolve) => {
      const req = this.OpenTrans().count(key);
      req.onsuccess = () => {
        resolve(req.result);
      }
    });
  }

  /**
   * Checks if the current store contains the specified key
   * @param key Key to check if the store contains
   * @returns True if the key exsists else false
   */
  async Contains(key: string) : Promise<boolean> {
    return new Promise((resolve) => {
      const req = this.OpenTrans().get(key);
      req.onsuccess = () => {
        resolve(req.result !== undefined);
      }
    });
  }
}
