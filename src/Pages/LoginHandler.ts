import { ContentType, POST } from "../NSLib/NCAPI";
import { DecryptStringUsingAES, GenerateSHA256Hash } from "../NSLib/NCEncryption";
import NCWebsocket from "../NSLib/NCWebsocket";
import { SettingsManager } from "../NSLib/SettingsManager";
import IUserLoginData from "../Interfaces/IUserLoginData";
import { RSAMemoryKeyPair } from "../NSLib/NCEncrytUtil";
import { GETUser } from "../NSLib/APIEvents";

export const Manager = new SettingsManager();
let Websocket;

export async function Init(email: string, password: string) {
    const shaPass = await GenerateSHA256Hash(password);

    // Attempt to log user in
    const loginResp = await POST("Login", ContentType.JSON, JSON.stringify({password: shaPass, email: email}));
    if (loginResp.status !== 200) return;
    const ud = loginResp.payload as IUserLoginData;

    // Stored user secruity information (Keypair, token, uuid)
    Manager.User.token = ud.token;
    Manager.User.uuid = ud.uuid;
    Manager.User.keyPair = new RSAMemoryKeyPair(await DecryptStringUsingAES(shaPass, ud.key), ud.publicKey);
    
    console.log(ud.token);
    console.log(ud.uuid);


    // Attempt to retreive user data
    const userResp = await GETUser(ud.uuid);
    if (userResp === undefined) return;

    // Store user data
    Manager.User.avatarSrc = userResp.avatar;
    Manager.User.discriminator = userResp.discriminator;
    Manager.User.username = userResp.username;

    Websocket = new NCWebsocket(`api.novastudios.tk/Events/Listen?user_uuid=${Manager.User.uuid}`, Manager.User.token, false);
    Websocket.OnConnected = () => console.log("Connected!");
    Websocket.CreateEvent("-1", () => console.log("<Beat>"));
    // TODO Implement websocket
}