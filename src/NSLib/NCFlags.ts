function parseUrlSearch(name: string) : string | undefined {
  // eslint-disable-next-line no-restricted-globals
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
 * Checks if a flag is set
 * @param name The name of the flag
 * @returns True if the flag is found, otherwise false
 */
export function HasFlag(name: string) : boolean {
  const p = parseUrlSearch(name);
  if (p === undefined) return false;
  if (p.length >= 0) return true;
  return false;
}

/**
 * Retreives the value of a flag
 * @param name The name of the flag
 * @returns The value of the flag, otherwise undefined if the flag cannot be found
 */
export function GetUrlFlag<T>(name: string) : T | undefined {
  if (!HasFlag(name)) return undefined;
  const p = parseUrlSearch(name);
  if (p === undefined) return undefined;
  return p as unknown as T;
}

