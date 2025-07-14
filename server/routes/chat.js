const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/chat/send
// @desc    Send a message
// @access  Private
router.post('/send', auth, async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text' } = req.body;
    const senderId = req.user.id;

    // Create new message
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      messageType
    });

    await message.save();

    // Populate sender info
    await message.populate('sender', 'fullName profileImage');

    // Emit real-time message
    req.io.to(receiverId).emit('newMessage', message);

    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/conversations
// @desc    Get user conversations
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all conversations with latest message
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
          deleted: { $ne: true }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user: {
            _id: 1,
            fullName: 1,
            profileImage: 1,
            isOnline: 1,
            lastSeen: 1
          },
          lastMessage: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/:userId
// @desc    Get chat messages with a user
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ],
      deleted: { $ne: true }
    })
      .populate('sender', 'fullName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Mark messages as read
    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        read: false
      },
      {
        $set: { read: true, readAt: new Date() }
      }
    );

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/chat/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/:messageId/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.read = true;
    message.readAt = new Date();
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;