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

/**
 * Generates the Width and Height of a image with respect to aspect ratio
 * @param image The Dimensions of the current image
 * @param desired The Dimensions you wish to acheive
 * @returns New Dimensions
 */
export function ComputeCSSDims(image: Dimensions, desired: Dimensions) : Dimensions {
  if (image.width <= 0 && image.width <= 0) return new Dimensions(0, 0);
  const xRatio = image.width / desired.width;
  const yRatio = image.height / desired.height;
  const ratio = Math.max(xRatio, yRatio);

  let nnx = Math.floor(image.width / ratio);
  let nny = Math.floor(image.height / ratio);

  if (image.width < desired.width && image.height < desired.width)
  {
    nnx = image.width;
    nny = image.height;
  }

  return new Dimensions(nnx, nny);
}

/**
 * Tests if the provided username is of a valid format
 * @param username Username to test
 * @returns True if the username is valid otherwise false
 */
export function isValidUsername(username: string) : boolean {
  return new RegExp(/^([\S]{1,})#([0-9]{4}$)/g).test(username);
}

/**
 * Extracts the extension from the provided name
 * @param filename File name to get extension from (ie. hello.txt)
 * @returns The files extension (ie. txt)
 */
export function GetExtension(filename: string) : string {
  const re = /(?:\.([^.]+))?$/.exec(filename);
  if (re === null) return "";
  return re[1];
}
