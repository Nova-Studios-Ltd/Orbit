import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Thunks
import { generateSessionString } from "Redux/Thunks/App";

export interface AppSliceState {
  widthConstrained: boolean,
  isTouchCapable: boolean,
  channelMenuOpen: boolean,
  isDoingSomething: boolean,
  session: string
}

const initialState: AppSliceState = {
  widthConstrained: window.matchMedia("(max-width: 600px)").matches,
  isTouchCapable: "ontouchstart" in window || navigator.maxTouchPoints > 0,
  channelMenuOpen: true,
  isDoingSomething: false,
  session: ""
}

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    openChannelMenu: (state) => {
      state.channelMenuOpen = true;
    },
    closeChannelMenu: (state) => {
      state.channelMenuOpen = false;
    },
    updateWidthConstraintStatus: (state, action: PayloadAction<boolean>) => {
      state.widthConstrained = action.payload;
      state.channelMenuOpen = !action.payload;
    },
    updateTouchCapableStatus: (state, action: PayloadAction<boolean>) => {
      state.isTouchCapable = action.payload;
    },
    startDoingSomething: (state) => {
      state.isDoingSomething = true;
    },
    stopDoingSomething: (state) => {
      state.isDoingSomething = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateSessionString.fulfilled, (state, action) => {
      state.session = action.payload;
    })
  }
});

export const { openChannelMenu, closeChannelMenu, updateWidthConstraintStatus, updateTouchCapableStatus, startDoingSomething, stopDoingSomething } = AppSlice.actions;
export default AppSlice.reducer;
