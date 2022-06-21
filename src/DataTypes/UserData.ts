import { FromBase64String, FromUint8Array } from "NSLib/Base64";
import { SettingsManager } from "NSLib/SettingsManager";
import { RSAMemoryKeyPair } from "../NSLib/NCEncrytUtil";

export default class UserData {
  Manager: SettingsManager;
  keyPair: RSAMemoryKeyPair;

  constructor(manager: SettingsManager) {
    this.Manager = manager;

    if (this.Manager.ContainsLocalStorageSync("Keypair"))
      this.keyPair = JSON.parse(FromUint8Array(FromBase64String(this.Manager.ReadLocalStorageSync<string>("Keypair")))) as RSAMemoryKeyPair;
    else
      this.keyPair = new RSAMemoryKeyPair("", "");
  }

  set username(u: string) {
    this.Manager.WriteCookieSync("Username", u);
  }

  get username() : string {
    return this.Manager.ReadCookieSync("Username");
  }

  set discriminator(dis: string) {
    this.Manager.WriteCookieSync("Discriminator", dis);
  }

  get discriminator() : string {
    return this.Manager.ReadCookieSync("Discriminator");
  }

  set avatarSrc(src: string) {
    this.Manager.WriteCookieSync("AvatarSrc", src);
  }

  get avatarSrc() : string {
    return this.Manager.ReadCookieSync("AvatarSrc");
  }

  set email(email: string) {
    this.Manager.WriteCookieSync("Email", email);
  }

  get email() : string {
    return this.Manager.ReadCookieSync("Email");
  }

  set uuid(uuid: string) {
    this.Manager.WriteLocalStorageSync("UUID", uuid);
  }

  get uuid() : string {
    return this.Manager.ReadLocalStorageSync("UUID");
  }

  set token(token: string) {
    this.Manager.WriteLocalStorageSync("Token", token);
  }

  get token() : string {
    return this.Manager.ReadLocalStorageSync("Token");
  }
}
