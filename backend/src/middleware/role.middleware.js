// Middleware factory to enforce role-based access control
module.exports = (role) => (req, res, next) => {
  // Deny access if user role does not match required role
  if (req.user.role !== role)
    return res.status(403).json({ message: "Forbidden" });

  // Proceed if role is authorized
  next();
};


