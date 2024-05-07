const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');

router.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/users/:id/orders', async (req, res) => {
    const userId = req.params.id;
    try {
        const productResponse= await axios.get(`http://localhost:3000/api/stories/${userId}`);
        res.status(201).json(productResponse.data);
    } catch (error) {
        res.status(500).json({ message: "Error processing order u", error: error.toString() });
    }
});
module.exports = router;
