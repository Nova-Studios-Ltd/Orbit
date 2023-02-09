import store from "Redux/Store";
import { onNewDebugMessage } from "Redux/Thunks/Console";

import { DebugMessageType } from "Types/Enums";

export const consoleLogOrig = console.log;
export const consoleWarnOrig = console.warn;
export const consoleErrorOrig = console.error;

declare global {
  interface Console {
    success: (...args: any[]) => void
  }
}

function formatMessage(...args: any[]) {
  let output = "";

  if (args.length < 1) return "";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    try {
      const argToString = String(arg);
      output += ` ${argToString}`;
    }
    catch {
      consoleErrorOrig("Unable to format message");
    }
  }

  return output;
}

export function OverrideConsoleLog() {
  console.log = (...args: any[]) => {
    const finalString = formatMessage(args);

    store.dispatch(onNewDebugMessage({ type: DebugMessageType.Log, timestamp: Date.now(), message: finalString }));
    consoleLogOrig(...args);
  }
}

export function OverrideConsoleWarn() {
  console.warn = (...args: any[]) => {
    const finalString = formatMessage(args);

    store.dispatch(onNewDebugMessage({ type: DebugMessageType.Warning, timestamp: Date.now(), message: finalString }));
    consoleWarnOrig(...args);
  }
}

export function OverrideConsoleError() {
  console.error = (...args: any[]) => {
    const finalString = formatMessage(args);

    store.dispatch(onNewDebugMessage({ type: DebugMessageType.Error, timestamp: Date.now(), message: finalString }));
    consoleErrorOrig(...args);
  }
}

export function OverrideConsoleSuccess() {
  console.success = (...args: any[]) => {
    const finalString = formatMessage(args);

    store.dispatch(onNewDebugMessage({ type: DebugMessageType.Success, timestamp: Date.now(), message: finalString }));
    consoleLogOrig(...args);
  }
}

export function DummyConsoleSuccess() {
  console.success = consoleLogOrig;
}
