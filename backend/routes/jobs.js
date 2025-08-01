const express = require("express");
const { body, query } = require("express-validator");
const { auth, authorize } = require("../middleware/auth");
const validate = require("../middleware/validation");
const Job = require("../models/Job");
const User = require("../models/User");

const router = express.Router();

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Alumni only)
router.post(
  "/",
  [
    auth,
    authorize("alumni"),
    body("title").trim().notEmpty().withMessage("Job title is required"),
    body("company").trim().notEmpty().withMessage("Company name is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("logo").optional().isURL().withMessage("Invalid logo URL"),
    body("isRemote")
      .optional()
      .isBoolean()
      .withMessage("isRemote must be boolean"),
    body("type")
      .isIn(["Full-time", "Part-time", "Internship", "Contract", "Remote"])
      .withMessage("Invalid job type"),
    body("workplaceType")
      .isIn(["onsite", "remote", "hybrid"])
      .withMessage("Invalid workplace type"),
    body("experienceRequired.min")
      .isNumeric()
      .withMessage("Invalid minimum experience"),
    body("experienceRequired.max")
      .isNumeric()
      .withMessage("Invalid maximum experience"),
    body("experienceRequired.unit")
      .optional()
      .isIn(["years", "months"])
      .withMessage("Invalid experience unit"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("requirements").isArray().withMessage("Requirements must be an array"),
    body("requirements.*").trim().notEmpty().withMessage("Empty requirement"),
    body("technologies").isArray().withMessage("Technologies must be an array"),
    body("technologies.*").trim().notEmpty().withMessage("Empty technology"),
    body("salary.min").isNumeric().withMessage("Invalid minimum salary"),
    body("salary.max").isNumeric().withMessage("Invalid maximum salary"),
    body("salary.currency")
      .optional()
      .isString()
      .withMessage("Invalid currency"),
    body("expiresAt").isISO8601().withMessage("Invalid expiration date"),
    body("applicationDeadline")
      .isISO8601()
      .withMessage("Invalid application deadline"),
  ],
  validate,
  async (req, res) => {
    try {
      const jobData = {
        ...req.body,
        postedBy: req.user._id,
      };

      const job = new Job(jobData);
      await job.save();

      await job.populate("postedBy", "fullName role company");

      res.status(201).json({
        message: "Job posted successfully",
        job,
      });
    } catch (error) {
      console.error("Create job error:", error);
      res.status(500).json({ message: "Server error creating job posting" });
    }
  }
);

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Private
router.get(
  "/",
  [
    auth,
    query("search").optional().trim(),
    query("type")
      .optional()
      .isIn(["Full-time", "Part-time", "Internship", "Contract", "Remote"]),
    query("location").optional().trim(),
    query("company").optional().trim(),
    query("experienceMin").optional().isFloat({ min: 0 }),
    query("experienceMax").optional().isFloat({ min: 0 }),
    query("workplaceType").optional().isIn(["onsite", "remote", "hybrid"]),
    query("technologies").optional(),
    query("salaryMin").optional().isFloat({ min: 0 }),
    query("salaryMax").optional().isFloat({ min: 0 }),
    query("status").optional().isIn(["open", "closed", "interviewing"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
  ],
  validate,
  async (req, res) => {
    try {
      const {
        search,
        type,
        location,
        company,
        experienceMin,
        experienceMax,
        workplaceType,
        technologies,
        salaryMin,
        salaryMax,
        status = "open",
        page = 1,
        limit = 10,
      } = req.query;

      const query = {
        status,
        expiresAt: { $gt: new Date() },
        applicationDeadline: { $gt: new Date() },
      };

      // Add filters
      if (type) query.type = type;
      if (location) query.location = new RegExp(location, "i");
      if (company) query.company = new RegExp(company, "i");
      if (workplaceType) query.workplaceType = workplaceType;

      // Experience filter
      if (experienceMin || experienceMax) {
        query.experienceRequired = {};
        if (experienceMin)
          query.experienceRequired.min = { $gte: parseFloat(experienceMin) };
        if (experienceMax)
          query.experienceRequired.max = { $lte: parseFloat(experienceMax) };
      }

      // Salary filter
      if (salaryMin || salaryMax) {
        if (salaryMin) query["salary.min"] = { $gte: parseFloat(salaryMin) };
        if (salaryMax) query["salary.max"] = { $lte: parseFloat(salaryMax) };
      }

      // Technologies filter
      if (technologies) {
        const techArray = technologies.split(",").map((tech) => tech.trim());
        query.technologies = { $in: techArray };
      }

      // Search filter
      if (search) {
        query.$or = [
          { title: new RegExp(search, "i") },
          { company: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
          { technologies: new RegExp(search, "i") },
        ];
      }

      const jobs = await Job.find(query)
        .populate("postedBy", "fullName role company")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Job.countDocuments(query);

      res.json({
        jobs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ message: "Server error fetching jobs" });
    }
  }
);

// @route   GET /api/jobs/:jobId
// @desc    Get a single job by ID
// @access  Private
router.get("/:jobId", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate("postedBy", "fullName role company")
      .populate("applicants.user", "fullName role college");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ job });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ message: "Server error fetching job" });
  }
});

