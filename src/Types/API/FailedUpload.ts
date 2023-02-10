import { HTTPStatus } from "Lib/API/NetAPI/HTTPStatus";

export enum FailReason {
  UploadSizeExceeded = 413,
  ChannelNotFound = 404,
  NotPermitted = 403,
  ServerFailure = 500
}

export function HTTPStatusToFailReason(status: HTTPStatus) {
  const cast = Number.parseInt(FailReason[status]);
  if (!cast) return status;
  return cast;
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
