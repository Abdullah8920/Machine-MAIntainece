export function sendSuccess(res, data, message = "Operation successful", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(res, message, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
