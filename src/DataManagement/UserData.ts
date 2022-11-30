import { LocalStorage } from "StorageLib/LocalStorage";
import { RSAMemoryKeyPair } from "NSLib/NCEncrytUtil";

/**
 * Wrapper to handle User data at runtime
 */
export default class UserData {
  static set KeyPair(pair: RSAMemoryKeyPair) {
    LocalStorage.SetItem("Keypair", pair);
  }

  static get KeyPair() : RSAMemoryKeyPair {
    return LocalStorage.GetItem<RSAMemoryKeyPair>("Keypair", true);
  }

  static set Username(u: string) {
    LocalStorage.SetItem("Username", u);
  }

  static get Username() : string {
    return LocalStorage.GetItem<string>("Username");
  }

  static set Discriminator(dis: string) {
    LocalStorage.SetItem("Discriminator", dis);
  }

  static get Discriminator() : string {
    return LocalStorage.GetItem<string>("Discriminator");
  }

  static set AvatarSrc(src: string) {
    LocalStorage.SetItem("AvatarSrc", src);
  }

  static get AvatarSrc() : string {
    return LocalStorage.GetItem<string>("AvatarSrc");
  }

  static set Email(email: string) {
    LocalStorage.SetItem("Email", email);
  }

  static get Email() : string {
    return LocalStorage.GetItem<string>("Email");
  }

  static set Uuid(uuid: string) {
    LocalStorage.SetItem("UUID", uuid);
  }

  static get Uuid() : string {
    return LocalStorage.GetItem<string>("UUID");
  }

  static set Token(token: string) {
    LocalStorage.SetItem("Token", token);
  }

  static get Token() : string {
    return LocalStorage.GetItem<string>("Token");
  }
}
