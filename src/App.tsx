// Global
import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { Route, Routes as RoutingGroup } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

// Source
import { NotificationType, TriggerNotification } from "Lib/ElectronAPI";
import { GetUrlFlags } from "Lib/Debug/Flags";

import { Localizations } from "Localization/Localizations";
import { UserCache } from "Lib/Storage/Objects/UserCache";

// Redux
import { useDispatch, useSelector } from "Redux/Hooks";
import { updateWidthConstraintStatus } from "Redux/Slices/AppSlice";
import { selectLocation } from "Redux/Selectors/RoutingSelectors";
import { addParam } from "Redux/Slices/RouteSlice";

// Components
import AuthView from "Views/AuthView/AuthView";
import FriendView from "Views/FriendView/FriendView";
import MainView from "Views/MainView/MainView";
import SettingsView from "Views/SettingsView/SettingsView";

import AddFriendsPage from "Views/FriendView/Pages/AddFriendsPage/AddFriendsPage";
import BlockedUsersPage from "Views/FriendView/Pages/BlockedUsersPage/BlockedUsersPage";
import ChatPage from "Views/MainView/Pages/ChatPage/ChatPage";
import DashboardPage from "Views/SettingsView/Pages/DashboardPage/DashboardPage";
import DebugPage from "Views/SettingsView/Pages/DebugPage/DebugPage";
import FriendPage from "Views/FriendView/Pages/FriendPage/FriendPage";
import LoginPage from "Views/AuthView/Pages/LoginPage/LoginPage";
import RegisterPage from "Views/AuthView/Pages/RegisterPage/RegisterPage";
import RequestResetPage from "Views/AuthView/Pages/ResetPage/RequestResetPage";
import ResetPage from "Views/AuthView/Pages/ResetPage/ResetPage";

import DebugConsole from "Components/Debug/DebugConsole/DebugConsole";
import Redirect from "Components/Special/Redirect/Redirect";

import { Routes } from "Types/UI/Routing";
import { ThemeEngine } from "Lib/CustomizationEngines/Theming/ThemeEngine";

import "./App.css";

i18n.use(initReactI18next)
.init({
  resources: Localizations,
  lng: "en", // TODO: Remove this and add a language selection system later
  fallbackLng: "en",
  returnNull: false
});

export const uCache = new UserCache();

function App() {
  const Localizations_Common = useTranslation().t;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const title = useSelector((state) => state.routing.title);
  const location = useSelector(selectLocation());
  const onFirstLoad = useSelector((state) => state.routing.onFirstLoad);

  // Theming
  const [cTheme, setTheme] = useState("");
  let t = undefined;
  t = ThemeEngine.GetTheme(cTheme);

  useEffect(() => {
    if (onFirstLoad) {
      (async () => {
        await ThemeEngine.LoadThemesFromURL(`${window.location.origin}/Themes/`);
        const lastTheme = localStorage.getItem("Theme");
        if (lastTheme === null) {
          localStorage.setItem("Theme", "DarkTheme_Default");
          setTheme("DarkTheme_Default");
        }
        else {
          setTheme(lastTheme);
        }
      })();

      const flags = GetUrlFlags();
      for (let i = 0; i < flags.length; i++) {
        const flag = flags[i];
        dispatch(addParam(flag.key, flag.value));
      }
      return;
    };
    navigate(location);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, onFirstLoad]);

  window.addEventListener("resize", () => {
    dispatch(updateWidthConstraintStatus((window.matchMedia("(max-width: 600px)").matches)));
  });

  (window as any).notification = (tile: string, body: string, url: string) => {
    TriggerNotification(tile, body, NotificationType.Info, url);
  }

  return (
    <div className="App" onContextMenu={(event) => event.preventDefault()}>
      <Helmet>
        <title>{title && title.length > 0 ? `${Localizations_Common("AppTitle")} - ${title}` : Localizations_Common("AppTitle")}</title>
      </Helmet>
      <ThemeProvider theme={t.theme}>
        <RoutingGroup>
          <Route path="*" element={<Redirect to={{ pathname: Routes.Login }} />} />
          <Route path={Routes.Auth} element={<AuthView />}>
            <Route path={Routes.Login} element={<LoginPage />} />
            <Route path={Routes.Register} element={<RegisterPage />} />
            <Route path={Routes.Reset} element={<ResetPage />} />
            <Route path={Routes.RequestReset} element={<RequestResetPage />} />
          </Route>
          <Route path={Routes.Root} element={<MainView />}>
            <Route path={Routes.Friends} element={<FriendView />}>
              <Route path={Routes.FriendsList} element={<FriendPage />} />
              <Route path={Routes.AddFriend} element={<AddFriendsPage />} />
              <Route path={Routes.BlockedUsersList} element={<BlockedUsersPage />} />
            </Route>
            <Route path={Routes.Settings} element={<SettingsView />}>
              <Route path={Routes.Dashboard} element={<DashboardPage />} />
              <Route path={Routes.Debug} element={<DebugPage />} />
            </Route>
            <Route path={Routes.Chat} element={<ChatPage />} />
          </Route>
        </RoutingGroup>
        <DebugConsole />
      </ThemeProvider>
    </div>
  );
}

export default App;
