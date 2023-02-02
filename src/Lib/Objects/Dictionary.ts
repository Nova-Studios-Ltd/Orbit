/**
 * A indexable type with Key/Value
 */
export type Indexable<K extends keyof any, V> = {[key in K]: V};

/**
 * Interface for dictionary type objects
 */
export interface IDictionary<K extends keyof any, V> {
  _dict: Indexable<K, V>;
  getValue(key: K) : V;
  setValue(key: K, value: V) : void;
  empty() : void;
  clear(key: K) : boolean;
  containsKey(key: K) : boolean;
  forEach(callback: (pair: KeyValuePair<K, V>) => void) : void
}

/**
 * Represents a Key Value pair of a Dictionary
 */
export class KeyValuePair<K extends keyof any, V> {
  readonly Key: K;
  readonly Value: V;

  constructor(key: K, value: V) {
    this.Key = key;
    this.Value = value;
  }
}

/**
 * Dictionary object. Fully generic.
 */
export class Dictionary<K extends keyof any, V> implements IDictionary<K, V> {
  _dict: Indexable<K, V>;

  /**
   * Creates a new dictionary, can also inherit data from any object that implements IDictionary or is a Indexable
   * @param dict IDictionary or Indexable to inherit data from
   */
  constructor(dict?: IDictionary<K, V> | Indexable<K, V>) {
    this._dict = {} as Indexable<K, V>;
    if (dict !== undefined)
      if (dict instanceof Dictionary)
        dict.forEach((pair: KeyValuePair<K, V>) => {
          this._dict[pair.Key] = pair.Value;
        });
      else
        this._dict = dict as Indexable<K, V>;
  }

  toJSON() {
    return {_dict: this._dict};
  }

  /**
   * Loads a dictionary from JSON
   * @param json JSON containing a dictionary
   * @returns A new dictionary
   */
  static fromJSON<K extends keyof any, V>(json: string) : Dictionary<K, V> | undefined {
    const d = new Dictionary<K, V>();
    const dic = JSON.parse(json, (key: string, value: any) => {
      if (key !== "" && value._dict !== undefined)
        return Dictionary.fromJSON(JSON.stringify(value));
      return value;
    })._dict as Indexable<K, V>;
    if (dic === undefined) return undefined;
    d._dict = dic as Indexable<K, V>;
    return d;
  }

  /**
   * Gets a value from the dictionary using it's key
   * @param key Key with type of K
   * @returns The value of the Key
   */
  getValue(key: K) : V {
    return this._dict[key];
  }

  /**
   * Sets a value using it's key
   * @param key Key with type of K
   * @param value Value with type of V
   */
  setValue(key: K, value: V) : void {
    this._dict[key] = value;
  }

  /**
   * Empties the dictionary
   */
  empty() : void {
    this._dict = {} as Indexable<K, V>;
  }

  /**
   * Clears the value of a specific key
   * @param key The key of type K
   * @returns Always true
   */
  clear(key: K) : boolean {
    delete this._dict[key];
    return true;
  }

  /**
   * Checks if the dictionary contains a value at the given key
   * @param key Key of type K
   * @returns True if found, otherwise false
   */
  containsKey(key: K): boolean {
    return this._dict[key] !== undefined;
  }

  /**
   * Loops over all keys/values in the dictionary
   * @param callback A function with a passed KeyValuePair
   */
  forEach(callback: (pair: KeyValuePair<K, V>) => void): void {
    const keys = Object.keys(this._dict) as K[];
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      callback(new KeyValuePair<K, V>(key, this._dict[key]));
    }
  }

  /**
   * Gets all keys
   * @returns Array of type K
   */
  keys() : K[] {
    return Object.keys(this._dict) as K[];
  }

  /**
   * Gets all values
   * @returns Array of type V
   */
  values(): V[] {
    return Object.values(this._dict) as V[];
  }
}
