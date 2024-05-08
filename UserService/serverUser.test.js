const request = require('supertest');
const app = require('./serverUser'); // Імпортуйте екземпляр вашого Express-додатку

describe('User Service Integration Tests', () => {
    describe('POST /users', () => {
        it('should create a user and return 201 status', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({
                    name: 'John Doe',
                    email: 'john.doe@example.com'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('email', 'john.doe@example.com');
        });
    });

    describe('GET /users/:userId/orders', () => {
        it('should retrieve order history for a user and return 200 status', async () => {
            const userId = 1; // Ensure this user exists for test
            const res = await request(app)
                .get(`/api/users/${userId}/orders`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });
});
