export class RSAMemoryKeyPair {
    readonly PrivateKey: string;
    readonly PublicKey: string;
  
    constructor(priv: string, pub: string) {
      this.PrivateKey = priv;
      this.PublicKey = pub;
    }
  }
  
  export interface IAESMemoryEncryptData {
    iv: string,
    content: string | Uint8Array
  }
  
  export class AESMemoryEncryptData implements IAESMemoryEncryptData {
    iv: string;
    content: string | Uint8Array;
  
    constructor(iv: string, content: string | Uint8Array) {
        this.iv = iv;
        this.content = content;
    }
  }
  