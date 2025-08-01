const express = require("express");
const { body, query } = require("express-validator");
const Connection = require("../models/Connection");
const User = require("../models/User");
const validate = require("../middleware/validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   PUT /api/connections/:connectionId/accept
// @desc    Accept a connection request
// @access  Private
router.put("/:connectionId/accept", auth, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user._id;

    const connection = await Connection.findById(connectionId).populate([
      {
        path: "requester",
        select: "fullName email college branch year role profilePicture",
      },
      {
        path: "recipient",
        select: "fullName email college branch year role profilePicture",
      },
    ]);

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    if (connection.recipient._id.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Not authorized to accept this connection request",
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "Connection request has already been responded to",
      });
    }

    connection.status = "accepted";
    connection.acceptedAt = new Date();
    await connection.save();

    console.log(
      `✅ New connection accepted: ${connection.requester.fullName} ↔ ${connection.recipient.fullName}`
    );

    // Get socket service instance
    const socketService = req.app.get("socketService");

    if (socketService) {
      const requesterData = {
        connectionId: connection._id,
        user: connection.recipient,
        connectedAt: connection.acceptedAt,
        message: connection.message,
      };

      const recipientData = {
        connectionId: connection._id,
        user: connection.requester,
        connectedAt: connection.acceptedAt,
        message: connection.message,
      };

      // Debug: Check if users are online
      const requesterOnline = socketService.isUserOnline(
        connection.requester._id.toString()
      );
      const recipientOnline = socketService.isUserOnline(
        connection.recipient._id.toString()
      );

      console.log(
        `🔍 Debug - Requester ${connection.requester.fullName} online: ${requesterOnline}`
      );
      console.log(
        `🔍 Debug - Recipient ${connection.recipient.fullName} online: ${recipientOnline}`
      );
      console.log(
        `🔍 Debug - Requester room: user_${connection.requester._id}`
      );
      console.log(
        `🔍 Debug - Recipient room: user_${connection.recipient._id}`
      );

      // Emit connection accepted event first
      socketService.io
        .to(`user_${connection.requester._id}`)
        .emit("connectionAccepted", requesterData);
      socketService.io
        .to(`user_${connection.recipient._id}`)
        .emit("connectionAccepted", recipientData);

      // Then emit new chat available event
      socketService.io
        .to(`user_${connection.requester._id}`)
        .emit("new_chat_available", requesterData);
      socketService.io
        .to(`user_${connection.recipient._id}`)
        .emit("new_chat_available", recipientData);

      console.log(`📡 Socket notifications sent to both users`);
      console.log(
        `📊 Active users count: ${socketService.getActiveUsersCount()}`
      );

      // Send immediate and delayed refresh notifications
      socketService.io
        .to(`user_${connection.requester._id}`)
        .emit("chat_list_refresh");
      socketService.io
        .to(`user_${connection.recipient._id}`)
        .emit("chat_list_refresh");

      // Send another refresh after a delay to ensure it's caught
      setTimeout(() => {
        socketService.io
          .to(`user_${connection.requester._id}`)
          .emit("chat_list_refresh");
        socketService.io
          .to(`user_${connection.recipient._id}`)
          .emit("chat_list_refresh");

        console.log(`🔄 Delayed refresh notifications sent to both users`);
      }, 1000);
    } else {
      console.log(`❌ SocketService not available!`);
    }

    res.json({
      message: "Connection request accepted successfully",
      connection,
    });
  } catch (error) {
    console.error("Accept connection error:", error);
    res.status(500).json({
      message: "Server error accepting connection request",
    });
  }
});

