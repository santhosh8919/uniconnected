const express = require('express');
const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');
const Message = require('../models/Message');
const JobPosting = require('../models/JobPosting');
const Webinar = require('../models/Webinar');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/student
// @desc    Get student dashboard data
// @access  Private (Student)
router.get('/student', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get connection stats
    const connections = await ConnectionRequest.countDocuments({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'accepted'
    });

    const pendingRequests = await ConnectionRequest.countDocuments({
      sender: userId,
      status: 'pending'
    });

    // Get message stats
    const messages = await Message.countDocuments({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // Get job application stats
    const jobApplications = await JobPosting.countDocuments({
      'applicants.user': userId
    });

    // Get webinar stats
    const webinarsAttended = await Webinar.countDocuments({
      'attendees.user': userId
    });

    // Get profile views
    const user = await User.findById(userId);
    const profileViews = user.profileViews || 0;

    // Recent activities (mock data for now)
    const recentActivities = [
      { title: 'New connection request from John Doe', time: '2 hours ago' },
      { title: 'Applied to Software Engineer position', time: '1 day ago' },
      { title: 'Registered for AI/ML webinar', time: '3 days ago' }
    ];

    res.json({
      stats: {
        connections,
        pendingRequests,
        messages,
        jobApplications,
        webinarsAttended,
        profileViews
      },
      recentActivities
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/alumni
// @desc    Get alumni dashboard data
// @access  Private (Alumni)
router.get('/alumni', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get connection stats
    const connections = await ConnectionRequest.countDocuments({
      receiver: userId,
      status: 'accepted'
    });

    const pendingRequests = await ConnectionRequest.countDocuments({
      receiver: userId,
      status: 'pending'
    });

    // Get job posting stats
    const jobPostings = await JobPosting.countDocuments({
      postedBy: userId
    });

    // Get webinar stats
    const webinarsHosted = await Webinar.countDocuments({
      host: userId
    });

    // Get message stats
    const messages = await Message.countDocuments({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // Get mentorship stats (mock for now)
    const mentorshipRequests = 5;

    res.json({
      stats: {
        connections,
        pendingRequests,
        jobPostings,
        webinarsHosted,
        messages,
        mentorshipRequests
      }
    });
  } catch (error) {
    console.error('Alumni dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;