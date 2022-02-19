import { IAESMemoryEncryptData } from "../NSLib/NCEncrytUtil";

export type Dimensions = {
    width: number,
    height: number
}

export interface IUserData {
    username: string,
    uuid: string,
    token: string,
    discriminator: string,
    avatarSrc: string
}

export interface IUserLoginData {
    uuid: string,
    token: string,
    publicKey: string,
    key: IAESMemoryEncryptData
}

export interface IMessageDeleteRequestArgs {
    channelID: string,
    messageID: string
}

export interface IOpenFileDialogResults {
    path: string,
    contents?: Buffer
}