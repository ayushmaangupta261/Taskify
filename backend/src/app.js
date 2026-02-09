const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const requestLogger = require("./middleware/request.logger");
const errorHandler = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const workRoutes = require("./routes/work.routes");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const base = require("./docs/swagger");
const components = require("./docs/components.js");
const auth = require("./docs/paths/auth.swagger");
const work = require("./docs/paths/work.swagger");
const task = require("./docs/paths/task.swagger");

const app = express();

// Register global middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Backend Auth & RBAC API is running 🚀",
    status: "OK"
  });
});

// API route registrations
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/works", workRoutes);

// Swagger configuration
const swaggerSpec = swaggerJsdoc({
  definition: {
    ...base,
    components,
    paths: {
      ...auth,
      ...work,
      ...task
    }
  },
  apis: []
});

// Enable Swagger UI only in development
if (process.env.NODE_ENV === "development") {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
}

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
