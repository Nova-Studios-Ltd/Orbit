import { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import MessageAttachment from "Types/API/MessageAttachment";
import { Dictionary, Indexable } from "./Dictionary";
import { ContentType, DELETE, GET, HTTPStatusCodes, NCAPIResponse, PATCH, POST, POSTFile, PUT } from "./NCAPI";
import { AESMemoryEncryptData } from "./NCEncrytUtil";
import { GetExtension, GetImageDimensions } from "./Util";
import Dimensions from "Types/Dimensions";
import IUserData from "Types/API/Interfaces/IUserData";
import { SettingsManager } from "./SettingsManager";
import { Base64String } from "./Base64";
import { DecryptBase64, DecryptBase64WithPriv, EncryptBase64, EncryptBase64WithPub, EncryptUint8Array, GenerateBase64Key, GenerateBase64SHA256 } from "./NCEncryption";
import { NCChannelCache } from "./NCChannelCache";
import { NCFlags, HasUrlFlag } from "./NCFlags";
import FailedUpload, { FailReason } from "Types/API/FailedUpload";
import { PasswordPayloadKey, UpdatePasswordPayload } from "Types/API/UpdatePasswordPayload";
import { RemoveEXIF } from "./EXIF";
import { API_DOMAIN } from "vars";

// User
export async function GETUser(user_uuid: string) : Promise<IUserData | undefined> {
  const resp = await GET(`User/${user_uuid}`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) return resp.payload as IUserData;
  return undefined;
}

export function GETUserChannels(callback: (channels: string[]) => void) {
  GET("/User/@me/Channels", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(resp.payload as string[]);
  });
}

export async function GETUserUUID(username: string, discriminator: string) : Promise<string | undefined> {
  const resp = await GET(`/User/${username}/${discriminator}/UUID`, "", false);
  if (resp.status === HTTPStatusCodes.OK) return resp.payload;
  return undefined;
}

export function UPDATEUsername(newUsername: string, callback: (status: boolean, newUsername: string) => void) {
  PATCH(`/User/@me/Username`, ContentType.JSON, JSON.stringify(newUsername), new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true, newUsername);
    else callback(false, "");
  });
}

export async function UPDATEPassword(newPassword: string, callback: (status: boolean, newPassword: string) => void) {
  const manager = new SettingsManager();
  const hashedPassword = await GenerateBase64SHA256(newPassword);
  const privkey = await EncryptBase64(hashedPassword, Base64String.CreateBase64String(manager.User.keyPair.PrivateKey));
  const payload = new UpdatePasswordPayload(hashedPassword.Base64, new PasswordPayloadKey(privkey.content as string, privkey.iv));
  PATCH(`/User/@me/Password`, ContentType.JSON, JSON.stringify(payload), new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true, newPassword);
    else callback(false, "");
  });
}

export function UPDATEEmail(newEmail: string, callback: (status: boolean, newEmail: string) => void) {
  PATCH(`/User/@me/Email`, ContentType.JSON, JSON.stringify(newEmail), new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true, newEmail);
    else callback(false, "");
  });
}

