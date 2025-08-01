const express = require("express");
const Message = require("../models/Message");
const { auth } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Get conversation between two users
router.get("/conversation/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Verify users are connected
    const Connection = require("../models/Connection");
    const connection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: userId, status: "accepted" },
        { requester: userId, recipient: req.user._id, status: "accepted" },
      ],
    });

    if (!connection) {
      return res.status(403).json({
        message: "You can only chat with your connections",
      });
    }

    const messages = await Message.getConversation(
      req.user.userId,
      userId,
      parseInt(limit),
      skip
    );

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        recipient: req.user.userId,
        isRead: false,
        isDeleted: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.json({
      messages: messages.reverse(), // Show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Message.countDocuments({
          $or: [
            { sender: req.user.userId, recipient: userId },
            { sender: userId, recipient: req.user.userId },
          ],
          isDeleted: false,
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Send a message
router.post(
  "/send",
  auth,
  [
    body("recipientId").isMongoId().withMessage("Invalid recipient ID"),
    body("content")
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Message content must be between 1 and 1000 characters"),
    body("messageType")
      .optional()
      .isIn(["text", "image", "file"])
      .withMessage("Invalid message type"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { recipientId, content, messageType = "text" } = req.body;

      // Verify users are connected
      const Connection = require("../models/Connection");
      const connection = await Connection.findOne({
        $or: [
          {
            requester: req.user.userId,
            recipient: recipientId,
            status: "accepted",
          },
          {
            requester: recipientId,
            recipient: req.user.userId,
            status: "accepted",
          },
        ],
      });

      if (!connection) {
        return res.status(403).json({
          message: "You can only send messages to your connections",
        });
      }

      // Create message
      const message = new Message({
        sender: req.user.userId,
        recipient: recipientId,
        content,
        messageType,
      });

      await message.save();

      // Populate sender and recipient info
      await message.populate("sender", "fullName role");
      await message.populate("recipient", "fullName role");

      res.status(201).json({
        message: "Message sent successfully",
        data: message,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get chat list (users with whom you have conversations)
router.get("/chats", auth, async (req, res) => {
  try {
    // Get all connections
    const Connection = require("../models/Connection");
    const connections = await Connection.find({
      $or: [
        { requester: req.user._id, status: "accepted" },
        { recipient: req.user._id, status: "accepted" },
      ],
    })
      .populate("requester", "fullName role college jobRole companyName")
      .populate("recipient", "fullName role college jobRole companyName");

    // For each connection, get the latest message
    const chats = await Promise.all(
      connections.map(async (connection) => {
        const otherUser =
          connection.requester._id.toString() === req.user._id.toString()
            ? connection.recipient
            : connection.requester;

        const latestMessage = await Message.findOne({
          $or: [
            { sender: req.user._id, recipient: otherUser._id },
            { sender: otherUser._id, recipient: req.user._id },
          ],
          isDeleted: false,
        })
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await Message.countDocuments({
          sender: otherUser._id,
          recipient: req.user.userId,
          isRead: false,
          isDeleted: false,
        });

        return {
          user: otherUser,
          latestMessage: latestMessage
            ? {
                content: latestMessage.content,
                timestamp: latestMessage.createdAt,
                isOwn:
                  latestMessage.sender.toString() === req.user._id.toString(),
              }
            : null,
          unreadCount,
          lastActivity:
            latestMessage?.createdAt ||
            connection.acceptedAt ||
            connection.createdAt,
        };
      })
    );

    // Sort by last activity
    chats.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

    res.json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark messages as read
router.put("/read/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      {
        sender: userId,
        recipient: req.user.userId,
        isRead: false,
        isDeleted: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get unread message count
router.get("/unread-count", auth, async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.user.userId);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
