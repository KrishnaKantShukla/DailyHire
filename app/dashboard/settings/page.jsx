'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Lock, CreditCard, Shield, Save, Plus } from 'lucide-react';
import Link from 'next/link';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences and settings.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-3 bg-card rounded-xl border border-border p-6"
            >
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold border-b border-border pb-4">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { title: 'Email Notifications', desc: 'Receive daily summaries and booking updates via email.', checked: true },
                      { title: 'SMS Alerts', desc: 'Get text messages for new bookings and cancellations.', checked: true },
                      { title: 'Push Notifications', desc: 'Real-time alerts on your mobile device.', checked: false },
                      { title: 'Marketing Emails', desc: 'Receive offers, tips, and DailyHire news.', checked: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-card-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <button
                          className={`relative w-12 h-6 rounded-full transition-colors shrink-0 mt-1 ${
                            item.checked ? 'bg-primary' : 'bg-muted'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold border-b border-border pb-4">Change Password</h2>
                  
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold border-b border-border pb-4">Payout Methods</h2>
                  <p className="text-sm text-muted-foreground mb-4">How you get paid for your services.</p>
                  
                  <div className="p-4 border border-border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">Bank Account (**** 1234)</p>
                        <p className="text-xs text-muted-foreground">Primary Payout Method</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  
                  <Button variant="outline" className="w-full border-dashed">
                    <Plus className="w-4 h-4 mr-2" /> Add New Payout Method
                  </Button>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold border-b border-border pb-4">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-card-foreground">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">Allow customers to find your profile in search results.</p>
                      </div>
                      <button className="relative w-12 h-6 rounded-full bg-primary shrink-0 mt-1">
                        <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm translate-x-7" />
                      </button>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-card-foreground">Show exact location</p>
                        <p className="text-sm text-muted-foreground">Display your exact street address to customers before booking.</p>
                      </div>
                      <button className="relative w-12 h-6 rounded-full bg-muted shrink-0 mt-1">
                        <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
