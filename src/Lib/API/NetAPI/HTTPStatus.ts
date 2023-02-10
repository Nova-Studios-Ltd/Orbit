/**
 * Represents commonly used HTTP Status Codes
 *
 * Currently this includes `200`, `400`, `401`, `403`, `404`, `409`, `500`
 */

export enum HTTPStatus {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Conflict = 409,
  ServerError = 500
}
