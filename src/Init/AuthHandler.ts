// Source
import WebsocketInit from "Init/WebsocketEventInit";
import { RequestUserKeystore } from "Lib/API/Endpoints/Keystore";
import { RequestUser } from "Lib/API/Endpoints/User";
import { ContentType, HTTPStatusCodes, POST } from "Lib/API/NCAPI";
import NCWebsocket from "Lib/API/NCWebsocket";
import { Flags, HasUrlFlag } from "Lib/Debug/Flags";
import { AESDecrypt } from "Lib/Encryption/AES";
import { AESMemoryEncryptData } from "Lib/Encryption/Types/AESMemoryEncryptData";
import { RSAMemoryKeypair } from "Lib/Encryption/Types/RSAMemoryKeypair";
import { SHA256 } from "Lib/Encryption/Util";
import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";
import { LocalStorage } from "Lib/Storage/LocalStorage";
import { ChannelCache } from "Lib/Storage/Objects/ChannelCache";
import KeyStore from "Lib/Storage/Objects/KeyStore";
import UserData from "Lib/Storage/Objects/UserData";

// Types
import IUserLoginData from "Types/API/Interfaces/IUserLoginData";
import { LoginStatus } from "Types/Enums";

import { WEBSOCKET_DOMAIN } from "vars";


export let Websocket: NCWebsocket;

export async function LoginNewUser(email: string, password: string) : Promise<LoginStatus> {
  const shaPass = await SHA256(password);

  // Attempt to log user in
  const loginResp = await POST("Auth/Login", ContentType.JSON, JSON.stringify({password: shaPass.Base64, email: email}));
  if (loginResp.status === HTTPStatusCodes.Forbidden) return LoginStatus.InvalidCredentials;
  else if (loginResp.status === HTTPStatusCodes.NotFound) return LoginStatus.UnknownUser;
  else if (loginResp.status === HTTPStatusCodes.ServerError) return LoginStatus.ServerError;
  else if (loginResp.status === HTTPStatusCodes.MethodNotAllowed) return LoginStatus.UnconfirmedEmail;
  const ud = loginResp.payload as IUserLoginData;

  // Store user secruity information (Keypair, token, uuid)
  UserData.Token = ud.token;
  UserData.Uuid = ud.uuid;
  UserData.Email = ud.email;
  UserData.KeyPair = new RSAMemoryKeypair((await AESDecrypt(shaPass, new AESMemoryEncryptData(new Base64Uint8Array(ud.key.iv as string), new Base64Uint8Array(ud.key.content)))).String, ud.publicKey);

  return LoginStatus.Success;
}

export async function AutoLogin() : Promise<boolean> {
  if (!await LocalStorage.ContainsAsync("UUID") || !await LocalStorage.ContainsAsync("Token")) return false;

  // Attempt to retreive user data
  const userResp = await RequestUser("@me");
  if (userResp === undefined) {
    await Logout();
    return false;
  }

  // Store user data
  UserData.AvatarSrc = userResp.avatar;
  UserData.Discriminator = userResp.discriminator;
  UserData.Username = userResp.username;
  UserData.Email = userResp.email;

  if (!HasUrlFlag(Flags.NoWebsocket)) {
    // Setup websocket
    Websocket = new NCWebsocket(`${WEBSOCKET_DOMAIN}/Events/Listen?user_uuid=${UserData.Uuid}`, UserData.Token);
    Websocket.OnConnected = () => console.log("Connected!");
    Websocket.OnTerminated = () => console.log("Terminated!");

    // Init Websocket Events
    WebsocketInit(Websocket);
  }

  // Fetch users keystore
  KeyStore.ClearKeys();
  if (!HasUrlFlag(Flags.NoLocalKeystore)) {
    const keyResp = await RequestUserKeystore();
    if (keyResp === undefined) {
      await Logout();
      return false;
    }
    KeyStore.LoadKeys(keyResp);
  }

  LocalStorage.SetItem("LoggedIn", "false");

  return true;
}

export async function Logout() {
  await ChannelCache.DeleteCaches();
  await LocalStorage.ClearAsync();
}
