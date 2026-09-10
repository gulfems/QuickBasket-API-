import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('GET /api/products', () => {
    it('returns 200 and a list of products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).to.equal(200);
        expect(res.body.products).to.be.an('array');
    });

});

describe('GET /api/products/:id', () => {
    it('returns 200 with a product', async () => {
        const res = await request(app).get('/api/products/1');
        expect(res.status).to.equal(200);
        expect(res.body.product.id).to.equal(1);
    });
    it('returns 404 without a product', async () => {
        const res = await request(app).get('/api/products/9999');
        expect(res.status).to.equal(404);
    });
});


