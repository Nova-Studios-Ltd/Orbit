import { useState } from "react";
import { Menu, Popover, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import { GetUrlFlag } from "NSLib/NCFlags";
import { ThemeSelector } from "Theme";
import { Localizations } from "Localization/Localizations";

import AuthView from "Views/AuthView/AuthView";
import ErrorView from "Views/ErrorView/ErrorView";
import MainView from "Views/MainView/MainView";

import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";

import { AuthViewRoutes, FriendViewRoutes, MainViewRoutes } from "DataTypes/Routes";
import type { ReactNode } from "react";
import type { ContextMenuProps, HelpPopupProps, SharedProps } from "DataTypes/Components";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
import type { Coordinates } from "DataTypes/Types";

import "./App.css";
import ContextMenu from "Components/Menus/ContextMenu/ContextMenu";

i18n.use(initReactI18next)
.init({
  resources: Localizations,
  lng: "en", // TODO: Remove this and add a language selection system later
  fallbackLng: "en"
});

function App() {
  const Localizations_Common = useTranslation().t;
  const theme = ThemeSelector(GetUrlFlag("theme") || "DarkTheme_Default");

  const [widthConstrained, setWidthConstrainedState] = useState(window.matchMedia("(max-width: 600px)").matches);
  const [isTouchCapable, setTouchCapableState] = useState("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const [title, setTitle] = useState("");
  const [helpVisible, setHelpVisibility] = useState(false);
  const [helpAnchorEl, setHelpAnchor] = useState(null as unknown as Element);
  const [helpContent, setHelpContent] = useState(null as unknown as ReactNode);
  const [contextMenuVisible, setContextMenuVisibility] = useState(false);
  const [contextMenuAnchorPos, setContextMenuAnchor] = useState(null as unknown as Coordinates);
  const [contextMenuItems, setContextMenuItems] = useState(null as unknown as ContextMenuItemProps[]);

  const closeHelpPopup = () => {
    setHelpVisibility(false);
    setHelpAnchor(null as unknown as Element);
  }

  const closeContextMenu = () => {
    setContextMenuVisibility(false);
    setContextMenuAnchor(null as unknown as Coordinates);
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

  const ContextMenuStruct: ContextMenuProps = {
    visible: contextMenuVisible,
    anchorPos: contextMenuAnchorPos,
    items: contextMenuItems,
    setVisibility: setContextMenuVisibility,
    setAnchor: setContextMenuAnchor,
    setItems: setContextMenuItems,
    closeMenu: closeContextMenu
  };

  const SharedProps: SharedProps = {
    HelpPopup: HelpPopup,
    ContextMenu: ContextMenuStruct,
    widthConstrained: widthConstrained,
    isTouchCapable: isTouchCapable,
    changeTitleCallback: setTitle
  }

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
        <ContextMenu className="GenericContextMenu" items={contextMenuItems} open={contextMenuVisible} anchorPos={contextMenuAnchorPos} onDismiss={closeContextMenu} />
        <div className="ToastHolder">

        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
