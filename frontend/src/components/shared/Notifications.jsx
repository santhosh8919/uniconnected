import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { connectionAPI, handleAPIError } from "../../utils/api";

const Notifications = () => {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get connection requests as notifications
      const requestsRes = await connectionAPI.getRequests(
        "received",
        "pending"
      );
      const connectionRequests = requestsRes.connections || [];

      // Convert connection requests to notifications
      const connectionNotifications = connectionRequests.map((request) => ({
        id: request._id,
        type: "connection",
        message: `${request.requester.fullName} sent you a connection request`,
        time: getTimeAgo(request.createdAt),
        isRead: false,
        avatar: getInitials(request.requester.fullName),
        data: request, // Store the full request data
      }));

      // Add some demo notifications for other types
      const demoNotifications = [
        {
          id: "demo_1",
          type: "job",
          message:
            "New Software Engineer position at Google matches your profile",
          time: "5 hours ago",
          isRead: false,
          avatar: "💼",
        },
        {
          id: "demo_2",
          type: "hackathon",
          message: "TechFest 2025 registration is now open",
          time: "1 day ago",
          isRead: true,
          avatar: "🏆",
        },
        {
          id: "demo_3",
          type: "technology",
          message: 'New article: "React 19 Features You Need to Know"',
          time: "3 days ago",
          isRead: true,
          avatar: "📚",
        },
      ];

      setNotifications([...connectionNotifications, ...demoNotifications]);
    } catch (error) {
      console.error("Error loading notifications:", error);
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
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const handleAcceptConnection = async (notification) => {
    try {
      setLoading(true);
      await connectionAPI.acceptRequest(notification.data._id);

      // Remove from notifications
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));

      // Dispatch a custom event to notify other components
      window.dispatchEvent(
        new CustomEvent("connectionAccepted", {
          detail: {
            connectionId: notification.data._id,
            user: notification.data.requester,
          },
        })
      );

      alert("Connection accepted! You can now chat with this person.");
    } catch (error) {
      console.error("Error accepting connection:", error);
      alert(`Error: ${handleAPIError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConnection = async (notification) => {
    try {
      setLoading(true);
      await connectionAPI.rejectRequest(notification.data._id);

      // Remove from notifications
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));

      // Dispatch a custom event to notify other components
      window.dispatchEvent(
        new CustomEvent("connectionRejected", {
          detail: {
            connectionId: notification.data._id,
            user: notification.data.requester,
          },
        })
      );

      alert("Connection request declined.");
    } catch (error) {
      console.error("Error rejecting connection:", error);
      alert(`Error: ${handleAPIError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getFilteredNotifications = () => {
    if (filter === "unread") {
      return notifications.filter((notif) => !notif.isRead);
    }
    if (filter === "read") {
      return notifications.filter((notif) => notif.isRead);
    }
    return notifications;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "connection":
        return "👥";
      case "job":
        return "💼";
      case "hackathon":
        return "🏆";
      case "message":
        return "💬";
      case "technology":
        return "📚";
      default:
        return "🔔";
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md p-6`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-800"
            }`}>
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadNotifications}
            disabled={loading}
            className={`text-sm px-3 py-1 rounded ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            {loading ? "..." : "🔄"}
          </button>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`text-sm ${
              unreadCount === 0
                ? "text-gray-400 cursor-not-allowed"
                : isDarkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
            }`}>
            Mark all read
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-medium">Error loading notifications</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Filter buttons */}
      <div className="flex space-x-2 mb-4">
        {["all", "unread", "read"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === filterType
                ? "bg-blue-600 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p
            className={`mt-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
            Loading notifications...
          </p>
        </div>
      )}

      {/* Notifications list */}
      {!loading && (
        <div className="space-y-3">
          {getFilteredNotifications().length === 0 ? (
            <div
              className={`text-center py-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              <span className="text-4xl mb-2 block">🔔</span>
              <p>No notifications found</p>
            </div>
          ) : (
            getFilteredNotifications().map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.isRead
                    ? isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                    : isDarkMode
                    ? "bg-blue-900 border-blue-700"
                    : "bg-blue-50 border-blue-200"
                }`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {notification.avatar.length <= 3 ? (
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {notification.avatar}
                      </div>
                    ) : (
                      <span className="text-2xl">{notification.avatar}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div>
                          <p
                            className={`text-sm ${
                              notification.isRead
                                ? isDarkMode
                                  ? "text-gray-300"
                                  : "text-gray-600"
                                : isDarkMode
                                ? "text-gray-100 font-medium"
                                : "text-gray-900 font-medium"
                            }`}>
                            {notification.message}
                          </p>
                          <p
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            } mt-1`}>
                            {notification.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className={`text-xs ${
                              isDarkMode
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-blue-600 hover:text-blue-800"
                            }`}>
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className={`text-xs ${
                            isDarkMode
                              ? "text-red-400 hover:text-red-300"
                              : "text-red-600 hover:text-red-800"
                          }`}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons for connection requests */}
                {notification.type === "connection" &&
                  !notification.isRead &&
                  notification.data && (
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => handleAcceptConnection(notification)}
                        disabled={loading}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50">
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectConnection(notification)}
                        disabled={loading}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50">
                        Decline
                      </button>
                    </div>
                  )}

                {/* Action buttons for other notification types */}
                {notification.type === "job" && (
                  <div className="mt-3">
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                      View Job
                    </button>
                  </div>
                )}

                {notification.type === "hackathon" && (
                  <div className="mt-3">
                    <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                      Register Now
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
