import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Admin Product Endpoints', () => {
    let adminToken;
    let userToken;
    let createdProductId;

    before(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testadmin@example.com', password: 'test1236' });
        adminToken = res.body.token;

        const userRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'test1237' });
        userToken = userRes.body.token;
    });

    it('creates a product as admin', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ category_id: 1, name: 'My Test Product', price: 49.90, quantity: 20 });
        expect(res.status).to.equal(201);
        createdProductId = res.body.product.id;
    });

    it('does not create a product as user', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ category_id: 1, name: 'User test product', price: 59.90, quantity: 10 });
        expect(res.status).to.equal(403);
    });

    it('does not create a product without authorization', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({ category_id: 1, name: 'Test test product', price: 39.90, quantity: 70 });
        expect(res.status).to.equal(401);
    });

    it('updates the product as admin', async () => {
        const res = await request(app)
            .put(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                category_id: 1,
                name: 'My Updated Test Product',
                price: 59.90,
                quantity: 15,
                description: 'Updated by test',
                image_url: 'https://example.com/test.jpg'
            });
        expect(res.status).to.equal(200);
    });

    it('deletes the product as admin', async () => {
        const res = await request(app)
            .delete(`/api/products/${createdProductId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).to.equal(200);
    });

    it('does not return a soft-deleted product', async () => {
        const res = await request(app)
            .get(`/api/products/${createdProductId}`);
        expect(res.status).to.equal(404);
    });
});

