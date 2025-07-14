const express = require('express');
const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/connections/request
// @desc    Send connection request
// @access  Private
router.post('/request', auth, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    // Check if request already exists
    const existingRequest = await ConnectionRequest.findOne({
      sender: senderId,
      receiver: receiverId
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    // Create new connection request
    const connectionRequest = new ConnectionRequest({
      sender: senderId,
      receiver: receiverId,
      message
    });

    await connectionRequest.save();

    // Create notification
    const notification = new Notification({
      user: receiverId,
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${req.user.fullName} sent you a connection request`,
      sender: senderId,
      data: { requestId: connectionRequest._id }
    });

    await notification.save();

    // Emit real-time notification
    req.io.to(receiverId).emit('newConnectionRequest', {
      request: connectionRequest,
      notification
    });

    res.status(201).json({ message: 'Connection request sent successfully' });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/connections/requests/received
// @desc    Get received connection requests
// @access  Private
router.get('/requests/received', auth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      receiver: req.user.id,
      status: 'pending'
    })
      .populate('sender', 'fullName email college branch profileImage')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Get received requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/connections/requests/sent
// @desc    Get sent connection requests
// @access  Private
router.get('/requests/sent', auth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      sender: req.user.id
    })
      .populate('receiver', 'fullName email college branch profileImage')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/connections/request/:id/respond
// @desc    Respond to connection request
// @access  Private
router.put('/request/:id/respond', auth, async (req, res) => {
  try {
    const { status, responseMessage } = req.body;
    const requestId = req.params.id;

    const connectionRequest = await ConnectionRequest.findById(requestId);
    if (!connectionRequest) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Check if user is the receiver
    if (connectionRequest.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update request status
    connectionRequest.status = status;
    connectionRequest.responseMessage = responseMessage;
    connectionRequest.respondedAt = new Date();
    await connectionRequest.save();

    // If accepted, add to connections
    if (status === 'accepted') {
      await User.findByIdAndUpdate(
        connectionRequest.sender,
        { $addToSet: { connections: connectionRequest.receiver } }
      );
      await User.findByIdAndUpdate(
        connectionRequest.receiver,
        { $addToSet: { connections: connectionRequest.sender } }
      );
    }

    // Create notification
    const notification = new Notification({
      user: connectionRequest.sender,
      type: status === 'accepted' ? 'connection_accepted' : 'connection_rejected',
      title: status === 'accepted' ? 'Connection Accepted' : 'Connection Rejected',
      message: `${req.user.fullName} ${status} your connection request`,
      sender: req.user.id,
      data: { requestId: connectionRequest._id }
    });

    await notification.save();

    // Emit real-time notification
    req.io.to(connectionRequest.sender.toString()).emit('connectionResponse', {
      request: connectionRequest,
      notification
    });

    res.json({ message: `Connection request ${status}` });
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/connections
// @desc    Get user connections
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('connections', 'fullName email college branch profileImage isOnline lastSeen');

    res.json({ connections: user.connections });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;