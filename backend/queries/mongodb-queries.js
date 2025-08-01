// MongoDB Query Check for UniConnect Application
// Collection: users
// Use these queries in MongoDB Compass, MongoDB Shell, or any MongoDB client

// ========================================
// 1. BASIC VERIFICATION QUERIES
// ========================================

// Check if database exists and get collection info
// show dbs
// use uniconnect
// show collections

// Count total users
db.users.countDocuments();

// Get first 5 users (overview)
db.users.find().limit(5).pretty();

// ========================================
// 2. USER REGISTRATION VERIFICATION
// ========================================

// Check all registered users
db.users
  .find(
    {},
    {
      fullName: 1,
      email: 1,
      college: 1,
      branch: 1,
      year: 1,
      role: 1,
      createdAt: 1,
    }
  )
  .sort({ createdAt: -1 });

// Find users by role
db.users.find({ role: "student" }).count();
db.users.find({ role: "alumni" }).count();

// Find users by year
db.users.find({ year: "1st Year" }).count();
db.users.find({ year: "2nd Year" }).count();
db.users.find({ year: "3rd Year" }).count();
db.users.find({ year: "4th Year" }).count();
db.users.find({ year: "Alumni" }).count();

// ========================================
// 3. COLLEGE & BRANCH ANALYTICS
// ========================================

// Group users by college
db.users.aggregate([
  {
    $group: {
      _id: "$college",
      count: { $sum: 1 },
      students: {
        $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] },
      },
      alumni: {
        $sum: { $cond: [{ $eq: ["$role", "alumni"] }, 1, 0] },
      },
    },
  },
  { $sort: { count: -1 } },
]);

// Group users by branch
db.users.aggregate([
  {
    $group: {
      _id: "$branch",
      count: { $sum: 1 },
      colleges: { $addToSet: "$college" },
    },
  },
  { $sort: { count: -1 } },
]);

// Users by college and branch combination
db.users.aggregate([
  {
    $group: {
      _id: {
        college: "$college",
        branch: "$branch",
      },
      count: { $sum: 1 },
      students: {
        $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] },
      },
      alumni: {
        $sum: { $cond: [{ $eq: ["$role", "alumni"] }, 1, 0] },
      },
    },
  },
  { $sort: { count: -1 } },
]);

// ========================================
// 4. ALUMNI-SPECIFIC QUERIES
// ========================================

// All alumni users
db.users.find(
  { role: "alumni" },
  {
    fullName: 1,
    email: 1,
    college: 1,
    branch: 1,
    isWorking: 1,
    companyName: 1,
    jobRole: 1,
  }
);

// Working alumni
db.users.find(
  {
    role: "alumni",
    isWorking: true,
  },
  {
    fullName: 1,
    companyName: 1,
    jobRole: 1,
    college: 1,
    branch: 1,
  }
);

// Non-working alumni
db.users
  .find({
    role: "alumni",
    isWorking: false,
  })
  .count();

// Alumni by company
db.users.aggregate([
  {
    $match: {
      role: "alumni",
      isWorking: true,
      companyName: { $exists: true, $ne: "" },
    },
  },
  {
    $group: {
      _id: "$companyName",
      count: { $sum: 1 },
      employees: {
        $push: {
          name: "$fullName",
          role: "$jobRole",
          college: "$college",
          branch: "$branch",
        },
      },
    },
  },
  { $sort: { count: -1 } },
]);

// ========================================
// 5. PROFILE COMPLETION QUERIES
// ========================================

// Users with complete profiles
db.users
  .find({
    fullName: { $exists: true, $ne: "" },
    email: { $exists: true, $ne: "" },
    college: { $exists: true, $ne: "" },
    branch: { $exists: true, $ne: "" },
    year: { $exists: true, $ne: "" },
    bio: { $exists: true, $ne: "" },
  })
  .count();

// Users with incomplete profiles
db.users.find(
  {
    $or: [
      { bio: { $exists: false } },
      { bio: "" },
      { skills: { $size: 0 } },
      { "socialLinks.linkedin": "" },
      { "socialLinks.github": "" },
    ],
  },
  {
    fullName: 1,
    email: 1,
    bio: 1,
    skills: 1,
    socialLinks: 1,
  }
);

// ========================================
// 6. SEARCH FUNCTIONALITY TESTS
// ========================================

// Search by name (case insensitive)
db.users.find(
  {
    fullName: { $regex: "john", $options: "i" },
  },
  {
    fullName: 1,
    email: 1,
    college: 1,
    role: 1,
  }
);

// Search by college (case insensitive)
db.users.find(
  {
    college: { $regex: "IIT", $options: "i" },
  },
  {
    fullName: 1,
    college: 1,
    branch: 1,
    role: 1,
  }
);

// Search by branch
db.users.find(
  {
    branch: { $regex: "Computer Science", $options: "i" },
  },
  {
    fullName: 1,
    college: 1,
    branch: 1,
    role: 1,
  }
);

// Full text search (if text index exists)
db.users.find({
  $text: { $search: "software engineer" },
});

