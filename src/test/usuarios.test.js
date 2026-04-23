require('dotenv').config();
const request = require('supertest');
const app = require('../index');
const usuariosService = require('../modules/affiliates/services/usuarios.service');

jest.mock('../modules/affiliates/services/usuarios.service');

describe('Usuarios Endpoints', () => {
  const mockUser = {
    id_usuario: 1,
    email: 'test@example.com',
    nombre: 'Test',
    apellido: 'User',
    activo: true,
    fecha_creacion: new Date().toISOString(),
    roles: [{ id_rol: 1, nombre_rol: 'Afiliado' }]
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /affiliates/usuarios/:id_usuario', () => {
    it('should return 200 with user data when user exists', async () => {
      usuariosService.getUserById.mockResolvedValue(mockUser);
      const res = await request(app).get('/affiliates/usuarios/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it('should return 400 when id_usuario is not an integer', async () => {
      const res = await request(app).get('/affiliates/usuarios/invalid');
      expect(res.statusCode).toBe(400);
    });

    it('should return 404 when user does not exist', async () => {
      usuariosService.getUserById.mockResolvedValue(null);
      const res = await request(app).get('/affiliates/usuarios/99999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /affiliates/usuarios', () => {
    it('should return 200 with paginated users', async () => {
      usuariosService.getAllUsers.mockResolvedValue({
        usuarios: [mockUser],
        pagination: { page: 1, limit: 10, total: 1 }
      });
      const res = await request(app).get('/affiliates/usuarios');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('usuarios');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.usuarios)).toBe(true);
    });

    it('should return 400 when page is 0 or negative', async () => {
      const res = await request(app).get('/affiliates/usuarios?page=0');
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /affiliates/usuarios/:id_usuario/roles', () => {
    it('should return 201 when role is added successfully', async () => {
      usuariosService.addRoleToUser.mockResolvedValue({ id_usuario: 1, id_rol: 1 });
      const res = await request(app)
        .post('/affiliates/usuarios/1/roles')
        .send({ id_rol: 1 });
      expect(res.statusCode).toBe(201);
    });

    it('should return 400 when id_rol is missing', async () => {
      const res = await request(app)
        .post('/affiliates/usuarios/1/roles')
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /affiliates/usuarios/:id_usuario/estado', () => {
    it('should return 200 with updated user when user exists', async () => {
      const updatedUser = { ...mockUser, activo: false };
      usuariosService.toggleUserStatus.mockResolvedValue(updatedUser);
      const res = await request(app).put('/affiliates/usuarios/1/estado');
      expect(res.statusCode).toBe(200);
      expect(res.body.activo).toBe(false);
    });

    it('should return 404 when user does not exist', async () => {
      usuariosService.toggleUserStatus.mockRejectedValue(new Error('USER_NOT_FOUND'));
      const res = await request(app).put('/affiliates/usuarios/99999/estado');
      expect(res.statusCode).toBe(404);
    });
  });
});

