import { useState } from "react";
import { ThemeProvider } from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { AutoLogin, Manager } from "./Init/AuthHandler";
import { DarkTheme_Default } from "Theme";
import { Localizations } from "Localization/Localizations";

import AuthView from "Views/AuthView/AuthView";
import ErrorView from "Views/ErrorView/ErrorView";
import MainView from "Views/MainView/MainView";

import ChatPage from "Pages/ChatPage/ChatPage";
import LoginPage from "Pages/LoginPage/LoginPage";
import RegisterPage from "Pages/RegisterPage/RegisterPage";
import SettingsPage from "Pages/SettingsPage/SettingsPage";

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

  const [title, setTitle] = useState("");

  Manager.ContainsCookie("LoggedIn").then(async (value: boolean) => {
    if (!value) return;
    const loggedIn = await AutoLogin();
    if (loggedIn && !location.pathname.toLowerCase().includes("/chat")) {
      Manager.WriteCookie("LoggedIn", "false");
      navigate("/chat");
    }
  });

  window.addEventListener("resize", (event) => {
    setWidthConstrainedState(window.matchMedia("(max-width: 600px)").matches);
  });

  return (
    <div className="App">
      <ThemeProvider theme={DarkTheme_Default}>
        <Routes>
          <Route path="*" element={<ErrorView widthConstrained={widthConstrained} errorCode={404} />}></Route>
          <Route path="/" element={<AuthView widthConstrained={widthConstrained} page={<LoginPage />} />} />
          <Route path="/login" element={<AuthView widthConstrained={widthConstrained} page={<LoginPage />} />} />
          <Route path="/register" element={<AuthView widthConstrained={widthConstrained} page={<RegisterPage />} />} />
          <Route path="/chat" element={<MainView widthConstrained={widthConstrained} page={<ChatPage />} />} />
          <Route path="/settings" element={<MainView widthConstrained={widthConstrained} page={<SettingsPage />} />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
