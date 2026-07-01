/**
 * @file server.js
 * @description Production-ready Express application entry point.
 *
 * Middleware stack (order matters):
 *  1. Helmet        — security headers
 *  2. CORS          — restrict allowed origins
 *  3. Rate limiting — prevent abuse
 *  4. Body parsing  — JSON + URL-encoded with size limits
 *  5. Routes
 *  6. 404 handler
 *  7. Global error handler
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

// Load env vars before any other module reads process.env
dotenv.config();

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// ── Database ──────────────────────────────────────────────────────────────────
connectDB();

// ── Security: Helmet ──────────────────────────────────────────────────────────
// Sets 14 security-related HTTP response headers in one call.
app.use(helmet());

// ── Security: CORS ────────────────────────────────────────────────────────────
// In production, only the deployed frontend origin is allowed.
// CORS_ORIGIN supports a comma-separated list for multi-domain setups.
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Security: Rate limiting ───────────────────────────────────────────────────
// Global limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

// Tighter limiter for write operations
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many write requests. Please slow down." },
});

app.use("/api", globalLimiter);
app.use("/api/tasks", (req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) return writeLimiter(req, res, next);
  next();
});

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Tracker API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/tasks", taskRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀  Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  console.log(`📡  Health check → http://localhost:${PORT}/api/health`);
});

// ── Graceful shutdown (SIGTERM from Docker / Render / PM2) ───────────────────
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  server.close(() => process.exit(1));
});

module.exports = app;
