import { Routes } from "Types/UI/Routes";

/**
 * Checks if the provided url is valid for the Route given
 * @param url URL to check
 * @param page The Route to check against the url the Url
 * @returns True if the URL matches the page else false
 */
export function IsMainViewPage(url: string, page: Routes) : boolean {
  if (url.includes(page)) return true;
  return false;
}

/**
 * Extracts the channel UUID from a url
 * @param url the url to extract the UUID from
 * @returns A UUID or if the url isnt valid undefined
 */
export function URLGetChannelUUID(url: string) : string | undefined {
  if (!IsMainViewPage(url, Routes.Chat)) return undefined;
  const components = url.split("/");
  if (components[2].length !== 32) return undefined;
  return components[2];
}
