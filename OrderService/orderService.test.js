const request = require('supertest');
const app = require('./serverOrder');

describe('Order Service Integration Tests', () => {
    describe('POST /orders', () => {
        it('should create an order and return 201 status', async () => {
            const res = await request(app)
                .post('/api/orders')
                .send({
                    userId: 1,
                    productId: 1,
                    quantity: 2
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('userId');
            expect(res.body).toHaveProperty('productId');
            expect(res.body).toHaveProperty('quantity');
        });
    });

    describe('GET /stories/:userId', () => {
        it('should retrieve order history for a user and return 200 status', async () => {
            const userId = 1;
            const res = await request(app)
                .get(`/api/stories/${userId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });
});
