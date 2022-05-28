import { GenerateBase64SHA256 } from "NSLib/NCEncryption";
import { Base64String, ToBase64String, ToUint8Array } from "../NSLib/Base64";

export default class MessageAttachment {
    id: string;
    contents: Uint8Array;
    filename: string;

    constructor(contents: Uint8Array, filename: string) {
        this.contents = contents;
        GenerateBase64SHA256(filename).then((id: Base64String) => {
            this.id = id.Base64;
        });
        this.id = "";
        this.filename = filename;
    }
}
