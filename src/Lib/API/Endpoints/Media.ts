import { GET } from "Lib/API/NetAPI/NetAPI";
import { HTTPStatus } from "Lib/API/NetAPI/HTTPStatus";
import { Dictionary, Indexable } from "Lib/Objects/Dictionary";
import UserData from "Lib/Storage/Objects/UserData";
import { API_DOMAIN } from "vars";
import { NetHeaders } from "Lib/API/NetAPI/NetHeaders";

/**
 * Requests encryption keys for the provided content
 * @param content_id Id of the content
 * @param channel_uuid Channel the content id is from
 * @returns If succesful a dictionary of keys otherwise undefined
 */
export async function RequestContentKeys(content_id: string, channel_uuid: string) : Promise<Dictionary<string, string> | undefined> {
  const resp = await GET(`Channel/${channel_uuid}/${content_id}/Keys`, new NetHeaders().WithAuthorization(UserData.Token));
  if (resp.status === HTTPStatus.OK) return new Dictionary<string, string>(resp.payload as Indexable<string, string>);
  return undefined;
}

/**
 * Requests encryption keys for the provided content
 * @param content_url URL to the content
 * @returns If succesful a dictionary of keys otherwise undefined
 */
export async function GETContentURLKeys(content_url: string) : Promise<Dictionary<string, string> | undefined> {
  const resp = await GET(`${content_url.replace(API_DOMAIN, "")}/Keys`, new NetHeaders().WithAuthorization(UserData.Token));
  if (resp.status === HTTPStatus.OK) return new Dictionary<string, string>(resp.payload as Indexable<string, string>);
  return undefined;
}
