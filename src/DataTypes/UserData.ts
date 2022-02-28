import { Dictionary } from "../NSLib/Dictionary";
import { RSAMemoryKeyPair } from "../NSLib/NCEncrytUtil";

export default class UserData {
    username: string;
    uuid: string;
    token: string;
    keyPair: RSAMemoryKeyPair;
    keystore: Dictionary<string>;
    discriminator: string;
    avatarSrc: string;
  
    constructor() {
      this.username = "";
      this.uuid = "";
      this.token = "";
      this.discriminator = "";
      this.avatarSrc = "";
      this.keyPair = new RSAMemoryKeyPair("", "");
      this.keystore = new Dictionary<string>();
    }
  }