import { SHA256 } from "Lib/Encryption/Util";
import Base64Uint8Array from "Lib/Objects/Base64Uint8Array";


export default class MessageAttachment {
    id: string;
    contents: Uint8Array;
    filename: string;

    constructor(contents: Uint8Array, filename: string) {
        this.contents = contents;
        this.id = "";
        SHA256(filename).then((id: Base64Uint8Array) => {
            this.id = id.Base64;
        });
        this.filename = filename;
    }
}
