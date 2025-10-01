const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.headers["x-access-token"];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey"
    );
    req.user = decoded;

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};
