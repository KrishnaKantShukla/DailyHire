const express = require('express');
const router = express.Router();
const { Message, Notification, isConnected, memoryStore } = require('../db');

// Memory store fallback array
if (!memoryStore.messages) memoryStore.messages = [];
if (!memoryStore.notifications) memoryStore.notifications = [];

// GET /api/messages/:bookingId - Get messages for a booking
router.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (isConnected()) {
      const messages = await Message.find({ bookingId }).sort({ createdAt: 1 });
      return res.json({ success: true, messages });
    } else {
      const messages = memoryStore.messages.filter((m) => m.bookingId === bookingId);
      return res.json({ success: true, messages });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error fetching messages' });
  }
});

// POST /api/messages - Send a message
router.post('/', async (req, res) => {
  try {
    const { bookingId, senderId, senderName, senderRole, recipientId, content } = req.body;

    if (!bookingId || !senderId || !content) {
      return res.status(400).json({ success: false, message: 'Missing required message parameters' });
    }

    const newMessageData = {
      bookingId,
      senderId,
      senderName: senderName || 'User',
      senderRole: senderRole || 'customer',
      content,
      read: false,
      createdAt: new Date(),
    };

    let savedMessage;

    if (isConnected()) {
      const messageDoc = new Message(newMessageData);
      savedMessage = await messageDoc.save();

      // Create notification for recipient if provided
      if (recipientId) {
        await Notification.create({
          userId: recipientId,
          title: `New message from ${newMessageData.senderName}`,
          message: content.length > 50 ? content.substring(0, 50) + '...' : content,
          type: 'chat',
          link: `/tracking?bookingId=${bookingId}`,
        });
      }
    } else {
      savedMessage = { _id: Date.now().toString(), ...newMessageData };
      memoryStore.messages.push(savedMessage);

      if (recipientId) {
        memoryStore.notifications.push({
          _id: Date.now().toString(),
          userId: recipientId,
          title: `New message from ${newMessageData.senderName}`,
          message: content,
          type: 'chat',
          read: false,
          link: `/tracking?bookingId=${bookingId}`,
          createdAt: new Date(),
        });
      }
    }

    res.status(201).json({ success: true, message: savedMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

module.exports = router;
