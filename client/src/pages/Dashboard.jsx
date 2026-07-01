/**
 * @file Dashboard.jsx
 * @description Main dashboard page. Composes all task UI sections:
 * stats, filter bar, task list, and the create/edit/delete modals.
 */

import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import PageWrapper from "../components/layout/PageWrapper";
import TaskStats from "../components/task/TaskStats";
import TaskFilter from "../components/task/TaskFilter";
import TaskList from "../components/task/TaskList";
import TaskForm from "../components/task/TaskForm";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import useTasks from "../hooks/useTasks";

const Dashboard = () => {
  const {
    isFormOpen,
    isDeleteOpen,
    selectedTask,
    isSubmitting,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleSubmit,
    handleOpenDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useTasks();

  return (
    <>
      <PageWrapper
        title="My Tasks"
        subtitle="Manage and track all your tasks in one place."
        actions={
          <Button
            onClick={handleOpenCreate}
            leftIcon={<Plus size={16} />}
            size="md"
          >
            Add Task
          </Button>
        }
      >
        {/* Stats row */}
        <section aria-label="Task statistics" className="mb-6">
          <TaskStats />
        </section>

        {/* Filter + search bar */}
        <section aria-label="Filter tasks" className="mb-5">
          <TaskFilter />
        </section>

        {/* Task grid */}
        <TaskList
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onAddTask={handleOpenCreate}
        />
      </PageWrapper>

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={selectedTask ? "Edit Task" : "Create New Task"}
        size="md"
      >
        <TaskForm
          task={selectedTask}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* ── Delete Confirmation Modal ───────────────────────────────────────── */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={handleCancelDelete}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                Are you sure you want to delete this task?
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCancelDelete}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={handleConfirmDelete}
              loading={isSubmitting}
            >
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Dashboard;
