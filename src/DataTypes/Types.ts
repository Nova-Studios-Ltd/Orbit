import { IAESMemoryEncryptData } from "../NSLib/NCEncrytUtil";

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