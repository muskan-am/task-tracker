/**
 * @file api.js
 * @description Configured Axios instance used by all service modules.
 *
 * Responsibilities:
 *  - Sets baseURL from the VITE_API_BASE_URL environment variable
 *  - Attaches Content-Type header to every request
 *  - Response interceptor: unwraps the { success, data, message } envelope
 *    so service callers always receive the inner `data` payload directly
 *  - Error interceptor: normalises every API / network error into a plain
 *    Error with a human-readable message string
 */

import axios from "axios";

// ── Instance ──────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  // Happy path: pass the full response through (callers read .data themselves)
  (response) => response,

  // Error path: build a normalised Error with a descriptive message
  (error) => {
    let message = "An unexpected error occurred. Please try again.";

    if (error.response) {
      // Server responded with a non-2xx status
      const serverMessage = error.response.data?.message;
      const status = error.response.status;

      if (serverMessage) {
        message = serverMessage;
      } else {
        switch (status) {
          case 400:
            message = "Invalid request. Please check your input.";
            break;
          case 404:
            message = "The requested resource was not found.";
            break;
          case 409:
            message = "A conflict occurred. Please try again.";
            break;
          case 422:
            // express-validator errors — surface the first field error
            message =
              error.response.data?.errors?.[0]?.message ||
              "Validation failed. Please check your input.";
            break;
          case 500:
            message = "Server error. Please try again later.";
            break;
          default:
            message = `Request failed with status ${status}.`;
        }
      }
    } else if (error.request) {
      // Request was made but no response received (network / CORS / server down)
      message =
        "Unable to reach the server. Please check your connection and ensure the backend is running.";
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
