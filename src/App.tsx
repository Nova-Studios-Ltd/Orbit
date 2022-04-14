import { useState } from "react";
import { Popover, ThemeProvider } from "@mui/material";
import { SettingsManager } from "NSLib/SettingsManager";
import { DownloadFile, UploadFile } from "NSLib/ElectronAPI";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { AutoLogin, Manager } from "./Init/AuthHandler";
import { DarkTheme_Default } from "Theme";
import { Localizations } from "Localization/Localizations";

import AuthView from "Views/AuthView/AuthView";
import ErrorView from "Views/ErrorView/ErrorView";
import MainView from "Views/MainView/MainView";

import { AuthViewRoutes, MainViewRoutes } from "DataTypes/Routes";
import type { ReactNode } from "react";
import type { HelpPopupProps } from "DataTypes/Components";
import { ChannelType } from "DataTypes/Enums";
import type { IRawChannelProps } from "Interfaces/IRawChannelProps";

import "./App.css";
import { DecryptBase64StringUsingAES, DecryptUsingPrivKey, EncryptStringUsingAES, EncryptUsingPubKey, GenerateKey, GenerateRSAKeyPair, GenerateSHA256Hash } from "NSLib/NCEncryption";
import { Base64String, FromBase64String, FromUint8Array, ToUint8Array } from "NSLib/Base64";
import { DecryptBase64, DecryptBase64WithPriv, EncryptBase64, EncryptBase64WithPub, GenerateBase64Key, GenerateBase64SHA256, GenereateSHA256 } from "NSLib/NCEncryptionBeta";
import { AESMemoryEncryptData } from "NSLib/NCEncrytUtil";

i18n.use(initReactI18next)
.init({
  resources: Localizations,
  lng: "en", // TODO: Remove this and add a language selection system later
  fallbackLng: "en"
});

