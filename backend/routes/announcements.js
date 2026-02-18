const express = require('express');
const multer = require('multer');
const path = require('path');
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');
const { validateAnnouncement } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/announcements/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDF, Word documents, and text files are allowed.'));
    }
  }
});

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, priority, audience } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (audience) {
      query.audience = audience;
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'username email profile')
      .sort({ publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(query);

    res.json({
      success: true,
      data: announcements,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalAnnouncements: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching announcements'
    });
  }
});

// @desc    Get active announcements
// @route   GET /api/announcements/active
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const announcements = await Announcement.getActiveAnnouncements()
      .populate('author', 'username email profile');

    res.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error('Get active announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching active announcements'
    });
  }
});

// @desc    Get announcement by ID
// @route   GET /api/announcements/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'username email profile');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Increment views
    announcement.views += 1;
    await announcement.save();

    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching announcement'
    });
  }
});

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private/Admin/Teacher
router.post('/', protect, authorize('admin', 'teacher'), validateAnnouncement, upload.array('attachments', 5), async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      priority,
      audience,
      expiryDate
    } = req.body;

    // Create new announcement
    const announcement = new Announcement({
      title,
      content,
      category,
      priority,
      audience: audience || ['All'],
      author: req.user._id,
      expiryDate: expiryDate || null,
      isPublished: true
    });

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      announcement.attachments = req.files.map(file => ({
        filename: file.originalname,
        url: `/uploads/announcements/${file.filename}`,
        type: file.mimetype.startsWith('image/') ? 'image' : 'document'
      }));
    }

    await announcement.save();

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating announcement'
    });
  }
});

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin/Teacher
router.put('/:id', protect, authorize('admin', 'teacher'), validateAnnouncement, upload.array('attachments', 5), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user owns the announcement or is admin
    if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement'
      });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'username email profile');

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        filename: file.originalname,
        url: `/uploads/announcements/${file.filename}`,
        type: file.mimetype.startsWith('image/') ? 'image' : 'document'
      }));
      
      updatedAnnouncement.attachments = [...updatedAnnouncement.attachments, ...newAttachments];
      await updatedAnnouncement.save();
    }

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: updatedAnnouncement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating announcement'
    });
  }
});

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin/Teacher
router.delete('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user owns the announcement or is admin
    if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement'
      });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting announcement'
    });
  }
});

// @desc    Publish announcement
// @route   PUT /api/announcements/:id/publish
// @access  Private/Admin/Teacher
router.put('/:id/publish', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user owns the announcement or is admin
    if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this announcement'
      });
    }

    announcement.isPublished = true;
    announcement.publishDate = new Date();
    await announcement.save();

    res.json({
      success: true,
      message: 'Announcement published successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Publish announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while publishing announcement'
    });
  }
});

// @desc    Unpublish announcement
// @route   PUT /api/announcements/:id/unpublish
// @access  Private/Admin/Teacher
router.put('/:id/unpublish', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user owns the announcement or is admin
    if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to unpublish this announcement'
      });
    }

    announcement.isPublished = false;
    await announcement.save();

    res.json({
      success: true,
      message: 'Announcement unpublished successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Unpublish announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while unpublishing announcement'
    });
  }
});

// @desc    Get announcements by category
// @route   GET /api/announcements/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const announcements = await Announcement.find({ 
      category: req.params.category,
      isPublished: true 
    })
      .populate('author', 'username email profile')
      .sort({ publishDate: -1 });

    res.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error('Get announcements by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching announcements'
    });
  }
});

// @desc    Get announcements by audience
// @route   GET /api/announcements/audience/:audience
// @access  Public
router.get('/audience/:audience', async (req, res) => {
  try {
    const announcements = await Announcement.find({ 
      audience: req.params.audience,
      isPublished: true 
    })
      .populate('author', 'username email profile')
      .sort({ publishDate: -1 });

    res.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error('Get announcements by audience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching announcements'
    });
  }
});

module.exports = router;