import { ContentType, POST } from "../NSLib/NCAPI";
import { DecryptStringUsingAES, GenerateSHA256Hash } from "../NSLib/NCEncryption";
import NCWebsocket from "../NSLib/NCWebsocket";
import { SettingsManager } from "../NSLib/SettingsManager";
import IUserLoginData from "../Interfaces/IUserLoginData";
import { RSAMemoryKeyPair } from "../NSLib/NCEncrytUtil";
import { GETKeystore, GETUser } from "../NSLib/APIEvents";
import WebsocketInit from "./WebsocketEventInit";

export const Manager = new SettingsManager();
let Websocket;

export async function LoginNewUser(email: string, password: string) : Promise<boolean> {
    const shaPass = await GenerateSHA256Hash(password);

    // Attempt to log user in
    const loginResp = await POST("Login", ContentType.JSON, JSON.stringify({password: shaPass, email: email}));
    if (loginResp.status !== 200) return false;
    const ud = loginResp.payload as IUserLoginData;

    // Stored user secruity information (Keypair, token, uuid)
    Manager.User.token = ud.token;
    Manager.User.uuid = ud.uuid;
    Manager.User.keyPair = new RSAMemoryKeyPair(await DecryptStringUsingAES(shaPass, ud.key), ud.publicKey);
    
    // Store user uuid/token for autologin
    Manager.WriteCookie("UUID", Manager.User.uuid);
    Manager.WriteCookie("Token", Manager.User.token);

    // Attempt to retreive user data
    const userResp = await GETUser(ud.uuid);
    if (userResp === undefined) return false;

    // Store user data
    Manager.User.avatarSrc = userResp.avatar;
    Manager.User.discriminator = userResp.discriminator;
    Manager.User.username = userResp.username;

    // Setup websocket
    Websocket = new NCWebsocket(`api.novastudios.tk/Events/Listen?user_uuid=${Manager.User.uuid}`, Manager.User.token, false);
    Websocket.OnConnected = () => console.log("Connected!");
    Websocket.OnTerminated = () => console.log("Terminated!");
    
    // Fetch users keystore
    const keyResp = await GETKeystore(Manager.User.uuid);
    if (keyResp === undefined) return false;
    Manager.LoadKeys(keyResp);

    // Init Websocket Events
    WebsocketInit(Websocket);

    return true;
}

export async function AutoLogin() : Promise<boolean> {
    if (!await Manager.ContainsCookie("UUID") || !await Manager.ContainsCookie("Token")) return false;
    Manager.User.uuid = await Manager.ReadCookie("UUID");
    Manager.User.token = await Manager.ReadCookie("Token");

    // Attempt to retreive user data
    const userResp = await GETUser(Manager.User.uuid);
    if (userResp === undefined) return false;

    // Store user data
    Manager.User.avatarSrc = userResp.avatar;
    Manager.User.discriminator = userResp.discriminator;
    Manager.User.username = userResp.username;

    // Setup websocket
    Websocket = new NCWebsocket(`api.novastudios.tk/Events/Listen?user_uuid=${Manager.User.uuid}`, Manager.User.token, false);
    Websocket.OnConnected = () => console.log("Connected!");
    Websocket.OnTerminated = () => console.log("Terminated!");
    
    // Fetch users keystore
    const keyResp = await GETKeystore(Manager.User.uuid);
    if (keyResp === undefined) return false;
    Manager.LoadKeys(keyResp);

    // Init Websocket Events
    WebsocketInit(Websocket);

    return true;
}