const express = require('express');
const multer = require('multer');
const path = require('path');
const Gallery = require('../models/Gallery');
const { protect, authorize } = require('../middleware/auth');
const { validateGallery } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/gallery/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// @desc    Get all galleries
// @route   GET /api/gallery
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, featured } = req.query;
    
    let query = { isPublic: true };
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const galleries = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Gallery.countDocuments(query);

    res.json({
      success: true,
      data: galleries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalGalleries: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get galleries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching galleries'
    });
  }
});

// @desc    Get public galleries
// @route   GET /api/gallery/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const galleries = await Gallery.getPublicGalleries();

    res.json({
      success: true,
      data: galleries
    });
  } catch (error) {
    console.error('Get public galleries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching public galleries'
    });
  }
});

// @desc    Get featured galleries
// @route   GET /api/gallery/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const galleries = await Gallery.getFeaturedGalleries();

    res.json({
      success: true,
      data: galleries
    });
  } catch (error) {
    console.error('Get featured galleries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured galleries'
    });
  }
});

// @desc    Get gallery by ID
// @route   GET /api/gallery/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }

    if (!gallery.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Gallery is not public'
      });
    }

    res.json({
      success: true,
      data: gallery
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gallery'
    });
  }
});

// @desc    Create new gallery
// @route   POST /api/gallery
// @access  Private/Admin/Teacher
router.post('/', protect, authorize('admin', 'teacher'), validateGallery, upload.array('images', 20), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      isPublic,
      featured
    } = req.body;

    // Create new gallery
    const gallery = new Gallery({
      title,
      description,
      category,
      tags: tags || [],
      isPublic: isPublic !== undefined ? isPublic : true,
      featured: featured || false
    });

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      gallery.images = req.files.map(file => ({
        filename: file.originalname,
        url: `/uploads/gallery/${file.filename}`,
        thumbnailUrl: `/uploads/gallery/thumb-${file.filename}`,
        altText: file.originalname,
        uploadedBy: req.user._id
      }));
    }

    await gallery.save();

    res.status(201).json({
      success: true,
      message: 'Gallery created successfully',
      data: gallery
    });
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating gallery'
    });
  }
});

// @desc    Update gallery
// @route   PUT /api/gallery/:id
// @access  Private/Admin/Teacher
router.put('/:id', protect, authorize('admin', 'teacher'), validateGallery, upload.array('images', 20), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }

    // Check if user owns the gallery or is admin
    if (gallery.images.length > 0 && gallery.images[0].uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gallery'
      });
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        filename: file.originalname,
        url: `/uploads/gallery/${file.filename}`,
        thumbnailUrl: `/uploads/gallery/thumb-${file.filename}`,
        altText: file.originalname,
        uploadedBy: req.user._id
      }));
      
      updatedGallery.images = [...updatedGallery.images, ...newImages];
      await updatedGallery.save();
    }

    res.json({
      success: true,
      message: 'Gallery updated successfully',
      data: updatedGallery
    });
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating gallery'
    });
  }
});

// @desc    Delete gallery
// @route   DELETE /api/gallery/:id
// @access  Private/Admin/Teacher
router.delete('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }

    // Check if user owns the gallery or is admin
    if (gallery.images.length > 0 && gallery.images[0].uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gallery'
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Gallery deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting gallery'
    });
  }
});

// @desc    Add image to gallery
// @route   POST /api/gallery/:id/images
// @access  Private/Admin/Teacher
router.post('/:id/images', protect, authorize('admin', 'teacher'), upload.array('images', 10), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }

    // Check if user owns the gallery or is admin
    if (gallery.images.length > 0 && gallery.images[0].uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add images to this gallery'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    const newImages = req.files.map(file => ({
      filename: file.originalname,
      url: `/uploads/gallery/${file.filename}`,
      thumbnailUrl: `/uploads/gallery/thumb-${file.filename}`,
      altText: file.originalname,
      uploadedBy: req.user._id
    }));

    gallery.images = [...gallery.images, ...newImages];
    await gallery.save();

    res.json({
      success: true,
      message: 'Images added to gallery successfully',
      data: {
        addedImages: newImages.length,
        totalImages: gallery.images.length
      }
    });
  } catch (error) {
    console.error('Add images to gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding images to gallery'
    });
  }
});

// @desc    Remove image from gallery
// @route   DELETE /api/gallery/:id/images/:imageId
// @access  Private/Admin/Teacher
router.delete('/:id/images/:imageId', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }

    // Check if user owns the gallery or is admin
    if (gallery.images.length > 0 && gallery.images[0].uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove images from this gallery'
      });
    }

    const imageIndex = gallery.images.findIndex(img => img._id.toString() === req.params.imageId);

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found in gallery'
      });
    }

    gallery.images.splice(imageIndex, 1);
    await gallery.save();

    res.json({
      success: true,
      message: 'Image removed from gallery successfully',
      data: {
        totalImages: gallery.images.length
      }
    });
  } catch (error) {
    console.error('Remove image from gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing image from gallery'
    });
  }
});

// @desc    Make gallery public
// @route   PUT /api/gallery/:id/public
// @access  Private/Admin/Teacher
router.put('/:id/public', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }

    // Check if user owns the gallery or is admin
    if (gallery.images.length > 0 && gallery.images[0].uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make this gallery public'
      });
    }

    gallery.isPublic = true;
    await gallery.save();

    res.json({
      success: true,
      message: 'Gallery made public successfully',
      data: gallery
    });
  } catch (error) {
    console.error('Make gallery public error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while making gallery public'
    });
  }
});

// @desc    Make gallery private
// @route   PUT /api/gallery/:id/private
// @access  Private/Admin/Teacher
router.put('/:id/private', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }

    // Check if user owns the gallery or is admin
    if (gallery.images.length > 0 && gallery.images[0].uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make this gallery private'
      });
    }

    gallery.isPublic = false;
    await gallery.save();

    res.json({
      success: true,
      message: 'Gallery made private successfully',
      data: gallery
    });
  } catch (error) {
    console.error('Make gallery private error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while making gallery private'
    });
  }
});

// @desc    Feature gallery
// @route   PUT /api/gallery/:id/feature
// @access  Private/Admin/Teacher
router.put('/:id/feature', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }

    // Check if user owns the gallery or is admin
    if (gallery.images.length > 0 && gallery.images[0].uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to feature this gallery'
      });
    }

    gallery.featured = true;
    await gallery.save();

    res.json({
      success: true,
      message: 'Gallery featured successfully',
      data: gallery
    });
  } catch (error) {
    console.error('Feature gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while featuring gallery'
    });
  }
});

// @desc    Unfeature gallery
// @route   PUT /api/gallery/:id/unfeature
// @access  Private/Admin/Teacher
router.put('/:id/unfeature', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }

    // Check if user owns the gallery or is admin
    if (gallery.images.length > 0 && gallery.images[0].uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to unfeature this gallery'
      });
    }

    gallery.featured = false;
    await gallery.save();

    res.json({
      success: true,
      message: 'Gallery unfeatured successfully',
      data: gallery
    });
  } catch (error) {
    console.error('Unfeature gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while unfeaturing gallery'
    });
  }
});

// @desc    Get galleries by category
// @route   GET /api/gallery/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const galleries = await Gallery.getGalleriesByCategory(req.params.category);

    res.json({
      success: true,
      data: galleries
    });
  } catch (error) {
    console.error('Get galleries by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching galleries'
    });
  }
});

module.exports = router;