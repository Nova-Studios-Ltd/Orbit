import { useEffect, useRef, useState } from "react";
import { IconButton, Popover, ThemeProvider, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Route, Routes } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import { OverrideConsoleLog, OverrideConsoleWarn, OverrideConsoleError } from "./overrides";
import { GetUrlFlag } from "NSLib/NCFlags";
import { ThemeSelector } from "Theme";
import { Localizations } from "Localization/Localizations";

import AuthView from "Views/AuthView/AuthView";
import ErrorView from "Views/ErrorView/ErrorView";
import MainView from "Views/MainView/MainView";

import { AuthViewRoutes, FriendViewRoutes, MainViewRoutes } from "DataTypes/Routes";
import { DebugMessageType } from "DataTypes/Enums";
import type { ReactNode } from "react";
import type { HelpPopupProps, SharedProps } from "DataTypes/Components";
import type { DebugMessage } from "DataTypes/Types";

import "./App.css";

i18n.use(initReactI18next)
.init({
  resources: Localizations,
  lng: "en", // TODO: Remove this and add a language selection system later
  fallbackLng: "en"
});

function App() {
  const Localizations_Common = useTranslation().t;
  const theme = ThemeSelector(GetUrlFlag("theme") || "DarkTheme_Default");
  const consoleBuffer = useRef([] as DebugMessage[]);

  const [widthConstrained, setWidthConstrainedState] = useState(window.matchMedia("(max-width: 600px)").matches);
  const [isTouchCapable, setTouchCapableState] = useState("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const [title, setTitle] = useState("");
  const [helpVisible, setHelpVisibility] = useState(false);
  const [helpAnchorEl, setHelpAnchor] = useState(null as unknown as Element);
  const [helpContent, setHelpContent] = useState(null as unknown as ReactNode);
  const [debugConsoleVisible, setDebugConsoleVisibility] = useState(false); // Set this to false to disable debug console by default
  const [debugConsoleBuffer, setDebugConsoleBuffer] = useState([] as DebugMessage[]);

  useEffect(() => {
    const onNewDebugMessage = (message: DebugMessage, originalFunc?: Function) => {
      consoleBuffer.current = [...consoleBuffer.current, message];
      setDebugConsoleBuffer(consoleBuffer.current);

      //if (originalFunc) originalFunc(`(test) ${consoleBuffer}`);
    }

    // Function overrides

    OverrideConsoleLog(onNewDebugMessage);
    OverrideConsoleWarn(onNewDebugMessage);
    OverrideConsoleError(onNewDebugMessage);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openConsole = () => setDebugConsoleVisibility(true);

  const closeHelpPopup = () => {
    setHelpVisibility(false);
    setHelpAnchor(null as unknown as Element);
  }

  const HelpPopup: HelpPopupProps = {
    visible: helpVisible,
    anchorEl: helpAnchorEl,
    content: helpContent,
    setVisibility: setHelpVisibility,
    setAnchor: setHelpAnchor,
    setContent: setHelpContent,
    closePopup: closeHelpPopup
  };

  const SharedProps: SharedProps = {
    HelpPopup: HelpPopup,
    widthConstrained: widthConstrained,
    isTouchCapable: isTouchCapable,
    openConsole: openConsole,
    changeTitleCallback: setTitle
  }

  const consoleMessages = debugConsoleBuffer.map((message) => {
    const messageColor = () => {
      switch (message.type) {
        case DebugMessageType.Log:
          return "primary";
        case DebugMessageType.Warning:
          return "yellow";
        case DebugMessageType.Error:
          return "error";
        case DebugMessageType.Success:
          return "success";
        default:
          return "primary";
      }
    }

    return (
      <div className="DebugMessage" key={message.timestamp}>
        <Typography variant="caption" fontWeight="bold" color={messageColor()}>[{message.type.toUpperCase()}]</Typography>
        <Typography variant="caption">{message.message}</Typography>
      </div>
    )
  });

  window.addEventListener("resize", (event) => {
    setWidthConstrainedState(window.matchMedia("(max-width: 600px)").matches);
  });

  return (
    <div className="App" onContextMenu={(event) => event.preventDefault()}>
      <Helmet>
        <title>{title && title.length > 0 ? `${Localizations_Common("AppTitle")} - ${title}` : Localizations_Common("AppTitle")}</title>
      </Helmet>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="*" element={<ErrorView sharedProps={SharedProps} errorCode={404} />}></Route>
          <Route path="/" element={<AuthView sharedProps={SharedProps} path={AuthViewRoutes.Login} />} />
          <Route path={AuthViewRoutes.Login} element={<AuthView sharedProps={SharedProps} path={AuthViewRoutes.Login} />} />
          <Route path={AuthViewRoutes.Register} element={<AuthView sharedProps={SharedProps} path={AuthViewRoutes.Register} />} />
          <Route path={MainViewRoutes.Chat} element={<MainView sharedProps={SharedProps} path={MainViewRoutes.Chat} />} />
          <Route path={MainViewRoutes.Friends} element={<MainView sharedProps={SharedProps} path={MainViewRoutes.Friends} />}>
            <Route path={FriendViewRoutes.FriendsList} element={<MainView sharedProps={SharedProps} path={MainViewRoutes.Friends} />} />
          </Route>
          <Route path={MainViewRoutes.Settings} element={<MainView sharedProps={SharedProps} path={MainViewRoutes.Settings} />} />
        </Routes>
        <Popover className="GenericPopover" open={helpVisible} anchorEl={helpAnchorEl} onClose={() => {
          setHelpAnchor(null as unknown as Element);
          setHelpVisibility(false);
        }}>
          {helpContent}
        </Popover>
        {debugConsoleVisible ? (
        <div className="DebugConsoleContainer" style={{ color: theme.palette.text.primary, background: theme.palette.background.paper }}>
          <div className="DebugConsoleHeader">
            <Typography variant="h5">Debug Console</Typography>
            <IconButton onClick={() => setDebugConsoleVisibility(false)} style={{ marginLeft: "auto" }}><CloseIcon /></IconButton>
          </div>
          <div className="DebugConsole">
            {consoleMessages}
          </div>
        </div>) : null}
      </ThemeProvider>
    </div>
  );
}

export default App;
