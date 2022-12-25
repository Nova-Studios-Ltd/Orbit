import { IsBase64, ToBase64String, ToUint8Array, FromBase64String, FromUint8Array } from "Lib/Utility/Base64";

/**
 * Strongly Typed String Class For Base64 Encoded binary and wrapper for handling base64 encoded data
 */
export default class Base64String {
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
