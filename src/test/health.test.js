const request = require('supertest');
const app = require('../index');

describe('Health', () => {
    it('should return 200', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
    });
});