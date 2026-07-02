const db = require('../db');

exports.updateToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).send({ message: "FCM token is required" });
    }
    
    // Update the user's FCM token
    const query = `UPDATE users SET fcm_token = $1 WHERE id = $2 RETURNING id`;
    const { rows } = await db.query(query, [token, req.userId]);
    
    if (rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    
    res.status(200).send({ message: "FCM token updated successfully" });
  } catch (err) {
    next(err);
  }
};
