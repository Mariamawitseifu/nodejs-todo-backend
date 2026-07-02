const sequelize = require('../db');
const User = require('./user.model');
const Task = require('./task.model');

module.exports = { sequelize, User, Task };
