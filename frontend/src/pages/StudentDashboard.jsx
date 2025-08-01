import React, { useState, useEffect } from "react";

// Import all student-specific and shared components
import Profile from "../components/shared/Profile";
import Notifications from "../components/shared/Notifications";
import Connections from "../components/shared/Connections";
import Chat from "../components/shared/Chat";
import NewTechnologies from "../components/shared/NewTechnologies";
import FollowersOnly from "../components/student/FollowersOnly";
import Following from "../components/student/Following";
import Hackathons from "../components/student/Hackathons";
import Internships from "../components/student/Internships";
import Alumni from "../components/student/Alumni";
import Jobs from "../components/student/Jobs";
import UnifiedJobs from "../components/shared/UnifiedJobs";
import DarkModeToggle from "../components/shared/DarkModeToggle";
import { useTheme } from "../contexts/ThemeContext";
import StatsCard from "../components/shared/StatsCard";
import ActivitiesSection from "../components/shared/ActivitiesSection";
import QuickActions from "../components/shared/QuickActions";
import UserProfileSidebar from "../components/shared/UserProfileSidebar";

const StudentDashboard = () => {
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
    { id: "alumni", label: "Alumni", icon: "🎓" },
    { id: "followers", label: "Followers", icon: "👥" },
    { id: "following", label: "Following", icon: "👤" },
    { id: "hackathons", label: "Hackathons", icon: "💻" },
    { id: "internships", label: "Internships", icon: "💼" },
    { id: "jobs", label: "Jobs", icon: "🔍" },
    { id: "technologies", label: "New Tech", icon: "🚀" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "chat", label: "Chat", icon: "💬" },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return <Profile userRole="student" />;
      case "connections":
        return <Connections />;
      case "alumni":
        return <Alumni />;
      case "followers":
        return <FollowersOnly />;
      case "following":
        return <Following />;
      case "hackathons":
        return <Hackathons />;
      case "internships":
        return <Internships />;
      case "jobs":
        return <UnifiedJobs userRole="student" />;
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
                  isDarkMode ? "bg-blue-900/50" : "bg-blue-50"
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
                  47
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}>
                  +3 this week
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-green-900/50" : "bg-green-50"
                } rounded-lg p-6 text-center`}>
                <div className="text-3xl mb-2">💻</div>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-green-300" : "text-green-800"
                  }`}>
                  Hackathons
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}>
                  5
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}>
                  2 ongoing
                </p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-purple-900/50" : "bg-purple-50"
                } rounded-lg p-6 text-center`}>
                <div className="text-3xl mb-2">💼</div>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-purple-300" : "text-purple-800"
                  }`}>
                  Applications
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}>
                  12
                </p>
                <p className="text-sm text-purple-600">3 pending</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="text-lg font-semibold text-orange-800">
                  Followers
                </h3>
                <p className="text-2xl font-bold text-orange-600">124</p>
                <p className="text-sm text-orange-600">+8 this week</p>
              </div>

              <div
                className={`${
                  isDarkMode ? "bg-pink-900/50" : "bg-pink-50"
                } rounded-lg p-6 text-center`}>
                <div className="text-3xl mb-2">👤</div>
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-pink-300" : "text-pink-800"
                  }`}>
                  Following
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-pink-400" : "text-pink-600"
                  }`}>
                  89
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-pink-400" : "text-pink-600"
                  }`}>
                  +2 this week
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
                    <span className="text-blue-500">🏆</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        Won 2nd place in CodeChef Contest
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        2 days ago
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg`}>
                    <span className="text-purple-500">🎓</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        Registered for ML webinar by Dr. Chen
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        3 days ago
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg`}>
                    <span className="text-green-500">✅</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        Applied for Google Summer Internship
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        1 week ago
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
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg`}>
                    <span className="text-blue-500">🎓</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        System Design webinar by John Smith
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
                    <span className="text-red-500">�</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        TechFest 2025 - Registration ends
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        Tomorrow
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-3 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-lg`}>
                    <span className="text-green-500">🚀</span>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                        Startup Pitch Competition
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        Aug 10, 2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Opportunities Highlight */}
            <div className="mt-8">
              <div
                className={`${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-800 to-blue-900"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                } text-white rounded-xl p-6 mb-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      💼 Explore Job Opportunities
                    </h3>
                    <p className="text-blue-100 mb-4">
                      Discover internships, full-time jobs, and career
                      opportunities posted by alumni and companies
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveSection("jobs")}
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2">
                        <span>🔍</span>
                        <span>Browse Jobs</span>
                      </button>
                      <button
                        onClick={() => setActiveSection("jobs")}
                        className="border border-blue-300 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <span>📝</span>
                        <span>My Applications</span>
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
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <button
                  onClick={() => setActiveSection("alumni")}
                  className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="text-sm font-medium">Alumni Hub</div>
                </button>
                <button
                  onClick={() => setActiveSection("jobs")}
                  className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <div className="text-2xl mb-2">�</div>
                  <div className="text-sm font-medium">Find Jobs</div>
                </button>
                <button
                  onClick={() => setActiveSection("hackathons")}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <div className="text-2xl mb-2">�</div>
                  <div className="text-sm font-medium">Join Hackathon</div>
                </button>
                <button
                  onClick={() => setActiveSection("internships")}
                  className="p-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium">Find Internships</div>
                </button>
                <button
                  onClick={() => setActiveSection("connections")}
                  className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <div className="text-2xl mb-2">🤝</div>
                  <div className="text-sm font-medium">Connect</div>
                </button>
                <button
                  onClick={() => setActiveSection("technologies")}
                  className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <div className="text-2xl mb-2">�</div>
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
        <div
          className={`absolute bottom-0 w-64 p-6 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}>
                {user.fullName}
              </p>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                Student
              </p>
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
        <header
          className={`md:hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm p-4`}>
          <div className="flex items-center justify-between">
            <h1
              className={`text-xl font-bold ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}>
              UniConnect
            </h1>
            <div className="flex items-center space-x-3">
              <DarkModeToggle />
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}>
                ☰
              </button>
            </div>
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

export default StudentDashboard;
