/**
 * Generates a random number between min and max
 * @param min Lowest number
 * @param max Highest number
 * @returns A number between min (Inclusive) and max (Exclusive)
 */
export function GetRandomInt(min: number, max: number) : number {
  const mmin = Math.ceil(min);
  const mmax = Math.floor(max);
  return Math.floor(Math.random() * (mmax - mmin) + mmin); //The maximum is exclusive and the minimum is inclusive
}

/**
 * Extracts the extension from the provided name
 * @param filename File name to get extension from (ie. hello.txt)
 * @returns The files extension (ie. txt)
 */
export function GetFileExtension(filename: string) : string {
  const re = /(?:\.([^.]+))?$/.exec(filename);
  if (re === null) return "";
  return re[1];
}

/**
 * Tests if the provided username is of a valid format
 * @param username Username to test
 * @returns True if the username is valid otherwise false
 */
export function IsValidUsername(username: string) : boolean {
  return new RegExp(/^([\S]{1,})#([0-9]{4}$)/g).test(username);
}
