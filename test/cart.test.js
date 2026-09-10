import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Cart endpoints', () => {
    let token;
    let cartItemId;
    before(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'test1237' });
        token = res.body.token;

        await request(app)
            .delete('/api/cart')
            .set('Authorization', `Bearer ${token}`);
    });
    it('adding to the cart', async () => {
        const res = await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ product_id: 1, quantity: 2 })
        cartItemId = res.body.item.id;
        expect(res.status).to.equal(201);
    });
    it('adding the same product increments', async () => {
        const res = await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ product_id: 1, quantity: 2 })
        expect(res.status).to.equal(200);
        expect(res.body.item.quantity).to.equal(4);
    });
    it('too much stock refused', async () => {
        const res = await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ product_id: 1, quantity: 9999 })
        expect(res.status).to.equal(400);
    });
    it('unknown products', async () => {
        const res = await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ product_id: 9999, quantity: 1 })
        expect(res.status).to.equal(404);
    });
    it('shows names and prices', async () => {
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.equal(200);
        expect(res.body.items[0].name).to.be.a('string');
        expect(res.body.items[0].price).to.be.a('string');
    });
    it('quantity can be changed', async () => {
        const res = await request(app)
            .put(`/api/cart/items/${cartItemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 3 })
        expect(res.status).to.equal(200);
    });
    it('deleting the item', async () => {
        const res = await request(app)
            .delete(`/api/cart/items/${cartItemId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.equal(200);
    })
    it('emptying whole cart', async () => {
        const res = await request(app)
            .delete('/api/cart')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.equal(200);
        const check = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);
        expect(check.body.items.length).to.equal(0);
        
    });
});





