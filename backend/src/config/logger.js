const winston = require("winston");
const path = require("path");

// Creates and configures a logger for a specific controller
const createLoggerInstance = (controllerName) => {
  return winston.createLogger({
    level: "info",
    // Adds timestamp and outputs logs in JSON format
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      // Controller-specific log file
      new winston.transports.File({
        filename: path.join("logs", `${controllerName}.log`)
      }),

      // Centralized error log file
      new winston.transports.File({
        filename: path.join("logs", "error.log"),
        level: "error"
      })
    ]
  });
};

const loggers = {};

// Returns a cached logger instance per controller
const getLogger = (controllerName) => {
  // Create logger only once per controller
  if (!loggers[controllerName]) {
    loggers[controllerName] = createLoggerInstance(controllerName);

    // Enable console logging in non-production environments
    if (process.env.NODE_ENV !== "production") {
      loggers[controllerName].add(
        new winston.transports.Console({
          format: winston.format.simple()
        })
      );
    }
  }

  // Reuse existing logger instance
  return loggers[controllerName];
};

module.exports = getLogger;
