'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee,
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
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import ChatModal from '@/components/chat-modal';
import { HelperStats } from '@/components/dashboard/helper/helper-stats';
import { HelperJobRequests } from '@/components/dashboard/helper/helper-job-requests';
import { HelperEarningsHistory } from '@/components/dashboard/helper/helper-earnings-history';
import { HelperProfileTab } from '@/components/dashboard/helper/helper-profile-tab';
import { HelperAvailabilityToggle } from '@/components/dashboard/helper/helper-availability-toggle';
import { toast } from 'sonner';

// ─── Mock Earnings & Job Requests ──────────────────────────────────────────────

const EARNING_HISTORY = {
  today: [
    { id: 't1', customer: 'Ravi Sharma', service: 'Pipe Repair', location: 'Sector 12, Noida', time: '9:30 AM', duration: '1.5 hrs', amount: 95, status: 'completed', icon: 'Wrench' },
    { id: 't2', customer: 'Priya Mehta', service: 'Drain Cleaning', location: 'DLF Phase 2', time: '11:45 AM', duration: '1 hr', amount: 80, status: 'completed', icon: 'Droplets' },
    { id: 't3', customer: 'Anil Verma', service: 'Electrical Fitting', location: 'Vasant Kunj', time: '2:00 PM', duration: '0.5 hrs', amount: 70, status: 'completed', icon: 'Zap' },
  ],
  week: [
    { id: 'w1', customer: 'Sunita Roy', service: 'Home Cleaning', location: 'Lajpat Nagar', time: 'Mon 10:00 AM', duration: '3 hrs', amount: 240, status: 'completed', icon: 'Home' },
    { id: 'w2', customer: 'Deepak Kumar', service: 'Pipe Repair', location: 'Saket', time: 'Tue 1:00 PM', duration: '2 hrs', amount: 180, status: 'completed', icon: 'Wrench' },
  ],
  month: [
    { id: 'm1', customer: 'Ritu Agarwal', service: 'Home Cleaning', location: 'Mayur Vihar', time: '1 May', duration: '3 hrs', amount: 270, status: 'completed', icon: 'Home' },
  ],
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
    notes: 'Kitchen sink pipe is leaking badly. Please bring waterproof sealant.',
    status: 'pending',
  },
  {
    id: '2',
    customerName: 'Maria Garcia',
    customerImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    service: 'Drain Cleaning',
    location: '456 Oak Ave',
    fullAddress: '456 Oak Avenue, Flat 2C, Vasant Vihar, New Delhi – 110057',
    landmark: 'Opposite DDA Market',
    phone: '+91 91234 56789',
    distance: '2.5 km',
    price: 50,
    time: '4:00 PM',
    duration: '1 hr',
    urgency: 'medium',
    notes: 'Bathroom drain is very slow.',
    status: 'pending',
  },
];

export function HelperDashboard() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [isAvailable, setIsAvailable] = useState(user?.available ?? true);
  const [jobRequests, setJobRequests] = useState(INITIAL_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [chatBooking, setChatBooking] = useState(null);

  const handleToggleAvailability = (val) => {
    setIsAvailable(val);
    toast.info(val ? 'You are now online & available for jobs' : 'You are now offline');
  };

  const handleRequestAction = useCallback((id, action) => {
    setJobRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  }, []);

  const displayName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Worker' : 'Worker';

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20 bg-secondary">
            <Image
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'}
              alt={displayName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{displayName}</h1>
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">
                {user?.profession || 'General Helper'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Member rating: <strong className="text-foreground">4.9 ★</strong> (127 reviews)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <HelperAvailabilityToggle isAvailable={isAvailable} onToggle={handleToggleAvailability} />
        </div>
      </div>

      {/* Stats Summary */}
      <HelperStats earnings={{ today: 245, week: 1240, month: 4850, pending: 180 }} />

      {/* Main Content & Navigation Tabs */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4 mb-6 flex-wrap">
          <div className="flex rounded-xl border border-border p-1 bg-secondary/40">
            {[
              { id: 'requests', label: 'Job Requests' },
              { id: 'earnings', label: 'Earnings Log' },
              { id: 'profile', label: 'Verification & Profile' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'requests' && (
          <HelperJobRequests
            requests={jobRequests}
            onRequestAction={handleRequestAction}
            onSelectRequest={(req) => setSelectedRequest(req)}
          />
        )}

        {activeTab === 'earnings' && (
          <HelperEarningsHistory history={EARNING_HISTORY} />
        )}

        {activeTab === 'profile' && (
          <HelperProfileTab user={user} onUpdateProfile={updateUser} />
        )}
      </div>

      {/* Detail Drawer Modal */}
      {selectedRequest && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40"
            onClick={() => setSelectedRequest(null)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h3 className="font-bold text-lg text-foreground">Job Request Details</h3>
              <button onClick={() => setSelectedRequest(null)} className="p-1 rounded-lg hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-secondary/40 p-4 rounded-xl space-y-2">
                <p className="font-semibold text-foreground">{selectedRequest.customerName}</p>
                <p className="text-muted-foreground">{selectedRequest.fullAddress || selectedRequest.location}</p>
                <p className="text-xs text-muted-foreground">Phone: {selectedRequest.phone}</p>
              </div>

              <div className="bg-secondary/40 p-4 rounded-xl space-y-2">
                <p className="font-semibold text-foreground">Job: {selectedRequest.service}</p>
                <p className="text-muted-foreground">Price: ₹{selectedRequest.price}</p>
                <p className="text-muted-foreground">Time: {selectedRequest.time}</p>
                {selectedRequest.notes && (
                  <p className="text-xs italic text-muted-foreground mt-2">&quot;{selectedRequest.notes}&quot;</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => {
                    handleRequestAction(selectedRequest.id, 'accepted');
                    toast.success('Job request accepted!');
                    setSelectedRequest(null);
                  }}
                >
                  Accept Job
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    handleRequestAction(selectedRequest.id, 'declined');
                    toast.info('Job request declined.');
                    setSelectedRequest(null);
                  }}
                >
                  Decline
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
