/**
 * @file ApiResponse.js
 * @description Utility class for building consistent JSON response envelopes.
 * Every endpoint returns the same outer shape so the frontend
 * can rely on a single parsing pattern.
 *
 * Success shape:
 *   { success: true,  message: string, data: any,  count?: number }
 *
 * Error shape:
 *   { success: false, message: string, errors?: any }
 */

class ApiResponse {
  /**
   * Send a successful response.
   *
   * @param {import('express').Response} res    - Express response object
   * @param {number}                    status  - HTTP status code (2xx)
   * @param {string}                    message - Human-readable success message
   * @param {*}                         data    - Payload to include (object or array)
   */
  static success(res, status = 200, message = "Success", data = null) {
    const body = { success: true, message };

    if (data !== null && data !== undefined) {
      body.data = data;

      // Convenience: attach element count when the payload is an array
      if (Array.isArray(data)) {
        body.count = data.length;
      }
    }

    return res.status(status).json(body);
  }

  /**
   * Send an error response.
   *
   * @param {import('express').Response} res    - Express response object
   * @param {number}                    status  - HTTP status code (4xx / 5xx)
   * @param {string}                    message - Human-readable error message
   * @param {*}                         errors  - Optional error detail (validation array, etc.)
   */
  static error(res, status = 500, message = "Internal Server Error", errors = null) {
    const body = { success: false, message };

    if (errors !== null && errors !== undefined) {
      body.errors = errors;
    }

    return res.status(status).json(body);
  }
}

module.exports = ApiResponse;