// @route   PUT /api/jobs/:jobId
// @desc    Update a job posting
// @access  Private (Job poster only)
router.put(
  "/:jobId",
  [
    auth,
    body("title").optional().trim().notEmpty(),
    body("company").optional().trim().notEmpty(),
    body("location").optional().trim().notEmpty(),
    body("type")
      .optional()
      .isIn(["Full-time", "Part-time", "Internship", "Contract", "Remote"]),
    body("description").optional().trim().notEmpty(),
    body("requirements").optional().isArray(),
    body("requirements.*").optional().trim().notEmpty(),
    body("salary.min").optional().isNumeric(),
    body("salary.max").optional().isNumeric(),
    body("status").optional().isIn(["open", "closed", "draft"]),
    body("expiresAt").optional().isISO8601(),
  ],
  validate,
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.postedBy.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this job" });
      }

      const updatedJob = await Job.findByIdAndUpdate(
        req.params.jobId,
        { $set: req.body },
        { new: true }
      ).populate("postedBy", "fullName role company");

      res.json({
        message: "Job updated successfully",
        job: updatedJob,
      });
    } catch (error) {
      console.error("Update job error:", error);
      res.status(500).json({ message: "Server error updating job" });
    }
  }
);

// @route   POST /api/jobs/:jobId/apply
// @desc    Apply for a job
// @access  Private (Students only)
router.post("/:jobId/apply", [auth, authorize("student")], async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status !== "open") {
      return res
        .status(400)
        .json({ message: "This job is no longer accepting applications" });
    }

    if (job.expiresAt < new Date()) {
      return res.status(400).json({ message: "This job posting has expired" });
    }

    const alreadyApplied = job.applicants.some(
      (applicant) => applicant.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    job.applicants.push({
      user: req.user._id,
      status: "pending",
      appliedAt: new Date(),
    });

    await job.save();
    await job.populate("postedBy", "fullName role company");

    res.json({
      message: "Application submitted successfully",
      job,
    });
  } catch (error) {
    console.error("Apply to job error:", error);
    res.status(500).json({ message: "Server error applying to job" });
  }
});

// @route   GET /api/jobs/posted/me
// @desc    Get jobs posted by the current user
// @access  Private (Alumni only)
router.get("/posted/me", [auth, authorize("alumni")], async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate("postedBy", "fullName role company")
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error("Get posted jobs error:", error);
    res.status(500).json({ message: "Server error fetching posted jobs" });
  }
});

// @route   GET /api/jobs/applications/me
// @desc    Get jobs applied to by the current user
// @access  Private (Students only)
router.get(
  "/applications/me",
  [auth, authorize("student")],
  async (req, res) => {
    try {
      const jobs = await Job.find({
        "applicants.user": req.user._id,
      })
        .populate("postedBy", "fullName role company")
        .sort({ "applicants.appliedAt": -1 });

      const applications = jobs.map((job) => {
        const application = job.applicants.find(
          (app) => app.user.toString() === req.user._id.toString()
        );
        return {
          job,
          status: application.status,
          appliedAt: application.appliedAt,
        };
      });

      res.json({ applications });
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ message: "Server error fetching applications" });
    }
  }
);

// @route   GET /api/jobs/stats
// @desc    Get job statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const now = new Date();
    const pipeline = [
      {
        $facet: {
          totalJobs: [{ $count: "count" }],
          activeJobs: [
            {
              $match: {
                status: "open",
                expiresAt: { $gt: now },
                applicationDeadline: { $gt: now },
              },
            },
            { $count: "count" },
          ],
          interviewingJobs: [
            { $match: { status: "interviewing" } },
            { $count: "count" },
          ],
          jobsByType: [{ $group: { _id: "$type", count: { $sum: 1 } } }],
          jobsByLocation: [
            { $group: { _id: "$location", count: { $sum: 1 } } },
          ],
          jobsByTechnology: [
            { $unwind: "$technologies" },
            { $group: { _id: "$technologies", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
          recentApplications: [
            { $match: { "applicants.0": { $exists: true } } },
            { $sort: { "applicants.appliedAt": -1 } },
            { $limit: 5 },
            {
              $project: {
                title: 1,
                company: 1,
                applicantsCount: { $size: "$applicants" },
                recentApplicant: { $arrayElemAt: ["$applicants", 0] },
              },
            },
          ],
        },
      },
    ];

    const [stats] = await Job.aggregate(pipeline);

    res.json({
      total: stats.totalJobs[0]?.count || 0,
      active: stats.activeJobs[0]?.count || 0,
      interviewing: stats.interviewingJobs[0]?.count || 0,
      byType: stats.jobsByType,
      byLocation: stats.jobsByLocation,
      topTechnologies: stats.jobsByTechnology,
      recentApplications: stats.recentApplications,
    });
  } catch (error) {
    console.error("Get job stats error:", error);
    res.status(500).json({ message: "Server error fetching job statistics" });
  }
});

module.exports = router;
