/**
 * @file priorityHelpers.js
 * @description Returns Tailwind CSS classes for status and priority badges.
 */

import { TASK_STATUS, TASK_PRIORITY } from "../constants/taskConstants";

/**
 * Returns the Tailwind badge classes for a given status value.
 * @param {string} status
 * @returns {{ bg: string, text: string, dot: string }}
 */
export const getStatusStyles = (status) => {
  switch (status) {
    case TASK_STATUS.COMPLETED:
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        border: "border-emerald-200",
      };
    case TASK_STATUS.IN_PROGRESS:
      return {
        bg: "bg-blue-100",
        text: "text-blue-700",
        dot: "bg-blue-500",
        border: "border-blue-200",
      };
    case TASK_STATUS.PENDING:
    default:
      return {
        bg: "bg-amber-100",
        text: "text-amber-700",
        dot: "bg-amber-500",
        border: "border-amber-200",
      };
  }
};

/**
 * Returns the Tailwind badge classes for a given priority value.
 * @param {string} priority
 * @returns {{ bg: string, text: string, border: string }}
 */
export const getPriorityStyles = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        icon: "🔴",
      };
    case TASK_PRIORITY.MEDIUM:
      return {
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-200",
        icon: "🟡",
      };
    case TASK_PRIORITY.LOW:
    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-200",
        icon: "🟢",
      };
  }
};
