import { Flags, HasUrlFlag } from "Lib/Debug/Flags";
import NSPerformace from "Lib/Debug/NSPerformace";
import { AESDecrypt, AESEncrypt, GetAESKey } from "Lib/Encryption/AES";
import { RSADecrypt, RSAEncrypt } from "Lib/Encryption/RSA";
import { AESMemoryEncryptData } from "Lib/Encryption/Types/AESMemoryEncryptData";
import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";
import { ChannelCache } from "Lib/Storage/Objects/ChannelCache";
import UserData from "Lib/Storage/Objects/UserData";
import { IMessageProps } from "Types/API/Interfaces/IMessageProps";
import { ContentType, DELETE, GET, HTTPStatusCodes, NCAPIResponse, POST, POSTFile, PUT } from "Lib/API/NCAPI";
import { Dictionary, Indexable } from "Lib/Objects/Dictionary";
import MessageAttachment from "Types/API/MessageAttachment";
import FailedUpload, { FailReason } from "Types/API/FailedUpload";
import { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import Dimensions from "Types/Dimensions";
import { GetImageSize } from "Lib/Utility/ContentUtility";
import { RemoveEXIF } from "Lib/EXIF";
import KeyStore from "Lib/Storage/Objects/KeyStore";
import { GetFileExtension } from "Lib/Utility/Utility";


async function DecryptMessage(message: IMessageProps) : Promise<IMessageProps> {
  const perf = new NSPerformace("DecryptMessage");
  const keyData = message.encryptedKeys[UserData.Uuid];
  if (keyData === undefined) {
    message.encrypted = false;
    perf.Stop();
    return message;
  }
  message.encrypted = (HasUrlFlag(Flags.TreatAsUnencrypted))? false : true;

  const key = await RSADecrypt(UserData.KeyPair.PrivateKey, new Base64Uint8Array(keyData));
  if (message.content.length !== 0) {
    const decryptedMessage = await AESDecrypt(key, new AESMemoryEncryptData(new Base64Uint8Array(message.iv), new Base64Uint8Array(message.content)));
    message.content = decryptedMessage.String;
  }
  if (!HasUrlFlag(Flags.NoAttachments)) {
    for (let a = 0; a < message.attachments.length; a++) {
      const attachment = message.attachments[a];
      const filename = attachment.filename;
      const att_key = await RSADecrypt(UserData.KeyPair.PrivateKey, new Base64Uint8Array(attachment.keys[UserData.Uuid]));
      const decryptedFilename = await AESDecrypt(att_key, new AESMemoryEncryptData(new Base64Uint8Array(attachment.iv), new Base64Uint8Array(filename)));
      message.attachments[a].filename = decryptedFilename.String;
    }
  }
  perf.Stop();
  return message;
}

/**
 * Request a message from a channel
 * @param channel_uuid Uuid of the channel to request the message from
 * @param message_id Id of the message to request
 * @param bypass_cache Default false; True to skip checking cache
 * @returns Undefined if unable to find message, otherwise a IMessageProps object
 */
export async function RequestMessage(channel_uuid: string, message_id: string, bypass_cache = false) : Promise<undefined | IMessageProps> {
  if (HasUrlFlag(Flags.NoCache)) bypass_cache = true;
  const cache = (await ChannelCache.Open(channel_uuid));
  if (!bypass_cache) {
    const message = cache.GetMessage(message_id);
    if ((await message).Satisfied) return (await message).Messages[0];
  }
  const resp = await GET(`Channel/${channel_uuid}/Messages/${message_id}`, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) {
    const m = await DecryptMessage(resp.payload as IMessageProps);
    cache.SetMessage(message_id, m);
    return m;
  }
  return undefined;
}

// TODO: Organise this function
/**
 * Requests a range of messages from a channel
 * @param channel_uuid Uuid of the channel to request messages from
 * @param callback Function to call when the request completes, has the requested list of messages
 * @param bypass_cache Default false; True to skip checking cache
 * @param limit Maximum number of message to request (Default 30)
 * @param after Request messages after this Id (Default -1)
 * @param before Request messages before this id (Default 2147483647)
 * @returns The request list of messages
 */
export async function RequestMessages(channel_uuid: string, callback: (messages: IMessageProps[]) => void, bypass_cache = false, limit = 30, after = -1, before = 2147483647) : Promise<IMessageProps[]> {
  if (HasUrlFlag(Flags.NoCache)) bypass_cache = true;
  // Hit cache
  const perf = new NSPerformace("GETMessagesAPI");
  const cache = (await ChannelCache.Open(channel_uuid));
  const messages = await cache.GetMessages(limit, before);
  if (!bypass_cache) {
    callback(messages.Messages);
    perf.Stop();
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
    const resp = await GET(`Channel/${channel_uuid}/Messages?limit=${newLimit}&after=${after}&before=${newBefore}`, UserData.Token);
    if (resp.status === HTTPStatusCodes.OK) {
      const rawMessages = resp.payload as IMessageProps[];
      const decryptedMessages = [] as IMessageProps[];
      for (let m = 0; m < rawMessages.length; m++) {
        const message = await DecryptMessage(rawMessages[m]);
        decryptedMessages.push(message);
        await cache.SetMessage(message.message_Id, message);
      }
      const callPerf = new NSPerformace("GETMessageCallback");
      callback([...messages.Messages, ...decryptedMessages]);
      callPerf.Stop();
      perf.Stop();
      return [...messages.Messages, ...decryptedMessages];
    }
    callback([])
    perf.Stop();
    return [];
  }
}

/**
 * Requests a range of timestamps from a channel
 * @param channel_uuid Uuid of the channel to request timestamps from
 * @param limit Maximum number of message to request (Default 30)
 * @param after Request messages after this Id (Default -1)
 * @param before Request messages before this id (Default 2147483647)
 * @returns A dictionary of message ids to timestamps
 */
export async function RequestMessageTimestamps(channel_uuid: string, limit = 30, after = -1, before = 2147483647) : Promise<Dictionary<string, string>> {
  const resp = await GET(`/Channel/${channel_uuid}/Messages/EditTimestamps?limit=${limit}&after=${after}&before=${before}`, UserData.Token);
  return new Dictionary(resp.payload as Indexable<string, string>);
}

/**
 * Sends a message to the given channel
 * @param channel_uuid Uuid of the channel to request timestamps from
 * @param contents Contenst of the message
 * @param rawAttachments A list of attached files
 * @param callback Function to call when the request completes
 */
export async function SendMessage(channel_uuid: string, contents: string, rawAttachments: MessageAttachment[], callback: (sent: boolean, failedUploads: FailedUpload[]) => void) {
  GET(`/Channel/${channel_uuid}`, UserData.Token).then(async (resp: NCAPIResponse) => {
    if (resp.status === HTTPStatusCodes.OK) {
      const channel = resp.payload as IRawChannelProps;
      if (channel.members === undefined) {
        callback(false, [] as FailedUpload[]);
        return;
      }
      // Generate Key and Encrypt Message
      const messageKey = await GetAESKey(32);
      const encryptedMessage = await AESEncrypt(messageKey, Base64Uint8Array.FromString(contents.trim()));

      // Handle Attachments
      const failedUploads = [] as FailedUpload[];
      const attachments = [] as string[];
      let token = "empty";
      if (rawAttachments.length > 0) {
        const postToken = await GET(`/Channel/${channel_uuid}/RequestContentToken?uploads=${rawAttachments.length}`, UserData.Token, false);
        token = postToken.payload;
        if (postToken.status !== HTTPStatusCodes.OK) return;
        for (let a = 0; a < rawAttachments.length; a++) {

          // Generate Attachment key and encrypt with everyone's pub key
          const attachmentKey = await GetAESKey(32);

          const attachment = rawAttachments[a];

          // Image Size
          const imageSize = (await GetImageSize(attachment.contents)) || new Dimensions(0, 0);

          // Encrypted Attachment
          const encAttachment = (await AESEncrypt(attachmentKey, RemoveEXIF(attachment.contents as Base64Uint8Array)));

          // Encrypted Filename
          const encFilename = await AESEncrypt(attachmentKey, Base64Uint8Array.FromString(attachment.filename), encAttachment.iv);


          // Generate keys for each user of the channel
          const encKeys = {} as {[uuid: string]: string};
          for (let m = 0; m < channel.members.length; m++) {
            const member = channel.members[m];
            const pubKey = await KeyStore.GetKey(member);
            if (pubKey !== undefined) {
              const encryptedKey = await RSAEncrypt(pubKey, attachmentKey);
              encKeys[member] = encryptedKey.Base64;
            }
          }

          encKeys[UserData.Uuid] = (await RSAEncrypt(UserData.KeyPair.PublicKey, attachmentKey)).Base64;

          const re = await POSTFile(`/Channel/${channel_uuid}?width=${imageSize.width}&height=${imageSize.height}&contentToken=${token}&fileType=${GetFileExtension(attachment.filename)}`, new Blob([encAttachment.content]), encFilename.content.Base64, JSON.stringify(encKeys), encAttachment.iv.Base64, UserData.Token)
          if (re.status === HTTPStatusCodes.OK) attachments.push(re.payload as string);
          else failedUploads.push(new FailedUpload(re.status as FailReason, attachment.filename, attachment.id));
        }
      }
      const encKeys = {} as {[uuid: string]: string};
      for (let m = 0; m < channel.members.length; m++) {
        const member = channel.members[m];
        if (member !== UserData.Uuid) {
          const pubKey = await KeyStore.GetKey(member);
          if (pubKey !== undefined) {
            const encryptedKey = await RSAEncrypt(pubKey, messageKey);
            encKeys[member] = encryptedKey.Base64;
          }
        }
      }
      encKeys[UserData.Uuid] = (await RSAEncrypt(UserData.KeyPair.PublicKey, messageKey)).Base64;
      const mPost = await POST(`/Channel/${channel_uuid}/Messages?contentToken=${token}`, ContentType.JSON, JSON.stringify({Content: encryptedMessage.content.Base64, IV: encryptedMessage.iv.Base64, EncryptedKeys: encKeys, Attachments: attachments}), UserData.Token)
      if (mPost.status === HTTPStatusCodes.OK || failedUploads.length === 0) callback(true, [] as FailedUpload[]);
      else callback(false, failedUploads);
      return;
    }
  });
}

/**
 * Requests to edit a message in the given channel
 * @param channel_uuid Uuid of the channel to request the message from
 * @param message_id Id of the message to request
 * @param message New message contents
 * @returns True if successful, otherwise False
 */
export async function RequestEditMessage(channel_uuid: string, message_id: string, message: string) : Promise<boolean> {
  const oldMessage = await RequestMessage(channel_uuid, message_id);
  if (oldMessage === undefined) return false;
  const key = await RSADecrypt(UserData.KeyPair.PrivateKey, new Base64Uint8Array(oldMessage.encryptedKeys[UserData.Uuid]));
  const c = await AESEncrypt(key, Base64Uint8Array.FromString(message), new Base64Uint8Array(oldMessage.iv));
  const resp = await PUT(`Channel/${channel_uuid}/Messages/${message_id}`, ContentType.JSON, JSON.stringify({content: c.content}), UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) return true;
  return false;
}

/**
 * Requests to delete a message in the given channel
 * @param channel_uuid Uuid of the channel to request the message from
 * @param message_id Id of the message to request
 * @returns True if sucess, otherwise False
 */
export async function RequestDeleteMessage(channel_uuid: string, message_id: string) : Promise<boolean> {
  const resp = await DELETE(`Channel/${channel_uuid}/Messages/${message_id}`, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) return true;
  return false;
}

/**
 * Requests to delete a attachment from a message
 * @param channel_uuid Uuid of the channel to request the message from
 * @param message_id Id of the message to request
 * @param attachment_uuid Uuid of the attachment
 */
export async function RequestDeleteAttachment(channel_uuid: string, message_id: string, attachment_uuid: string) : Promise<boolean> {
  const resp = await DELETE(`Channel/${channel_uuid}/Messages/${message_id}/Attachments/${attachment_uuid}`, UserData.Token);
  if (resp.status === HTTPStatusCodes.OK) return true;
  return false;
}
