import { sendSuccess } from "../utils/response.js";

export function respondSuccess(_req, res) {
  const statusCode = res.locals.statusCode || 200;
  return sendSuccess(res, res.locals.result, "Operation successful", statusCode);
}
