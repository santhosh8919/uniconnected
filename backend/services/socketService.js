const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const User = require("../models/User");

class SocketService {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: [
          "http://localhost:5173",
          "http://localhost:3000",
          "http://127.0.0.1:5173",
          "http://localhost:5174",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Store active users and their socket IDs
    this.activeUsers = new Map();
    this.userSockets = new Map();

    this.initializeSocketHandlers();
  }

  initializeSocketHandlers() {
    this.io.use(this.authenticateSocket.bind(this));

    this.io.on("connection", (socket) => {
      console.log(`✅ User connected: ${socket.userId} (${socket.id})`);

      // Add user to active users
      this.activeUsers.set(socket.userId, {
        socketId: socket.id,
        lastSeen: new Date(),
      });
      this.userSockets.set(socket.id, socket.userId);

      // Join user to their personal room
      socket.join(`user_${socket.userId}`);

      // Broadcast user online status to their connections
      this.broadcastUserStatus(socket.userId, "online");

      // Handle joining chat rooms
      socket.on("join_chat", (otherUserId) => {
        const roomName = this.getChatRoomName(socket.userId, otherUserId);
        socket.join(roomName);
        console.log(`📨 User ${socket.userId} joined chat room: ${roomName}`);
      });

      // Handle leaving chat rooms
      socket.on("leave_chat", (otherUserId) => {
        const roomName = this.getChatRoomName(socket.userId, otherUserId);
        socket.leave(roomName);
        console.log(`📤 User ${socket.userId} left chat room: ${roomName}`);
      });

      // Handle sending messages
      socket.on("send_message", async (data) => {
        try {
          const { recipientId, content, messageType = "text" } = data;

          // Verify connection exists
          const Connection = require("../models/Connection");
          const connection = await Connection.findOne({
            $or: [
              {
                requester: socket.userId,
                recipient: recipientId,
                status: "accepted",
              },
              {
                requester: recipientId,
                recipient: socket.userId,
                status: "accepted",
              },
            ],
          });

          if (!connection) {
            socket.emit("error", {
              message: "You can only send messages to your connections",
            });
            return;
          }

          // Create and save message
          const message = new Message({
            sender: socket.userId,
            recipient: recipientId,
            content,
            messageType,
          });

          await message.save();
          await message.populate("sender", "fullName role");
          await message.populate("recipient", "fullName role");

          // Get chat room name
          const roomName = this.getChatRoomName(socket.userId, recipientId);

          // Emit to both users in the chat room
          this.io.to(roomName).emit("new_message", {
            _id: message._id,
            sender: message.sender,
            recipient: message.recipient,
            content: message.content,
            messageType: message.messageType,
            createdAt: message.createdAt,
            isRead: message.isRead,
          });

          // Send notification to recipient if they're online but not in chat room
          if (this.activeUsers.has(recipientId)) {
            this.io.to(`user_${recipientId}`).emit("new_message_notification", {
              from: message.sender,
              preview:
                content.substring(0, 50) + (content.length > 50 ? "..." : ""),
              messageId: message._id,
            });
          }

          console.log(
            `💬 Message sent from ${socket.userId} to ${recipientId}`
          );
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      });

      // Handle typing indicators
      socket.on("typing", (recipientId) => {
        const roomName = this.getChatRoomName(socket.userId, recipientId);
        socket.to(roomName).emit("user_typing", {
          userId: socket.userId,
          isTyping: true,
        });
      });

      socket.on("stop_typing", (recipientId) => {
        const roomName = this.getChatRoomName(socket.userId, recipientId);
        socket.to(roomName).emit("user_typing", {
          userId: socket.userId,
          isTyping: false,
        });
      });

      // Handle message read receipts
      socket.on("mark_messages_read", async (senderId) => {
        try {
          await Message.updateMany(
            {
              sender: senderId,
              recipient: socket.userId,
              isRead: false,
              isDeleted: false,
            },
            {
              isRead: true,
              readAt: new Date(),
            }
          );

          // Notify sender that messages were read
          if (this.activeUsers.has(senderId)) {
            this.io.to(`user_${senderId}`).emit("messages_read", {
              readBy: socket.userId,
            });
          }
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.userId} (${socket.id})`);

        // Remove from active users
        this.activeUsers.delete(socket.userId);
        this.userSockets.delete(socket.id);

        // Broadcast user offline status
        this.broadcastUserStatus(socket.userId, "offline");
      });
    });
  }

  async authenticateSocket(socket, next) {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        console.log("🚫 Socket connection rejected: No token provided");
        return next(new Error("Authentication token required"));
      }

      console.log("🔐 Authenticating socket with token...");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔍 Token decoded, userId:", decoded.userId);

      const user = await User.findById(decoded.userId).select(
        "fullName role isActive"
      );

      if (!user) {
        console.log(
          "❌ Socket authentication failed: User not found for ID:",
          decoded.userId
        );
        console.log(
          "💡 This usually means the user was deleted or the token is invalid"
        );
        console.log("🔧 Client should clear localStorage and re-login");
        return next(new Error("User not found"));
      }

      if (!user.isActive) {
        console.log(
          "❌ Socket authentication failed: User account is deactivated:",
          decoded.userId
        );
        return next(new Error("Account deactivated"));
      }

      console.log(
        "✅ Socket authenticated successfully for user:",
        user.fullName
      );
      socket.userId = decoded.userId;
      socket.user = user;
      next();
    } catch (error) {
      console.error("❌ Socket authentication error:", error);
      if (error.name === "JsonWebTokenError") {
        return next(new Error("Invalid token"));
      }
      if (error.name === "TokenExpiredError") {
        return next(new Error("Token expired"));
      }
      next(new Error("Authentication failed"));
    }
  }

  getChatRoomName(userId1, userId2) {
    // Create consistent room name regardless of user order
    const sortedIds = [userId1, userId2].sort();
    return `chat_${sortedIds[0]}_${sortedIds[1]}`;
  }

  async broadcastUserStatus(userId, status) {
    try {
      // Get user's connections
      const Connection = require("../models/Connection");
      const connections = await Connection.find({
        $or: [
          { requester: userId, status: "accepted" },
          { recipient: userId, status: "accepted" },
        ],
      });

      // Notify each connected user about status change
      connections.forEach((connection) => {
        const otherUserId =
          connection.requester.toString() === userId
            ? connection.recipient.toString()
            : connection.requester.toString();

        if (this.activeUsers.has(otherUserId)) {
          this.io.to(`user_${otherUserId}`).emit("user_status_change", {
            userId,
            status,
            timestamp: new Date(),
          });
        }
      });
    } catch (error) {
      console.error("Error broadcasting user status:", error);
    }
  }

  // Public method to get active users count
  getActiveUsersCount() {
    return this.activeUsers.size;
  }

  // Public method to check if user is online
  isUserOnline(userId) {
    return this.activeUsers.has(userId);
  }
}

module.exports = SocketService;
