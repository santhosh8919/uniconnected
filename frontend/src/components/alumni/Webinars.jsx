import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Webinars = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "60",
    maxAttendees: "100",
    category: "",
    meetingLink: "",
    isRecorded: false,
    tags: "",
  });

  const [webinars, setWebinars] = useState([
    {
      id: 1,
      title: "System Design Fundamentals",
      description:
        "Learn the basics of system design including scalability, load balancing, and microservices architecture.",
      date: "2025-08-05",
      time: "18:00",
      duration: 90,
      attendees: 45,
      maxAttendees: 100,
      category: "Engineering",
      status: "upcoming",
      tags: ["System Design", "Architecture", "Scalability"],
      meetingLink: "https://meet.google.com/abc-defg-hij",
      isRecorded: true,
      host: "John Smith",
      registrations: 67,
    },
    {
      id: 2,
      title: "Career Transition: From Student to Tech Professional",
      description:
        "A comprehensive guide on transitioning from college to your first tech job, including interview preparation and workplace culture.",
      date: "2025-08-12",
      time: "19:30",
      duration: 60,
      attendees: 0,
      maxAttendees: 150,
      category: "Career",
      status: "upcoming",
      tags: ["Career", "Interview", "Professional Development"],
      meetingLink: "https://zoom.us/j/123456789",
      isRecorded: true,
      host: "Sarah Johnson",
      registrations: 89,
    },
    {
      id: 3,
      title: "Introduction to Machine Learning",
      description:
        "Explore the fundamentals of ML algorithms, data preprocessing, and real-world applications in industry.",
      date: "2025-07-20",
      time: "17:00",
      duration: 120,
      attendees: 78,
      maxAttendees: 80,
      category: "Technology",
      status: "completed",
      tags: ["Machine Learning", "AI", "Data Science"],
      meetingLink: "https://meet.google.com/xyz-uvwx-abc",
      isRecorded: true,
      host: "Dr. Michael Chen",
      registrations: 78,
      recording: "https://drive.google.com/file/d/recording123",
      rating: 4.8,
      feedback: 52,
    },
    {
      id: 4,
      title: "Startup Ecosystem and Entrepreneurship",
      description:
        "Understanding the startup landscape, funding options, and building MVP with limited resources.",
      date: "2025-07-15",
      time: "20:00",
      duration: 75,
      attendees: 65,
      maxAttendees: 100,
      category: "Business",
      status: "completed",
      tags: ["Startup", "Entrepreneurship", "Funding"],
      meetingLink: "https://teams.microsoft.com/l/meetup-join/abc123",
      isRecorded: true,
      host: "Priya Sharma",
      registrations: 65,
      recording: "https://drive.google.com/file/d/recording456",
      rating: 4.6,
      feedback: 38,
    },
  ]);

  const categories = [
    "Engineering",
    "Career",
    "Technology",
    "Business",
    "Design",
    "Marketing",
    "Data Science",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateWebinar = (e) => {
    e.preventDefault();
    const newWebinar = {
      id: Date.now(),
      ...formData,
      attendees: 0,
      registrations: 0,
      status: "upcoming",
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      host: "Current User", // This would come from auth context
    };

    setWebinars((prev) => [newWebinar, ...prev]);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "60",
      maxAttendees: "100",
      category: "",
      meetingLink: "",
      isRecorded: false,
      tags: "",
    });
    setShowCreateForm(false);
  };

  const filteredWebinars = webinars.filter((webinar) => {
    if (activeTab === "upcoming") return webinar.status === "upcoming";
    if (activeTab === "completed") return webinar.status === "completed";
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-bold ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}>
          Webinars
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <span>📅</span>
          <span>Create Webinar</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {[
          { key: "upcoming", label: "Upcoming", icon: "📅" },
          { key: "completed", label: "Completed", icon: "✅" },
          { key: "all", label: "All", icon: "📋" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.key
                ? `${
                    isDarkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  } font-medium`
                : `${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
            }`}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Create Webinar Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-xl font-bold ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}>
                Create New Webinar
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className={`${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                } text-xl`}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateWebinar} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}>
                  Webinar Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter webinar title"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className={`w-full px-3 py-2 border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Describe your webinar content"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Duration (minutes) *
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Max Attendees *
                  </label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="1000"
                    className={`w-full px-3 py-2 border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}>
                  Meeting Link *
                </label>
                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://meet.google.com/your-meeting-link"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="React, JavaScript, Frontend"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRecorded"
                  checked={formData.isRecorded}
                  onChange={handleInputChange}
                  className={`mr-2 ${
                    isDarkMode ? "text-blue-500" : "text-blue-600"
                  }`}
                />
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                  Record this webinar for future viewing
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } transition-colors`}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Webinar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Webinar List */}
      <div className="space-y-4">
        {filteredWebinars.length === 0 ? (
          <div
            className={`text-center py-8 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
            <div className="text-4xl mb-2">📅</div>
            <p>No webinars found for this category.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
              Create your first webinar
            </button>
          </div>
        ) : (
          filteredWebinars.map((webinar) => (
            <div
              key={webinar.id}
              className={`${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              } border rounded-lg p-6 hover:shadow-md transition-shadow`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3
                      className={`text-lg font-semibold ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}>
                      {webinar.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        webinar.status === "upcoming"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                      {webinar.status}
                    </span>
                  </div>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } mb-3`}>
                    {webinar.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {webinar.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 ${
                          isDarkMode
                            ? "bg-blue-900 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                        } rounded-full text-xs`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📅</span>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}>
                      {formatDate(webinar.date)}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                      {formatTime(webinar.time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">⏱️</span>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}>
                      {webinar.duration} minutes
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                      Duration
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">👥</span>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}>
                      {webinar.registrations}/{webinar.maxAttendees}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                      Registered
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">🎯</span>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}>
                      {webinar.category}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                      Category
                    </p>
                  </div>
                </div>
              </div>

              {webinar.status === "completed" && webinar.rating && (
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}>
                      {webinar.rating}/5
                    </span>
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                      ({webinar.feedback} reviews)
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                    Hosted by {webinar.host}
                  </span>
                  {webinar.isRecorded && (
                    <span
                      className={`px-2 py-1 ${
                        isDarkMode
                          ? "bg-purple-900 text-purple-300"
                          : "bg-purple-100 text-purple-700"
                      } rounded-full text-xs`}>
                      📹 Recorded
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  {webinar.status === "upcoming" && (
                    <>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm">
                        Start
                      </button>
                    </>
                  )}
                  {webinar.status === "completed" && webinar.recording && (
                    <a
                      href={webinar.recording}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm">
                      View Recording
                    </a>
                  )}
                  <button
                    className={`px-3 py-1 ${
                      isDarkMode
                        ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } rounded transition-colors text-sm`}>
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Webinars;
