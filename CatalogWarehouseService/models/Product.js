const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
},

    {
    timestamps: true
});

module.exports = Product;
