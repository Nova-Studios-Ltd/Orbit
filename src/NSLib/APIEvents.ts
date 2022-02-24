import { IChannelProps } from "../Interfaces/IChannelProps";
import { IMessageProps } from "../Interfaces/IMessageProps";
import MessageAttachment from "../DataTypes/MessageAttachment";
import { Dictionary, Indexable } from "./Dictionary";
import { ContentType, DELETE, GET, GETFile, NCAPIResponse, PATCH, POST, POSTFile } from "./NCAPI";
import { DecryptStringUsingAES, DecryptUint8ArrayUsingAES, DecryptUsingPrivKey, EncryptUint8ArrayUsingAES, EncryptStringUsingAES, EncryptUsingPubKey, GenerateKey } from "./NCEncryption";
import { AESMemoryEncryptData } from "./NCEncrytUtil";
import { SettingsManager } from "./SettingsManager";
import { GetImageDimensions } from "./Util";
import Dimensions from "../DataTypes/Dimensions";


// HACK Temporary settings manager
const settings = new SettingsManager();

// TODO Add token fetching
// User
export async function GETUser(user_uuid: string) : Promise<string | undefined> {
    const resp = await GET(`User/${user_uuid}`, settings.User.token);
    if (resp.status === 200) return resp.payload;
    return undefined;
}

export function GETUserChannels(callback: (channels: string[]) => void) {
    GET("/User/Channels", settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(resp.payload as string[]);
    });
}

export async function GETUserUUID(username: string, discriminator: string) : Promise<string | undefined> {
    const resp = await GET(`/User/${username}/${discriminator}`, "");
    if (resp.status === 200) return resp.payload;
    return undefined;
}

export function UPDATEUsername(user_uuid: string, newUsername: string, callback: (status: boolean, newUsername: string) => void) {
    PATCH(`/User/${user_uuid}/Username`, ContentType.JSON, newUsername, settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true, newUsername);
        else callback(false, "");
    });
}

export function UPDATEPassword(user_uuid: string, newPassword: string, callback: (status: boolean, newPassword: string) => void) {
    PATCH(`/User/${user_uuid}/Password`, ContentType.JSON, newPassword, settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true, newPassword);
        else callback(false, "");
    });
}

export function UPDATEEmail(user_uuid: string, newEmail: string, callback: (status: boolean, newEmail: string) => void) {
    PATCH(`/User/${user_uuid}/Email`, ContentType.JSON, newEmail, settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true, newEmail);
        else callback(false, "");
    });
}

