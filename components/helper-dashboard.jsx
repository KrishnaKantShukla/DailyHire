'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshCw,
  Lock,
  AlertCircle,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import ChatModal from '@/components/chat-modal';
import { HelperStats } from '@/components/dashboard/helper/helper-stats';
import { HelperJobRequests } from '@/components/dashboard/helper/helper-job-requests';
import { HelperEarningsHistory } from '@/components/dashboard/helper/helper-earnings-history';
import { HelperProfileTab } from '@/components/dashboard/helper/helper-profile-tab';
import { HelperAvailabilityToggle } from '@/components/dashboard/helper/helper-availability-toggle';
import { fetchHelpers, fetchBookings, updateBookingStatus } from '@/lib/api';
import { toast } from 'sonner';

export function HelperDashboard() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [isAvailable, setIsAvailable] = useState(user?.available ?? true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isSyncingStatus, setIsSyncingStatus] = useState(false);
  const [realBookings, setRealBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Verification Gate Check
  const isVerified =
    user?.verificationStatus === 'verified' ||
    user?.verified === true ||
    user?.isAdmin ||
    user?.accountType === 'admin';

  const displayName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Worker' : 'Worker';

  // ─── Fetch Real Database Bookings for this Helper ─────────────────────────────
  const loadRealBookings = useCallback(async () => {
    if (!user) return;
    setIsLoadingBookings(true);
    try {
      const allBookings = await fetchBookings();
      
      // Filter real bookings assigned to this worker
      const matchingBookings = allBookings.filter((b) => {
        const uId = user.id || user._id;
        return (
          b.helperId === uId ||
          b.helperId === user.customId ||
          b.helperId === `h_${uId}` ||
          (user.firstName && b.helperName?.toLowerCase().includes(user.firstName.toLowerCase()))
        );
      });

      setRealBookings(matchingBookings);
    } catch (err) {
      console.error('Error fetching helper bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  }, [user]);

  // Automatic Real-Time Verification Status Auto-Check on Mount
  useEffect(() => {
    let isMounted = true;
    const checkLiveVerification = async () => {
      if (!user || user.verificationStatus === 'verified' || user.verified === true) return;
      try {
        const allHelpers = await fetchHelpers({ all: 'true' });
        const currentWorker = allHelpers.find(
          (h) =>
            h.id === user?.id ||
            h._id === user?.id ||
            h.userId === user?.id ||
            h.customId === user?.id ||
            (h.name && h.name.toLowerCase() === displayName.toLowerCase())
        );

        if (isMounted && currentWorker && (currentWorker.verified || currentWorker.verificationStatus === 'verified')) {
          updateUser({ verificationStatus: 'verified', verified: true });
        }
      } catch (e) {}
    };

    checkLiveVerification();
    return () => {
      isMounted = false;
    };
  }, [user, displayName, updateUser]);

  useEffect(() => {
    if (isVerified) {
      loadRealBookings();
    }
  }, [isVerified, loadRealBookings]);

  // Dynamic Real Job Requests & Completed Bookings
  const jobRequests = realBookings
    .filter((b) => b.status === 'pending' || b.status === 'confirmed')
    .map((b) => ({
      id: b.id || b._id,
      customerName: b.customerName || 'Customer',
      customerImage: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop&crop=face',
      service: b.serviceName,
      location: b.address || 'Customer Location',
      fullAddress: b.address || 'Customer Location Address',
      landmark: 'Verified Booking',
      phone: '+91 Verified Customer',
      distance: '1.5 km',
      price: b.price,
      time: b.time || b.date || 'Scheduled',
      duration: '1 hr',
      urgency: 'medium',
      notes: b.notes || 'Service booking placed by customer.',
      status: b.status,
    }));

  const completedBookings = realBookings.filter((b) => b.status === 'completed');

  // Real Calculated Earnings
  const todayEarnings = completedBookings
    .filter((b) => {
      const bDate = new Date(b.createdAt || b.date);
      const today = new Date();
      return bDate.toDateString() === today.toDateString();
    })
    .reduce((acc, b) => acc + (Number(b.price) || 0), 0);

  const weekEarnings = completedBookings.reduce((acc, b) => acc + (Number(b.price) || 0), 0);
  const monthEarnings = weekEarnings;
  const pendingEarnings = jobRequests.reduce((acc, b) => acc + (Number(b.price) || 0), 0);

  const realEarningsMeta = {
    today: todayEarnings,
    week: weekEarnings,
    month: monthEarnings,
    pending: pendingEarnings,
  };

  const realEarningHistory = {
    today: completedBookings.map((b) => ({
      id: b.id || b._id,
      customer: b.customerName || 'Customer',
      service: b.serviceName,
      location: b.address || 'Doorstep Service',
      time: b.time || b.date || 'Today',
      amount: b.price,
      status: 'completed',
      icon: 'Wrench',
    })),
    week: completedBookings.map((b) => ({
      id: b.id || b._id,
      customer: b.customerName || 'Customer',
      service: b.serviceName,
      location: b.address || 'Doorstep Service',
      time: b.date || 'This Week',
      amount: b.price,
      status: 'completed',
      icon: 'Wrench',
    })),
    month: completedBookings.map((b) => ({
      id: b.id || b._id,
      customer: b.customerName || 'Customer',
      service: b.serviceName,
      location: b.address || 'Doorstep Service',
      time: b.date || 'This Month',
      amount: b.price,
      status: 'completed',
      icon: 'Wrench',
    })),
  };

  const handleToggleAvailability = (val) => {
    setIsAvailable(val);
    toast.info(val ? 'You are now online & available for jobs' : 'You are now offline');
  };

  // Real Database Action Handler for Job Requests
  const handleRequestAction = useCallback(
    async (id, action) => {
      try {
        const targetStatus =
          action === 'accepted' ? 'confirmed' : action === 'completed' ? 'completed' : 'cancelled';

        await updateBookingStatus(id, targetStatus);

        if (targetStatus === 'confirmed') {
          toast.success('Job request accepted! Customer notified.');
        } else if (targetStatus === 'completed') {
          toast.success('Job completed! Payment settled.');
        } else {
          toast.info('Job request declined.');
        }

        await loadRealBookings();
      } catch (err) {
        toast.error(err.message || 'Failed to update job status.');
      }
    },
    [loadRealBookings]
  );

  // Check backend to see if admin has approved the profile
  const handleCheckStatus = async () => {
    setIsSyncingStatus(true);
    try {
      const allHelpers = await fetchHelpers({ all: 'true' });
      const currentWorker = allHelpers.find(
        (h) =>
          h.id === user?.id ||
          h._id === user?.id ||
          h.userId === user?.id ||
          h.customId === user?.id ||
          (h.name && h.name.toLowerCase() === displayName.toLowerCase())
      );

      if (currentWorker && (currentWorker.verified || currentWorker.verificationStatus === 'verified')) {
        updateUser({ verificationStatus: 'verified', verified: true });
        toast.success('🎉 Congratulations! Your worker account has been approved by DailyHire personnel. Access granted to dashboard!');
        await loadRealBookings();
      } else {
        toast.info('Your worker profile application is currently under review by DailyHire administrative personnel.');
      }
    } catch (err) {
      toast.info('Verification check completed. Application remains under review by DailyHire team.');
    } finally {
      setIsSyncingStatus(false);
    }
  };

  // ─── UNVERIFIED / PENDING APPROVAL VIEW ──────────────────────────────────────
  if (!isVerified) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto py-2">
        {/* Top Banner Alert */}
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 text-foreground shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                    Application Under Review
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  Worker Registration Awaiting Approval
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  Welcome, <strong>{displayName}</strong>! Your worker registration details and Government ID proof are currently being reviewed by DailyHire personnel.
                  Once approved, your account will be activated, and you will receive access to job bookings, earnings summary, and local customer requests.
                </p>
              </div>
            </div>

            <Button
              onClick={handleCheckStatus}
              disabled={isSyncingStatus}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs gap-2 rounded-xl shrink-0 shadow-md transition h-11 px-5"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingStatus ? 'animate-spin' : ''}`} />
              Check Approval Status
            </Button>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Verification Progress Workflow
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track the status of your worker onboarding verification steps
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mb-2">✓</div>
              <h3 className="font-bold text-foreground">1. Registration Completed</h3>
              <p className="text-muted-foreground text-[11px] mt-0.5">Personal details & skill selected.</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mb-2">✓</div>
              <h3 className="font-bold text-foreground">2. ID & Payout Submitted</h3>
              <p className="text-muted-foreground text-[11px] mt-0.5">Govt ID proof & bank details recorded.</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs mb-2 animate-bounce">3</div>
              <h3 className="font-bold text-amber-700 dark:text-amber-400">3. Personnel Review</h3>
              <p className="text-muted-foreground text-[11px] mt-0.5">DailyHire admin team checking ID proof.</p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/40 border border-border opacity-60">
              <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-xs mb-2">4</div>
              <h3 className="font-bold text-muted-foreground">4. Dashboard Unlocked</h3>
              <p className="text-muted-foreground text-[11px] mt-0.5">Receive active bookings & earnings.</p>
            </div>
          </div>
        </div>

        {/* Submitted Profile Details View & Edit */}
        <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Submitted Registration Profile</h3>
              <p className="text-xs text-muted-foreground">Review or update your worker information while waiting for verification</p>
            </div>
          </div>

          <HelperProfileTab user={user} onUpdateProfile={updateUser} />
        </div>
      </div>
    );
  }

  // ─── VERIFIED WORKER DASHBOARD VIEW (Real Database Connected) ────────────────
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-950 text-white font-extrabold text-2xl flex items-center justify-center border-2 border-slate-700 shrink-0 shadow-md">
            {user?.image && !user.image.includes('unsplash') ? (
              <img src={user.image} alt={displayName} className="w-full h-full rounded-full object-cover" />
            ) : user?.avatar && !user.avatar.includes('unsplash') ? (
              <img src={user.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{user?.firstName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'W'}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{displayName}</h1>
              <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Worker
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Profession: <strong className="text-foreground">{user?.profession || 'General Helper'}</strong> • Expected Rate: <strong className="text-foreground">₹{user?.hourlyRate || 80}/hr</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={loadRealBookings}
            disabled={isLoadingBookings}
            className="text-xs gap-1.5 rounded-xl border-border"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBookings ? 'animate-spin' : ''}`} />
            Sync Bookings
          </Button>
          <HelperAvailabilityToggle isAvailable={isAvailable} onToggle={handleToggleAvailability} />
        </div>
      </div>

      {/* Real Calculated Stats Summary */}
      <HelperStats earnings={realEarningsMeta} />

      {/* Main Content & Navigation Tabs */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4 mb-6 flex-wrap">
          <div className="flex rounded-xl border border-border p-1 bg-secondary/40">
            {[
              { id: 'requests', label: `Job Requests (${jobRequests.length})` },
              { id: 'earnings', label: `Earnings Log (${completedBookings.length})` },
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
          <HelperEarningsHistory history={realEarningHistory} />
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
                <p className="font-semibold text-foreground">Customer: {selectedRequest.customerName}</p>
                <p className="text-muted-foreground">Location: {selectedRequest.fullAddress || selectedRequest.location}</p>
                <p className="text-xs text-muted-foreground">Contact: {selectedRequest.phone}</p>
              </div>

              <div className="bg-secondary/40 p-4 rounded-xl space-y-2">
                <p className="font-semibold text-foreground">Service Required: {selectedRequest.service}</p>
                <p className="text-muted-foreground">Price / Compensation: ₹{selectedRequest.price}</p>
                <p className="text-muted-foreground">Scheduled Time: {selectedRequest.time}</p>
                {selectedRequest.notes && (
                  <p className="text-xs italic text-muted-foreground mt-2">&quot;{selectedRequest.notes}&quot;</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                {selectedRequest.status === 'pending' && (
                  <>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => {
                        handleRequestAction(selectedRequest.id, 'accepted');
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
                        setSelectedRequest(null);
                      }}
                    >
                      Decline
                    </Button>
                  </>
                )}

                {selectedRequest.status === 'confirmed' && (
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold"
                    onClick={() => {
                      handleRequestAction(selectedRequest.id, 'completed');
                      setSelectedRequest(null);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Service Completed
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
