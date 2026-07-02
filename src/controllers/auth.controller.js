const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Extract token from header (x-access-token or Authorization: Bearer <token>)
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({ message: "Missing registration fields" });
    }
    const hash = bcrypt.hashSync(password, 8);
    const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await db.query(insertQuery, [username, email, hash]);
    res.send({ message: "User registered successfully!", user: rows[0] });
  } catch (err) {
    next(err);
  }
};

// Get basic user data (username) for authenticated user
exports.getUserData = async (req, res, next) => {
  try {
    const query = `SELECT username FROM users WHERE id = $1`;
    const { rows } = await db.query(query, [req.userId]);
    if (rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ username: rows[0].username });
  } catch (err) {
    next(err);
  }
};

// Login – generate JWT token on successful authentication
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await db.query(query, [email]);
    if (rows.length === 0) {
      return res.status(401).send({ message: "Invalid email and password combination." });
    }
    const user = rows[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid email and password combination." });
    }
    // Sign a JWT token (expires in 24h)
    const token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN, { expiresIn: 86400 });
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyToken, register: exports.register, getUserData: exports.getUserData, login: exports.login };
