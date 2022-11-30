import { ContentType, POST } from "../NSLib/NCAPI";
import NCWebsocket from "../NSLib/NCWebsocket";
import IUserLoginData from "Types/API/Interfaces/IUserLoginData";
import { RSAMemoryKeyPair } from "../NSLib/NCEncrytUtil";
import { GETKeystore, GETUser } from "../NSLib/APIEvents";
import WebsocketInit from "./WebsocketEventInit";
import { LoginStatus } from "Types/Enums";
import { DecryptBase64, GenerateBase64SHA256 } from "NSLib/NCEncryption";
import { NCFlags, HasUrlFlag } from "NSLib/NCFlags";
import { NCChannelCache } from "NSLib/NCChannelCache";
import { WEBSOCKET_DOMAIN } from "vars";
import UserData from "DataManagement/UserData";
import KeyStore from "DataManagement/KeyStore";
import { LocalStorage } from "StorageLib/LocalStorage";

export let Websocket: NCWebsocket;

export async function LoginNewUser(email: string, password: string) : Promise<LoginStatus> {
  const shaPass = await GenerateBase64SHA256(password);

  // Attempt to log user in
  const loginResp = await POST("Auth/Login", ContentType.JSON, JSON.stringify({password: shaPass.Base64, email: email}));
  if (loginResp.status === 403) return LoginStatus.InvalidCredentials;
  else if (loginResp.status === 404) return LoginStatus.UnknownUser;
  else if (loginResp.status === 500) return LoginStatus.ServerError;
  const ud = loginResp.payload as IUserLoginData;

  // Stored user secruity information (Keypair, token, uuid)
  UserData.Token = ud.token;
  UserData.Uuid = ud.uuid;
  UserData.Email = ud.email;
  UserData.KeyPair = new RSAMemoryKeyPair((await DecryptBase64(shaPass, ud.key)).String, ud.publicKey);

  return LoginStatus.Success;
}

export async function AutoLogin() : Promise<boolean> {
  if (!await LocalStorage.ContainsAsync("UUID") || !await LocalStorage.ContainsAsync("Token")) return false;

  // Attempt to retreive user data
  const userResp = await GETUser("@me");
  if (userResp === undefined) {
    await Logout();
    return false;
  }

  // Store user data
  UserData.AvatarSrc = userResp.avatar;
  UserData.Discriminator = userResp.discriminator;
  UserData.Username = userResp.username;
  UserData.Email = userResp.email;

  if (!HasUrlFlag(NCFlags.NoWebsocket)) {
    // Setup websocket
    Websocket = new NCWebsocket(`${WEBSOCKET_DOMAIN}/Events/Listen?user_uuid=${UserData.Uuid}`, UserData.Token);
    Websocket.OnConnected = () => console.log("Connected!");
    Websocket.OnTerminated = () => console.log("Terminated!");

    // Init Websocket Events
    WebsocketInit(Websocket);
  }

  // Fetch users keystore
  const keyResp = await GETKeystore();
  if (keyResp === undefined) {
    await Logout();
    return false;
  }
  KeyStore.ClearKeys();
  KeyStore.LoadKeys(keyResp);

  LocalStorage.SetItem("LoggedIn", "false");

  return true;
}

export async function Logout() {
  await NCChannelCache.DeleteCaches();
  await LocalStorage.ClearAsync();
}
