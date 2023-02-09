import store, { AppThunk } from "Redux/Store";
import { addDebugMessage, closeDebugConsole as closeConsole } from "Redux/Slices/ConsoleSlice";

import type { DebugMessageSkeleton } from "Types/General";
import { removeParam } from "Redux/Slices/RouteSlice";

export function onNewDebugMessage(message: DebugMessageSkeleton): AppThunk<void> {
  return (dispatch, getState) => {
    dispatch(addDebugMessage(message));
  }
}

export function closeDebugConsole(): AppThunk<void> {
  return (dispatch, getState) => {
    dispatch(removeParam("console"));
    dispatch(closeConsole());
  }
}
