/**
 * @file taskRoutes.js
 * @description Express router for the /api/tasks resource.
 * Follows the pattern: route → validation rules → validate() → controller.
 *
 * Routes:
 *   GET    /api/tasks        → getAllTasks
 *   GET    /api/tasks/:id    → getTaskById
 *   POST   /api/tasks        → createTask
 *   PUT    /api/tasks/:id    → updateTask
 *   DELETE /api/tasks/:id    → deleteTask
 */

const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { taskValidationRules, validate } = require("../middleware/validateRequest");

// ── Collection routes ─────────────────────────────────────────────────────────

router
  .route("/")
  .get(getAllTasks)                                              // GET  /api/tasks
  .post(taskValidationRules.create, validate, createTask);      // POST /api/tasks

// ── Single-resource routes ────────────────────────────────────────────────────

router
  .route("/:id")
  .get(taskValidationRules.mongoId, validate, getTaskById)      // GET    /api/tasks/:id
  .put(taskValidationRules.update, validate, updateTask)        // PUT    /api/tasks/:id
  .delete(taskValidationRules.mongoId, validate, deleteTask);   // DELETE /api/tasks/:id

module.exports = router;
