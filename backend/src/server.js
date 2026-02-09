require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const getLogger = require("./config/logger");

// Initialize server-level logger
const logger = getLogger("server");

// Establish database connection
connectDB();

// Initialize Redis connection
require("./config/redis");

const PORT = process.env.PORT || 4000;

// Start HTTP server
app.listen(PORT,"0.0.0.0", () => {
  logger.info(`Server running on port ${PORT}`);
});
