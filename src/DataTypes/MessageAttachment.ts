import { GenerateBase64SHA256 } from "NSLib/NCEncryptionBeta";
import { Base64String, ToBase64String } from "../NSLib/Base64";
export default class MessageAttachment {
    id: string;
    contents: Uint8Array;
    filename: string;

    constructor(contents: Uint8Array, filename: string) {
        this.contents = contents;
        GenerateBase64SHA256(ToBase64String(contents)).then((id: Base64String) => {
            this.id = id.Base64;
        });
        this.id = "";
        this.filename = filename;
    }
}
