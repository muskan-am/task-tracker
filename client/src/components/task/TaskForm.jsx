/**
 * @file TaskForm.jsx
 * @description Create / Edit task form using React Hook Form.
 * Renders inside a Modal. Validates all fields client-side before submit.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CalendarDays, AlignLeft, Tag, Flag } from "lucide-react";

import Input from "../common/Input";
import Button from "../common/Button";
import { titleRules, descriptionRules, dueDateRules } from "../../utils/validators";
import {
  STATUS_FORM_OPTIONS,
  PRIORITY_FORM_OPTIONS,
} from "../../constants/taskConstants";

/**
 * @param {object}   props
 * @param {object}   [props.task]      - Pre-populated when editing; undefined for create
 * @param {function} props.onSubmit    - Called with validated form data
 * @param {function} props.onCancel    - Called when Cancel is clicked
 * @param {boolean}  [props.isLoading] - Disables submit while saving
 */
const TaskForm = ({ task, onSubmit, onCancel, isLoading = false }) => {
  const isEditing = Boolean(task);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "Pending",
      priority: "Medium",
      dueDate: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (task) {
      reset({
        title: task.title ?? "",
        description: task.description ?? "",
        status: task.status ?? "Pending",
        priority: task.priority ?? "Medium",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
      });
    }
  }, [task, reset]);

  const handleFormSubmit = (data) => {
    // Coerce empty dueDate string to null
    const payload = {
      ...data,
      dueDate: data.dueDate || null,
    };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="space-y-5"
    >
      {/* Title */}
      <Input
        label="Title"
        id="task-title"
        placeholder="e.g. Design the landing page"
        required
        error={errors.title?.message}
        leftIcon={<Tag size={15} />}
        {...register("title", titleRules)}
      />

      {/* Description */}
      <Input
        as="textarea"
        label="Description"
        id="task-description"
        placeholder="Add more details about this task…"
        rows={3}
        error={errors.description?.message}
        leftIcon={<AlignLeft size={15} />}
        helperText="Optional. Max 500 characters."
        {...register("description", descriptionRules)}
      />

      {/* Status + Priority row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="task-status"
            className="text-sm font-medium text-slate-700"
          >
            Status
          </label>
          <select
            id="task-status"
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            {...register("status")}
          >
            {STATUS_FORM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="task-priority"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
          >
            <Flag size={14} className="text-slate-400" aria-hidden="true" />
            Priority
          </label>
          <select
            id="task-priority"
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            {...register("priority")}
          >
            {PRIORITY_FORM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date */}
      <Input
        label="Due Date"
        id="task-dueDate"
        type="date"
        error={errors.dueDate?.message}
        leftIcon={<CalendarDays size={15} />}
        helperText="Optional. Leave blank for no deadline."
        {...register("dueDate", dueDateRules)}
      />

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} size="md">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isLoading}
        >
          {isEditing ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
