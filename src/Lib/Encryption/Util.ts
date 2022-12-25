import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";
import { ToUint8Array } from "Lib/Utility/Base64";

/**
 * Hash a string using SHA-256
 * @param data String of characters to be hashed
 * @returns A Base64Uint8Array containing the hashed string
 */
 export async function SHA256(data: string) : Promise<Base64Uint8Array> {
  return new Base64Uint8Array(await crypto.subtle.digest("SHA-256", ToUint8Array(data)));
}
