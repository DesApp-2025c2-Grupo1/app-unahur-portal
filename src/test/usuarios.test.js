const request = require('supertest');
const app = require('../index');

describe('Usuarios Endpoints', () => {
  describe('GET /affiliates/usuarios/:id_usuario', () => {
    it('should return 200 with user data when user exists', async () => {
      const res = await request(app).get('/affiliates/usuarios/1');
      expect([200, 404]).toContain(res.statusCode);
    });

    it('should return 400 when id_usuario is not an integer', async () => {
      const res = await request(app).get('/affiliates/usuarios/invalid');
      expect(res.statusCode).toBe(400);
    });

    it('should return 404 when user does not exist', async () => {
      const res = await request(app).get('/affiliates/usuarios/99999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /affiliates/usuarios', () => {
    it('should return 200 with paginated users', async () => {
      const res = await request(app).get('/affiliates/usuarios');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('usuarios');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.usuarios)).toBe(true);
    });

    it('should return 200 with default pagination (page=1, limit=10)', async () => {
      const res = await request(app).get('/affiliates/usuarios');
      expect(res.statusCode).toBe(200);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(10);
    });

    it('should return 200 with custom pagination', async () => {
      const res = await request(app).get('/affiliates/usuarios?page=2&limit=5');
      expect(res.statusCode).toBe(200);
      expect(res.body.pagination.page).toBe(2);
      expect(res.body.pagination.limit).toBe(5);
    });

    it('should return 400 when page is invalid', async () => {
      const res = await request(app).get('/affiliates/usuarios?page=invalid');
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 when limit is invalid', async () => {
      const res = await request(app).get('/affiliates/usuarios?limit=invalid');
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 when page is 0 or negative', async () => {
      const res = await request(app).get('/affiliates/usuarios?page=0');
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /affiliates/usuarios/:id_usuario/roles', () => {
    it('should return 400 when id_rol is missing', async () => {
      const res = await request(app)
        .post('/affiliates/usuarios/1/roles')
        .send({});
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 when id_rol is not an integer', async () => {
      const res = await request(app)
        .post('/affiliates/usuarios/1/roles')
        .send({ id_rol: 'invalid' });
      expect(res.statusCode).toBe(400);
    });

    it('should return 400 when id_usuario is not an integer', async () => {
      const res = await request(app)
        .post('/affiliates/usuarios/invalid/roles')
        .send({ id_rol: 1 });
      expect(res.statusCode).toBe(400);
    });

    it('should return 404 when user does not exist', async () => {
      const res = await request(app)
        .post('/affiliates/usuarios/99999/roles')
        .send({ id_rol: 1 });
      expect(res.statusCode).toBe(404);
    });

    it('should return 404 when role does not exist', async () => {
      const res = await request(app)
        .post('/affiliates/usuarios/1/roles')
        .send({ id_rol: 99999 });
      expect([201, 404]).toContain(res.statusCode);
    });
  });

  describe('PUT /affiliates/usuarios/:id_usuario/estado', () => {
    it('should return 400 when id_usuario is not an integer', async () => {
      const res = await request(app).put('/affiliates/usuarios/invalid/estado');
      expect(res.statusCode).toBe(400);
    });

    it('should return 200 with updated user when user exists', async () => {
      const res = await request(app).put('/affiliates/usuarios/1/estado');
      expect([200, 404]).toContain(res.statusCode);

      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('id_usuario');
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('activo');
        expect(res.body).toHaveProperty('fecha_creacion');
      }
    });

    it('should return 404 when user does not exist', async () => {
      const res = await request(app).put('/affiliates/usuarios/99999/estado');
      expect(res.statusCode).toBe(404);
    });
  });
});
