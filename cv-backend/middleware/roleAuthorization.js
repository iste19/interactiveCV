const roleAuthorization = (requiredRole) => {
  return (req, res, next) => {
    console.log("Required Role:", requiredRole);
    console.log("User Role:", req.user ? req.user.role : "User not found");
    if (req.user && req.user.role === requiredRole) {
      console.log("User authorized");
      next();
    } else {
      console.log("User unauthorized");
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
  };
};

module.exports = roleAuthorization;
