/**
 * @file errorHandler.js
 * @description Global Express error-handling middleware.
 * Must be registered LAST (after all routes) in server.js.
 *
 * Handles:
 *  - Mongoose CastError       → 400 Bad Request  (malformed ObjectId)
 *  - Mongoose ValidationError → 422 Unprocessable Entity
 *  - Mongoose duplicate key   → 409 Conflict
 *  - JWT errors               → 401 Unauthorized (ready for auth extension)
 *  - Everything else          → 500 Internal Server Error
 */

const ApiResponse = require("../utils/ApiResponse");

/**
 * Centralized error handler.
 *
 * @param {Error}                          err
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next   - Required 4-arg signature for Express
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Always log the full error server-side for debugging
  console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err);

  // ── Mongoose: invalid ObjectId ────────────────────────────────────────────
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return ApiResponse.error(res, 400, `Invalid ID: ${err.value} is not a valid resource ID`);
  }

  // ── Mongoose: schema-level validation failure ─────────────────────────────
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiResponse.error(res, 422, "Validation failed", errors);
  }

  // ── MongoDB: duplicate unique key ─────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.error(
      res,
      409,
      `Duplicate value: a record with this ${field} already exists`
    );
  }

  // ── JWT: token expired (ready for auth middleware extension) ──────────────
  if (err.name === "TokenExpiredError") {
    return ApiResponse.error(res, 401, "Session expired, please log in again");
  }

  // ── JWT: malformed token ──────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    return ApiResponse.error(res, 401, "Invalid token, please log in again");
  }

  // ── Generic / unknown errors ──────────────────────────────────────────────
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal Server Error" // hide internals in prod
      : err.message || "Internal Server Error";

  return ApiResponse.error(res, statusCode, message);
};

module.exports = errorHandler;
