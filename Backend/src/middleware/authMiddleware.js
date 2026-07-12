const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Token Berilmadi" })
  }
  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: "Notogri yoqi Srokidan chiqgan Token" })
  }
}
function checkAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Faqat Admin Uchun"})
  }
  next()
}
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1]
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      req.user = null
    }
    } else {
      req.user = null
    }
  next();
}
module.exports = { verifyToken, checkAdmin, optionalAuth }