// ========================================
// 7. RECENT ACTIVITY QUERIES
// ========================================

// Recently registered users (last 7 days)
db.users
  .find(
    {
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    {
      fullName: 1,
      email: 1,
      college: 1,
      role: 1,
      createdAt: 1,
    }
  )
  .sort({ createdAt: -1 });

// Users who logged in recently (last 24 hours)
db.users
  .find(
    {
      lastLogin: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    {
      fullName: 1,
      email: 1,
      lastLogin: 1,
    }
  )
  .sort({ lastLogin: -1 });

// ========================================
// 8. VALIDATION QUERIES
// ========================================

// Find users with invalid email formats
db.users.find({
  email: { $not: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ },
});

// Find users without required fields
db.users.find({
  $or: [
    { fullName: { $exists: false } },
    { email: { $exists: false } },
    { college: { $exists: false } },
    { branch: { $exists: false } },
    { year: { $exists: false } },
  ],
});

// Find alumni without company info (but marked as working)
db.users.find({
  role: "alumni",
  isWorking: true,
  $or: [
    { companyName: { $exists: false } },
    { companyName: "" },
    { jobRole: { $exists: false } },
    { jobRole: "" },
  ],
});

// ========================================
// 9. DUPLICATE CHECK QUERIES
// ========================================

// Find duplicate emails
db.users.aggregate([
  {
    $group: {
      _id: "$email",
      count: { $sum: 1 },
      users: { $push: { _id: "$_id", fullName: "$fullName" } },
    },
  },
  {
    $match: { count: { $gt: 1 } },
  },
]);

// ========================================
// 10. PERFORMANCE QUERIES
// ========================================

// Check indexes
db.users.getIndexes();

// Explain query performance
db.users.find({ email: "test@example.com" }).explain("executionStats");

// ========================================
// 11. USEFUL AGGREGATION PIPELINES
// ========================================

// Student-Alumni ratio by college
db.users.aggregate([
  {
    $group: {
      _id: "$college",
      students: {
        $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] },
      },
      alumni: {
        $sum: { $cond: [{ $eq: ["$role", "alumni"] }, 1, 0] },
      },
      total: { $sum: 1 },
    },
  },
  {
    $project: {
      college: "$_id",
      students: 1,
      alumni: 1,
      total: 1,
      studentPercentage: {
        $multiply: [{ $divide: ["$students", "$total"] }, 100],
      },
      alumniPercentage: {
        $multiply: [{ $divide: ["$alumni", "$total"] }, 100],
      },
    },
  },
  { $sort: { total: -1 } },
]);

// Monthly registration trends
db.users.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      },
      registrations: { $sum: 1 },
      students: {
        $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] },
      },
      alumni: {
        $sum: { $cond: [{ $eq: ["$role", "alumni"] }, 1, 0] },
      },
    },
  },
  {
    $sort: { "_id.year": -1, "_id.month": -1 },
  },
]);

// ========================================
// 12. CLEANUP QUERIES (USE WITH CAUTION)
// ========================================

// Find inactive users (no login in 30 days)
db.users.find(
  {
    $or: [
      { lastLogin: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      { lastLogin: { $exists: false } },
    ],
  },
  {
    fullName: 1,
    email: 1,
    lastLogin: 1,
    createdAt: 1,
  }
);

// Count users by activity status
db.users.aggregate([
  {
    $project: {
      fullName: 1,
      email: 1,
      isActive: 1,
      daysSinceLastLogin: {
        $cond: {
          if: { $ne: ["$lastLogin", null] },
          then: {
            $divide: [
              { $subtract: [new Date(), "$lastLogin"] },
              1000 * 60 * 60 * 24,
            ],
          },
          else: null,
        },
      },
    },
  },
  {
    $group: {
      _id: {
        $switch: {
          branches: [
            {
              case: { $eq: ["$daysSinceLastLogin", null] },
              then: "Never logged in",
            },
            {
              case: { $lte: ["$daysSinceLastLogin", 1] },
              then: "Active (last 24h)",
            },
            {
              case: { $lte: ["$daysSinceLastLogin", 7] },
              then: "Recent (last week)",
            },
            {
              case: { $lte: ["$daysSinceLastLogin", 30] },
              then: "Inactive (last month)",
            },
          ],
          default: "Dormant (30+ days)",
        },
      },
      count: { $sum: 1 },
    },
  },
]);

// ========================================
// END OF QUERIES
// ========================================

/*
NOTES:
1. Replace 'uniconnect' with your actual database name
2. These queries assume the default collection name 'users'
3. Add .pretty() to any find() query for better formatting
4. Use .limit(N) to limit results for large datasets
5. Always test update/delete queries on a backup first
6. Consider adding indexes for frequently queried fields:
   - db.users.createIndex({ email: 1 })
   - db.users.createIndex({ college: 1, branch: 1 })
   - db.users.createIndex({ role: 1, year: 1 })
   - db.users.createIndex({ createdAt: -1 })
*/
