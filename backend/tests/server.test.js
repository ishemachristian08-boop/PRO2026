const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server')
const User = require('../models/User')

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key'
process.env.MONGODB_URI = 'mongodb://localhost:27017/nca_test'
process.env.NODE_ENV = 'test'

describe('API Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI)
  })

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({})
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'parent'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.username).toBe(userData.username)
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user.role).toBe(userData.role)
      expect(response.body.data.token).toBeDefined()
    })

    it('should not register user with existing email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'parent'
      }

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)

      // Try to create user with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...userData,
          username: 'differentuser'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Email already exists')
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser'
          // Missing email, password, and role
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'parent'
      })
      await user.save()
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe('test@example.com')
      expect(response.body.data.token).toBeDefined()
    })

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        })
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid credentials')
    })

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid credentials')
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
          // Missing password
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })
  })

  describe('GET /api/auth/me', () => {
    let token
    let userId

    beforeEach(async () => {
      // Create and login a test user
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'parent'
      })
      await user.save()
      userId = user._id

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
      
      token = loginResponse.body.data.token
    })

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe('test@example.com')
      expect(response.body.data.user._id).toBe(userId.toString())
    })

    it('should not get user without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('No token provided')
    })

    it('should not get user with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid token')
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('Logged out successfully')
    })
  })

  describe('Student Management', () => {
    let adminToken
    let parentToken

    beforeEach(async () => {
      // Create admin user
      const admin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      })
      await admin.save()

      const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123'
        })
      adminToken = adminLogin.body.data.token

      // Create parent user
      const parent = new User({
        username: 'parent',
        email: 'parent@example.com',
        password: 'password123',
        role: 'parent'
      })
      await parent.save()

      const parentLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'parent@example.com',
          password: 'password123'
        })
      parentToken = parentLogin.body.data.token
    })

    it('should create student with admin role', async () => {
      const studentData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2020-01-01',
        grade: 'Nursery',
        admissionNumber: 'NCA001',
        parent: 'parent@example.com'
      }

      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(studentData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.firstName).toBe(studentData.firstName)
      expect(response.body.data.lastName).toBe(studentData.lastName)
    })

    it('should not create student without authentication', async () => {
      const studentData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2020-01-01',
        grade: 'Nursery',
        admissionNumber: 'NCA001'
      }

      const response = await request(app)
        .post('/api/students')
        .send(studentData)
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it('should get all students with admin role', async () => {
      const response = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('Announcement Management', () => {
    let adminToken

    beforeEach(async () => {
      const admin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      })
      await admin.save()

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123'
        })
      adminToken = loginResponse.body.data.token
    })

    it('should create announcement with admin role', async () => {
      const announcementData = {
        title: 'School Holiday',
        content: 'School will be closed on Monday',
        category: 'General',
        audience: 'All'
      }

      const response = await request(app)
        .post('/api/announcements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(announcementData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe(announcementData.title)
      expect(response.body.data.content).toBe(announcementData.content)
    })

    it('should get all announcements', async () => {
      const response = await request(app)
        .get('/api/announcements')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('Event Management', () => {
    let adminToken

    beforeEach(async () => {
      const admin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      })
      await admin.save()

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123'
        })
      adminToken = loginResponse.body.data.token
    })

    it('should create event with admin role', async () => {
      const eventData = {
        title: 'Sports Day',
        description: 'Annual sports competition',
        eventType: 'Sports',
        startDate: new Date(),
        endDate: new Date(),
        location: 'School Ground',
        audience: 'All'
      }

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(eventData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe(eventData.title)
      expect(response.body.data.description).toBe(eventData.description)
    })

    it('should get all events', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('Gallery Management', () => {
    let adminToken

    beforeEach(async () => {
      const admin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      })
      await admin.save()

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123'
        })
      adminToken = loginResponse.body.data.token
    })

    it('should create gallery with admin role', async () => {
      const galleryData = {
        title: 'Sports Day Photos',
        description: 'Photos from annual sports day',
        category: 'Events',
        isPublic: true
      }

      const response = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(galleryData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.title).toBe(galleryData.title)
      expect(response.body.data.description).toBe(galleryData.description)
    })

    it('should get all galleries', async () => {
      const response = await request(app)
        .get('/api/gallery')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })
})