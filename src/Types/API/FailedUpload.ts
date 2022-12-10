export enum FailReason {
  UploadSizeExcceded = 413,
  ChannelNotFound = 404,
  NotPermitted = 403,
  ServerFailure = 500
}

export default class FailedUpload {
  failReason: FailReason;
  filename: string;
  id: string;

  constructor(failReason: FailReason, filename: string, id: string) {
    this.failReason = failReason
    this.filename = filename
    this.id = id
  }
}
