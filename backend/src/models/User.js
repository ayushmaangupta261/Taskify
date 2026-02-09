const mongoose = require("mongoose");

// User schema definition
const userSchema = new mongoose.Schema(
  {
    // User full name
    name: {
      type: String,
      required: true
    },

    // Unique email address for login
    email: {
      type: String,
      required: true,
      unique: true
    },

    // Hashed user password
    password: {
      type: String,
      required: true
    },

    // Role assigned to the user
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: null
    },

    // Hashed refresh token for session management
    refreshToken: {
      type: String 
    }
  },
  // Automatically manage createdAt and updatedAt fields
  { timestamps: true }
);

// Export User model
module.exports = mongoose.model("User", userSchema);
