import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Alumni = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("webinars");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [registeredWebinars, setRegisteredWebinars] = useState([1, 3]); // IDs of registered webinars

  // Sample alumni webinars data
  const [webinars, setWebinars] = useState([
    {
      id: 1,
      title: "System Design Fundamentals",
      description:
        "Learn the basics of system design including scalability, load balancing, and microservices architecture. Perfect for students preparing for tech interviews.",
      date: "2025-08-05",
      time: "18:00",
      duration: 90,
      maxAttendees: 100,
      registrations: 67,
      category: "Engineering",
      status: "upcoming",
      tags: ["System Design", "Architecture", "Scalability", "Interview Prep"],
      meetingLink: "https://meet.google.com/abc-defg-hij",
      isRecorded: true,
      host: {
        name: "John Smith",
        company: "Google",
        role: "Senior Software Engineer",
        avatar: "JS",
        experience: "5+ years",
        linkedIn: "https://linkedin.com/in/johnsmith",
      },
      prerequisites: "Basic programming knowledge",
      targetAudience: "Final year students, Recent graduates",
      rating: null,
      feedback: 0,
    },
    {
      id: 2,
      title: "Career Transition: From Student to Tech Professional",
      description:
        "A comprehensive guide on transitioning from college to your first tech job, including interview preparation, resume building, and workplace culture adaptation.",
      date: "2025-08-12",
      time: "19:30",
      duration: 60,
      maxAttendees: 150,
      registrations: 89,
      category: "Career",
      status: "upcoming",
      tags: ["Career", "Interview", "Professional Development", "Resume"],
      meetingLink: "https://zoom.us/j/123456789",
      isRecorded: true,
      host: {
        name: "Sarah Johnson",
        company: "Microsoft",
        role: "Product Manager",
        avatar: "SJ",
        experience: "7+ years",
        linkedIn: "https://linkedin.com/in/sarahjohnson",
      },
      prerequisites: "None",
      targetAudience: "All students, Fresh graduates",
      rating: null,
      feedback: 0,
    },
    {
      id: 3,
      title: "Introduction to Machine Learning",
      description:
        "Explore the fundamentals of ML algorithms, data preprocessing, and real-world applications in industry. Hands-on examples included.",
      date: "2025-07-20",
      time: "17:00",
      duration: 120,
      maxAttendees: 80,
      registrations: 78,
      category: "Technology",
      status: "completed",
      tags: ["Machine Learning", "AI", "Data Science", "Python"],
      meetingLink: "https://meet.google.com/xyz-uvwx-abc",
      isRecorded: true,
      host: {
        name: "Dr. Michael Chen",
        company: "Tesla",
        role: "ML Research Scientist",
        avatar: "MC",
        experience: "8+ years",
        linkedIn: "https://linkedin.com/in/michaelchen",
      },
      prerequisites: "Python programming, Basic statistics",
      targetAudience: "CS students, Data enthusiasts",
      recording: "https://drive.google.com/file/d/recording123",
      rating: 4.8,
      feedback: 52,
    },
    {
      id: 4,
      title: "Startup Ecosystem and Entrepreneurship",
      description:
        "Understanding the startup landscape, funding options, building MVP with limited resources, and scaling your business idea.",
      date: "2025-07-15",
      time: "20:00",
      duration: 75,
      maxAttendees: 100,
      registrations: 65,
      category: "Business",
      status: "completed",
      tags: ["Startup", "Entrepreneurship", "Funding", "MVP"],
      meetingLink: "https://teams.microsoft.com/l/meetup-join/abc123",
      isRecorded: true,
      host: {
        name: "Priya Sharma",
        company: "Flipkart",
        role: "VP of Strategy",
        avatar: "PS",
        experience: "10+ years",
        linkedIn: "https://linkedin.com/in/priyasharma",
      },
      prerequisites: "Basic business understanding",
      targetAudience: "Aspiring entrepreneurs, Final year students",
      recording: "https://drive.google.com/file/d/recording456",
      rating: 4.6,
      feedback: 38,
    },
    {
      id: 5,
      title: "Frontend Development Best Practices",
      description:
        "Modern frontend development techniques, React ecosystem, performance optimization, and building scalable web applications.",
      date: "2025-08-18",
      time: "16:00",
      duration: 90,
      maxAttendees: 120,
      registrations: 45,
      category: "Engineering",
      status: "upcoming",
      tags: ["React", "Frontend", "JavaScript", "Performance"],
      meetingLink: "https://meet.google.com/frontend-session",
      isRecorded: true,
      host: {
        name: "Alex Rodriguez",
        company: "Netflix",
        role: "Senior Frontend Engineer",
        avatar: "AR",
        experience: "6+ years",
        linkedIn: "https://linkedin.com/in/alexrodriguez",
      },
      prerequisites: "HTML, CSS, JavaScript basics",
      targetAudience: "Web development students, Frontend beginners",
      rating: null,
      feedback: 0,
    },
  ]);

  const categories = [
    "all",
    "Engineering",
    "Career",
    "Technology",
    "Business",
    "Design",
  ];

  const handleRegister = (webinarId) => {
    if (registeredWebinars.includes(webinarId)) {
      setRegisteredWebinars((prev) => prev.filter((id) => id !== webinarId));
    } else {
      setRegisteredWebinars((prev) => [...prev, webinarId]);
      // Update registrations count
      setWebinars((prev) =>
        prev.map((webinar) =>
          webinar.id === webinarId
            ? { ...webinar, registrations: webinar.registrations + 1 }
            : webinar
        )
      );
    }
  };

  const filteredWebinars = webinars.filter((webinar) => {
    const matchesSearch =
      webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webinar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webinar.host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      webinar.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || webinar.category === selectedCategory;

    if (activeTab === "upcoming")
      return webinar.status === "upcoming" && matchesSearch && matchesCategory;
    if (activeTab === "completed")
      return webinar.status === "completed" && matchesSearch && matchesCategory;
    if (activeTab === "registered")
      return (
        registeredWebinars.includes(webinar.id) &&
        matchesSearch &&
        matchesCategory
      );

    return matchesSearch && matchesCategory;
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
        <div>
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}>
            Alumni Knowledge Hub
          </h2>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } mt-1`}>
            Learn from experienced alumni through webinars and sessions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎓</span>
          <span
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
            {filteredWebinars.length} sessions available
          </span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search webinars, topics, or alumni..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <span
            className={`absolute left-3 top-2.5 ${
              isDarkMode ? "text-gray-400" : "text-gray-400"
            }`}>
            🔍
          </span>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`px-4 py-2 border ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-gray-900"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {[
          { key: "webinars", label: "All Webinars", icon: "📹" },
          { key: "upcoming", label: "Upcoming", icon: "📅" },
          { key: "completed", label: "Recordings", icon: "🎬" },
          { key: "registered", label: "My Registrations", icon: "✅" },
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
            {tab.key === "registered" && registeredWebinars.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {registeredWebinars.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Webinar List */}
      <div className="space-y-6">
        {filteredWebinars.length === 0 ? (
          <div
            className={`text-center py-12 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
            <div className="text-4xl mb-4">📚</div>
            <p className="text-lg mb-2">No webinars found</p>
            <p className="text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredWebinars.map((webinar) => (
            <div
              key={webinar.id}
              className={`${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              } border rounded-lg p-6 hover:shadow-lg transition-all duration-200`}>
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3
                      className={`text-xl font-semibold ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}>
                      {webinar.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        webinar.status === "upcoming"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                      {webinar.status}
                    </span>
                    {registeredWebinars.includes(webinar.id) && (
                      <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs">
                        ✓ Registered
                      </span>
                    )}
                  </div>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } mb-3 line-clamp-2`}>
                    {webinar.description}
                  </p>
                </div>
              </div>

              {/* Alumni Host Info */}
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-200"
                } border rounded-lg p-4 mb-4`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {webinar.host.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4
                        className={`font-semibold ${
                          isDarkMode ? "text-gray-100" : "text-gray-800"
                        }`}>
                        {webinar.host.name}
                      </h4>
                      <span className="text-blue-500">🎓</span>
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}>
                      {webinar.host.role} at {webinar.host.company}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                      {webinar.host.experience} experience
                    </p>
                  </div>
                  <a
                    href={webinar.host.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 text-sm">
                    Connect on LinkedIn →
                  </a>
                </div>
              </div>

              {/* Webinar Details */}
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
                      Seats filled
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

              {/* Additional Info */}
              <div className="mb-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                      Prerequisites:
                    </span>
                    <span
                      className={`ml-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                      {webinar.prerequisites}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}>
                      Target Audience:
                    </span>
                    <span
                      className={`ml-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                      {webinar.targetAudience}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating for completed webinars */}
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
                      ({webinar.feedback} student reviews)
                    </span>
                  </div>
                  {webinar.isRecorded && (
                    <span
                      className={`px-2 py-1 ${
                        isDarkMode
                          ? "bg-purple-900 text-purple-300"
                          : "bg-purple-100 text-purple-700"
                      } rounded-full text-xs`}>
                      📹 Recording Available
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {webinar.isRecorded && (
                    <span
                      className={`px-2 py-1 ${
                        isDarkMode
                          ? "bg-purple-900 text-purple-300"
                          : "bg-purple-100 text-purple-700"
                      } rounded-full text-xs`}>
                      📹 Will be recorded
                    </span>
                  )}
                </div>

                <div className="flex space-x-3">
                  {webinar.status === "upcoming" && (
                    <button
                      onClick={() => handleRegister(webinar.id)}
                      disabled={
                        webinar.registrations >= webinar.maxAttendees &&
                        !registeredWebinars.includes(webinar.id)
                      }
                      className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                        registeredWebinars.includes(webinar.id)
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : webinar.registrations >= webinar.maxAttendees
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}>
                      {registeredWebinars.includes(webinar.id)
                        ? "Unregister"
                        : webinar.registrations >= webinar.maxAttendees
                        ? "Full"
                        : "Register"}
                    </button>
                  )}

                  {webinar.status === "completed" && webinar.recording && (
                    <a
                      href={webinar.recording}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                      Watch Recording
                    </a>
                  )}

                  <button
                    className={`px-4 py-2 ${
                      isDarkMode
                        ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } rounded-lg transition-colors text-sm font-medium`}>
                    View Details
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

export default Alumni;
