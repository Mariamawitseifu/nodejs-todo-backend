// Database pool
const { Task } = require("../models"); // Sequelize models

// Helper to send all active tasks for the authenticated user
const sendTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.userId, active: true },
      order: [["id", "ASC"]],
    });
    return res.status(200).send({ data: tasks });
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
    const [updated] = await Task.update(
      { [column]: value, modifyDate: new Date() },
      { where: { id: _id } }
    );
    if (updated === 0) {
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
    await Task.create({
      userId: req.userId,
      title,
      description: description || null,
      notes: notes || null,
      date: date || null,
      time: time || null,
      duration: duration || null,
      category_id: categoryId || null,
    });
    await sendTasks(req, res, next);
  } catch (err) {
    next(err);
  }
};
