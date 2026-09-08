require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const authRoutes = require('./routes/auth');
const helpersRoutes = require('./routes/helpers');
const servicesRoutes = require('./routes/services');
const bookingsRoutes = require('./routes/bookings');
const reviewsRoutes = require('./routes/reviews');
const messagesRoutes = require('./routes/messages');
const paymentsRoutes = require('./routes/payments');
const notificationsRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/helpers', helpersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'DailyHire Express & MongoDB Backend', time: new Date() });
});

// Start Server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(` DailyHire Backend running on http://localhost:${PORT}`);
    console.log(`================================================`);
  });
}

module.exports = app;

