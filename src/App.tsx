import React, { useEffect, useState } from 'react';
import { ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Init } from './Init/LoginHandler';
import { AutoLogin, Manager } from './Init/AuthHandler';
import { DarkTheme_Default } from 'Theme';

import ChatPage from 'Pages/ChatPage/ChatPage';
import LoginPage from 'Pages/LoginPage/LoginPage';
import SettingsPage from 'Pages/SettingsPage/SettingsPage';

import './App.css';

function App() {

  const [widthConstrained, setWidthConstrainedState] = useState(window.matchMedia("(max-width: 600px)").matches);

  Manager.ContainsCookie("LoggedIn").then(async (value: boolean) => {
    if (!value) return;
    const loggedIn = await AutoLogin();
    if (loggedIn && !document.location.href.includes("/Chat")) {
      Manager.WriteCookie("LoggedIn", "false");
      document.location.assign("/Chat");
    }
  });

  window.addEventListener("resize", (event) => {
    setWidthConstrainedState(window.matchMedia("(max-width: 600px)").matches);
  });

  return (
    <div className="App">
      <ThemeProvider theme={DarkTheme_Default}>
        <Router>
          <Routes>
            <Route path="*" element={<>404 Not Found</>}></Route>
            <Route path="/" element={<LoginPage widthConstrained={widthConstrained} />} />
            <Route path="/login" element={<LoginPage widthConstrained={widthConstrained} />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
