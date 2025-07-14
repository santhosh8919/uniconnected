const express = require('express');
const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');
const JobPosting = require('../models/JobPosting');
const Webinar = require('../models/Webinar');
const Message = require('../models/Message');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const alumni = await User.countDocuments({ role: 'alumni' });
    const connections = await ConnectionRequest.countDocuments({ status: 'accepted' });
    const jobPostings = await JobPosting.countDocuments({ status: 'active' });
    const webinars = await Webinar.countDocuments();
    const activeUsers = await User.countDocuments({ isOnline: true });

    // Calculate monthly growth
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    const monthlyGrowth = totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100).toFixed(1) : 0;

    // Chart data - User growth over last 6 months
    const userGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const users = await User.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });
      
      userGrowth.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        users
      });
    }

    // Connection stats over last 6 months
    const connectionStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const connections = await ConnectionRequest.countDocuments({
        status: 'accepted',
        updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
      });
      
      connectionStats.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        connections
      });
    }

    // User distribution
    const userDistribution = [
      { name: 'Students', value: students },
      { name: 'Alumni', value: alumni },
      { name: 'Admins', value: await User.countDocuments({ role: 'admin' }) }
    ];

    res.json({
      stats: {
        totalUsers,
        students,
        alumni,
        connections,
        jobPostings,
        webinars,
        activeUsers,
        monthlyGrowth: parseFloat(monthlyGrowth)
      },
      chartData: {
        userGrowth,
        connectionStats,
        userDistribution
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filtering
// @access  Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password');

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Admin
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Admin
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { fullName, email, role, college, branch, year, company, jobRole, isWorking } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.college = college || user.college;
    user.branch = branch || user.branch;
    user.year = year || user.year;
    user.company = company || user.company;
    user.jobRole = jobRole || user.jobRole;
    user.isWorking = isWorking !== undefined ? isWorking : user.isWorking;

    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deletion of admin users
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    // Delete related data
    await ConnectionRequest.deleteMany({
      $or: [{ sender: req.params.id }, { receiver: req.params.id }]
    });
    await Message.deleteMany({
      $or: [{ sender: req.params.id }, { receiver: req.params.id }]
    });
    await JobPosting.deleteMany({ postedBy: req.params.id });
    await Webinar.deleteMany({ host: req.params.id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/connections
// @desc    Get all connection requests
// @access  Admin
router.get('/connections', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const connections = await ConnectionRequest.find(filter)
      .populate('sender', 'fullName email college branch')
      .populate('receiver', 'fullName email college branch')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalConnections = await ConnectionRequest.countDocuments(filter);
    const totalPages = Math.ceil(totalConnections / limit);

    res.json({
      connections,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalConnections,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Admin
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    // User registration trends
    const registrationTrends = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Most active colleges
    const topColleges = await User.aggregate([
      { $group: { _id: '$college', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Most popular branches
    const topBranches = await User.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Connection success rate
    const connectionStats = await ConnectionRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Job posting statistics
    const jobStats = await JobPosting.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      registrationTrends,
      topColleges,
      topBranches,
      connectionStats,
      jobStats
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;