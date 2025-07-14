const express = require('express');
const Webinar = require('../models/Webinar');
const { auth, alumniAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/webinars
// @desc    Get all webinars
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status = 'upcoming' } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const webinars = await Webinar.find(filter)
      .populate('host', 'fullName college branch company')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalWebinars = await Webinar.countDocuments(filter);
    const totalPages = Math.ceil(totalWebinars / limit);

    res.json({
      webinars,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalWebinars,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get webinars error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/webinars
// @desc    Create a webinar
// @access  Private (Alumni only)
router.post('/', alumniAuth, async (req, res) => {
  try {
    const webinarData = {
      ...req.body,
      host: req.user.id
    };

    const webinar = new Webinar(webinarData);
    await webinar.save();

    res.status(201).json({ message: 'Webinar created successfully', webinar });
  } catch (error) {
    console.error('Create webinar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/webinars/:id/register
// @desc    Register for a webinar
// @access  Private
router.post('/:id/register', auth, async (req, res) => {
  try {
    const webinarId = req.params.id;
    const userId = req.user.id;

    const webinar = await Webinar.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    // Check if already registered
    const alreadyRegistered = webinar.attendees.some(
      attendee => attendee.user.toString() === userId
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this webinar' });
    }

    // Check if webinar is full
    if (webinar.attendees.length >= webinar.maxAttendees) {
      return res.status(400).json({ message: 'Webinar is full' });
    }

    // Add registration
    webinar.attendees.push({ user: userId });
    await webinar.save();

    res.json({ message: 'Successfully registered for webinar' });
  } catch (error) {
    console.error('Register for webinar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;