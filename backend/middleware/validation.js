const { body, validationResult } = require('express-validator');

// Validation middleware for registration
const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .isIn(['admin', 'teacher', 'parent'])
    .withMessage('Role must be admin, teacher, or parent'),
  
  body('profile.firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name is required and must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('profile.lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name is required and must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('profile.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('profile.address')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters long'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for student creation
const validateStudent = [
  body('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name is required and must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name is required and must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth')
    .custom((value) => {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 3 || age > 15) {
        throw new Error('Student age must be between 3 and 15 years');
      }
      return true;
    }),
  
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  
  body('grade')
    .isIn(['Nursery', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'])
    .withMessage('Grade must be Nursery, P1, P2, P3, P4, P5, or P6'),
  
  body('parent')
    .isMongoId()
    .withMessage('Parent must be a valid user ID'),
  
  body('contactInfo.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('contactInfo.address')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters long'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for announcements
const validateAnnouncement = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Content must be between 10 and 2000 characters'),
  
  body('category')
    .optional()
    .isIn(['General', 'Academic', 'Events', 'News', 'Important'])
    .withMessage('Category must be General, Academic, Events, News, or Important'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Urgent'])
    .withMessage('Priority must be Low, Medium, High, or Urgent'),
  
  body('audience')
    .optional()
    .isArray()
    .withMessage('Audience must be an array'),
  
  body('audience.*')
    .isIn(['All', 'Parents', 'Students', 'Teachers', 'Nursery', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'])
    .withMessage('Invalid audience value'),
  
  body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid expiry date'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for events
const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('eventType')
    .isIn(['Academic', 'Sports', 'Cultural', 'Religious', 'Community', 'Fundraising', 'Other'])
    .withMessage('Event type must be Academic, Sports, Cultural, Religious, Community, Fundraising, or Other'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  
  body('endDate')
    .isISO8601()
    .withMessage('Please provide a valid end date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('location')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Location is required and must be at least 3 characters'),
  
  body('audience')
    .optional()
    .isArray()
    .withMessage('Audience must be an array'),
  
  body('audience.*')
    .isIn(['All', 'Parents', 'Students', 'Teachers', 'Nursery', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'])
    .withMessage('Invalid audience value'),
  
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max participants must be a positive number'),
  
  body('registrationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid registration deadline'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for gallery
const validateGallery = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('category')
    .isIn(['Academic', 'Sports', 'Cultural', 'Events', 'Campus', 'Achievements', 'Other'])
    .withMessage('Category must be Academic, Sports, Cultural, Events, Campus, Achievements, or Other'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Each tag must be between 2 and 50 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateStudent,
  validateAnnouncement,
  validateEvent,
  validateGallery
};