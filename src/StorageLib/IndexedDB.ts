import { NSPerformace } from "NSLib/NSPerformace";
import { IndexedDBStore } from "./IndexedDBStore";
import { LocalStorageList } from "./LocalStorage";

/**
 * Custom wrapper class for indexeddb, including a workaround for firefoxes missing 'indexeddb.databases()' function
 */
export class IndexedDB {
  private database: IDBDatabase | undefined;

  // For now rely on Siffr localStorage wrapper for storing the databases (Will rebuild this myself later, ~sigh~)
  private databases: LocalStorageList<string> | undefined;

  /**
   * Opens or creates a new database with the given name and version
   * @param databaseName Name of the database
   * @param ready A optional callback when the database reports a success
   * @param version A optional version number must be a integer
   */
  constructor(databaseName: string, ready?: (indexeddb: IndexedDB) => void, version?: number) {
    if (!IndexedDB.HasDatabasesFunc()) {
      this.databases = new LocalStorageList<string>("Databases");
    }

    if (IndexedDB.HasIndexedDB()) {
      const request = window.indexedDB.open(databaseName, version || undefined);
      request.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
        if (!IndexedDB.HasDatabasesFunc() && this.databases !== undefined) {
          // Track databases in localStorage, only for firefox or other browsers not supporting 'indexeddb.databases()'
          this.databases.SetItem(databaseName);
        }
      };
      request.onsuccess = () => {
        this.database = request.result;
        if (ready) ready(this);
      };
      request.onerror = () => {
        if (!IndexedDB.HasDatabasesFunc() && this.databases !== undefined) {
          // Track databases in localStorage, only for firefox or other browsers not supporting 'indexeddb.databases()'
          this.databases.DelItem(databaseName);
        }
        throw new Error("Database error");
      };
    }
  }

  /**
   * Opens or creates a indexeddb database
   * @param databaseName Name of the database
   * @param version A optional version number must be a integer
   * @returns A IndexedDB Object
   */
  static async Open(databaseName: string, version?: number) : Promise<IndexedDB> {
    return new Promise((resolve) => {
      const perf = new NSPerformace("OpenDatabase");
      new IndexedDB(databaseName, (db: IndexedDB) => {
        perf.Stop();
        resolve(db);
      });
    });
  }


  /**
   * Creates a new object store with the provided name
   * @param storeName Store name
   * @returns A IndexedDBStore
   */
  async CreateStore(storeName: string) : Promise<IndexedDBStore | undefined> {
    if (this.database === undefined) return undefined;
    // I hate Indexeddb
    const name = this.database.name;
    const version = this.database.version;

    const stores = await this.GetAllStoresAsync();
    if (stores.includes(storeName)) return await this.GetStore(storeName);

    this.database.close();

    return new Promise((resolve) => {
      const request = window.indexedDB.open(name, version + 1);
      request.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
        request.result.createObjectStore(storeName);
        request.result.close();
        const newRequest = window.indexedDB.open(name, version + 1);
        newRequest.onsuccess = () => {
          this.database = newRequest.result;
          resolve(this.GetStore(storeName));
        }
      };
    });
  }

  /**
   * Gets object store with the provided name, and starts a readwrite transaction
   * @param storeName Store name
   * @returns A IndexedDBStore
   */
  GetStore(storeName: string) : IndexedDBStore | undefined {
    if (this.database === undefined) return undefined;
    return new IndexedDBStore(this.database, storeName);
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
  async DeleteStore(storeName: string){
    if (this.database === undefined) return;
    // I hate Indexeddb
    const name = this.database.name;
    const version = this.database.version;

    this.database.close();

    const request = window.indexedDB.open(name, version + 1);
    request.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
      this.database = request.result;
      request.result.deleteObjectStore(storeName);
    }
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
   * Closes the open database
   */
  async Close() {
    if (this.database === undefined) return;
    this.database.close();
    this.database = undefined;
  }

  /**
   * Deletes a database from indexeddb
   * @param databaseName Database name
   */
  static DeleteDatabase(databaseName: string) {
    if (!this.HasDatabasesFunc()) {
      new LocalStorageList<string>("Databases").DelItem(databaseName);
    }
    window.indexedDB.deleteDatabase(databaseName);
  }

  /**
   * Deletes a database from indexeddb asynchronously
   * @param databaseName Database name
   */
  static async DeleteDatabaseAsync(databaseName: string) : Promise<void> {
    return Promise.resolve(this.DeleteDatabase(databaseName));
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
      return new LocalStorageList<string>("Databases").GetAll();
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
