import { useState } from "react";
import { Menu, Popover, ThemeProvider } from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import { Manager } from "./Init/AuthHandler";
import { DarkTheme_Default } from "Theme";
import { Localizations } from "Localization/Localizations";

import AuthView from "Views/AuthView/AuthView";
import ErrorView from "Views/ErrorView/ErrorView";
import MainView from "Views/MainView/MainView";

import { AuthViewRoutes, MainViewRoutes } from "DataTypes/Routes";
import type { ReactNode } from "react";
import type { ContextMenuProps, HelpPopupProps } from "DataTypes/Components";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";

import "./App.css";
import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";

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
  const Localizations_Common = useTranslation().t;

  const [title, setTitle] = useState("");
  const [helpVisible, setHelpVisibility] = useState(false);
  const [helpAnchorEl, setHelpAnchor] = useState(null as unknown as Element);
  const [helpContent, setHelpContent] = useState(null as unknown as ReactNode);
  const [contextMenuVisible, setContextMenuVisibility] = useState(false);
  const [contextMenuAnchorEl, setContextMenuAnchor] = useState(null as unknown as Element);
  const [contextMenuItems, setContextMenuItems] = useState(null as unknown as ContextMenuItemProps[]);

  const closeHelpPopup = () => {
    setHelpVisibility(false);
    setHelpAnchor(null as unknown as Element);
  }

  const closeContextMenu = () => {
    setContextMenuVisibility(false);
    setContextMenuAnchor(null as unknown as Element);
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

  const ContextMenu: ContextMenuProps = {
    visible: contextMenuVisible,
    anchorEl: contextMenuAnchorEl,
    items: contextMenuItems,
    setVisibility: setContextMenuVisibility,
    setAnchor: setContextMenuAnchor,
    setItems: setContextMenuItems,
    closeMenu: closeContextMenu
  };

  const contextMenuItemsList = () => {
    if (!contextMenuItems || contextMenuItems.length < 1) return null;

    return contextMenuItems.map((item, index) => {
      return (<ContextMenuItem key={index} className={item.className} ContextMenu={ContextMenu} disabled={item.disabled} persistOnClick={item.persistOnClick} icon={item.icon} onLeftClick={item.onLeftClick} onRightClick={item.onRightClick}>{item.children}</ContextMenuItem>)
    });
  };

  Manager.ContainsCookie("LoggedIn").then(async (value: boolean) => {
    if (!value) return;
    if (location.pathname.toLowerCase().includes(AuthViewRoutes.Login) || location.pathname.toLowerCase().includes(AuthViewRoutes.Register)) {
      Manager.WriteCookie("LoggedIn", "false");
      navigate(MainViewRoutes.Chat);
    }
  });

  window.addEventListener("resize", (event) => {
    setWidthConstrainedState(window.matchMedia("(max-width: 600px)").matches);
  });

  return (
    <div className="App" onContextMenu={(event) => event.preventDefault()}>
      <Helmet>
        <title>{title && title.length > 0 ? `${Localizations_Common("AppTitle")} - ${title}` : Localizations_Common("AppTitle")}</title>
      </Helmet>
      <ThemeProvider theme={DarkTheme_Default}>
        <Routes>
          <Route path="*" element={<ErrorView widthConstrained={widthConstrained} changeTitleCallback={setTitle} errorCode={404} />}></Route>
          <Route path="/" element={<AuthView widthConstrained={widthConstrained} changeTitleCallback={setTitle} path={AuthViewRoutes.Login} />} />
          <Route path={AuthViewRoutes.Login} element={<AuthView widthConstrained={widthConstrained} changeTitleCallback={setTitle} path={AuthViewRoutes.Login} />} />
          <Route path={AuthViewRoutes.Register} element={<AuthView widthConstrained={widthConstrained} changeTitleCallback={setTitle} HelpPopup={HelpPopup} path={AuthViewRoutes.Register} />} />
          <Route path="/chat" element={<MainView widthConstrained={widthConstrained} ContextMenu={ContextMenu} changeTitleCallback={setTitle} path={MainViewRoutes.Chat} />} />
          <Route path="/settings" element={<MainView widthConstrained={widthConstrained} changeTitleCallback={setTitle} path={MainViewRoutes.Settings} />} />
        </Routes>
        <Popover className="GenericPopover" open={helpVisible} anchorEl={helpAnchorEl} onClose={() => {
          setHelpAnchor(null as unknown as Element);
          setHelpVisibility(false);
        }}>
          {helpContent}
        </Popover>
        <Menu className="GenericContextMenu" PaperProps={{ className: "GenericContextMenuPaper" }} open={contextMenuVisible} anchorEl={contextMenuAnchorEl} onClose={() => closeContextMenu()}>
          {contextMenuItemsList()}
        </Menu>
      </ThemeProvider>
    </div>
  );
}

export default App;
