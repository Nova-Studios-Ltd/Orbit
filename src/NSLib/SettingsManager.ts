import UserData from "../DataTypes/UserData";
import { Dictionary } from "./Dictionary";

const Storage = require('@sifrr/storage');

export class SettingsManager {
    private SettingsStorage: any;
    private Keystore: any;
    private Operational: Dictionary<number | string | boolean>;
    User: UserData;

    constructor() {
        const settings = {
            priority: ["indexeddb"],
            name: "Settings_",
            version: 1,
            description: "User Settings",
            size: 10 * 1024 * 1024,
            ttl: 0
        };
        const keystore = {
            priority: ["indexeddb"],
            name: "Keystore_",
            version: 1,
            description: "User pub keystore",
            size: 10 * 1024 * 1024,
            ttl: 0
        }
        this.SettingsStorage = Storage.Sifrr.Storage.getStorage(settings);
        this.Keystore = Storage.Sifrr.Storage.getStorage(keystore);
        this.Operational = new Dictionary<number | string | boolean>();
        this.User = new UserData();
    }

    // Keystore
    async ContainsKey(user_uuid: string) : Promise<boolean> {
        return (await this.Keystore.get(user_uuid))[user_uuid] !== undefined;
    }

    async WriteKey(user_uuid: string, pubKey: string) : Promise<boolean> {
        return this.Keystore.set(user_uuid, pubKey);
    }

    async ReadKey(user_uuid: string) : Promise<string> {
        return (await this.Keystore.get(user_uuid)) as string;
    }

    async ClearKey(user_uuid: string) : Promise<boolean> {
        return (await this.Keystore.del(user_uuid));
    }

    // Settings
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
        return (await this.SettingsStorage.clear() && await this.Keystore.clear());
    }

    async ReadConst<T>(key: string) : Promise<T> {
        return this.Operational.getValue(key) as unknown as T;
    }

    async WriteConst(key: string, value: string | number | boolean) {
        this.Operational.setValue(key, value);
    }
}