
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:PASSWORD@localhost:5432/user_db');

module.exports = sequelize;
