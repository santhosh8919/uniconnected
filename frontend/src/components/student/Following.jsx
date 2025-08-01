import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { connectionAPI, handleAPIError } from "../../utils/api";

const Following = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    loadFollowingData();
  }, []);

  const loadFollowingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get connection requests to determine who we're following
      const sentRequestsRes = await connectionAPI.getRequests(
        "sent",
        "accepted"
      );

      // Following: People who accepted our connection requests (we follow them)
      const followingData = (sentRequestsRes.connections || [])
        .filter((req) => req.status === "accepted")
        .map((req) => ({
          ...req.recipient,
          followedDate: req.acceptedAt,
          connectionId: req._id,
          mutualFollowers: Math.floor(Math.random() * 20), // Demo data
        }));

      setFollowing(followingData);
    } catch (error) {
      console.error("Error loading following data:", error);
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "today";
    if (diffInDays === 1) return "yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const handleUnfollow = async (connectionId, userName) => {
    if (!confirm(`Are you sure you want to unfollow ${userName}?`)) {
      return;
    }

    try {
      setLoading(true);
      await connectionAPI.removeConnection(connectionId);

      // Refresh data
      await loadFollowingData();

      alert(`Unfollowed ${userName} successfully.`);
    } catch (error) {
      console.error("Error unfollowing:", error);
      alert(`Error: ${handleAPIError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredFollowing = () => {
    return following.filter(
      (person) =>
        person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (person.companyName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (person.jobRole || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderFollowingCard = (person) => (
    <div
      key={person._id}
      className={`${
        isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
      } border rounded-lg p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center font-medium text-lg">
          {getInitials(person.fullName)}
        </div>

        <div className="flex-1">
          <h3
            className={`font-semibold text-lg ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}>
            {person.fullName}
          </h3>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
            {person.role === "alumni"
              ? `${person.jobRole || "Alumni"} ${
                  person.companyName ? `at ${person.companyName}` : ""
                }`
              : "Student"}
          </p>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
            {person.college} • {person.branch} •{" "}
            {person.role === "alumni" ? "Alumni" : `${person.year} Year`}
          </p>

          <div className="flex items-center space-x-4 mt-2">
            <span
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              {person.mutualFollowers} mutual connections
            </span>
            <span
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              Following since {getTimeAgo(person.followedDate)}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            onClick={() => {
              /* Navigate to chat */
            }}>
            Message
          </button>
          <button
            onClick={() => handleUnfollow(person.connectionId, person.fullName)}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50">
            Unfollow
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md p-6`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">👤</span>
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}>
            Following
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isDarkMode
                ? "bg-green-900 text-green-300"
                : "bg-green-100 text-green-800"
            }`}>
            {following.length} following
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={loadFollowingData}
            disabled={loading}
            className={`px-3 py-2 rounded-lg text-sm ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            {loading ? "..." : "🔄"}
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search following..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 border ${
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
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p
              className={`mt-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
              Loading following...
            </p>
          </div>
        )}

        {!loading && getFilteredFollowing().length === 0 && (
          <div
            className={`text-center py-12 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
            <span className="text-6xl mb-4 block">👤</span>
            <p className="text-xl mb-2">
              {searchTerm ? "No results found" : "Not following anyone yet"}
            </p>
            <p className="text-sm">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start following alumni and students to build your network"}
            </p>
          </div>
        )}

        {!loading &&
          getFilteredFollowing().length > 0 &&
          getFilteredFollowing().map((person) => renderFollowingCard(person))}
      </div>

      {/* Following Stats */}
      {!loading && following.length > 0 && (
        <div
          className={`mt-8 pt-6 border-t ${
            isDarkMode ? "border-gray-600" : "border-gray-200"
          }`}>
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}>
            Following Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`text-center p-4 rounded-lg ${
                isDarkMode ? "bg-green-900" : "bg-green-50"
              }`}>
              <p className="text-2xl font-bold text-green-600">
                {following.length}
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                Total Following
              </p>
            </div>
            <div
              className={`text-center p-4 rounded-lg ${
                isDarkMode ? "bg-blue-900" : "bg-blue-50"
              }`}>
              <p className="text-2xl font-bold text-blue-600">
                {following.filter((f) => f.role === "student").length}
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                Students
              </p>
            </div>
            <div
              className={`text-center p-4 rounded-lg ${
                isDarkMode ? "bg-purple-900" : "bg-purple-50"
              }`}>
              <p className="text-2xl font-bold text-purple-600">
                {following.filter((f) => f.role === "alumni").length}
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                Alumni
              </p>
            </div>
            <div
              className={`text-center p-4 rounded-lg ${
                isDarkMode ? "bg-orange-900" : "bg-orange-50"
              }`}>
              <p className="text-2xl font-bold text-orange-600">
                {following.reduce((sum, f) => sum + f.mutualFollowers, 0)}
              </p>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                Mutual Connections
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 flex space-x-4">
        <button className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
          <span>🔍</span>
          <span>Find More People</span>
        </button>
        <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
          <span>💬</span>
          <span>Start Conversations</span>
        </button>
      </div>
    </div>
  );
};

export default Following;
