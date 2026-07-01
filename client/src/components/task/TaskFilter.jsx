/**
 * @file TaskFilter.jsx
 * @description Search bar + Status / Priority / Sort dropdowns.
 *
 * Integration notes:
 *  - Search is debounced 500ms before it updates the context filter,
 *    which triggers a new GET /api/tasks?search=… request.
 *  - Status, priority, and sort changes update context immediately.
 *  - Result count reflects `pagination.total` from the server so it
 *    shows the true number of matching documents, not just the current page.
 */

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTaskContext } from "../../context/TaskContext";
import useDebounce from "../../hooks/useDebounce";
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  SORT_OPTIONS,
} from "../../constants/taskConstants";

const TaskFilter = () => {
  const { filters, setFilters, resetFilters, pagination } = useTaskContext();

  // ── Local search state — debounced before hitting the API ───────────────
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Sync debounced value → context (triggers API call)
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch, page: 1 });
    }
  // We only want this to fire when debouncedSearch changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // If filters are reset externally, sync local input back to empty
  useEffect(() => {
    if (filters.search === "" && searchInput !== "") {
      setSearchInput("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  const hasActiveFilters = filters.search || filters.status || filters.priority;

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handleClearSearch = () => {
    setSearchInput("");
    setFilters({ search: "", page: 1 });
  };

  const handleSelect = (key) => (e) =>
    setFilters({ [key]: e.target.value, page: 1 });

  const handleSort = (e) => {
    const [sortBy, order] = e.target.value.split("_");
    setFilters({ sortBy, order, page: 1 });
  };

  const handleReset = () => {
    setSearchInput("");
    resetFilters();
  };

  const currentSortValue = `${filters.sortBy}_${filters.order}`;

  return (
    <div className="rounded-xl bg-white border border-slate-100 shadow-sm p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">

        {/* ── Search ────────────────────────────────────────────────────── */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search tasks…"
            aria-label="Search tasks by title"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ── Status filter ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={15}
            className="text-slate-400 shrink-0"
            aria-hidden="true"
          />
          <select
            value={filters.status}
            onChange={handleSelect("status")}
            aria-label="Filter by status"
            className="rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-700 transition-colors hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Priority filter ───────────────────────────────────────────── */}
        <div>
          <select
            value={filters.priority}
            onChange={handleSelect("priority")}
            aria-label="Filter by priority"
            className="rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-700 transition-colors hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Sort ──────────────────────────────────────────────────────── */}
        <div>
          <select
            value={currentSortValue}
            onChange={handleSort}
            aria-label="Sort tasks"
            className="rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-700 transition-colors hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── Clear all filters ─────────────────────────────────────────── */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* ── Result summary ────────────────────────────────────────────────── */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
        <p className="text-xs text-slate-500">
          {pagination.total === 0 ? (
            "No tasks found"
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {(filters.page - 1) * filters.limit + 1}
                {" – "}
                {Math.min(filters.page * filters.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.total}
              </span>{" "}
              task{pagination.total !== 1 ? "s" : ""}
            </>
          )}
        </p>
        {hasActiveFilters && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            Filters active
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;
