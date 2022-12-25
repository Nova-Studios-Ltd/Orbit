import { GET, HTTPStatusCodes } from "Lib/API/NCAPI";
import { Dictionary, Indexable } from "Lib/Objects/Dictionary";
import UserData from "Lib/Storage/Objects/UserData";
import { API_DOMAIN } from "vars";

/**
 * Requests encryption keys for the provided content
 * @param content_id Id of the content
 * @param channel_uuid Channel the content id is from
 * @returns If succesful a dictionary of keys otherwise undefined
 */
export async function RequestContentKeys(content_id: string, channel_uuid: string) : Promise<Dictionary<string> | undefined> {
  const resp = await GET(`Channel/${channel_uuid}/${content_id}/Keys`, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) return new Dictionary<string>(resp.payload as Indexable<string>);
  return undefined;
}

/**
 * Requests encryption keys for the provided content
 * @param content_url URL to the content
 * @returns If succesful a dictionary of keys otherwise undefined
 */
export async function GETContentURLKeys(content_url: string) : Promise<Dictionary<string> | undefined> {
  const resp = await GET(`${content_url.replace(API_DOMAIN, "")}/Keys`, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) return new Dictionary<string>(resp.payload as Indexable<string>);
  return undefined;
}
