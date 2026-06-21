const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    // 1. Extract token from cookies
    const token = req.cookies ? req.cookies.token : null;

    // 2. Verify token existence
    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    // 3. Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

module.exports = protect;