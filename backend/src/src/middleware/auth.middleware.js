const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");

const SECRET = process.env.SECRET || "change-me";

exports.requireAuth = async (req, res, next) => {
  const auth = req.headers.authorization || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ status: false, message: "Missing token" });

  const token = m[1];
  try {
    const payload = jwt.verify(token, SECRET);
    const user = await authService.getUserById(payload.user_id);

    if (!user) return res.status(401).json({ status: false, message: "Invalid token (user not found)" });

    req.user = { user_id: user.user_id, role: user.role, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

