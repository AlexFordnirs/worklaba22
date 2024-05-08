const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const productRoutes = require('./routes/productRoutes');
const  sequelize  = require('./config/connection');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use('/api', productRoutes);

async function connectRabbitMQ() {
    const rabbitUrl = 'amqp://localhost';
    try {
        const connection = await amqp.connect(rabbitUrl);
        const channel = await connection.createChannel();


        const exchangeName = 'product_updates';
        await channel.assertExchange(exchangeName, 'fanout', { durable: false });


        const publishProductUpdate = (productData) => {
            const messageBuffer = Buffer.from(JSON.stringify(productData));
            channel.publish(exchangeName, '', messageBuffer, { persistent: true });
            console.log("Published product update to RabbitMQ:", productData);
        };


        app.set('publishProductUpdate', publishProductUpdate);

    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
}


sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`CatalogWarehouseService is running on port ${port}`);
        connectRabbitMQ().then(() => {
            console.log("Connected to RabbitMQ successfully!");
        }).catch(err => {
            console.log("Failed to connect to RabbitMQ:", err);
        });
    });
});
module.exports = app;