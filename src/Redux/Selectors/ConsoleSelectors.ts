import { selectParamByKeyExists } from "Redux/Selectors/RoutingSelectors";
import { AppSelector } from "Redux/Store";

import { DebugMessageType } from "Types/Enums";
import type { DebugMessageSkeleton } from "Types/General";

function filterMessagesByType(messages: DebugMessageSkeleton[], type: DebugMessageType) {
  const filteredMessages: DebugMessageSkeleton[] = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (message.type === type) filteredMessages.push(message);
  }

  return filteredMessages;
}

export function selectConsoleOpen(): AppSelector<boolean> {
  return (state) => state.console.open || selectParamByKeyExists("console")(state);
}

export function selectAllDebugMessages(): AppSelector<DebugMessageSkeleton[]> {
  return (state) => state.console.buffer;
}

export function selectLogMessages(): AppSelector<DebugMessageSkeleton[]> {
  return (state) => {
    const messages = state.console.buffer;
    return filterMessagesByType(messages, DebugMessageType.Log);
  }
}

export function selectErrorMessages(): AppSelector<DebugMessageSkeleton[]> {
  return (state) => {
    const messages = state.console.buffer;
    return filterMessagesByType(messages, DebugMessageType.Error);
  }
}

export function selectWarningMessages(): AppSelector<DebugMessageSkeleton[]> {
  return (state) => {
    const messages = state.console.buffer;
    return filterMessagesByType(messages, DebugMessageType.Warning);
  }
}

export function selectSuccessMessages(): AppSelector<DebugMessageSkeleton[]> {
  return (state) => {
    const messages = state.console.buffer;
    return filterMessagesByType(messages, DebugMessageType.Success);
  }
}
