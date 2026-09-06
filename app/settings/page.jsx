'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Mail,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getUser } from '@/lib/auth';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'visibility' | 'security' | 'notifications'
  const [saveStatus, setSaveStatus] = useState('');

  // Worker Settings
  const [isWorkerAvailable, setIsWorkerAvailable] = useState(true);
  const [receiveJobAlerts, setReceiveJobAlerts] = useState(true);
  const [allowDirectCalls, setAllowDirectCalls] = useState(true);

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  const isHelper = user?.role === 'helper' || user?.accountType === 'helper';

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveStatus('Settings updated successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setSaveStatus('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
                  <p className="text-sm text-muted-foreground">
                    Manage preferences for {user?.firstName} ({isHelper ? 'Worker Account' : 'Employer Account'})
                  </p>
                </div>
              </div>
            </div>

            {isHelper && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                <div className={`w-3 h-3 rounded-full ${isWorkerAvailable ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                <span className="text-xs font-bold text-foreground">
                  Status: {isWorkerAvailable ? 'Online (Available for Hire)' : 'Offline (Busy)'}
                </span>
                <Button
                  size="sm"
                  variant={isWorkerAvailable ? 'outline' : 'default'}
                  onClick={() => setIsWorkerAvailable(!isWorkerAvailable)}
                  className="text-xs ml-2"
                >
                  {isWorkerAvailable ? 'Go Offline' : 'Go Online'}
                </Button>
              </div>
            )}
          </div>

          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-100 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-xs font-semibold text-green-700 dark:text-green-300 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              {saveStatus}
            </motion.div>
          )}

          {/* Main Layout */}
          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === 'general'
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4" />
                <span>General Preferences</span>
              </button>

              {isHelper && (
                <button
                  onClick={() => setActiveTab('visibility')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === 'visibility'
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Worker Availability</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === 'notifications'
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications & Alerts</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === 'security'
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Password & Security</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
              {/* Tab 1: General Preferences */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card rounded-2xl border border-border p-6 space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-foreground">General Preferences</h3>
                    <p className="text-xs text-muted-foreground">Manage your account information and platform defaults</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">First Name</Label>
                        <Input value={user.firstName || ''} readOnly className="bg-muted/40 cursor-not-allowed" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Last Name</Label>
                        <Input value={user.lastName || ''} readOnly className="bg-muted/40 cursor-not-allowed" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Email Address</Label>
                      <Input value={user.email || ''} readOnly className="bg-muted/40 cursor-not-allowed" />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">To change your profile details, visit Edit Profile.</p>
                      <Link href="/profile">
                        <Button size="sm" variant="outline" className="text-xs gap-1.5">
                          <User className="w-3.5 h-3.5" /> Edit Profile Page
                        </Button>
                      </Link>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Tab 2: Worker Availability (Helpers only) */}
              {activeTab === 'visibility' && isHelper && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card rounded-2xl border border-border p-6 space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Worker Visibility & Job Controls</h3>
                    <p className="text-xs text-muted-foreground">Control how employers discover and book your services</p>
                  </div>

                  <div className="space-y-4">
                    {/* Toggle 1: Online Status */}
                    <div className="p-4 rounded-xl border border-border bg-secondary/20 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-foreground">Live Availability Status</p>
                        <p className="text-xs text-muted-foreground">
                          When online, employers can send instant 30-minute emergency hire requests.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsWorkerAvailable(!isWorkerAvailable)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                          isWorkerAvailable ? 'bg-green-500' : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            isWorkerAvailable ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 2: Receive Job Alerts */}
                    <div className="p-4 rounded-xl border border-border bg-secondary/20 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-foreground">Receive Instant Job Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Get notified via SMS and Email whenever an employer nearby posts a job.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReceiveJobAlerts(!receiveJobAlerts)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                          receiveJobAlerts ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            receiveJobAlerts ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle 3: Direct Phone Calls */}
                    <div className="p-4 rounded-xl border border-border bg-secondary/20 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-foreground">Allow Direct Phone Calls from Employers</p>
                        <p className="text-xs text-muted-foreground">
                          Employers with active bookings can call your registered mobile number.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAllowDirectCalls(!allowDirectCalls)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                          allowDirectCalls ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            allowDirectCalls ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Notifications */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card rounded-2xl border border-border p-6 space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Notification Preferences</h3>
                    <p className="text-xs text-muted-foreground">Choose how you want to be notified about bookings and messages</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-border bg-secondary/20 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-foreground">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive booking receipts and status updates via email.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                          emailNotifications ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            emailNotifications ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-secondary/20 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-foreground">SMS & Phone Alerts</p>
                        <p className="text-xs text-muted-foreground">Receive urgent dispatch and arrival alerts on your mobile phone.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSmsNotifications(!smsNotifications)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                          smsNotifications ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            smsNotifications ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Password & Security */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card rounded-2xl border border-border p-6 space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Password & Security</h3>
                    <p className="text-xs text-muted-foreground">Update your password and maintain account protection</p>
                  </div>

                  {passwordError && (
                    <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                      {passwordError}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <Label htmlFor="curr-pass" className="text-xs">Current Password</Label>
                      <Input
                        id="curr-pass"
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="new-pass" className="text-xs">New Password</Label>
                      <Input
                        id="new-pass"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="conf-pass" className="text-xs">Confirm New Password</Label>
                      <Input
                        id="conf-pass"
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold">
                      Update Password
                    </Button>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
