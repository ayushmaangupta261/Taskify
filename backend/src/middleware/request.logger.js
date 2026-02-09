const getLogger = require("../config/logger");

// Logger instance for incoming HTTP requests
const logger = getLogger("request middleware");

// Middleware to log basic request details
module.exports = (req, res, next) => {
  // Log request method, URL, and client IP
  logger.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  next();
};
