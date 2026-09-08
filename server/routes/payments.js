const express = require('express');
const router = express.Router();
const { Payment, Booking, Notification, isConnected, memoryStore } = require('../db');

if (!memoryStore.payments) memoryStore.payments = [];
if (!memoryStore.notifications) memoryStore.notifications = [];

// POST /api/payments/checkout - Process simulated booking payment
router.post('/checkout', async (req, res) => {
  try {
    const { bookingId, customerId, helperId, amount, paymentMethod } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ success: false, message: 'Booking ID and amount are required' });
    }

    const transactionId = 'TXN_' + Date.now() + Math.floor(1000 + Math.random() * 9000);

    const paymentData = {
      bookingId,
      customerId: customerId || 'cust_1',
      helperId: helperId || '1',
      amount: Number(amount),
      paymentMethod: paymentMethod || 'upi',
      status: 'completed',
      transactionId,
      receiptUrl: `/invoice/${transactionId}`,
      createdAt: new Date(),
    };

    let savedPayment;

    if (isConnected()) {
      const paymentDoc = new Payment(paymentData);
      savedPayment = await paymentDoc.save();

      // Update booking status to confirmed if found
      if (typeof bookingId === 'string' && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
        await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' }).catch(() => {});
      }

      // Notify customer and helper
      await Notification.create({
        userId: customerId || 'cust_1',
        title: 'Payment Successful',
        message: `Your payment of ₹${amount} for booking #${bookingId} was successful (${transactionId}).`,
        type: 'payment',
        link: `/dashboard`,
      });

      await Notification.create({
        userId: helperId || '1',
        title: 'New Paid Booking',
        message: `Payment of ₹${amount} received for booking #${bookingId}.`,
        type: 'payment',
        link: `/dashboard`,
      });
    } else {
      savedPayment = { _id: 'pay_' + Date.now(), ...paymentData };
      memoryStore.payments.push(savedPayment);

      const booking = memoryStore.bookings.find((b) => b._id === bookingId || b.id === bookingId);
      if (booking) booking.status = 'confirmed';

      if (!memoryStore.notifications) memoryStore.notifications = [];
      memoryStore.notifications.push(
        {
          _id: `n_pay_c_${Date.now()}`,
          userId: customerId || 'cust_1',
          title: 'Payment Successful',
          message: `Your payment of ₹${amount} for booking #${bookingId} was successful (${transactionId}).`,
          type: 'payment',
          read: false,
          link: '/dashboard',
          createdAt: new Date(),
        },
        {
          _id: `n_pay_h_${Date.now()}`,
          userId: helperId || '1',
          title: 'New Paid Booking',
          message: `Payment of ₹${amount} received for booking #${bookingId}.`,
          type: 'payment',
          read: false,
          link: '/dashboard',
          createdAt: new Date(),
        }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      payment: savedPayment,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
});

// GET /api/payments/booking/:bookingId - Fetch payment details for a booking
router.get('/booking/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (isConnected()) {
      const payment = await Payment.findOne({ bookingId });
      return res.json({ success: true, payment });
    } else {
      const payment = memoryStore.payments.find((p) => p.bookingId === bookingId);
      return res.json({ success: true, payment });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payment record' });
  }
});

// GET /api/payments/helper/:helperId/analytics - Financial summary for helper
router.get('/helper/:helperId/analytics', async (req, res) => {
  try {
    const { helperId } = req.params;

    let payments = [];
    if (isConnected()) {
      payments = await Payment.find({ helperId, status: 'completed' });
    } else {
      payments = memoryStore.payments.filter((p) => p.helperId === helperId && p.status === 'completed');
    }

    const totalEarnings = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const completedJobs = payments.length;

    // Monthly breakdown data for charts
    const monthlyData = [
      { name: 'Mon', revenue: totalEarnings > 0 ? Math.round(totalEarnings * 0.15) : 1200 },
      { name: 'Tue', revenue: totalEarnings > 0 ? Math.round(totalEarnings * 0.2) : 1800 },
      { name: 'Wed', revenue: totalEarnings > 0 ? Math.round(totalEarnings * 0.1) : 950 },
      { name: 'Thu', revenue: totalEarnings > 0 ? Math.round(totalEarnings * 0.25) : 2400 },
      { name: 'Fri', revenue: totalEarnings > 0 ? Math.round(totalEarnings * 0.18) : 1750 },
      { name: 'Sat', revenue: totalEarnings > 0 ? Math.round(totalEarnings * 0.12) : 1100 },
      { name: 'Sun', revenue: totalEarnings > 0 ? Math.round(totalEarnings * 0.0) : 0 },
    ];

    res.json({
      success: true,
      analytics: {
        totalEarnings: totalEarnings || 8200,
        completedJobs: completedJobs || 14,
        pendingPayout: 1450,
        weeklyChart: monthlyData,
        transactions: payments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching helper analytics' });
  }
});

module.exports = router;
