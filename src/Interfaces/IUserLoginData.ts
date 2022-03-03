import { IAESMemoryEncryptData } from "../NSLib/NCEncrytUtil";

export default interface IUserLoginData {
    uuid: string,
    token: string,
    publicKey: string,
    key: IAESMemoryEncryptData
}