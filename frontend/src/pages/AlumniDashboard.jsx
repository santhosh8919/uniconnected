import React, { useState, useEffect } from "react";

// Import all alumni-specific and shared components
import Profile from "../components/shared/Profile";
import Notifications from "../components/shared/Notifications";
import Connections from "../components/shared/Connections";
import Chat from "../components/shared/Chat";
import NewTechnologies from "../components/shared/NewTechnologies";
import Jobs from "../components/alumni/Jobs";
import UnifiedJobs from "../components/shared/UnifiedJobs";
import Mentoring from "../components/alumni/Mentoring";
import Webinars from "../components/alumni/Webinars";
import FollowersOnly from "../components/student/FollowersOnly";
import Following from "../components/student/Following";
import DarkModeToggle from "../components/shared/DarkModeToggle";
import { useTheme } from "../contexts/ThemeContext";
import StatsCard from "../components/shared/StatsCard";
import ActivitiesSection from "../components/shared/ActivitiesSection";
import QuickActions from "../components/shared/QuickActions";
import UserProfileSidebar from "../components/shared/UserProfileSidebar";

const AlumniDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Get user info from localStorage or API
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}>
        Loading...
      </div>
    );
  }

  const navigationItems = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "connections", label: "Connections", icon: "🤝" },
    { id: "followers", label: "Followers", icon: "👥" },
    { id: "following", label: "Following", icon: "👤" },
    { id: "mentoring", label: "Mentoring", icon: "👨‍🏫" },
    { id: "webinars", label: "Webinars", icon: "📹" },
    { id: "jobs", label: "Jobs", icon: "💼" },
    { id: "technologies", label: "New Tech", icon: "🚀" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "chat", label: "Chat", icon: "💬" },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return <Profile userRole="alumni" />;
      case "connections":
        return <Connections />;
      case "followers":
        return <FollowersOnly />;
      case "following":
        return <Following />;
      case "mentoring":
        return <Mentoring />;
      case "webinars":
        return <Webinars />;
      case "jobs":
        return <UnifiedJobs userRole="alumni" />;
      case "technologies":
        return <NewTechnologies />;
      case "notifications":
        return <Notifications />;
      case "chat":
        return <Chat />;
      default:
        return (
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-6`}>
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              } mb-6`}>
              Welcome back, {user.fullName}! 🎓
            </h2>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div
                className={`${
                  isDarkMode ? "bg-blue-900" : "bg-blue-50"
                } rounded-lg p-6 text-center`}>
                <div className="text-3xl mb-2">🤝</div>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-blue-300" : "text-blue-800"
                  }`}>
                  Connections
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}>
                  156
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}>
                  +12 this month
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-green-900" : "bg-green-50"
                } rounded-lg p-6 text-center`}>
                <div className="text-3xl mb-2">👨‍🏫</div>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-green-300" : "text-green-800"
                  }`}>
                  Mentees
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}>
                  8
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}>
                  2 new requests
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-purple-900" : "bg-purple-50"
                } rounded-lg p-6 text-center`}>
                <div className="text-3xl mb-2">�</div>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-purple-300" : "text-purple-800"
                  }`}>
                  Webinars
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}>
                  3
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}>
                  2 upcoming
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-orange-900" : "bg-orange-50"
                } rounded-lg p-6 text-center`}>
                <div className="text-3xl mb-2">⭐</div>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-orange-300" : "text-orange-800"
                  }`}>
                  Mentor Rating
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-orange-400" : "text-orange-600"
                  }`}>
                  4.8
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-orange-400" : "text-orange-600"
                  }`}>
                  From 25 reviews
                </p>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-6`}>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  } mb-4`}>
                  Recent Activities
                </h3>
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg`}>
                    <span className="text-blue-500">👨‍🏫</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        New mentorship request from Priya
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg`}>
                    <span className="text-purple-500">�</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        Created webinar: System Design Fundamentals
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        1 day ago
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg`}>
                    <span className="text-green-500">💼</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        Posted Senior Developer position
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        2 days ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-6`}>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  } mb-4`}>
                  Upcoming Sessions
                </h3>
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg`}>
                    <span className="text-blue-500">📅</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        Mentoring session with Rahul
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        Tomorrow, 10:00 AM
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg`}>
                    <span className="text-green-500">📹</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        Webinar: System Design Fundamentals
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        Aug 5, 2025
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg`}>
                    <span className="text-purple-500">💼</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        Interview Panel for Internships
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        Aug 8, 2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Your Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Students Mentored</p>
                      <p className="text-3xl font-bold">47</p>
                    </div>
                    <div className="text-4xl opacity-80">👥</div>
                  </div>
                  <p className="text-blue-100 text-sm mt-2">
                    Lifetime mentoring impact
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Jobs Created</p>
                      <p className="text-3xl font-bold">23</p>
                    </div>
                    <div className="text-4xl opacity-80">💼</div>
                  </div>
                  <p className="text-green-100 text-sm mt-2">
                    Opportunities provided
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Success Rate</p>
                      <p className="text-3xl font-bold">94%</p>
                    </div>
                    <div className="text-4xl opacity-80">🎯</div>
                  </div>
                  <p className="text-purple-100 text-sm mt-2">
                    Mentee placement success
                  </p>
                </div>
              </div>
            </div>

            {/* Job Posting Highlight */}
            <div className="mt-8">
              <div
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-green-800 to-green-900"
                    : "bg-gradient-to-r from-green-500 to-green-600"
                } text-white rounded-xl p-6 mb-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      🚀 Help Students Find Opportunities
                    </h3>
                    <p className="text-green-100 mb-4">
                      Post job openings and internships to help students
                      kickstart their careers
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveSection("jobs")}
                        className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center space-x-2">
                        <span>💼</span>
                        <span>Post New Job</span>
                      </button>
                      <button
                        onClick={() => setActiveSection("jobs")}
                        className="border border-green-300 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <span>📋</span>
                        <span>Manage Jobs</span>
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:block text-6xl opacity-80">🎯</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                } mb-4`}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <button
                  onClick={() => setActiveSection("mentoring")}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <div className="text-2xl mb-2">👨‍🏫</div>
                  <div className="text-sm font-medium">Review Requests</div>
                </button>
                <button
                  onClick={() => setActiveSection("webinars")}
                  className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <div className="text-2xl mb-2">📹</div>
                  <div className="text-sm font-medium">Create Webinar</div>
                </button>
                <button
                  onClick={() => setActiveSection("jobs")}
                  className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="text-sm font-medium">View All Jobs</div>
                </button>
                <button
                  onClick={() => setActiveSection("connections")}
                  className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <div className="text-2xl mb-2">🤝</div>
                  <div className="text-sm font-medium">Network</div>
                </button>
                <button
                  onClick={() => setActiveSection("technologies")}
                  className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-sm font-medium">Explore Tech</div>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`min-h-screen flex ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "block" : "hidden"} md:block w-64 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}>
              UniConnect
            </h1>
            <DarkModeToggle />
          </div>
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? `${
                        isDarkMode
                          ? "bg-blue-900 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                      } font-medium`
                    : `${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                }`}>
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile in Sidebar */}
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500">Alumni</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">UniConnect</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
              ☰
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default AlumniDashboard;
