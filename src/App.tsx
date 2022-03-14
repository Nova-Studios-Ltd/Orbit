import React from 'react';
import { ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Init } from './Init/LoginHandler';
import { DarkTheme_Default } from 'Theme';

import ChatPage from 'Pages/ChatPage/ChatPage';
import LoginPage from 'Pages/LoginPage/LoginPage';
import SettingsPage from 'Pages/SettingsPage/SettingsPage';

import './App.css';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={DarkTheme_Default}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
