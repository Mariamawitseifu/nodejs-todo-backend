const verifyToken = (req, res, next) => {
  // No token verification needed for now; proceed directly
  next();
};

module.exports = { verifyToken };
