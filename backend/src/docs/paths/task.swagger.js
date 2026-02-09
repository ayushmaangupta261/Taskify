// Swagger definitions for task management APIs
module.exports = {
  
  // Create Task (Admin only)
  "/api/v1/tasks/create-task": {
    post: {
      tags: ["Task"],
      summary: "Create task (Admin)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              // Required fields to create a task
              required: ["title", "workId", "assignedTo"],
              properties: {
                // Task title
                title: { type: "string" },
                // Optional task description
                description: { type: "string" },
                // Associated work ID
                workId: { type: "string" },
                // User ID to assign the task to
                assignedTo: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        // Task created successfully
        201: { description: "Task created" }
      }
    }
  },



  // ------------------------------------------------------------------------------



  // Get Logged-in User Tasks by Work
  "/api/v1/tasks/get-user-task-by-work/{workId}": {
    get: {
      tags: ["Task"],
      summary: "Get logged-in user's tasks for a work (user)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          // Work identifier
          name: "workId",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        // User task list response
        200: { description: "User tasks" }
      }
    }
  },



// --------------------------------------------------------------------------------------



  // Update Task Status (User)
  "/api/v1/tasks/status/{taskId}": {
    patch: {
      tags: ["Task"],
      summary: "Update task status (user)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          // Task identifier
          name: "taskId",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              properties: {
                // New task status
                status: {
                  type: "string",
                  enum: ["pending", "accepted", "in_progress", "completed"]
                }
              }
            }
          }
        }
      },
      responses: {
        // Task status updated
        200: { description: "Task updated" }
      }
    }
  },




  // -------------------------------------------------------------------------------------------



  // Get All Tasks of a Work (Admin)
  "/api/v1/tasks/{workId}": {
    get: {
      tags: ["Task"],
      summary: "Get all tasks of a work (Admin)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          // Work identifier
          name: "workId",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        // List of tasks for the work
        200: { description: "Tasks list" }
      }
    }
  }
};
