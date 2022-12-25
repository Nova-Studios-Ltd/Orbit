import { RSAMemoryKeypair } from "Lib/Encryption/Types/RSAMemoryKeypair";
import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";
import { ToBase64String } from "Lib/Utility/Base64";

const PEM_PUBLIC_HEADER = "-----BEGIN PUBLIC KEY-----";
const PEM_PUBLIC_FOOTER = "-----END PUBLIC KEY-----";
const PEM_PRIVATE_HEADER = "-----BEGIN PRIVATE KEY-----";
const PEM_PRIVATE_FOOTER = "-----END PRIVATE KEY-----";
const KEY_FORMAT = {name: "RSA-OAEP", hash: "SHA-1"}


// IMPORTANT: RSA keys are no longer stored in PEM format, they are just exported as raw key data

/**
 * Turn a string into a CryptoKey
 * @param key A string containing the RSA public key
 * @returns A CryptoKey if successful, otherwise undefined
 */
export async function ImportRSAPubKey(key: string) : Promise<CryptoKey | undefined> {
  const contents = key.substring(PEM_PUBLIC_HEADER.length, key.length - PEM_PUBLIC_FOOTER.length - 1);
  try {
    return await crypto.subtle.importKey("spki", new Base64Uint8Array(contents), KEY_FORMAT, true, ["encrypt"]);
  }
  catch (e) {
    console.error(e);
    return undefined;
  }
}

/**
 * Turn a string into a CryptoKey
 * @param key A string containing the RSA private key
 * @returns A CryptoKey if successful, otherwise undefined
 */
export async function ImportRSAPrivKey(key: string) : Promise<CryptoKey | undefined> {
  const contents = key.substring(PEM_PRIVATE_HEADER.length, key.length - PEM_PRIVATE_FOOTER.length - 1);
  try {
    return await crypto.subtle.importKey("pkcs8", new Base64Uint8Array(contents) as Uint8Array, KEY_FORMAT, true, ["decrypt"])
  }
  catch (e) {
    console.error(e);
    return undefined;
  }
}

/**
 * Generates a RSA Public/Private key pair
 * @returns A RSAMemoryKeyPair if successful, otherwise undefined
 */
export async function GetRSAKeyPair() : Promise<RSAMemoryKeypair | undefined> {
  const format = {name: "RSA-OAEP", modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-1"};
  const pair = await crypto.subtle.generateKey(format, true, ["encrypt", "decrypt"]);
  if (pair.privateKey !== undefined && pair.publicKey !== undefined) {
    const priv = ToBase64String(new Uint8Array(await crypto.subtle.exportKey("pkcs8", pair.privateKey)));
    const pub = ToBase64String(new Uint8Array(await crypto.subtle.exportKey("spki", pair.publicKey)));
    return new RSAMemoryKeypair(priv, pub);
  }
  return undefined;
}

/**
 * Encrypt data using a RSA public key
 * @param key A RSA public key in PEM format
 * @param data Base64Uint8Array of data to encrypt
 * @returns Base64Uint8Array of encrypted data
 */
export async function RSAEncrypt(key: string, data: Base64Uint8Array) : Promise<Base64Uint8Array> {
  const cryKey = await ImportRSAPubKey(key);
  if (cryKey === undefined) return new Base64Uint8Array();
  return new Base64Uint8Array(await crypto.subtle.encrypt({name: "RSA-OAEP"}, cryKey, data));
}

/**
 * Decrypt data using a RSA private key
 * @param key A RSA private key in PEM format
 * @param data Base64Uint8Array of data to decrypt
 * @returns Base64Uint8Array of decrypted data
 */
export async function RSADecrypt(key: string, data: Base64Uint8Array) : Promise<Base64Uint8Array> {
  const cryKey = await ImportRSAPrivKey(key);
  if (cryKey === undefined) return new Base64Uint8Array();
  return new Base64Uint8Array(await crypto.subtle.decrypt({name: "RSA-OAEP"}, cryKey, data));
}
