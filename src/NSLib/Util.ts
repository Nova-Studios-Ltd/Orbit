import Dimensions from "../DataTypes/Dimensions";
import customProtocolCheck from "custom-protocol-check";

export async function GetImageDimensions(buffer: Uint8Array) : Promise<Dimensions | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([buffer]));
    const img = new Image();
    try {
      img.src = url;
      img.onload = function() {
        resolve(new Dimensions(img.width, img.height));
      };
      img.onerror = function() {resolve(undefined);};
      img.remove();
    }
    catch {
      resolve(undefined);
      img.remove();
    }
  });
}

export async function OpenCustomProto(url: string) : Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    if (window.navigator.userAgent.indexOf("Linux")) {
      resolve(false);
      return;
    }
    customProtocolCheck(url,
    () => {
      resolve(false);
    }, () => {
      resolve(true);
    }, 5000);
  })
}
