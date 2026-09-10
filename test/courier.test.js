import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Courier endpoints', () => {
    let userToken;
    let courierToken;
    let otherCourierToken;
    let orderId;

    before(async () => {
        const userRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'test1237' });
        userToken = userRes.body.token;
        
        const courierRes = await request(app)
            .post('/api/courier/login')
            .send({ email: 'testcourier@example.com', password: 'test1235' });
        courierToken = courierRes.body.token;

        const otherCourierRes = await request(app)
            .post('/api/courier/login')
            .send({ email: 'courier2@example.com', password: 'test1234' });
        otherCourierToken = otherCourierRes.body.token;

        await request(app)
            .delete('/api/cart')
            .set('Authorization', `Bearer ${userToken}`);
        
        const addrRes = await request(app)
            .post('/api/addresses')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: `Courier Test ${Date.now()}`, address_text: 'Test Sokak No 2, Bakirkoy, Istanbul' });
        await request(app)
            .post('/api/cart/items')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ product_id: 1, quantity: 2 });

        const orderRes = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ address_id: addrRes.body.address.id });
        
        orderId = orderRes.body.order.id;
    });
    it('monitoring available orders as courier', async () => {
        const res = await request(app)
            .get('/api/orders/available')
            .set('Authorization', `Bearer ${courierToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.orders.length).to.be.above(0);
    });
    it('monitoring available orders as user', async () => {
        const res = await request(app)
            .get('/api/orders/available')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.status).to.equal(403);
    });
    it('claiming order as courier', async () => {
        const res = await request(app)
            .put(`/api/orders/${orderId}/claim`)
            .set('Authorization', `Bearer ${courierToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.order.status).to.equal('on_the_way');
    });
    it('trying to reclaim order as the same courier', async () => {
        const res = await request(app)
            .put(`/api/orders/${orderId}/claim`)
            .set('Authorization', `Bearer ${courierToken}`);
        expect(res.status).to.equal(409);
    });
    it('wrong courier deliver', async () => {
        const res = await request(app)
            .put(`/api/orders/${orderId}/deliver`)
            .set('Authorization', `Bearer ${otherCourierToken}`);
        expect(res.status).to.equal(403);
    });
    it('delivery by the assigned courier', async () => {
        const res = await request(app)
            .put(`/api/orders/${orderId}/deliver`)
            .set('Authorization', `Bearer ${courierToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.order.status).to.equal('delivered');
    });
});