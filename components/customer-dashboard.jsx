'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  MessageSquare,
  Navigation,
  History,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  User,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Mock Customer Bookings ──────────────────────────────────────────────────

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
  {
    id: 'b4',
    helperId: '3',
    helperName: 'Amit Kumar',
    helperImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    serviceName: 'Cabinet Repair',
    price: 400,
    date: '10 May 2026',
    time: '11:00 AM',
    status: 'completed',
    notes: 'Fixing the drawers handles and rollers.',
  },
  {
    id: 'b5',
    helperId: '5',
    helperName: 'Vikram Singh',
    helperImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    serviceName: 'Car Diagnosis',
    price: 500,
    date: '2 May 2026',
    time: '3:00 PM',
    status: 'cancelled',
    notes: 'Engine diagnostic scan.',
  },
];

const STATS_CONFIG = [
  { label: 'Total Bookings', value: '5', icon: History, color: 'bg-primary/10 text-primary' },
  { label: 'Active Helpers', value: '1', icon: Navigation, color: 'bg-accent/10 text-accent' },
  { label: 'Completed Jobs', value: '2', icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
  { label: 'Spent Amount', value: '₹1,750', icon: CreditCard, color: 'bg-secondary text-muted-foreground' },
];

export function CustomerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('active');
  const displayName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Customer' : 'Customer';

  const filterBookings = () => {
    switch (activeTab) {
      case 'active':
        return MOCK_BOOKINGS.filter((b) => b.status === 'confirmed');
      case 'pending':
        return MOCK_BOOKINGS.filter((b) => b.status === 'pending');
      case 'completed':
        return MOCK_BOOKINGS.filter((b) => b.status === 'completed' || b.status === 'cancelled');
      default:
        return MOCK_BOOKINGS;
    }
  };

  const currentBookings = filterBookings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {displayName}!</h1>
        <p className="text-muted-foreground mt-1">Manage your active bookings and track local helpers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS_CONFIG.map((stat, i) => {
          const IconComp = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card rounded-xl border border-border p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <IconComp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Bookings List Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border bg-card">
              {['active', 'pending', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-center text-sm font-medium transition-colors relative capitalize ${
                    activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab} Bookings
                  {tab === 'active' && MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 text-xs bg-accent text-accent-foreground rounded-full font-bold">
                      {MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length}
                    </span>
                  )}
                  {activeTab === tab && (
                    <motion.div layoutId="customerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="p-4 space-y-4">
              {currentBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No bookings found in this category.</p>
                  <Link href="/explore" className="inline-block mt-4">
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      Book a Helper Now
                    </Button>
                  </Link>
                </div>
              ) : (
                currentBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    {/* Helper Image */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-border">
                      <Image src={booking.helperImage} alt={booking.helperName} fill className="object-cover" />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between sm:justify-start gap-3">
                        <h3 className="font-semibold text-card-foreground">{booking.helperName}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : booking.status === 'completed'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mt-0.5">{booking.serviceName}</p>

                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {booking.time}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-card-foreground">
                          ₹{booking.price}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 w-full sm:w-auto justify-end flex-shrink-0 mt-3 sm:mt-0">
                      {booking.status === 'confirmed' && (
                        <Link href={`/tracking/${booking.helperId}`} className="w-full sm:w-auto">
                          <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 w-full">
                            <Navigation className="w-4 h-4" /> Track Helper
                          </Button>
                        </Link>
                      )}
                      {booking.status === 'completed' && (
                        <Button size="sm" variant="outline" className="gap-1 text-card-foreground border-border w-full sm:w-auto">
                          Leave Review
                        </Button>
                      )}
                      {booking.status === 'pending' && (
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 w-full sm:w-auto">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info/Quick Actions */}
        <div className="space-y-6">
          {/* Quick Find Helpers Card */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold text-card-foreground mb-2">Need Another Service?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Book vetted plumbers, electricians, cleaners, and more in just minutes.
            </p>
            <Link href="/explore">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Search className="w-4 h-4" /> Browse Helpers
              </Button>
            </Link>
          </div>

          {/* Customer Guidelines/Support */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-card-foreground">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/profile" className="block w-full">
                <Button variant="ghost" className="w-full justify-start gap-3 text-card-foreground hover:bg-secondary">
                  <User className="w-5 h-5" /> Edit Profile
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start gap-3 text-card-foreground hover:bg-secondary">
                <CreditCard className="w-5 h-5" /> Manage Payments
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-card-foreground hover:bg-secondary">
                <MessageSquare className="w-5 h-5" /> Customer Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
