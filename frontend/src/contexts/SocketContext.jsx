import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user.token;

    if (token) {
      // Validate token before attempting Socket connection
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const isExpired = Date.now() > payload.exp * 1000;

          if (isExpired) {
            console.log("⏰ Token expired, clearing and redirecting...");
            localStorage.removeItem("user");
            alert("Your session has expired. Please login again.");
            window.location.href = "/";
            return;
          }
        }
      } catch (error) {
        console.log("❌ Invalid token format, clearing...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return;
      }

      console.log("🔑 Connecting with token:", token);

      const newSocket = io("http://localhost:5000", {
        auth: {
          token: token,
        },
        autoConnect: true,
        transports: ["websocket", "polling"],
        reconnectionDelayMax: 10000,
        reconnectionAttempts: 10,
      });

      newSocket.on("connect", () => {
        console.log("✅ Connected to Socket.IO server");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Disconnected from Socket.IO server");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("🚫 Socket connection error:", error);
        setIsConnected(false);

        // Handle authentication errors
        if (
          error.message.includes("token") ||
          error.message.includes("Authentication") ||
          error.message.includes("User not found") ||
          error.message.includes("Invalid token") ||
          error.message.includes("Token expired")
        ) {
          console.log("🔑 Socket authentication failed, token may be invalid");
          console.log("🧹 Clearing invalid token and redirecting to login...");

          // Clear invalid token and user data
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Show alert to user
          alert("Your session has expired or is invalid. Please login again.");

          // Redirect to login page
          window.location.href = "/";
        }
      });

      newSocket.on("user_status_change", (data) => {
        const { userId, status } = data;
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          if (status === "online") {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });

      newSocket.on("new_chat_available", (chatData) => {
        console.log("💬 New chat partner available:", chatData.user.fullName);
        console.log("🔍 Chat data received:", chatData);
        // You can add a callback here to refresh the chat list
        // or show a notification that a new chat is available
        window.dispatchEvent(
          new CustomEvent("newChatAvailable", { detail: chatData })
        );
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, []);

  const joinChat = (otherUserId) => {
    if (socket && isConnected) {
      socket.emit("join_chat", otherUserId);
    }
  };

  const leaveChat = (otherUserId) => {
    if (socket && isConnected) {
      socket.emit("leave_chat", otherUserId);
    }
  };

  const sendMessage = (recipientId, content, messageType = "text") => {
    if (socket && isConnected) {
      socket.emit("send_message", {
        recipientId,
        content,
        messageType,
      });
    }
  };

  const markMessagesAsRead = (senderId) => {
    if (socket && isConnected) {
      socket.emit("mark_messages_read", senderId);
    }
  };

  const emitTyping = (recipientId) => {
    if (socket && isConnected) {
      socket.emit("typing", recipientId);
    }
  };

  const emitStopTyping = (recipientId) => {
    if (socket && isConnected) {
      socket.emit("stop_typing", recipientId);
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinChat,
    leaveChat,
    sendMessage,
    markMessagesAsRead,
    emitTyping,
    emitStopTyping,
    isUserOnline,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
