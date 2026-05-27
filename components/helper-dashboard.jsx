'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee,
  TrendingUp,
  Calendar,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Settings,
  User,
  Briefcase,
  ChevronRight,
  X,
  ArrowUpRight,
  Wrench,
  Droplets,
  Zap,
  Home,
  Phone,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SERVICE_ICONS = { Wrench, Droplets, Zap, Home };

const EARNING_HISTORY = {
  today: [
    { id: 't1', customer: 'Ravi Sharma', service: 'Pipe Repair', location: 'Sector 12, Noida', time: '9:30 AM', duration: '1.5 hrs', amount: 95, status: 'completed', icon: 'Wrench' },
    { id: 't2', customer: 'Priya Mehta', service: 'Drain Cleaning', location: 'DLF Phase 2', time: '11:45 AM', duration: '1 hr', amount: 80, status: 'completed', icon: 'Droplets' },
    { id: 't3', customer: 'Anil Verma', service: 'Electrical Fitting', location: 'Vasant Kunj', time: '2:00 PM', duration: '0.5 hrs', amount: 70, status: 'completed', icon: 'Zap' },
  ],
  week: [
    { id: 'w1', customer: 'Sunita Roy', service: 'Home Cleaning', location: 'Lajpat Nagar', time: 'Mon 10:00 AM', duration: '3 hrs', amount: 240, status: 'completed', icon: 'Home' },
    { id: 'w2', customer: 'Deepak Kumar', service: 'Pipe Repair', location: 'Saket', time: 'Tue 1:00 PM', duration: '2 hrs', amount: 180, status: 'completed', icon: 'Wrench' },
    { id: 'w3', customer: 'Kavita Joshi', service: 'Drain Cleaning', location: 'Dwarka Sec 7', time: 'Wed 9:00 AM', duration: '1 hr', amount: 80, status: 'completed', icon: 'Droplets' },
    { id: 'w4', customer: 'Manish Gupta', service: 'Electrical Fitting', location: 'Rohini', time: 'Wed 3:30 PM', duration: '1.5 hrs', amount: 130, status: 'completed', icon: 'Zap' },
    { id: 'w5', customer: 'Ravi Sharma', service: 'Pipe Repair', location: 'Sector 12, Noida', time: 'Thu 9:30 AM', duration: '1.5 hrs', amount: 95, status: 'completed', icon: 'Wrench' },
    { id: 'w6', customer: 'Priya Mehta', service: 'Drain Cleaning', location: 'DLF Phase 2', time: 'Thu 11:45 AM', duration: '1 hr', amount: 80, status: 'completed', icon: 'Droplets' },
    { id: 'w7', customer: 'Anil Verma', service: 'Electrical Fitting', location: 'Vasant Kunj', time: 'Fri 2:00 PM', duration: '0.5 hrs', amount: 70, status: 'completed', icon: 'Zap' },
    { id: 'w8', customer: 'Neha Singh', service: 'Home Cleaning', location: 'Pitampura', time: 'Sat 8:00 AM', duration: '2 hrs', amount: 165, status: 'completed', icon: 'Home' },
    { id: 'w9', customer: 'Vikram Bose', service: 'Pipe Repair', location: 'Karol Bagh', time: 'Sat 12:00 PM', duration: '1 hr', amount: 100, status: 'cancelled', icon: 'Wrench' },
    { id: 'w10', customer: 'Anjali Das', service: 'Electrical Fitting', location: 'Janakpuri', time: 'Sun 4:00 PM', duration: '1 hr', amount: 100, status: 'completed', icon: 'Zap' },
  ],
  month: [
    { id: 'm1', customer: 'Ritu Agarwal', service: 'Home Cleaning', location: 'Mayur Vihar', time: '1 May', duration: '3 hrs', amount: 270, status: 'completed', icon: 'Home' },
    { id: 'm2', customer: 'Sanjay Tiwari', service: 'Pipe Repair', location: 'Indirapuram', time: '3 May', duration: '2 hrs', amount: 190, status: 'completed', icon: 'Wrench' },
    { id: 'm3', customer: 'Pooja Nair', service: 'Noida Sec 18', time: '5 May', duration: '1.5 hrs', amount: 120, status: 'completed', icon: 'Droplets' },
    { id: 'm4', customer: 'Rahul Singh', service: 'Electrical Fitting', location: 'Greater Noida', time: '8 May', duration: '2 hrs', amount: 175, status: 'completed', icon: 'Zap' },
    { id: 'm5', customer: 'Meena Sharma', service: 'Home Cleaning', location: 'Faridabad', time: '10 May', duration: '2.5 hrs', amount: 220, status: 'completed', icon: 'Home' },
    { id: 'm6', customer: 'Arjun Malhotra', service: 'Pipe Repair', location: 'Gurugram', time: '12 May', duration: '1 hr', amount: 90, status: 'cancelled', icon: 'Wrench' },
    { id: 'm7', customer: 'Shilpa Iyer', service: 'Drain Cleaning', location: 'Sarita Vihar', time: '14 May', duration: '1 hr', amount: 80, status: 'completed', icon: 'Droplets' },
    { id: 'm8', customer: 'Vishal Rao', service: 'Electrical Fitting', location: 'RK Puram', time: '16 May', duration: '1.5 hrs', amount: 145, status: 'completed', icon: 'Zap' },
    { id: 'm9', customer: 'Sunita Roy', service: 'Home Cleaning', location: 'Lajpat Nagar', time: '18 May', duration: '3 hrs', amount: 240, status: 'completed', icon: 'Home' },
    { id: 'm10', customer: 'Deepak Kumar', service: 'Pipe Repair', location: 'Saket', time: '19 May', duration: '2 hrs', amount: 180, status: 'completed', icon: 'Wrench' },
    { id: 'm11', customer: 'Kavita Joshi', service: 'Drain Cleaning', location: 'Dwarka Sec 7', time: '20 May', duration: '1 hr', amount: 80, status: 'completed', icon: 'Droplets' },
    { id: 'm12', customer: 'Manish Gupta', service: 'Electrical Fitting', location: 'Rohini', time: '20 May', duration: '1.5 hrs', amount: 130, status: 'completed', icon: 'Zap' },
    { id: 'm13', customer: 'Ravi Sharma', service: 'Pipe Repair', location: 'Sector 12, Noida', time: '21 May', duration: '1.5 hrs', amount: 95, status: 'completed', icon: 'Wrench' },
    { id: 'm14', customer: 'Priya Mehta', service: 'Drain Cleaning', location: 'DLF Phase 2', time: '21 May', duration: '1 hr', amount: 80, status: 'completed', icon: 'Droplets' },
    { id: 'm15', customer: 'Anil Verma', service: 'Electrical Fitting', location: 'Vasant Kunj', time: '21 May', duration: '0.5 hrs', amount: 70, status: 'completed', icon: 'Zap' },
  ],
  pending: [
    { id: 'p1', customer: 'Nisha Kapoor', service: 'Home Cleaning', location: 'Rohini Sec 9', time: 'Tomorrow 10:00 AM', duration: '2.5 hrs', amount: 100, status: 'pending', icon: 'Home' },
    { id: 'p2', customer: 'Tarun Bhatia', service: 'Pipe Repair', location: 'Gurgaon Sec 56', time: 'Tomorrow 3:00 PM', duration: '1 hr', amount: 80, status: 'pending', icon: 'Wrench' },
  ],
};

