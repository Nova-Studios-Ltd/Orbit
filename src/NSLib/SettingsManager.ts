const Storage = require('@sifrr/storage');

export class SettingsManager {
    storage: any;
    constructor() {
        const opts = {
            priority: ["indexeddb"],
            name: "Settings_",
            version: 1,
            description: "User Settings Storage",
            size: 10 * 1024 * 1024,
            ttl: 0
        };
        this.storage = Storage.Sifrr.Storage.getStorage(opts);

    }

    async ConstainsSetting(key: string) : Promise<boolean> {
        return (await this.storage.get(key))[key] !== undefined;
    }

    DeleteSetting(key: string) : boolean {
        return this.storage.del(key)
    }

    async ReadSetting<T>(key: string) : Promise<T> {
        return (await this.storage.get(key)) as unknown as T;
    }

    WriteSetting(key: string, value: number | string | boolean) : boolean {
        return this.storage.set(key, value);
    }

    Clear() : boolean {
        return this.storage.clear();
    }
}