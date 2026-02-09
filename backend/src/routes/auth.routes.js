const router = require("express").Router();
const { body } = require("express-validator");
const { register, login } = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");



// Auth Routes

// POST /api/v1/auth/register → Register a new user
router.post(
  "/register",
  [
    // Validate and sanitize user name
    body("name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Name is required"),

    // Validate email format
    body("email")
      .isEmail()
      .withMessage("Invalid email address"),

    // Enforce minimum password length
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password length must be at least 8 characters")
  ],
  validate,
  register
);


//-------------------------------------------------------------------------------



// POST /api/v1/auth/login → Authenticate user and issue tokens
router.post(
  "/login",
  [
    // Validate email format
    body("email")
      .isEmail()
      .withMessage("Invalid email address"),

    // Ensure password is provided
    body("password")
      .notEmpty()
      .withMessage("Password is required")
  ],
  validate,
  login
);

// Export auth router
module.exports = router;
