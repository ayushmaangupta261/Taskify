const mongoose = require("mongoose");

// Task schema definition
const taskSchema = new mongoose.Schema(
  {
    // Task title
    title: {
      type: String,
      required: true
    },

    // Optional task description
    description: String,

    // Reference to the associated work
    workId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Work",
      required: true
    },

    // Reference to the assigned user
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Current status of the task
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed"],
      default: "pending"
    }
  },
  // Automatically manage createdAt and updatedAt fields
  { timestamps: true }
);

// Export Task model
module.exports = mongoose.model("Task", taskSchema);
