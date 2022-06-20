import IUserData from "Interfaces/IUserData";
import { GETUser } from "./APIEvents";
import { Dictionary } from "./Dictionary";

/**
 * A Self managed object for storing userdata in memory to prevent rerequesting it
 */
export class NCUserCache {
  CurrentCache: Dictionary<IUserData>;

  constructor() {
    this.CurrentCache = new Dictionary<IUserData>();
  }

  /**
   * Stores a users IUserData by there uuid automaticly
   * @param user IUserData containing user info
   */
  AddUser(user: IUserData) {
    this.CurrentCache.setValue(user.uuid, user);
  }

  /**
   * Retreives a users IUserData async, falls back to network request if user is not cached
   * @param user_uuid Users UUID to retreive data for
   * @returns IUserData containing the user or undefined if the user is not found
   */
  async GetUserAsync(user_uuid: string) : Promise<IUserData> {
    if (!this.CurrentCache.containsKey(user_uuid)) {
      const user = await GETUser(user_uuid);
      if (user !== undefined) {
        this.AddUser(user);
        return user;
      }
    }
    return this.CurrentCache.getValue(user_uuid);
  }

  GetUser(user_uuid: string) : IUserData | undefined {
    if (!this.CurrentCache.containsKey(user_uuid)) return undefined;
    return this.CurrentCache.getValue(user_uuid);
  }
}
