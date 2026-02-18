const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['General', 'Academic', 'Events', 'News', 'Important'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  audience: {
    type: [String],
    enum: ['All', 'Parents', 'Students', 'Teachers', 'Nursery', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    default: ['All']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [{
    filename: String,
    url: String,
    type: String // 'image', 'document', 'video'
  }],
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
announcementSchema.index({ publishDate: -1 });
announcementSchema.index({ category: 1 });
announcementSchema.index({ isPublished: 1 });

// Instance method to check if announcement is expired
announcementSchema.methods.isExpired = function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
};

// Instance method to check if announcement is active
announcementSchema.methods.isActive = function() {
  return this.isPublished && !this.isExpired();
};

// Static method to get active announcements
announcementSchema.statics.getActiveAnnouncements = function() {
  return this.find({
    isPublished: true,
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gt: new Date() } }
    ]
  }).sort({ publishDate: -1 });
};

module.exports = mongoose.model('Announcement', announcementSchema);