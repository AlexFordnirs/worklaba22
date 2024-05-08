const request = require('supertest');
const app = require('./serverCatalog');

describe('Catalog Warehouse Service Integration Tests', () => {
    describe('POST /products', () => {
        it('should create a product and return 201 status', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({
                    name: 'New Product',
                    description: 'Detailed description here',
                    quantity: 100,
                    category: 'Electronics'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('name', 'New Product');
            expect(res.body).toHaveProperty('category', 'Electronics');
        });
    });

    describe('GET /products/category/:category', () => {
        it('should retrieve products by category and return 200 status', async () => {
            const category = 'Electronics';
            const res = await request(app)
                .get(`/api/products/category/${category}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });
});
