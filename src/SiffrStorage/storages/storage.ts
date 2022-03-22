import { stringify, parse } from '../utils/json';
import { parseGetData, parseKey, parseSetData } from '../utils/dataparser';
import { StorageOptions, SavedDataObject } from './types';

const defaultOptions: StorageOptions = {
  name: 'SifrrStorage',
  version: 1,
  description: 'Sifrr Storage',
  size: 5 * 1024 * 1024,
  ttl: 0
};

abstract class Storage {
  static type: string;

  type: string = (<typeof Storage>this.constructor).type;

  name: string;
  version: string | number;
  ttl: number;
  description: string;
  size: number;

  tableName: string;
  private table = {};

  constructor(options: StorageOptions = defaultOptions) {
    this.name = options.name || "";
    this.version = options.version || "";
    this.ttl = options.ttl || 0;
    this.description = options.description || "";
    this.size = options.size || 0;

    Object.assign(this, defaultOptions, options);
    this.tableName = this.name + this.version;
  }

  // overwrited methods
  protected select(keys: string[]): SavedDataObject | Promise<SavedDataObject> {
    const table = this.getStore();
    const ans = {} as {[key: string] : any}
    keys.forEach(key => (ans[key] = (table as SavedDataObject)[key]));
    return ans;
  }

  protected upsert(data: { [x: string]: any }): boolean | Promise<boolean> {
    const table = this.getStore();
    for (let key in data) {
      (table as SavedDataObject)[key] = data[key];
    }
    this.setStore(table);
    return true;
  }

  protected delete(keys: string[]): boolean | Promise<boolean> {
    const table = this.getStore();
    keys.forEach(key => delete (table as SavedDataObject)[key]);
    this.setStore(table);
    return true;
  }

  protected deleteAll(): boolean | Promise<boolean> {
    this.setStore({});
    return true;
  }

  protected getStore(): SavedDataObject | Promise<SavedDataObject> {
    return this.table;
  }

  protected setStore(v: {}) {
    this.table = v;
  }

  keys() : Promise<object> {
    return Promise.resolve(this.getStore()).then(d => Object.keys(d));
  }

  all() : Promise<object> {
    return Promise.resolve(this.getStore()).then(d => parseGetData(d, this.del.bind(this)));
  }

  get(key: string) : Promise<object> {
    return Promise.resolve(this.select(parseKey(key))).then(d =>
      parseGetData(d, this.del.bind(this))
    );
  }

  set(key: string | object, value: any) {
    return Promise.resolve(this.upsert(parseSetData(key, value, this.ttl)));
  }

  del(key: string | string[]) {
    return Promise.resolve(this.delete(parseKey(key)));
  }

  clear() {
    return Promise.resolve(this.deleteAll());
  }

  getSync(key: string) : object {
    const d = (this.select(parseKey(key)) as SavedDataObject)
    return parseGetData(d, this.del.bind(this));
  }

  setSync(key: string | object, value: any) {
    return this.upsert((parseSetData(key, value, this.ttl))) as boolean;
  }

  /*memoize(
    func: (...arg: any[]) => Promise<any>,
    keyFunc = (...arg: any[]) => (typeof arg[0] === 'string' ? arg[0] : stringify(arg[0]))
  ) {
    return (...args: any) => {
      const key = keyFunc(...args);
      return this.get(key).then(data => {
        if (data[key] === undefined || data[key] === null) {
          const resultPromise = func(...args);
          if (!(resultPromise instanceof Promise))
            throw Error('Only promise returning functions can be memoized');
          return resultPromise.then(v => {
            return this.set(key, v).then(() => v);
          });
        } else {
          return data[key];
        }
      });
    };
  }*/

  isSupported(force = true) {
    if (force && (typeof window === 'undefined' || typeof document === 'undefined')) {
      return true;
    } else if (window && this.hasStore()) {
      return true;
    } else {
      return false;
    }
  }

  protected hasStore() {
    return true;
  }

  protected isEqual(other: { tableName: string; type: string }) {
    if (this.tableName == other.tableName && this.type == other.type) {
      return true;
    } else {
      return false;
    }
  }

  // aliases
  protected static stringify(data: any) {
    return stringify(data);
  }

  protected static parse(data: string) {
    return parse(data);
  }

  // one instance per store
  protected static _all: Array<Storage>;
  protected static _add(instance: Storage) {
    this._all = this._all || [];
    this._all.push(instance);
  }

  protected static _matchingInstance<T extends Storage>(otherInstance: Storage): T {
    const all = this._all || [],
      length = all.length;
    for (let i = 0; i < length; i++) {
      if (all[i].isEqual(otherInstance)) return <T>all[i];
    }
    this._add(otherInstance);
    return <T>otherInstance;
  }
}

export default Storage;
