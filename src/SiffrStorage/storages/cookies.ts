import Storage from './storage';
import { StorageOptions } from './types';

const date = new Date(0).toUTCString();
const equal = '%3D',
  equalRegex = new RegExp(equal, 'g');

class Cookies extends Storage {
  constructor(options: StorageOptions) {
    super(options);
    return (this.constructor as typeof Cookies)._matchingInstance<Cookies>(this);
  }

  protected upsert(data: object) {
    for (let key in data) {
      this.setStore(
        `${this.tableName}/${key}=${(this.constructor as typeof Storage)
          .stringify((data as {[key: string]: any})[key])
          .replace(/=/g, equal)}; path=/`
      );
    }
    return true;
  }

  protected delete(keys: string[]) {
    keys.forEach((k: any) => this.setStore(`${this.tableName}/${k}=; expires=${date}; path=/`));
    return true;
  }

  protected deleteAll() {
    this.keys().then((v) => this.delete.bind(v));
    return true;
  }

  protected getStore() {
    let result = document.cookie,
      ans = {} as {[key: string]: any};
    result.split('; ').forEach(value => {
      let [k, v] = value.split('=');
      if (k.indexOf(this.tableName) === 0)
        ans[k.slice(this.tableName.length + 1)] = (this.constructor as typeof Storage).parse(
          v.replace(equalRegex, '=')
        );
    });
    return ans;
  }

  protected setStore(v: string) {
    document.cookie = v;
  }

  protected hasStore() {
    return typeof document.cookie !== 'undefined';
  }

  static get type() {
    return 'cookies';
  }
}

export default Cookies;
