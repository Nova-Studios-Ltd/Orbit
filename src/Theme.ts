import { createTheme } from "@mui/material";
import { Theme } from "@mui/material/styles/createTheme";
import GenerateRandomColor, { GenerateRandomHexColor } from "NSLib/ColorGeneration";

// Just a temp thing
export function ThemeSelector(themeName: string) : Theme {
  if (themeName === "DarkTheme_Default") return DarkTheme_Default;
  if (themeName === "LightTheme_Default") return LightTheme_Default;
  else return WTFTheme_Default;
}

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
      contextMenuItemActive: "#7E8187",
      avatarTextButtonActive: "#3C3E42"
    },
    contextMenuBackground: "#3C3E42",
    contextMenuItemBackground: "#3C3E42",
    formBackground: "#212121",
    messageBackground: "#3C3E42",
    TextComboBackground: "#3C3E42",
    FileUploadSummaryItemBackground: "#212121",
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
      contextMenuItemActive: "",
      avatarTextButtonActive: "",
    },
    contextMenuBackground: "",
    contextMenuItemBackground: "",
    formBackground: "",
    messageBackground: "",
    TextComboBackground: "",
    FileUploadSummaryItemBackground: ""
  }
});

export const WTFTheme_Default = createTheme({
  palette: {
    mode: "light",
    background: {
      default: GenerateRandomColor(),
      paper: GenerateRandomColor(),
    }
  },
  customPalette: {
    customActions: {
      active: GenerateRandomColor(),
      messageHover: GenerateRandomColor(),
      contextMenuItemActive: GenerateRandomColor(),
      avatarTextButtonActive: GenerateRandomColor(),
    },
    contextMenuBackground: GenerateRandomColor(),
    contextMenuItemBackground: GenerateRandomColor(),
    formBackground: GenerateRandomColor(),
    messageBackground: GenerateRandomColor(),
    TextComboBackground: GenerateRandomColor(),
    FileUploadSummaryItemBackground: GenerateRandomColor(),
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
    },
  }
}
