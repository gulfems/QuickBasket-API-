import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

const email = `test${Date.now()}@example.com`;
const password = 'test1234';
const phone = '5551112233';

describe('POST /api/auth/register', () => {

    it('registers a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email, password, phone });

        expect(res.status).to.equal(201);
        expect(res.body.user.password_hash).to.equal(undefined);
    });
    it('rejects a duplicate email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email, password, phone });

        expect(res.status).to.equal(409);
    });
    it('missing fields on register', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email });
        expect(res.status).to.equal(400);
    });
});

describe('POST /api/auth/login', () => {
    it('logins as a user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email, password, phone });
        expect(res.body.token).to.be.a('string');
        expect(res.status).to.equal(200);
    });
    it('login rejected due to password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email, password: 'test1235', phone });
        expect(res.status).to.equal(401);
    });
    it('login rejected due to email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'email@example.com', password, phone });
        expect(res.status).to.equal(401);
    });
});

describe('GET /api/auth/me', () => {
    let token;
    let courierToken;
    before(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email, password });
        token = res.body.token;
        const courierRes = await request(app)
            .post('/api/courier/login')
            .send({ email: 'testcourier@example.com', password: 'test1235' });
        courierToken = courierRes.body.token;
    });

    it('shows user details', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).to.equal(200);
    });
    it('does not show user details', async () => {
        const res = await request(app)
            .get('/api/auth/me')
        expect(res.status).to.equal(401);
    });
    it('courier token does not work', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${courierToken}`)
        expect(res.status).to.equal(403)
    });
});
