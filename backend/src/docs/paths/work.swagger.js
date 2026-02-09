// Swagger definitions for work management APIs
module.exports = {

  // Create Work (Admin only)
  "/api/v1/works/create-work": {
    post: {
      tags: ["Work"],
      summary: "Create a work (Admin only)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              // Required fields for work creation
              required: ["title"],
              properties: {
                // Work title
                title: { type: "string" },
                // Optional work description
                description: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        // Work created successfully
        201: { description: "Work created" }
      }
    }
  },




  // -------------------------------------------------------------------------------




  // Get All Works (Admin)
  "/api/v1/works/get-all-works": {
    get: {
      tags: ["Work"],
      summary: "Get all works (admin)",
      security: [{ bearerAuth: [] }],
      responses: {
        // List of all works
        200: { description: "Works list" }
      }
    }
  },



  // ----------------------------------------------------------------------------------



  // Get Works by User ID
  "/api/v1/works/get-work-by-userid/{userId}": {
    get: {
      tags: ["Work"],
      summary: "Get works by user (user)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          // Target user identifier
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        // Works assigned to the user
        200: { description: "User works" }
      }
    }
  },

  


// ----------------------------------------------------------------------------------



  // Get Work Details (Admin)
  "/api/v1/works/{workId}": {
    get: {
      tags: ["Work"],
      summary: "Get work details (admin)",
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
        // Work details response
        200: { description: "Work details" }
      }
    }
  },



  // -----------------------------------------------------------------------------------



  // Update Work Members (Admin)
  "/api/v1/works/{workId}/members": {
    patch: {
      tags: ["Work"],
      summary: "Add / Remove members (admin)",
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
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                // Email of member to add
                addEmail: { type: "string" },
                // User IDs to remove from work
                remove: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            }
          }
        }
      },
      responses: {
        // Members updated successfully
        200: { description: "Members updated" }
      }
    }
  }
};




