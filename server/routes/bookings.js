const express = require('express');
const { Booking, Helper, Notification, isConnected, memoryStore } = require('../db');

const router = express.Router();

// ─── GET /api/bookings ───────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { customerId, helperId } = req.query;

    if (isConnected()) {
      let query = {};
      if (customerId) query.customerId = customerId;
      if (helperId) query.helperId = helperId;

      const bookingsList = await Booking.find(query).sort({ createdAt: -1 });

      const formatted = bookingsList.map((b) => ({
        id: b._id.toString(),
        _id: b._id.toString(),
        customerId: b.customerId,
        customerName: b.customerName,
        helperId: b.helperId,
        helperName: b.helperName,
        helperImage: b.helperImage,
        serviceName: b.serviceName,
        price: b.price,
        date: b.date,
        time: b.time,
        status: b.status,
        notes: b.notes,
        address: b.address,
        createdAt: b.createdAt,
      }));

      return res.json(formatted);
    }

    // Memory Store Fallback
    let list = [...memoryStore.bookings];
    if (customerId) list = list.filter((b) => b.customerId === customerId);
    if (helperId) list = list.filter((b) => b.helperId === helperId);
    res.json(list);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.json(memoryStore.bookings);
  }
});

// ─── POST /api/bookings ──────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      helperId,
      helperName,
      helperImage,
      serviceName,
      price,
      date,
      time,
      notes,
      address,
    } = req.body;

    if (!helperId || !serviceName || !price) {
      return res.status(400).json({ message: 'Helper ID, service name, and price are required.' });
    }

    // Self-booking prevention check
    if (customerId && helperId) {
      if (
        customerId === helperId ||
        helperId === `h_${customerId}` ||
        customerId === `u_${helperId}`
      ) {
        return res.status(400).json({ message: 'Self-booking error: You cannot hire or book your own worker profile.' });
      }

      if (isConnected()) {
        const targetHelper = await Helper.findOne({
          $or: [
            { customId: helperId },
            { customId: `h_${customerId}` },
            { userId: customerId },
            { _id: helperId.match(/^[0-9a-fA-F]{24}$/) ? helperId : null },
          ],
        });
        if (targetHelper && (targetHelper.userId === customerId || targetHelper.customId === `h_${customerId}`)) {
          return res.status(400).json({ message: 'Self-booking error: You cannot hire or book your own worker profile.' });
        }
      }
    }

    let imageToSave = helperImage || '';
    let nameToSave = helperName || 'Helper';

    if (isConnected()) {
      if (!imageToSave || !helperName) {
        const helperObj = await Helper.findOne({
          $or: [{ customId: helperId }, { _id: helperId.match(/^[0-9a-fA-F]{24}$/) ? helperId : null }],
        });
        if (helperObj) {
          imageToSave = imageToSave || helperObj.image;
          nameToSave = helperName || helperObj.name;
        }
      }

      const newBooking = await Booking.create({
        customerId: customerId || 'guest',
        customerName: customerName || 'Customer',
        helperId,
        helperName: nameToSave,
        helperImage: imageToSave,
        serviceName,
        price: Number(price),
        date: date || 'Today',
        time: time || '10:00 AM',
        notes: notes || '',
        address: address || '',
        status: 'pending',
      });

      // Targeted notification for Customer
      await Notification.create({
        userId: newBooking.customerId,
        title: 'Booking Requested 🎉',
        message: `Your booking request for ${serviceName} with ${nameToSave} has been submitted!`,
        type: 'booking',
        read: false,
        link: '/dashboard',
      }).catch(() => {});

      // Targeted notification for Helper
      await Notification.create({
        userId: helperId,
        title: 'New Job Opportunity! 💼',
        message: `You received a new booking request for ${serviceName} from ${customerName || 'a customer'}.`,
        type: 'booking',
        read: false,
        link: '/dashboard',
      }).catch(() => {});

      return res.status(201).json({
        message: 'Booking created successfully',
        booking: {
          id: newBooking._id.toString(),
          _id: newBooking._id.toString(),
          customerId: newBooking.customerId,
          customerName: newBooking.customerName,
          helperId: newBooking.helperId,
          helperName: newBooking.helperName,
          helperImage: newBooking.helperImage,
          serviceName: newBooking.serviceName,
          price: newBooking.price,
          date: newBooking.date,
          time: newBooking.time,
          status: newBooking.status,
          notes: newBooking.notes,
          address: newBooking.address,
        },
      });
    }

    // Memory store fallback creation
    const fallbackBooking = {
      id: `b_${Date.now()}`,
      _id: `b_${Date.now()}`,
      customerId: customerId || 'guest',
      customerName: customerName || 'Customer',
      helperId,
      helperName: nameToSave,
      helperImage: imageToSave || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      serviceName,
      price: Number(price),
      date: date || 'Today',
      time: time || '10:00 AM',
      notes: notes || '',
      address: address || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    memoryStore.bookings.unshift(fallbackBooking);

    if (!memoryStore.notifications) memoryStore.notifications = [];
    memoryStore.notifications.push(
      {
        _id: `n_c_${Date.now()}`,
        userId: fallbackBooking.customerId,
        title: 'Booking Requested 🎉',
        message: `Your booking request for ${serviceName} with ${nameToSave} has been submitted!`,
        type: 'booking',
        read: false,
        link: '/dashboard',
        createdAt: new Date(),
      },
      {
        _id: `n_h_${Date.now()}`,
        userId: helperId,
        title: 'New Job Opportunity! 💼',
        message: `You received a new booking request for ${serviceName} from ${customerName || 'a customer'}.`,
        type: 'booking',
        read: false,
        link: '/dashboard',
        createdAt: new Date(),
      }
    );

    res.status(201).json({
      message: 'Booking created successfully',
      booking: fallbackBooking,
    });
  } catch (error) {
    console.error('Booking creation error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to create booking.' });
  }
});

