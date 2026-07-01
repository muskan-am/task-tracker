/**
 * @file taskService.js
 * @description All HTTP calls for the Task resource.
 *
 * Every method returns the Axios response object so the caller can
 * destructure `response.data` which contains our ApiResponse envelope:
 *   { success: true, message: "…", data: <payload>, count?: number }
 *
 * Filtering, sorting, searching and pagination are all handled by the
 * backend — we just forward the query params as-is.
 */

import api from "./api";

const taskService = {
  /**
   * Fetch all tasks with optional server-side filtering, sorting & pagination.
   *
   * @param {object} params
   * @param {string} [params.search]   - Title substring search
   * @param {string} [params.status]   - Pending | In Progress | Completed
   * @param {string} [params.priority] - Low | Medium | High
   * @param {string} [params.sortBy]   - Field name (createdAt, dueDate, …)
   * @param {string} [params.order]    - asc | desc
   * @param {number} [params.page]     - Page number (1-based)
   * @param {number} [params.limit]    - Items per page
   * @returns {Promise<import("axios").AxiosResponse>}
   */
  getAllTasks: (params = {}) => {
    // Strip empty-string values so the backend doesn't receive ?status=&priority=
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined)
    );
    return api.get("/tasks", { params: cleanParams });
  },

  /**
   * Fetch a single task by its MongoDB ObjectId.
   * @param {string} id
   */
  getTaskById: (id) => api.get(`/tasks/${id}`),

  /**
   * Create a new task.
   * @param {{ title: string, description?: string, status?: string, priority?: string, dueDate?: string|null }} data
   */
  createTask: (data) => api.post("/tasks", data),

  /**
   * Partially or fully update an existing task.
   * @param {string} id
   * @param {object} data - Only the fields to update
   */
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),

  /**
   * Permanently delete a task.
   * @param {string} id
   */
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export default taskService;
