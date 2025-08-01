import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useSocket } from "../../contexts/SocketContext";
import { chatAPI, handleAPIError } from "../../utils/api";

const Chat = () => {
  const { isDarkMode } = useTheme();
  const {
    socket,
    isConnected,
    joinChat,
    leaveChat,
    sendMessage,
    markMessagesAsRead,
    emitTyping,
    emitStopTyping,
    isUserOnline,
  } = useSocket();

  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef({});

  useEffect(() => {
    loadChats();

    // Listen for new chat available events
    const handleNewChatAvailable = (event) => {
      const chatData = event.detail;
      console.log("🎉 New chat partner available, refreshing chat list...");

      // Show notification
      setNotification({
        type: "success",
        message: `You can now chat with ${chatData.user.fullName}!`,
      });

      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);

      loadChats(); // Refresh the chat list to include the new connection
    };

    // Listen for connection accepted events (backup mechanism)
    const handleConnectionAccepted = (event) => {
      console.log("🔗 Connection accepted, refreshing chat list...");
      setTimeout(() => loadChats(), 1000); // Delay to ensure backend processing is complete
    };

    // Listen for immediate refresh requests
    const handleRefreshChatList = () => {
      console.log("🔄 Immediate chat list refresh requested...");
      loadChats();
    };

    window.addEventListener("newChatAvailable", handleNewChatAvailable);
    window.addEventListener("connectionAccepted", handleConnectionAccepted);
    window.addEventListener("refreshChatList", handleRefreshChatList);

    // Auto-refresh chat list every 30 seconds to catch any missed updates
    const autoRefreshInterval = setInterval(() => {
      console.log("🔄 Auto-refreshing chat list...");
      loadChats();
    }, 30000);

    return () => {
      window.removeEventListener("newChatAvailable", handleNewChatAvailable);
      window.removeEventListener(
        "connectionAccepted",
        handleConnectionAccepted
      );
      window.removeEventListener("refreshChatList", handleRefreshChatList);
      clearInterval(autoRefreshInterval);
    };
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new chat available notifications
    const handleNewChatSocket = (data) => {
      console.log("🔔 Socket: New chat notification received:", data);
      loadChats();
    };

    // Listen for connection accepted events via Socket
    const handleConnectionAcceptedSocket = (data) => {
      console.log(
        "🤝 Socket: Connection accepted notification received:",
        data
      );
      loadChats();
    };

    // Listen for delayed refresh events
    const handleChatRefreshSocket = () => {
      console.log("🔄 Socket: Chat refresh notification received");
      loadChats();
    };

    socket.on("new_chat_available", handleNewChatSocket);
    socket.on("connectionAccepted", handleConnectionAcceptedSocket);
    socket.on("chat_list_refresh", handleChatRefreshSocket);

    // Listen for new messages
    socket.on("new_message", (messageData) => {
      console.log("📨 New message received:", messageData);

      const senderId = messageData.sender._id;
      const recipientId = messageData.recipient._id;
      const otherUserId =
        senderId === getCurrentUserId() ? recipientId : senderId;

      // Add message to the conversation
      setMessages((prev) => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), messageData],
      }));

      // Update chat list with latest message
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.user._id === otherUserId) {
            return {
              ...chat,
              latestMessage: {
                content: messageData.content,
                timestamp: messageData.createdAt,
                isOwn: messageData.sender._id === getCurrentUserId(),
              },
              lastActivity: messageData.createdAt,
            };
          }
          return chat;
        })
      );

      // Update unread count if not current chat
      if (!selectedChat || selectedChat.user._id !== otherUserId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [otherUserId]: (prev[otherUserId] || 0) + 1,
        }));
      } else {
        // Mark as read if it's the current chat
        markMessagesAsRead(otherUserId);
      }

      // Scroll to bottom
      scrollToBottom();
    });

    // Listen for typing indicators
    socket.on("user_typing", ({ userId, isTyping }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: isTyping,
      }));

      // Clear typing indicator after 3 seconds
      if (isTyping) {
        if (typingTimeoutRef.current[userId]) {
          clearTimeout(typingTimeoutRef.current[userId]);
        }
        typingTimeoutRef.current[userId] = setTimeout(() => {
          setTypingUsers((prev) => ({
            ...prev,
            [userId]: false,
          }));
        }, 3000);
      }
    });

    // Listen for message read receipts
    socket.on("messages_read", ({ readBy }) => {
      console.log(`📖 Messages read by ${readBy}`);
      // Update message read status in UI if needed
    });

    // Listen for user status changes
    socket.on("user_status_change", ({ userId, status }) => {
      console.log(`👤 User ${userId} is now ${status}`);
    });

    return () => {
      socket.off("new_chat_available", handleNewChatSocket);
      socket.off("connectionAccepted", handleConnectionAcceptedSocket);
      socket.off("chat_list_refresh", handleChatRefreshSocket);
      socket.off("new_message");
      socket.off("user_typing");
      socket.off("messages_read");
      socket.off("user_status_change");
    };
  }, [socket, isConnected, selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.token) {
        const payload = JSON.parse(atob(user.token.split(".")[1]));
        return payload.userId;
      }
    } catch (error) {
      console.error("Error getting current user ID:", error);
      // If there's an error with the token, clear the session
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return null;
  };

  const loadChats = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Loading chats...");
      const response = await chatAPI.getChats();
      console.log("📥 Chats response:", response);

      if (!response || !response.chats) {
        console.error("❌ Invalid chat response:", response);
        throw new Error("Invalid response from chat API");
      }

      const chatList = response.chats;
      console.log(
        "📊 Chat list details:",
        chatList.map((c) => ({
          id: c._id,
          user: c.user?.fullName,
          lastMessage: c.latestMessage?.content?.substring(0, 20),
        }))
      );

      setChats(chatList);

      // Initialize unread counts
      const unreadCounts = {};
      chatList.forEach((chat) => {
        unreadCounts[chat.user._id] = chat.unreadCount || 0;
      });
      setUnreadCounts(unreadCounts);

      console.log("Loaded chats:", chatList.length);
    } catch (error) {
      console.error("Error loading chats:", error);
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (userId) => {
    try {
      if (messages[userId] && messages[userId].length > 0) {
        // Already loaded
        return;
      }

      console.log(`Loading conversation with ${userId}...`);
      const response = await chatAPI.getConversation(userId);
      console.log("Conversation response:", response);

      const conversationMessages = response.messages || [];
      setMessages((prev) => ({
        ...prev,
        [userId]: conversationMessages,
      }));

      // Mark messages as read
      if (conversationMessages.length > 0) {
        markMessagesAsRead(userId);
        setUnreadCounts((prev) => ({
          ...prev,
          [userId]: 0,
        }));
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      setError(handleAPIError(error));
    }
  };

  const handleChatSelect = (chat) => {
    // Leave previous chat room
    if (selectedChat) {
      leaveChat(selectedChat.user._id);
    }

    // Join new chat room
    joinChat(chat.user._id);

    setSelectedChat(chat);
    loadConversation(chat.user._id);

    // Clear unread count
    setUnreadCounts((prev) => ({
      ...prev,
      [chat.user._id]: 0,
    }));
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat || !isConnected) return;

    const messageContent = message.trim();
    const recipientId = selectedChat.user._id;

    // Send via Socket.IO
    sendMessage(recipientId, messageContent);

    // Clear input
    setMessage("");

    // Stop typing indicator
    emitStopTyping(recipientId);
  };

  const handleTyping = () => {
    if (selectedChat && isConnected) {
      emitTyping(selectedChat.user._id);

      // Stop typing after 1 second of no typing
      if (typingTimeoutRef.current.self) {
        clearTimeout(typingTimeoutRef.current.self);
      }
      typingTimeoutRef.current.self = setTimeout(() => {
        emitStopTyping(selectedChat.user._id);
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredChats = chats.filter((chat) =>
    chat.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUserId = getCurrentUserId();
  const selectedMessages = selectedChat
    ? messages[selectedChat.user._id] || []
    : [];
  const isTyping = selectedChat ? typingUsers[selectedChat.user._id] : false;

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md h-[600px] flex relative`}>
      {/* Connection Status Indicator */}
      <div
        className={`absolute top-2 right-2 flex items-center space-x-2 text-xs px-2 py-1 rounded-full z-10 ${
          isConnected
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}></div>
        <span>{isConnected ? "Connected" : "Connecting..."}</span>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`absolute top-14 right-2 flex items-center space-x-2 text-sm px-3 py-2 rounded-lg z-20 max-w-xs ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-blue-100 text-blue-800 border border-blue-300"
          }`}>
          <span className="text-lg">🎉</span>
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
      )}

      {/* Chat List */}
      <div
        className={`w-1/3 border-r ${
          isDarkMode ? "border-gray-600" : "border-gray-200"
        } flex flex-col`}>
        <div
          className={`p-4 border-b ${
            isDarkMode ? "border-gray-600" : "border-gray-200"
          }`}>
          <div className="flex justify-between items-center mb-3">
            <h2
              className={`text-xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}>
              Messages
            </h2>
            <button
              onClick={loadChats}
              disabled={loading}
              title="Refresh chat list"
              className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              {loading ? "⏳" : "🔄"} {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
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
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 border-b border-red-200 text-red-700">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p
                className={`mt-2 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                Loading chats...
              </p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div
              className={`p-8 text-center ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              <span className="text-3xl mb-2 block">💬</span>
              <p className="text-sm">No connections available</p>
              <p className="text-xs mt-1">
                Connect with people to start chatting
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.user._id}
                onClick={() => handleChatSelect(chat)}
                className={`p-4 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                } cursor-pointer hover:${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } ${
                  selectedChat?.user._id === chat.user._id
                    ? isDarkMode
                      ? "bg-blue-900 border-blue-700"
                      : "bg-blue-50 border-blue-200"
                    : ""
                }`}>
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                      {getInitials(chat.user.fullName)}
                    </div>
                    {isUserOnline(chat.user._id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-semibold truncate ${
                          isDarkMode ? "text-gray-100" : "text-gray-900"
                        }`}>
                        {chat.user.fullName}
                      </h3>
                      <div className="flex flex-col items-end space-y-1">
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                          {chat.latestMessage
                            ? formatTime(chat.latestMessage.timestamp)
                            : "New"}
                        </span>
                        {unreadCounts[chat.user._id] > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadCounts[chat.user._id]}
                          </span>
                        )}
                      </div>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                      {chat.user.role === "alumni"
                        ? `${chat.user.jobRole || "Alumni"} ${
                            chat.user.companyName
                              ? `at ${chat.user.companyName}`
                              : ""
                          }`
                        : `Student at ${chat.user.college}`}
                    </p>
                    <p
                      className={`text-sm truncate mt-1 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}>
                      {chat.latestMessage?.content || "Start a conversation"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div
              className={`p-4 border-b ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700"
                  : "border-gray-200 bg-gray-50"
              }`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                    {getInitials(selectedChat.user.fullName)}
                  </div>
                  {isUserOnline(selectedChat.user._id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}>
                    {selectedChat.user.fullName}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                    {isUserOnline(selectedChat.user._id)
                      ? "Online"
                      : "Last seen recently"}
                  </p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <button
                    className={`p-2 ${
                      isDarkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    📞
                  </button>
                  <button
                    className={`p-2 ${
                      isDarkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    📹
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedMessages.length === 0 ? (
                <div
                  className={`text-center py-8 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-medium mx-auto mb-4">
                    {getInitials(selectedChat.user.fullName)}
                  </div>
                  <h3
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}>
                    Start chatting with {selectedChat.user.fullName}
                  </h3>
                  <p className="text-sm">
                    {selectedChat.user.role === "alumni"
                      ? `${selectedChat.user.jobRole || "Alumni"} ${
                          selectedChat.user.companyName
                            ? `at ${selectedChat.user.companyName}`
                            : ""
                        }`
                      : `Student at ${selectedChat.user.college}`}
                  </p>
                  <p className="text-xs mt-2">
                    Say hello to start the conversation!
                  </p>
                </div>
              ) : (
                selectedMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.sender._id === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender._id === currentUserId
                          ? "bg-blue-600 text-white"
                          : isDarkMode
                          ? "bg-gray-600 text-gray-100"
                          : "bg-gray-200 text-gray-900"
                      }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender._id === currentUserId
                            ? "text-blue-100"
                            : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-200"
                    }`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div
              className={`p-4 border-t ${
                isDarkMode ? "border-gray-600" : "border-gray-200"
              }`}>
              <div className="flex space-x-3">
                <button
                  className={`p-2 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  }`}>
                  📎
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  disabled={!isConnected}
                  className={`flex-1 px-4 py-2 border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isConnected ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                <button
                  className={`p-2 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  }`}>
                  😊
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !isConnected}
                  className={`px-4 py-2 rounded-lg ${
                    message.trim() && isConnected
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}>
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`flex-1 flex items-center justify-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
            <div className="text-center">
              <span className="text-6xl mb-4 block">💬</span>
              <p className="text-xl mb-2">
                Select a conversation to start messaging
              </p>
              <p className="text-sm">
                Real-time chat with your connections from UniConnect
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
