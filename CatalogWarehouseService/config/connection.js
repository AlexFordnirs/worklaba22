
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('catalog_db', 'postgres', 'PASSWORD', {
    host: 'localhost',
    dialect: 'postgres',
    port: '5432',
    logging: console.log
});

module.exports = sequelize;


/*const sequelize = new Sequelize('postgres://postgres:PASSWORD@localhost:5432/catalog_db');

module.exports = sequelize;
*/