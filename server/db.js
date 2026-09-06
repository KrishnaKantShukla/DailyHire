const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dailyhire';

// ─── Initial Memory Fallback Seed ────────────────────────────────────────────

const memoryStore = {
  helpers: [
    {
      customId: '1',
      _id: '1',
      name: 'Rahul Sharma',
      profession: 'Plumber',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 127,
      distance: '0.8 km',
      priceRange: '₹400-600/hr',
      hourlyRate: 450,
      available: true,
      verified: true,
      bio: 'Licensed master plumber with 12 years of experience. Specializing in emergency repairs, pipe installations, and bathroom renovations.',
      skills: ['Pipe Repair', 'Water Heater', 'Drain Cleaning', 'Bathroom Installation'],
      completedJobs: 342,
      location: { lat: 28.6139, lng: 77.209 },
    },
    {
      customId: '2',
      _id: '2',
      name: 'Priya Patel',
      profession: 'Electrician',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 89,
      distance: '1.2 km',
      priceRange: '₹500-800/hr',
      hourlyRate: 550,
      available: true,
      verified: true,
      bio: 'Certified electrician specializing in residential and commercial electrical work. Safety is my top priority.',
      skills: ['Wiring', 'Panel Upgrades', 'Lighting', 'Troubleshooting'],
      completedJobs: 256,
      location: { lat: 28.6159, lng: 77.207 },
    },
    {
      customId: '3',
      _id: '3',
      name: 'Amit Kumar',
      profession: 'Carpenter',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      rating: 4.7,
      reviewCount: 64,
      distance: '1.5 km',
      priceRange: '₹350-550/hr',
      hourlyRate: 400,
      available: false,
      verified: true,
      bio: 'Skilled carpenter with expertise in custom furniture, cabinetry, and home renovations.',
      skills: ['Custom Furniture', 'Cabinetry', 'Deck Building', 'Repairs'],
      completedJobs: 189,
      location: { lat: 28.6119, lng: 77.211 },
    },
    {
      customId: '4',
      _id: '4',
      name: 'Sneha Gupta',
      profession: 'Cleaner',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      rating: 5.0,
      reviewCount: 203,
      distance: '0.5 km',
      priceRange: '₹250-400/hr',
      hourlyRate: 300,
      available: true,
      verified: true,
      bio: 'Professional cleaner providing deep cleaning, move-in/out cleaning, and regular maintenance services.',
      skills: ['Deep Cleaning', 'Move-in/out', 'Office Cleaning', 'Sanitization'],
      completedJobs: 512,
      location: { lat: 28.6149, lng: 77.208 },
    },
    {
      customId: '5',
      _id: '5',
      name: 'Vikram Singh',
      profession: 'Mechanic',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      rating: 4.6,
      reviewCount: 78,
      distance: '2.1 km',
      priceRange: '₹450-700/hr',
      hourlyRate: 500,
      available: true,
      verified: false,
      bio: 'ASE certified mechanic offering on-site repairs and maintenance for all vehicle makes and models.',
      skills: ['Engine Repair', 'Brake Service', 'Oil Change', 'Diagnostics'],
      completedJobs: 167,
      location: { lat: 28.6169, lng: 77.205 },
    },
    {
      customId: '6',
      _id: '6',
      name: 'Anjali Desai',
      profession: 'AC Repair',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 112,
      distance: '1.8 km',
      priceRange: '₹550-850/hr',
      hourlyRate: 600,
      available: true,
      verified: true,
      bio: 'HVAC specialist with expertise in AC installation, repair, and maintenance for residential and commercial units.',
      skills: ['AC Installation', 'Repair', 'Maintenance', 'Duct Cleaning'],
      completedJobs: 298,
      location: { lat: 28.6129, lng: 77.206 },
    },
  ],
  services: [
    { customId: '1', _id: '1', name: 'Basic Inspection', description: 'Quick inspection and diagnosis', basePrice: 300, duration: '30 min' },
    { customId: '2', _id: '2', name: 'Standard Repair', description: 'Common repairs and fixes', basePrice: 750, duration: '1-2 hrs' },
    { customId: '3', _id: '3', name: 'Full Service', description: 'Complete service package', basePrice: 1500, duration: '2-4 hrs' },
    { customId: '4', _id: '4', name: 'Emergency Service', description: '24/7 emergency assistance', basePrice: 1000, duration: 'ASAP' },
  ],
  users: [],
  bookings: [],
  reviews: [
    {
      _id: 'r1',
      helperId: '1',
      userName: 'Aman D.',
      userImage: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      comment: 'Excellent work! Fixed my leaky faucet in no time. Very professional and clean.',
      date: '2 days ago',
    },
  ],
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
    verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified'], default: 'unverified' },
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
    priceRange: { type: String, default: '₹400-600/hr' },
    hourlyRate: { type: Number, default: 450 },
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
    verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified'], default: 'pending' },
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
    const helperCount = await Helper.countDocuments();
    if (helperCount === 0) {
      console.log('Seeding initial helpers dataset into MongoDB...');
      const helpersToSeed = memoryStore.helpers.map(({ _id, ...rest }) => rest);
      await Helper.insertMany(helpersToSeed);
    }

    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('Seeding initial services dataset into MongoDB...');
      const servicesToSeed = memoryStore.services.map(({ _id, ...rest }) => rest);
      await Service.insertMany(servicesToSeed);
    }

    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log('Seeding initial reviews dataset into MongoDB...');
      const reviewsToSeed = memoryStore.reviews.map(({ _id, ...rest }) => rest);
      await Review.insertMany(reviewsToSeed);
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
    await seedInitialData();
  } catch (error) {
    isMongoConnected = false;
    console.log(`MongoDB connection offline (${error.message}). Operating using in-memory store fallback.`);
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
