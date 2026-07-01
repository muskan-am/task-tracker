/**
 * @file useTasks.js
 * @description Custom hook that bridges the TaskContext API methods with
 * local UI state (modal visibility, selected task, delete target).
 *
 * Keeps Dashboard.jsx thin — it only calls handlers and reads modal flags.
 * All actual API communication happens in TaskContext via taskService.
 */

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useTaskContext } from "../context/TaskContext";

const useTasks = () => {
  const { createTask, updateTask, deleteTask } = useTaskContext();

  // ── Local UI state ────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);  // task being edited
  const [taskToDelete, setTaskToDelete] = useState(null);  // id to delete
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Open Create modal ─────────────────────────────────────────────────────
  const handleOpenCreate = useCallback(() => {
    setSelectedTask(null);
    setIsFormOpen(true);
  }, []);

  // ── Open Edit modal ───────────────────────────────────────────────────────
  const handleOpenEdit = useCallback((task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  }, []);

  // ── Close form modal ──────────────────────────────────────────────────────
  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedTask(null);
  }, []);

  // ── Submit: create or update ──────────────────────────────────────────────
  /**
   * Called by TaskForm with validated form data.
   * Routes to createTask() or updateTask() based on whether selectedTask exists.
   */
  const handleSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);
      try {
        if (selectedTask) {
          // ── Update ──────────────────────────────────────────────────────
          await updateTask(selectedTask._id || selectedTask.id, data);
          toast.success("Task updated successfully!");
        } else {
          // ── Create ──────────────────────────────────────────────────────
          await createTask(data);
          toast.success("Task created successfully!");
        }
        handleCloseForm();
      } catch (err) {
        // err.message is already normalised by the Axios interceptor
        toast.error(err.message || "Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedTask, createTask, updateTask, handleCloseForm]
  );

  // ── Open Delete confirmation ──────────────────────────────────────────────
  const handleOpenDelete = useCallback((taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteOpen(true);
  }, []);

  // ── Confirm Delete ────────────────────────────────────────────────────────
  const handleConfirmDelete = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await deleteTask(taskToDelete);
      toast.success("Task deleted successfully.");
      setIsDeleteOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [taskToDelete, deleteTask]);

  // ── Cancel Delete ─────────────────────────────────────────────────────────
  const handleCancelDelete = useCallback(() => {
    setIsDeleteOpen(false);
    setTaskToDelete(null);
  }, []);

  return {
    // Modal state
    isFormOpen,
    isDeleteOpen,
    selectedTask,
    isSubmitting,
    // Handlers
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    handleOpenDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
};

export default useTasks;
