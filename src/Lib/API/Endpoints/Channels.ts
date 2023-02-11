import { GET, POST, POSTBuffer, PATCH, DELETE } from "Lib/API/NetAPI/NetAPI";
import { ContentType } from "Lib/API/NetAPI/ContentType";
import { HTTPStatus } from "Lib/API/NetAPI/HTTPStatus";
import UserData from "Lib/Storage/Objects/UserData";
import { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import { NetHeaders } from "Lib/API/NetAPI/NetHeaders";
import { NetResponse } from "Lib/API/NetAPI/NetResponse";
import { BufferPayload } from "Lib/API/NetAPI/BufferPayload";

/**
 * Request a channel
 * @param channel_uuid Uuid of the channel
 * @returns IRawChannelProps on success otherwise undefined
 */
export async function RequestChannel(channel_uuid: string) : Promise<IRawChannelProps | undefined> {
  const resp = await GET(`/Channel/${channel_uuid}`, new NetHeaders().WithAuthorization(UserData.Token));
  if (resp.status === HTTPStatus.OK) return resp.payload as IRawChannelProps;
  return undefined;
}

/**
 * Requests a new channel be created
 * @param recipient_uuid User uuid to create channel with
 * @param callback Called on request completion
 */
export function RequestCreateChannel(recipient_uuid: string, callback: (created: boolean) => void) {
  POST<never>(`Channel/CreateChannel?recipient_uuid=${recipient_uuid}`, "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests a new private channel be created
 * @param callback Called on request completion, contains the uuid of the new channel
 */
export function RequestCreatePrivate(callback: (created: boolean, uuid: string) => void) {
  POST<never>("Channel/CreatePrivate", "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true, resp.payload as string);
    else callback(false, "");
  });
}

/**
 * Requests a new group channel be created
 * @param group_name Name of the group channel
 * @param recipients A list of uuids for the recipients
 * @param callback Called on request completion
 */
export function RequestCreateGroup(group_name: string, recipients: string[], callback: (created: boolean) => void) {
  POST<never>(`Channel/CreateGroupChannel?group_name=${group_name}`, JSON.stringify(recipients), new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.JSON)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests the provided channel change its name
 * @param channel_uuid Uuid of the channel
 * @param newName The new name of the channel
 * @param callback Called on request completion
 */
export function RequestUpdateChannelName(channel_uuid: string, newName: string, callback: (updated: boolean) => void)  {
  PATCH<never>(`/Channel/${channel_uuid}/Name?new_name=${newName}`, "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true);
    else callback(false);
  });
}

/**
 * Request the provided channel change its icon
 * @param channel_uuid Uuid of the channel
 * @param file The new image, provided as a Blob
 * @param callback Called on request completion
 */
export function RequestUpdateChannelIcon(channel_uuid: string, file: Blob, callback: (updated: boolean) => void) {
  POSTBuffer(`/Media/Channel/${channel_uuid}`, new BufferPayload(file, "Unknown"), new NetHeaders().WithAuthorization(UserData.Token)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true);
    else callback(false);
  });
}

/**
 * Request the provided channel reset it's icon
 * @param channel_uuid Uuid of the channel
 * @param callback Called on request completion
 */
export function RequestResetChannelIcon(channel_uuid: string, callback: (removed: boolean) => void) {
  POST<never>(`/Channel/${channel_uuid}/Icon`, "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests a new member(s) be added the provided channel
 * @param channel_uuid Uuid of the channel
 * @param recipients A list of recipients uuid's
 * @param callback Called on request completion
 */
export function RequestAddMember(channel_uuid: string, recipients: string[], callback: (added: boolean) => void) {
  PATCH<never>(`Channel/${channel_uuid}/Members`, JSON.stringify(recipients), new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.JSON)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests the provided user be removed from the provided channel
 * @param channel_uuid Uuid of the channel
 * @param recipient The uuid of recipent to remove
 * @param callback Called on request completion
 */
export function RequestRemoveMember(channel_uuid: string, recipient: string, callback: (removed: boolean) => void) {
  DELETE<never>(`/Channel/${channel_uuid}/Members?recipient=${recipient}`, new NetHeaders().WithAuthorization(UserData.Token)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests that a channel be archived
 * @param channel_uuid Uuid of the channel
 * @param callback Called on request completion
 */
export function RequestArchiveChannel(channel_uuid: string, callback: (archived: boolean) => void) {
  PATCH<never>(`/Channel/${channel_uuid}/Achrive`, "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests that a channel be unarchived
 * @param channel_uuid Uuid of the channel
 * @param callback Called on request completion
 */
export function RequestUnArchiveChannel(channel_uuid: string, callback: (archived: boolean) => void) {
  PATCH<never>(`/Channel/${channel_uuid}/Unachrive`, "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests that the provided channel be deleted
 * @param channel_uuid Uuid of the channel
 * @param callback Called on request completion
 */
export function RequestDeleteChannel(channel_uuid: string, callback: (deleted: boolean) => void) {
  DELETE<never>(`/Channel/${channel_uuid}`, new NetHeaders().WithAuthorization(UserData.Token)).then((resp) => {
    if (resp.status === HTTPStatus.OK) callback(true);
    else callback(false);
  });
}
