import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { title } from "process";

import { HistoryEntry, Param } from "Types/UI/Routing";

export interface RouteSliceState {
  onFirstLoad: boolean,
  pathname: string,
  title: string,
  history: HistoryEntry[],
  future: HistoryEntry[],
  params: Param[]
}

const initialState: RouteSliceState = {
  onFirstLoad: true,
  pathname: "",
  title: "",
  history: [],
  future: [],
  params: []
}

export const RouteSlice = createSlice({
  name: "routing",
  initialState,
  reducers: {
    addParam: {
      reducer(state, action: PayloadAction<Param>) {
        const paramIndex = state.params.findIndex(param => param.key === action.payload.key);

        if (paramIndex > -1) {
          state.params[paramIndex] = action.payload;
        }
        else {
          state.params.push(action.payload);
        }
      },
      prepare(key: string, value?: string, unsetOnNavigate?: boolean) {
        return {
          payload: { key, value, unsetOnNavigate }
        }
      }
    },
    removeParam: (state, action: PayloadAction<string>) => {
      const paramIndex = state.params.findIndex(param => param.key === action.payload);

      if (paramIndex > -1) {
        state.params.splice(paramIndex, 1);
      }
    },
    clearParams: (state) => {
      state.params = [];
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    go: {
      reducer(state, action: PayloadAction<HistoryEntry>) {
        if (state.onFirstLoad) state.onFirstLoad = false;

        state.history.push({ pathname: state.pathname, title: state.title });
        state.pathname = action.payload.pathname;
        state.title = action.payload.title ? action.payload.title : "";
      },
      prepare(to: string, title?: string) {
        return {
          payload: { pathname: to, title }
        }
      }
    },
    back: (state) => {
      state.future.push({ pathname: state.pathname, title: state.title });

      const prevPath = state.history.pop();
      if (prevPath) state.pathname = prevPath.pathname;
    },
    forward: (state) => {
      state.history.push({ pathname: state.pathname, title: state.title });

      const fwdPath = state.future.pop();
      if (fwdPath) state.pathname = fwdPath.pathname;
    }
  }
});

export const { addParam, removeParam, clearParams, setTitle, go, back, forward } = RouteSlice.actions;
export default RouteSlice.reducer;
