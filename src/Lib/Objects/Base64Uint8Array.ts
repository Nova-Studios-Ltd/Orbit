import { FromBase64String, ToBase64String, FromUint8Array, ToUint8Array } from "Lib/Utility/Base64";

/**
 * Uint8Array class extension to more easily handle Base64
 */
 export default class Base64Uint8Array extends Uint8Array {

  constructor(base64?: string | ArrayBuffer) {
    if (base64 !== undefined && typeof base64 === "string") {
      super(FromBase64String(base64));
    }
    else if (base64 !== undefined)
      super(base64 as ArrayBuffer);
    else
      super();
  }

  /**
   * Loads data from a standard string (Non-Base64 encoded)
   * @param data String to convert to load
   * @returns A Base64Uint8Array
   */
  static FromString(data: string) : Base64Uint8Array {
    return new Base64Uint8Array(ToUint8Array(data));
  }

  /** Returns data in Base64 encoding */
  get Base64() { return ToBase64String(this);}

  /** Returns data in string format */
  get String() { return FromUint8Array(this);}
}
