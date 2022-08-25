import { DebugMessageType } from "DataTypes/Enums";
import type { DebugMessage } from "DataTypes/Types";

export const consoleBuffer = [] as DebugMessage[];

export function OverrideConsoleLog() {
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

    consoleBuffer.push({ type: DebugMessageType.Normal, message: finalString });
    consoleLogOrig(finalString);
  }
}

export function OverrideConsoleWarn() {
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

    consoleBuffer.push({ type: DebugMessageType.Warning, message: finalString });
    consoleWarnOrig(finalString);
  }
}

export function OverrideConsoleError() {
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

    consoleBuffer.push({ type: DebugMessageType.Error, message: finalString });
    consoleErrorOrig(finalString);
  }
}
