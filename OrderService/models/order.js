const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Order = sequelize.define('Order', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

module.exports = Order;
