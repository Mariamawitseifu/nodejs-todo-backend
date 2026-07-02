const db = require("../db");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const { rows } = await db.query(
      "SELECT username, email FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (rows.length > 0) {
      const user = rows[0];

      if (user.username === username) {
        return res.status(400).send({
          message: "Failed! Username is already in use!",
        });
      }

      if (user.email === email) {
        return res.status(400).send({
          message: "Failed! Email is already in use!",
        });
      }
    }

    next();
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  checkDuplicateUsernameOrEmail,
};