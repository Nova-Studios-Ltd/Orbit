import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { DebugMessageSkeleton } from "Types/General";

export interface ConsoleSliceState {
  buffer: DebugMessageSkeleton[],
  open: boolean
}

const initialState: ConsoleSliceState = {
  buffer: [],
  open: false
}

export const ConsoleSlice = createSlice({
  name: "console",
  initialState,
  reducers: {
    addDebugMessage: (state, action: PayloadAction<DebugMessageSkeleton>) => {
      state.buffer.push(action.payload);
    },
    removeDebugMessage: (state, action: PayloadAction<DebugMessageSkeleton | undefined>) => {
      if (action.payload !== undefined) {
        state.buffer.pop();
      }
      else {
        for (let i = 0; i < state.buffer.length; i++) {
          const message = state.buffer[i];
          if (action.payload === message) {
            state.buffer.splice(i, 1);
          }
        }
      }
    },
    clearDebugMessages: (state) => {
      state.buffer = [];
    },
    openDebugConsole: (state) => {
      state.open = true;
    },
    closeDebugConsole: (state) => {
      state.open = false;
    }
  }
});

export const { addDebugMessage, removeDebugMessage, clearDebugMessages, openDebugConsole, closeDebugConsole } = ConsoleSlice.actions;
export default ConsoleSlice.reducer;
