import { createTheme } from "@mui/material";
import { HTTPStatus } from "Lib/API/NetAPI/HTTPStatus";
import { GET } from "Lib/API/NetAPI/NetAPI";
import { Themes } from "Lib/CustomizationEngines/Theming/Themes";
import { UnloadedUserTheme, UserTheme } from "Lib/CustomizationEngines/Theming/UserTheme";
import { Dictionary } from "Lib/Objects/Dictionary";


export class ThemeEngine {
  static Themes: Dictionary<string, UserTheme> = new Dictionary<string, UserTheme>();

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
        this.Themes.setValue(theme.payload.name, new UserTheme(theme.payload.name, theme.payload.creator, createTheme(theme.payload.theme)));
        console.log(`Successfully loaded ${url}/${themes[t]}.json`);
      }
      else {
        console.warn(`${url}/${themes[t]}.json Not Found`);
      }
    }
  }
}
