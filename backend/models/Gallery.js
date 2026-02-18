const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Gallery title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['Academic', 'Sports', 'Cultural', 'Events', 'Campus', 'Achievements', 'Other'],
    default: 'Academic'
  },
  images: [{
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnailUrl: {
      type: String
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 200
    },
    altText: {
      type: String,
      trim: true,
      maxlength: 100
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
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
gallerySchema.index({ category: 1 });
gallerySchema.index({ isPublic: 1 });
gallerySchema.index({ featured: 1 });
gallerySchema.index({ tags: 1 });

// Static method to get public galleries
gallerySchema.statics.getPublicGalleries = function() {
  return this.find({ isPublic: true }).sort({ createdAt: -1 });
};

// Static method to get featured galleries
gallerySchema.statics.getFeaturedGalleries = function() {
  return this.find({ isPublic: true, featured: true }).sort({ createdAt: -1 });
};

// Static method to get galleries by category
gallerySchema.statics.getGalleriesByCategory = function(category) {
  return this.find({ 
    isPublic: true, 
    category: category 
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Gallery', gallerySchema);