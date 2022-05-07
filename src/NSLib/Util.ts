import Dimensions from "../DataTypes/Dimensions";
import customProtocolCheck from "custom-protocol-check";
import { NCChannelCache } from "./NCCache";

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

export function isValidUsername(username: string) {
  return new RegExp(/^([\S]{1,})#([0-9]{4}$)/g).test(username);
}

export async function HasChannelCache(channel_uuid: string) : Promise<boolean> {
  const names = (await indexedDB.databases()).flatMap((v) => {
    if (v.name !== undefined) return v.name;
    return "";
  });

  if (names.indexOf(`Cache_${channel_uuid}_1`) !== -1) return true;
  else return false;
}

export async function CacheValid(channel_uuid: string, session: string) : Promise<boolean> {
  const cache = new NCChannelCache(channel_uuid);
  if (await cache.ReadSession() === session && await cache.CacheValid()) return true;
  else {
    cache.WriteSession(session);
    return false;
  }
}
