const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Оновлення кількості товару на складі
router.put('/products/:id', async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (product) {
            product.quantity = quantity;
            await product.save();
            res.send(product);
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/products/category/:categoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const products = await Product.findAll({
            where: { category: categoryName } // Переконайтеся, що в моделі є поле category
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving products by category", error: error.toString() });
    }
});


router.get('/products/check/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const isAvailable = product.quantity > 0;
        res.json({ available: isAvailable, quantity: product.quantity });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


router.put('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const decrement = req.body.quantity;
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.quantity < decrement) {
            return res.status(400).json({ message: "Insufficient quantity in stock" });
        }
        product.quantity = product.quantity-decrement;
        await product.save();
        res.json({ message: "Product quantity updated", product });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});
module.exports = router;
