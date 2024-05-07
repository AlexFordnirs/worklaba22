const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Order Service API',
            version: '1.0.0',
            description: 'API for managing orders',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    apis: ['./routes/orderRoutes.js'],
};

const specs = swaggerJsDoc(options);

module.exports = specs;