export function DELETEUser(callback: (status: boolean) => void) {
  DELETE(`/User/@me`, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

// User Keystore
export async function GETKey(key_user_uuid: string) : Promise<string | undefined> {
  const resp = await GET(`/User/@me/Keystore/${key_user_uuid}`, new SettingsManager().User.token, false);
  if (resp.status === HTTPStatusCodes.OK) return resp.payload as string;
  return undefined;
}

export async function GETKeystore() : Promise<Dictionary<string> | undefined> {
  const resp = await GET(`/User/@me/Keystore`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) {
    const d = new Dictionary<string>();
    d._dict = resp.payload as Indexable<string>
    return d;
  }
  return new Dictionary<string>();
}

export async function SETKey(key_user_uuid: string, key: string) : Promise<boolean> {
  const resp = await POST(`/User/@me/Keystore/${key_user_uuid}`, ContentType.JSON, key, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) return true;
  return false;
}

// Friend
export async function GETFriendState(friend_uuid: string) : Promise<string> {
  const resp = await GET(`/Friend/${new SettingsManager().User.uuid}/Friends/${friend_uuid}`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) {
    return resp.payload.state;
  }
  return "";
}

export async function GETFriends(user_uuid: string) : Promise<Dictionary<string>> {
  const resp = await GET(`/Friend/${user_uuid}/Friends`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) {
    const d = new Dictionary<string>();
    d._dict = resp.payload as Indexable<string>;
    return d;
  }
  return new Dictionary<string>();
}

export async function GETOwnFriends() : Promise<Dictionary<string>> {
  return await GETFriends(new SettingsManager().User.uuid);
}

export async function REQUESTFriend(request_uuid: string) : Promise<boolean> {
  const resp = await POST(`/Friend/${new SettingsManager().User.uuid}/Send/${request_uuid}`, ContentType.EMPTY, "", new SettingsManager().User.token, false);
  return resp.status === HTTPStatusCodes.OK;
}

export async function ACCEPTFriend(request_uuid: string) : Promise<boolean> {
  const resp = await PATCH(`/Friend/${new SettingsManager().User.uuid}/Accept/${request_uuid}`, ContentType.EMPTY, "", new SettingsManager().User.token);
  return resp.status === HTTPStatusCodes.OK;
}

export async function DECLINEFriend(request_uuid: string) : Promise<boolean> {
  const resp = await PATCH(`/Friend/${new SettingsManager().User.uuid}/Decline/${request_uuid}`, ContentType.EMPTY, "", new SettingsManager().User.token);
  return resp.status === HTTPStatusCodes.OK;
}

export async function REMOVEFriend(request_uuid: string) : Promise<boolean> {
  const resp = await DELETE(`/Friend/${new SettingsManager().User.uuid}/Remove/${request_uuid}`, new SettingsManager().User.token)
  return resp.status === HTTPStatusCodes.OK;
}

export async function BLOCKFriend(request_uuid: string) : Promise<boolean> {
  const resp = await PATCH(`/Friend/${new SettingsManager().User.uuid}/Block/${request_uuid}`, ContentType.EMPTY, "", new SettingsManager().User.token);
  return resp.status === HTTPStatusCodes.OK;
}

export async function UNBLOCKFriend(request_uuid: string) : Promise<boolean> {
  const resp = await PATCH(`/Friend/${new SettingsManager().User.uuid}/Unblock/${request_uuid}`, ContentType.EMPTY, "", new SettingsManager().User.token);
  return resp.status === HTTPStatusCodes.OK;
}


// Messages
async function DecryptMessage(message: IMessageProps) : Promise<IMessageProps> {
  const Manager = new SettingsManager();
  const keyData = message.encryptedKeys[Manager.User.uuid];
  if (keyData === undefined) {
    message.encrypted = false;
    return message;
  }
  message.encrypted = (HasUrlFlag(NCFlags.TreatAsUnencrypted))? false : true;
  const key = await DecryptBase64WithPriv(Manager.User.keyPair.PrivateKey, new Base64String(keyData));
  if (message.content.length !== 0) {
    const decryptedMessage = await DecryptBase64(key, new AESMemoryEncryptData(message.iv, message.content));
    message.content = decryptedMessage.String;
  }
  if (!HasUrlFlag(NCFlags.NoAttachments)) {
    for (let a = 0; a < message.attachments.length; a++) {
      const attachment = message.attachments[a];
      const filename = attachment.filename;
      const att_key = await DecryptBase64WithPriv(Manager.User.keyPair.PrivateKey, new Base64String(attachment.keys[Manager.User.uuid]));
      const decryptedFilename = await DecryptBase64(att_key, new AESMemoryEncryptData(attachment.iv, filename));
      message.attachments[a].filename = decryptedFilename.String;
    }
  }
  return message;
}

export async function GETMessage(channel_uuid: string, message_id: string, bypass_cache = false) : Promise<undefined | IMessageProps> {
  if (HasUrlFlag(NCFlags.NoCache)) bypass_cache = true;
  const cache = (await NCChannelCache.Open(channel_uuid));
  if (!bypass_cache) {
    const message = cache.GetMessage(message_id);
    if ((await message).Satisfied) return (await message).Messages[0];
  }
  const resp = await GET(`Channel/${channel_uuid}/Messages/${message_id}`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) {
    const m = await DecryptMessage(resp.payload as IMessageProps);;
    cache.SetMessage(message_id, m)
    return m;
  }
  return undefined;
}

export async function GETMessages(channel_uuid: string, callback: (messages: IMessageProps[]) => void, bypass_cache = false, limit = 30, after = -1, before = 2147483647) : Promise<IMessageProps[]> {
  if (HasUrlFlag(NCFlags.NoCache)) bypass_cache = true;
  // Hit cache
  const cache = (await NCChannelCache.Open(channel_uuid));
  const messages = await cache.GetMessages(limit, before);
  if (messages.Satisfied === true && !bypass_cache) {
    callback(messages.Messages);
    return messages.Messages;
  }
  else {
    if (bypass_cache) {
      messages.Count = 0;
      messages.Messages = [];
    }
    // If cache is missed (or bypassed) or is incomplete
    let newLimit = limit - messages.Count;
    let newBefore = messages.Last_Id;
    if (messages.Count === 0) {
      newLimit = limit;
      newBefore = before;
    }
    const resp = await GET(`Channel/${channel_uuid}/Messages?limit=${newLimit}&after=${after}&before=${newBefore}`, new SettingsManager().User.token);
    if (resp.status === HTTPStatusCodes.OK) {
      const rawMessages = resp.payload as IMessageProps[];
      const decryptedMessages = [] as IMessageProps[];
      for (let m = 0; m < rawMessages.length; m++) {
        const message = await DecryptMessage(rawMessages[m]);
        decryptedMessages.push(message);
        if (!bypass_cache) cache.SetMessage(message.message_Id, message);
      }

      callback([...messages.Messages, ...decryptedMessages]);
      return [...messages.Messages, ...decryptedMessages];
    }
    callback([])
    return [];
  }
}

export async function GETMessagesSingle(channel_uuid: string, callback: (message: IMessageProps) => Promise<boolean>, finished: () => void, bypass_cache = false, limit = 30, after = -1, before = 2147483647) {
  if (HasUrlFlag(NCFlags.NoCache)) bypass_cache = true;
  // Hit cache
  const cache = (await NCChannelCache.Open(channel_uuid));
  const messages = await cache.GetMessages(limit, before);
  if (messages.Satisfied && !bypass_cache) {
    messages.Messages.forEach((message) => callback(message));
  }
  else {
    if (bypass_cache) {
      messages.Count = 0;
      messages.Messages = [];
    }
    // If cache is missed or is incomplete (or bypassed)
    let newLimit = limit - messages.Count;
    let newBefore = messages.Last_Id;
    if (messages.Count === 0) {
      newLimit = limit;
      newBefore = before;
    }
    messages.Messages.forEach((message) => callback(message));
    GET(`Channel/${channel_uuid}/Messages?limit=${newLimit}&after=${after}&before=${newBefore}`, new SettingsManager().User.token).then(async (resp: NCAPIResponse) => {
      if (resp.status === HTTPStatusCodes.OK) {
        const rawMessages = resp.payload as IMessageProps[];
        for (let m = 0; m < rawMessages.length; m++) {
          const message = await DecryptMessage(rawMessages[m]);
          await callback(message);
          if (!bypass_cache) cache.SetMessage(message.message_Id, message);
        }
      }
      finished();
    });
  }
}

export async function GETMessageEditTimestamps(channel_uuid: string, limit = 30, after = -1, before = 2147483647) : Promise<Dictionary<string>> {
  const resp = await GET(`/Channel/${channel_uuid}/Messages/EditTimestamps?limit=${limit}&after=${after}&before=${before}`, new SettingsManager().User.token);
  return new Dictionary(resp.payload as Indexable<string>);
}

export function SENDMessage(channel_uuid: string, contents: string, rawAttachments: MessageAttachment[], callback: (sent: boolean, failedUploads: FailedUpload[]) => void) {
  const Manager = new SettingsManager();
  GET(`/Channel/${channel_uuid}`, Manager.User.token).then(async (resp: NCAPIResponse) => {
      if (resp.status === HTTPStatusCodes.OK) {
          const channel = resp.payload as IRawChannelProps;
          if (channel.members === undefined) {
            callback(false, [] as FailedUpload[]);
            return;
          }
          // Generate Key and Encrypt Message
          const messageKey = await GenerateBase64Key(32);
          const encryptedMessage = await EncryptBase64(messageKey, Base64String.CreateBase64String(contents.trim()));

          // Handle Attachments
          const failedUploads = [] as FailedUpload[];
          const attachments = [] as string[];
          let token = "empty";
          if (rawAttachments.length > 0) {
            const postToken = await GET(`/Channel/${channel_uuid}/RequestContentToken?uploads=${rawAttachments.length}`, Manager.User.token, false);
            token = postToken.payload;
            if (postToken.status !== HTTPStatusCodes.OK) return;
            for (let a = 0; a < rawAttachments.length; a++) {

              // Generate Attachment key and encrypt with everyones pub key
              const attachmentKey = await GenerateBase64Key(32);

              const attachment = rawAttachments[a];

              // Image Size
              const imageSize = (await GetImageDimensions(attachment.contents)) || new Dimensions(0, 0);

              // Encrypted Attachment
              const encAttachment = (await EncryptUint8Array(attachmentKey, RemoveEXIF(attachment.contents)));

              // Encrypted Filename
              const encFilename = await EncryptBase64(attachmentKey, Base64String.CreateBase64String(attachment.filename), new Base64String(encAttachment.iv));


              // Generate keys for each user of the channel
              const encKeys = {} as {[uuid: string]: string};
              for (let m = 0; m < channel.members.length; m++) {
                const member = channel.members[m];
                const pubKey = await Manager.ReadKey(member);
                if (pubKey !== undefined) {
                  const encryptedKey = await EncryptBase64WithPub(pubKey, attachmentKey);
                  encKeys[member] = encryptedKey.Base64;
                }
              }

              encKeys[Manager.User.uuid] = (await EncryptBase64WithPub(Manager.User.keyPair.PublicKey, attachmentKey)).Base64;

              const re = await POSTFile(`/Channel/${channel_uuid}?width=${imageSize.width}&height=${imageSize.height}&contentToken=${token}&fileType=${GetExtension(attachment.filename)}`, new Blob([encAttachment.content]), encFilename.content as string, JSON.stringify(encKeys), encAttachment.iv, Manager.User.token)
              if (re.status === HTTPStatusCodes.OK) attachments.push(re.payload as string);
              else failedUploads.push(new FailedUpload(re.status as FailReason, attachment.filename, attachment.id));
            }
          }
          const encKeys = {} as {[uuid: string]: string};
          for (let m = 0; m < channel.members.length; m++) {
              const member = channel.members[m];
              if (member !== Manager.User.uuid) {
                  const pubKey = await Manager.ReadKey(member);
                  if (pubKey !== undefined) {
                    const encryptedKey = await EncryptBase64WithPub(pubKey, messageKey);
                    encKeys[member] = encryptedKey.Base64;
                  }
              }
          }
          encKeys[Manager.User.uuid] = (await EncryptBase64WithPub(Manager.User.keyPair.PublicKey, messageKey)).Base64;
          const mPost = await POST(`/Channel/${channel_uuid}/Messages?contentToken=${token}`, ContentType.JSON, JSON.stringify({Content: encryptedMessage.content as string, IV: encryptedMessage.iv, EncryptedKeys: encKeys, Attachments: attachments}), Manager.User.token)
          if (mPost.status === HTTPStatusCodes.OK || failedUploads.length === 0) callback(true, [] as FailedUpload[]);
          else callback(false, failedUploads);
          return;
      }
  });
}

export async function EDITMessage(channel_uuid: string, message_id: string, message: string) : Promise<boolean> {
  const Manager = new SettingsManager();
  const oldMessage = await GETMessage(channel_uuid, message_id);
  if (oldMessage === undefined) return false;
  const key = await DecryptBase64WithPriv(Manager.User.keyPair.PrivateKey, new Base64String(oldMessage.encryptedKeys[Manager.User.uuid]));
  const c = await EncryptBase64(key, Base64String.CreateBase64String(message), new Base64String(oldMessage.iv));
  const resp = await PUT(`Channel/${channel_uuid}/Messages/${message_id}`, ContentType.JSON, JSON.stringify({content: c.content}), Manager.User.token);
  if (resp.status === HTTPStatusCodes.OK) return true;
  return false;
}

export async function DELETEMessage(channel_uuid: string, message_id: string) : Promise<boolean> {
  const resp = await DELETE(`Channel/${channel_uuid}/Messages/${message_id}`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) return true;
  return false;
}

export async function DELETEAttachment(channel_uuid: string, message_id: string, attachment_uuid: string) : Promise<boolean> {
  const resp = await DELETE(`Channel/${channel_uuid}/Messages/${message_id}/Attachments/${attachment_uuid}`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) return true;
  return false;
}

// Channels
export async function GETChannel(channel_uuid: string) : Promise<IRawChannelProps | undefined> {
  const resp = await GET(`/Channel/${channel_uuid}`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) return resp.payload as IRawChannelProps;
  return undefined;
}

export function CREATEChannel(recipient_uuid: string, callback: (created: boolean) => void) {
  POST(`Channel/CreateChannel?recipient_uuid=${recipient_uuid}`, ContentType.EMPTY, "", new SettingsManager().User.token, false).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

export function CREATEPrivate(callback: (created: boolean, uuid: string) => void) {
  POST("Channel/CreatePrivate", ContentType.EMPTY, "", new SettingsManager().User.token, false).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true, resp.payload as string);
    else callback(false, "");
  });
}