// @route   GET /api/connections/stats
// @desc    Get connection statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Promise.all([
      // Total connections
      Connection.countDocuments({
        $or: [
          { requester: userId, status: "accepted" },
          { recipient: userId, status: "accepted" },
        ],
      }),
      // Pending sent requests
      Connection.countDocuments({
        requester: userId,
        status: "pending",
      }),
      // Pending received requests
      Connection.countDocuments({
        recipient: userId,
        status: "pending",
      }),
      // Connections by role
      Connection.aggregate([
        {
          $match: {
            $or: [
              { requester: userId, status: "accepted" },
              { recipient: userId, status: "accepted" },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "requester",
            foreignField: "_id",
            as: "requesterInfo",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "recipient",
            foreignField: "_id",
            as: "recipientInfo",
          },
        },
        {
          $project: {
            connectedUserRole: {
              $cond: {
                if: { $eq: ["$requester", userId] },
                then: { $arrayElemAt: ["$recipientInfo.role", 0] },
                else: { $arrayElemAt: ["$requesterInfo.role", 0] },
              },
            },
          },
        },
        {
          $group: {
            _id: "$connectedUserRole",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const [totalConnections, pendingSent, pendingReceived, connectionsByRole] =
      stats;

    const roleStats = {
      students: 0,
      alumni: 0,
    };

    connectionsByRole.forEach((item) => {
      if (item._id === "student") roleStats.students = item.count;
      if (item._id === "alumni") roleStats.alumni = item.count;
    });

    res.json({
      totalConnections,
      pendingRequests: {
        sent: pendingSent,
        received: pendingReceived,
      },
      connectionsByRole: roleStats,
    });
  } catch (error) {
    console.error("Get connection stats error:", error);
    res.status(500).json({
      message: "Server error getting connection statistics",
    });
  }
});

// @route   POST /api/connections/send
// @desc    Send a connection request
// @access  Private
router.post(
  "/send",
  [
    auth,
    body("recipientId")
      .isMongoId()
      .withMessage("Valid recipient ID is required"),
    body("message")
      .optional()
      .trim()
      .isLength({ max: 300 })
      .withMessage("Message cannot exceed 300 characters"),
  ],
  validate,
  async (req, res) => {
    try {
      const { recipientId, message } = req.body;
      const requesterId = req.user._id;

      // Check if trying to connect to self
      if (requesterId.toString() === recipientId) {
        return res.status(400).json({
          message: "Cannot send connection request to yourself",
        });
      }

      // Check if recipient exists
      const recipient = await User.findById(recipientId);
      if (!recipient || !recipient.isActive) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check if connection already exists
      const existingConnection = await Connection.connectionExists(
        requesterId,
        recipientId
      );
      if (existingConnection) {
        let statusMessage = "";
        switch (existingConnection.status) {
          case "pending":
            statusMessage =
              existingConnection.requester.toString() === requesterId.toString()
                ? "Connection request already sent"
                : "You have a pending connection request from this user";
            break;
          case "accepted":
            statusMessage = "You are already connected to this user";
            break;
          case "rejected":
            statusMessage = "Connection request was previously rejected";
            break;
          case "blocked":
            statusMessage = "Unable to send connection request";
            break;
        }
        return res.status(400).json({ message: statusMessage });
      }

      // Create new connection request
      const connection = new Connection({
        requester: requesterId,
        recipient: recipientId,
        message: message || "",
      });

      await connection.save();

      // Populate the connection with user details
      await connection.populate([
        {
          path: "requester",
          select: "fullName email college branch year role profilePicture",
        },
        {
          path: "recipient",
          select: "fullName email college branch year role profilePicture",
        },
      ]);

      res.status(201).json({
        message: "Connection request sent successfully",
        connection,
      });
    } catch (error) {
      console.error("Send connection error:", error);
      res.status(500).json({
        message: "Server error sending connection request",
      });
    }
  }
);

// @route   PUT /api/connections/:connectionId/respond
// @desc    Respond to a connection request (accept/reject)
// @access  Private
router.put(
  "/:connectionId/respond",
  [
    auth,
    body("response")
      .isIn(["accept", "reject"])
      .withMessage("Response must be accept or reject"),
  ],
  validate,
  async (req, res) => {
    try {
      const { connectionId } = req.params;
      const { response } = req.body;
      const userId = req.user._id;

      const connection = await Connection.findById(connectionId);

      if (!connection) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      // Check if user is the recipient of this request
      if (connection.recipient.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "Not authorized to respond to this connection request",
        });
      }

      // Check if request is still pending
      if (connection.status !== "pending") {
        return res.status(400).json({
          message: "Connection request has already been responded to",
        });
      }

      // Update connection status
      connection.status = response === "accept" ? "accepted" : "rejected";

      if (response === "accept") {
        connection.acceptedAt = new Date();
      } else {
        connection.rejectedAt = new Date();
      }

      await connection.save();

      // Populate with user details
      await connection.populate([
        {
          path: "requester",
          select: "fullName email college branch year role profilePicture",
        },
        {
          path: "recipient",
          select: "fullName email college branch year role profilePicture",
        },
      ]);

      // If connection was accepted, notify both users that they can now chat
      if (response === "accept") {
        // Get socket service instance
        const socketService = req.app.get("socketService");

        console.log(
          `✅ New connection accepted: ${connection.requester.fullName} ↔ ${connection.recipient.fullName}`
        );
        console.log(`💬 Both users can now chat with each other`);

        // Notify both users via Socket.IO that they have a new chat partner
        if (socketService) {
          const requesterData = {
            connectionId: connection._id,
            user: connection.recipient,
            connectedAt: connection.acceptedAt,
            message: connection.message,
          };

          const recipientData = {
            connectionId: connection._id,
            user: connection.requester,
            connectedAt: connection.acceptedAt,
            message: connection.message,
          };

          // Notify requester
          socketService.io
            .to(`user_${connection.requester._id}`)
            .emit("new_chat_available", requesterData);

          // Notify recipient
          socketService.io
            .to(`user_${connection.recipient._id}`)
            .emit("new_chat_available", recipientData);

          console.log(`� Socket notifications sent to both users`);
        }
      }

      res.json({
        message: `Connection request ${response}ed successfully`,
        connection,
      });
    } catch (error) {
      console.error("Respond to connection error:", error);
      res.status(500).json({
        message: "Server error responding to connection request",
      });
    }
  }
);

