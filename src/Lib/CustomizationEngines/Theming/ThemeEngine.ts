import { createTheme } from "@mui/material";
import { HTTPStatus } from "Lib/API/NetAPI/HTTPStatus";
import { GET } from "Lib/API/NetAPI/NetAPI";
import { LightTheme_Default } from "Lib/CustomizationEngines/Theming/Theme";
import { Themes } from "Lib/CustomizationEngines/Theming/Themes";
import { UnloadedUserTheme, UserTheme } from "Lib/CustomizationEngines/Theming/UserTheme";
import { Dictionary } from "Lib/Objects/Dictionary";


/**
 * Manages both internal and user added themes
 */
export class ThemeEngine {
  private static Themes: Dictionary<string, UnloadedUserTheme> = new Dictionary<string, UnloadedUserTheme>();

  /**
   * Downloads and reads a themes.json from a given URL
   * @param url A URL of the location of a themes.json files (Ex. https://themes.orbit.novastudios.uk/ | Don't included themes.json in the path)
   * @returns A list of strings with the names of the theme json files
   */
  private static async ReadThemesJson(url: string) : Promise<string[]> {
    const resp = await GET<Themes>(`${url}/themes.json`);
    if (resp.status === HTTPStatus.OK) {
      return resp.payload.themes;
    }
    if (resp.status === HTTPStatus.NotFound) console.error(`Unable to find themes.json at ${url}/themes.json`);
    return [];
  }

  /**
   * Loads all themes from a given URL
   * @param url A URL of the location of a themes.json files (Ex. https://themes.orbit.novastudios.uk/ | Don't included themes.json in the path)
   */
  static async LoadThemesFromURL(url: string) {
    url = url.replace(/\/+$/, '');
    const themes = await this.ReadThemesJson(url);
    for (let t = 0; t < themes.length; t++) {
      const theme = await GET<UnloadedUserTheme>(`${url}/${themes[t]}.json`);
      if (theme.status === HTTPStatus.OK && theme.payload.theme !== undefined) {
        this.Themes.setValue(theme.payload.name, theme.payload);
        console.log(`Successfully loaded ${url}/${themes[t]}.json`);
      }
      else {
        console.warn(`${url}/${themes[t]}.json Not Found`);
      }
    }
  }

  /**
   * Fetches a user theme. Using both cache and non-cache
   * @param name Name of the theme to get
   * @returns A UserTheme
   */
  static GetTheme(name: string) : UserTheme {
    if (localStorage.getItem("Theme_Cache") === null) {
      const theme = this.Themes.getValue(name);
      if (theme === undefined) return new UserTheme("", "", LightTheme_Default);
      localStorage.setItem("Theme_Cache", JSON.stringify(theme));
      return new UserTheme(theme.name, theme.creator, createTheme(theme.theme));
    }
    else {
      const theme = JSON.parse(localStorage.getItem("Theme_Cache") as string) as UnloadedUserTheme;
      if (theme.name !== name && name !== "") {
        localStorage.removeItem("Theme_Cache");
        return new UserTheme("", "", LightTheme_Default);
      }
      return new UserTheme(theme.name, theme.creator, createTheme(theme.theme));
    }
  }
}