const EARNINGS_META = {
  today: { label: "Today's Earnings", total: 245, change: '+12%', positive: true, icon: 'IndianRupee', color: 'green', historyKey: 'today' },
  week: { label: 'This Week', total: 1240, change: '+8%', positive: true, icon: 'TrendingUp', color: 'primary', historyKey: 'week' },
  month: { label: 'This Month', total: 4850, change: '+5%', positive: true, icon: 'Calendar', color: 'accent', historyKey: 'month' },
  pending: { label: 'Pending Payout', total: 180, change: null, positive: null, icon: 'Clock', color: 'muted', historyKey: 'pending' },
};

const INITIAL_REQUESTS = [
  {
    id: '1',
    customerName: 'John Smith',
    customerImage: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop&crop=face',
    service: 'Pipe Repair',
    location: '123 Main St, Apt 4B',
    fullAddress: '123 Main Street, Apartment 4B, Sector 15, New Delhi – 110001',
    landmark: 'Near Green Park Metro Station',
    phone: '+91 98765 43210',
    distance: '1.2 km',
    price: 75,
    time: '2:30 PM',
    duration: '1.5 hrs',
    urgency: 'high',
    notes: 'Kitchen sink pipe is leaking badly, water is spreading on the floor. Please bring waterproof sealant.',
    status: 'pending',
  },
  {
    id: '2',
    customerName: 'Maria Garcia',
    customerImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    service: 'Drain Cleaning',
    location: '456 Oak Ave',
    fullAddress: '456 Oak Avenue, Flat 2C, Vasant Vihar, New Delhi – 110057',
    landmark: 'Opposite DDA Market, behind HDFC Bank',
    phone: '+91 91234 56789',
    distance: '2.5 km',
    price: 50,
    time: '4:00 PM',
    duration: '1 hr',
    urgency: 'medium',
    notes: 'Bathroom drain is very slow, probably blocked with hair. Have tried using a plunger but it hasn\'t worked.',
    status: 'pending',
  },
  {
    id: '3',
    customerName: 'Robert Johnson',
    customerImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face',
    service: 'Water Heater Fix',
    location: '789 Pine Rd',
    fullAddress: '789 Pine Road, Villa 7, South Extension Part II, New Delhi – 110049',
    landmark: 'Adjacent to Sagar Ratna Restaurant',
    phone: '+91 87654 32109',
    distance: '3.1 km',
    price: 120,
    time: 'Tomorrow, 10:00 AM',
    duration: '2 hrs',
    urgency: 'low',
    notes: 'Geyser is not heating water properly. It takes almost 45 minutes to heat up. Brand: Havells 25L.',
    status: 'scheduled',
  },
];

