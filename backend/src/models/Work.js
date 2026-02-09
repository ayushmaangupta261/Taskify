const mongoose = require("mongoose");

// Work schema definition
const workSchema = new mongoose.Schema(
  {
    // Work title
    title: {
      type: String,
      required: true
    },

    // Optional work description
    description: String,

    // Reference to the creator (admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Users assigned to this work
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // Current status of the work
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending"
    }
  },
  // Automatically manage createdAt and updatedAt fields
  { timestamps: true }
);

// Export Work model
module.exports = mongoose.model("Work", workSchema);

