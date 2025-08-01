import React, { useState, useEffect } from "react";
import { jobAPI } from "../../utils/api";
import { useTheme } from "../../contexts/ThemeContext";

const UnifiedJobs = ({ userRole = "student" }) => {
  const { isDarkMode } = useTheme();
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [myPostedJobs, setMyPostedJobs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    salary: "",
    company: "",
    jobType: "",
    branch: "",
    workplaceType: "",
  });

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Get all jobs
      const allJobsResponse = await jobAPI.getJobs({
        search: searchTerm,
        type: filters.jobType,
        location: filters.location,
        branch: filters.branch,
        workplaceType: filters.workplaceType,
      });

      // Get jobs posted by me (for alumni)
      if (userRole === "alumni") {
        const myJobsResponse = await jobAPI.getJobs({
          search: searchTerm,
          postedByMe: true,
        });
        setMyPostedJobs(myJobsResponse.jobs || []);
      }

      setJobs(allJobsResponse.jobs || []);
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

  const handleApply = async (id) => {
    try {
      await jobAPI.applyForJob(id);
      await fetchJobs();
      setNotification({
        type: "success",
        message: "Successfully applied for the job!",
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Error applying for job:", err);
      setNotification({
        type: "error",
        message: err.message || "Failed to apply for job. Please try again.",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleWithdraw = async (id) => {
    try {
      await jobAPI.withdrawApplication(id);
      await fetchJobs();
      setNotification({
        type: "success",
        message: "Successfully withdrew your application!",
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Error withdrawing application:", err);
      setNotification({
        type: "error",
        message:
          err.message || "Failed to withdraw application. Please try again.",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handlePostJob = async () => {
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      const defaultJobData = {
        title: "Software Engineer",
        description:
          "We're looking for a talented software engineer to join our team. You will work on exciting projects and collaborate with experienced developers.",
        company: "Your Company",
        location: "Remote",
        type: "Full-time",
        branch: "Computer Science",
        contactEmail: "hr@yourcompany.com",
        requirements: [
          "3+ years experience",
          "Strong coding skills",
          "Team collaboration",
        ],
        technologies: ["JavaScript", "React", "Node.js"],
        salary: { min: 800000, max: 1500000, currency: "INR" },
        experienceRequired: { min: 3, max: 5, unit: "years" },
        applicationDeadline: expirationDate.toISOString(),
        expiresAt: expirationDate.toISOString(),
        workplaceType: "hybrid",
        status: "open",
        isRemote: true,
      };

      console.log("🚀 Attempting to create job with data:", defaultJobData);

      const result = await jobAPI.createJob(defaultJobData);
      console.log("✅ Job created successfully:", result);

      setNotification({
        type: "success",
        message: "Job posted successfully! You can now edit the details.",
      });
      setTimeout(() => setNotification(null), 5000);
      await fetchJobs();
    } catch (err) {
      console.error("❌ Error posting job:", err);

      // Enhanced error debugging
      console.log("Error details:", {
        name: err.name,
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
        stack: err.stack,
      });

      // Check user data for debugging
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("👤 Current user:", {
        role: user.role,
        hasToken: !!user.token,
        isDemo: user?.isDemo,
      });

      let errorMessage = "Unknown error occurred";
      if (err.message.includes("Backend server is not running")) {
        errorMessage =
          "Backend server is not running. Please start the server first.";
      } else if (
        err.message.includes("401") ||
        err.message.includes("Unauthorized")
      ) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (
        err.message.includes("403") ||
        err.message.includes("Insufficient permissions")
      ) {
        errorMessage =
          "You need alumni access to post jobs. Please log in as an alumni.";
      } else if (err.message.includes("Validation failed")) {
        errorMessage = `Validation error: ${err.message}`;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = err.message;
      }

      setNotification({
        type: "error",
        message: errorMessage,
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const getFilteredJobs = () => {
    const allJobs = activeTab === "posted" ? myPostedJobs : jobs;

    return allJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.technologies &&
          job.technologies.some((tech) =>
            tech.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const matchesFilters =
        (!filters.location ||
          job.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (!filters.experience || job.experience === filters.experience) &&
        (!filters.company ||
          job.company.toLowerCase().includes(filters.company.toLowerCase())) &&
        (!filters.jobType || job.type === filters.jobType) &&
        (!filters.branch || job.branch === filters.branch) &&
        (!filters.workplaceType || job.workplaceType === filters.workplaceType);

      if (activeTab === "all") return matchesSearch && matchesFilters;
      if (activeTab === "applied")
        return matchesSearch && matchesFilters && job.isApplied;
      if (activeTab === "posted") return matchesSearch && matchesFilters;
      return matchesSearch && matchesFilters && job.status === activeTab;
    });
  };

  const renderJobCard = (job) => (
    <div
      key={job.id || job._id}
      className={`${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border rounded-lg p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{job.logo || "💼"}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                {job.title}
              </h3>
              <p className="text-lg text-blue-600 font-semibold">
                {job.company}
              </p>
              <div className="flex items-center space-x-4 mt-1">
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                  📍 {job.location}
                </span>
                {job.remote && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Remote
                  </span>
                )}
                {job.applicants && (
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                    👥 {job.applicants} applicants
                  </span>
                )}
              </div>
            </div>
          </div>

          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } mb-4`}>
            {job.description}
          </p>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                Type
              </p>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}>
                {job.type}
              </p>
            </div>
            {job.branch && (
              <div>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                  Branch
                </p>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}>
                  {job.branch}
                </p>
              </div>
            )}
            {job.workplaceType && (
              <div>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                  Work Type
                </p>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}>
                  {job.workplaceType}
                </p>
              </div>
            )}
            {job.salary && (
              <div>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                  Salary
                </p>
                <p className="text-sm font-medium text-green-600">
                  {typeof job.salary === "string"
                    ? job.salary
                    : `₹${job.salary.min / 100000}-${
                        job.salary.max / 100000
                      } LPA`}
                </p>
              </div>
            )}
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-4">
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } mb-2`}>
                Requirements
              </p>
              <ul
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } space-y-1`}>
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            {userRole === "student" && !job.isMyPosting && (
              <>
                {job.isApplied ? (
                  <button
                    onClick={() => handleWithdraw(job.id || job._id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                    Withdraw
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(job.id || job._id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    Apply Now
                  </button>
                )}
              </>
            )}

            {userRole === "alumni" && job.isMyPosting && (
              <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                View Applications
              </button>
            )}

            <button
              className={`px-4 py-2 ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } text-gray-700 text-sm rounded-lg`}>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } rounded-lg shadow-md p-6`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}>
          Jobs & Internships
        </h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
            <span
              className={`absolute left-3 top-2.5 ${
                isDarkMode ? "text-gray-400" : "text-gray-400"
              }`}>
              🔍
            </span>
          </div>
          {userRole === "alumni" && (
            <button
              onClick={handlePostJob}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Post Job
            </button>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
          {notification.message}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {initialLoad ? "Loading jobs..." : "Updating jobs..."}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <select
          value={filters.location}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, location: e.target.value }))
          }
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}>
          <option value="">All Locations</option>
          <option value="bangalore">Bangalore</option>
          <option value="mumbai">Mumbai</option>
          <option value="hyderabad">Hyderabad</option>
          <option value="delhi">Delhi</option>
          <option value="remote">Remote</option>
        </select>

        <select
          value={filters.jobType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, jobType: e.target.value }))
          }
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}>
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <select
          value={filters.branch}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, branch: e.target.value }))
          }
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}>
          <option value="">All Branches</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
        </select>

        <select
          value={filters.workplaceType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, workplaceType: e.target.value }))
          }
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}>
          <option value="">All Work Types</option>
          <option value="onsite">Onsite</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <input
          type="text"
          placeholder="Company"
          value={filters.company}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, company: e.target.value }))
          }
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        />

        <button
          onClick={() =>
            setFilters({
              location: "",
              experience: "",
              salary: "",
              company: "",
              jobType: "",
              branch: "",
              workplaceType: "",
            })
          }
          className={`px-4 py-2 rounded-lg ${
            isDarkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}>
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
          ...(userRole === "student"
            ? [
                {
                  id: "applied",
                  label: "My Applications",
                  count: jobs.filter((j) => j.isApplied).length,
                },
              ]
            : []),
          ...(userRole === "alumni"
            ? [
                {
                  id: "posted",
                  label: "Posted by Me",
                  count: myPostedJobs.length,
                },
              ]
            : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : `${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`
            }`}>
            <span>{tab.label}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-blue-500"
                  : isDarkMode
                  ? "bg-gray-600"
                  : "bg-gray-300"
              }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {!loading && getFilteredJobs().length === 0 ? (
          <div
            className={`text-center py-12 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
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
    </div>
  );
};

export default UnifiedJobs;
