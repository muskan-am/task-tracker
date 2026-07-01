/**
 * @file taskConstants.js
 * @description Centralized enums for task status, priority, and UI labels.
 * Import these everywhere — never use raw strings like "In Progress" in components.
 */

export const TASK_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const TASK_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

/** Options for the status filter/select dropdowns */
export const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: TASK_STATUS.PENDING, label: "Pending" },
  { value: TASK_STATUS.IN_PROGRESS, label: "In Progress" },
  { value: TASK_STATUS.COMPLETED, label: "Completed" },
];

/** Options for the priority filter/select dropdowns */
export const PRIORITY_OPTIONS = [
  { value: "", label: "All Priorities" },
  { value: TASK_PRIORITY.LOW, label: "Low" },
  { value: TASK_PRIORITY.MEDIUM, label: "Medium" },
  { value: TASK_PRIORITY.HIGH, label: "High" },
];

/** Form-specific priority options (no "All" entry) */
export const PRIORITY_FORM_OPTIONS = [
  { value: TASK_PRIORITY.LOW, label: "Low" },
  { value: TASK_PRIORITY.MEDIUM, label: "Medium" },
  { value: TASK_PRIORITY.HIGH, label: "High" },
];

/** Form-specific status options (no "All" entry) */
export const STATUS_FORM_OPTIONS = [
  { value: TASK_STATUS.PENDING, label: "Pending" },
  { value: TASK_STATUS.IN_PROGRESS, label: "In Progress" },
  { value: TASK_STATUS.COMPLETED, label: "Completed" },
];

export const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "dueDate_asc", label: "Due Date (Earliest)" },
  { value: "dueDate_desc", label: "Due Date (Latest)" },
  { value: "priority_desc", label: "Priority (High → Low)" },
  { value: "title_asc", label: "Title (A → Z)" },
];
