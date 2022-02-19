import { IMessageProps } from "../DataTypes/IMessageProps";
import { Dictionary, Indexable } from "./Dictionary";
import { ContentType, DELETE, GET, NCAPIResponse, PATCH, POST } from "./NCAPI";


// TODO Add token fetching
// User
export async function GETUser(user_uuid: string) : Promise<string | undefined> {
    const resp = await GET(`User/${user_uuid}`, "");
    if (resp.status === 200) return resp.payload;
    return undefined;
}

export function GETUserChannels(callback: (channels: string[]) => void) {
    GET("/User/Channels", "").then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(resp.payload as string[]);
    });
}

export async function GETUserUUID(username: string, discriminator: string) : Promise<string | undefined> {
    const resp = await GET(`/User/${username}/${discriminator}`, "");
    if (resp.status === 200) return resp.payload;
    return undefined;
}

export function UPDATEUsername(user_uuid: string, newUsername: string, callback: (status: boolean, newUsername: string) => void) {
    PATCH(`/User/${user_uuid}/Username`, ContentType.JSON, newUsername, "").then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true, newUsername);
        else callback(false, "");
    });
}

export function UPDATEPassword(user_uuid: string, newPassword: string, callback: (status: boolean, newPassword: string) => void) {
    PATCH(`/User/${user_uuid}/Password`, ContentType.JSON, newPassword, "").then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true, newPassword);
        else callback(false, "");
    });
}

export function UPDATEEmail(user_uuid: string, newEmail: string, callback: (status: boolean, newEmail: string) => void) {
    PATCH(`/User/${user_uuid}/Email`, ContentType.JSON, newEmail, "").then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true, newEmail);
        else callback(false, "");
    });
}

export function DELETEUser(user_uuid: string, callback: (status: boolean) => void) {
    DELETE(`/User/${user_uuid}`, "").then((resp: NCAPIResponse) => {
        if (resp.status === 200) callback(true);
        else callback(false);
    });
}

// User Keystore
export async function GETKey(user_uuid: string, key_user_uuid: string) : Promise<string | undefined> {
    const resp = await GET(`/User/${user_uuid}/Keystore/${key_user_uuid}`, "");
    if (resp.status === 200) return resp.payload as string;
    return undefined;
}

export async function GETKeystore(user_uuid: string) : Promise<Dictionary<string> | undefined> {
    const resp = await GET(`/User/${user_uuid}/Keystore`, "");
    if (resp.status === 200) {
        const d = new Dictionary<string>();
        d._dict = resp.payload as Indexable<string>
        return d;
    }
    return new Dictionary<string>();
}

export async function SETKey(user_uuid: string, key_user_uuid: string, key: string) : Promise<boolean> {
    const resp = await POST(`/User/${user_uuid}/Keystore/${key_user_uuid}`, ContentType.JSON, key, "");
    if (resp.status === 200) return true;
    return false;
}

// Friend
// TODO Add friend endpoints


// Messages
export async function GETMessage(channel_uuid: string, message_id: string) : Promise<unknown> {
    const resp = await GET(`Message/${channel_uuid}/Messages/${message_id}`, "");
    if (resp.status === 200) {
        const rawMessage = resp.payload as IMessageProps;
        return undefined;
    }
    return undefined;
}