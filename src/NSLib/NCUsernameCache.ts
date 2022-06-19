import { getStorage } from "SiffrStorage/sifrr.storage";

export class NCUsernameCache {
  CurrentCache: any;

  constructor() {
    const cache = {
      priority: ["indexeddb"],
      name: `Cache_Usernames`,
      version: 1,
      description: "User Cache",
      size: 10 * 1024 * 1024,
      ttl: 0
    }
    this.CurrentCache = getStorage(cache);
  }
}
