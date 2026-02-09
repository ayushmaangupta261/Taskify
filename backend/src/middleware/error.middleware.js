const getLogger = require("../config/logger");

// Logger instance dedicated to global error handling
const logger = getLogger("error middleware");

// Centralized error-handling middleware
module.exports = (err, req, res, next) => {
  // Log error details for debugging and monitoring
  logger.error({ message: err.message, stack: err.stack });

  // Return generic error response to client
  res.status(500).json({ message: "Internal Server Error" });
};

