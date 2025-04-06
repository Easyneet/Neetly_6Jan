const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Question = require('../models/Question');
const { setupTestDatabase, teardownTestDatabase } = require('../scripts/test-setup');

describe('API Endpoints', () => {
  let token;
  let adminToken;

  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase();

    // Create test admin user
    const adminUser = await User.create({
      username: 'testadmin',
      email: 'testadmin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create test regular user
    const user = await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'user123',
      role: 'user'
    });

    // Get tokens
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@example.com', password: 'admin123' });
    adminToken = adminLogin.body.token;

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'user123' });
    token = userLogin.body.token;
  });

  afterAll(async () => {
    // Clean up test database
    await teardownTestDatabase();
  });

  describe('Authentication', () => {
    test('POST /api/auth/register - should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    test('POST /api/auth/login - should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    test('POST /api/auth/login - should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newuser@example.com',
          password: 'wrongpassword'
        });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('Subjects', () => {
    test('GET /api/subjects - should get all subjects', async () => {
      const res = await request(app)
        .get('/api/subjects')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('POST /api/subjects - should create new subject (admin only)', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Subject',
          description: 'Test Description'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Subject');
    });

    test('POST /api/subjects - should fail without admin token', async () => {
      const res = await request(app)
        .post('/api/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Subject',
          description: 'Test Description'
        });
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message', 'Access denied. Admin privileges required.');
    });
  });

  describe('Chapters', () => {
    let subjectId;

    beforeAll(async () => {
      const subject = await Subject.create({
        name: 'Test Subject for Chapters',
        description: 'Test Description'
      });
      subjectId = subject._id;
    });

    test('GET /api/chapters - should get all chapters', async () => {
      const res = await request(app)
        .get('/api/chapters')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('POST /api/chapters - should create new chapter (admin only)', async () => {
      const res = await request(app)
        .post('/api/chapters')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Chapter',
          subject: subjectId,
          description: 'Test Description'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Chapter');
    });

    test('GET /api/chapters/:subjectId - should get chapters by subject', async () => {
      const res = await request(app)
        .get(`/api/chapters/${subjectId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('Questions', () => {
    let chapterId;

    beforeAll(async () => {
      const subject = await Subject.create({
        name: 'Test Subject for Questions',
        description: 'Test Description'
      });
      const chapter = await Chapter.create({
        name: 'Test Chapter for Questions',
        subject: subject._id,
        description: 'Test Description'
      });
      chapterId = chapter._id;
    });

    test('GET /api/questions - should get all questions', async () => {
      const res = await request(app)
        .get('/api/questions')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('POST /api/questions - should create new question (admin only)', async () => {
      const res = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          chapter: chapterId,
          question: 'Test Question?',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 0,
          explanation: 'Test Explanation'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('question', 'Test Question?');
    });

    test('GET /api/questions/:chapterId - should get questions by chapter', async () => {
      const res = await request(app)
        .get(`/api/questions/${chapterId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('Admin', () => {
    test('GET /api/admin/stats - should get system statistics (admin only)', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('subjects');
      expect(res.body).toHaveProperty('chapters');
      expect(res.body).toHaveProperty('questions');
    });

    test('GET /api/admin/stats - should fail without admin token', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message', 'Access denied. Admin privileges required.');
    });
  });
}); 