const mockReviews = [
  { rating: 5, count: 89 },
  { rating: 4, count: 28 },
  { rating: 3, count: 7 },
  { rating: 2, count: 2 },
  { rating: 1, count: 1 },
];

const FULL_REVIEWS = [
  { id: 'r1', name: 'Anjali Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', rating: 5, service: 'Pipe Repair', date: '21 May 2026', comment: 'Absolutely brilliant! Fixed the leaking pipe in no time, very professional and clean work. Highly recommended!' },
  { id: 'r2', name: 'Rohan Mehta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', rating: 5, service: 'Electrical Fitting', date: '20 May 2026', comment: 'Excellent service. Came on time, explained everything clearly and finished the wiring job perfectly.' },
  { id: 'r3', name: 'Sunita Verma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', rating: 4, service: 'Home Cleaning', date: '19 May 2026', comment: 'Very thorough cleaning job. Left the house spotless. Would have given 5 stars but arrived 15 min late.' },
  { id: 'r4', name: 'Deepak Nair', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', rating: 5, service: 'Drain Cleaning', date: '18 May 2026', comment: 'Great work! The drain was completely blocked and he cleared it within 30 minutes. Very satisfied.' },
  { id: 'r5', name: 'Kavita Singh', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face', rating: 5, service: 'Pipe Repair', date: '17 May 2026', comment: 'Showed up promptly, diagnosed the issue quickly, and fixed it without making a mess. 10/10!' },
  { id: 'r6', name: 'Arjun Kapoor', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face', rating: 4, service: 'Electrical Fitting', date: '16 May 2026', comment: 'Good work overall. Fixed the switchboard issue efficiently. Friendly and polite.' },
  { id: 'r7', name: 'Priya Iyer', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face', rating: 5, service: 'Home Cleaning', date: '14 May 2026', comment: 'Best cleaning service I have ever used! Every corner was spotless. Will definitely book again.' },
  { id: 'r8', name: 'Vikram Joshi', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', rating: 3, service: 'Drain Cleaning', date: '12 May 2026', comment: 'Job was done but took longer than expected. Communication could be better.' },
  { id: 'r9', name: 'Neha Gupta', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face', rating: 5, service: 'Pipe Repair', date: '10 May 2026', comment: 'Super fast and reliable. Booked in the morning and everything was fixed by afternoon. Great value for money.' },
  { id: 'r10', name: 'Manish Bose', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=80&h=80&fit=crop&crop=face', rating: 4, service: 'Electrical Fitting', date: '8 May 2026', comment: 'Did a solid job installing the new light fixtures. Clean work and no mess left behind.' },
  { id: 'r11', name: 'Ritu Agarwal', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face', rating: 5, service: 'Home Cleaning', date: '6 May 2026', comment: 'Absolutely loved the service! The team was professional, fast and very respectful of my home.' },
  { id: 'r12', name: 'Sanjay Tiwari', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face', rating: 2, service: 'Pipe Repair', date: '4 May 2026', comment: 'The pipe fix held for only 2 days before leaking again. Had to call someone else to redo it.' },
];

const totalReviews = mockReviews.reduce((acc, r) => acc + r.count, 0);
const avgRating = mockReviews.reduce((acc, r) => acc + r.rating * r.count, 0) / totalReviews;

// ─── Sub-Components ──────────────────────────────────────────────────────────

function StarRow({ rating, size = 'sm' }) {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${cls} ${s <= rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
      ))}
    </div>
  );
}

function ReviewsDrawer({ onClose }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? FULL_REVIEWS : FULL_REVIEWS.filter((r) => r.rating === Number(filter));

  return (
    <AnimatePresence>
      <motion.div
        key="rev-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        key="rev-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-card-foreground">All Reviews</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRow rating={Math.round(avgRating)} />
              <span className="text-sm font-semibold text-card-foreground">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">· {totalReviews} reviews</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
            aria-label="Close reviews"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating breakdown + filter chips */}
        <div className="px-5 py-4 border-b border-border flex-shrink-0 space-y-3">
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((r) => {
              const cnt = mockReviews.find((m) => m.rating === r)?.count ?? 0;
              return (
                <div key={r} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-3">{r}</span>
                  <Star className="w-3 h-3 fill-accent text-accent flex-shrink-0" />
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cnt / totalReviews) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6 text-right">{cnt}</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', '5', '4', '3', '2', '1'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filter === f
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                  }`}
              >
                {f === 'all' ? 'All' : `${f} ★`}
              </button>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No reviews for this rating</p>
            </div>
          )}
          {filtered.map((rev, i) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-background rounded-xl border border-border p-4 space-y-2"
            >
              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-card-foreground truncate">{rev.name}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRow rating={rev.rating} />
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{rev.service}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{rev.comment}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const URGENCY_CONFIG = {
  high: { label: 'Urgent', bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
  medium: { label: 'Normal', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  low: { label: 'Relaxed', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

function JobDetailDrawer({ request, onClose, onAccept, onDecline }) {
  if (!request) return null;
  const urgency = URGENCY_CONFIG[request.urgency || 'medium'];

  const statusColor = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-600',
    scheduled: 'bg-primary/10 text-primary',
  }[request.status] || '';

  return (
    <AnimatePresence>
      <motion.div
        key="job-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <motion.div
        key="job-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
              <Image src={request.customerImage} alt={request.customerName} fill className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-card-foreground">{request.customerName}</p>
              <p className="text-xs text-primary font-medium">{request.service}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${urgency.bg} ${urgency.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
              {urgency.label}
            </span>
            <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{request.time}
            </span>
          </div>

          <div className="p-5 space-y-5">
            {/* Contact */}
            <div className="bg-secondary/40 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client Contact</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-card-foreground">{request.customerName}</span>
                </div>
                <a
                  href={`tel:${request.phone}`}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <a href={`tel:${request.phone}`} className="text-primary hover:underline font-medium">
                  {request.phone}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="bg-secondary/40 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Job Address</h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-card-foreground leading-snug">{request.fullAddress || request.location}</p>
                  {request.landmark && (
                    <p className="text-xs text-muted-foreground mt-1">📌 {request.landmark}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-background border border-border px-2 py-1 rounded-full">
                  🚥 {request.distance || '—'} away
                </span>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(request.fullAddress || request.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-primary font-medium hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in Google Maps
              </a>
            </div>

            {/* Job Details */}
            <div className="bg-secondary/40 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Job Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-green-600">₹{request.price}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Earnings</p>
                </div>
                <div className="bg-background rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-card-foreground">{request.duration || '—'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Duration</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-card-foreground">{request.service}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-card-foreground">{request.time}</span>
              </div>
            </div>

            {/* Notes */}
            {request.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Client Notes
                </h3>
                <p className="text-sm text-amber-900 leading-relaxed">{request.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {request.status === 'pending' && (
          <div className="flex gap-3 p-5 border-t border-border flex-shrink-0 bg-background">
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-2"
              onClick={() => { onAccept(request.id); onClose(); }}
            >
              <CheckCircle className="w-4 h-4" /> Accept Job
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
              onClick={() => { onDecline(request.id); onClose(); }}
            >
              <XCircle className="w-4 h-4" /> Decline
            </Button>
          </div>
        )}

        {request.status === 'accepted' && (
          <div className="flex gap-3 p-5 border-t border-border flex-shrink-0 bg-background">
            <a href={`tel:${request.phone}`} className="flex-1">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white gap-2">
                <Phone className="w-4 h-4" /> Call Client
              </Button>
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(request.fullAddress || request.location)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full gap-2">
                <MapPin className="w-4 h-4" /> Get Directions
              </Button>
            </a>
          </div>
        )}

        {request.status === 'scheduled' && (
          <div className="flex gap-3 p-5 border-t border-border flex-shrink-0 bg-background">
            <a href={`tel:${request.phone}`} className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Phone className="w-4 h-4" /> Call Client
              </Button>
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(request.fullAddress || request.location)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full gap-2">
                <MapPin className="w-4 h-4" /> Get Directions
              </Button>
            </a>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function EarningCard({ id, meta, delay, onClick }) {
  const colorMap = {
    green: { bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-100 text-green-600' },
    primary: { bg: 'bg-primary/10', text: 'text-primary', badge: 'bg-primary/10 text-primary' },
    accent: { bg: 'bg-accent/10', text: 'text-accent', badge: 'bg-accent/10 text-accent' },
    muted: { bg: 'bg-secondary', text: 'text-muted-foreground', badge: '' },
  };
  const c = colorMap[meta.color];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="bg-card rounded-xl border border-border p-5 text-left w-full hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
          <IndianRupee className={`w-5 h-5 ${c.text}`} />
        </div>
        {meta.change && (
          <span className={`text-xs ${c.badge} px-2 py-1 rounded-full font-medium flex items-center gap-0.5`}>
            <ArrowUpRight className="w-3 h-3" />{meta.change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-card-foreground">₹{meta.total.toLocaleString()}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm text-muted-foreground">{meta.label}</p>
        <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 font-medium">
          View details <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </motion.button>
  );
}

function EarningsDrawer({ activeCard, onClose }) {
  if (!activeCard) return null;
  const meta = EARNINGS_META[activeCard];
  const jobs = EARNING_HISTORY[meta.historyKey] || [];
  const completed = jobs.filter(j => j.status === 'completed');
  const cancelled = jobs.filter(j => j.status === 'cancelled');
  const totalEarned = completed.reduce((s, j) => s + j.amount, 0);

  const byService = jobs.reduce((acc, j) => {
    if (j.status !== 'completed') return acc;
    acc[j.service] = (acc[j.service] || 0) + j.amount;
    return acc;
  }, {});
  const serviceEntries = Object.entries(byService).sort((a, b) => b[1] - a[1]);
  const maxVal = serviceEntries[0]?.[1] || 1;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        key="drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-card-foreground">{meta.label}</h2>
            <p className="text-sm text-muted-foreground">{jobs.length} jobs · ₹{totalEarned.toLocaleString()} earned</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-card-foreground">{completed.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-card-foreground">{cancelled.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Cancelled</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-600">₹{totalEarned.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Net Profit</p>
            </div>
          </div>

          {serviceEntries.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-card-foreground mb-3">Earnings by Service</h3>
              <div className="space-y-2.5">
                {serviceEntries.map(([name, val]) => (
                  <div key={name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground truncate max-w-[180px]">{name}</span>
                      <span className="font-semibold text-card-foreground">₹{val}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(val / maxVal) * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Job History</h3>
            <div className="space-y-3">
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${job.status === 'completed'
                      ? 'bg-background border-border'
                      : job.status === 'cancelled'
                        ? 'bg-red-50/50 border-red-100'
                        : 'bg-amber-50/50 border-amber-100'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${job.status === 'completed' ? 'bg-primary/10' : job.status === 'cancelled' ? 'bg-red-100' : 'bg-amber-100'}`}>
                    <Wrench className={`w-4 h-4 ${job.status === 'completed' ? 'text-primary' : job.status === 'cancelled' ? 'text-red-500' : 'text-amber-600'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-card-foreground truncate">{job.customer}</p>
                        <p className="text-xs text-primary">{job.service}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-bold ${job.status === 'completed' ? 'text-green-600' : 'text-muted-foreground line-through'}`}>
                          ₹{job.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">{job.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{job.location}
                      </span>
                      <span className="flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />{job.time}
                      </span>
                    </div>
                    <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${job.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : job.status === 'cancelled'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main HelperDashboard Component ──────────────────────────────────────────

export function HelperDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [actionFeedback, setActionFeedback] = useState(null);
  const [earningsDrawer, setEarningsDrawer] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const updateStatus = useCallback((id, newStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    setActionFeedback({ id, type: newStatus });
    if (newStatus === 'accepted') setActiveTab('accepted');
    setTimeout(() => setActionFeedback(null), 3000);
  }, []);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const scheduledRequests = requests.filter((r) => r.status === 'scheduled');
  const acceptedRequests = requests.filter((r) => r.status === 'accepted');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Helper Dashboard</h1>
          <p className="text-muted-foreground">Manage your jobs and earnings</p>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Availability</span>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative w-14 h-8 rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-muted'}`}
            aria-label="Toggle availability"
          >
            <motion.div animate={{ x: isAvailable ? 24 : 4 }} className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md" />
          </button>
          <span className={`text-sm font-medium ${isAvailable ? 'text-green-500' : 'text-muted-foreground'}`}>
            {isAvailable ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Earnings Cards (clickable) */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
          Click any card to see the full job history &amp; earnings breakdown
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(EARNINGS_META).map(([key, meta], i) => (
          <EarningCard
            key={key}
            id={key}
            meta={meta}
            delay={i * 0.08}
            onClick={() => setEarningsDrawer(key)}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Incoming Requests */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border"
          >
            {/* Tabs */}
            <div className="flex border-b border-border overflow-x-auto">
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 min-w-max py-4 px-3 text-sm font-medium transition-colors relative ${activeTab === 'requests' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Incoming
                {pendingRequests.length > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 text-xs bg-accent text-accent-foreground rounded-full font-bold">
                    {pendingRequests.length}
                  </span>
                )}
                {activeTab === 'requests' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`flex-1 min-w-max py-4 px-3 text-sm font-medium transition-colors relative ${activeTab === 'accepted' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Accepted
                {acceptedRequests.length > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-bold">
                    {acceptedRequests.length}
                  </span>
                )}
                {activeTab === 'accepted' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`flex-1 min-w-max py-4 px-3 text-sm font-medium transition-colors relative ${activeTab === 'scheduled' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Scheduled
                {activeTab === 'scheduled' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>

            {/* Request List */}
            <div className="p-4 space-y-4">
              {(() => {
                const list =
                  activeTab === 'requests' ? pendingRequests
                    : activeTab === 'accepted' ? acceptedRequests
                      : scheduledRequests;

                if (list.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        {activeTab === 'requests' ? 'No pending requests'
                          : activeTab === 'accepted' ? 'No accepted jobs yet — accept a request above'
                            : 'No scheduled jobs'}
                      </p>
                    </div>
                  );
                }

                return list.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedRequest(request)}
                    className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer group ${request.status === 'accepted'
                        ? 'bg-green-50/60 border border-green-200 hover:border-green-400 hover:shadow-sm'
                        : 'bg-secondary/30 hover:bg-secondary/60 hover:shadow-sm border border-transparent hover:border-border'
                      }`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={request.customerImage} alt={request.customerName} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="font-medium text-card-foreground">{request.customerName}</h3>
                          <p className="text-sm text-primary">{request.service}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <p className="text-lg font-semibold text-card-foreground">₹{request.price}</p>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate max-w-[150px]">{request.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{request.time}</span>
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white gap-1" onClick={(e) => { e.stopPropagation(); updateStatus(request.id, 'accepted'); }}>
                            <CheckCircle className="w-4 h-4" /> Accept
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground gap-1" onClick={(e) => { e.stopPropagation(); updateStatus(request.id, 'declined'); }}>
                            <XCircle className="w-4 h-4" /> Decline
                          </Button>
                        </div>
                      )}

                      {request.status === 'accepted' && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Booking Confirmed
                          </span>
                          {actionFeedback?.id === request.id && (
                            <span className="text-xs text-green-600 font-medium animate-pulse">✓ Moved here!</span>
                          )}
                        </div>
                      )}

                      {request.status === 'declined' && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Declined
                          </span>
                        </div>
                      )}

                      {request.status === 'scheduled' && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium">Scheduled</span>
                          <Button size="sm" variant="outline" className="gap-1">
                            View Details <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ));
              })()}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="font-semibold text-card-foreground mb-4">Your Rating</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-card-foreground">{avgRating.toFixed(1)}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-accent text-accent' : 'text-muted'}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{totalReviews} reviews</p>
              </div>
              <div className="flex-1 space-y-2">
                {mockReviews.map((review) => (
                  <div key={review.rating} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3">{review.rating}</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${(review.count / totalReviews) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{review.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={() => setShowReviews(true)}>
              <Star className="w-4 h-4" /> View All Reviews
            </Button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="font-semibold text-card-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/profile" className="block w-full">
                <Button variant="ghost" className="w-full justify-start gap-3 text-card-foreground hover:bg-secondary"><User className="w-5 h-5" />Edit Profile</Button>
              </Link>
              <Link href="/dashboard/services" className="block w-full">
                <Button variant="ghost" className="w-full justify-start gap-3 text-card-foreground hover:bg-secondary"><Briefcase className="w-5 h-5" />Manage Services</Button>
              </Link>
              <Link href="/dashboard/schedule" className="block w-full">
                <Button variant="ghost" className="w-full justify-start gap-3 text-card-foreground hover:bg-secondary"><Calendar className="w-5 h-5" />Set Schedule</Button>
              </Link>
              <Link href="/dashboard/settings" className="block w-full">
                <Button variant="ghost" className="w-full justify-start gap-3 text-card-foreground hover:bg-secondary"><Settings className="w-5 h-5" />Settings</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Earnings Detail Drawer */}
      {earningsDrawer && (
        <EarningsDrawer activeCard={earningsDrawer} onClose={() => setEarningsDrawer(null)} />
      )}

      {/* Reviews Drawer */}
      {showReviews && (
        <ReviewsDrawer onClose={() => setShowReviews(false)} />
      )}

      {/* Job Detail Drawer */}
      {selectedRequest && (
        <JobDetailDrawer
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAccept={(id) => updateStatus(id, 'accepted')}
          onDecline={(id) => updateStatus(id, 'declined')}
        />
      )}
    </div>
  );
}
