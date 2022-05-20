import { IRawChannelProps } from "../Interfaces/IRawChannelProps";
import { IMessageProps } from "../Interfaces/IMessageProps";
import MessageAttachment from "../DataTypes/MessageAttachment";
import { Dictionary, Indexable } from "./Dictionary";
import { ContentType, DELETE, GET, GETFile, NCAPIResponse, PATCH, POST, POSTFile, PUT } from "./NCAPI";
import { AESMemoryEncryptData } from "./NCEncrytUtil";
import { GetImageDimensions } from "./Util";
import Dimensions from "../DataTypes/Dimensions";
import IUserData from "../Interfaces/IUserData";
import { SettingsManager } from "./SettingsManager";
import { Base64String } from "./Base64";
import { DecryptBase64, DecryptBase64WithPriv, DecryptUint8Array, EncryptBase64, EncryptBase64WithPub, EncryptUint8Array, GenerateBase64Key } from "./NCEncryptionBeta";
import { NCChannelCache } from "./NCCache";
import { HasFlag } from "./NCFlags";
import GenerateRandomColor from "./ColorGeneration";


// User
export async function GETUser(user_uuid: string) : Promise<IUserData | undefined> {
    const resp = await GET(`User/${user_uuid}`, new SettingsManager().User.token);
    if (resp.status === 200) return resp.payload as IUserData;
    return undefined;
}

export function GETUserChannels(callback: (channels: string[]) => void) {
    GET("/User/@me/Channels", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(resp.payload as string[]);
    });
}

export async function GETUserUUID(username: string, discriminator: string) : Promise<string | undefined> {
    const resp = await GET(`/User/${username}/${discriminator}/UUID`, "", false);
    if (resp.status === 200) return resp.payload;
    return undefined;
}

export function UPDATEUsername(newUsername: string, callback: (status: boolean, newUsername: string) => void) {
    PATCH(`/User/@me/Username`, ContentType.JSON, newUsername, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true, newUsername);
        else callback(false, "");
    });
}

export function UPDATEPassword(newPassword: string, callback: (status: boolean, newPassword: string) => void) {
  PATCH(`/User/@me/Password`, ContentType.JSON, newPassword, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === 200) callback(true, newPassword);
    else callback(false, "");
  });
}

export function UPDATEEmail(newEmail: string, callback: (status: boolean, newEmail: string) => void) {
  PATCH(`/User/@me/Email`, ContentType.JSON, newEmail, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === 200) callback(true, newEmail);
    else callback(false, "");
  });
}

export function DELETEUser(callback: (status: boolean) => void) {
  DELETE(`/User/@me`, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === 200) callback(true);
    else callback(false);
  });
}

// User Keystore
export async function GETKey(key_user_uuid: string) : Promise<string | undefined> {
  const resp = await GET(`/User/@me/Keystore/${key_user_uuid}`, new SettingsManager().User.token);
  if (resp.status === 200) return resp.payload as string;
  return undefined;
}

export async function GETKeystore() : Promise<Dictionary<string> | undefined> {
  const resp = await GET(`/User/@me/Keystore`, new SettingsManager().User.token);
  if (resp.status === 200) {
    const d = new Dictionary<string>();
    d._dict = resp.payload as Indexable<string>
    return d;
  }
  return new Dictionary<string>();
}

export async function SETKey(key_user_uuid: string, key: string) : Promise<boolean> {
  const resp = await POST(`/User/@me/Keystore/${key_user_uuid}`, ContentType.JSON, key, new SettingsManager().User.token);
  if (resp.status === 200) return true;
  return false;
}

// Friend
// TODO Add friend endpoints


// Messages
async function DecryptMessage(message: IMessageProps) : Promise<IMessageProps> {
  const Manager = new SettingsManager();
  const keyData = message.encryptedKeys[Manager.User.uuid];
  if (keyData === undefined) return {message_Id: message.message_Id, content: "Failed to read message"} as IMessageProps;
  const key = await DecryptBase64WithPriv(Manager.User.keyPair.PrivateKey, new Base64String(keyData));
  if (message.content.length !== 0) {
    const decryptedMessage = await DecryptBase64(key, new AESMemoryEncryptData(message.iv, message.content));
    message.content = decryptedMessage.String;
  }
  for (let a = 0; a < message.attachments.length; a++) {
    const attachment = message.attachments[a];
    const content = await GETFile(attachment.contentUrl, Manager.User.token);
    const decryptedContent = await DecryptUint8Array(key, new AESMemoryEncryptData( message.iv, content.payload as Uint8Array));
    message.attachments[a].content = decryptedContent;
  }
  return message;
}

