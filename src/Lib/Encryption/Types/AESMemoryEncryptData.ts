import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";


// TODO: Move this into another place, something related to the API as they are different
export interface IAESMemoryEncryptData {
  iv: string,
  content: string | Uint8Array
}

/**
 * Class for storing AES encrypted data
 */
export class AESMemoryEncryptData {
  iv: Base64Uint8Array;
  content: Base64Uint8Array;

  /**
   * @param iv Initialization Vector
   * @param content Encrypted Data
   */
  constructor(iv: Base64Uint8Array, content: Base64Uint8Array) {
    this.iv = iv;
    this.content = content;
  }
}
