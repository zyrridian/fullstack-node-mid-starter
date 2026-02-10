export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(code, message, details) {
  return new HttpError(400, code, message, details);
}
export function notFound(code, message, details) {
  return new HttpError(404, code, message, details);
}
export function conflict(code, message, details) {
  return new HttpError(409, code, message, details);
}
