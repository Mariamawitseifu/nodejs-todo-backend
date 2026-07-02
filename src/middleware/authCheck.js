const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET_TOKEN || "default_secret_key";

const verifyToken = (req, res, next) => {
  // Extract token from header (x-access-token or Authorization: Bearer <token>)
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken };
