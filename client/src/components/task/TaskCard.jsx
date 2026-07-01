/**
 * @file TaskCard.jsx
 * @description Task card with status/priority badges, due date indicator,
 * and edit/delete actions.
 *
 * Accessibility: action buttons are always visible on touch devices
 * (no hover state on mobile). On desktop they appear on group-hover.
 */

import { memo } from "react";
import { Calendar, Pencil, Trash2, AlertCircle } from "lucide-react";
import { getStatusStyles, getPriorityStyles } from "../../utils/priorityHelpers";
import { formatDate, isOverdue, relativeDueDate } from "../../utils/formatDate";

const TaskCard = memo(({ task, onEdit, onDelete }) => {
  const taskId = task._id || task.id;
  const statusStyles = getStatusStyles(task.status);
  const priorityStyles = getPriorityStyles(task.priority);
  const isCompleted = task.status === "Completed";
  const overdue = !isCompleted && task.dueDate && isOverdue(task.dueDate);

  return (
    <article
      className="group relative flex flex-col rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      aria-label={`Task: ${task.title}`}
    >
      {/* Priority accent bar */}
      <div
        className={`h-1 w-full ${
          task.priority === "High"
            ? "bg-red-400"
            : task.priority === "Medium"
            ? "bg-orange-400"
            : "bg-slate-200"
        }`}
        aria-hidden="true"
      />

      <div className="flex flex-col flex-1 p-5">
        {/* Badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`} aria-hidden="true" />
            {task.status}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${priorityStyles.bg} ${priorityStyles.text} ${priorityStyles.border}`}
          >
            {task.priority}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-sm font-semibold leading-snug line-clamp-2 ${
            isCompleted ? "line-through text-slate-400" : "text-slate-900"
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          {/* Due date */}
          <div
            className={`flex items-center gap-1.5 text-xs ${
              overdue ? "text-red-600 font-medium" : "text-slate-500"
            }`}
            title={task.dueDate ? formatDate(task.dueDate) : "No due date set"}
          >
            {overdue ? (
              <AlertCircle size={13} className="shrink-0" aria-label="Overdue" />
            ) : (
              <Calendar size={13} className="shrink-0 text-slate-400" aria-hidden="true" />
            )}
            <span>{relativeDueDate(task.dueDate)}</span>
          </div>

          {/* Actions — always visible on touch, hover-reveal on desktop */}
          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              aria-label={`Edit "${task.title}"`}
              className="rounded-lg p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(taskId)}
              aria-label={`Delete "${task.title}"`}
              className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;