function App() {

  const [widthConstrained, setWidthConstrainedState] = useState(window.matchMedia("(max-width: 600px)").matches);
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [helpVisible, setHelpVisibility] = useState(false);
  const [helpAnchorEl, setHelpAnchor] = useState(null as unknown as Element);
  const [helpContent, setHelpContent] = useState(null as unknown as ReactNode);

  const HelpPopup: HelpPopupProps = {
    visible: helpVisible,
    anchorEl: helpAnchorEl,
    content: helpContent,
    setVisibility: setHelpVisibility,
    setAnchor: setHelpAnchor,
    setContent: setHelpContent
  };

  Manager.ContainsCookie("LoggedIn").then(async (value: boolean) => {
    if (!value) return;
    if (!location.pathname.toLowerCase().includes("/chat")) {
      Manager.WriteCookie("LoggedIn", "false");
      navigate("/chat");
    }
    /*const loggedIn = await AutoLogin();
    if (loggedIn && !location.pathname.toLowerCase().includes("/chat")) {
      Manager.WriteCookie("LoggedIn", "false");
      navigate("/chat");
    }*/
  });

  window.addEventListener("resize", (event) => {
    setWidthConstrainedState(window.matchMedia("(max-width: 600px)").matches);
  });

  return (
    <div className="App">
      <button onClick={async () => {
        const keypair = new SettingsManager().User.keyPair;
        if (keypair !== undefined) {
          //console.log(keypair.PrivateKey);
          /*const encrypted = await EncryptStringUsingAES(await GenerateSHA256Hash("Test"), keypair.PrivateKey);
          const messageKey = await GenerateKey(32);
          const message = await EncryptUsingPubKey(keypair.PublicKey, messageKey);
          const key = await DecryptBase64StringUsingAES(await GenerateSHA256Hash("Test"), encrypted);
          //console.log(key);
          console.log(FromUint8Array(FromBase64String(await DecryptUsingPrivKey(key, message))));*/
          // Enc
          /*const message = "Hello my friends";
          const messageKey = await GenerateBase64Key(32);
          console.log(messageKey);
          const encMess = await EncryptBase64(messageKey, Base64String.CreateBase64String(message));
          console.log(encMess);*/
          //const encKey = await EncryptBase64WithPub(keypair.PublicKey, messageKey);
          /*console.log((await GenerateBase64Key(32)).Uint8Array.length);
          const encKey = new Base64String("bFOEYLgOc/mlZcFb2M1n4yBwgNLl7D1WkmgEIEAIpGz5z4jGAX5vAu1VZ2c3cg2RssSAt25IwNhatzCDerc4dMTnBym6oXIPAVQnkAjY+0RBkeSMh2Xzv74wtgeUzRZOeRJwbTNkFBTTjoveYRpGlXzKlGI1sbgwQB5BI9F+UPMMUQhAP1VkEG0IYdYAQGJpbfkbJyCcE29B4+Ksk1eMH4i/CGaw37xCF/4aIlwcIECE/6wC0/7/Leks1haH/gfokEdJ4q6Gk9fv/LL8m+dyKxnAPW+AZL6+0KBzQTrKYcgxNDPFZ3GrjazPc69RkJfPtWZVfNMO8zwSUgjJIw2JLcIapM1N/Xl18phLUkMizVUVURWpOLQRNyf2P5V1QB6F/CJJMmrTAhgXUBz4vV45eSYjsYSWNB0N2mQrRPdVFaZv761lgiYkDB13i/uSCHVDCt6lfkGgoEq6NTv150IoADpcaHxgsxsRQgQlLrT3QWlZsvCjJZWgZ1tqS3xXCw8nMdzHZco/WGloBTwLgPxg93xx5G+3BotM6Eg9ym8M1WdfD8DKIn3KjDcIPWlYFjm8hhqrmjKZBdwtfxNytBsdK0kXtET02gk3H4g276/Iobg3zp9hbMSis/IIQbt6YjJ9SyGBQ7QRL3p/592x7RyDJqxs4P5CUqM32dG7UrdNV9A=");

          // Dec
          const decKey = await DecryptBase64WithPriv(keypair.PrivateKey, encKey);
          console.log(decKey);*/
          /*const decMess = await DecryptBase64StringUsingAES(decKey.Base64, encMess);
          console.log(decMess);*/

          const d = await DecryptBase64(await GenerateBase64SHA256("hello"), new AESMemoryEncryptData("tWFN1MANC4miYPqJYW23/g==", "MyakFFzgVqG2mHV0vbgQJoVJAeTXI1Db6VP3exk5e0tfi3IDhdg0mdtG/Pc="));
          console.log(FromBase64String(d.Base64).length);
        }
      }}>Test</button>
      <ThemeProvider theme={DarkTheme_Default}>
        <Routes>
          <Route path="*" element={<ErrorView widthConstrained={widthConstrained} changeTitleCallback={setTitle} errorCode={404} />}></Route>
          <Route path="/" element={<AuthView widthConstrained={widthConstrained} changeTitleCallback={setTitle} path={AuthViewRoutes.Login} />} />
          <Route path="/login" element={<AuthView widthConstrained={widthConstrained} changeTitleCallback={setTitle} path={AuthViewRoutes.Login} />} />
          <Route path="/register" element={<AuthView widthConstrained={widthConstrained} changeTitleCallback={setTitle} HelpPopup={HelpPopup} path={AuthViewRoutes.Register} />} />
          <Route path="/chat" element={<MainView widthConstrained={widthConstrained} changeTitleCallback={setTitle} path={MainViewRoutes.Chat} />} />
          <Route path="/settings" element={<MainView widthConstrained={widthConstrained} changeTitleCallback={setTitle} path={MainViewRoutes.Settings} />} />
        </Routes>
        <Popover open={helpVisible} anchorEl={helpAnchorEl} onClose={() => {
          setHelpAnchor(null as unknown as Element);
          setHelpVisibility(false);
        }}>
          {helpContent}
        </Popover>
      </ThemeProvider>
    </div>
  );
}

export default App;
