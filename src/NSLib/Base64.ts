export function ToBase64String(buffer: Uint8Array) : string {
  return window.btoa(String.fromCharCode.apply(null, Array.from<number>(buffer)));
}

export function FromBase64String(base64: string) : Uint8Array {
  return new Uint8Array(window.atob(base64).split("").map(function(c) {return c.charCodeAt(0); }));
}

export function ToUint8Array(text: string) : Uint8Array {
  return new TextEncoder().encode(text);
}

export function FromUint8Array(buffer: Uint8Array) : string {
  return String.fromCharCode.apply(null, Array.from<number>(buffer));
}

export function IsBase64(text: string) : boolean {
  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(text);
}


/**
 * Strongly Typed String Class For Base64 Encoded Binary
 */
export class Base64String {
  private base64: string;

  constructor(base64: string) {
    if (!IsBase64(base64)) throw new Error("'base64' is not valid base64 string");
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
