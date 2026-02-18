const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/events/');
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

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, eventType, status, audience } = req.query;
    
    let query = {};
    
    if (eventType) {
      query.eventType = eventType;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (audience) {
      query.audience = audience;
    }

    const events = await Event.find(query)
      .populate('organizer', 'username email profile')
      .sort({ startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEvents: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const events = await Event.getUpcomingEvents()
      .populate('organizer', 'username email profile');

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upcoming events'
    });
  }
});

// @desc    Get ongoing events
// @route   GET /api/events/ongoing
// @access  Public
router.get('/ongoing', async (req, res) => {
  try {
    const events = await Event.getOngoingEvents()
      .populate('organizer', 'username email profile');

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get ongoing events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching ongoing events'
    });
  }
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username email profile');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    });
  }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin/Teacher
router.post('/', protect, authorize('admin', 'teacher'), validateEvent, upload.array('attachments', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      startDate,
      endDate,
      location,
      audience,
      isPublic,
      isRecurring,
      recurrenceRule,
      maxParticipants,
      registrationRequired,
      registrationDeadline
    } = req.body;

    // Create new event
    const event = new Event({
      title,
      description,
      eventType,
      startDate,
      endDate,
      location,
      organizer: req.user._id,
      audience: audience || ['All'],
      isPublic: isPublic !== undefined ? isPublic : true,
      isRecurring: isRecurring || false,
      recurrenceRule: isRecurring ? recurrenceRule : null,
      maxParticipants: maxParticipants || null,
      registrationRequired: registrationRequired || false,
      registrationDeadline: registrationDeadline || null,
      status: 'Published'
    });

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      event.attachments = req.files.map(file => ({
        filename: file.originalname,
        url: `/uploads/events/${file.filename}`,
        type: file.mimetype.startsWith('image/') ? 'image' : 'document'
      }));
    }

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating event'
    });
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin/Teacher
router.put('/:id', protect, authorize('admin', 'teacher'), validateEvent, upload.array('attachments', 5), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event or is admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('organizer', 'username email profile');

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        filename: file.originalname,
        url: `/uploads/events/${file.filename}`,
        type: file.mimetype.startsWith('image/') ? 'image' : 'document'
      }));
      
      updatedEvent.attachments = [...updatedEvent.attachments, ...newAttachments];
      await updatedEvent.save();
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin/Teacher
router.delete('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event or is admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
});

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!event.registrationRequired) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not required for this event'
      });
    }

    if (!event.isRegistrationOpen()) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not open for this event'
      });
    }

    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Check if user is already registered (you would need a registrations array in the model for this)
    // For now, just increment the counter
    event.currentParticipants += 1;
    await event.save();

    res.json({
      success: true,
      message: 'Successfully registered for event',
      data: {
        currentParticipants: event.currentParticipants,
        maxParticipants: event.maxParticipants
      }
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while registering for event'
    });
  }
});

// @desc    Cancel registration
// @route   POST /api/events/:id/cancel-registration
// @access  Private
router.post('/:id/cancel-registration', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!event.registrationRequired) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not required for this event'
      });
    }

    if (event.currentParticipants > 0) {
      event.currentParticipants -= 1;
      await event.save();
    }

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
      data: {
        currentParticipants: event.currentParticipants,
        maxParticipants: event.maxParticipants
      }
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling registration'
    });
  }
});

// @desc    Publish event
// @route   PUT /api/events/:id/publish
// @access  Private/Admin/Teacher
router.put('/:id/publish', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event or is admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this event'
      });
    }

    event.status = 'Published';
    await event.save();

    res.json({
      success: true,
      message: 'Event published successfully',
      data: event
    });
  } catch (error) {
    console.error('Publish event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while publishing event'
    });
  }
});

// @desc    Cancel event
// @route   PUT /api/events/:id/cancel
// @access  Private/Admin/Teacher
router.put('/:id/cancel', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event or is admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this event'
      });
    }

    event.status = 'Cancelled';
    await event.save();

    res.json({
      success: true,
      message: 'Event cancelled successfully',
      data: event
    });
  } catch (error) {
    console.error('Cancel event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling event'
    });
  }
});

// @desc    Get events by type
// @route   GET /api/events/type/:eventType
// @access  Public
router.get('/type/:eventType', async (req, res) => {
  try {
    const events = await Event.find({ 
      eventType: req.params.eventType,
      status: 'Published' 
    })
      .populate('organizer', 'username email profile')
      .sort({ startDate: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get events by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

// @desc    Get events by audience
// @route   GET /api/events/audience/:audience
// @access  Public
router.get('/audience/:audience', async (req, res) => {
  try {
    const events = await Event.find({ 
      audience: req.params.audience,
      status: 'Published' 
    })
      .populate('organizer', 'username email profile')
      .sort({ startDate: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get events by audience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

module.exports = router;