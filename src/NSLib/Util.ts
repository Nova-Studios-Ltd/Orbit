import Dimensions from "../DataTypes/Dimensions";

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