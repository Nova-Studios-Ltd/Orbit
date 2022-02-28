import { IAttachmentProps } from "./IAttachmentProps";
import Dimensions from "../DataTypes/Dimensions";

export interface IMessageProps {
    message_Id: string,
    author_UUID: string,
    author: string,
    content: string,
    iv: string,
    encryptedKeys: { [key: string] : string; },
    timestamp: string,
    editedTimestamp: string,
    edited: boolean,
    avatar: string,
    attachments: IAttachmentProps[],
    onUpdate: () => void;
    onImageClick?: (src: string, dimensions: Dimensions) => void;
  }