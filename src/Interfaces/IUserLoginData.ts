import { IAESMemoryEncryptData } from "../NSLib/NCEncrytUtil";

export interface IUserLoginData {
    uuid: string,
    token: string,
    publicKey: string,
    key: IAESMemoryEncryptData
}