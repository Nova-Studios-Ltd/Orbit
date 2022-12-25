/**
 * Creates a Base64 encoded string from a Uint8Array
 * @param buffer Array of bytes to convert to base64 encoded string
 * @returns Base64 encoded string
 */
 export function ToBase64String(buffer: Uint8Array) : string {
  return window.btoa(String.fromCharCode.apply(null, Array.from<number>(buffer)));
}

/**
 * Creates a Uint8Array from a Base64 encoded string
 * @param base64 Base64 encoded string
 * @returns Uint8Array of data represented by the base64 encoded string
 */
export function FromBase64String(base64: string) : Uint8Array {
  return new Uint8Array(window.atob(base64).split("").map(function(c) {return c.charCodeAt(0); }));
}

/**
 * Creates a Uint8Array from a string
 * @param text String to convert to Uint8Array of UTF-8 bytes
 * @returns Uint8Array of utf-8 bytes
 */
export function ToUint8Array(text: string) : Uint8Array {
  return new TextEncoder().encode(text);
}

/**
 * Creates a string form a Uint8Array
 * @param buffer Uint8Array to convert into a UTF-8 string
 * @returns Utf-8 string from buffer
 */
export function FromUint8Array(buffer: Uint8Array) : string {
  return String.fromCharCode.apply(null, Array.from<number>(buffer));
}

/**
 * Check if a provided string is a valid Base64 string
 * @param text Text to check if its is a valid base64 string
 * @returns True if text is a valid base64 string otherwise false
 */
export function IsBase64(text: string) : boolean {
  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(text);
}
