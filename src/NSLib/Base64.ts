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


/**
 * Strongly Typed String Class For Base64 Encoded binary and wrapper for handling base64 encoded data
 */
export class Base64String {
  private base64: string;

  constructor(base64: string) {
    if (!IsBase64(base64)) throw new Error("parameter 'base64' is not valid base64 string");
    this.base64 = base64;
  }

  static CreateBase64String(data: string | Uint8Array) : Base64String {
    if (typeof data === "string")
      return new Base64String(ToBase64String(ToUint8Array(data)));
    else
      return new Base64String(ToBase64String(data));
  }

  get Base64() {return this.base64;}
  get Uint8Array() {return FromBase64String(this.Base64);}
  get String() {return FromUint8Array(this.Uint8Array);}
}
