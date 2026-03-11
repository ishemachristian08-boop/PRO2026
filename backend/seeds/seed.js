const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Import models
const User = require('../models/User')
const Student = require('../models/Student')
const Announcement = require('../models/Announcement')
const Event = require('../models/Event')
const Gallery = require('../models/Gallery')

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key'
process.env.MONGODB_URI = 'mongodb://localhost:27017/nca'

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to database')

    // Clear existing data
    console.log('Clearing existing data...')
    await User.deleteMany({})
    await Student.deleteMany({})
    await Announcement.deleteMany({})
    await Event.deleteMany({})
    await Gallery.deleteMany({})

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash('01Jan08!', saltRounds)

    // Create users
    console.log('Creating users...')
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@nca.rw',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    })
    await adminUser.save()

    const teacherUser = new User({
      username: 'teacher',
      email: 'teacher@nca.rw',
      password: hashedPassword,
      role: 'teacher',
      isActive: true,
      profile: {
        firstName: 'John',
        lastName: 'Teacher'
      }
    })
    await teacherUser.save()

    const parentUser = new User({
      username: 'parent',
      email: 'parent@nca.rw',
      password: hashedPassword,
      role: 'parent',
      isActive: true,
      profile: {
        firstName: 'Jane',
        lastName: 'Parent'
      }
    })
    await parentUser.save()

    console.log('Users created successfully')

    // Create students
    console.log('Creating students...')
    
    const student1 = new Student({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('2020-03-15'),
      gender: 'Male',
      grade: 'Nursery',
      admissionNumber: 'NCA001',
      parent: parentUser._id,
      isActive: true,
      academicRecords: [
        {
          term: 'Term 1',
          year: 2024,
          subjects: [
            { subject: 'Mathematics', grade: 'A', remarks: 'Excellent progress' },
            { subject: 'English', grade: 'B+', remarks: 'Good improvement needed' },
            { subject: 'Science', grade: 'A-', remarks: 'Very good' }
          ],
          overallGrade: 'A-',
          teacherRemarks: 'John is a bright student who shows great enthusiasm in class.'
        }
      ],
      attendanceRecords: [
        { date: new Date('2024-01-15'), status: 'Present' },
        { date: new Date('2024-01-16'), status: 'Present' },
        { date: new Date('2024-01-17'), status: 'Absent', reason: 'Sick' },
        { date: new Date('2024-01-18'), status: 'Present' }
      ]
    })
    await student1.save()

    const student2 = new Student({
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('2019-08-22'),
      gender: 'Female',
      grade: 'P1',
      admissionNumber: 'NCA002',
      parent: parentUser._id,
      isActive: true,
      academicRecords: [
        {
          term: 'Term 1',
          year: 2024,
          subjects: [
            { subject: 'Mathematics', grade: 'A', remarks: 'Outstanding performance' },
            { subject: 'English', grade: 'A', remarks: 'Excellent reading skills' },
            { subject: 'Kiswahili', grade: 'B+', remarks: 'Good progress' },
            { subject: 'Science', grade: 'A-', remarks: 'Very good understanding' }
          ],
          overallGrade: 'A',
          teacherRemarks: 'Jane is a diligent student with excellent academic performance.'
        }
      ],
      attendanceRecords: [
        { date: new Date('2024-01-15'), status: 'Present' },
        { date: new Date('2024-01-16'), status: 'Present' },
        { date: new Date('2024-01-17'), status: 'Present' },
        { date: new Date('2024-01-18'), status: 'Present' }
      ]
    })
    await student2.save()

    console.log('Students created successfully')

    // Create announcements
    console.log('Creating announcements...')
    
    const announcement1 = new Announcement({
      title: 'School Holiday Notice',
      content: 'The school will be closed on Monday, 15th January 2024, due to a public holiday. Classes will resume on Tuesday, 16th January 2024.',
      category: 'General',
      audience: 'All',
      author: adminUser._id,
      isPublished: true,
      publishedAt: new Date()
    })
    await announcement1.save()

    const announcement2 = new Announcement({
      title: 'Parent-Teacher Meeting',
      content: 'A parent-teacher meeting has been scheduled for Friday, 20th January 2024 at 3:00 PM in the school auditorium. All parents are requested to attend.',
      category: 'Events',
      audience: 'Parents',
      author: teacherUser._id,
      isPublished: true,
      publishedAt: new Date()
    })
    await announcement2.save()

    const announcement3 = new Announcement({
      title: 'New School Uniform',
      content: 'The school has introduced a new uniform policy effective from the next term. Please check the school notice board for details.',
      category: 'Important',
      audience: 'All',
      author: adminUser._id,
      isPublished: false
    })
    await announcement3.save()

    console.log('Announcements created successfully')

    // Create events
    console.log('Creating events...')
    
    const event1 = new Event({
      title: 'Sports Day',
      description: 'Annual sports competition for all students. Parents are invited to attend and support their children.',
      eventType: 'Sports',
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-15'),
      location: 'School Ground',
      audience: 'All',
      organizer: adminUser._id,
      isPublished: true,
      publishedAt: new Date(),
      isCancelled: false,
      registeredStudents: [student1._id, student2._id]
    })
    await event1.save()

    const event2 = new Event({
      title: 'Science Fair',
      description: 'Students will showcase their science projects and experiments. Judging will take place in the afternoon.',
      eventType: 'Academic',
      startDate: new Date('2024-03-20'),
      endDate: new Date('2024-03-20'),
      location: 'Science Lab',
      audience: 'Students',
      organizer: teacherUser._id,
      isPublished: true,
      publishedAt: new Date(),
      isCancelled: false
    })
    await event2.save()

    const event3 = new Event({
      title: 'Christmas Celebration',
      description: 'End-of-year celebration with performances by students and a special Christmas meal.',
      eventType: 'Cultural',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2024-12-20'),
      location: 'School Auditorium',
      audience: 'All',
      organizer: adminUser._id,
      isPublished: false,
      isCancelled: false
    })
    await event3.save()

    console.log('Events created successfully')

    // Create galleries
    console.log('Creating galleries...')
    
    const gallery1 = new Gallery({
      title: 'Sports Day 2023',
      description: 'Photos from our annual sports day celebration.',
      category: 'Events',
      author: adminUser._id,
      isPublic: true,
      isFeatured: true,
      images: [
        {
          filename: 'sports-day-1.jpg',
          url: 'https://example.com/images/sports-day-1.jpg',
          caption: 'Opening ceremony',
          uploadedAt: new Date()
        },
        {
          filename: 'sports-day-2.jpg',
          url: 'https://example.com/images/sports-day-2.jpg',
          caption: 'Relay race',
          uploadedAt: new Date()
        },
        {
          filename: 'sports-day-3.jpg',
          url: 'https://example.com/images/sports-day-3.jpg',
          caption: 'Award ceremony',
          uploadedAt: new Date()
        }
      ]
    })
    await gallery1.save()

    const gallery2 = new Gallery({
      title: 'Classroom Activities',
      description: 'Photos showing students engaged in various classroom activities.',
      category: 'Academic',
      author: teacherUser._id,
      isPublic: true,
      isFeatured: false,
      images: [
        {
          filename: 'classroom-1.jpg',
          url: 'https://example.com/images/classroom-1.jpg',
          caption: 'Math lesson',
          uploadedAt: new Date()
        },
        {
          filename: 'classroom-2.jpg',
          url: 'https://example.com/images/classroom-2.jpg',
          caption: 'Science experiment',
          uploadedAt: new Date()
        }
      ]
    })
    await gallery2.save()

    const gallery3 = new Gallery({
      title: 'Christmas Party 2023',
      description: 'Photos from our Christmas party celebration.',
      category: 'Events',
      author: adminUser._id,
      isPublic: false,
      isFeatured: false,
      images: [
        {
          filename: 'christmas-1.jpg',
          url: 'https://example.com/images/christmas-1.jpg',
          caption: 'Christmas tree decoration',
          uploadedAt: new Date()
        }
      ]
    })
    await gallery3.save()

    console.log('Galleries created successfully')

    console.log('\n✅ Database seeding completed successfully!')
    console.log('\nSample data created:')
    console.log('- Admin User: admin@nca.rw / password123')
    console.log('- Teacher User: teacher@nca.rw / password123')
    console.log('- Parent User: parent@nca.rw / password123')
    console.log('- 2 Students with academic and attendance records')
    console.log('- 3 Announcements (2 published, 1 draft)')
    console.log('- 3 Events (2 published, 1 draft)')
    console.log('- 3 Galleries (2 public, 1 private)')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Database connection closed')
    process.exit(0)
  }
}

// Run the seeding script
seedDatabase()