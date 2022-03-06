import UserData from "../DataTypes/UserData";
import { Dictionary, KeyValuePair } from "./Dictionary";

const Storage = require('@sifrr/storage');

export class SettingsManager {
    private SettingsStorage: any;
    private Keystore: any;
    private Cookies: any;
    private Operational: Dictionary<number | string | boolean>;
    private _User: UserData;

    constructor() {
        const settings = {
            priority: ["localstorage"],
            name: "Settings",
        };
        const keystore = {
            priority: ["indexeddb"],
            name: "Keystore_",
            version: 1,
            description: "User pub keystore",
            size: 10 * 1024 * 1024,
            ttl: 0
        }
        const cookies = {
            priority: ["cookies"],
            name: "NSCookies"
        }
        this.Cookies = Storage.Sifrr.Storage.getStorage(cookies);
        this.SettingsStorage = Storage.Sifrr.Storage.getStorage(settings);
        this.Keystore = Storage.Sifrr.Storage.getStorage(keystore);
        this.Operational = new Dictionary<number | string | boolean>();
        this._User = new UserData();
    }

    get User() : UserData {
        return this._User;
    }

    set User(user: UserData) {
        this._User = user;
    }

    // Cookies
    async WriteCookie(key: string, value: string) : Promise<boolean> {
        return this.Cookies.set(key, value);
    }

    async ReadCookie(key: string) : Promise<string> {
        return (await this.Cookies.get(key)) as string;
    }

    async ContainsCookie(key: string) : Promise<boolean> {
        return (await this.Cookies.get(key))[key] !== undefined;
    }

    async ClearCookie(key: string) : Promise<boolean> {
        return (await this.Cookies.del(key));
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

    async LoadKeys(keys: Dictionary<string>) {
        keys.forEach((pair: KeyValuePair<string>) => {
            this.WriteKey(pair.Key, pair.Value);
        });
    }

    async ClearKeys() {
        this.Keystore.clear();
    }

    // Settings
    async ContainsLocalStorage(key: string) : Promise<boolean> {
        return (await this.SettingsStorage.get(key))[key] !== undefined;
    }

    DeleteLocalStorage(key: string) : boolean {
        return this.SettingsStorage.del(key)
    }

    async ReadLocalStorage<T>(key: string) : Promise<T> {
        return (await this.SettingsStorage.get(key)) as unknown as T;
    }

    async WriteLocalStorage(key: string, value: number | string | boolean) : Promise<boolean> {
        return this.SettingsStorage.set(key, value);
    }

    async ClearLocalStorage() : Promise<boolean> {
        return (await this.SettingsStorage.clear() && await this.Keystore.clear());
    }

    // Runtime constant info
    async ReadConst<T>(key: string) : Promise<T> {
        return this.Operational.getValue(key) as unknown as T;
    }

    async WriteConst(key: string, value: string | number | boolean) {
        this.Operational.setValue(key, value);
    }
}