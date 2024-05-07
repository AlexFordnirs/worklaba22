const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const amqp = require('amqplib');
const Product = require('../models/Product'); // Модель продуктів

async function publishOrder(data) {
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();
    const result = await channel.assertQueue('orders');
    channel.sendToQueue('orders', Buffer.from(JSON.stringify(data)));
}

const axios = require('axios');
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create an order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *             properties:
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Error in creating order
 *       500:
 *         description: Server error
 *
 * /api/stories/{userId}:
 *   get:
 *     summary: Get order history for a user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: Successfully retrieved order history
 *       500:
 *         description: Server error
 */
router.post('/orders', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const productResponse = await axios.get(`http://localhost:3001/api/products/check/${productId}`);
        if (!productResponse.data.available) {
            return res.status(400).json({ message: "Product is not available or insufficient quantity" });
        }

        // Зменшення кількості товару
        await axios.put(`http://localhost:3001/api/products/${productId}`, { quantity });

        const order = await Order.create({ userId, productId, quantity });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error processing order", error: error.toString() });
    }
});

router.get('/stories/:userId', async (req, res) => {
    const  userId = req.params.userId;

    try {
        const orders = await Order.findAll({
            where: {userId: userId}
        });
        res.send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
