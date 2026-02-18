const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: 1000
  },
  eventType: {
    type: String,
    enum: ['Academic', 'Sports', 'Cultural', 'Religious', 'Community', 'Fundraising', 'Other'],
    default: 'Academic'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  audience: {
    type: [String],
    enum: ['All', 'Parents', 'Students', 'Teachers', 'Nursery', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    default: ['All']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrenceRule: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    default: null
  },
  maxParticipants: {
    type: Number,
    min: 1
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date
  },
  attachments: [{
    filename: String,
    url: String,
    type: String // 'image', 'document', 'video'
  }],
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Cancelled', 'Completed'],
    default: 'Draft'
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
eventSchema.index({ startDate: 1 });
eventSchema.index({ endDate: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ status: 1 });

// Instance method to check if event is upcoming
eventSchema.methods.isUpcoming = function() {
  return new Date() < this.startDate && this.status === 'Published';
};

// Instance method to check if event is ongoing
eventSchema.methods.isOngoing = function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate && this.status === 'Published';
};

// Instance method to check if event is past
eventSchema.methods.isPast = function() {
  return new Date() > this.endDate;
};

// Instance method to check if registration is open
eventSchema.methods.isRegistrationOpen = function() {
  if (!this.registrationRequired) return false;
  if (this.registrationDeadline) {
    return new Date() <= this.registrationDeadline && this.status === 'Published';
  }
  return this.status === 'Published';
};

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = function() {
  return this.find({
    status: 'Published',
    startDate: { $gt: new Date() }
  }).sort({ startDate: 1 });
};

// Static method to get ongoing events
eventSchema.statics.getOngoingEvents = function() {
  const now = new Date();
  return this.find({
    status: 'Published',
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ startDate: 1 });
};

module.exports = mongoose.model('Event', eventSchema);