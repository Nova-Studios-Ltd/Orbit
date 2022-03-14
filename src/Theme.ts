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

  }
});

declare module "@mui/material/styles" {
  interface Theme {
    customPalette: {

    };
  }

  interface ThemeOptions {
    customPalette?: {

    };
  }
}
