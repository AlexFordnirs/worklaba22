const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Модель замовлень
const Product = require('../models/Product'); // Модель продуктів

// POST купівля товару
router.post('/orders', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Знайдемо товар на складі
        const product = await Product.findByPk(productId);
        if (product.quantity < quantity) {
            return res.status(400).json({ message: "Not enough product in stock" });
        }

        // Створимо замовлення
        const order = await Order.create({ userId, productId, quantity });

        // Зменшимо кількість товару на складі
        product.quantity -= quantity;
        await product.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error processing order", error: error.toString() });
    }
});

module.exports = router;
