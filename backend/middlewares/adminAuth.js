export const adminAuth = (req, res, next) => {
  try {
    // Check if user exists and has admin role
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in admin authorization",
    });
  }
};
