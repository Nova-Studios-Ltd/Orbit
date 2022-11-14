import { getStorage, Storage } from "SiffrStorage/sifrr.storage";

/**
 * A wrapper around the IDBObjectStore interface
 */
export class IndexedDBStore {
  private store: IDBObjectStore;

  constructor(store: IDBObjectStore) {
    this.store = store;
  }

  /**
   * Stores a value with a key
   * @param key The key to be used
   * @param value The value
   */
  Add(key: string, value: object | string | number) {
    this.store.add(value, key);
  }

  /**
   * Stores a value with a key asynchronously
   * @param key The key to be used
   * @param value The value
   * @returns A promise
   */
  async AddAsync(key: string, value: object | string | number) : Promise<void> {
    return Promise.resolve(this.Add(key, value));
  }

  /**
   * Gets a value of a specified key
   * @param key The key to get the value of
   * @returns The value of the key as type of T
   */
  Get<T>(key: string) : T {
    return this.store.get(key).result as T;
  }

  /**
   * Gets a value of a specified key asynchronously
   * @param key The key to get the value of
   * @returns The value of the key as type of T
   */
  async GetAsync<T>(key: string) : Promise<T> {
    return Promise.resolve<T>(this.Get(key));
  }

  /**
   * Returns all values in a object store, optional limited to a specific key
   * @param key Optional. Key to get all entires of
   * @returns A array of all values as type of T[]
   */
  GetAll<T = []>(key?: string) : T[] {
    return this.store.getAll(key).result as T[];
  }

  /**
   * Returns all values in a object store, optional limited to a specific key asynchronously
   * @param key Optional. Key to get all entires of
   * @returns A array of all values as type of T[]
   */
  async GetAllAsync<T = []>(key?: string) : Promise<T[]> {
    return Promise.resolve(this.GetAll(key));
  }

  /**
   * Gets all keys within a object store
   * @returns A array of strings containing all keys
   */
  GetAllKeys() : string[] {
    return this.store.getAllKeys().result as string[];
  }

  /**
   * Gets all keys within a object store asynchronously
   * @returns A array of strings containing all keys
   */
  async GetAllKeysAsync() : Promise<string[]> {
    return Promise.resolve(this.GetAllKeys());
  }

  /**
   * Update the value of a key
   * @param key Key to update value of
   * @param value Value to update the current value with
   */
  Update(key: string, value: object | string | number) {
    this.store.put(value, key);
  }

  /**
   * Update the value of a key asynchronously
   * @param key Key to update value of
   * @param value Value to update the current value with
   */
  async UpdateAsync(key: string, value: object | string | number) : Promise<void> {
    return Promise.resolve(this.Update(key, value));
  }

  /**
   * Remove a key along with it's value
   * @param key Key to be removed
   * @returns True if success, otherwise false
   */
  Remove(key: string) : boolean {
    return !this.store.delete(key);
  }

  /**
   * Remove a key along with it's value asynchronously
   * @param key Key to be removed
   * @returns True if success, otherwise false
   */
  async RemoveAsync(key: string) : Promise<boolean> {
    return Promise.resolve<boolean>(this.Remove(key));
  }

  /**
   * Clears all keys (and values) from a object store
   * @returns True if success, otherwise false
   */
  Clear() : boolean {
    return !this.store.clear();
  }

  /**
   * Clears all keys (and values) from a object store asynchronously
   * @returns True if success, otherwise false
   */
  async ClearAsync() : Promise<boolean> {
    return Promise.resolve(this.Clear());
  }

  /**
   * Counts all keys or just the specified key
   * @param key Optional. Key to count
   * @returns A number representing the number count of the key or the total number of keys
   */
  Count(key?: string) : number {
    return this.store.count(key).result;
  }

  /**
   * Counts all keys or just the specified key asynchronously
   * @param key Optional. Key to count
   * @returns A number representing the number count of the key or the total number of keys
   */
  async CountAsync(key?: string) : Promise<number> {
    return Promise.resolve(this.Count(key));
  }
}




/**
 * Custom wrapper class for indexeddb, including a workaround for firefoxes missing 'indexeddb.databases()' function
 */
export class IndexedDB {
  private database: IDBDatabase | undefined;

  // For now rely on Siffr localStorage wrapper for storing the databases (Will rebuild this myself later, ~sigh~)
  private databases: Storage | undefined;

