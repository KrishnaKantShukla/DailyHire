const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dailyhire';

// ─── Initial Memory Fallback Seed ────────────────────────────────────────────

const memoryStore = {
  helpers: [],

  services: [
    { customId: '1', _id: '1', name: 'Basic Inspection', description: 'Quick inspection and diagnosis', basePrice: 120, duration: '30 min' },
    { customId: '2', _id: '2', name: 'Standard Repair', description: 'Common repairs and fixes', basePrice: 250, duration: '1-2 hrs' },
    { customId: '3', _id: '3', name: 'Full Service', description: 'Complete service package', basePrice: 450, duration: '2-4 hrs' },
    { customId: '4', _id: '4', name: 'Emergency Service', description: '24/7 emergency assistance', basePrice: 350, duration: 'ASAP' },
  ],
  users: [],
  bookings: [],
  reviews: [],
};

// ─── Schemas ─────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: '' },
    googleId: { type: String, default: '' },
    avatar: { type: String, default: '' },
    accountType: { type: String, enum: ['customer', 'helper'], default: 'customer' },
    phone: { type: String, default: '' },
    profession: { type: String, default: '' },
    experience: { type: String, default: '' },
    hourlyRate: { type: Number, default: 0 },
    skills: [{ type: String }],
    bio: { type: String, default: '' },
    // Worker verification & payout details
    govIdType: { type: String, default: '' },
    govIdNumber: { type: String, default: '' },
    govIdProofUrl: { type: String, default: '' },
    bankName: { type: String, default: '' },
    accountHolderName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    upiId: { type: String, default: '' },
    verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
  },
  { timestamps: true }
);

const HelperSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true },
    userId: { type: String, default: '' },
    name: { type: String, required: true },
    profession: { type: String, required: true },
    image: { type: String, default: '' },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    distance: { type: String, default: '1.0 km' },
    priceRange: { type: String, default: '₹80-120/hr' },
    hourlyRate: { type: Number, default: 80 },
    available: { type: Boolean, default: true },
    verified: { type: Boolean, default: true },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    completedJobs: { type: Number, default: 0 },
    location: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
    phone: { type: String, default: '' },
    govIdType: { type: String, default: '' },
    govIdNumber: { type: String, default: '' },
    govIdProofUrl: { type: String, default: '' },
    bankName: { type: String, default: '' },
    accountHolderName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    upiId: { type: String, default: '' },
    verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

const ServiceSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    basePrice: { type: Number, required: true },
    duration: { type: String, default: '1 hr' },
  },
  { timestamps: true }
);

const BookingSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    customerName: { type: String, default: 'Customer' },
    helperId: { type: String, required: true },
    helperName: { type: String, required: true },
    helperImage: { type: String, default: '' },
    serviceName: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, default: '10:00 AM' },
    notes: { type: String, default: '' },
    address: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const ReviewSchema = new mongoose.Schema(
  {
    helperId: { type: String, required: true },
    userName: { type: String, required: true },
    userImage: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, default: 'Recently' },
  },
  { timestamps: true }
);

const MessageSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, default: 'User' },
    senderRole: { type: String, enum: ['customer', 'helper'], default: 'customer' },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true },
    customerId: { type: String, required: true },
    helperId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['upi', 'card', 'cod', 'netbanking'], default: 'upi' },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
    transactionId: { type: String, required: true },
    receiptUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['booking', 'chat', 'payment', 'system'], default: 'booking' },
    read: { type: Boolean, default: false },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

// ─── Models ──────────────────────────────────────────────────────────────────

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Helper = mongoose.models.Helper || mongoose.model('Helper', HelperSchema);
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

let isMongoConnected = false;

const seedInitialData = async () => {
  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0 && memoryStore.services.length > 0) {
      console.log('Seeding initial services dataset into MongoDB...');
      const servicesToSeed = memoryStore.services.map(({ _id, ...rest }) => rest);
      await Service.insertMany(servicesToSeed);
    }
  } catch (error) {
    console.error('Error seeding initial MongoDB data:', error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });

    isMongoConnected = true;

    console.log(`MongoDB Connected successfully to ${MONGODB_URI}`);

    // Automatic seeding of initial helpers & services dataset into MongoDB
    await seedInitialData();


  } catch (error) {
    isMongoConnected = false;

    console.log(
      `MongoDB connection offline (${error.message}). Operating using in-memory store fallback.`
    );
  }
};

module.exports = {
  connectDB,
  isConnected: () => mongoose.connection.readyState === 1 || isMongoConnected,
  memoryStore,
  User,
  Helper,
  Service,
  Booking,
  Review,
  Message,
  Payment,
  Notification,
};
