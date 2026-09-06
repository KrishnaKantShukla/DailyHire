'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchBookings } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { CustomerStats } from '@/components/dashboard/customer/customer-stats';
import { CustomerBookings } from '@/components/dashboard/customer/customer-bookings';
import ChatModal from '@/components/chat-modal';
import QuickBookingModal from '@/components/quick-booking-modal';
import { DashboardStatSkeleton } from '@/components/ui/skeleton-loader';
import { Search } from 'lucide-react';

const MOCK_BOOKINGS = [
  {
    id: 'b1',
    helperId: '1',
    helperName: 'Rahul Sharma',
    helperImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    serviceName: 'Pipe Repair',
    price: 450,
    date: 'Today',
    time: '2:30 PM',
    status: 'confirmed',
    notes: 'Kitchen sink pipe is leaking water. Please bring sealant.',
  },
  {
    id: 'b2',
    helperId: '2',
    helperName: 'Priya Patel',
    helperImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    serviceName: 'Wiring Check',
    price: 550,
    date: 'Tomorrow',
    time: '10:00 AM',
    status: 'pending',
    notes: 'Need inspection of living room switches flickering.',
  },
  {
    id: 'b3',
    helperId: '4',
    helperName: 'Sneha Gupta',
    helperImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    serviceName: 'Deep Cleaning',
    price: 900,
    date: '15 May 2026',
    time: '9:00 AM',
    status: 'completed',
    notes: 'Living room and balcony deep cleaning.',
  },
];

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
      try {
        const userId = user?.id || user?._id;
        const data = await fetchBookings({ customerId: userId });
        if (data && data.length > 0) {
          setBookings(data);
        } else {
          setBookings(MOCK_BOOKINGS);
        }
      } catch (err) {
        console.error('Failed to load live bookings:', err);
        setBookings(MOCK_BOOKINGS);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user]);

  const handleStatusUpdate = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => ((b._id || b.id) === id ? { ...b, status: newStatus } : b))
    );
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') return b.status === 'pending' || b.status === 'confirmed';
    if (activeTab === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your service bookings, track helpers in real-time, and get quick help.
          </p>
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
