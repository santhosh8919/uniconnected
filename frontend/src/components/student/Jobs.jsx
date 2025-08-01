import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import useJobs from "../../hooks/useJobs";

const AddJobModal = ({ isOpen, onClose, onSubmit, isDarkMode }) => {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    branch: "",
    type: "",
    workplaceType: "",
    location: "",
    contactEmail: "",
    applyLink: "",
    company: "",
    requirements: [""],
    salary: { min: 0, max: 0, currency: "INR" },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(jobData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <h2
          className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
          Post a New Job
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}>
              Job Title
            </label>
            <input
              type="text"
              value={jobData.title}
              onChange={(e) =>
                setJobData({ ...jobData, title: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>
          <div>
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}>
              Description
            </label>
            <textarea
              value={jobData.description}
              onChange={(e) =>
                setJobData({ ...jobData, description: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              rows="4"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}>
                Branch/Stream
              </label>
              <select
                value={jobData.branch}
                onChange={(e) =>
                  setJobData({ ...jobData, branch: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required>
                <option value="">Select Branch</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Chemical">Chemical</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}>
                Job Type
              </label>
              <select
                value={jobData.type}
                onChange={(e) =>
                  setJobData({ ...jobData, type: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required>
                <option value="">Select Type</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}>
                Location Type
              </label>
              <select
                value={jobData.workplaceType}
                onChange={(e) =>
                  setJobData({ ...jobData, workplaceType: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required>
                <option value="">Select Location Type</option>
                <option value="onsite">Onsite</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}>
                Location
              </label>
              <input
                type="text"
                value={jobData.location}
                onChange={(e) =>
                  setJobData({ ...jobData, location: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}>
                Contact Email
              </label>
              <input
                type="email"
                value={jobData.contactEmail}
                onChange={(e) =>
                  setJobData({ ...jobData, contactEmail: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>
            <div>
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}>
                Apply Link (Optional)
              </label>
              <input
                type="url"
                value={jobData.applyLink}
                onChange={(e) =>
                  setJobData({ ...jobData, applyLink: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}>
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JobCard = ({ job, onApply, userRole }) => {
  const { isDarkMode } = useTheme();
  const formatSalary = (min, max, currency = "INR") => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md mb-4`}>
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
            {job.title}
          </h3>
          <p
            className={`mt-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
            {job.company} • {job.location}
          </p>
          <div className="flex gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                job.type === "Full-time"
                  ? "bg-green-100 text-green-800"
                  : job.type === "Part-time"
                  ? "bg-blue-100 text-blue-800"
                  : job.type === "Internship"
                  ? "bg-purple-100 text-purple-800"
                  : job.type === "Contract"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
              {job.type}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                job.workplaceType === "remote"
                  ? "bg-teal-100 text-teal-800"
                  : job.workplaceType === "hybrid"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
              {job.workplaceType.charAt(0).toUpperCase() +
                job.workplaceType.slice(1)}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
              {job.branch}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h4
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}>
          Requirements:
        </h4>
        <ul
          className={`mt-2 list-disc list-inside ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <span className="font-medium">Salary Range: </span>
          {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
          Posted by {job.postedBy.fullName} •{" "}
          {new Date(job.createdAt).toLocaleDateString()}
        </div>
        {userRole === "student" && (
          <button
            onClick={() => onApply(job._id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

const JobFilters = ({ filters, onChange, isDarkMode }) => (
  <div
    className={`p-6 ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    } rounded-lg shadow-md mb-6`}>
    <h3
      className={`text-lg font-semibold mb-4 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}>
      Filters
    </h3>

    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>

      <div>
        <select
          value={filters.branch}
          onChange={(e) => onChange({ ...filters, branch: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}>
          <option value="">All Branches</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
          <option value="Chemical">Chemical</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}>
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      <div>
        <select
          value={filters.workplaceType}
          onChange={(e) =>
            onChange({ ...filters, workplaceType: e.target.value })
          }
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}>
          <option value="">All Locations</option>
          <option value="onsite">Onsite</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <div>
        <input
          type="text"
          placeholder="Location..."
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    </div>
  </div>
);

const Jobs = () => {
  const { isDarkMode } = useTheme();
  const [userRole, setUserRole] = useState(null);
  const [notification, setNotification] = useState(null);
  const [myApplications, setMyApplications] = useState(new Set());
  const [showAddJobModal, setShowAddJobModal] = useState(false);

  const {
    jobs,
    loading,
    error,
    filters,
    setFilters,
    applyForJob,
    getMyApplications,
  } = useJobs();

  useEffect(() => {
    // Get user role from localStorage and load applications
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.role);
    loadMyApplications();
  }, []);

  const loadMyApplications = async () => {
    try {
      const applications = await getMyApplications();
      setMyApplications(new Set(applications.map((app) => app.job._id)));
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await applyForJob(jobId);
      setMyApplications((prev) => new Set([...prev, jobId]));
      setNotification({
        type: "success",
        message: "Successfully applied for the job!",
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Error applying for job:", error);
      setNotification({
        type: "error",
        message:
          error.message || "Failed to apply for the job. Please try again.",
      });
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      // Add the job using the API
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...jobData,
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days from now
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post job");
      }

      setNotification({
        type: "success",
        message: "Job posted successfully! Students can now apply.",
      });

      // Refresh the jobs list
      window.location.reload();
    } catch (error) {
      console.error("Error posting job:", error);
      setNotification({
        type: "error",
        message: error.message || "Failed to post job. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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

      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-3xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
          Jobs & Internships
        </h1>
        <div className="flex space-x-3">
          {userRole === "alumni" && (
            <button
              onClick={() => setShowAddJobModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2">
              <span>💼</span>
              <span>Post New Job</span>
            </button>
          )}
          <button
            onClick={loadMyApplications}
            className={`px-4 py-2 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } text-gray-700 rounded-lg focus:outline-none flex items-center space-x-2`}>
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {showAddJobModal && (
        <AddJobModal
          isOpen={showAddJobModal}
          onClose={() => setShowAddJobModal(false)}
          onSubmit={handleAddJob}
          isDarkMode={isDarkMode}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <JobFilters
            filters={filters}
            onChange={setFilters}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div
              className={`p-4 rounded-lg ${
                isDarkMode
                  ? "bg-red-900 text-red-200"
                  : "bg-red-100 text-red-800"
              }`}>
              {error}
            </div>
          ) : jobs.length === 0 ? (
            <div
              className={`text-center py-12 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-xl font-semibold">No jobs found</p>
              <p className="mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApply={handleApply}
                  userRole={userRole}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