export async function GETMessage(channel_uuid: string, message_id: string, bypass_cache = false) : Promise<undefined | IMessageProps> {
  if (HasFlag("no-cache")) bypass_cache = true;
  const cache = new NCChannelCache(channel_uuid);
  if (!bypass_cache) {
    const message = cache.GetMessage(message_id);
    if ((await message).Satisfied) return (await message).Messages[0];
  }
  const resp = await GET(`Channel/${channel_uuid}/Messages/${message_id}`, new SettingsManager().User.token);
  if (resp.status === 200) {
    const m = await DecryptMessage(resp.payload as IMessageProps);;
    cache.SetMessage(message_id, m)
    return m;
  }
  return undefined;
}

export async function GETMessages(channel_uuid: string, callback: (messages: IMessageProps[]) => void, bypass_cache = false, limit = 30, after = -1, before = 2147483647) {
  //if (HasFlag("no-cache")) bypass_cache = true;
  // Hit cache
  const cache = new NCChannelCache(channel_uuid);
  const messages = await cache.GetMessages(limit, before);
  if (messages.Satisfied && !bypass_cache) {
    callback(messages.Messages);
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
    GET(`Channel/${channel_uuid}/Messages?limit=${newLimit}&after=${after}&before=${newBefore}`, new SettingsManager().User.token).then(async (resp: NCAPIResponse) => {
      if (resp.status === 200) {
        const rawMessages = resp.payload as IMessageProps[];
        const decryptedMessages = [] as  IMessageProps[];
        for (let m = 0; m < rawMessages.length; m++) {
          const message = await DecryptMessage(rawMessages[m]);
          decryptedMessages.push(message);
          if (!bypass_cache) cache.SetMessage(message.message_Id, message);
        }
        callback([...messages.Messages, ...decryptedMessages]);
      }
    });
  }
}

export async function GETMessageEditTimestamps(channel_uuid: string, limit = 30, after = -1, before = 2147483647) : Promise<Dictionary<string>> {
  const resp = await GET(`/Channel/${channel_uuid}/Messages/EditTimestamps?limit=${limit}&after=${after}&before=${before}`, new SettingsManager().User.token);
  return new Dictionary(resp.payload as Indexable<string>);
}

