// Base Swagger/OpenAPI configuration
module.exports = {
  // OpenAPI specification version
  openapi: "3.0.0",

  // API metadata
  info: {
    title: "Taskify API",
    version: "1.0.0",
    description: "Backend API documentation for Auth, Work & Task modules"
  },

  // Server configurations
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local server"
    }
  ],

  // Global security configuration
  security: [
    {
      bearerAuth: []
    }
  ]
};
