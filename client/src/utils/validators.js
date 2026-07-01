/**
 * @file validators.js
 * @description Reusable validation rule factories for React Hook Form.
 */

export const titleRules = {
  required: "Title is required",
  minLength: { value: 3, message: "Title must be at least 3 characters" },
  maxLength: { value: 100, message: "Title cannot exceed 100 characters" },
};

export const descriptionRules = {
  maxLength: { value: 500, message: "Description cannot exceed 500 characters" },
};

export const dueDateRules = {
  validate: (value) => {
    if (!value) return true; // optional field
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today || "Due date cannot be in the past";
  },
};
