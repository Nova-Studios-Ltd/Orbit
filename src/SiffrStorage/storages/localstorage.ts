import Storage from './storage';
import { StorageOptions } from './types';

class LocalStorage extends Storage {
  constructor(options: StorageOptions) {
    super(options);
    return (this.constructor as typeof LocalStorage)._matchingInstance(this);
  }

  protected select(keys: string[]) {
    const table = {} as {[key: string]: any};
    keys.forEach((k: string) => {
      const v = (this.constructor as typeof LocalStorage).parse(
        this.getLocalStorage().getItem(this.tableName + '/' + k) as string
      );
      if (v !== null) table[k] = v;
    });
    return table;
  }

  protected upsert(data: { [x: string]: any }) {
    for (const key in data) {
      this.getLocalStorage().setItem(
        this.tableName + '/' + key,
        (this.constructor as typeof LocalStorage).stringify(data[key])
      );
    }
    return true;
  }

  protected delete(keys: string[]) {
    keys.map((k: string) => this.getLocalStorage().removeItem(this.tableName + '/' + k));
    return true;
  }

  protected deleteAll() {
    Object.keys(this.getLocalStorage()).forEach(k => {
      if (k.indexOf(this.tableName) === 0) this.getLocalStorage().removeItem(k);
    });
    return true;
  }

  protected getStore() {
    return this.select(
      Object.keys(this.getLocalStorage())
        .map(k => {
          if (k.indexOf(this.tableName) === 0) return k.slice(this.tableName.length + 1);
          return undefined;
        })
        .filter(k => typeof k !== 'undefined') as string[]
    );
  }

  private getLocalStorage() {
    return window.localStorage;
  }

  protected hasStore() {
    return !!window.localStorage;
  }

  static get type() {
    return 'localstorage';
  }
}

export default LocalStorage;
