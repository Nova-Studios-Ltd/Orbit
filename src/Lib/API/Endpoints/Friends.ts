import { GET, HTTPStatusCodes, POST, ContentType, PATCH, DELETE } from "Lib/API/NCAPI";
import { Dictionary, Indexable } from "Lib/Objects/Dictionary";
import UserData from "Lib/Storage/Objects/UserData";

/**
 * Request the state of a friend from the current user
 * @param friend_uuid Uuid of the user to check state of
 * @returns A string representing the state
 */
export async function RequestFriendState(friend_uuid: string) : Promise<string> {
  const resp = await GET(`/Friend/${UserData.Uuid}/Friends/${friend_uuid}`, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) {
    return resp.payload.state;
  }
  return "";
}

/**
 * Request the friends of a specified user
 * @param user_uuid Uuid of the user to request friends of
 * @returns A dictionary of friends
 */
export async function RequestFriends(user_uuid: string) : Promise<Dictionary<string>> {
  const resp = await GET(`/Friend/${user_uuid}/Friends`, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) {
    const d = new Dictionary<string>();
    d._dict = resp.payload as Indexable<string>;
    return d;
  }
  return new Dictionary<string>();
}

/**
 * Request the current users friends
 * @returns A dictionary of friends
 */
export async function RequestUserFriends() : Promise<Dictionary<string>> {
  return await RequestFriends(UserData.Uuid);
}

/**
 * Sends a friend request to the provided user
 * @param request_uuid uuid of the user to request
 * @returns True if succesful, otherwise false
 */
export async function SendFriendRequest(request_uuid: string) : Promise<boolean> {
  const resp = await POST(`/Friend/${UserData.Uuid}/Send/${request_uuid}`, ContentType.EMPTY, "", UserData.Token, false);
  return resp.status === HTTPStatusCodes.OK;
}

/**
 * Accepts a friend request to the provided user
 * @param request_uuid uuid of the user to request
 * @returns True if succesful, otherwise false
 */
export async function SendAcceptFriend(request_uuid: string) : Promise<boolean> {
  const resp = await PATCH(`/Friend/${UserData.Uuid}/Accept/${request_uuid}`, ContentType.EMPTY, "", UserData.Token);
  return resp.status === HTTPStatusCodes.OK;
}

/**
 * Declines a friend request from the provided user
 * @param request_uuid uuid of the user to request
 * @returns True if succesful, otherwise false
 */
export async function DECLINEFriend(request_uuid: string) : Promise<boolean> {
  const resp = await PATCH(`/Friend/${UserData.Uuid}/Decline/${request_uuid}`, ContentType.EMPTY, "", UserData.Token);
  return resp.status === HTTPStatusCodes.OK;
}

/**
 * Request to remove a friend
 * @param request_uuid uuid of the user to remove
 * @returns True if succesful, otherwise false
 */
export async function RequestRemoveFriend(request_uuid: string) : Promise<boolean> {
  const resp = await DELETE(`/Friend/${UserData.Uuid}/Remove/${request_uuid}`, UserData.Token)
  return resp.status === HTTPStatusCodes.OK;
}

/**
 * Request to block a friend
 * @param request_uuid uuid of the user to block
 * @returns True if succesful, otherwise false
 */
export async function RequestBlockFriend(request_uuid: string) : Promise<boolean> {
  const resp = await PATCH(`/Friend/${UserData.Uuid}/Block/${request_uuid}`, ContentType.EMPTY, "", UserData.Token);
  return resp.status === HTTPStatusCodes.OK;
}

/**
 * Request to unblock a friend
 * @param request_uuid uuid of the user to unblock
 * @returns True if succesful, otherwise false
 */
export async function RequestUnblockFriend(request_uuid: string) : Promise<boolean> {
  const resp = await PATCH(`/Friend/${UserData.Uuid}/Unblock/${request_uuid}`, ContentType.EMPTY, "", UserData.Token);
  return resp.status === HTTPStatusCodes.OK;
}
