import { HTTPStatus } from "Lib/API/NetAPI/HTTPStatus";
import Dimensions from "Types/Dimensions";
import { API_DOMAIN } from "vars";
import MimeTypeParser, { FileType } from "./MimeTypeParser";

/**
 * Gets the generalized File Type of a URL
 * @param url URL to get FileType of
 * @returns A FileType, FileType.Unknown if unable to determine file type
 */
export async function GetMimeType(url: string): Promise<FileType> {
  const type = new MimeTypeParser(url).getGeneralizedFileType();
  if (type !== FileType.Unknown) return type;
  const req = await fetch(`${API_DOMAIN}/Proxy?url=${encodeURIComponent(url)}`, {
    method: "HEAD"
  });
  if (req.status !== HTTPStatus.OK) return FileType.Unknown;
  return new MimeTypeParser((await req.blob()).type).getGeneralizedFileType();
}

/**
 * Gets the size of a image from a URL
 * @param url URL of a image or Uint8Array
 * @returns A dimensions object that contains the size of the image
 */
export async function GetImageSize(image: string | Uint8Array) : Promise<Dimensions> {
  if (typeof image === "string")
    return new Promise<Dimensions>((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(new Dimensions(img.width, img.height))
        img.remove();
      };
      img.onerror = () => {
        resolve(new Dimensions(-1, -1))
        img.remove();
      };
      img.src = `${API_DOMAIN}/Proxy?url=${encodeURIComponent(image as string)}`;
    });
  else
    return new Promise<Dimensions>((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(new Dimensions(img.width, img.height))
        img.remove();
      };
      img.onerror = () => {
        resolve(new Dimensions(-1, -1))
        img.remove();
      };
      img.src = URL.createObjectURL(new Blob([image as Uint8Array]));
    });
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
