export enum FileType {
  Unknown,
  Image,
  Video,
  Audio,
  Document
}

export enum ClipboardSupportedMimeType {
  PlainText = "text/plain",
  HTML = "text/html",
  PNG = "image/png"
}

export default class MimeTypeParser {
  readonly IMAGE_TYPES = /(\/|\.)(gif|jpe?g|bmp|png|webp)($|\?)/gi;
  readonly VIDEO_TYPES = /(\/|\.)(mp4|m4v|mkv|mov|avi)($|\?)/gi;
  readonly AUDIO_TYPES = /(\/|\.)(mp3|ogg|aac|m4a|m4r|mpeg)($|\?)/gi;
  readonly DOCUMENT_TYPES = /(\/|\.)(pdf|doc|docx|odt)($|\?)/gi;
  readonly IMAGE_REGEX: RegExp;
  readonly VIDEO_REGEX: RegExp;
  readonly AUDIO_REGEX: RegExp;
  readonly DOCUMENT_REGEX: RegExp;
  mimeTypeRaw: string;

  constructor(rawMimeType: string) {
    this.mimeTypeRaw = rawMimeType;
    this.IMAGE_REGEX = new RegExp(this.IMAGE_TYPES);
    this.VIDEO_REGEX = new RegExp(this.VIDEO_TYPES);
    this.AUDIO_REGEX = new RegExp(this.AUDIO_TYPES);
    this.DOCUMENT_REGEX = new RegExp(this.DOCUMENT_TYPES);
  }

  getGeneralizedFileType() : FileType {
    if (this.IMAGE_REGEX.test(this.mimeTypeRaw)) {
      return FileType.Image;
    }
    else if (this.VIDEO_REGEX.test(this.mimeTypeRaw)) {
      return FileType.Video;
    }
    else if (this.AUDIO_REGEX.test(this.mimeTypeRaw)) {
      return FileType.Audio;
    }
    else if (this.DOCUMENT_REGEX.test(this.mimeTypeRaw)) {
      return FileType.Document;
    }
    else {
      return FileType.Unknown;
    }
  }
}
