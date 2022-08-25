import { DebugMessageType } from "DataTypes/Enums";
import type { DebugMessage } from "DataTypes/Types";

export function OverrideConsoleLog(onNewMessage: (message: DebugMessage, originalFunc?: Function) => void) {
  const consoleLogOrig = console.log;

  console.log = (...args: any[]) => {
    let finalString = "";

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      try {
        const argToString = String(arg);
        finalString += ` ${argToString}`;
      }
      catch {
        // Do something I guess?
      }
    }

    onNewMessage({ type: DebugMessageType.Normal, timestamp: Date.now(), message: finalString }, consoleLogOrig);
    consoleLogOrig(...args);
  }
}

export function OverrideConsoleWarn(onNewMessage: (message: DebugMessage, originalFunc?: Function) => void) {
  const consoleWarnOrig = console.warn;

  console.warn = (...args: any[]) => {
    let finalString = "";

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      try {
        const argToString = String(arg);
        finalString += ` ${argToString}`;
      }
      catch {
        // Do something I guess?
      }
    }

    onNewMessage({ type: DebugMessageType.Warning, timestamp: Date.now(), message: finalString }, consoleWarnOrig);
    consoleWarnOrig(...args);
  }
}

export function OverrideConsoleError(onNewMessage: (message: DebugMessage, originalFunc?: Function) => void) {
  const consoleErrorOrig = console.error;

  console.error = (...args: any[]) => {
    let finalString = "";

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      try {
        const argToString = String(arg);
        finalString += ` ${argToString}`;
      }
      catch {
        // Do something I guess?
      }
    }

    onNewMessage({ type: DebugMessageType.Error, timestamp: Date.now(), message: finalString }, consoleErrorOrig);
    consoleErrorOrig(...args);
  }
}
