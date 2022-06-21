import { IAESMemoryEncryptData } from "../NSLib/NCEncrytUtil";

export default interface IUserLoginData {
    uuid: string,
    token: string,
    email: string,
    publicKey: string,
    key: IAESMemoryEncryptData
}
