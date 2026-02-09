const jwt = require("jsonwebtoken");

// Middleware to authenticate requests using JWT
module.exports = (req, res, next) => {

  // Extract access token from cookies
  const token = req.cookies?.accessToken;

  // Reject request if token is missing
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Debug log for decoded token
    console.log("Token -> ", decoded);
    next();
  } catch (error) {
    // Handle invalid or expired token
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};
