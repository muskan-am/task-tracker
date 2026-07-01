/**
 * @file Task.js
 * @description Mongoose schema and model for the Task resource.
 * Defines shape, validation rules, and automatic timestamps.
 */

const mongoose = require("mongoose");

/**
 * @typedef {Object} Task
 * @property {string}  title       - Short descriptive title (required)
 * @property {string}  description - Optional longer detail
 * @property {string}  status      - Workflow state of the task
 * @property {string}  priority    - Urgency level of the task
 * @property {Date}    dueDate     - Optional deadline
 * @property {Date}    createdAt   - Auto-set by Mongoose timestamps
 * @property {Date}    updatedAt   - Auto-updated by Mongoose timestamps
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Completed"],
        message: "Status must be Pending, In Progress, or Completed",
      },
      default: "Pending",
    },

    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "Priority must be Low, Medium, or High",
      },
      default: "Medium",
    },

    dueDate: {
      type: Date,
      default: null,
      validate: {
        // Reject dates that are already in the past at creation time.
        // We only run this on new documents (not updates) via the
        // controller-level partial-update logic.
        validator: function (value) {
          if (!value) return true; // dueDate is optional
          return value >= new Date();
        },
        message: "Due date cannot be in the past",
      },
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,

    // Clean up the JSON output — remove __v and rename _id to id
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Index frequently queried fields for performance
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdAt: -1 }); // default sort order

module.exports = mongoose.model("Task", taskSchema);
