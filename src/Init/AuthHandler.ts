import { ContentType, POST } from "../NSLib/NCAPI";
import NCWebsocket from "../NSLib/NCWebsocket";
import { SettingsManager } from "../NSLib/SettingsManager";
import IUserLoginData from "../Interfaces/IUserLoginData";
import { RSAMemoryKeyPair } from "../NSLib/NCEncrytUtil";
import { GETKeystore, GETUser } from "../NSLib/APIEvents";
import WebsocketInit from "./WebsocketEventInit";
import { ToBase64String, ToUint8Array } from "../NSLib/Base64";
import { LoginStatus } from "DataTypes/Enums";
import { DecryptBase64, GenerateBase64SHA256 } from "NSLib/NCEncryption";
import { HasFlag } from "NSLib/NCFlags";
import { NCChannelCache } from "NSLib/NCChannelCache";
import { WEBSOCKET_DOMAIN } from "vars";

export const Manager = new SettingsManager();
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
  Manager.User.token = ud.token;
  Manager.User.uuid = ud.uuid;
  Manager.User.email = ud.email;
  Manager.User.keyPair = new RSAMemoryKeyPair((await DecryptBase64(shaPass, ud.key)).String, ud.publicKey);

  // Store keypair
  Manager.WriteLocalStorage("Keypair", ToBase64String(ToUint8Array(JSON.stringify(Manager.User.keyPair))));

  return LoginStatus.Success;
}

export async function AutoLogin() : Promise<boolean> {
  if (!await Manager.ContainsLocalStorage("UUID") || !await Manager.ContainsLocalStorage("Token")) return false;

  // Attempt to retreive user data
  const userResp = await GETUser(Manager.User.uuid);
  if (userResp === undefined) {
    await Logout();
    return false;
  }

  // Store user data
  Manager.User.avatarSrc = userResp.avatar;
  Manager.User.discriminator = userResp.discriminator;
  Manager.User.username = userResp.username;
  Manager.User.email = userResp.email;

  if (!HasFlag("no-websocket")) {
    // Setup websocket
    Websocket = new NCWebsocket(`${WEBSOCKET_DOMAIN}/Events/Listen?user_uuid=${Manager.User.uuid}`, Manager.User.token);
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
  Manager.ClearKeys();
  Manager.LoadKeys(keyResp);

  Manager.WriteLocalStorage("LoggedIn", "false");

  return true;
}

export async function Logout() {
  await NCChannelCache.DeleteCaches();
  await Manager.ClearLocalStorage();
  await Manager.ClearCookies()
}
