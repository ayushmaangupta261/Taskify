// Shared Swagger components configuration
module.exports = {

  // Security Schemes
  securitySchemes: {
    // JWT-based bearer authentication
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT"
    }
  },



  // ---------------------------------------------------------------------------



  // Reusable Data Schemas
  schemas: {
    // User schema definition
    User: {
      type: "object",
      properties: {
        _id: { type: "string" },     // User identifier
        name: { type: "string" },    // User name
        email: { type: "string" },   // User email
        role: { type: "string" }     // User role
      }
    },

    // Work schema definition
    Work: {
      type: "object",
      properties: {
        _id: { type: "string" },       // Work identifier
        title: { type: "string" },     // Work title
        description: { type: "string" }, // Work description
        status: {
          type: "string",              // Current work status
          enum: ["pending", "in_progress", "completed"]
        }
      }
    },

    // Task schema definition
    Task: {
      type: "object",
      properties: {
        _id: { type: "string" },      // Task identifier
        title: { type: "string" },    // Task title
        status: {
          type: "string",             // Task status
          enum: ["pending", "accepted", "in_progress", "completed"]
        }
      }
    }
  }
};
