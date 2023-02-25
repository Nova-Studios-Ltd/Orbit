import { Dictionary, Indexable } from "@nova-studios-ltd/typescript-dictionary";
import { NetAPI, NetHeaders, HTTPStatus } from "@nova-studios-ltd/typescript-netapi";
import UserData from "Lib/Storage/Objects/UserData";
import { API_DOMAIN } from "vars";

/**
 * Requests encryption keys for the provided content
 * @param content_id Id of the content
 * @param channel_uuid Channel the content id is from
 * @returns If succesful a dictionary of keys otherwise undefined
 */
export async function RequestContentKeys(content_id: string, channel_uuid: string) : Promise<Dictionary<string, string> | undefined> {
  const resp = await NetAPI.GET(`Channel/${channel_uuid}/${content_id}/Keys`, new NetHeaders().WithAuthorization(UserData.Token));
  if (resp.status === HTTPStatus.OK) return new Dictionary<string, string>(resp.payload as Indexable<string, string>);
  return undefined;
}

/**
 * Requests encryption keys for the provided content
 * @param content_url URL to the content
 * @returns If succesful a dictionary of keys otherwise undefined
 */
export async function GETContentURLKeys(content_url: string) : Promise<Dictionary<string, string> | undefined> {
  const resp = await NetAPI.GET(`${content_url.replace(API_DOMAIN, "")}/Keys`, new NetHeaders().WithAuthorization(UserData.Token));
  if (resp.status === HTTPStatus.OK) return new Dictionary<string, string>(resp.payload as Indexable<string, string>);
  return undefined;
}
