import { sendError } from "../utils/response.js";

export function notFoundHandler(_req, res) {
  sendError(res, "Route not found", 404);
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return sendError(res, message, 400);
  }

  if (err.name === "CastError") {
    return sendError(res, "Invalid ID format", 400);
  }

  if (err.code === 11000) {
    return sendError(res, "Duplicate record", 409);
  }

  return sendError(res, "Something went wrong", 500);
}