  /**
   * Opens or creates a new database with the given name and version
   * @param databaseName Name of the database
   * @param version A optional version number must be a integer
   */
  constructor(databaseName: string, version?: number) {
    if (!IndexedDB.HasDatabasesFunc()) {
      this.databases = getStorage({ priority: ["localstorage"], name: "Databases" });
    }

    if (IndexedDB.HasIndexedDB()) {
      const request = window.indexedDB.open(databaseName, version || 1);
      request.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
        if (!IndexedDB.HasDatabasesFunc() && this.databases !== undefined) {
          // Track databases in localStorage, only for firefox or other browsers not supporting 'indexeddb.databases()'
          this.databases.set(databaseName, "1");
        }
      };
      request.onsuccess = () => {
        this.database = request.result;
      };
      request.onerror = () => {
        if (!IndexedDB.HasDatabasesFunc() && this.databases !== undefined) {
          // Track databases in localStorage, only for firefox or other browsers not supporting 'indexeddb.databases()'
          this.databases.del(databaseName);
        }
      };
    }
  }

  /**
   * Creates a new object store with the provided name, and starts a readwrite transaction
   * @param storeName Store name
   * @returns A IndexedDBStore
   */
  CreateStore(storeName: string) : IndexedDBStore | undefined {
    if (this.database === undefined) return undefined;
    this.database.createObjectStore(storeName);
    return new IndexedDBStore(this.database.transaction(storeName, "readwrite").objectStore(storeName));
  }

  /**
   * Creates a new object store with the provided name, and starts a readwrite transaction asynchronously
   * @param storeName Store name
   * @returns A IndexedDBStore
   */
  async CreateStoreAsync(storeName: string) : Promise<IndexedDBStore | undefined> {
    return Promise.resolve(this.CreateStore(storeName));
  }

  /**
   * Gets object store with the provided name, and starts a readwrite transaction
   * @param storeName Store name
   * @returns A IndexedDBStore
   */
  GetStore(storeName: string) : IndexedDBStore | undefined {
    if (this.database === undefined) return undefined;
    return new IndexedDBStore(this.database.transaction(storeName, "readwrite").objectStore(storeName));
  }

  /**
   * Gets object store with the provided name, and starts a readwrite transaction asynchronously
   * @param storeName Store name
   * @returns A IndexedDBStore
   */
  async GetStoreAsync(storeName: string) : Promise<IndexedDBStore | undefined> {
    return Promise.resolve(this.GetStore(storeName));
  }

  /**
   * Deletes a object store with the provided name
   * @param storeName Store name
   */
  DeleteStore(storeName: string) {
    if (this.database === undefined) return;
    this.database.deleteObjectStore(storeName);
  }

  /**
   * Deletes a object store with the provided name asynchronously
   * @param storeName Store name
   */
  async DeleteStoreAsync(storeName: string) : Promise<void> {
    return Promise.resolve(this.DeleteStore(storeName));
  }

  /**
   * Gets all current stores within a database
   * @returns A array of strings
   */
  GetAllStores() : string[] {
    if (this.database === undefined) return [] as string[];
    const stores = [] as string[];
    for (let i = 0; i < this.database.objectStoreNames.length; i++) {
      stores.push(this.database.objectStoreNames.item(i) as string)
    }
    return stores;
  }

  /**
   * Gets all current stores within a database asynchronously
   * @returns A array of strings
   */
  async GetAllStoresAsync() : Promise<string[]> {
    return Promise.resolve(this.GetAllStores());
  }

  /**
   * Request a list of all current database names
   * @returns All current databases
   */
  static async Databases() : Promise<string[]> {
    if (IndexedDB.HasDatabasesFunc()) {
      return (await indexedDB.databases()).flatMap((c) => {
        if (c.name !== undefined) return c.name;
        return "";
      });
    }
    else {
      const storage = getStorage({ priority: ["localstorage"], name: "Databases" });
      return (await storage.keys() as string[]);
    }
  }

  /**
   * Checks for indexeddb support
   * @returns True if current enviroment supports indexeddb otherwise false
   */
  static HasIndexedDB() : boolean {
    return window.indexedDB !== undefined;
  }

  /**
   * Checks for indexeddb.databases() support
   * @returns True if current enviroment supports indexeddb.databases() otherwise false
   */
  static HasDatabasesFunc() : boolean {
    return this.HasIndexedDB() && window.indexedDB.databases !== undefined;
  }
}
