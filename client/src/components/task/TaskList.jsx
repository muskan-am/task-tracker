/**
 * @file TaskList.jsx
 * @description Renders a responsive grid of TaskCards with skeleton loading
 * and pagination controls.
 *
 * States:
 *  1. Loading (first load)  → SkeletonGrid (no layout shift)
 *  2. Empty + no filters    → EmptyState with "Add Task" CTA
 *  3. Empty + active filter → EmptyState with "clear filters" hint
 *  4. Results               → Card grid + pagination bar
 */

import { memo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useTaskContext } from "../../context/TaskContext";
import TaskCard from "./TaskCard";
import { SkeletonGrid } from "../common/SkeletonCard";
import EmptyState from "../common/EmptyState";
import Button from "../common/Button";

const TaskList = ({ onEdit, onDelete, onAddTask }) => {
  const { tasks, loading, filters, pagination, goToPage } = useTaskContext();

  const hasFilters = filters.search || filters.status || filters.priority;
  const { page, totalPages, total } = pagination;

  // ── Skeleton on initial / every load ─────────────────────────────────────
  if (loading) {
    return <SkeletonGrid count={filters.limit} />;
  }

  // ── Empty states ──────────────────────────────────────────────────────────
  if (tasks.length === 0) {
    return hasFilters ? (
      <EmptyState
        icon={<Search size={36} strokeWidth={1.5} />}
        title="No tasks match your filters"
        description="Try adjusting your search, status, or priority filters."
      />
    ) : (
      <EmptyState
        title="No tasks yet"
        description="Get started by creating your first task."
        actionLabel="Add Your First Task"
        onAction={onAddTask}
      />
    );
  }

  // ── Task grid ─────────────────────────────────────────────────────────────
  return (
    <section aria-label="Task list">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* ── Pagination ──────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <nav
          aria-label="Task list pagination"
          className="mt-6 flex items-center justify-between rounded-xl bg-white border border-slate-100 shadow-sm px-4 py-3"
        >
          <p className="text-sm text-slate-500 hidden sm:block">
            Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
            <span className="font-semibold text-slate-700">{totalPages}</span>
            <span className="ml-2 text-slate-400">({total} total)</span>
          </p>

          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              leftIcon={<ChevronLeft size={15} />}
              aria-label="Previous page"
            >
              Prev
            </Button>

            <div className="flex items-center gap-1" role="list" aria-label="Page numbers">
              {buildPageNumbers(page, totalPages).map((item, idx) =>
                item === "…" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-sm text-slate-400 select-none"
                    aria-hidden="true"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => goToPage(item)}
                    aria-label={`Page ${item}`}
                    aria-current={item === page ? "page" : undefined}
                    className={[
                      "h-8 w-8 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                      item === page
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              rightIcon={<ChevronRight size={15} />}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </section>
  );
};

/** Builds a page number array with ellipsis for large page counts. */
function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export default memo(TaskList);