// ─── PATCH /api/bookings/:id/status ─────────────────────────────────────────
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status.' });
    }

    const createStatusNotifications = async (b) => {
      let custTitle = `Booking Status Updated: ${status.toUpperCase()}`;
      let custMsg = `Your booking status for ${b.serviceName} has been updated to ${status}.`;
      let helpTitle = `Booking Status Updated: ${status.toUpperCase()}`;
      let helpMsg = `The booking for ${b.serviceName} has been updated to ${status}.`;

      if (status === 'confirmed') {
        custTitle = 'Booking Confirmed! ✅';
        custMsg = `${b.helperName || 'Worker'} has accepted your booking request for ${b.serviceName}.`;
        helpTitle = 'Booking Confirmed! 🚀';
        helpMsg = `You have confirmed the booking for ${b.serviceName} with ${b.customerName || 'customer'}.`;
      } else if (status === 'completed') {
        custTitle = 'Service Completed ✨';
        custMsg = `Your service for ${b.serviceName} by ${b.helperName || 'Worker'} is completed.`;
        helpTitle = 'Job Completed & Earnings Ready 💰';
        helpMsg = `Great work! Booking for ${b.serviceName} marked completed. Earnings added.`;
      } else if (status === 'cancelled') {
        custTitle = 'Booking Cancelled ℹ️';
        custMsg = `Your booking for ${b.serviceName} with ${b.helperName || 'Worker'} was cancelled.`;
        helpTitle = 'Booking Cancelled ℹ️';
        helpMsg = `The booking for ${b.serviceName} with ${b.customerName || 'customer'} was cancelled.`;
      }

      if (isConnected()) {
        await Notification.create({
          userId: b.customerId,
          title: custTitle,
          message: custMsg,
          type: 'booking',
          read: false,
          link: '/dashboard',
        }).catch(() => {});
        await Notification.create({
          userId: b.helperId,
          title: helpTitle,
          message: helpMsg,
          type: 'booking',
          read: false,
          link: '/dashboard',
        }).catch(() => {});
      } else {
        if (!memoryStore.notifications) memoryStore.notifications = [];
        memoryStore.notifications.push(
          {
            _id: `n_sc_${Date.now()}`,
            userId: b.customerId,
            title: custTitle,
            message: custMsg,
            type: 'booking',
            read: false,
            link: '/dashboard',
            createdAt: new Date(),
          },
          {
            _id: `n_sh_${Date.now()}`,
            userId: b.helperId,
            title: helpTitle,
            message: helpMsg,
            type: 'booking',
            read: false,
            link: '/dashboard',
            createdAt: new Date(),
          }
        );
      }
    };

    if (isConnected() && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
      if (booking) {
        await createStatusNotifications(booking);
        return res.json({
          message: `Booking status updated to ${status}`,
          booking: { id: booking._id.toString(), status: booking.status },
        });
      }
    }

    // Memory store fallback status update
    const memBooking = memoryStore.bookings.find((b) => b.id === id || b._id === id);
    if (memBooking) {
      memBooking.status = status;
      await createStatusNotifications(memBooking);
      return res.json({
        message: `Booking status updated to ${status}`,
        booking: memBooking,
      });
    }

    res.status(404).json({ message: 'Booking not found.' });
  } catch (error) {
    console.error('Error updating booking status:', error.message);
    res.status(500).json({ message: 'Failed to update booking status.' });
  }
});

module.exports = router;
