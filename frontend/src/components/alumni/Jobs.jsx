import React, { useState, useEffect } from "react";
import { jobAPI } from "../../utils/api";

const Jobs = () => {
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    salary: "",
    company: "",
    jobType: "",
  });

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // First get all jobs
      const allJobsResponse = await jobAPI.getJobs({
        search: searchTerm,
        type: filters.jobType,
        location: filters.location,
      });

      // Then get jobs posted by me
      const myJobsResponse = await jobAPI.getJobs({
        search: searchTerm,
        postedByMe: true,
      });

      setJobs(allJobsResponse.jobs || []);
      setMyPostedJobs(myJobsResponse.jobs || []);
      setError(null);
    } catch (err) {
      const errorMessage = err.message.includes("Backend server is not running")
        ? "Backend server is not running. Please start the server and try again."
        : "Failed to fetch jobs. Please try again later.";
      setError(errorMessage);
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Google",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₹25-35 LPA",
      description:
        "Lead development of scalable backend services and mentor junior developers.",
      requirements: [
        "Strong experience in Java/Python",
        "System design knowledge",
        "Leadership skills",
      ],
      technologies: ["Java", "Spring Boot", "Microservices", "AWS"],
      applicationDeadline: "2025-08-30",
      status: "available",
      isApplied: false,
      remote: true,
      logo: "🔍",
      postedDate: "2025-07-20",
      applicants: 245,
    },
    {
      id: 2,
      title: "Frontend Architect",
      company: "Microsoft",
      location: "Hyderabad, India",
      type: "Full-time",
      experience: "5-8 years",
      salary: "₹30-45 LPA",
      description:
        "Design and implement scalable frontend architectures for enterprise applications.",
      requirements: [
        "Expert in React/Angular",
        "Architecture experience",
        "Team leadership",
      ],
      technologies: ["React", "TypeScript", "Azure", "GraphQL"],
      applicationDeadline: "2025-08-25",
      status: "available",
      isApplied: true,
      remote: false,
      logo: "🪟",
      postedDate: "2025-07-18",
      applicants: 156,
    },
    {
      id: 3,
      title: "Data Science Manager",
      company: "Amazon",
      location: "Mumbai, India",
      type: "Full-time",
      experience: "4-7 years",
      salary: "₹28-40 LPA",
      description:
        "Lead data science initiatives and build recommendation systems for e-commerce.",
      requirements: [
        "Advanced ML/AI knowledge",
        "Team management",
        "Python expertise",
      ],
      technologies: ["Python", "TensorFlow", "AWS", "Spark"],
      applicationDeadline: "2025-07-25",
      status: "interviewing",
      isApplied: true,
      remote: false,
      logo: "📦",
      postedDate: "2025-07-10",
      applicants: 89,
      interviewDate: "2025-08-05",
    },
    {
      id: 4,
      title: "Product Manager",
      company: "Flipkart",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "3-6 years",
      salary: "₹22-32 LPA",
      description:
        "Drive product strategy and collaborate with engineering teams.",
      requirements: [
        "Product management experience",
        "Data-driven approach",
        "Strategic thinking",
      ],
      technologies: ["Analytics", "A/B Testing", "Product Strategy", "SQL"],
      applicationDeadline: "2025-06-30",
      status: "closed",
      isApplied: true,
      remote: false,
      logo: "🛒",
      postedDate: "2025-06-15",
      applicants: 312,
      result: "Offer Received",
    },
  ]);

  const [myPostedJobs, setMyPostedJobs] = useState([
    {
      id: 5,
      title: "Junior Software Developer",
      company: "My Company",
      location: "Remote",
      type: "Full-time",
      experience: "0-2 years",
      salary: "₹8-12 LPA",
      description: "Looking for fresh graduates to join our development team.",
      requirements: [
        "Good programming fundamentals",
        "Willingness to learn",
        "Team player",
      ],
      technologies: ["JavaScript", "React", "Node.js", "MongoDB"],
      applicationDeadline: "2025-09-15",
      status: "available",
      remote: true,
      logo: "🏢",
      postedDate: "2025-07-25",
      applicants: 67,
      isMyPosting: true,
    },
  ]);

  const handleApply = async (id) => {
    try {
      await jobAPI.applyForJob(id);
      await fetchJobs(); // Refresh jobs list
      alert("Successfully applied for the job!");
    } catch (err) {
      console.error("Error applying for job:", err);
      alert(err.message || "Failed to apply for job. Please try again.");
    }
  };

  const handleWithdraw = async (id) => {
    try {
      await jobAPI.withdrawApplication(id);
      await fetchJobs(); // Refresh jobs list
      alert("Successfully withdrew your application!");
    } catch (err) {
      console.error("Error withdrawing application:", err);
      alert(err.message || "Failed to withdraw application. Please try again.");
    }
  };

  const handlePostJob = async () => {
    try {
      // Create a date 30 days from now
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      const defaultJobData = {
        title: "Software Engineer",
        description:
          "We're looking for a talented software engineer to join our team. You will work on exciting projects and collaborate with experienced developers.",
        company: "Your Company",
        location: "Remote",
        type: "Full-time",
        requirements: [
          "3+ years experience",
          "Strong coding skills",
          "Team collaboration",
        ],
        technologies: ["JavaScript", "React", "Node.js"],
        salary: { min: 800000, max: 1500000, currency: "INR" },
        experienceRequired: { min: 3, max: 5, unit: "years" },
        applicationDeadline: expirationDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        expiresAt: expirationDate.toISOString(), // Full ISO string for backend
        workplaceType: "hybrid",
        status: "open",
        remote: true,
      };

      const result = await jobAPI.createJob(defaultJobData);
      alert("Job posted successfully! You can now edit the details.");
      await fetchJobs(); // Refresh jobs list
    } catch (err) {
      console.error("Error posting job:", err);
      const errorMessage = err.response?.data?.error || err.message;
      if (errorMessage.includes("expiresAt")) {
        alert(
          "Error with expiration date. Please try again or contact support."
        );
      } else {
        alert(errorMessage || "Failed to post job. Please try again.");
      }
    }
  };

  const handleEditJob = async (jobId) => {
    try {
      const job = await jobAPI.getJob(jobId);
      // For now, just update the status to show it works
      await jobAPI.updateJob(jobId, {
        ...job,
        status: job.status === "open" ? "closed" : "open",
      });
      alert("Job updated successfully!");
      await fetchJobs(); // Refresh jobs list
    } catch (err) {
      console.error("Error editing job:", err);
      alert(err.message || "Failed to edit job. Please try again.");
    }
  };

  const handleViewApplications = async (jobId) => {
    try {
      const { applications } = await jobAPI.getJobApplications(jobId);
      console.log("Applications:", applications);
      const summary = applications
        ? `Total Applications: ${applications.length}\n` +
          `Pending: ${
            applications.filter((app) => app.status === "pending").length
          }\n` +
          `Interviewing: ${
            applications.filter((app) => app.status === "interviewing").length
          }\n` +
          `Accepted: ${
            applications.filter((app) => app.status === "accepted").length
          }`
        : "No applications yet";
      alert(summary);
    } catch (err) {
      console.error("Error fetching applications:", err);
      alert(err.message || "Failed to fetch applications. Please try again.");
    }
  };

  const getAllJobs = () => [...jobs, ...myPostedJobs];

  const getFilteredJobs = () => {
    const allJobs = activeTab === "posted" ? myPostedJobs : jobs;

    return allJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.technologies.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilters =
        (!filters.location ||
          job.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (!filters.experience || job.experience === filters.experience) &&
        (!filters.company ||
          job.company.toLowerCase().includes(filters.company.toLowerCase())) &&
        (!filters.jobType || job.type === filters.jobType);

      if (activeTab === "all") return matchesSearch && matchesFilters;
      if (activeTab === "applied")
        return matchesSearch && matchesFilters && job.isApplied;
      if (activeTab === "posted") return matchesSearch && matchesFilters;
      return matchesSearch && matchesFilters && job.status === activeTab;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "interviewing":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isApplicationOpen = (job) => {
    const deadline = new Date(job.applicationDeadline);
    const now = new Date();
    return deadline > now && job.status === "available";
  };

  const renderJobCard = (job) => (
    <div
      key={job.id}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{job.logo}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <p className="text-lg text-blue-600 font-semibold">
                {job.company}
              </p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600">📍 {job.location}</span>
                {job.remote && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Remote
                  </span>
                )}
                <span className="text-sm text-gray-600">
                  👥 {job.applicants} applicants
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  job.status
                )}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              {job.isApplied && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Applied
                </span>
              )}
              {job.result && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {job.result}
                </span>
              )}
              {job.isMyPosting && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Your Posting
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4">{job.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <p className="text-sm font-medium">{job.experience}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Salary</p>
              <p className="text-sm font-medium text-green-600">{job.salary}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm font-medium">{job.type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Posted</p>
              <p className="text-sm font-medium">
                {new Date(job.postedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Technologies</p>
            <div className="flex flex-wrap gap-2">
              {job.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Requirements</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {job.status === "available" && (
                <span>
                  Apply by:{" "}
                  {new Date(job.applicationDeadline).toLocaleDateString()}
                </span>
              )}
              {job.interviewDate && (
                <span className="ml-4 text-blue-600">
                  Interview: {new Date(job.interviewDate).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              {!job.isMyPosting && job.status === "available" && (
                <>
                  {job.isApplied ? (
                    <button
                      onClick={() => handleWithdraw(job.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                      Withdraw
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={!isApplicationOpen(job)}
                      className={`px-4 py-2 text-sm rounded-lg ${
                        isApplicationOpen(job)
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}>
                      {isApplicationOpen(job)
                        ? "Apply Now"
                        : "Applications Closed"}
                    </button>
                  )}
                </>
              )}

              {job.isMyPosting && (
                <>
                  <button
                    onClick={() => handleEditJob(job.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    Edit Job
                  </button>
                  <button
                    onClick={() => handleViewApplications(job.id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                    View Applications
                  </button>
                </>
              )}

              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                View Details
              </button>

              {!job.isMyPosting && (
                <button className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm rounded-lg hover:bg-yellow-200">
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Jobs</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <button
            onClick={handlePostJob}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Post Job
          </button>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">
            {initialLoad ? "Loading jobs..." : "Updating jobs..."}
          </p>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && myPostedJobs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>
          <p className="text-gray-600 mb-4">
            {activeTab === "posted"
              ? "You haven't posted any jobs yet. Start posting to find great candidates!"
              : "No jobs available right now. Check back later or adjust your filters."}
          </p>
          {activeTab === "posted" && (
            <button
              onClick={handlePostJob}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Post Your First Job
            </button>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <select
          value={filters.location}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, location: e.target.value }))
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Locations</option>
          <option value="bangalore">Bangalore</option>
          <option value="mumbai">Mumbai</option>
          <option value="hyderabad">Hyderabad</option>
          <option value="delhi">Delhi</option>
          <option value="remote">Remote</option>
        </select>

        <select
          value={filters.experience}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, experience: e.target.value }))
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Experience</option>
          <option value="0-2 years">0-2 years</option>
          <option value="3-5 years">3-5 years</option>
          <option value="5-8 years">5-8 years</option>
          <option value="8+ years">8+ years</option>
        </select>

        <select
          value={filters.jobType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, jobType: e.target.value }))
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
        </select>

        <input
          type="text"
          placeholder="Company"
          value={filters.company}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, company: e.target.value }))
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() =>
            setFilters({
              location: "",
              experience: "",
              salary: "",
              company: "",
              jobType: "",
            })
          }
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          Clear Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 overflow-x-auto">
        {[
          { id: "all", label: "All Jobs", count: jobs.length },
          {
            id: "available",
            label: "Available",
            count: jobs.filter((j) => j.status === "available").length,
          },
          {
            id: "interviewing",
            label: "Interviewing",
            count: jobs.filter((j) => j.status === "interviewing").length,
          },
          {
            id: "applied",
            label: "My Applications",
            count: jobs.filter((j) => j.isApplied).length,
          },
          { id: "posted", label: "Posted by Me", count: myPostedJobs.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            <span>{tab.label}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id ? "bg-blue-500" : "bg-gray-300"
              }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {getFilteredJobs().length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <span className="text-6xl mb-4 block">💼</span>
            <p className="text-xl mb-2">No jobs found</p>
            <p className="text-sm">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "Try adjusting your search or filters"
                : activeTab === "posted"
                ? "Start posting jobs to help others find opportunities"
                : "Check back later for new opportunities"}
            </p>
          </div>
        ) : (
          getFilteredJobs().map(renderJobCard)
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Your Job Activity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {jobs.filter((j) => j.isApplied).length}
            </p>
            <p className="text-sm text-gray-600">Applications</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {
                jobs.filter((j) => j.status === "interviewing" && j.isApplied)
                  .length
              }
            </p>
            <p className="text-sm text-gray-600">Interviews</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {jobs.filter((j) => j.result).length}
            </p>
            <p className="text-sm text-gray-600">Offers</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {myPostedJobs.length}
            </p>
            <p className="text-sm text-gray-600">Jobs Posted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
