const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all public users (for browsing)
router.get('/browse', async (req, res) => {
  try {
    const { skill, location, availability } = req.query;
    let query = { isPublic: true };

    // Filter by skill
    if (skill) {
      query.$or = [
        { 'skillsOffered.name': { $regex: skill, $options: 'i' } },
        { 'skillsWanted.name': { $regex: skill, $options: 'i' } }
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by availability
    if (availability) {
      const availabilityFilters = availability.split(',');
      const availabilityQuery = {};
      availabilityFilters.forEach(avail => {
        availabilityQuery[`availability.${avail}`] = true;
      });
      query = { ...query, ...availabilityQuery };
    }

    const users = await User.find(query)
      .select('-password -email')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Browse users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users by skill
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      isPublic: true,
      $or: [
        { 'skillsOffered.name': { $regex: q, $options: 'i' } },
        { 'skillsWanted.name': { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    })
    .select('-password -email')
    .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isPublic) {
      return res.status(403).json({ message: 'Profile is private' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('location').optional().trim(),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, location, bio, isPublic, availability } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (availability) updateData.availability = availability;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile photo
router.post('/profile-photo', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: photoUrl },
      { new: true }
    ).select('-password');

    res.json({ user, photoUrl });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add skill offered
router.post('/skills-offered', auth, [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('description').optional().trim(),
  body('proficiency').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, proficiency } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Check if skill already exists
    const skillExists = user.skillsOffered.some(skill => 
      skill.name.toLowerCase() === name.toLowerCase()
    );
    
    if (skillExists) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    user.skillsOffered.push({ name, description, proficiency });
    await user.save();

    res.json(user.skillsOffered);
  } catch (error) {
    console.error('Add skill offered error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add skill wanted
router.post('/skills-wanted', auth, [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('description').optional().trim(),
  body('priority').optional().isIn(['Low', 'Medium', 'High'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, priority } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Check if skill already exists
    const skillExists = user.skillsWanted.some(skill => 
      skill.name.toLowerCase() === name.toLowerCase()
    );
    
    if (skillExists) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    user.skillsWanted.push({ name, description, priority });
    await user.save();

    res.json(user.skillsWanted);
  } catch (error) {
    console.error('Add skill wanted error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove skill offered
router.delete('/skills-offered/:skillId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.skillsOffered = user.skillsOffered.filter(
      skill => skill._id.toString() !== req.params.skillId
    );
    await user.save();

    res.json(user.skillsOffered);
  } catch (error) {
    console.error('Remove skill offered error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove skill wanted
router.delete('/skills-wanted/:skillId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.skillsWanted = user.skillsWanted.filter(
      skill => skill._id.toString() !== req.params.skillId
    );
    await user.save();

    res.json(user.skillsWanted);
  } catch (error) {
    console.error('Remove skill wanted error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all users (for skill moderation)
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 