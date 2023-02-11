import React from "react";
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom";
import { Provider as StateProvider } from "react-redux";

import { DEBUG } from "vars";
import { RegisterWebsocketEvents } from "Redux/Thunks/WebsocketEvents";
import { OverrideConsoleLog, OverrideConsoleWarn, OverrideConsoleError, OverrideConsoleSuccess, DummyConsoleSuccess } from "./Redux/Thunks/Overrides";

import store from "Redux/Store";
import { go } from "Redux/Slices/RouteSlice";
import { navigate } from "Redux/Thunks/Routing";

import { SpecialRoutes } from "Types/UI/Routing";

import App from "./App";


// Overrides

if (DEBUG) {
  OverrideConsoleLog();
  OverrideConsoleWarn();
  OverrideConsoleError();
  OverrideConsoleSuccess();
}
else {
  console.warn("Not overriding console logging because debug mode is disabled. Change this in vars.ts.");
  DummyConsoleSuccess();
}

store.dispatch(RegisterWebsocketEvents());

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.success("Service worker registration successful!");
      })
      .catch((registrationError) => {
        console.error(`Service worker registration failed! (${registrationError})`);
    });
  }

  if (window.location.pathname.length > 0) {
    store.dispatch(go(window.location.pathname));
  }
});

window.addEventListener("popstate", () => {
  store.dispatch(navigate({ pathname: SpecialRoutes.Back }));
});

const rootEl = document.getElementById("root");
const root = createRoot(rootEl!);
root.render(
  <StateProvider store={store}>
    <Router>
      <App />
    </Router>
  </StateProvider>
);
