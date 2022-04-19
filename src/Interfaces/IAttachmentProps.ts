export interface IAttachmentProps {
  contentUrl: string,
  content: Uint8Array,
  filename: string,
  mimeType: string,
  size: number,
  contentWidth: number,
  contentHeight: number,
  isExternal: boolean
}

export class AttachmentProps implements IAttachmentProps {
  contentUrl: string;
  content: Uint8Array;
  filename: string;
  mimeType: string;
  size: number;
  contentWidth: number;
  contentHeight: number;
  isExternal: boolean;


  constructor(
    contentUrl: string,
    content: Uint8Array,
    filename: string,
    mimeType: string,
    size: number,
    contentWidth: number,
    contentHeight: number,
    isExternal: boolean
) {
    this.contentUrl = contentUrl
    this.content = content
    this.filename = filename
    this.mimeType = mimeType
    this.size = size
    this.contentWidth = contentWidth
    this.contentHeight = contentHeight
    this.isExternal = isExternal
  }

}
