/**
 * Represents commonly used HTTP Status Codes (200, 400, 401, 403, 404, 500)
 */

export enum HTTPStatus {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  ServerError = 500
}