// @route   GET /api/connections/requests
// @desc    Get all connection requests (sent and received)
// @access  Private
router.get(
  "/requests",
  [
    auth,
    query("type")
      .optional()
      .isIn(["sent", "received"])
      .withMessage("Type must be sent or received"),
    query("status")
      .optional()
      .isIn(["pending", "accepted", "rejected"])
      .withMessage("Invalid status"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
  ],
  validate,
  async (req, res) => {
    try {
      const { type, status = "pending", page = 1, limit = 20 } = req.query;
      const userId = req.user._id;

      let query = { status };

      // Filter by request type
      if (type === "sent") {
        query.requester = userId;
      } else if (type === "received") {
        query.recipient = userId;
      } else {
        // Get both sent and received
        query.$or = [{ requester: userId }, { recipient: userId }];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const connections = await Connection.find(query)
        .populate(
          "requester",
          "fullName email college branch year role profilePicture companyName jobRole"
        )
        .populate(
          "recipient",
          "fullName email college branch year role profilePicture companyName jobRole"
        )
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      const total = await Connection.countDocuments(query);

      // Add type field to each connection for frontend convenience
      const connectionsWithType = connections.map((conn) => {
        const connObj = conn.toObject();
        connObj.type =
          conn.requester._id.toString() === userId.toString()
            ? "sent"
            : "received";
        return connObj;
      });

      res.json({
        connections: connectionsWithType,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get connection requests error:", error);
      res.status(500).json({
        message: "Server error getting connection requests",
      });
    }
  }
);

// @route   GET /api/connections
// @desc    Get user's accepted connections
// @access  Private
router.get(
  "/",
  [
    auth,
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
  ],
  validate,
  async (req, res) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const userId = req.user._id;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const connections = await Connection.find({
        $or: [
          { requester: userId, status: "accepted" },
          { recipient: userId, status: "accepted" },
        ],
      })
        .populate(
          "requester",
          "fullName email college branch year role profilePicture companyName jobRole bio"
        )
        .populate(
          "recipient",
          "fullName email college branch year role profilePicture companyName jobRole bio"
        )
        .sort({ acceptedAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      const total = await Connection.countDocuments({
        $or: [
          { requester: userId, status: "accepted" },
          { recipient: userId, status: "accepted" },
        ],
      });

      // Format connections to return the other user's details
      const formattedConnections = connections.map((conn) => {
        const isRequester = conn.requester._id.toString() === userId.toString();
        const connectedUser = isRequester ? conn.recipient : conn.requester;

        return {
          connectionId: conn._id,
          user: connectedUser,
          connectedAt: conn.acceptedAt,
          message: conn.message,
        };
      });

      res.json({
        connections: formattedConnections,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get connections error:", error);
      res.status(500).json({
        message: "Server error getting connections",
      });
    }
  }
);

// @route   DELETE /api/connections/:connectionId
// @desc    Remove a connection
// @access  Private
router.delete("/:connectionId", auth, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user._id;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        message: "Connection not found",
      });
    }

    // Check if user is part of this connection
    const isRequester = connection.requester.toString() === userId.toString();
    const isRecipient = connection.recipient.toString() === userId.toString();

    if (!isRequester && !isRecipient) {
      return res.status(403).json({
        message: "Not authorized to remove this connection",
      });
    }

    await Connection.findByIdAndDelete(connectionId);

    res.json({
      message: "Connection removed successfully",
    });
  } catch (error) {
    console.error("Remove connection error:", error);
    res.status(500).json({
      message: "Server error removing connection",
    });
  }
});

module.exports = router;
