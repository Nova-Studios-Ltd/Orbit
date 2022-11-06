/* eslint-disable no-restricted-globals */

export class NCFlag {
  urlString: string;
  isStringValue: boolean;
  defaultValue: string | boolean | undefined;

  constructor(urlString: string, isStringValue: boolean, defaultValue?: string | boolean) {
    this.urlString = urlString;
    this.isStringValue = isStringValue;
    this.defaultValue = defaultValue;
  }
}

/**
 * Class containing all in use debug flags
 */
export class NCFlags {
  static NoAttachments = new NCFlag("no-attach", false, false);
  static Theme = new NCFlag("theme", true, "DarkTheme_Default");
  static ForceCacheRebuild = new NCFlag("force-cache-rebuild", false, false);
  static EnableConsole = new NCFlag("console", false, false);
  static NoLoadContent = new NCFlag("no-load-content", false, false);
  static NoWebsocket = new NCFlag("no-websocket", false, false);
  static TreatAsUnencrypted = new NCFlag("treat-as-unencrypted", false, false);
  static NoCache = new NCFlag("no-cache", false, false);
  static IgnoreCacheSession = new NCFlag("ignore-cache-session", false, false);
  static EnableSocketControls = new NCFlag("enable-socket-controls", false, false);
}


/**
 * Parses the current url for the requested flag, internal function
 * @param name The flag to find
 * @returns A string of the data if found, otherwise undefined
 */
function parseUrlSearch(name: string) : string | undefined {
  const vars = location.search.replaceAll("?", "").split("&");
  for (let v = 0; v < vars.length; v++) {
    const d = vars[v];
    if (d.includes(name)) {
      return d.split("=")[1] || "";
    }
  }
  return undefined;
}


/**
 * Clears a flag from the search string, internal function
 * @param name The flag to clear
 * @returns Search string with the requested flag removed
 */
function clearFlag(name: string) : string {
  const vars = location.search.replaceAll("?", "").split("&");
  let newSearch = "?";
  for (let v = 0; v < vars.length; v++) {
    const d = vars[v];
    if (d.includes(name)) continue;
    newSearch += `${d}&`;
  }
  if (newSearch[newSearch.length - 1] === "&") newSearch = newSearch.slice(0, -1);
  return newSearch.length === 1? "" : newSearch;
}

/**
 * Checks if a flag is set
 * @param flag The name of the flag
 * @returns True if the flag is found, otherwise false
 */
export function HasUrlFlag(flag: NCFlag) : boolean {
  const p = parseUrlSearch(flag.urlString);
  if (p === undefined) return false;
  if (p.length >= 0) return true;
  return false;
}

/**
 * Retreives the value of a flag
 * @param flag The name of the flag
 * @returns The value of the flag, otherwise undefined if the flag cannot be found
 */
export function GetUrlFlag<T>(flag: NCFlag) : T | undefined {
  if (!HasUrlFlag(flag)) return undefined;
  const p = parseUrlSearch(flag.urlString);
  if (p === undefined) return undefined;
  return p as unknown as T;
}


/**
 * Sets a flag
 * @param flag Flag to set
 * @param value Value to assign to flag
 */
export function SetUrlFlag(flag: NCFlag, value?: string) {
  let newSearch = clearFlag(flag.urlString);
  if (newSearch.includes("?")) {
    if (value === undefined)
      newSearch = `${newSearch}&${flag.urlString}`;
    else
      newSearch = `${newSearch}&${flag.urlString}=${value}`;
  }
  else {
    if (value === undefined)
      newSearch = `?${flag.urlString}`;
    else
      newSearch = `?${flag.urlString}=${value}`;
  }
  location.search = newSearch;
}

/**
 * Clears a set flag
 * @param flag Flag ot clear
 */
export function ClearUrlFlag(flag: NCFlag) {
  if (!HasUrlFlag(flag)) return;
  location.search = clearFlag(flag.urlString);
}

