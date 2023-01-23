import { IAttachmentProps } from "./IAttachmentProps";
import Dimensions from "OldTypes/Dimensions";

export interface IMessageProps {
    message_Id: string,
    author_UUID: string,
    content: string,
    iv: string,
    encryptedKeys: { [key: string] : string; },
    timestamp: string,
    editedTimestamp: string,
    edited: boolean,
    avatar: string,
    attachments: IAttachmentProps[],
    encrypted: boolean,
    onUpdate: () => void;
    onImageClick?: (src: string, dimensions: Dimensions) => void;
  }
