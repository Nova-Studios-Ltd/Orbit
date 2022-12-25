import { ContentType, GET, HTTPStatusCodes, POST } from "Lib/API/NCAPI";
import { Dictionary, Indexable } from "Lib/Objects/Dictionary";
import UserData from "Lib/Storage/Objects/UserData";

/**
 * Requests a public key for the provided user
 * @param key_user_uuid The user to fetch the public key for
 * @returns A string containing the public key
 */
export async function RequestKey(key_user_uuid: string) : Promise<string | undefined> {
  const resp = await GET(`/User/@me/Keystore/${key_user_uuid}`, UserData.Token, false);
  if (resp.status === HTTPStatusCodes.OK) return resp.payload as string;
  return undefined;
}

/**
 * Requests the current users entire keystore
 * @returns A dictionary of keys if successful
 */
export async function RequestUserKeystore() : Promise<Dictionary<string> | undefined> {
  const resp = await GET(`/User/@me/Keystore`, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) {
    const d = new Dictionary<string>();
    d._dict = resp.payload as Indexable<string>
    return d;
  }
  return new Dictionary<string>();
}

/**
 * Send a key to the current users keystore
 * @param key_user_uuid The user to fetch the public key for
 * @param key The key contents
 * @returns True of succesful, otherwise false
 */
export async function SendUserKey(key_user_uuid: string, key: string) : Promise<boolean> {
  const resp = await POST(`/User/@me/Keystore/${key_user_uuid}`, ContentType.JSON, key, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) return true;
  return false;
}
