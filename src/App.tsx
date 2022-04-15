import { useState } from "react";
import { Popover, ThemeProvider } from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { Manager } from "./Init/AuthHandler";
import { DarkTheme_Default } from "Theme";
import { Localizations } from "Localization/Localizations";

import AuthView from "Views/AuthView/AuthView";
import ErrorView from "Views/ErrorView/ErrorView";
import MainView from "Views/MainView/MainView";

import { AuthViewRoutes, MainViewRoutes } from "DataTypes/Routes";
import type { ReactNode } from "react";
import type { HelpPopupProps } from "DataTypes/Components";

import "./App.css";

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
