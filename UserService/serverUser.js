const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const userRoutes = require('./routes/userRoutes');
const  sequelize  = require('./config/connection');

const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use('/api', userRoutes);
async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const orderExchange = 'order_updates';
        const productExchange = 'product_updates';

        await channel.assertExchange(orderExchange, 'fanout', { durable: false });
        await channel.assertExchange(productExchange, 'fanout', { durable: false });

        const orderQueue = await channel.assertQueue('', { exclusive: true });
        const productQueue = await channel.assertQueue('', { exclusive: true });

        await channel.bindQueue(orderQueue.queue, orderExchange, '');
        await channel.bindQueue(productQueue.queue, productExchange, '');

        channel.consume(orderQueue.queue, message => {
            if (message.content) {
                const update = JSON.parse(message.content.toString());
                console.log("Received order update:", update);

            }
        }, { noAck: true });

        channel.consume(productQueue.queue, message => {
            if (message.content) {
                const update = JSON.parse(message.content.toString());
                console.log("Received product update:", update);

            }
        }, { noAck: true });

    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`UserService is running on port ${port}`);
        connectRabbitMQ().then(() => {
            console.log("Connected to RabbitMQ successfully!");
        }).catch(err => {
            console.log("Failed to connect to RabbitMQ:", err);
        });
    });
});
module.exports = app;