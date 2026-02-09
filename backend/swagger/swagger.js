const swaggerJsdoc = require("swagger-jsdoc");

module.exports = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RBAC API",
      version: "1.0.0"
    },
    servers: [{ url: "http://localhost:4000" }]
  },
  apis: ["./src/routes/*.js"]
});
