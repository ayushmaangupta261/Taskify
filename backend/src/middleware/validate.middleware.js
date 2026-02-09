const { validationResult } = require("express-validator");

// Middleware to handle request validation results
module.exports = (req, res, next) => {
  // Extract validation errors from the request
  const errors = validationResult(req);

  // Return formatted errors if validation fails
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors
    });
  }

  // Continue if validation passes
  next();
};

