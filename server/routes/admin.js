const express = require('express');
const { User, Helper, Booking, Payment, Review, Notification, isConnected, memoryStore } = require('../db');

const router = express.Router();

// ─── GET /api/admin/stats ───────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    if (isConnected()) {
      const totalUsers = await User.countDocuments({ accountType: 'customer' });
      const totalHelpers = await Helper.countDocuments();
      const pendingApprovals = await Helper.countDocuments({
        $or: [{ verificationStatus: 'pending' }, { verified: false }],
      });
      const verifiedHelpers = await Helper.countDocuments({
        $or: [{ verificationStatus: 'verified' }, { verified: true }],
      });
      const totalBookings = await Booking.countDocuments();

      const payments = await Payment.find({ status: 'completed' });
      const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

      return res.json({
        totalUsers,
        totalHelpers,
        pendingApprovals,
        verifiedHelpers,
        totalBookings,
        totalRevenue,
      });
    }
  } catch (error) {
    console.error('Error fetching admin stats from DB, using fallback:', error.message);
  }

  // Memory Store Fallback
  const totalUsers = memoryStore.users.filter((u) => u.accountType === 'customer' || u.role === 'customer').length;
  const totalHelpers = memoryStore.helpers.length;
  const pendingApprovals = memoryStore.helpers.filter(
    (h) => h.verificationStatus === 'pending' || h.verified === false
  ).length;
  const verifiedHelpers = memoryStore.helpers.filter(
    (h) => h.verificationStatus === 'verified' || h.verified === true
  ).length;
  const totalBookings = memoryStore.bookings.length;
  const totalRevenue = memoryStore.bookings.reduce((acc, curr) => acc + (curr.price || 0), 0);

  return res.json({
    totalUsers,
    totalHelpers,
    pendingApprovals,
    verifiedHelpers,
    totalBookings,
    totalRevenue,
  });
});

// ─── GET /api/admin/helpers ─────────────────────────────────────────────────
router.get('/helpers', async (req, res) => {
  const { status } = req.query;

  try {
    if (isConnected()) {
      let query = {};
      if (status === 'pending') {
        query.$or = [{ verificationStatus: 'pending' }, { verified: false }];
      } else if (status === 'verified') {
        query.verificationStatus = 'verified';
        query.verified = true;
      } else if (status === 'rejected') {
        query.verificationStatus = 'rejected';
      }

      const helpers = await Helper.find(query).sort({ createdAt: -1 });
      return res.json(helpers);
    }
  } catch (error) {
    console.error('Error fetching admin helpers from DB, using fallback:', error.message);
  }

  // Memory Store Fallback
  let helpers = [...memoryStore.helpers];
  if (status === 'pending') {
    helpers = helpers.filter((h) => h.verificationStatus === 'pending' || h.verified === false);
  } else if (status === 'verified') {
    helpers = helpers.filter((h) => h.verificationStatus === 'verified' && h.verified === true);
  } else if (status === 'rejected') {
    helpers = helpers.filter((h) => h.verificationStatus === 'rejected');
  }

  return res.json(helpers);
});

// ─── PATCH /api/admin/helpers/:id/verify ────────────────────────────────────
router.patch('/helpers/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body; // status: 'verified' | 'rejected' | 'pending' | 'unverified'
  const isVerified = status === 'verified';

  try {
    if (isConnected()) {
      const helperOrConditions = [{ customId: id }, { userId: id }, { id: id }];
      if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
        helperOrConditions.push({ _id: id });
      }
      let helper = await Helper.findOne({ $or: helperOrConditions });
      if (!helper && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
        helper = await Helper.findById(id);
      }

      if (helper) {
        helper.verificationStatus = status;
        helper.verified = isVerified;
        await helper.save();

        if (helper.userId) {
          let user = await User.findOne({
            $or: [{ _id: helper.userId }, { customId: helper.userId }, { id: helper.userId }],
          }).catch(() => null);

          if (!user && typeof helper.userId === 'string' && helper.userId.match(/^[0-9a-fA-F]{24}$/)) {
            user = await User.findById(helper.userId).catch(() => null);
          }

          if (user) {
            user.verificationStatus = status;
            await user.save();
          }
        }

        // Sync memory store
        const memHelper = memoryStore.helpers.find(
          (h) =>
            String(h.customId) === String(id) ||
            String(h._id) === String(id) ||
            String(h.id) === String(id) ||
            String(h.userId) === String(id)
        );
        if (memHelper) {
          memHelper.verificationStatus = status;
          memHelper.verified = isVerified;
        }

        try {
          await Notification.create({
            userId: helper.userId || helper._id.toString(),
            title: isVerified ? 'Worker Account Approved! 🎉' : 'Worker Verification Status Update',
            message: isVerified
              ? 'Congratulations! Your worker verification has been approved by the Administrator.'
              : `Your verification status has been set to ${status}.`,
            type: 'system',
            link: '/dashboard',
          });
        } catch (e) {}

        return res.json({
          message: `Worker ${helper.name} has been ${isVerified ? 'APPROVED and published to Explore' : 'updated to ' + status}.`,
          helper,
        });
      }
    }
  } catch (error) {
    console.error('Error verifying worker in DB, updating memory fallback:', error.message);
  }

  // Memory Store Fallback
  const helper = memoryStore.helpers.find(
    (h) =>
      String(h.customId) === String(id) ||
      String(h._id) === String(id) ||
      String(h.id) === String(id) ||
      String(h.userId) === String(id)
  );

  if (!helper) {
    return res.status(404).json({ message: 'Worker profile not found.' });
  }

  helper.verificationStatus = status;
  helper.verified = isVerified;

  return res.json({
    message: `Worker ${helper.name} has been ${isVerified ? 'APPROVED and published to Explore' : 'updated to ' + status}.`,
    helper,
  });
});

