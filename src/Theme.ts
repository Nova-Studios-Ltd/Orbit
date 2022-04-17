import { createTheme } from "@mui/material";

export const DarkTheme_Default = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#292B2E",
      paper: "#212121",
    },
  },
  customPalette: {
    customActions: {
      active: "#3C3E42",
      messageHover: "#8A8F94",
      contextMenuItemActive: "#7E8187"
    },
    contextMenuBackground: "#3C3E42",
    contextMenuItemBackground: "#3C3E42",
    formBackground: "#212121",
    messageBackground: "#3C3E42",
    messageInputBackground: "#3C3E42",
  }
});

export const LightTheme_Default = createTheme({
  // TODO: Actually change these colors to light theme colors
  palette: {
    mode: "light",
    background: {
      default: "",
      paper: "",
    }
  },
  customPalette: {
    customActions: {
      active: "",
      messageHover: "",
      contextMenuItemActive: ""
    },
    contextMenuBackground: "",
    contextMenuItemBackground: "",
    formBackground: "",
    messageBackground: "",
    messageInputBackground: ""
  }
});

declare module "@mui/material/styles" {
  interface Theme {
    customPalette: {
      customActions: {
        active: string,
        messageHover: string,
        contextMenuItemActive: string
      },
      contextMenuBackground: string,
      contextMenuItemBackground: string,
      formBackground: string,
      messageBackground: string,
      messageInputBackground: string,
    }
  }

  interface ThemeOptions {
    customPalette: {
      customActions: {
        active: string,
        messageHover: string,
        contextMenuItemActive: string
      },
      contextMenuBackground: string,
      contextMenuItemBackground: string,
      formBackground: string,
      messageBackground: string,
      messageInputBackground: string,
    },
  }
}
