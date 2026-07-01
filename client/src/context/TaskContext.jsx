/**
 * @file TaskContext.jsx
 * @description Global task state powered by live MongoDB data via the Express API.
 *
 * Architecture:
 *  - All filtering, sorting, searching and pagination are delegated to the
 *    backend. The frontend only stores what the server returns.
 *  - `fetchTasks()` is the single source of truth for re-fetching — it is
 *    called on mount and after every mutating operation (create / update / delete).
 *  - Pagination metadata (total, page, totalPages) comes from the server
 *    response envelope and is stored in state.
 *
 * State shape:
 *  {
 *    tasks:      Task[]          // current page of tasks from server
 *    loading:    boolean         // true while any fetch is in-flight
 *    error:      string | null   // last fetch error message
 *    filters:    FiltersObject   // drives the next fetchTasks() call
 *    pagination: PaginationMeta  // total / page / totalPages from server
 *  }
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import taskService from "../services/taskService";

// ── Initial values ────────────────────────────────────────────────────────────

const initialFilters = {
  search: "",
  status: "",
  priority: "",
  sortBy: "createdAt",
  order: "desc",
  page: 1,
  limit: 9, // 3-column grid looks best with multiples of 3
};

const initialPagination = {
  total: 0,
  page: 1,
  limit: 9,
  totalPages: 1,
};

const initialState = {
  tasks: [],
  loading: true, // true on first paint so the spinner shows immediately
  error: null,
  filters: initialFilters,
  pagination: initialPagination,
};

// ── Reducer ───────────────────────────────────────────────────────────────────

const taskReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        tasks: action.payload.tasks,
        pagination: action.payload.pagination,
      };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "SET_FILTERS":
      // When a filter changes (anything except page), reset to page 1
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
          // If the caller didn't explicitly set page, reset to 1
          page: action.payload.page ?? 1,
        },
      };

    case "RESET_FILTERS":
      return { ...state, filters: initialFilters };

    default:
      return state;
  }
};

// ── Context ───────────────────────────────────────────────────────────────────

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // ── Core fetch function ─────────────────────────────────────────────────
  /**
   * Fetches tasks from the API using the current filters in state.
   * Called on mount and whenever filters change.
   * Can also be called imperatively after mutations (create / update / delete).
   *
   * @param {object} [overrideFilters] - Merge with current filters for this call only
   */
  const fetchTasks = useCallback(async (overrideFilters = {}) => {
    dispatch({ type: "FETCH_START" });
    try {
      const params = { ...state.filters, ...overrideFilters };
      const response = await taskService.getAllTasks(params);
      const { tasks, pagination } = response.data.data;
      dispatch({ type: "FETCH_SUCCESS", payload: { tasks, pagination } });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  // ── Auto-fetch whenever filters change ──────────────────────────────────
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Filter actions ──────────────────────────────────────────────────────
  const setFilters = useCallback((newFilters) => {
    dispatch({ type: "SET_FILTERS", payload: newFilters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  // ── Pagination helpers ──────────────────────────────────────────────────
  const goToPage = useCallback((page) => {
    dispatch({ type: "SET_FILTERS", payload: { page } });
  }, []);

  // ── CRUD — each calls the API then refreshes the list ──────────────────

  /**
   * Create a new task via POST /api/tasks.
   * @param {object} data - Task payload
   * @returns {object} The created task document
   */
  const createTask = useCallback(async (data) => {
    const response = await taskService.createTask(data);
    const created = response.data.data;
    // Refresh to page 1 so the new task is visible
    dispatch({ type: "SET_FILTERS", payload: { page: 1 } });
    return created;
  }, []);

  /**
   * Update an existing task via PUT /api/tasks/:id.
   * @param {string} id
   * @param {object} data - Fields to update
   * @returns {object} The updated task document
   */
  const updateTask = useCallback(async (id, data) => {
    const response = await taskService.updateTask(id, data);
    const updated = response.data.data;
    // Refresh in place — stay on the same page
    dispatch({ type: "SET_FILTERS", payload: { page: state.filters.page } });
    return updated;
  }, [state.filters.page]);

  /**
   * Delete a task via DELETE /api/tasks/:id.
   * @param {string} id
   */
  const deleteTask = useCallback(async (id) => {
    await taskService.deleteTask(id);
    // If deleting the last item on a non-first page, go back one page
    const isLastOnPage =
      state.tasks.length === 1 && state.filters.page > 1;
    dispatch({
      type: "SET_FILTERS",
      payload: { page: isLastOnPage ? state.filters.page - 1 : state.filters.page },
    });
  }, [state.tasks.length, state.filters.page]);

  // ── Derived stats — computed from current page + pagination total ───────
  // Note: stats reflect the FULL collection (use pagination.total), not
  // just the current page. We keep per-status counts from the current page
  // for the summary cards — in a production app you'd have a /stats endpoint.
  const stats = {
    total: state.pagination.total,
    pending: state.tasks.filter((t) => t.status === "Pending").length,
    inProgress: state.tasks.filter((t) => t.status === "In Progress").length,
    completed: state.tasks.filter((t) => t.status === "Completed").length,
  };

  return (
    <TaskContext.Provider
      value={{
        // State
        tasks: state.tasks,
        loading: state.loading,
        error: state.error,
        filters: state.filters,
        pagination: state.pagination,
        stats,
        // Actions
        fetchTasks,
        setFilters,
        resetFilters,
        goToPage,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

/** Convenience hook — throws if used outside <TaskProvider> */
export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used inside <TaskProvider>");
  return ctx;
};
