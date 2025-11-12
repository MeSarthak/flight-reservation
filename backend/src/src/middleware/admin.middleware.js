const { requireAuth } = require("./auth.middleware");

exports.requireAdmin = async (req, res, next) => {
  try {
    // Run authentication first
    await new Promise((resolve, reject) => {
      requireAuth(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // After requireAuth, req.user should exist
    if (!req.user) {
      return res.status(401).json({ status: false, message: "Unauthorized: No user found" });
    }

    // Verify role
    if (req.user.role !== "admin") {
      return res.status(403).json({ status: false, message: "Admin access required" });
    }

    // All good
    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    res.status(500).json({ status: false, message: "Internal server error in admin middleware" });
  }
};
