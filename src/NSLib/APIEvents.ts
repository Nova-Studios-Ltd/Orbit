import { IRawChannelProps } from "../Interfaces/IRawChannelProps";
import { IMessageProps } from "../Interfaces/IMessageProps";
import MessageAttachment from "../DataTypes/MessageAttachment";
import { Dictionary, Indexable } from "./Dictionary";
import { ContentType, DELETE, GET, GETFile, NCAPIResponse, PATCH, POST, POSTFile } from "./NCAPI";
import { AESMemoryEncryptData } from "./NCEncrytUtil";
import { GetImageDimensions } from "./Util";
import Dimensions from "../DataTypes/Dimensions";
import IUserData from "../Interfaces/IUserData";
import { SettingsManager } from "./SettingsManager";
import { Base64String, FromBase64String, FromUint8Array } from "./Base64";
import { DecryptBase64, DecryptBase64WithPriv, DecryptUint8Array, EncryptBase64, EncryptBase64WithPub, EncryptUint8Array, GenerateBase64Key } from "./NCEncryptionBeta";


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
    const resp = await GET(`/User/${username}/${discriminator}`, "");
    if (resp.status === 200) return resp.payload;
    return undefined;
}

export function UPDATEUsername(user_uuid: string, newUsername: string, callback: (status: boolean, newUsername: string) => void) {
    PATCH(`/User/${user_uuid}/Username`, ContentType.JSON, newUsername, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true, newUsername);
        else callback(false, "");
    });
}

export function UPDATEPassword(user_uuid: string, newPassword: string, callback: (status: boolean, newPassword: string) => void) {
  PATCH(`/User/${user_uuid}/Password`, ContentType.JSON, newPassword, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === 200) callback(true, newPassword);
    else callback(false, "");
  });
}

export function UPDATEEmail(user_uuid: string, newEmail: string, callback: (status: boolean, newEmail: string) => void) {
  PATCH(`/User/${user_uuid}/Email`, ContentType.JSON, newEmail, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === 200) callback(true, newEmail);
    else callback(false, "");
  });
}

export function DELETEUser(user_uuid: string, callback: (status: boolean) => void) {
  DELETE(`/User/${user_uuid}`, new SettingsManager().User.token).then((resp: NCAPIResponse) => {
    if (resp.status === 200) callback(true);
    else callback(false);
  });
}

// User Keystore
export async function GETKey(user_uuid: string, key_user_uuid: string) : Promise<string | undefined> {
  const resp = await GET(`/User/${user_uuid}/Keystore/${key_user_uuid}`, new SettingsManager().User.token);
  if (resp.status === 200) return resp.payload as string;
  return undefined;
}

export async function GETKeystore(user_uuid: string) : Promise<Dictionary<string> | undefined> {
  const resp = await GET(`/User/${user_uuid}/Keystore`, new SettingsManager().User.token);
  if (resp.status === 200) {
    const d = new Dictionary<string>();
    d._dict = resp.payload as Indexable<string>
    return d;
  }
  return new Dictionary<string>();
}

export async function SETKey(user_uuid: string, key_user_uuid: string, key: string) : Promise<boolean> {
  const resp = await POST(`/User/${user_uuid}/Keystore/${key_user_uuid}`, ContentType.JSON, key, new SettingsManager().User.token);
  if (resp.status === 200) return true;
  return false;
}

// Friend
// TODO Add friend endpoints


// Messages
async function DecryptMessage(message: IMessageProps) : Promise<IMessageProps> {
  const Manager = new SettingsManager();
  const key = await DecryptBase64WithPriv(Manager.User.keyPair.PrivateKey, new Base64String(message.encryptedKeys[Manager.User.uuid]));
  if (message.content.length !== 0) {
    // HACK Please for the love of all that is good fix this, it is only to make the client work with old keys and is jank af
    let decryptedMessage = undefined;
    try {
      decryptedMessage = await DecryptBase64(Base64String.CreateBase64String(FromBase64String(FromUint8Array(key.Uint8Array))), new AESMemoryEncryptData(message.iv, message.content));
    }
    catch {
      // This is the correct way to do it
      decryptedMessage = await DecryptBase64(key, new AESMemoryEncryptData(message.iv, message.content));
    }
    message.content = decryptedMessage.String;
  }
  for (let a = 0; a < message.attachments.length; a++) {
    const attachment = message.attachments[a];
    const content = await GETFile(attachment.contentUrl, Manager.User.token);
    // HACK Please fix this, it is only to make the client work with old keys
    try {
      const decryptedContent = await DecryptUint8Array(Base64String.CreateBase64String(FromBase64String(FromUint8Array(key.Uint8Array))), new AESMemoryEncryptData( message.iv, content.payload as Uint8Array));
      message.attachments[a].content = decryptedContent;
    }
    catch {
      const decryptedContent = await DecryptUint8Array(key, new AESMemoryEncryptData( message.iv, content.payload as Uint8Array));
      message.attachments[a].content = decryptedContent;
    }
  }
  return message;
}

export async function GETMessage(channel_uuid: string, message_id: string) : Promise<undefined | IMessageProps> {
  const resp = await GET(`Channel/${channel_uuid}/Messages/${message_id}`, new SettingsManager().User.token);
  if (resp.status === 200) {
      return await DecryptMessage(resp.payload as IMessageProps);
  }
  return undefined;
}

export function GETMessages(channel_uuid: string, callback: (messages: IMessageProps[]) => void, limit = 30, before = 2147483647) {
  GET(`Channel/${channel_uuid}/Messages?limit=${limit}&before=${before}`, new SettingsManager().User.token).then(async (resp: NCAPIResponse) => {
    if (resp.status === 200) {
      const rawMessages = resp.payload as IMessageProps[];
      const decryptedMessages = [] as  IMessageProps[];
      for (let m = 0; m < rawMessages.length; m++) {
          decryptedMessages.push(await DecryptMessage(rawMessages[m]));
      }
      callback(decryptedMessages);
    }
  });
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
              const re = await POSTFile(`/Channel/${channel_uuid}?width=${imageSize.width}&height=${imageSize.height}`, new Blob([(await EncryptUint8Array(messageKey, attachment.contents, new Base64String(encryptedMessage.iv))).content]), attachment.filename)
              if (re.status === 200) attachments.push(resp.payload as string);
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
          const mPost = await POST(`/Message/${channel_uuid}/Messages`, ContentType.JSON, JSON.stringify({Content: encryptedMessage.content as string, IV: encryptedMessage.iv, EncryptedKeys: encKeys, Attachments: attachments}), Manager.User.token)
          if (mPost.status === 200) callback(true);
          else callback(false);
          return;
      }
      callback(false);
  });
}

export async function EDITMessage(channel_uuid: string, message_id: string, message: string, encryptedKeys: {[uuid: string]: string;}, iv: string) : Promise<boolean> {
  const Manager = new SettingsManager();
  const key = await DecryptBase64WithPriv(Manager.User.keyPair.PrivateKey, new Base64String(encryptedKeys[Manager.User.uuid]));
  const c = await EncryptBase64(key, Base64String.CreateBase64String(message), new Base64String(iv));
  const resp = await POST(`Channel/${channel_uuid}/Messages/${message_id}`, ContentType.JSON, JSON.stringify({content: c.content}), Manager.User.token);
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
