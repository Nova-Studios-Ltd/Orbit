import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";
import { AESMemoryEncryptData } from "Lib/Encryption/Types/AESMemoryEncryptData";

/**
 * Imports a AES key
 * @param key Base64String containing the key
 * @returns A CryptoKey
 */
export async function ImportAESKey(key: Base64Uint8Array) : Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", key, "AES-CTR", true, ["encrypt", "decrypt"]);
}

/**
 * Generates a key in Base64 format of the specified length
 * @param length Length of the key in bytes
 * @returns A Base64String containing a crypto key
 */
export async function GetAESKey(length: number) : Promise<Base64Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(length)) as Base64Uint8Array;
}

/**
 * Encrypt data using AES
 * @param key a AES 256-bit key in Base64 format
 * @param data Data to encrypt
 * @param init_iv Optional Initalzation Vector, if left blank a random one is generated
 * @returns AESMemoryEncryptData containing the the content as a Base64String and the IV as a Base64String
 */
export async function AESEncrypt(key: Base64Uint8Array, data: Base64Uint8Array, init_iv?: Base64Uint8Array) : Promise<AESMemoryEncryptData> {
  const iv = (init_iv === undefined)? crypto.getRandomValues(new Uint8Array(16)) : init_iv;
  const format = {name: "AES-CTR", counter: iv, length: 32};
  const encrypted = await crypto.subtle.encrypt(format, await ImportAESKey(key), data as Uint8Array);
  // TODO: Change this to follow Base64 system
  return new AESMemoryEncryptData(new Base64Uint8Array(iv), new Base64Uint8Array(encrypted));
}

/**
 * Decrypt data using AES
 * @param key a AES 256-bit key in Base64 format
 * @param data AESMemoryEncryptData to decrypt
 * @returns a Base64String of the decrypted data
 */
 export async function AESDecrypt(key: Base64Uint8Array, data: AESMemoryEncryptData) : Promise<Base64Uint8Array> {
  const algo = {name: "AES-CTR", counter: data.iv, length: 32};
  const ke2y = await ImportAESKey(key);
  const decrypted = await crypto.subtle.decrypt(algo, ke2y, data.content);
  return new Base64Uint8Array(decrypted);
}
