const express = require('express');
const JobPosting = require('../models/JobPosting');
const { auth, alumniAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all job postings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, location, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = { status: 'active', expiresAt: { $gt: new Date() } };
    
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await JobPosting.find(filter)
      .populate('postedBy', 'fullName college branch')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalJobs = await JobPosting.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit);

    res.json({
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalJobs,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs
// @desc    Create a job posting
// @access  Private (Alumni only)
router.post('/', alumniAuth, async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user.id
    };

    const job = new JobPosting(jobData);
    await job.save();

    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id)
      .populate('postedBy', 'fullName college branch company jobRole');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const { resume, coverLetter } = req.body;
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      applicant => applicant.user.toString() === userId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    // Add application
    job.applicants.push({
      user: userId,
      resume,
      coverLetter
    });

    job.applications += 1;
    await job.save();

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;