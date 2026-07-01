/**
 * @file validateRequest.js
 * @description express-validator rule sets and a shared result-checker
 * middleware for Task endpoints.
 *
 * Usage in routes:
 *   router.post("/", taskValidationRules.create, validate, createTask);
 *   router.put("/:id",  taskValidationRules.update, validate, updateTask);
 */

const { body, param, validationResult } = require("express-validator");
const ApiResponse = require("../utils/ApiResponse");

// ─────────────────────────────────────────────────────────────────────────────
// Reusable field-level rule builders
// ─────────────────────────────────────────────────────────────────────────────

/** Validates the :id param is a well-formed MongoDB ObjectId */
const mongoIdParam = param("id")
  .isMongoId()
  .withMessage("Invalid task ID format");

/** Title: required, 3–100 chars */
const titleRule = body("title")
  .trim()
  .notEmpty()
  .withMessage("Title is required")
  .isLength({ min: 3, max: 100 })
  .withMessage("Title must be between 3 and 100 characters");

/** Title: optional on updates, but still validated if present */
const titleOptionalRule = body("title")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Title cannot be empty")
  .isLength({ min: 3, max: 100 })
  .withMessage("Title must be between 3 and 100 characters");

/** Description: optional, max 500 chars */
const descriptionRule = body("description")
  .optional()
  .trim()
  .isLength({ max: 500 })
  .withMessage("Description cannot exceed 500 characters");

/** Status: must be one of the allowed enum values */
const statusRule = body("status")
  .optional()
  .isIn(["Pending", "In Progress", "Completed"])
  .withMessage("Status must be Pending, In Progress, or Completed");

/** Priority: must be one of the allowed enum values */
const priorityRule = body("priority")
  .optional()
  .isIn(["Low", "Medium", "High"])
  .withMessage("Priority must be Low, Medium, or High");

/** Due date: optional ISO 8601 date string, must not be in the past */
const dueDateRule = body("dueDate")
  .optional({ nullable: true })
  .isISO8601()
  .withMessage("Due date must be a valid ISO 8601 date (e.g. 2025-12-31)")
  .custom((value) => {
    if (value && new Date(value) < new Date()) {
      throw new Error("Due date cannot be in the past");
    }
    return true;
  });

// ─────────────────────────────────────────────────────────────────────────────
// Composed rule sets exported for each route
// ─────────────────────────────────────────────────────────────────────────────

const taskValidationRules = {
  /** Rules applied to POST /tasks */
  create: [titleRule, descriptionRule, statusRule, priorityRule, dueDateRule],

  /** Rules applied to PUT /tasks/:id */
  update: [mongoIdParam, titleOptionalRule, descriptionRule, statusRule, priorityRule, dueDateRule],

  /** Rules applied to GET|DELETE /tasks/:id */
  mongoId: [mongoIdParam],
};

// ─────────────────────────────────────────────────────────────────────────────
// Result checker — runs AFTER the rule arrays in the route chain
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Collects express-validator errors and short-circuits the request
 * with a 422 Unprocessable Entity if any rules failed.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Map to a clean array of { field, message } objects
    const formatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return ApiResponse.error(res, 422, "Validation failed", formatted);
  }

  next();
};

module.exports = { taskValidationRules, validate };
