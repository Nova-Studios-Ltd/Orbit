export class LocalStorage {

  /**
   * Get a item by it's key from LocalStorage
   * @param key Key to retreive value of
   * @returns Value of type T
   */
  static GetItem(key: string) : string {
    return window.localStorage.getItem(key) as string;
  }

  /**
   * Get a item by it's key from LocalStorage asynchronously
   * @param key Key to retreive value of
   * @returns Value of type T
   */
  static async GetItemAsync(key: string) : Promise<string> {
    return this.GetItem(key);
  }

  /**
   * Set a item by it's key in LocalStorage
   * @param key Key to set store alongside value
   * @param value The keys value
   */
  static SetItem(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }

  /**
   * Set a item by it's key in LocalStorage asynchronously
   * @param key Key to set store alongside value
   * @param value The keys value
   */
  static async SetItemAsync(key: string, value: string) {
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
}
