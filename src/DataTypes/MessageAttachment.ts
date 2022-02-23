import { ToBase64String } from "../NSLib/Base64";
import { GenerateSHA256Hash } from "../NSLib/NCEncryption";

export default class MessageAttachment {
    id: string;
    contents: Uint8Array;

    constructor(contents: Uint8Array) {
        this.contents = contents;
        GenerateSHA256Hash(ToBase64String(contents)).then((id: string) => {
            this.id = id;
        });
        this.id = "";
    }
}