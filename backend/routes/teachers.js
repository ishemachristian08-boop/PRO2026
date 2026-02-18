const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

const User = require('../models/User')
const auth = require('../middleware/auth')

// @route   GET api/teachers
// @desc    Get all teachers
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Only admins can view all teachers
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      })
    }

    const teachers = await User.find({ role: 'teacher' })
      .select('-password')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: teachers,
      count: teachers.length
    })
  } catch (error) {
    console.error('Error fetching teachers:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching teachers'
    })
  }
})

// @route   GET api/teachers/:id
// @desc    Get teacher by ID
// @access  Private (Admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    // Only admins can view teacher details
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      })
    }

    const teacher = await User.findById(req.params.id).select('-password')

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      })
    }

    if (teacher.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'User is not a teacher'
      })
    }

    res.json({
      success: true,
      data: teacher
    })
  } catch (error) {
    console.error('Error fetching teacher:', error)
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching teacher'
    })
  }
})

// @route   POST api/teachers
// @desc    Create new teacher
// @access  Private (Admin only)
router.post('/', [
  auth,
  [
    body('username', 'Username is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('firstName', 'First name is required').not().isEmpty(),
    body('lastName', 'Last name is required').not().isEmpty(),
    body('phone', 'Phone number is required').not().isEmpty(),
    body('department', 'Department is required').not().isEmpty()
  ]
], async (req, res) => {
  try {
    // Only admins can create teachers
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      })
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { username, email, password, firstName, lastName, phone, department } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Check if username already exists
    user = await User.findOne({ username })
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      })
    }

    // Create new teacher user
    user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      department,
      role: 'teacher',
      isActive: true
    })

    // Hash password
    const salt = await bcrypt.genSalt(12)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
      (err, token) => {
        if (err) throw err
        res.status(201).json({
          success: true,
          message: 'Teacher created successfully',
          data: {
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              department: user.department,
              role: user.role,
              isActive: user.isActive,
              createdAt: user.createdAt
            },
            token
          }
        })
      }
    )
  } catch (error) {
    console.error('Error creating teacher:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while creating teacher'
    })
  }
})

// @route   PUT api/teachers/:id
// @desc    Update teacher
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Only admins can update teachers
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      })
    }

    const { firstName, lastName, phone, department, isActive } = req.body

    // Build update object
    const updateFields = {}
    if (firstName) updateFields.firstName = firstName
    if (lastName) updateFields.lastName = lastName
    if (phone) updateFields.phone = phone
    if (department) updateFields.department = department
    if (typeof isActive === 'boolean') updateFields.isActive = isActive

    let teacher = await User.findById(req.params.id)

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      })
    }

    if (teacher.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'User is not a teacher'
      })
    }

    teacher = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password')

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    })
  } catch (error) {
    console.error('Error updating teacher:', error)
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating teacher'
    })
  }
})

// @route   DELETE api/teachers/:id
// @desc    Delete teacher
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Only admins can delete teachers
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      })
    }

    const teacher = await User.findById(req.params.id)

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      })
    }

    if (teacher.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'User is not a teacher'
      })
    }

    // Check if teacher has assigned students (you might want to add this logic)
    // For now, we'll allow deletion

    await User.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting teacher:', error)
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting teacher'
    })
  }
})

// @route   GET api/teachers/:id/students
// @desc    Get students assigned to a teacher
// @access  Private (Admin and Teacher)
router.get('/:id/students', auth, async (req, res) => {
  try {
    const teacherId = req.params.id
    const currentUserId = req.user.id
    const currentUserRole = req.user.role

    // Only admins and the teacher themselves can view assigned students
    if (currentUserRole !== 'admin' && currentUserRole !== 'teacher') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin or teacher privileges required.' 
      })
    }

    // If it's a teacher, they can only view their own students
    if (currentUserRole === 'teacher' && teacherId !== currentUserId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Teachers can only view their own students.' 
      })
    }

    const teacher = await User.findById(teacherId)
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      })
    }

    // Get students assigned to this teacher
    // Note: You might want to add a 'teacher' field to the Student model
    // For now, we'll return all students (you can modify this based on your requirements)
    const students = await User.find({ role: 'parent' })
      .populate({
        path: 'students',
        model: 'Student',
        options: { sort: { createdAt: -1 } }
      })

    // Flatten the students array
    const allStudents = []
    students.forEach(parent => {
      if (parent.students && parent.students.length > 0) {
        allStudents.push(...parent.students)
      }
    })

    res.json({
      success: true,
      data: allStudents,
      count: allStudents.length
    })
  } catch (error) {
    console.error('Error fetching teacher students:', error)
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid teacher ID'
      })
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching teacher students'
    })
  }
})

// @route   PUT api/teachers/:id/activate
// @desc    Activate teacher account
// @access  Private (Admin only)
router.put('/:id/activate', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      })
    }

    const teacher = await User.findById(req.params.id)
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      })
    }

    if (teacher.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'User is not a teacher'
      })
    }

    teacher.isActive = true
    await teacher.save()

    res.json({
      success: true,
      message: 'Teacher account activated successfully',
      data: teacher
    })
  } catch (error) {
    console.error('Error activating teacher:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while activating teacher'
    })
  }
})

// @route   PUT api/teachers/:id/deactivate
// @desc    Deactivate teacher account
// @access  Private (Admin only)
router.put('/:id/deactivate', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      })
    }

    const teacher = await User.findById(req.params.id)
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      })
    }

    if (teacher.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'User is not a teacher'
      })
    }

    teacher.isActive = false
    await teacher.save()

    res.json({
      success: true,
      message: 'Teacher account deactivated successfully',
      data: teacher
    })
  } catch (error) {
    console.error('Error deactivating teacher:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deactivating teacher'
    })
  }
})

module.exports = router