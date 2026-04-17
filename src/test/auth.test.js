// testing de auth
const request = require('supertest');
const app = require('../index');

it('should return 200 when login', async () => {
    const res = await request(app).post('/auth/login');

    expect(res.statusCode).toBe(200);
});

it('should return 200 when register', async () => {
    const res = await request(app).post('/auth/register');

    expect(res.statusCode).toBe(200);
});

it('should return 200 when logout', async () => {
    const res = await request(app).post('/auth/logout');

    expect(res.statusCode).toBe(200);
});

it('should return 200 when refresh token', async () => {
    const res = await request(app).post('/auth/refresh-token');

    expect(res.statusCode).toBe(200);
});