export function CREATEGroupChannel(group_name: string, recipients: string[], callback: (created: boolean) => void) {
    POST(`Channel/CreateGroupChannel?group_name=${group_name}`, ContentType.JSON, JSON.stringify(recipients), new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === HTTPStatusCodes.OK) callback(true);
        else callback(false);
    });
}

export function UPDATEChannelName(channel_uuid: string, newName: string, callback: (updated: boolean) => void)  {
    PATCH(`/Channel/${channel_uuid}/Name?new_name=${newName}`, ContentType.EMPTY, "", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === HTTPStatusCodes.OK) callback(true);
        else callback(false);
    });
}

export function UPDATEChannelIcon(channel_uuid: string, file: Blob, callback: (updated: boolean) => void) {
    POSTFile(`/Channel/${channel_uuid}/Icon`, file, `Icon_${channel_uuid}`, undefined, undefined, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === HTTPStatusCodes.OK) callback(true);
        else callback(false);
    });
}

export function REMOVEChannelIcon(channel_uuid: string, callback: (removed: boolean) => void) {
    POST(`/Channel/${channel_uuid}/Icon`, ContentType.EMPTY, "", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === HTTPStatusCodes.OK) callback(true);
        else callback(false);
    });
}

export function ADDChannelMember(channel_uuid: string, recipients: string[], callback: (added: boolean) => void) {
  PATCH(`Channel/${channel_uuid}/Members`, ContentType.JSON, JSON.stringify(recipients), new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

export function REMOVEChannelMember(channel_uuid: string, recipient: string, callback: (removed: boolean) => void) {
    DELETE(`/Channel/${channel_uuid}/Members?recipient=${recipient}`, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === HTTPStatusCodes.OK) callback(true);
        else callback(false);
    });
}