// ─── DELETE /api/admin/helpers/:id ──────────────────────────────────────────
router.delete('/helpers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (isConnected()) {
      const helperOrConditions = [{ customId: id }, { userId: id }, { id: id }];
      if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
        helperOrConditions.push({ _id: id });
      }
      await Helper.deleteMany({ $or: helperOrConditions });
    }
  } catch (error) {
    console.error('Error deleting helper from DB:', error.message);
  }

  // Memory Store Fallback
  memoryStore.helpers = memoryStore.helpers.filter(
    (h) =>
      String(h.customId) !== String(id) &&
      String(h._id) !== String(id) &&
      String(h.id) !== String(id) &&
      String(h.userId) !== String(id)
  );

  return res.json({ message: 'Worker profile deleted successfully.' });
});

// ─── GET /api/admin/users ───────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    if (isConnected()) {
      const users = await User.find().sort({ createdAt: -1 }).select('-password');
      return res.json(users);
    }
  } catch (error) {
    console.error('Error fetching admin users from DB:', error.message);
  }

  // Memory Store Fallback
  return res.json(memoryStore.users);
});

// ─── DELETE /api/admin/users/:id ────────────────────────────────────────────
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (isConnected()) {
      if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
        await User.findByIdAndDelete(id);
      } else {
        await User.deleteOne({ $or: [{ _id: id }, { customId: id }] });
      }
    }
  } catch (error) {
    console.error('Error deleting user from DB:', error.message);
  }

  // Memory Store Fallback
  const index = memoryStore.users.findIndex((u) => u._id === id || u.id === id);
  if (index !== -1) {
    memoryStore.users.splice(index, 1);
  }
  return res.json({ message: 'User deleted successfully.' });
});

// ─── GET /api/admin/bookings ────────────────────────────────────────────────
router.get('/bookings', async (req, res) => {
  try {
    if (isConnected()) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.json(bookings);
    }
  } catch (error) {
    console.error('Error fetching admin bookings from DB:', error.message);
  }

  return res.json(memoryStore.bookings);
});

// ─── POST /api/admin/helpers (Create Worker) ────────────────────────────────
router.post('/helpers', async (req, res) => {
  const { name, profession, hourlyRate, phone, bio, skills, verified } = req.body;
  const isVerified = verified !== false;
  const verificationStatus = isVerified ? 'verified' : 'pending';

  const customId = `h_admin_${Date.now()}`;
  const helperData = {
    customId,
    name: name || 'New Worker',
    profession: profession || 'General Helper',
    hourlyRate: Number(hourlyRate) || 85,
    priceRange: `₹${hourlyRate || 85}/hr`,
    phone: phone || '',
    bio: bio || 'Professional daily hire worker added by Administrator.',
    skills: Array.isArray(skills) ? skills : [profession || 'General'],
    verified: isVerified,
    verificationStatus,
    available: true,
    rating: 5.0,
    reviewCount: 0,
    completedJobs: 0,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    location: { lat: 28.6139, lng: 77.209 },
  };

  try {
    if (isConnected()) {
      const helper = await Helper.create(helperData);
      return res.status(201).json({ message: 'Worker profile created successfully.', helper });
    }
  } catch (error) {
    console.error('Error creating helper in DB:', error.message);
  }

  // Memory Store Fallback
  const helperObj = { ...helperData, _id: customId, id: customId };
  memoryStore.helpers.push(helperObj);
  return res.status(201).json({ message: 'Worker profile created in memory store.', helper: helperObj });
});

// ─── PUT /api/admin/helpers/:id (Update Worker) ────────────────────────────
router.put('/helpers/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (isConnected()) {
      let helper = await Helper.findOneAndUpdate({ customId: id }, updateData, { new: true });
      if (!helper && id.match(/^[0-9a-fA-F]{24}$/)) {
        helper = await Helper.findByIdAndUpdate(id, updateData, { new: true });
      }
      if (helper) {
        return res.json({ message: 'Worker profile updated successfully.', helper });
      }
    }
  } catch (error) {
    console.error('Error updating helper in DB:', error.message);
  }

  // Memory Store Fallback
  const helper = memoryStore.helpers.find((h) => h.customId === id || h._id === id || h.id === id);
  if (!helper) {
    return res.status(404).json({ message: 'Worker profile not found.' });
  }

  Object.assign(helper, updateData);
  return res.json({ message: 'Worker profile updated in memory store.', helper });
});

// ─── PATCH /api/admin/bookings/:id/status (Admin Update Booking) ───────────
router.patch('/bookings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (isConnected() && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
      if (booking) {
        return res.json({ message: `Booking status updated to ${status}.`, booking });
      }
    }
  } catch (error) {
    console.error('Error updating booking status in DB:', error.message);
  }

  // Memory Store Fallback
  const booking = memoryStore.bookings.find((b) => b._id === id || b.id === id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }
  booking.status = status;
  return res.json({ message: `Booking status updated to ${status}.`, booking });
});

module.exports = router;