export function DELETEUser(user_uuid: string, callback: (status: boolean) => void) {
    DELETE(`/User/${user_uuid}`, settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

// User Keystore
export async function GETKey(user_uuid: string, key_user_uuid: string) : Promise<string | undefined> {
    const resp = await GET(`/User/${user_uuid}/Keystore/${key_user_uuid}`, settings.User.token);
    if (resp.status === 200) return resp.payload as string;
    return undefined;
}

export async function GETKeystore(user_uuid: string) : Promise<Dictionary<string> | undefined> {
    const resp = await GET(`/User/${user_uuid}/Keystore`, settings.User.token);
    if (resp.status === 200) {
        const d = new Dictionary<string>();
        d._dict = resp.payload as Indexable<string>
        return d;
    }
    return new Dictionary<string>();
}

export async function SETKey(user_uuid: string, key_user_uuid: string, key: string) : Promise<boolean> {
    const resp = await POST(`/User/${user_uuid}/Keystore/${key_user_uuid}`, ContentType.JSON, key, settings.User.token);
    if (resp.status === 200) return true;
    return false;
}

// Friend
// TODO Add friend endpoints


// Messages

async function DecryptMessage(message: IMessageProps) : Promise<IMessageProps> {
    const key = await DecryptUsingPrivKey(settings.User.keyPair.PrivateKey, message.encryptedKeys[settings.User.uuid]);
    if (message.content.length !== 0) {
        const decryptedMessage = await DecryptStringUsingAES(key, new AESMemoryEncryptData(message.iv, message.content));
        message.content = decryptedMessage;
    }
    for (let a = 0; a < message.attachments.length; a++) {
        const attachment = message.attachments[a];
        const content = await GETFile(attachment.contentUrl, settings.User.token);
        const decryptedContent = await DecryptUint8ArrayUsingAES(key, content.payload as Uint8Array, message.iv);
        message.attachments[a].content = decryptedContent;
    }
    return message;
}

export async function GETMessage(channel_uuid: string, message_id: string) : Promise<undefined | IMessageProps> {
    const resp = await GET(`Message/${channel_uuid}/Messages/${message_id}`, settings.User.token);
    if (resp.status === 200) {
        return await DecryptMessage(resp.payload as IMessageProps);
    }
    return undefined;
}

export function GETMessages(channel_uuid: string, limit = 30, before = 2147483647, callback: (messages: IMessageProps[]) => void) {
    GET(`Message/${channel_uuid}/Messages?limit=${limit}&before=${before}`, settings.User.token).then(async (resp: NCAPIResponse) => {
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
    GET(`/Channel/${channel_uuid}`, settings.User.token).then(async (resp: NCAPIResponse) => {
        if (resp.status === 200) {
            const channel = resp.payload as IChannelProps;
            if (channel.members === undefined) {
                callback(false);
                return;
            }
            // Generate Key and Encrypt Message
            const messageKey = await GenerateKey(32);
            const encryptedMessage = await EncryptStringUsingAES(messageKey, contents);

            // Handle Attachments
            const attachments = [] as string[];
            for (let a = 0; a < rawAttachments.length; a++) {
                const attachment = rawAttachments[a];
                const imageSize = (await GetImageDimensions(attachment.contents)) || new Dimensions(0, 0);
                const re = await POSTFile(`Media/Channel/${channel_uuid}?width=${imageSize.width}&height=${imageSize.height}`, new Blob([(await EncryptUint8ArrayUsingAES(messageKey, attachment.contents, encryptedMessage.iv)).content]))
                if (re.status === 200) attachments.push(resp.payload as string);
            }
            const encKeys = {} as {[uuid: string]: string};
            for (let m = 0; m < channel.members.length; m++) {
                const member = channel.members[m];
                if (member !== settings.User.uuid) {
                    const pubKey = settings.User.keystore.getValue(member);
                    if (pubKey !== undefined) {
                        const encryptedKey = await EncryptUsingPubKey(pubKey, messageKey);
                        encKeys[member] = encryptedKey;
                    }
                }
            }
            encKeys[settings.User.uuid] = await EncryptUsingPubKey(settings.User.keyPair.PublicKey, messageKey);
            const mPost = await POST(`/Message/${channel_uuid}/Messages`, ContentType.JSON, JSON.stringify({Content: encryptedMessage.content as string, IV: encryptedMessage.iv, EncryptedKeys: encKeys, Attachments: attachments}))
            if (mPost.status === 200) callback(true);
            else callback(false);
            return;
        }
        callback(false);
    });
}

export async function EDITMessage(channel_uuid: string, message_id: string, message: string, encryptedKeys: {[uuid: string]: string;}, iv: string) : Promise<boolean> {
    const key = await DecryptUsingPrivKey(settings.User.keyPair.PrivateKey, encryptedKeys[settings.User.uuid]);
    const c = await EncryptStringUsingAES(key, message, iv);
    const resp = await POST(`Message/${channel_uuid}/Messages/${message_id}`, ContentType.JSON, JSON.stringify({content: c.content}), settings.User.token);
    if (resp.status === 200) return true;
    return false;
}

export async function DELETEMessage(channel_uuid: string, message_id: string) : Promise<boolean> {
    const resp = await DELETE(`Message/${channel_uuid}/Messages/${message_id}`, settings.User.token);
    if (resp.status === 200) return true;
    return false;
}

// Channels
export async function GETChannel(channel_uuid: string) : Promise<IChannelProps | undefined> {
    const resp = await GET(`/Channel/${channel_uuid}`, settings.User.token);
    if (resp.status === 200) return resp.payload as IChannelProps;
    return undefined;
}

export function CREATEChannel(recipient_uuid: string, callback: (created: boolean) => void) {
    POST(`Channel/CreateChannel?recipient_uuid=${recipient_uuid}`, ContentType.EMPTY, "", settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function CREATEGroupChannel(group_name: string, recipients: string[], callback: (created: boolean) => void) {
    POST(`Channel/CreateGroupChannel?group_name=${group_name}`, ContentType.JSON, JSON.stringify(recipients), settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function UPDATEChannelName(channel_uuid: string, newName: string, callback: (updated: boolean) => void)  {
    PATCH(`/Channel/${channel_uuid}/Name?new_name=${newName}`, ContentType.EMPTY, "", settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function UPDATEChannelIcon(channel_uuid: string, file: Blob, callback: (updated: boolean) => void) {
    POSTFile(`/Media/Channel/${channel_uuid}/Icon`, file, settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}
  
export function REMOVEChannelIcon(channel_uuid: string, callback: (removed: boolean) => void) {
    POST(`/Media/Channel/${channel_uuid}/ClearIcon`, ContentType.EMPTY, "", settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function ADDChannelMember(channel_uuid: string, recipients: string[], callback: (added: boolean) => void) {
    PATCH(`Channel/${channel_uuid}`, ContentType.JSON, JSON.stringify(recipients), settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function REMOVEChannelMember(channel_uuid: string, recipient: string, callback: (removed: boolean) => void) {
    DELETE(`/Channel/${channel_uuid}/Members?recipient=${recipient}`, settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function ARCHIVEChannel(channel_uuid: string, callback: (archived: boolean) => void) {
    PATCH(`/Channel/${channel_uuid}/Achrive`, ContentType.EMPTY, "", settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function UNARCHIVEChannel(channel_uuid: string, callback: (archived: boolean) => void) {
    PATCH(`/Channel/${channel_uuid}/Unachrive`, ContentType.EMPTY, "", settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function DELETEChannel(channel_uuid: string, callback: (deleted: boolean) => void) {
    DELETE(`/Channel/${channel_uuid}`, settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

// Media

export function SETAvatar(user_uuid: string, file: Blob, callback: (set: boolean) => void) {
    POSTFile(`/Media/Avatar/${user_uuid}`, file, settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export function SETChannelIcon(channel_uuid: string, file: Blob, callback: (set: boolean) => void) {
    POSTFile(`/Media/Channel/${channel_uuid}`, file, settings.User.token).then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

export async function GETChannelName(channel_uuid: string) : Promise<string | undefined> {
    const resp = await GET(`/Channel/${channel_uuid}`, settings.User.token);
    if (resp.status === 200) return (resp.payload as IChannelProps).channelName;
    return undefined;
}