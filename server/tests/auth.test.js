import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';

// ────────────────────────────────────────────────────────────────────────────
// Helper — register a user and return the supertest response
// ────────────────────────────────────────────────────────────────────────────
const registerUser = (payload) =>
    request(app).post('/api/users/register').send(payload);

// ────────────────────────────────────────────────────────────────────────────
// Lifecycle hooks
// ────────────────────────────────────────────────────────────────────────────
beforeAll(async () => {
    // Connect to the dedicated test database
    await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterEach(async () => {
    // Clear all users after each test so there's no shared state between tests
    await User.deleteMany({});
});

afterAll(async () => {
    // Close the database connection so Jest can exit cleanly
    await mongoose.connection.close();
});

// ────────────────────────────────────────────────────────────────────────────
// Auth Routes
// ────────────────────────────────────────────────────────────────────────────
describe('Auth Routes', () => {

    // ── POST /api/users/register ─────────────────────────────────────────────
    describe('POST /api/users/register', () => {

        test('should register a new user successfully', async () => {
            const res = await registerUser({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'Test User');
            expect(res.body).toHaveProperty('email', 'testuser@example.com');
            // Password must never be returned
            expect(res.body).not.toHaveProperty('password');
        });

        test('should fail to register with an existing email', async () => {
            // First registration — should succeed
            await registerUser({
                name: 'Existing User',
                email: 'existing@example.com',
                password: 'password123',
            });

            // Second registration with the same email — should fail
            const res = await registerUser({
                name: 'Another User',
                email: 'existing@example.com',
                password: 'differentpassword',
            });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('already exists');
        });

        test('should fail to register with missing required fields', async () => {
            const res = await registerUser({
                name: 'Incomplete User',
                // missing email and password
            });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

    });

    // ── POST /api/auth/login ─────────────────────────────────────────────────
    describe('POST /api/auth/login', () => {

        test('should log in with correct credentials', async () => {
            // Register first
            await registerUser({
                name: 'Login Test User',
                email: 'login@example.com',
                password: 'password123',
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', 'login@example.com');
        });

        test('should fail to log in with wrong password', async () => {
            // Register first
            await registerUser({
                name: 'Password Test User',
                email: 'wrongpass@example.com',
                password: 'correctpassword',
            });

            // Attempt login with wrong password
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrongpass@example.com',
                    password: 'wrongpassword',
                });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message');
        });

    });

});
