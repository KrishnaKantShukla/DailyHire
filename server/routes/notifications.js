const express = require('express');
const router = express.Router();
const { Notification, User, isConnected, memoryStore } = require('../db');

if (!memoryStore.notifications) memoryStore.notifications = [];

const getDefaultNotifications = (user, userId) => {
  if (!user || userId === 'guest') {
    return [];
  }

  const isWorker = user?.accountType === 'helper' || user?.role === 'helper';
  const name = user?.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`.trim() : (user?.name || 'Valued Member');

  if (isWorker) {
    return [
      {
        userId,
        title: `Welcome to DailyHire Worker Portal, ${name}! 🚀`,
        message: 'Your worker account is active. Manage job requests, update your verification details, and track your daily earnings.',
        type: 'system',
        read: false,
        link: '/dashboard',
        createdAt: new Date(),
      },
    ];
  }

  return [
    {
      userId,
      title: `Welcome to DailyHire, ${name}! 🌟`,
      message: 'Your account is active. Explore 100% ID-verified local daily-wage helpers and manage your service bookings.',
      type: 'system',
      read: false,
      link: '/explore',
      createdAt: new Date(),
    },
  ];
};

// GET /api/notifications/:userId - Get user notifications
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'guest') {
      return res.json({ success: true, notifications: [] });
    }

    if (isConnected()) {
      let notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);

      if (notifications.length === 0) {
        let userDoc = null;
        if (typeof userId === 'string' && userId.match(/^[0-9a-fA-F]{24}$/)) {
          userDoc = await User.findById(userId);
        }
        const defaults = getDefaultNotifications(userDoc, userId);
        if (defaults.length > 0) {
          notifications = await Notification.insertMany(defaults);
        }
      }

      return res.json({ success: true, notifications });
    } else {
      let userMem = memoryStore.users.find((u) => u.id === userId || u._id === userId);
      let notifications = memoryStore.notifications.filter((n) => n.userId === userId);

      if (notifications.length === 0) {
        const defaults = getDefaultNotifications(userMem, userId).map((n, i) => ({
          _id: `n_def_${Date.now()}_${i}`,
          ...n,
        }));
        if (defaults.length > 0) {
          memoryStore.notifications.push(...defaults);
          notifications = defaults;
        }
      }

      return res.json({ success: true, notifications: notifications.reverse().slice(0, 20) });
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const { userId } = req.body;

    if (isConnected()) {
      await Notification.updateMany({ userId }, { read: true });
    } else {
      memoryStore.notifications.forEach((n) => {
        if (n.userId === userId) n.read = true;
      });
    }

    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating notifications' });
  }
});

module.exports = router;
