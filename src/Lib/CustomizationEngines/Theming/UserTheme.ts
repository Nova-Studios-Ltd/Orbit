import { Theme, ThemeOptions } from "@mui/material/styles/createTheme";

export class UserTheme {
  name: string;
  creator: string;
  theme: Theme;

  constructor(name: string, creator: string, theme: Theme) {
    this.name = name;
    this.creator = creator;
    this.theme = theme;
  }
}

export interface UnloadedUserTheme {
  creator: string;
  name: string;
  theme: ThemeOptions;
}
