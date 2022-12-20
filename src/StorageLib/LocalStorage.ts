/**
 * Simple class for maintaining a List in LocalStorage. Keeps LocalStorage upto date. Including async calls
 */
export class LocalStorageList<T> {
  private key: string;
  private item: T[];

  constructor(key: string) {
    this.key = key;
    if (LocalStorage.Contains(key)) {
      this.item = LocalStorage.GetItem<T[]>(key, true);
    }
    else {
      LocalStorage.SetItem(key, [] as T[]);
      this.item = [] as T[];
    }
  }

  /**
   * Gets a item from the LocalStorageList
   * @param index Index within the list
   * @returns A item with type of T
   */
  GetItem(index: number) : T {
    return this.item[index];
  }

  /**
   * Sets a item in the LocalStorageList
   * @param value The item to add to the list
   */
  SetItem(value: T) {
    this.item.push(value);
    LocalStorage.SetItem(this.key, this.item);
  }

  /**
   * Deletes a item in the LocalStorageList
   * @param value Value within the list to be removed
   */
  DelItem(value: T) {
    const index = this.item.indexOf(value);
    if (index === -1) return;
    this.item.splice(index, 1);
  }

  /**
   * Checks for a item of type T in the LocalStorageList
   * @param value Item to check for in the LocalStorageList
   * @returns True if found, otherwise False
   */
  Contains(value: T) : boolean {
    return this.item.includes(value);
  }

  GetAll() : T[] {
    return this.item;
  }
}


/**
 * Wrapper around window.localStorage, includes async variants
 */
export class LocalStorage {

  /**
   * Get a item by it's key from LocalStorage
   * @param key Key to retreive value of
   * @param decodeJson This entry is stored as json?
   * @returns Value of type T
   */
  static GetItem<T>(key: string, decodeJson: boolean = false) : T {
    if (decodeJson) return JSON.parse(window.localStorage.getItem(key) as string) as T;
    return window.localStorage.getItem(key) as T;
  }

  /**
   * Get a item by it's key from LocalStorage asynchronously
   * @param key Key to retreive value of
   * @param decodeJson This entry is stored as json?
   * @returns Value of type T
   */
  static async GetItemAsync<T>(key: string, decodeJson: boolean = false) : Promise<T> {
    return this.GetItem<T>(key, decodeJson);
  }

  /**
   * Set a item by it's key in LocalStorage
   * @param key Key to set store alongside value
   * @param value The keys value
   */
  static SetItem(key: string, value: string | object) {
    if (typeof value === "object") window.localStorage.setItem(key, JSON.stringify(value));
    else window.localStorage.setItem(key, value);
  }

  /**
   * Set a item by it's key in LocalStorage asynchronously
   * @param key Key to set store alongside value
   * @param value The keys value
   */
  static async SetItemAsync(key: string, value: string | object) {
    this.SetItem(key, value);
  }

  /**
   * Removes a item from LocalStorage
   * @param key Key to remove
   */
  static RemoveItem(key: string) {
    window.localStorage.removeItem(key);
  }

  /**
   * Removes a item form LocalStorage asynchronously
   * @param key Key to remove
   */
  static async RemoveItemAsync(key: string) {
    this.RemoveItem(key);
  }

  /**
   * Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs.
   * @param index nth key
   * @returns A string if the index is within range otherwise null
   */
  static Key(index: number) : string | null {
    return window.localStorage.key(index);
  }

  /**
   * Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs. Asynchronously
   * @param index nth key
   * @returns A string if the index is within range otherwise null
   */
  static async KeyAsync(index: number) : Promise<string | null> {
    return this.Key(index);
  }

  /**
   * Clears all keys from LocalStorage
   */
  static Clear() {
    window.localStorage.clear();
  }

  /**
   * Clears all keys from LocalStorage asynchronously
   */
  static async ClearAsync() {
    this.Clear();
  }

  /**
   * Checks if localStorage contains the provided key
   * @param key The key to check for
   * @returns True if found otherwise False
   */
  static Contains(key: string) : boolean {
    return window.localStorage.getItem(key) !== null;
  }

  /**
   * Checks if localStorage contains the provided key asynchronously
   * @param key The key to check for
   * @returns True if found otherwise False
   */
  static async ContainsAsync(key: string) : Promise<boolean> {
    return this.Contains(key);
  }
}