export function SENDMessage(channel_uuid: string, contents: string, rawAttachments: MessageAttachment[], callback: (sent: boolean) => void) {
  const Manager = new SettingsManager();
  GET(`/Channel/${channel_uuid}`, Manager.User.token).then(async (resp: NCAPIResponse) => {
      if (resp.status === 200) {
          const channel = resp.payload as IRawChannelProps;
          if (channel.members === undefined) {
              callback(false);
              return;
          }
          // Generate Key and Encrypt Message
          const messageKey = await GenerateBase64Key(32);
          const encryptedMessage = await EncryptBase64(messageKey, Base64String.CreateBase64String(contents));

          // Handle Attachments
          const attachments = [] as string[];
          for (let a = 0; a < rawAttachments.length; a++) {
              const attachment = rawAttachments[a];
              const imageSize = (await GetImageDimensions(attachment.contents)) || new Dimensions(0, 0);
              const re = await POSTFile(`/Channel/${channel_uuid}?width=${imageSize.width}&height=${imageSize.height}`, new Blob([(await EncryptUint8Array(messageKey, attachment.contents, new Base64String(encryptedMessage.iv))).content]), attachment.filename, Manager.User.token)
              if (re.status === 200) attachments.push(re.payload as string);
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
          const mPost = await POST(`/Channel/${channel_uuid}/Messages`, ContentType.JSON, JSON.stringify({Content: encryptedMessage.content as string, IV: encryptedMessage.iv, EncryptedKeys: encKeys, Attachments: attachments}), Manager.User.token)
          if (mPost.status === 200) callback(true);
          else callback(false);
          return;
      }
      callback(false);
  });
}

export async function EDITMessage(channel_uuid: string, message_id: string, message: string) : Promise<boolean> {
  const Manager = new SettingsManager();
  const oldMessage = await GETMessage(channel_uuid, message_id);
  if (oldMessage === undefined) return false;
  const key = await DecryptBase64WithPriv(Manager.User.keyPair.PrivateKey, new Base64String(oldMessage.encryptedKeys[Manager.User.uuid]));
  const c = await EncryptBase64(key, Base64String.CreateBase64String(message), new Base64String(oldMessage.iv));
  const resp = await PUT(`Channel/${channel_uuid}/Messages/${message_id}`, ContentType.JSON, JSON.stringify({content: c.content}), Manager.User.token);
  if (resp.status === 200) return true;
  return false;
}

export async function DELETEMessage(channel_uuid: string, message_id: string) : Promise<boolean> {
    const resp = await DELETE(`Channel/${channel_uuid}/Messages/${message_id}`, new SettingsManager().User.token);
    if (resp.status === 200) return true;
    return false;
}

// Channels
export async function GETChannel(channel_uuid: string) : Promise<IRawChannelProps | undefined> {
  const resp = await GET(`/Channel/${channel_uuid}`, new SettingsManager().User.token);
  if (resp.status === 200) return resp.payload as IRawChannelProps;
  return undefined;
}

export function CREATEChannel(recipient_uuid: string, callback: (created: boolean) => void) {
    POST(`Channel/CreateChannel?recipient_uuid=${recipient_uuid}`, ContentType.EMPTY, "", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function CREATEGroupChannel(group_name: string, recipients: string[], callback: (created: boolean) => void) {
    POST(`Channel/CreateGroupChannel?group_name=${group_name}`, ContentType.JSON, JSON.stringify(recipients), new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function UPDATEChannelName(channel_uuid: string, newName: string, callback: (updated: boolean) => void)  {
    PATCH(`/Channel/${channel_uuid}/Name?new_name=${newName}`, ContentType.EMPTY, "", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function UPDATEChannelIcon(channel_uuid: string, file: Blob, callback: (updated: boolean) => void) {
    POSTFile(`/Media/Channel/${channel_uuid}/Icon`, file, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function REMOVEChannelIcon(channel_uuid: string, callback: (removed: boolean) => void) {
    POST(`/Media/Channel/${channel_uuid}/ClearIcon`, ContentType.EMPTY, "", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function ADDChannelMember(channel_uuid: string, recipients: string[], callback: (added: boolean) => void) {
    PATCH(`Channel/${channel_uuid}`, ContentType.JSON, JSON.stringify(recipients), new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function REMOVEChannelMember(channel_uuid: string, recipient: string, callback: (removed: boolean) => void) {
    DELETE(`/Channel/${channel_uuid}/Members?recipient=${recipient}`, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function ARCHIVEChannel(channel_uuid: string, callback: (archived: boolean) => void) {
    PATCH(`/Channel/${channel_uuid}/Achrive`, ContentType.EMPTY, "", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function UNARCHIVEChannel(channel_uuid: string, callback: (archived: boolean) => void) {
    PATCH(`/Channel/${channel_uuid}/Unachrive`, ContentType.EMPTY, "", new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function DELETEChannel(channel_uuid: string, callback: (deleted: boolean) => void) {
    DELETE(`/Channel/${channel_uuid}`, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

// Media

export function SETAvatar(user_uuid: string, file: Blob, callback: (set: boolean) => void) {
    POSTFile(`/Media/Avatar/${user_uuid}`, file, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function SETChannelIcon(channel_uuid: string, file: Blob, callback: (set: boolean) => void) {
    POSTFile(`/Media/Channel/${channel_uuid}`, file, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export async function GETChannelName(channel_uuid: string) : Promise<string | undefined> {
    const resp = await GET(`/Channel/${channel_uuid}`, new SettingsManager().User.token);
    if (resp.status === 200) return (resp.payload as IRawChannelProps).channelName;
    return undefined;
}
