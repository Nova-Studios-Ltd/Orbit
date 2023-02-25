import { Dictionary, Indexable } from "@nova-studios-ltd/typescript-dictionary";
import { NetAPI, NetHeaders, HTTPStatus, ContentType } from "@nova-studios-ltd/typescript-netapi";
import UserData from "Lib/Storage/Objects/UserData";
import { FriendStatus } from "Types/UI/Friend";

/**
 * Request the state of a friend from the current user
 * @param friend_uuid Uuid of the user to check state of
 * @returns A string representing the state
 */
export async function RequestFriendState(friend_uuid: string) : Promise<FriendStatus> {
  const resp = await NetAPI.GET<FriendStatus>(`/Friend/${UserData.Uuid}/Friends/${friend_uuid}`, new NetHeaders().WithAuthorization(UserData.Token));
  if (resp.status === HTTPStatus.OK) {
    return resp.payload;
  }
  return {};
}

/**
 * Request the friends of a specified user
 * @param user_uuid Uuid of the user to request friends of
 * @returns A dictionary of friends
 */
export async function RequestFriends(user_uuid: string) : Promise<Dictionary<string, string>> {
  const resp = await NetAPI.GET(`/Friend/${user_uuid}/Friends`, new NetHeaders().WithAuthorization(UserData.Token));
  if (resp.status === HTTPStatus.OK) {
    const d = new Dictionary<string, string>();
    d._dict = resp.payload as Indexable<string, string>;
    return d;
  }
  return new Dictionary<string, string>();
}

/**
 * Request the current users friends
 * @returns A dictionary of friends
 */
export async function RequestUserFriends() : Promise<Dictionary<string, string>> {
  return await RequestFriends(UserData.Uuid);
}

/**
 * Sends a friend request to the provided user
 * @param request_uuid uuid of the user to request
 * @returns True if succesful, otherwise false
 */
export async function SendFriendRequest(request_uuid: string) : Promise<boolean> {
  const resp = await NetAPI.POST(`/Friend/${UserData.Uuid}/Send/${request_uuid}`, "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY));
  return resp.status === HTTPStatus.OK;
}

/**
 * Accepts a friend request to the provided user
 * @param request_uuid uuid of the user to request
 * @returns True if succesful, otherwise false
 */
export async function SendAcceptFriend(request_uuid: string) : Promise<boolean> {
  const resp = await NetAPI.PATCH(`/Friend/${UserData.Uuid}/Accept/${request_uuid}`, "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY));
  return resp.status === HTTPStatus.OK;
}

/**
 * Declines a friend request from the provided user
 * @param request_uuid uuid of the user to request
 * @returns True if succesful, otherwise false
 */
export async function DECLINEFriend(request_uuid: string) : Promise<boolean> {
  const resp = await NetAPI.PATCH(`/Friend/${UserData.Uuid}/Decline/${request_uuid}`, "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY));
  return resp.status === HTTPStatus.OK;
}

/**
 * Request to remove a friend
 * @param request_uuid uuid of the user to remove
 * @returns True if succesful, otherwise false
 */
export async function RequestRemoveFriend(request_uuid: string) : Promise<boolean> {
  const resp = await NetAPI.DELETE(`/Friend/${UserData.Uuid}/Remove/${request_uuid}`, new NetHeaders().WithAuthorization(UserData.Token))
  return resp.status === HTTPStatus.OK;
}

/**
 * Request to block a friend
 * @param request_uuid uuid of the user to block
 * @returns True if succesful, otherwise false
 */
export async function RequestBlockFriend(request_uuid: string) : Promise<boolean> {
  const resp = await NetAPI.PATCH(`/Friend/${UserData.Uuid}/Block/${request_uuid}`, "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY));
  return resp.status === HTTPStatus.OK;
}

/**
 * Request to unblock a friend
 * @param request_uuid uuid of the user to unblock
 * @returns True if succesful, otherwise false
 */
export async function RequestUnblockFriend(request_uuid: string) : Promise<boolean> {
  const resp = await NetAPI.PATCH(`/Friend/${UserData.Uuid}/Unblock/${request_uuid}`, "", new NetHeaders().WithAuthorization(UserData.Token).WithContentType(ContentType.EMPTY));
  return resp.status === HTTPStatus.OK;
}
