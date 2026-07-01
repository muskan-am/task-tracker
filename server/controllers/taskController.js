/**
 * @file taskController.js
 * @description MVC Controller — business logic for all Task endpoints.
 * Each function follows the pattern:
 *   1. Parse & sanitize request input
 *   2. Execute the Mongoose operation
 *   3. Return a consistent ApiResponse
 *   4. Pass unexpected errors to the global error handler via next(error)
 */

const Task = require("../models/Task");
const ApiResponse = require("../utils/ApiResponse");

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tasks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Fetch all tasks with optional filtering, sorting, and pagination
 * @route   GET /api/tasks
 * @access  Public
 *
 * Supported query params:
 *   status   - filter by status   (Pending | In Progress | Completed)
 *   priority - filter by priority (Low | Medium | High)
 *   search   - case-insensitive title substring search
 *   sortBy   - field to sort by   (default: createdAt)
 *   order    - asc | desc         (default: desc)
 *   page     - page number        (default: 1)
 *   limit    - items per page     (default: 10, max: 50)
 */
const getAllTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      search,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    // ── Build the filter object dynamically ───────────────────────────────
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      // Regex search on title — case-insensitive
      filter.title = { $regex: search, $options: "i" };
    }

    // ── Pagination ────────────────────────────────────────────────────────
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    // ── Sorting ───────────────────────────────────────────────────────────
    const allowedSortFields = ["createdAt", "updatedAt", "dueDate", "priority", "title"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    // ── Execute query + count in parallel for performance ─────────────────
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(pageSize)
        .lean(), // lean() returns plain JS objects — faster for read-only ops
      Task.countDocuments(filter),
    ]);

    return ApiResponse.success(res, 200, "Tasks retrieved successfully", {
      tasks,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tasks/:id
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Fetch a single task by its MongoDB ObjectId
 * @route   GET /api/tasks/:id
 * @access  Public
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return ApiResponse.error(res, 404, `Task not found with ID: ${req.params.id}`);
    }

    return ApiResponse.success(res, 200, "Task retrieved successfully", task);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/tasks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Public
 *
 * Body fields: title (required), description, status, priority, dueDate
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
    });

    return ApiResponse.success(res, 201, "Task created successfully", task);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/tasks/:id
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Update an existing task (partial or full update)
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
const updateTask = async (req, res, next) => {
  try {
    // Build a payload from only the fields the client actually sent
    // This prevents accidentally overwriting fields with undefined
    const allowedFields = ["title", "description", "status", "priority", "dueDate"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return ApiResponse.error(res, 400, "No valid fields provided for update");
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,           // return the updated document
        runValidators: true, // enforce schema validation on update
      }
    );

    if (!task) {
      return ApiResponse.error(res, 404, `Task not found with ID: ${req.params.id}`);
    }

    return ApiResponse.success(res, 200, "Task updated successfully", task);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/tasks/:id
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Permanently delete a task by ID
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return ApiResponse.error(res, 404, `Task not found with ID: ${req.params.id}`);
    }

    return ApiResponse.success(res, 200, "Task deleted successfully", null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
