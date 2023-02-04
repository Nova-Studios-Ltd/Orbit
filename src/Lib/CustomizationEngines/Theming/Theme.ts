import { createTheme } from "@mui/material";

export {}

export const LightTheme_Default = createTheme({
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
      contextMenuItemActive: "",
      avatarTextButtonActive: "",
    },
    contextMenuBackground: "",
    contextMenuItemBackground: "",
    formBackground: "",
    messageBackground: "",
    TextComboBackground: "",
    FileUploadSummaryItemBackground: "",
    SystemAccentColor: "",
  }
});

declare module "@mui/material/styles" {
  interface Theme {
    customPalette: {
      customActions: {
        active: string,
        messageHover: string,
        contextMenuItemActive: string,
        avatarTextButtonActive: string,
      },
      contextMenuBackground: string,
      contextMenuItemBackground: string,
      formBackground: string,
      messageBackground: string,
      TextComboBackground: string,
      FileUploadSummaryItemBackground: string,
      SystemAccentColor: string,
    }
  }

  interface ThemeOptions {
    customPalette: {
      customActions: {
        active: string,
        messageHover: string,
        contextMenuItemActive: string,
        avatarTextButtonActive: string,
      },
      contextMenuBackground: string,
      contextMenuItemBackground: string,
      formBackground: string,
      messageBackground: string,
      TextComboBackground: string,
      FileUploadSummaryItemBackground: string,
      SystemAccentColor: string,
    },
  }
}
