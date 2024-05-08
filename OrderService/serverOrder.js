const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const documentRoutes = require('./routes/orderRoutes');
const  sequelize  = require('./config/connection');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerOptions');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api', documentRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
async function connectRabbitMQ() {
    const rabbitUrl = 'amqp://localhost';
    try {
        const connection = await amqp.connect(rabbitUrl);
        const channel = await connection.createChannel();

        const exchangeName = 'order_updates';
        await channel.assertExchange(exchangeName, 'fanout', { durable: false });

        const publishOrderUpdate = (orderData) => {
            const messageBuffer = Buffer.from(JSON.stringify(orderData));
            channel.publish(exchangeName, '', messageBuffer, { persistent: true });
            console.log("Published order update to RabbitMQ:", orderData);
        };

        app.set('publishOrderUpdate', publishOrderUpdate);

    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`OrderService is running on port ${port}`);
        connectRabbitMQ().then(() => {
            console.log("Connected to RabbitMQ successfully!");
        }).catch(err => {
            console.log("Failed to connect to RabbitMQ:", err);
        });
    });
});
module.exports = app;