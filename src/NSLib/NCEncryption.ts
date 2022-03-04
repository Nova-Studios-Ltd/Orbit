import { FromBase64String, FromUint8Array, ToBase64String, ToUint8Array } from "./Base64";
import { AESMemoryEncryptData, RSAMemoryKeyPair } from "./NCEncrytUtil";

function ImportRSAPubKey(key: string) : Promise<CryptoKey> {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = key.substring(pemHeader.length, key.length - pemFooter.length);
    const keyBin = Buffer.from(pemContents, "base64");
    return crypto.subtle.importKey(
        "spki", 
        keyBin, 
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["encrypt"]
    );
}

function ImportRSAPrivKey(key: string) : Promise<CryptoKey> {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = key.substring(pemHeader.length, key.length - pemFooter.length);
    const keyBin = Buffer.from(pemContents, "base64");
    return crypto.subtle.importKey(
        "pkcs8", 
        keyBin, 
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["decrypt"]
    );
}

function ImportKey(key: string) : Promise<CryptoKey> {
    const key2 = FromBase64String(key);
    return crypto.subtle.importKey("raw", key2, "AES-CTR", true, ["encrypt", "decrypt"]);
}


export async function GenerateRSAKeyPair() : Promise<RSAMemoryKeyPair | undefined> {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );

    if (keyPair.privateKey !== undefined && keyPair.publicKey !== undefined) {
        const priv = ToBase64String(new Uint8Array(await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)));
        const pub = ToBase64String(new Uint8Array(await crypto.subtle.exportKey("spki", keyPair.publicKey)));
        return new RSAMemoryKeyPair(`-----BEGIN PRIVATE KEY-----\n${priv}\n-----END PRIVATE KEY-----`, `-----BEGIN PUBLIC KEY-----\n${pub}\n-----END PUBLIC KEY-----`);
    }
    return undefined;
}

export async function EncryptUsingPubKey(key: string, data: string) : Promise<string> {
    const res = await crypto.subtle.encrypt({name: "RSA-OAEP"}, await ImportRSAPubKey(key), ToUint8Array(data));
    return ToBase64String(new Uint8Array(res));
}

export async function DecryptUsingPrivKey(key: string, data: string) : Promise<string> {
    const res = await crypto.subtle.decrypt({name: "RSA-OAEP"}, await ImportRSAPrivKey(key), ToUint8Array(data)); 
    return ToBase64String(new Uint8Array(res));
}

export async function EncryptStringUsingAES(key: string, data: string, init_iv?: string) : Promise<AESMemoryEncryptData> {
    const iv = (init_iv === undefined)? crypto.getRandomValues(new Uint8Array(16)) : ToUint8Array(init_iv);
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-CTR",
            counter: iv,
            length: 64
        },
        await ImportKey(key),
        new TextEncoder().encode(data)
    ) as ArrayBuffer;
    return new AESMemoryEncryptData(ToBase64String(iv), ToBase64String(new Uint8Array(encrypted)));
}

export async function DecryptStringUsingAES(key: string, data: AESMemoryEncryptData) : Promise<string> {
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-CTR",
            counter: FromBase64String(data.iv),
            length: 64
        },
        await ImportKey(key),
        ToUint8Array(data.content as string)
    ) as ArrayBuffer;
    return FromUint8Array(new Uint8Array(decrypted));
}

export async function DecryptUint8ArrayUsingAES(key: string, data: Uint8Array, iv: string) : Promise<Uint8Array> {
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-CTR",
            counter: ToUint8Array(iv),
            length: 64
        },
        await ImportKey(key),
        data
    ) as ArrayBuffer;
    return new Uint8Array(decrypted);
}

export async function EncryptUint8ArrayUsingAES(key: string, data: Uint8Array, init_iv?: string) : Promise<AESMemoryEncryptData> {
    const iv = (init_iv === undefined)? crypto.getRandomValues(new Uint8Array(16)) : ToUint8Array(init_iv);
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-CTR",
            counter: iv,
            length: 64
        },
        await ImportKey(key),
        data
    ) as ArrayBuffer;
    return new AESMemoryEncryptData(ToBase64String(iv), new Uint8Array(encrypted));
}


export async function GenerateKey(length: number) : Promise<string> {
    return ToBase64String(crypto.getRandomValues(new Uint8Array(length)));   
}

export async function GenerateSHA256Hash(data: string) : Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data))
    return ToBase64String(new Uint8Array(hashBuffer));
}