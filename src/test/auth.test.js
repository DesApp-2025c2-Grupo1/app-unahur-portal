const request = require('supertest');
const app = require('../index');
const authRepository = require('../modules/auth/repositories/auth.repository');
const rolesRepository = require('../modules/auth/repositories/roles.repository');
const bcrypt = require('bcryptjs');

jest.mock('../modules/auth/repositories/auth.repository');
jest.mock('../modules/auth/repositories/roles.repository');

describe('Auth Module', () => {
    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    };

    const mockDbUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password_hash: '', // Will be set in tests
        role_id: 2
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
                id: 1
            });
            rolesRepository.findById.mockResolvedValue({ id: 2, name: 'AFILIADO' });

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

        it('should return 400 if data is missing', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ email: 'only-email@example.com' });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /auth/login', () => {
        it('should return 200 and a token for valid credentials', async () => {
            authRepository.findByEmail.mockResolvedValue(mockDbUser);
            rolesRepository.findById.mockResolvedValue({ id: 2, name: 'AFILIADO' });

            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
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

        it('should return 401 for invalid credentials (user not found)', async () => {
            authRepository.findByEmail.mockResolvedValue(null);

            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Invalid credentials');
        });
    });
});