export function ARCHIVEChannel(channel_uuid: string, callback: (archived: boolean) => void) {
    PATCH(`/Channel/${channel_uuid}/Achrive`, ContentType.EMPTY, "", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === HTTPStatusCodes.OK) callback(true);
        else callback(false);
    });
}

export function UNARCHIVEChannel(channel_uuid: string, callback: (archived: boolean) => void) {
    PATCH(`/Channel/${channel_uuid}/Unachrive`, ContentType.EMPTY, "", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === HTTPStatusCodes.OK) callback(true);
        else callback(false);
    });
}

export function DELETEChannel(channel_uuid: string, callback: (deleted: boolean) => void) {
  DELETE(`/Channel/${channel_uuid}`, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

// Media

export async function GETContentKeys(content_id: string, channel_uuid: string) : Promise<Dictionary<string> | undefined> {
  const resp = await GET(`Channel/${channel_uuid}/${content_id}/Keys`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) return new Dictionary<string>(resp.payload as Indexable<string>);
  return undefined;
}

export async function GETContentURLKeys(content_url: string) : Promise<Dictionary<string> | undefined> {
  const resp = await GET(`${content_url.replace(API_DOMAIN, "")}/Keys`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) return new Dictionary<string>(resp.payload as Indexable<string>);
  return undefined;
}

export function SETAvatar(user_uuid: string, file: Blob, callback: (set: boolean) => void) {
  POSTFile(`/User/${user_uuid}/Avatar`, file, "Unknown", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

export function SETChannelIcon(channel_uuid: string, file: Blob, callback: (set: boolean) => void) {
  POSTFile(`/Media/Channel/${channel_uuid}`, file, "Unknown", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) callback(true);
    else callback(false);
  });
}

export async function GETChannelName(channel_uuid: string) : Promise<string | undefined> {
  const resp = await GET(`/Channel/${channel_uuid}`, new SettingsManager().User.token);
  if (resp.status === HTTPStatusCodes.OK) return (resp.payload as IRawChannelProps).channelName;
  return undefined;
}

// Diagnostic Endpoints
export async function GETLatency(status: number = HTTPStatusCodes.OK) : Promise<number> {
  const start = Date.now();
  const resp = await GET(`/Events/Ping?status=${status}`, undefined, false);
  if (resp.status === HTTPStatusCodes.OK) {
    return Date.now() - start;
  }
  return Number.MAX_SAFE_INTEGER;
}
