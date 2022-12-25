import { GET, HTTPStatusCodes, POST, ContentType, NCAPIResponse, PATCH, POSTFile, DELETE } from "Lib/API/NCAPI";
import UserData from "Lib/Storage/Objects/UserData";
import { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";

/**
 * Request a channel
 * @param channel_uuid Uuid of the channel
 * @returns IRawChannelProps on success otherwise undefined
 */
export async function RequestChannel(channel_uuid: string) : Promise<IRawChannelProps | undefined> {
  const resp = await GET(`/Channel/${channel_uuid}`, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) return resp.payload as IRawChannelProps;
  return undefined;
}

/**
 * Requests a new channel be created
 * @param recipient_uuid User uuid to create channel with
 * @param callback Called on request completion
 */
export function RequestCreateChannel(recipient_uuid: string, callback: (created: boolean) => void) {
  POST(`Channel/CreateChannel?recipient_uuid=${recipient_uuid}`, ContentType.EMPTY, "", UserData.Token, false).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests a new private channel be created
 * @param callback Called on request completion, contains the uuid of the new channel
 */
export function RequestCreatePrivate(callback: (created: boolean, uuid: string) => void) {
  POST("Channel/CreatePrivate", ContentType.EMPTY, "", UserData.Token, false).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true, resp.payload as string);
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
  POST(`Channel/CreateGroupChannel?group_name=${group_name}`, ContentType.JSON, JSON.stringify(recipients), UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
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
  PATCH(`/Channel/${channel_uuid}/Name?new_name=${newName}`, ContentType.EMPTY, "", UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
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
  POSTFile(`/Media/Channel/${channel_uuid}`, file, "Unknown", undefined, undefined, UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

/**
 * Request the provided channel reset it's icon
 * @param channel_uuid Uuid of the channel
 * @param callback Called on request completion
 */
export function RequestResetChannelIcon(channel_uuid: string, callback: (removed: boolean) => void) {
  POST(`/Channel/${channel_uuid}/Icon`, ContentType.EMPTY, "", UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
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
  PATCH(`Channel/${channel_uuid}/Members`, ContentType.JSON, JSON.stringify(recipients), UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
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
  DELETE(`/Channel/${channel_uuid}/Members?recipient=${recipient}`, UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests that a channel be archived
 * @param channel_uuid Uuid of the channel
 * @param callback Called on request completion
 */
export function RequestArchiveChannel(channel_uuid: string, callback: (archived: boolean) => void) {
  PATCH(`/Channel/${channel_uuid}/Achrive`, ContentType.EMPTY, "", UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests that a channel be unarchived
 * @param channel_uuid Uuid of the channel
 * @param callback Called on request completion
 */
export function RequestUnArchiveChannel(channel_uuid: string, callback: (archived: boolean) => void) {
  PATCH(`/Channel/${channel_uuid}/Unachrive`, ContentType.EMPTY, "", UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests that the provided channel be deleted
 * @param channel_uuid Uuid of the channel
 * @param callback Called on request completion
 */
export function RequestDeleteChannel(channel_uuid: string, callback: (deleted: boolean) => void) {
  DELETE(`/Channel/${channel_uuid}`, UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}
