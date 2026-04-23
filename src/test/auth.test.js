const request = require('supertest');
const app = require('../index');
const authRepository = require('../modules/auth/repositories/auth.repository');
const bcrypt = require('bcryptjs');

jest.mock('../modules/auth/repositories/auth.repository');

describe('Auth Module', () => {
    const testUser = {
        name: 'Test Admin',
        email: 'admin@example.com',
        password: 'password123'
    };

    const mockDbUser = {
        id_usuario: 1,
        name: 'Test Admin',
        email: 'admin@example.com',
        password_hash: '', // Will be set in tests
        roles: ['ADMIN']
    };

    beforeAll(async () => {
        const salt = await bcrypt.genSalt(10);
        mockDbUser.password_hash = await bcrypt.hash(testUser.password, salt);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/register', () => {
        it('should register a new user successfully', async () => {
            authRepository.findByEmail.mockResolvedValue(null);
            authRepository.createUser.mockResolvedValue({
                ...mockDbUser,
                id_usuario: 1
            });

            const res = await request(app)
                .post('/auth/register')
                .send(testUser);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.message).toBe('User registered successfully');
        });

        it('should return 400 if user already exists', async () => {
            authRepository.findByEmail.mockResolvedValue(mockDbUser);

            const res = await request(app)
                .post('/auth/register')
                .send(testUser);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('User already exists');
        });
    });

    describe('POST /auth/login', () => {
        it('should return 200 and a token for valid ADMIN credentials', async () => {
            authRepository.findByEmail.mockResolvedValue(mockDbUser);

            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 403 if user does not have ADMIN role', async () => {
            authRepository.findByEmail.mockResolvedValue({
                ...mockDbUser,
                roles: ['AFILIADO']
            });

            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toContain('Admin role required');
        });

        it('should return 401 for invalid credentials (wrong password)', async () => {
            authRepository.findByEmail.mockResolvedValue(mockDbUser);

            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Invalid credentials');
        });
    });
});


