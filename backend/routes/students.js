const express = require('express');
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { validateStudent } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/students/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDF, and Word documents are allowed.'));
    }
  }
});

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Teacher
router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { page = 1, limit = 10, grade, search } = req.query;
    
    let query = {};
    
    if (grade) {
      query.grade = grade;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('parent', 'username email profile')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      success: true,
      data: students,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalStudents: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students'
    });
  }
});

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private/Admin/Teacher/Parent
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('parent', 'username email profile');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if user has access (admin, teacher, or parent of the student)
    if (req.user.role !== 'admin' && req.user.role !== 'teacher' && student.parent.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this student'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student'
    });
  }
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
router.post('/', protect, authorize('admin'), validateStudent, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      grade,
      class: studentClass,
      parent,
      contactInfo,
      medicalInfo
    } = req.body;

    // Check if parent exists
    const parentUser = await User.findById(parent);
    if (!parentUser || parentUser.role !== 'parent') {
      return res.status(400).json({
        success: false,
        message: 'Invalid parent user'
      });
    }

    // Generate admission number
    const admissionNumber = Student.generateAdmissionNumber(grade);

    // Create new student
    const student = new Student({
      admissionNumber,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      grade,
      class: studentClass,
      parent,
      contactInfo,
      medicalInfo
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: {
        ...student._doc,
        parent: {
          id: parentUser._id,
          username: parentUser.username,
          email: parentUser.email,
          profile: parentUser.profile
        }
      }
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating student'
    });
  }
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), validateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if parent exists (if being updated)
    if (req.body.parent) {
      const parentUser = await User.findById(req.body.parent);
      if (!parentUser || parentUser.role !== 'parent') {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent user'
        });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('parent', 'username email profile');

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating student'
    });
  }
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting student'
    });
  }
});

// @desc    Get students by parent
// @route   GET /api/students/parent/:parentId
// @access  Private/Admin/Teacher/Parent
router.get('/parent/:parentId', protect, async (req, res) => {
  try {
    // Check if user has access (admin, teacher, or the parent themselves)
    if (req.user.role !== 'admin' && req.user.role !== 'teacher' && req.user._id.toString() !== req.params.parentId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these students'
      });
    }

    const students = await Student.find({ parent: req.params.parentId })
      .populate('parent', 'username email profile')
      .sort({ grade: 1, firstName: 1 });

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Get students by parent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students'
    });
  }
});

// @desc    Get students by grade
// @route   GET /api/students/grade/:grade
// @access  Private/Admin/Teacher
router.get('/grade/:grade', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const students = await Student.find({ grade: req.params.grade })
      .populate('parent', 'username email profile')
      .sort({ firstName: 1, lastName: 1 });

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Get students by grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students'
    });
  }
});

// @desc    Add academic record
// @route   POST /api/students/:id/academic
// @access  Private/Admin/Teacher
router.post('/:id/academic', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const { subject, grade, term, year } = req.body;

    student.academicRecords.push({
      subject,
      grade,
      term,
      year,
      teacher: req.user._id
    });

    await student.save();

    res.json({
      success: true,
      message: 'Academic record added successfully',
      data: student.academicRecords[student.academicRecords.length - 1]
    });
  } catch (error) {
    console.error('Add academic record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding academic record'
    });
  }
});

// @desc    Add attendance record
// @route   POST /api/students/:id/attendance
// @access  Private/Admin/Teacher
router.post('/:id/attendance', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const { date, status } = req.body;

    student.attendance.push({
      date: date || new Date(),
      status: status || 'Present',
      teacher: req.user._id
    });

    await student.save();

    res.json({
      success: true,
      message: 'Attendance record added successfully',
      data: student.attendance[student.attendance.length - 1]
    });
  } catch (error) {
    console.error('Add attendance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding attendance record'
    });
  }
});

// @desc    Get student statistics
// @route   GET /api/students/:id/stats
// @access  Private/Admin/Teacher/Parent
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if user has access
    if (req.user.role !== 'admin' && req.user.role !== 'teacher' && student.parent.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this student'
      });
    }

    const totalAttendance = student.attendance.length;
    const presentDays = student.attendance.filter(a => a.status === 'Present').length;
    const absentDays = student.attendance.filter(a => a.status === 'Absent').length;
    const lateDays = student.attendance.filter(a => a.status === 'Late').length;

    const attendancePercentage = totalAttendance > 0 ? Math.round((presentDays / totalAttendance) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalAttendance,
        presentDays,
        absentDays,
        lateDays,
        attendancePercentage,
        academicRecordsCount: student.academicRecords.length,
        currentGrade: student.grade,
        age: student.getAge()
      }
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student statistics'
    });
  }
});

module.exports = router;