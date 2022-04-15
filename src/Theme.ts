import { createTheme } from "@mui/material";

export const DarkTheme_Default = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#292B2E",
      paper: "#212121",
    }
  },
  customPalette: {
    formBackground: "#212121E9",
    messageBackground: "#3C3E42",
    messageInputBackground: "#3C3E42"
  }
});

export const LightTheme_Default = createTheme({
  // TODO: Actually change these colors to light theme colors
  palette: {
    mode: "light",
    background: {
      default: "#292B2E",
      paper: "#212121",
    }
  },
  customPalette: {
    formBackground: "#212121AA",
    messageBackground: "#454545",
    messageInputBackground: "#3C3E42"
  }
});

declare module "@mui/material/styles" {
  interface Theme {
    customPalette: {
      formBackground: string,
      messageBackground: string,
      messageInputBackground: string
    };
  }

  interface ThemeOptions {
    customPalette?: {
      formBackground: string,
      messageBackground: string,
      messageInputBackground: string
    };
  }
}
