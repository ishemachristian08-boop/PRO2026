const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    // Check if user exists
    let user = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username }] 
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username'
      });
    }

    // Create new user
    user = new User({
      username,
      email: email.toLowerCase(),
      password,
      role,
      profile
    });

    await user.save();

    // Create and send token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password, securityCode } = req.body;

    // Check for user email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +securityCode');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked due to too many failed attempts
    if (user.securityCodeLockedUntil && user.securityCodeLockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.securityCodeLockedUntil - new Date()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Account is temporarily locked. Please try again in ${minutesLeft} minutes.`
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Reset security code attempts on successful password
      user.securityCodeAttempts = 0;
      await user.save();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check security code if it's set for the user
    if (user.securityCode) {
      if (!securityCode) {
        return res.status(401).json({
          success: false,
          message: 'Security code is required',
          requiresSecurityCode: true
        });
      }

      const isSecurityCodeValid = await user.compareSecurityCode(securityCode);
      
      if (!isSecurityCodeValid) {
        // Increment failed attempts
        user.securityCodeAttempts = (user.securityCodeAttempts || 0) + 1;
        
        // Lock account after 5 failed attempts
        if (user.securityCodeAttempts >= 5) {
          user.securityCodeLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
          await user.save();
          return res.status(429).json({
            success: false,
            message: 'Too many failed attempts. Account locked for 15 minutes.'
          });
        }
        
        await user.save();
        return res.status(401).json({
          success: false,
          message: `Invalid security code. ${5 - user.securityCodeAttempts} attempts remaining.`,
          requiresSecurityCode: true
        });
      }

      // Reset attempts on successful security code
      user.securityCodeAttempts = 0;
      user.securityCodeLockedUntil = undefined;
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create and send token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        profile: req.user.profile,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { profile } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile
    user.profile = { ...user.profile, ...profile };
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating password'
    });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address'
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL (this would typically send an email)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // In a real application, you would send an email here
    // For now, we'll just return the reset token
    res.json({
      success: true,
      message: 'Password reset token generated',
      data: {
        resetToken,
        resetUrl
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      success: false,
      message: 'Email could not be sent'
    });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
router.put('/reset-password/:resettoken', async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// @desc    Set security code
// @route   POST /api/auth/security-code
// @access  Private
router.post('/security-code', protect, async (req, res) => {
  try {
    const { securityCode, currentPassword } = req.body;

    if (!securityCode || securityCode.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Security code must be at least 4 characters'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password before setting security code
    if (currentPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
    }

    // Set the security code
    await user.setSecurityCode(securityCode);
    await user.save();

    res.json({
      success: true,
      message: 'Security code set successfully'
    });

  } catch (error) {
    console.error('Set security code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error setting security code'
    });
  }
});

// @desc    Remove security code
// @route   DELETE /api/auth/security-code
// @access  Private
router.delete('/security-code', protect, async (req, res) => {
  try {
    const { currentPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password before removing security code
    if (currentPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
    }

    user.securityCode = undefined;
    user.securityCodeAttempts = 0;
    user.securityCodeLockedUntil = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Security code removed successfully'
    });

  } catch (error) {
    console.error('Remove security code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing security code'
    });
  }
});

module.exports = router;