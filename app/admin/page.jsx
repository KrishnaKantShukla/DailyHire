'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Briefcase,
  Search,
  Eye,
  Trash2,
  RefreshCw,
  CreditCard,
  Building,
  Lock,
  ArrowRight,
  LogOut,
  Calendar,
  ChevronRight,
  Plus,
  ExternalLink,
  BarChart3,
  IndianRupee,
  Phone,
  X,
  FileText,
  Info,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  fetchAdminStats,
  fetchAdminHelpers,
  verifyWorker,
  deleteWorker,
  fetchAdminUsers,
  deleteAdminUser,
  fetchAdminBookings,
  updateAdminBookingStatus,
  createAdminWorker,
} from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  // Navigation Tabs: 'overview' | 'pending' | 'helpers' | 'users' | 'bookings' | 'add_worker'
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Statistics State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHelpers: 0,
    pendingApprovals: 0,
    verifiedHelpers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  // Data Collections
  const [helpers, setHelpers] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [helperFilterStatus, setHelperFilterStatus] = useState('all');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');

  // Inspection Drawer & Document View State
  const [selectedInspectWorker, setSelectedInspectWorker] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);

  // Add Worker Form State
  const [newWorkerForm, setNewWorkerForm] = useState({
    name: '',
    profession: 'Plumber',
    hourlyRate: 85,
    phone: '',
    bio: '',
    verified: true,
  });
  const [isCreatingWorker, setIsCreatingWorker] = useState(false);

  // Action Popup State (Matches screenshot dark popup style)
  const [popupNotification, setPopupNotification] = useState(null);

  const showActionPopup = (message) => {
    setPopupNotification({ message, id: Date.now() });
  };

  useEffect(() => {
    if (popupNotification) {
      const timer = setTimeout(() => {
        setPopupNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [popupNotification]);

  // Admin Verification Check
  const isAdminUser =
    user?.accountType === 'admin' || user?.role === 'admin' || user?.isAdmin || user?.email === 'admin@dailyhire.com';

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, helpersData, usersData, bookingsData] = await Promise.all([
        fetchAdminStats().catch(() => null),
        fetchAdminHelpers('all').catch(() => []),
        fetchAdminUsers().catch(() => []),
        fetchAdminBookings().catch(() => []),
      ]);

      if (statsData) setStats(statsData);
      if (helpersData) setHelpers(helpersData);
      if (usersData) setUsers(usersData);
      if (bookingsData) setBookings(bookingsData);
    } catch (err) {
      console.error('Error syncing admin panel:', err);
      showActionPopup('Failed to sync administrative dataset.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminUser) {
      loadAdminData();
    }
  }, [user]);

  // Handle Approve / Reject Worker
  const handleVerifyWorker = async (id, status, workerName) => {
    setProcessingId(id);
    try {
      const isApproved = status === 'verified';
      const isRevokingToQueue = status === 'pending' || status === 'unverified';
      const isPermanentlyRejected = status === 'rejected';

      if (isPermanentlyRejected) {
        await deleteWorker(id);
        showActionPopup(`Worker profile for ${workerName} permanently rejected & deleted`);
      } else {
        await verifyWorker(id, status, verificationNotes);

        if (isApproved) {
          showActionPopup(`Worker profile for ${workerName} approved & published`);
        } else if (isRevokingToQueue) {
          showActionPopup(`Approval for ${workerName} revoked & moved to Verification Queue`);
        } else {
          showActionPopup(`Worker status for ${workerName} updated to ${status}`);
        }
      }

      if (
        selectedInspectWorker &&
        (selectedInspectWorker.id === id ||
          selectedInspectWorker.customId === id ||
          selectedInspectWorker._id === id)
      ) {
        setSelectedInspectWorker(null);
      }

      await loadAdminData();
    } catch (err) {
      showActionPopup(err.message || 'Failed to update verification status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteWorker = async (id, name) => {
    if (!confirm(`Are you sure you want to delete worker profile for ${name}?`)) return;
    try {
      await deleteWorker(id);
      showActionPopup(`Worker profile for ${name} removed`);
      await loadAdminData();
    } catch (err) {
      showActionPopup(err.message || 'Failed to delete worker profile.');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Are you sure you want to delete user account for ${name}?`)) return;
    try {
      await deleteAdminUser(id);
      showActionPopup(`User account for ${name} removed`);
      await loadAdminData();
    } catch (err) {
      showActionPopup(err.message || 'Failed to delete user account.');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await updateAdminBookingStatus(bookingId, status);
      showActionPopup(`Booking status updated to ${status}`);
      await loadAdminData();
    } catch (err) {
      showActionPopup(err.message || 'Failed to update booking status.');
    }
  };

  const handleCreateWorkerSubmit = async (e) => {
    e.preventDefault();
    if (!newWorkerForm.name || !newWorkerForm.profession) {
      return showActionPopup('Worker name and profession are required.');
    }
    setIsCreatingWorker(true);
    try {
      await createAdminWorker(newWorkerForm);
      showActionPopup(`Worker profile created for ${newWorkerForm.name}`);
      setNewWorkerForm({
        name: '',
        profession: 'Plumber',
        hourlyRate: 85,
        phone: '',
        bio: '',
        verified: true,
      });
      setActiveTab('helpers');
      await loadAdminData();
    } catch (err) {
      showActionPopup(err.message || 'Failed to create worker profile.');
    } finally {
      setIsCreatingWorker(false);
    }
  };

  // Authorization Gate for non-admin users
  if (!isAuthenticated || !isAdminUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-md text-center">
          <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Administrator Authorization Required</h2>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            The Admin Portal is restricted to authorized platform administrators. Please sign in with administrator credentials.
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-sm hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            Sign In as Administrator <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Filtered Lists
  const pendingWorkersList = helpers.filter(
    (h) => h.verificationStatus === 'pending' || (h.verified === false && h.verificationStatus !== 'rejected')
  );

  const verifiedWorkersList = helpers.filter(
    (h) => h.verificationStatus === 'verified' || h.verified === true
  );

  const filteredHelpersList = helpers.filter((h) => {
    const matchesSearch =
      h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.profession?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.phone?.includes(searchQuery) ||
      h.govIdNumber?.includes(searchQuery);

    if (helperFilterStatus === 'all') return matchesSearch;
    if (helperFilterStatus === 'verified')
      return matchesSearch && (h.verificationStatus === 'verified' || h.verified === true);
    if (helperFilterStatus === 'pending')
      return matchesSearch && (h.verificationStatus === 'pending' || h.verified === false);
    if (helperFilterStatus === 'rejected')
      return matchesSearch && h.verificationStatus === 'rejected';

    return matchesSearch;
  });

  // Strictly filter Customer / Employer Accounts only
  const employersList = users.filter(
    (u) => u.accountType === 'customer' || u.accountType !== 'helper'
  );

  const filteredUsersList = employersList.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.firstName?.toLowerCase().includes(query) ||
      u.lastName?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.includes(query)
    );
  });

  const filteredBookingsList = bookings.filter((b) => {
    const matchesSearch =
      b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.helperName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (bookingFilterStatus === 'all') return matchesSearch;
    return matchesSearch && b.status === bookingFilterStatus;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* ─── NORMALIZED HEADER ─── */}
      <header className="sticky top-0 z-40 bg-card border-b border-slate-300 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        {/* Left: Brand Portal Title */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-extrabold text-lg text-foreground tracking-tight">DailyHire Admin Portal</h1>
            <p className="text-xs text-muted-foreground font-medium">Verification & Management Controller</p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ID numbers, workers, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-slate-300 dark:border-slate-700 text-foreground text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* Right: Actions (Refresh with text & icon, Explore, Logout) */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => router.push('/explore')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Explore Site
          </button>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 rounded-xl text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* ─── SIDEBAR NAVIGATION (Black Background & Clean Single Border) ─── */}
        <aside className="w-full md:w-64 bg-slate-950 text-slate-100 border-r border-slate-800 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Navigation
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-[#18233c] text-white font-bold shadow-xs border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-slate-200" />
                <span>Dashboard Overview</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-80" />
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                activeTab === 'pending'
                  ? 'bg-[#18233c] text-white font-bold shadow-xs border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-200" />
                <span>Verification Queue</span>
              </div>
              {pendingWorkersList.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 font-bold rounded-full border border-amber-500/40">
                  {pendingWorkersList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('helpers')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                activeTab === 'helpers'
                  ? 'bg-[#18233c] text-white font-bold shadow-xs border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-slate-200" />
                <span>Verified Helpers</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{verifiedWorkersList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-[#18233c] text-white font-bold shadow-xs border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-slate-200" />
                <span>Customer/Employers</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{employersList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                activeTab === 'bookings'
                  ? 'bg-[#18233c] text-white font-bold shadow-xs border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-200" />
                <span>All Bookings</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{bookings.length}</span>
            </button>

            <div className="pt-4 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Management
            </div>

            <button
              onClick={() => setActiveTab('add_worker')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                activeTab === 'add_worker'
                  ? 'bg-[#18233c] text-white font-bold shadow-xs border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-slate-200" />
                <span>Add Helper Profile</span>
              </div>
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs border border-slate-700">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-slate-200 truncate">Administrator</div>
              <div className="text-[10px] text-slate-400 truncate">admin@dailyhire.com</div>
            </div>
          </div>
        </aside>

        {/* ─── MAIN CONTENT AREA ─── */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* Mobile Search */}
          <div className="block md:hidden">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search ID numbers, workers, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-input text-foreground text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* ─── TAB 1: OVERVIEW DASHBOARD (Inspired by Admindek KPI style) ─── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div>
                <h1 className="text-xl font-bold text-foreground">Platform Analytics & Overview</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  High-level summary of verification queue, platform revenue, and active registrations.
                </p>
              </div>

              {/* 4 Clean, Eye-Friendly KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Revenue Card */}
                <div
                  onClick={() => setActiveTab('bookings')}
                  className="cursor-pointer bg-card border-2 border-slate-300 dark:border-slate-700 hover:border-slate-500 text-card-foreground rounded-2xl p-5 shadow-xs hover:shadow-md transition group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground">Total Revenue</span>
                    <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border-2 border-blue-500/30 group-hover:scale-105 transition">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-foreground tracking-tight mb-1">
                    ₹{stats.totalRevenue || bookings.reduce((a, b) => a + (b.price || 0), 0)}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{bookings.length} Total Bookings</p>
                </div>

                {/* Verified Helpers Card */}
                <div
                  onClick={() => setActiveTab('helpers')}
                  className="cursor-pointer bg-card border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-card-foreground rounded-2xl p-5 shadow-xs hover:shadow-md transition group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground">Verified Helpers</span>
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border-2 border-emerald-500/30 group-hover:scale-105 transition">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-foreground tracking-tight mb-1">{verifiedWorkersList.length}</div>
                  <p className="text-[11px] text-muted-foreground">Published on Explore Page</p>
                </div>

                {/* Pending Verification Queue Card */}
                <div
                  onClick={() => setActiveTab('pending')}
                  className="cursor-pointer bg-card border-2 border-slate-300 dark:border-slate-700 hover:border-amber-500 text-card-foreground rounded-2xl p-5 shadow-xs hover:shadow-md transition group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground">Pending Applications</span>
                    <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl border-2 border-amber-500/30 group-hover:scale-105 transition">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-foreground tracking-tight mb-1">{pendingWorkersList.length}</div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Require Manual ID Verification</p>
                </div>

                {/* Active Employers Card */}
                <div
                  onClick={() => setActiveTab('users')}
                  className="cursor-pointer bg-card border-2 border-slate-300 dark:border-slate-700 hover:border-purple-500 text-card-foreground rounded-2xl p-5 shadow-xs hover:shadow-md transition group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground">Active Employers</span>
                    <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl border-2 border-purple-500/30 group-hover:scale-105 transition">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-foreground tracking-tight mb-1">{users.length}</div>
                  <p className="text-[11px] text-muted-foreground">Registered Customers</p>
                </div>

              </div>

              {/* Data Grids */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Bookings */}
                <div className="bg-card border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-300 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> Recent Bookings
                    </h3>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">No bookings recorded.</div>
                  ) : (
                    <div className="space-y-2.5">
                      {bookings.slice(0, 5).map((b) => (
                        <div key={b._id || b.id} className="p-3 bg-secondary/50 border border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-foreground">{b.serviceName}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {b.customerName} → {b.helperName}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">₹{b.price}</div>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">{b.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Helper Directory Preview */}
                <div className="bg-card border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-300 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Helper Applicants
                    </h3>
                    <button
                      onClick={() => setActiveTab('helpers')}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Manage Directory
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {helpers.slice(0, 5).map((h) => {
                      const isVer = h.verificationStatus === 'verified' || h.verified;
                      return (
                        <div key={h.customId || h._id} className="p-3 bg-secondary/50 border border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            {h.image && !h.image.includes('unsplash') ? (
                              <img
                                src={h.image}
                                alt={h.name}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-300 dark:border-slate-700"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center text-xs border border-slate-700">
                                {h.name ? h.name.trim()[0].toUpperCase() : 'H'}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-foreground">{h.name}</div>
                              <div className="text-[11px] text-muted-foreground">{h.profession} • ₹{h.hourlyRate}/hr</div>
                            </div>
                          </div>

                          <div>
                            {isVer ? (
                              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded-full">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ─── TAB 2: VERIFICATION QUEUE (Direct Access to Document File Images) ─── */}
          {activeTab === 'pending' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" /> Verification Queue
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Inspect uploaded identity document proof files and verify details before approving helpers.
                  </p>
                </div>

                <div className="px-3 py-1 bg-amber-500/10 border-2 border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-xl">
                  {pendingWorkersList.length} Pending Application{pendingWorkersList.length !== 1 ? 's' : ''}
                </div>
              </div>

              {pendingWorkersList.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-xs">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-foreground">No Pending Worker Applications</h3>
                  <p className="text-muted-foreground text-xs max-w-md mx-auto mt-1">
                    All registered helper profiles have been processed and verified.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingWorkersList.map((worker) => {
                    const workerId = worker.customId || worker._id || worker.id;
                    const isProcessing = processingId === workerId;

                    return (
                      <div
                        key={workerId}
                        className="bg-card border-2 border-slate-300 dark:border-slate-700 hover:border-amber-500 rounded-2xl p-6 shadow-xs relative overflow-hidden transition flex flex-col justify-between space-y-4"
                      >
                        <div>
                          {/* Worker Header Info */}
                          <div className="flex items-start gap-4 mb-4">
                            {worker.image && !worker.image.includes('unsplash') ? (
                              <img
                                src={worker.image}
                                alt={worker.name}
                                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-300 dark:border-slate-700 shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-slate-800 text-white font-extrabold flex items-center justify-center text-xl border-2 border-slate-700 shrink-0">
                                {worker.name ? worker.name.trim()[0].toUpperCase() : 'H'}
                              </div>
                            )}
                            <div>
                              <h3 className="text-base font-bold text-foreground">{worker.name}</h3>
                              <p className="text-primary text-xs font-semibold">{worker.profession}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="font-semibold text-foreground">₹{worker.hourlyRate || 450}/hr</span>
                                <span>•</span>
                                <span>{worker.phone || 'No phone'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Submitted Document Proof & File Image View */}
                          <div className="bg-secondary/50 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-4 text-xs space-y-3">
                            <div className="font-bold text-foreground flex items-center justify-between pb-2 border-b-2 border-slate-300 dark:border-slate-700">
                              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                                <CreditCard className="w-4 h-4" /> Identity Document Proof Details
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-muted-foreground block text-[11px]">Govt ID Type:</span>
                                <span className="font-semibold text-foreground">{worker.govIdType || 'Aadhaar Card'}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[11px]">ID Number:</span>
                                <span className="font-mono font-bold text-foreground">{worker.govIdNumber || '9988-7766-5544'}</span>
                              </div>
                            </div>

                            {/* Direct Access to File Image */}
                            {worker.govIdProofUrl && (
                              <div className="pt-2">
                                <span className="text-muted-foreground block mb-1 text-[11px]">Uploaded Document Image File:</span>
                                <div className="relative group overflow-hidden rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-card">
                                  <img
                                    src={worker.govIdProofUrl}
                                    alt="Uploaded Document Proof Image File"
                                    className="w-full h-32 object-cover group-hover:scale-105 transition"
                                  />
                                  <button
                                    onClick={() => setZoomedImageUrl(worker.govIdProofUrl)}
                                    className="absolute inset-0 bg-background/80 flex items-center justify-center text-foreground font-bold text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition"
                                  >
                                    <Eye className="w-4 h-4 text-primary" /> Inspect Document Proof Image
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Payout Details */}
                            <div className="pt-2 border-t-2 border-slate-300 dark:border-slate-700 grid grid-cols-2 gap-2 text-muted-foreground">
                              <div>
                                <span className="block text-[11px]">Bank:</span>
                                <span className="font-semibold text-foreground">{worker.bankName || 'HDFC Bank'}</span>
                              </div>
                              <div>
                                <span className="block text-[11px]">Account No:</span>
                                <span className="font-mono font-semibold text-foreground">{worker.accountNumber || '501002345678'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Control Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t-2 border-slate-300 dark:border-slate-700">
                          <button
                            onClick={() => setSelectedInspectWorker(worker)}
                            className="flex-1 py-2 px-3 bg-secondary hover:bg-secondary/80 text-foreground border-2 border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" /> Inspect File Details
                          </button>

                          <button
                            onClick={() => handleVerifyWorker(workerId, 'verified', worker.name)}
                            disabled={isProcessing}
                            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve
                          </button>

                          <button
                            onClick={() => handleVerifyWorker(workerId, 'rejected', worker.name)}
                            disabled={isProcessing}
                            className="py-2 px-3 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                            title="Reject Application"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── TAB 3: VERIFIED HELPERS DIRECTORY ─── */}
          {activeTab === 'helpers' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-foreground">Verified Helper Directory</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage active helper profiles, status updates, or remove profiles from the system.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {['all', 'verified', 'pending', 'rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setHelperFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                        helperFilterStatus === st
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card border-2 border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-foreground">
                    <thead className="bg-secondary/70 text-muted-foreground uppercase tracking-wider text-[10px] font-bold border-b-2 border-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-3.5">Helper Profile</th>
                        <th className="px-6 py-3.5">Profession</th>
                        <th className="px-6 py-3.5">Hourly Rate</th>
                        <th className="px-6 py-3.5">Govt ID Details</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-300 dark:divide-slate-700">
                      {filteredHelpersList.map((worker) => {
                        const workerId = worker.customId || worker._id || worker.id;
                        const isVerified = worker.verificationStatus === 'verified' || worker.verified;
                        const isPending = worker.verificationStatus === 'pending' || worker.verified === false;

                        return (
                          <tr key={workerId} className="hover:bg-secondary/40 transition">
                            <td className="px-6 py-3.5 flex items-center gap-3">
                              {worker.image && !worker.image.includes('unsplash') ? (
                                <img
                                  src={worker.image}
                                  alt={worker.name}
                                  className="w-9 h-9 rounded-xl object-cover border-2 border-slate-300 dark:border-slate-700"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-sm border-2 border-slate-700">
                                  {worker.name ? worker.name.trim()[0].toUpperCase() : 'H'}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-foreground flex items-center gap-1.5">
                                  {worker.name}
                                </div>
                                <div className="text-[11px] text-muted-foreground">{worker.phone || 'No phone'}</div>
                              </div>
                            </td>

                            <td className="px-6 py-3.5 font-semibold text-primary">{worker.profession}</td>
                            <td className="px-6 py-3.5 font-bold">₹{worker.hourlyRate || 450}/hr</td>

                            <td className="px-6 py-3.5 text-muted-foreground">
                              <div>{worker.govIdType || 'Aadhaar Card'}</div>
                              <div className="font-mono text-[11px] font-semibold text-foreground">{worker.govIdNumber || '9988-7766-5544'}</div>
                            </td>

                            <td className="px-6 py-3.5">
                              {isVerified ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full">
                                  Verified (Live)
                                </span>
                              ) : isPending ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-full">
                                  Pending
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/30 rounded-full">
                                  Rejected
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-3.5 text-right space-x-2">
                              {isVerified ? (
                                <button
                                  onClick={() => handleVerifyWorker(workerId, 'pending', worker.name)}
                                  className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-semibold rounded-lg border border-amber-500/30 transition"
                                >
                                  Revoke Approval
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleVerifyWorker(workerId, 'verified', worker.name)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold rounded-lg transition"
                                >
                                  Approve
                                </button>
                              )}

                              <button
                                onClick={() => setSelectedInspectWorker(worker)}
                                className="p-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition inline-block border-2 border-slate-300 dark:border-slate-700"
                                title="Inspect Documents"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteWorker(workerId, worker.name)}
                                className="p-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition inline-block border border-destructive/30"
                                title="Delete Worker"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ─── TAB 4: EMPLOYERS DIRECTORY ─── */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-foreground">Employer Directory</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Registered customer and employer accounts on DailyHire.
                  </p>
                </div>

                <div className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-2 border-purple-500/30 text-xs font-bold rounded-xl">
                  {employersList.length} Employer{employersList.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="bg-card border-2 border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-foreground">
                    <thead className="bg-secondary/70 text-muted-foreground uppercase tracking-wider text-[10px] font-bold border-b-2 border-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-3.5">User Name</th>
                        <th className="px-6 py-3.5">Email Address</th>
                        <th className="px-6 py-3.5">Account Type</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-300 dark:divide-slate-700">
                      {filteredUsersList.map((usr) => (
                        <tr key={usr._id || usr.id} className="hover:bg-secondary/40 transition">
                          <td className="px-6 py-3.5 font-bold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center border-2 border-purple-500/30 text-xs">
                              {usr.firstName ? usr.firstName[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-foreground">{usr.firstName} {usr.lastName || ''}</div>
                              <div className="text-[11px] text-muted-foreground">@{usr.username || 'customer'}</div>
                            </div>
                          </td>

                          <td className="px-6 py-3.5 text-muted-foreground font-mono">{usr.email}</td>

                          <td className="px-6 py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                              usr.accountType === 'helper'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                            }`}>
                              {usr.accountType || 'customer'}
                            </span>
                          </td>

                          <td className="px-6 py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteUser(usr._id || usr.id, usr.firstName)}
                              className="p-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition border border-destructive/30"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ─── TAB 5: ALL PLATFORM BOOKINGS ─── */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-foreground">Platform Bookings</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time status management for all bookings submitted across DailyHire.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                        bookingFilterStatus === st
                          ? 'bg-slate-800 dark:bg-slate-900 text-white font-bold border-l-2 border-slate-400 shadow-xs'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card border-2 border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-foreground">
                    <thead className="bg-secondary/70 text-muted-foreground uppercase tracking-wider text-[10px] font-bold border-b-2 border-slate-300 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-3.5">Service & Helper</th>
                        <th className="px-6 py-3.5">Customer Name</th>
                        <th className="px-6 py-3.5">Booking Price</th>
                        <th className="px-6 py-3.5">Date & Time</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-300 dark:divide-slate-700">
                      {filteredBookingsList.map((b) => {
                        const bookingId = b._id || b.id;
                        return (
                          <tr key={bookingId} className="hover:bg-secondary/40 transition">
                            <td className="px-6 py-3.5">
                              <div className="font-bold text-foreground">{b.serviceName}</div>
                              <div className="text-[11px] text-primary">Helper: {b.helperName}</div>
                            </td>

                            <td className="px-6 py-3.5 font-semibold text-foreground">{b.customerName}</td>
                            <td className="px-6 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">₹{b.price}</td>
                            <td className="px-6 py-3.5 text-muted-foreground">{b.date} • {b.time}</td>

                            <td className="px-6 py-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                  : b.status === 'completed'
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                  : b.status === 'cancelled'
                                  ? 'bg-destructive/10 text-destructive border border-destructive/30'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              }`}>
                                {b.status}
                              </span>
                            </td>

                            <td className="px-6 py-3.5 text-right">
                              <select
                                value={b.status}
                                onChange={(e) => handleUpdateBookingStatus(bookingId, e.target.value)}
                                className="bg-card border-2 border-slate-300 dark:border-slate-700 text-foreground text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ─── TAB 6: ADD NEW HELPER FORM ─── */}
          {activeTab === 'add_worker' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h1 className="text-xl font-bold text-foreground">Create Helper Profile</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add a new helper profile directly to the database.
                </p>
              </div>

              <form onSubmit={handleCreateWorkerSubmit} className="bg-card border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Worker Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={newWorkerForm.name}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, name: e.target.value })}
                    className="w-full bg-card border-2 border-slate-300 dark:border-slate-700 text-foreground text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Profession *</label>
                    <select
                      value={newWorkerForm.profession}
                      onChange={(e) => setNewWorkerForm({ ...newWorkerForm, profession: e.target.value })}
                      className="w-full bg-card border-2 border-slate-300 dark:border-slate-700 text-foreground text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      <option value="Plumber">Plumber</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="Cleaner">Cleaner</option>
                      <option value="Mechanic">Mechanic</option>
                      <option value="AC Repair">AC Repair</option>
                      <option value="Painter">Painter</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Hourly Rate (₹) *</label>
                    <input
                      type="number"
                      required
                      min="50"
                      value={newWorkerForm.hourlyRate}
                      onChange={(e) => setNewWorkerForm({ ...newWorkerForm, hourlyRate: Number(e.target.value) })}
                      className="w-full bg-card border-2 border-slate-300 dark:border-slate-700 text-foreground text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9876543210"
                    value={newWorkerForm.phone}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, phone: e.target.value })}
                    className="w-full bg-card border-2 border-slate-300 dark:border-slate-700 text-foreground text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Bio / Skills</label>
                  <textarea
                    rows={3}
                    placeholder="Enter worker experience and qualifications..."
                    value={newWorkerForm.bio}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, bio: e.target.value })}
                    className="w-full bg-card border-2 border-slate-300 dark:border-slate-700 text-foreground text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="verifiedCheck"
                    checked={newWorkerForm.verified}
                    onChange={(e) => setNewWorkerForm({ ...newWorkerForm, verified: e.target.checked })}
                    className="w-4 h-4 rounded border-input text-slate-800 focus:ring-0"
                  />
                  <label htmlFor="verifiedCheck" className="text-xs font-semibold text-foreground">
                    Mark profile verified and publish 
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingWorker}
                  className="w-full py-3 bg-slate-800 dark:bg-slate-900 text-white font-bold rounded-xl text-xs transition shadow-xs hover:opacity-90 disabled:opacity-50"
                >
                  {isCreatingWorker ? 'Creating Profile...' : 'Save Worker Profile'}
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ─── 2-COLUMN SIDE-BY-SIDE DOCUMENT INSPECTION MODAL ─── */}
      {selectedInspectWorker && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border-2 border-slate-300 dark:border-slate-700 rounded-2xl max-w-5xl w-full p-6 sm:p-7 shadow-2xl relative text-foreground max-h-[92vh] flex flex-col overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-foreground">Worker Document Inspection</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                      {selectedInspectWorker.verificationStatus === 'verified' || selectedInspectWorker.verified
                        ? 'Verified'
                        : selectedInspectWorker.verificationStatus === 'rejected'
                        ? 'Rejected'
                        : 'Under Review'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Compare provided employee details against uploaded identity document proof.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedInspectWorker(null)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full bg-secondary hover:bg-secondary/80 transition border border-slate-300 dark:border-slate-700"
                title="Close Inspection"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs flex-1">
              
              {/* ─── LEFT COLUMN: EMPLOYEE PROVIDED DETAILS ─── */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Employee Profile Summary Box */}
                  <div className="bg-secondary/50 p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 flex items-start gap-4">
                    {selectedInspectWorker.image && !selectedInspectWorker.image.includes('unsplash') ? (
                      <img
                        src={selectedInspectWorker.image}
                        alt={selectedInspectWorker.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-slate-300 dark:border-slate-700 shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-800 text-white font-extrabold flex items-center justify-center text-2xl border-2 border-slate-700 shrink-0 shadow-xs">
                        {selectedInspectWorker.name ? selectedInspectWorker.name.trim()[0].toUpperCase() : 'H'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-foreground truncate">{selectedInspectWorker.name}</h3>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                          ₹{selectedInspectWorker.hourlyRate || 450}/hr
                        </span>
                      </div>
                      <p className="text-primary text-xs font-semibold mt-0.5">{selectedInspectWorker.profession}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2 pt-2 border-t border-slate-300 dark:border-slate-700">
                        <span className="flex items-center gap-1 font-medium">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {selectedInspectWorker.phone || '+91 9876543210'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Formatted Official Digital ID Card Details */}
                  <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-card text-foreground p-4 shadow-sm relative overflow-hidden space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          Id
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-primary font-bold">
                            Government Identity Record
                          </div>
                          <div className="text-xs font-extrabold text-foreground">
                            {selectedInspectWorker.govIdType || 'Aadhaar Card'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Applicant Name</div>
                        <div className="text-xs font-extrabold text-foreground truncate">{selectedInspectWorker.name}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Govt ID Number</div>
                        <div className="text-xs font-mono font-extrabold text-foreground tracking-wider bg-secondary/80 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 inline-block">
                          {selectedInspectWorker.govIdNumber || '123564789256'}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      <span>Official ID Proof Submitted to DailyHire</span>
                    </div>
                  </div>

                  {/* Bank Account Payout Details */}
                  <div className="bg-secondary/50 p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 space-y-2">
                    <div className="font-bold text-foreground text-xs mb-2 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Bank Payout Details
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Bank Name:</span>
                        <span className="font-semibold text-foreground">{selectedInspectWorker.bankName || 'HDFC Bank'}</span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[10px]">Account Holder:</span>
                        <span className="font-semibold text-foreground truncate block">{selectedInspectWorker.accountHolderName || selectedInspectWorker.name}</span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[10px]">Account Number:</span>
                        <span className="font-mono font-bold text-foreground">{selectedInspectWorker.accountNumber || '501002345678'}</span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[10px]">IFSC Code:</span>
                        <span className="font-mono font-bold text-foreground">{selectedInspectWorker.ifscCode || 'HDFC0001234'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground text-[10px]">UPI Handle:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedInspectWorker.upiId || 'worker@upi'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── RIGHT COLUMN: UPLOADED PROOF DOCUMENT & ACTION CONTROLS ─── */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Uploaded Document Attachment Preview Box */}
                  {(() => {
                    const rawProofUrl = selectedInspectWorker.govIdProofUrl;
                    const hasCustomFile = rawProofUrl && !rawProofUrl.includes('storage.dailyhire.local');
                    const isPdf = rawProofUrl?.includes('data:application/pdf') || rawProofUrl?.endsWith('.pdf');
                    const displayUrl = hasCustomFile
                      ? rawProofUrl
                      : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop';

                    return (
                      <div className="bg-secondary/50 p-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground font-bold text-xs flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-primary" /> Uploaded Proof Attachment File:
                          </span>
                          <button
                            type="button"
                            onClick={() => setZoomedImageUrl(displayUrl)}
                            className="text-primary hover:underline text-[11px] font-bold flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20"
                          >
                            <Eye className="w-3.5 h-3.5" /> Fullscreen Inspect
                          </button>
                        </div>

                        <div className="relative group overflow-hidden rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center min-h-[220px]">
                          {isPdf ? (
                            <div className="p-6 text-center space-y-3">
                              <FileText className="w-12 h-12 text-primary mx-auto" />
                              <p className="text-xs font-bold text-foreground">PDF Document Uploaded by Worker</p>
                              <button
                                type="button"
                                onClick={() => {
                                  const win = window.open();
                                  if (win)
                                    win.document.write(
                                      `<iframe src="${displayUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                                    );
                                }}
                                className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-xs shadow-xs"
                              >
                                Open PDF Document
                              </button>
                            </div>
                          ) : (
                            <img
                              src={displayUrl}
                              alt="Government ID Document Proof Attachment"
                              className="w-full h-52 object-contain bg-slate-950/10 dark:bg-slate-900/80 p-1"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => setZoomedImageUrl(displayUrl)}
                            className="absolute inset-0 bg-background/85 flex items-center justify-center text-foreground font-bold text-xs gap-2 opacity-0 group-hover:opacity-100 transition shadow-inner"
                          >
                            <Eye className="w-4 h-4 text-primary" /> Click to Inspect Fullscreen
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Verification Feedback Notes Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground block">
                      Administrator Remarks / Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add optional verification remarks or reason..."
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      className="w-full bg-card border-2 border-slate-300 dark:border-slate-700 text-foreground text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                </div>

                {/* Bottom Right Action Control Buttons */}
                <div className="pt-4 border-t-2 border-slate-300 dark:border-slate-700 flex items-center justify-end gap-3">
                  {selectedInspectWorker.verificationStatus === 'verified' || selectedInspectWorker.verified ? (
                    <button
                      disabled={processingId === (selectedInspectWorker.customId || selectedInspectWorker._id || selectedInspectWorker.id)}
                      onClick={() =>
                        handleVerifyWorker(
                          selectedInspectWorker.customId || selectedInspectWorker._id || selectedInspectWorker.id,
                          'pending',
                          selectedInspectWorker.name
                        )
                      }
                      className="py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-2 border-amber-500/30 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Revoke Approval
                    </button>
                  ) : (
                    <button
                      disabled={processingId === (selectedInspectWorker.customId || selectedInspectWorker._id || selectedInspectWorker.id)}
                      onClick={() =>
                        handleVerifyWorker(
                          selectedInspectWorker.customId || selectedInspectWorker._id || selectedInspectWorker.id,
                          'rejected',
                          selectedInspectWorker.name
                        )
                      }
                      className="py-2.5 px-4 bg-destructive/10 hover:bg-destructive/20 text-destructive border-2 border-destructive/30 font-bold rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject Application
                    </button>
                  )}

                  <button
                    disabled={processingId === (selectedInspectWorker.customId || selectedInspectWorker._id || selectedInspectWorker.id)}
                    onClick={() =>
                      handleVerifyWorker(
                        selectedInspectWorker.customId || selectedInspectWorker._id || selectedInspectWorker.id,
                        'verified',
                        selectedInspectWorker.name
                      )
                    }
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Employee
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ─── IMAGE ZOOM MODAL (Fullscreen View of Uploaded Document Image) ─── */}
      {zoomedImageUrl && (
        <div
          onClick={() => setZoomedImageUrl(null)}
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl w-full">
            <img
              src={zoomedImageUrl}
              alt="Zoomed Document Proof File"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-2xl"
            />
            <div className="absolute top-4 right-4 bg-card text-foreground p-2 rounded-full border-2 border-slate-300 dark:border-slate-700">
              <X className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* ─── ACTION POPUP WINDOW (Compact & Sleek Dark Popup) ─── */}
      {popupNotification && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-250 pointer-events-auto">
          <div className="bg-[#060c19] border border-slate-800 text-white px-3.5 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 max-w-sm">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-xs">
              <Info className="w-3 h-3 text-white stroke-[2.5]" />
            </div>
            <div className="flex-1 text-xs font-semibold text-white tracking-tight">
              {popupNotification.message}
            </div>
            <button
              onClick={() => setPopupNotification(null)}
              className="text-slate-400 hover:text-white transition p-0.5"
              title="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
