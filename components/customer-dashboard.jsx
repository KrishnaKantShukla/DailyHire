'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchBookings, updateBookingStatus } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { CustomerStats } from '@/components/dashboard/customer/customer-stats';
import { CustomerBookings } from '@/components/dashboard/customer/customer-bookings';
import ChatModal from '@/components/chat-modal';
import QuickBookingModal from '@/components/quick-booking-modal';
import { DashboardStatSkeleton } from '@/components/ui/skeleton-loader';
import { Search } from 'lucide-react';

export function CustomerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatBooking, setChatBooking] = useState(null);
  const [rehireHelper, setRehireHelper] = useState(null);

  const displayName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Customer' : 'Customer';

  useEffect(() => {
    async function loadBookings() {
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }
      try {
        const userId = user.id || user._id;
        const data = await fetchBookings({ customerId: userId });
        if (Array.isArray(data)) {
          // Filter out cancelled bookings so customer dashboard is clean
          setBookings(data.filter((b) => b.status !== 'cancelled'));
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error('Failed to load customer live bookings:', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user]);

  const handleStatusUpdate = async (id, newStatus) => {
    if (newStatus === 'cancelled') {
      try {
        await updateBookingStatus(id, 'cancelled');
      } catch (e) {
        console.error('Failed to cancel booking on server:', e);
      }
      // Delete / remove cancelled booking from customer dashboard
      setBookings((prev) => prev.filter((b) => (b._id || b.id) !== id));
    } else {
      setBookings((prev) =>
        prev.map((b) => ((b._id || b.id) === id ? { ...b, status: newStatus } : b))
      );
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    if (activeTab === 'active') return b.status === 'pending' || b.status === 'confirmed';
    if (activeTab === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-950 text-white font-extrabold text-2xl flex items-center justify-center border-2 border-slate-700 shrink-0 shadow-md">
            {user?.image && !user.image.includes('unsplash') ? (
              <img src={user.image} alt={displayName} className="w-full h-full rounded-full object-cover" />
            ) : user?.avatar && !user.avatar.includes('unsplash') ? (
              <img src={user.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{user?.firstName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'C'}</span>
            )}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
              Customer Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1.5">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your service bookings, track helpers in real-time, and get quick help.
            </p>
          </div>
        </div>

        <Link href="/explore">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 font-semibold">
            <Search className="w-4 h-4" />
            Book New Helper
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStatSkeleton />
          <DashboardStatSkeleton />
          <DashboardStatSkeleton />
          <DashboardStatSkeleton />
        </div>
      ) : (
        <CustomerStats bookings={bookings} />
      )}

      {/* Main Content Tabs & List */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4 mb-6 flex-wrap">
          <h2 className="text-xl font-bold text-foreground">Your Orders</h2>

          <div className="flex rounded-xl border border-border p-1 bg-secondary/40">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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

        <CustomerBookings
          bookings={filteredBookings}
          onStatusUpdate={handleStatusUpdate}
          onOpenChat={(b) => setChatBooking(b)}
        />
      </div>

      {/* Chat Modal */}
      {chatBooking && (
        <ChatModal
          isOpen={Boolean(chatBooking)}
          onClose={() => setChatBooking(null)}
          bookingId={chatBooking._id || chatBooking.id}
          partnerName={chatBooking.helperName}
          partnerRole="helper"
          partnerImage={chatBooking.helperImage}
        />
      )}

      {/* Quick Rehire Modal */}
      {rehireHelper && (
        <QuickBookingModal
          helper={rehireHelper}
          isOpen={Boolean(rehireHelper)}
          onClose={() => setRehireHelper(null)}
        />
      )}
    </div>
  );
}
