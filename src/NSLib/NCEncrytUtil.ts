/**
 * Class for storing a RSA keypair in memory
 */
export class RSAMemoryKeyPair {
  readonly PrivateKey: string;
  readonly PublicKey: string;

  /**
   * @param priv RSA Private key stored in PEM format
   * @param pub RSA Public Key stored in PEM format
   */
  constructor(priv: string, pub: string) {
    this.PrivateKey = priv;
    this.PublicKey = pub;
  }
}

export interface IAESMemoryEncryptData {
  iv: string,
  content: string | Uint8Array
}

/**
 * Class for storing AES encrypted data
 */
export class AESMemoryEncryptData implements IAESMemoryEncryptData {
  iv: string;
  content: string | Uint8Array;

  /**
   * @param iv base64 encoded string storing the Initalization Vector
   * @param content Encrypted data (base64 string or Uin8Array)
   */
  constructor(iv: string, content: string | Uint8Array) {
    this.iv = iv;
    this.content = content;
  }
}
