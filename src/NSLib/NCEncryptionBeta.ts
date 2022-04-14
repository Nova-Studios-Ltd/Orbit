import { Base64String, FromBase64String, FromUint8Array, IsBase64, ToBase64String, ToUint8Array } from "./Base64";
import { AESMemoryEncryptData } from "./NCEncrytUtil";

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

export async function GenerateBase64Key(length: number) : Promise<Base64String> {
  return Base64String.CreateBase64String(crypto.getRandomValues(new Uint8Array(length)));
}

export async function GenerateBase64SHA256(data: string) : Promise<Base64String> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", ToUint8Array(data))
  return Base64String.CreateBase64String(new Uint8Array(hashBuffer));
}

export async function GenereateSHA256(data: Uint8Array) : Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
}

// RSA Functions
export async function EncryptBase64WithPub(key: string, data: Base64String) : Promise<Base64String> {
  const res = await crypto.subtle.encrypt({name: "RSA-OAEP"}, await ImportRSAPubKey(key), data.Uint8Array);
  return Base64String.CreateBase64String(new Uint8Array(res));
}

export async function DecryptBase64WithPriv(key: string, data: Base64String) : Promise<Base64String> {
  const res = await crypto.subtle.decrypt({name: "RSA-OAEP"}, await ImportRSAPrivKey(key), data.Uint8Array);
  return Base64String.CreateBase64String(new Uint8Array(res));
}

// AES Functions
export async function EncryptBase64(key: Base64String, data: Base64String, init_iv?: Base64String) : Promise<AESMemoryEncryptData> {
  const iv = (init_iv === undefined)? crypto.getRandomValues(new Uint8Array(16)) : init_iv.Uint8Array;
  const algo = {name: "AES-CTR", counter: iv, length: 32};
  const encrypted = await crypto.subtle.encrypt(algo, await ImportKey(key.Base64), data.Uint8Array);
  return new AESMemoryEncryptData(ToBase64String(iv), ToBase64String(new Uint8Array(encrypted)));
}

export async function DecryptBase64(key: Base64String, data: AESMemoryEncryptData) : Promise<Base64String> {
  const algo = {name: "AES-CTR", counter: FromBase64String(data.iv), length: 32};
  const decrypted = await crypto.subtle.decrypt(algo, await ImportKey(key.Base64), FromBase64String(data.content as string));
  return Base64String.CreateBase64String(new Uint8Array(decrypted));
}

export async function EncryptUint8Array(key: Base64String, data: Uint8Array, init_iv?: Base64String) : Promise<AESMemoryEncryptData> {
  const iv = (init_iv === undefined)? crypto.getRandomValues(new Uint8Array(16)) : init_iv.Uint8Array;
  const algo = {name: "AES-CTR", counter: iv, length: 32};
  const encrypted = await crypto.subtle.encrypt(algo, await ImportKey(key.Base64), data);
  return new AESMemoryEncryptData(ToBase64String(iv), new Uint8Array(encrypted));
}

export async function DecryptUint8Array(key: Base64String, data: AESMemoryEncryptData) : Promise<Uint8Array> {
  if (typeof data.content === "string") throw new Error("'content' of 'data' must be type of string");
  const algo = {name: "AES-CTR", counter: FromBase64String(data.iv), length: 32};
  const decrypted = await crypto.subtle.decrypt(algo, await ImportKey(key.Base64), data.content as Uint8Array);
  return new Uint8Array(decrypted);
}
