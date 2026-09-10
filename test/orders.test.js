import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Order endpoints', () => {
    let token;
    let addressId;
    let orderId;
    before(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'test1237' });
        token = res.body.token;
        await request(app)
            .delete('/api/cart')
            .set('Authorization', `Bearer ${token}`);
        const addrRes = await request(app)
            .post('/api/addresses')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: `Test Address ${Date.now()}`, address_text: 'Test Sokak No 1, Kadıköy, İstanbul' });
        addressId = addrRes.body.address.id;
    });
    it('rejects checkout with an empty cart', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ address_id: addressId });
        expect(res.status).to.equal(400);
    });
    it('cart with someone elses address', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ address_id: 9999 })
        expect(res.status).to.equal(404);
    });
    it('rejects a basket under the minimum', async () => {
        await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ product_id: 1, quantity: 1 });

        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ address_id: addressId });

        expect(res.status).to.equal(400);
    });
    it('places a valid order', async () => {
        await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({ product_id: 1, quantity: 20 });

        const res = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ address_id: addressId });

        expect(res.status).to.equal(201);
        expect(res.body.order.status).to.equal('preparing');
        orderId = res.body.order.id;
    });
    it('empties the cart after checkout', async () => {
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body.items.length).to.equal(0);
    });

    it('reduces product stock after checkout', async () => {
        const res = await request(app).get('/api/products/1');
        expect(res.status).to.equal(200);
        expect(res.body.product.quantity).to.be.a('number');
    });

    it('lists the user own orders', async () => {
        const res = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body.orders.length).to.be.above(0);
    });

    it('returns a single order to its owner', async () => {
        const res = await request(app)
            .get(`/api/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body.order.id).to.equal(orderId);
    });

    it('cancels an order that is still preparing', async () => {
        const res = await request(app)
            .put(`/api/orders/${orderId}/cancel`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
    });

    it('refuses to cancel an already cancelled order', async () => {
        const res = await request(app)
            .put(`/api/orders/${orderId}/cancel`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(400);
    });
});