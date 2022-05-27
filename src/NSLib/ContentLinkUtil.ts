import Dimensions from "DataTypes/Dimensions";
import MimeTypeParser, { FileType } from "./MimeTypeParser";

export async function GetMimeType(url: string) : Promise<FileType> {
  const d = new MimeTypeParser(url).getGeneralizedFileType();
  if (d !== FileType.Unknown) return d;
  const res = await fetch(`https://api.novastudios.tk/Proxy?url=${url}`, {
    method: "HEAD"
  });
  if (res.status !== 200) return FileType.Unknown;
  return new MimeTypeParser((await res.blob()).type).getGeneralizedFileType();
}

export async function GetImageDimensions(url: string) : Promise<Dimensions> {
  return new Promise<Dimensions>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(new Dimensions(img.width, img.height));
    img.onerror = () => resolve(new Dimensions(-1, -1));
    img.src = `https://api.novastudios.tk/Proxy?url=${url}`;
  });
}
