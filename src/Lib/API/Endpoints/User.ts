import IUserData from "Types/API/Interfaces/IUserData";
import UserData from "Lib/Storage/Objects/UserData";
import { ContentType, DELETE, GET, HTTPStatusCodes, NCAPIResponse, PATCH, POSTFile, PUT } from "Lib/API/NCAPI";
import { SHA256 } from "Lib/Encryption/Util";
import { AESEncrypt } from "Lib/Encryption/AES";
import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";
import { PasswordPayloadKey, UpdatePasswordPayload } from "Types/API/UpdatePasswordPayload";
import { ResetPasswordPayload, ResetPasswordPayloadKey } from "Types/API/ResetPasswordPayload";
import { RSAMemoryKeypair } from "Lib/Encryption/Types/RSAMemoryKeypair";

/**
 * Requests a users information
 * @param user_uuid The uuid of the user to request
 * @returns IUserData if successful otherwise undefined
 */
export async function RequestUser(user_uuid: string) : Promise<IUserData | undefined> {
  const resp = await GET(`User/${user_uuid}`, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) return resp.payload as IUserData;
  return undefined;
}

/**
 * Requests a users uuid
 * @param username Username
 * @param discriminator Discriminator
 * @returns A UUID if successful otherwise undefined
 */
export async function RequestUserUUID(username: string, discriminator: string) : Promise<string | undefined> {
  const resp = await GET(`/User/${username}/${discriminator}/UUID`, "", false);
  if (resp.status === HTTPStatusCodes.OK) return resp.payload;
  return undefined;
}

/**
 * Requests the current users channels
 * @param callback Called on success, contains a array of channel uuid's
 */
export async function RequestUserChannels(callback: (channel: string[]) => void) {
  GET("/User/@me/Channels", UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(resp.payload as string[]);
  });
}

/**
 * Requests to change the current users username
 * @param newUsername New username
 * @param callback Calls when the request finishes, return status and the new username
 */
export async function RequestChangeUsername(newUsername: string, callback: (status: boolean, newUsername: string) => void) {
  PATCH(`/User/@me/Username`, ContentType.JSON, JSON.stringify(newUsername), UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true, newUsername);
    else callback(false, "");
  });
}

/**
 * Requests to change the current users password
 * @param newPassword New password
 * @param callback Calls when the request finishes, return status and the new password
 */
export async function RequestChangePassword(newPassword: string, callback: (status: boolean, newPassword: string) => void) {
  const hashedPassword = await SHA256(newPassword);
  const privkey = await AESEncrypt(hashedPassword, new Base64Uint8Array(UserData.KeyPair.PrivateKey));
  const payload = new UpdatePasswordPayload(hashedPassword.Base64, new PasswordPayloadKey(privkey.content.Base64, privkey.iv.Base64));
  PATCH(`/User/@me/Password`, ContentType.JSON, JSON.stringify(payload), UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true, newPassword);
    else callback(false, "");
  });
}

/**
 * Requests to change the current users email
 * @param newEmail New email
 * @param callback Calls when the request finishes, return status and the new email
 */
export async function RequestChangeEmail(newEmail: string, callback: (status: boolean, newEmail: string) => void) {
  PATCH(`/User/@me/Email`, ContentType.JSON, JSON.stringify(newEmail), UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true, newEmail);
    else callback(false, "");
  });
}

/**
 * Requests to reset the current users password, replacing it with the information provided
 * @param newPassword New password
 * @param token Reset token
 * @param keypair New RSA keypair
 * @param callback Called when the request finishes, returns status and the new password
 */
export async function RequestResetPassword(newPassword: string, token: string, keypair: RSAMemoryKeypair, callback: (status: boolean, newPassword: string) => void) {
  const hashedPassword = await SHA256(newPassword);
  const privkey = await AESEncrypt(hashedPassword, new Base64Uint8Array(keypair.PrivateKey));
  const payload = new ResetPasswordPayload(hashedPassword.Base64, new ResetPasswordPayloadKey(privkey.content.Base64, privkey.iv.Base64, keypair.PublicKey));
  PUT(`/User/@me/Reset?tokem=${token}`, ContentType.JSON, JSON.stringify(payload)).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true, newPassword);
    else callback(false, "");
  });
}

/**
 * Request to delete the current users account
 * @param callback Called when the request finishes, returns status
 */
export async function RequestDeleteUser(callback: (status: boolean) => void) {
  DELETE(`/User/@me`, UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

/**
 * Requests the current users avatar be updated to the provided image
 * @param file Image provided as a blob
 * @param callback Called when the requets finishes
 */
export function RequestSetAvatar(file: Blob, callback: (set: boolean) => void) {
  POSTFile(`/User/${UserData.Uuid}/Avatar`, file, "Unknown", undefined, undefined, UserData.Token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

/**
 * Confirms the current users email
 * @param token User token
 * @returns True if succesful, otherwise false
 */
export async function SendConfirmEmail(token: string) : Promise<boolean> {
  const resp = await PUT(`/User/@me/ConfirmEmail?token=${token}`, ContentType.EMPTY, "");
  if (resp.status === HTTPStatusCodes.OK) return true;
  return false;
}
