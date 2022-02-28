import UserData from "../DataTypes/UserData";
import { Dictionary } from "./Dictionary";

const Storage = require('@sifrr/storage');

export class SettingsManager {
    private SettingsStorage: any;
    private Operational: Dictionary<number | string | boolean>;
    User: UserData;

    constructor() {
        const opts = {
            priority: ["indexeddb"],
            name: "Settings_",
            version: 1,
            description: "User Settings S",
            size: 10 * 1024 * 1024,
            ttl: 0
        };
        this.SettingsStorage = Storage.Sifrr.Storage.getStorage(opts);
        this.Operational = new Dictionary<number | string | boolean>();
        this.User = new UserData();
    }

    async ConstainsSetting(key: string) : Promise<boolean> {
        return (await this.SettingsStorage.get(key))[key] !== undefined;
    }

    DeleteSetting(key: string) : boolean {
        return this.SettingsStorage.del(key)
    }

    async ReadSetting<T>(key: string) : Promise<T> {
        return (await this.SettingsStorage.get(key)) as unknown as T;
    }

    async WriteSetting(key: string, value: number | string | boolean) : Promise<boolean> {
        return this.SettingsStorage.set(key, value);
    }

    async Clear() : Promise<boolean> {
        return this.SettingsStorage.clear();
    }

    async ReadConst<T>(key: string) : Promise<T> {
        return this.Operational.getValue(key) as unknown as T;
    }

    async WriteConst(key: string, value: string | number | boolean) {
        this.Operational.setValue(key, value);
    }
}