import { Base64String, FromBase64String, ToBase64String, ToUint8Array } from "./Base64";
import { AESMemoryEncryptData, RSAMemoryKeyPair } from "./NCEncrytUtil";

function ImportKey(key: string) : Promise<CryptoKey> {
  const key2 = FromBase64String(key);
  return crypto.subtle.importKey("raw", key2, "AES-CTR", true, ["encrypt", "decrypt"]);
}

function ImportRSAPubKey(key: string) : Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = key.substring(pemHeader.length, key.length - pemFooter.length - 1);
  const keyBin = FromBase64String(pemContents);
  return crypto.subtle.importKey(
      "spki",
      keyBin,
      {
        name: "RSA-OAEP",
        hash: "SHA-1"
      },
      true,
      ["encrypt"]
  );
}

function ImportRSAPrivKey(key: string) : Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = key.substring(pemHeader.length, key.length - pemFooter.length - 1);
  const keyBin = FromBase64String(pemContents);
  try {
    return crypto.subtle.importKey(
        "pkcs8",
        keyBin,
        {
          name: "RSA-OAEP",
          hash: "SHA-1"
        },
        true,
        ["decrypt"]
    );
  }
  catch (e) {
    console.error(e);
    return new Promise(() => {});
  }
}

/**
 * Generate a key in Base64 format of a specifed length
 * @param length Length of the key in bytes
 * @returns Base64String containing a crypto key with size of length
 */
export async function GenerateBase64Key(length: number) : Promise<Base64String> {
  return Base64String.CreateBase64String(crypto.getRandomValues(new Uint8Array(length)));
}

/**
 * Hash a string using SHA-256
 * @param data String of characters to be hashed
 * @returns A Base64String containing the hashed string
 */
export async function GenerateBase64SHA256(data: string) : Promise<Base64String> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", ToUint8Array(data))
  return Base64String.CreateBase64String(new Uint8Array(hashBuffer));
}

/**
 * Hash a Uint8Array using SHA-256
 * @param data Uint8Array of bytes to be hashed
 * @returns A Uint8Array containing the hashed
 */
export async function GenereateSHA256(data: Uint8Array) : Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
}

// RSA Functions
/**
 * Encrypt Base64 data using a RSA public key
 * @param key A RSA public key in PEM format
 * @param data Base64String of data to encrypt
 * @returns Base64String of encrypted data
 */
export async function EncryptBase64WithPub(key: string, data: Base64String) : Promise<Base64String> {
  const res = await crypto.subtle.encrypt({name: "RSA-OAEP"}, await ImportRSAPubKey(key), data.Uint8Array);
  return Base64String.CreateBase64String(new Uint8Array(res));
}

/**
 * Decrypt Base64 data using a RSA private key
 * @param key A RSA private key in PEM format
 * @param data Base64String of data to decrypt
 * @returns Base64String of decrypted data
 */
export async function DecryptBase64WithPriv(key: string, data: Base64String) : Promise<Base64String> {
  const res = await crypto.subtle.decrypt({name: "RSA-OAEP"}, await ImportRSAPrivKey(key), data.Uint8Array);
  return Base64String.CreateBase64String(new Uint8Array(res));
}

/**
 * Creates a RSA Public/Private keypair
 * @returns a RSAMemoryKeyPair if successful, otherwise undefined
 */
export async function GenerateRSAKeyPair() : Promise<RSAMemoryKeyPair | undefined> {
  const algo = {name: "RSA-OAEP", modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-1"}
  const keyPair = await crypto.subtle.generateKey(algo, true, ["encrypt", "decrypt"]);
  if (keyPair.privateKey !== undefined && keyPair.publicKey !== undefined) {
    const priv = ToBase64String(new Uint8Array(await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)));
    const pub = ToBase64String(new Uint8Array(await crypto.subtle.exportKey("spki", keyPair.publicKey)));
    return new RSAMemoryKeyPair(`-----BEGIN PRIVATE KEY-----\n${priv}\n-----END PRIVATE KEY-----`, `-----BEGIN PUBLIC KEY-----\n${pub}\n-----END PUBLIC KEY-----`);
  }
  return undefined;
}

// AES Functions
/**
 * Encrypt a Base64 encoded string using AES
 * @param key a AES 256-bit key in Base64 format
 * @param data Base64 data to encrypt
 * @param init_iv optional Initalzation Vector, if left blank a random one is generated
 * @returns AESMemoryEncryptData containing the the content as a Base64String and the IV as a Base64String
 */
export async function EncryptBase64(key: Base64String, data: Base64String, init_iv?: Base64String) : Promise<AESMemoryEncryptData> {
  const iv = (init_iv === undefined)? crypto.getRandomValues(new Uint8Array(16)) : init_iv.Uint8Array;
  const algo = {name: "AES-CTR", counter: iv, length: 32};
  const encrypted = await crypto.subtle.encrypt(algo, await ImportKey(key.Base64), data.Uint8Array);
  return new AESMemoryEncryptData(ToBase64String(iv), ToBase64String(new Uint8Array(encrypted)));
}

/**
 * Decrypt a Base64 encoded string using AES
 * @param key a AES 256-bit key in Base64 format
 * @param data AESMemoryEncryptData to decrypt
 * @returns a Base64String of the decrypted data
 */
export async function DecryptBase64(key: Base64String, data: AESMemoryEncryptData) : Promise<Base64String> {
  const algo = {name: "AES-CTR", counter: FromBase64String(data.iv), length: 32};
  const decrypted = await crypto.subtle.decrypt(algo, await ImportKey(key.Base64), FromBase64String(data.content as string));
  return Base64String.CreateBase64String(new Uint8Array(decrypted));
}

/**
 * Encrypt a Uint8Array encoded string using AES
 * @param key a AES 256-bit key in Base64 format
 * @param data Uint8Array to encrypt
 * @param init_iv optional Initalzation Vector, if left blank a random one is generated
 * @returns AESMemoryEncryptData containing the the content as a Uint8Array and the IV as a Base64String
 */
export async function EncryptUint8Array(key: Base64String, data: Uint8Array, init_iv?: Base64String) : Promise<AESMemoryEncryptData> {
  const iv = (init_iv === undefined)? crypto.getRandomValues(new Uint8Array(16)) : init_iv.Uint8Array;
  const algo = {name: "AES-CTR", counter: iv, length: 32};
  const encrypted = await crypto.subtle.encrypt(algo, await ImportKey(key.Base64), data);
  return new AESMemoryEncryptData(ToBase64String(iv), new Uint8Array(encrypted));
}

/**
 * Decrypt a Base64 encoded string using AES
 * @param key a AES 256-bit key in Base64 format
 * @param data AESMemoryEncryptData to decrypt
 * @returns a Uint8Array of the decrypted data
 */
export async function DecryptUint8Array(key: Base64String, data: AESMemoryEncryptData) : Promise<Uint8Array> {
  if (typeof data.content === "string") throw new Error("'content' of 'data' must be type of string");
  const algo = {name: "AES-CTR", counter: FromBase64String(data.iv), length: 32};
  const decrypted = await crypto.subtle.decrypt(algo, await ImportKey(key.Base64), data.content as Uint8Array);
  return new Uint8Array(decrypted);
}
