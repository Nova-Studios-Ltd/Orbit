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
    formBackground: "#212121AA"
  }
});

declare module "@mui/material/styles" {
  interface Theme {
    customPalette: {
      formBackground: string
    };
  }

  interface ThemeOptions {
    customPalette?: {
      formBackground: string
    };
  }
}
