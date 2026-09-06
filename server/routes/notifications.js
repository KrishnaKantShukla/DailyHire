const express = require('express');
const router = express.Router();
const { Notification, User, isConnected, memoryStore } = require('../db');

if (!memoryStore.notifications) memoryStore.notifications = [];

const getDefaultNotifications = (user, userId) => {
  const isWorker = user?.accountType === 'helper' || user?.role === 'helper';
  const name = user?.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`.trim() : 'Valued Member';

  if (isWorker) {
    return [
      {
        userId,
        title: `Welcome to DailyHire Worker Portal, ${name}! 🚀`,
        message: 'Welcome aboard! Showcase your skills with pride, deliver outstanding service, and build a stellar reputation to attract top employers.',
        type: 'system',
        read: false,
        link: '/dashboard',
        createdAt: new Date(),
      },
      {
        userId,
        title: 'Earn Money & Instant Payouts 💰',
        message: 'Turn your hard work into daily earnings. Complete jobs seamlessly and receive instant 60-second direct bank & UPI deposits.',
        type: 'payment',
        read: false,
        link: '/dashboard',
        createdAt: new Date(Date.now() - 1800000),
      },
      {
        userId,
        title: 'Maximize Your Hiring Potential ⭐',
        message: 'Express yourself in a professional manner: complete your bio, skills, and verification details to get verified badges and get hired faster.',
        type: 'booking',
        read: false,
        link: '/dashboard',
        createdAt: new Date(Date.now() - 3600000),
      },
    ];
  }

  return [
    {
      userId,
      title: `Welcome to DailyHire, ${name}! 🌟`,
      message: 'We are delighted to have you here. Discover top-rated, 100% ID-verified local service professionals ready to serve you with excellence and care.',
      type: 'system',
      read: false,
      link: '/explore',
      createdAt: new Date(),
    },
    {
      userId,
      title: 'Special Welcome Offer 🎁',
      message: 'Enjoy up to 10% OFF on your first hiring! Book nearby plumbers, electricians, cleaners & mechanics with zero hidden fees.',
      type: 'system',
      read: false,
      link: '/explore',
      createdAt: new Date(Date.now() - 1800000),
    },
    {
      userId,
      title: 'Your Peace of Mind & Safety 🛡️',
      message: 'Every worker is 2-step government ID verified for your security. Experience transparent pricing and 30-minute doorstep service.',
      type: 'booking',
      read: false,
      link: '/safety',
      createdAt: new Date(Date.now() - 3600000),
    },
  ];
};

// GET /api/notifications/:userId - Get user notifications
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (isConnected()) {
      let notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);

      if (notifications.length === 0) {
        let userDoc = null;
        if (typeof userId === 'string' && userId.match(/^[0-9a-fA-F]{24}$/)) {
          userDoc = await User.findById(userId);
        }
        const defaults = getDefaultNotifications(userDoc, userId);
        notifications = await Notification.insertMany(defaults);
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
        memoryStore.notifications.push(...defaults);
        notifications = defaults;
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
