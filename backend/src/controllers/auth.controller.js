const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const getLogger = require("../config/logger.js");
const jwt = require("jsonwebtoken");
const logger = getLogger("auth");



// This register works for both user and admin
exports.register = async (req, res, next) => {
  try {
    // Extract required fields from request body
    const { name, email, password, role } = req.body;

    // Validate presence of mandatory fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required"
      });
    }

    // Debug log for incoming role
    console.log("ROle -> ", role);

    // Validate allowed roles
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email"
      });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user record
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role
    });

    // Log successful registration
    logger.info("User registered", {
      userId: user._id,
      email: user.email,
      role: user.role
    });

    // Send success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  } catch (error) {
    // Log error details
    logger.error("User registration failed", {
      message: error.message
    });
    next(error);
  }
};


// ---------------------------------------------------------------------------------------



// This register works for both user and admin
exports.login = async (req, res, next) => {
  try {
    // Extract login credentials from request
    const { email, password, role } = req.body;

    // Debug log for incoming request body
    console.log("Req body -> ", req.body);

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password and role are required"
      });
    }

    // Validate allowed roles
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // Fetch user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Ensure role matches stored user role
    if (user.role !== role) {
      return res.status(403).json({
        message: "Role mismatch"
      });
    }

    // Debug log for fetched user
    console.log("user -> ", user);

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    // Reject if password is invalid
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Generate short-lived access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    // Generate long-lived refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Store hashed refresh token in database
    user.refreshToken = await bcrypt.hash(refreshToken, 12);
    await user.save();

    // Set access token as HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000
    });

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Log successful login
    logger.info("User logged in", {
      userId: user._id,
      email: user.email
    });

    // Respond with user details
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Log login failure
    logger.error("Login failed", {
      message: error.message
    });
    next(error);
  }
};

