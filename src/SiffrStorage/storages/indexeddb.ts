import Storage from './storage';
import { StorageOptions } from './types';

class IndexedDB extends Storage {
  private store: any;

  constructor(options: StorageOptions) {
    super(options);
    return (this.constructor as typeof IndexedDB)._matchingInstance<IndexedDB>(this);
  }

  protected select(keys: string[]) {
    const ans = {} as {[key: string]: any};
    const promises = [] as any[];
    keys.forEach((key: string | number) =>
      promises.push(this._tx('readonly', 'get', key, "").then((r: any) => (ans[key] = r)))
    );
    return Promise.all(promises).then(() => ans);
  }

  protected upsert(data: object) {
    const promises = [] as any;
    for (let key in (data as {[key: string]: any})) promises.push(this._tx('readwrite', 'put', (data as {[key: string]: any})[key], key));
    return Promise.all(promises).then(() => true);
  }

  protected delete(keys: string[]) {
    const promises = [] as  any;
    keys.forEach((key: any) => promises.push(this._tx('readwrite', 'delete', key, "")));
    return Promise.all(promises).then(() => true);
  }

  protected deleteAll() {
    return this._tx('readwrite', 'clear', undefined, "");
  }

  private _tx(scope: string, fn: string, param1: any, param2: string) {
    const me = this;
    this.store = this.store || this.createStore(me.tableName);
    return this.store.then(
      (db: {
        transaction: (arg0: string, arg1: any) => { objectStore: (arg0: string) => {[key: string]: any} };
      }) => {
        return new Promise((resolve, reject) => {
          const tx = db.transaction(me.tableName, scope).objectStore(me.tableName);
          const request = tx[fn].call(tx, param1, param2);
          request.onsuccess = (event: { target: { result: unknown } }) =>
            resolve(event.target.result);
          request.onerror = (event: { error: any }) => reject(event.error);
        });
      }
    );
  }

  protected getStore() {
    return this._tx('readonly', 'getAllKeys', undefined, "").then(this.select.bind(this));
  }

  private createStore(table: string) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(table, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(table);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  protected hasStore() {
    return !!window.indexedDB;
  }

  static get type() {
    return 'indexeddb';
  }
}

export default IndexedDB;
