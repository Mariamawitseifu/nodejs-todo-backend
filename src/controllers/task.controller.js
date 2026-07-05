const db = require('../db'); // pg Pool instance

// Helper to send all active tasks for the authenticated user
const sendTasks = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, user_id AS "userId", title, description, notes, date, time, duration, category_id AS "categoryId", completed, active, create_date AS "createDate", modify_date AS "modifyDate"
       FROM tasks WHERE user_id = $1 AND active = true ORDER BY id`,
      [req.userId]
    );
    return res.status(200).send({ data: rows });
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  await sendTasks(req, res, next);
};

// Generic update helper for a single column
const updateTask = (column, value) => async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).send({ message: "Missing task id" });
    }
    const query = `UPDATE tasks SET ${column} = $1, modify_date = NOW() WHERE id = $2 RETURNING *`;
    const { rows } = await db.query(query, [value, _id]);
    if (rows.length === 0) {
      return res.status(400).send({ message: "Task not found" });
    }
    // Return refreshed task list
    await sendTasks(req, res, next);
  } catch (err) {
    next(err);
  }
};

exports.markDone = updateTask("completed", true);
exports.markUnDone = updateTask("completed", false);
exports.deActivateTask = updateTask("active", false);
exports.activateTask = updateTask("active", true);

// Create a new task with extended fields
exports.createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      notes,
      date,
      time,
      duration,
      categoryId,
    } = req.body;
    if (!title) {
      return res.status(400).send({ message: "Task has no title" });
    }
    const insertQuery = `INSERT INTO tasks (user_id, title, description, notes, date, time, duration, category_id)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    await db.query(insertQuery, [
      req.userId,
      title,
      description || null,
      notes || null,
      date || null,
      time || null,
      duration || null,
      categoryId || null,
    ]);
    await sendTasks(req, res, next);
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY id');
    return res.status(200).send({ data: rows });
  } catch (err) {
    next(err);
  }
};
