import { DebugMessageType } from "Types/Enums";
import type { DebugMessage } from "Types/General";

export const consoleLogOrig = console.log;
export const consoleWarnOrig = console.warn;
export const consoleErrorOrig = console.error;

declare global {
  interface Console {
    success: (...args: any[]) => void
  }
}

export function OverrideConsoleLog(onNewMessage: (message: DebugMessage) => void) {
  console.log = (...args: any[]) => {
    let finalString = "";

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      try {
        const argToString = String(arg);
        finalString += ` ${argToString}`;
      }
      catch {
        consoleErrorOrig("Unable to log message");
      }
    }

    onNewMessage({ type: DebugMessageType.Log, timestamp: Date.now(), message: finalString });
    consoleLogOrig(...args);
  }
}

export function OverrideConsoleWarn(onNewMessage: (message: DebugMessage) => void) {
  console.warn = (...args: any[]) => {
    let finalString = "";

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      try {
        const argToString = String(arg);
        finalString += ` ${argToString}`;
      }
      catch {
        consoleErrorOrig("Unable to log warn message");
      }
    }

    onNewMessage({ type: DebugMessageType.Warning, timestamp: Date.now(), message: finalString });
    consoleWarnOrig(...args);
  }
}

export function OverrideConsoleError(onNewMessage: (message: DebugMessage) => void) {
  console.error = (...args: any[]) => {
    let finalString = "";

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      try {
        const argToString = String(arg);
        finalString += ` ${argToString}`;
      }
      catch {
        consoleErrorOrig("Unable to log error message");
      }
    }

    onNewMessage({ type: DebugMessageType.Error, timestamp: Date.now(), message: finalString });
    consoleErrorOrig(...args);
  }
}

export function OverrideConsoleSuccess(onNewMessage: (message: DebugMessage) => void) {
  console.success = (...args: any[]) => {
    let finalString = "";

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      try {
        const argToString = String(arg);
        finalString += ` ${argToString}`;
      }
      catch {
        consoleErrorOrig("Unable to log success message");
      }
    }

    onNewMessage({ type: DebugMessageType.Success, timestamp: Date.now(), message: finalString });
    consoleLogOrig(...args);
  }
}
