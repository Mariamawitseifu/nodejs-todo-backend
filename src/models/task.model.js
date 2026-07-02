const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user.model');

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATEONLY },
  time: { type: DataTypes.TIME },
  duration: { type: DataTypes.INTEGER },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  timestamps: true,
});

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

module.exports = Task;