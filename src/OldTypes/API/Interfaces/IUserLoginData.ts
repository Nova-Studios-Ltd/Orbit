import { IAESMemoryEncryptData } from "Lib/Encryption/Types/AESMemoryEncryptData";

export default interface IUserLoginData {
  uuid: string,
  token: string,
  email: string,
  publicKey: string,
  key: IAESMemoryEncryptData
}
