import { Dictionary, Indexable } from "@nova-studios-ltd/typescript-dictionary";
import { NetAPI, NetHeaders, HTTPStatus, ContentType } from "@nova-studios-ltd/typescript-netapi";
import UserData from "Lib/Storage/Objects/UserData";

/**
 * Requests a public key for the provided user
 * @param key_user_uuid The user to fetch the public key for
 * @returns A string containing the public key
 */
export async function RequestKey(key_user_uuid: string) : Promise<string | undefined> {
  const resp = await NetAPI.GET(`/User/@me/Keystore/${key_user_uuid}`, new NetHeaders().WithAuthorization(UserData.Token));
  if (resp.status === HTTPStatus.OK) return resp.payload as string;
  return undefined;
}

/**
 * Requests the current users entire keystore
 * @returns A dictionary of keys if successful
 */
export async function RequestUserKeystore() : Promise<Dictionary<string, string> | undefined> {
  const resp = await NetAPI.GET(`/User/@me/Keystore`, new NetHeaders().WithAuthorization(UserData.Token));
  if (resp.status === HTTPStatus.OK) {
    const d = new Dictionary<string, string>();
    d._dict = resp.payload as Indexable<string, string>
    return d;
  }
  return new Dictionary<string, string>();
}

/**
 * Send a key to the current users keystore
 * @param key_user_uuid The user to fetch the public key for
 * @param key The key contents
 * @returns True of successful, otherwise false
 */
export async function SendUserKey(key_user_uuid: string, key: string) : Promise<boolean> {
  const resp = await NetAPI.POST(`/User/@me/Keystore/${key_user_uuid}`, key, new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.JSON));
  if (resp.status === HTTPStatus.OK) return true;
  return false;
}
