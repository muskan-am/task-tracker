/**
 * @file formatDate.js
 * @description Pure utility functions for date formatting and comparison.
 */

/**
 * Format a date value to a human-readable string.
 * @param {string|Date|null} date
 * @param {object} options - Intl.DateTimeFormat options override
 * @returns {string}
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "No due date";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
};

/**
 * Returns true if the given date is in the past.
 * @param {string|Date|null} date
 * @returns {boolean}
 */
export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Returns a relative label: "Today", "Tomorrow", "Overdue", or the formatted date.
 * @param {string|Date|null} date
 * @returns {string}
 */
export const relativeDueDate = (date) => {
  if (!date) return "No due date";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffMs = target - today;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return formatDate(date);
};
