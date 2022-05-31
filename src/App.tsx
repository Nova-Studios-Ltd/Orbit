import { useState } from "react";
import { Menu, Popover, ThemeProvider } from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import { Manager } from "./Init/AuthHandler";
import { GetUrlFlag } from "NSLib/NCFlags";
import { ThemeSelector } from "Theme";
import { Localizations } from "Localization/Localizations";

import AuthView from "Views/AuthView/AuthView";
import ErrorView from "Views/ErrorView/ErrorView";
import MainView from "Views/MainView/MainView";

import ContextMenuItem from "Components/Menus/ContextMenuItem/ContextMenuItem";

import { AuthViewRoutes, MainViewRoutes } from "DataTypes/Routes";
import type { ReactNode } from "react";
import type { ContextMenuProps, HelpPopupProps, SharedProps } from "DataTypes/Components";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
import type { Coordinates } from "DataTypes/Types";

import "./App.css";

i18n.use(initReactI18next)
.init({
  resources: Localizations,
  lng: "en", // TODO: Remove this and add a language selection system later
  fallbackLng: "en"
});

function App() {
  const Localizations_Common = useTranslation().t;

  const [widthConstrained, setWidthConstrainedState] = useState(window.matchMedia("(max-width: 600px)").matches);
  const [isTouchCapable, setTouchCapableState] = useState("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const [title, setTitle] = useState("");
  const [helpVisible, setHelpVisibility] = useState(false);
  const [helpAnchorEl, setHelpAnchor] = useState(null as unknown as Element);
  const [helpContent, setHelpContent] = useState(null as unknown as ReactNode);
  const [contextMenuVisible, setContextMenuVisibility] = useState(false);
  const [contextMenuAnchorPos, setContextMenuAnchor] = useState(null as unknown as Coordinates);
  const [contextMenuItems, setContextMenuItems] = useState(null as unknown as ContextMenuItemProps[]);

  const contextMenuAnchorPosFiltered = { x: contextMenuAnchorPos ? contextMenuAnchorPos.x : 0, y: contextMenuAnchorPos ? contextMenuAnchorPos.y : 0 }


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

  const ContextMenu: ContextMenuProps = {
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
    ContextMenu: ContextMenu,
    widthConstrained: widthConstrained,
    isTouchCapable: isTouchCapable,
    changeTitleCallback: setTitle
  }

  const contextMenuItemsList = () => {
    if (!contextMenuItems || contextMenuItems.length < 1) return null;

    return contextMenuItems.map((item, index) => {
      if (item.hide) return null;
      return (<ContextMenuItem key={index} sharedProps={SharedProps} className={item.className} disabled={item.disabled} persistOnClick={item.persistOnClick} icon={item.icon} onLeftClick={item.onLeftClick} onRightClick={item.onRightClick}>{item.children}</ContextMenuItem>)
    });
  };

  window.addEventListener("resize", (event) => {
    setWidthConstrainedState(window.matchMedia("(max-width: 600px)").matches);
  });

  return (
    <div className="App" onContextMenu={(event) => event.preventDefault()}>
      <Helmet>
        <title>{title && title.length > 0 ? `${Localizations_Common("AppTitle")} - ${title}` : Localizations_Common("AppTitle")}</title>
      </Helmet>
      <ThemeProvider theme={ThemeSelector(GetUrlFlag("theme") || "DarkTheme_Default")}>
        <Routes>
          <Route path="*" element={<ErrorView sharedProps={SharedProps} errorCode={404} />}></Route>
          <Route path="/" element={<AuthView sharedProps={SharedProps} path={AuthViewRoutes.Login} />} />
          <Route path={AuthViewRoutes.Login} element={<AuthView sharedProps={SharedProps} path={AuthViewRoutes.Login} />} />
          <Route path={AuthViewRoutes.Register} element={<AuthView sharedProps={SharedProps} path={AuthViewRoutes.Register} />} />
          <Route path={MainViewRoutes.Chat} element={<MainView sharedProps={SharedProps} path={MainViewRoutes.Chat} />} />
          <Route path={MainViewRoutes.Friends} element={<MainView sharedProps={SharedProps} path={MainViewRoutes.Friends} />} />
          <Route path={MainViewRoutes.Settings} element={<MainView sharedProps={SharedProps} path={MainViewRoutes.Settings} />} />
        </Routes>
        <Popover className="GenericPopover" open={helpVisible} anchorEl={helpAnchorEl} onClose={() => {
          setHelpAnchor(null as unknown as Element);
          setHelpVisibility(false);
        }}>
          {helpContent}
        </Popover>
        <Menu className="GenericContextMenu" PaperProps={{ className: "GenericContextMenuPaper" }} open={contextMenuVisible} anchorReference="anchorPosition" anchorPosition={{ top: contextMenuAnchorPosFiltered.y, left: contextMenuAnchorPosFiltered.x }} onClose={() => closeContextMenu()}>
          {contextMenuItemsList()}
        </Menu>
        <div className="ToastHolder">

        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
