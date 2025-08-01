import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import * as api from "../../utils/api";

const { userAPI, connectionAPI, handleAPIError } = api;

// Branch options (same as registration form)
const branches = [
  "Computer Science Engineering",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biotechnology",
  "Business Administration",
  "Commerce",
  "Economics",
  "Other",
];

const Connections = ({ userType }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    year: "",
    branch: "",
    college: "",
    role: "",
  });

  // Data states
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [stats, setStats] = useState({
    totalConnections: 0,
    pendingRequests: { sent: 0, received: 0 },
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchTerm || Object.values(filters).some((filter) => filter)) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, filters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load basic data first
      const [connectionsRes, requestsRes, suggestionsRes] = await Promise.all([
        connectionAPI.getConnections(),
        connectionAPI.getRequests(),
        userAPI.getSuggestions(20),
      ]);

      setConnections(connectionsRes.connections || []);

      // Separate sent and received requests
      const allRequests = requestsRes.connections || [];
      setPendingRequests(
        allRequests.filter(
          (req) => req.type === "received" && req.status === "pending"
        )
      );

      setSuggestions(suggestionsRes.suggestions || []);

      // Try to load stats separately with better error handling
      try {
        if (typeof connectionAPI.getStats === "function") {
          const statsRes = await connectionAPI.getStats();
          setStats(statsRes);
        } else {
          console.error(
            "getStats is not a function:",
            typeof connectionAPI.getStats
          );
          // Set default stats
          setStats({
            totalConnections: connectionsRes.connections?.length || 0,
            pendingRequests: {
              sent: 0,
              received: allRequests.filter(
                (req) => req.type === "received" && req.status === "pending"
              ).length,
            },
          });
        }
      } catch (statsError) {
        console.error("Error loading stats:", statsError);
        // Set default stats
        setStats({
          totalConnections: connectionsRes.connections?.length || 0,
          pendingRequests: {
            sent: 0,
            received: allRequests.filter(
              (req) => req.type === "received" && req.status === "pending"
            ).length,
          },
        });
      }
    } catch (error) {
      console.error("Error loading connections data:", error);
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      const searchParams = {
        ...(searchTerm && { q: searchTerm }),
        ...(filters.year && { year: filters.year }),
        ...(filters.branch && { branch: filters.branch }),
        ...(filters.college && { college: filters.college }),
        ...(filters.role && { role: filters.role }),
        limit: 50,
      };

      const response = await userAPI.searchUsers(searchParams);
      setSearchResults(response.users || []);
    } catch (error) {
      console.error("Search error:", error);
      setError(handleAPIError(error));
    }
  };

  const handleAcceptRequest = async (connectionId) => {
    try {
      setLoading(true);
      const response = await connectionAPI.acceptRequest(connectionId);

      // Refresh data
      await loadInitialData();

      // Show success message with chat info
      const connectionName = response.connection?.requester?.fullName || "User";
      alert(
        `Connection request accepted! You can now chat with ${connectionName} in the Chat section.`
      );

      // After user clicks OK, trigger chat list refresh across the app
      window.dispatchEvent(
        new CustomEvent("connectionAccepted", {
          detail: {
            connection: response.connection,
            newChatPartner:
              response.connection?.requester || response.connection?.recipient,
          },
        })
      );

      // Additional immediate refresh trigger
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("refreshChatList"));
      }, 100);
    } catch (error) {
      console.error("Error accepting request:", error);
      alert(`Error: ${handleAPIError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (connectionId) => {
    try {
      setLoading(true);
      await connectionAPI.rejectRequest(connectionId);

      // Refresh data
      await loadInitialData();

      alert("Connection request rejected.");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert(`Error: ${handleAPIError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (recipientId, message = "") => {
    try {
      setLoading(true);
      await connectionAPI.sendRequest(recipientId, message);

      // Refresh suggestions and search results
      await loadInitialData();
      if (searchTerm || Object.values(filters).some((filter) => filter)) {
        await performSearch();
      }

      alert("Connection request sent!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert(`Error: ${handleAPIError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    if (!confirm("Are you sure you want to remove this connection?")) {
      return;
    }

    try {
      setLoading(true);
      await connectionAPI.removeConnection(connectionId);

      // Refresh data
      await loadInitialData();

      alert("Connection removed.");
    } catch (error) {
      console.error("Error removing connection:", error);
      alert(`Error: ${handleAPIError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      year: "",
      branch: "",
      college: "",
      role: "",
    });
    setSearchTerm("");
  };

  const filteredConnections = connections.filter(
    (conn) =>
      conn.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conn.user.companyName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (conn.user.jobRole || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderConnectionCard = (person, type = "connection") => {
    // Handle different data structures
    let userData, connectionId, connectionData;

    if (type === "connection") {
      userData = person.user;
      connectionId = person.connectionId;
      connectionData = person;
    } else if (type === "pending") {
      userData = person.requester;
      connectionId = person._id;
      connectionData = person;
    } else if (type === "suggestion") {
      userData = person;
      connectionId = null;
      connectionData = person;
    } else if (type === "search") {
      userData = person;
      connectionId = null;
      connectionData = person;
    }

    const getInitials = (name) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    };

    const getDisplayYear = (user) => {
      if (user.role === "alumni") return "Alumni";
      return user.year ? `${user.year} Year` : "Student";
    };

    return (
      <div
        key={connectionId || userData._id}
        className={`${
          isDarkMode
            ? "bg-gray-700 border-gray-600"
            : "bg-white border-gray-200"
        } border rounded-lg p-4 hover:shadow-md transition-shadow`}>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
            {getInitials(userData.fullName)}
          </div>

          <div className="flex-1">
            <h3
              className={`font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>
              {userData.fullName}
            </h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
              {userData.role === "alumni"
                ? `${userData.jobRole || "Alumni"} ${
                    userData.companyName ? `at ${userData.companyName}` : ""
                  }`
                : "Student"}
            </p>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              {userData.college} • {userData.branch} •{" "}
              {getDisplayYear(userData)}
            </p>

            {type === "connection" && connectionData.connectedAt && (
              <div className="flex items-center space-x-4 mt-2">
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                  Connected{" "}
                  {new Date(connectionData.connectedAt).toLocaleDateString()}
                </span>
              </div>
            )}

            {type === "suggestion" && (
              <div className="mt-2">
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}>
                  Suggested connection
                </span>
              </div>
            )}

            {type === "search" && userData.connectionStatus && (
              <div className="mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    userData.connectionStatus.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : userData.connectionStatus.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                  {userData.connectionStatus.status === "accepted" &&
                    "Connected"}
                  {userData.connectionStatus.status === "pending" &&
                    "Request Pending"}
                </span>
              </div>
            )}

            {type === "pending" && connectionData.message && (
              <div
                className={`mt-2 p-2 ${
                  isDarkMode ? "bg-gray-600" : "bg-gray-50"
                } rounded text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                "{connectionData.message}"
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } mt-1`}>
                  Sent {new Date(connectionData.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            {type === "connection" && (
              <>
                <button
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  onClick={() => {
                    /* Navigate to chat */
                  }}>
                  Message
                </button>
                <button
                  onClick={() => handleRemoveConnection(connectionId)}
                  disabled={loading}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 disabled:opacity-50">
                  Remove
                </button>
              </>
            )}

            {type === "pending" && (
              <>
                <button
                  onClick={() => handleAcceptRequest(connectionId)}
                  disabled={loading}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50">
                  Accept
                </button>
                <button
                  onClick={() => handleRejectRequest(connectionId)}
                  disabled={loading}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50">
                  Decline
                </button>
              </>
            )}

            {(type === "suggestion" || type === "search") && (
              <button
                onClick={() => handleSendRequest(userData._id)}
                disabled={
                  loading ||
                  (userData.connectionStatus &&
                    userData.connectionStatus.status !== null)
                }
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50">
                {userData.connectionStatus?.status === "pending"
                  ? "Pending"
                  : userData.connectionStatus?.status === "accepted"
                  ? "Connected"
                  : "Connect"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md p-6`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-bold ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}>
          Connections
        </h2>
        <button
          onClick={loadInitialData}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search connections..."
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
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className={`px-3 py-2 border ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}>
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <select
            value={filters.branch}
            onChange={(e) => handleFilterChange("branch", e.target.value)}
            className={`px-3 py-2 border ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}>
            <option value="">All Branches</option>
            {branches.map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          <select
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className={`px-3 py-2 border ${
              isDarkMode
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}>
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="alumni">Alumni</option>
          </select>

          {(searchTerm || Object.values(filters).some((filter) => filter)) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: "all", label: "My Connections", count: connections.length },
          { id: "pending", label: "Requests", count: pendingRequests.length },
          {
            id: "suggestions",
            label: "Suggestions",
            count: suggestions.length,
          },
          { id: "search", label: "Find People", count: searchResults.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-blue-500" : "bg-gray-300"
                }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p
              className={`mt-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
              Loading...
            </p>
          </div>
        )}

        {!loading && activeTab === "all" && (
          <>
            {filteredConnections.length === 0 ? (
              <div
                className={`text-center py-8 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                <span className="text-4xl mb-2 block">👥</span>
                <p>No connections found</p>
                <button
                  onClick={() => setActiveTab("suggestions")}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline">
                  Find people to connect with
                </button>
              </div>
            ) : (
              filteredConnections.map((connection) =>
                renderConnectionCard(connection, "connection")
              )
            )}
          </>
        )}

        {!loading && activeTab === "pending" && (
          <>
            {pendingRequests.length === 0 ? (
              <div
                className={`text-center py-8 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                <span className="text-4xl mb-2 block">⏳</span>
                <p>No pending requests</p>
              </div>
            ) : (
              pendingRequests.map((request) =>
                renderConnectionCard(request, "pending")
              )
            )}
          </>
        )}

        {!loading && activeTab === "suggestions" && (
          <>
            {suggestions.length === 0 ? (
              <div
                className={`text-center py-8 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                <span className="text-4xl mb-2 block">💡</span>
                <p>No suggestions available</p>
                <button
                  onClick={() => setActiveTab("search")}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline">
                  Search for people manually
                </button>
              </div>
            ) : (
              suggestions.map((suggestion) =>
                renderConnectionCard(suggestion, "suggestion")
              )
            )}
          </>
        )}

        {!loading && activeTab === "search" && (
          <>
            {!searchTerm &&
            Object.values(filters).every((filter) => !filter) ? (
              <div
                className={`text-center py-8 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                <span className="text-4xl mb-2 block">🔍</span>
                <p>Use the search and filters above to find people</p>
                <p className="text-sm mt-1">
                  Search by name, filter by year, branch, or role
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div
                className={`text-center py-8 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                <span className="text-4xl mb-2 block">😔</span>
                <p>No people found matching your criteria</p>
                <p className="text-sm mt-1">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              searchResults.map((person) =>
                renderConnectionCard(person, "search")
              )
            )}
          </>
        )}
      </div>

      {/* Stats */}
      {!loading && (
        <div
          className={`mt-6 pt-6 border-t ${
            isDarkMode ? "border-gray-600" : "border-gray-200"
          }`}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalConnections || connections.length}
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                Total Connections
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {stats.pendingRequests?.received || pendingRequests.length}
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                Pending Requests
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {suggestions.length}
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                New Suggestions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;
