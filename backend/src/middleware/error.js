import { HttpError } from "../errors.js";

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: "Route tidak ditemukan" }
  });
}

export function errorHandler(err, req, res, next) { // eslint-disable-line
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  // Default: don't leak stack in production
  const payload = {
    error: {
      code: "INTERNAL_ERROR",
      message: "Terjadi kesalahan internal"
    }
  };
  if (process.env.NODE_ENV !== "production") {
    payload.error.details = { message: String(err?.message || err), stack: err?.stack };
  }
  return res.status(500).json(payload);
}
