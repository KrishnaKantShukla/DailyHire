'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  Star,
  CheckCircle2,
  Circle,
  Send,
  X,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { MapView } from '@/components/map-view';
import { helpers } from '@/lib/mock-data';
import ChatModal from '@/components/chat-modal';
import QuickBookingModal from '@/components/quick-booking-modal';

const trackingSteps = [
  { id: 1, label: 'Booking Confirmed', time: '10:00 AM', completed: true },
  { id: 2, label: 'Helper on the way', time: '10:15 AM', completed: true },
  { id: 3, label: 'Helper arrived', time: 'Est. 10:25 AM', completed: false },
  { id: 4, label: 'Job completed', time: '-', completed: false },
];

export default function TrackingPage({ params }) {
  const { id } = React.use(params);
  const helper = helpers.find((h) => h.id === id) || helpers[0];

  const [showChatModal, setShowChatModal] = useState(false);
  const [showRehireModal, setShowRehireModal] = useState(false);
  const [eta, setEta] = useState(8);
  const [helperPos, setHelperPos] = useState({ lat: 28.6149, lng: 77.208 });

  // Simulate real-time GPS coordinate movement towards destination
  useEffect(() => {
    const interval = setInterval(() => {
      setHelperPos((prev) => ({
        lat: prev.lat + (28.6139 - prev.lat) * 0.1,
        lng: prev.lng + (77.209 - prev.lng) * 0.1,
      }));
      setEta((prev) => (prev > 1 ? prev - 1 : 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 relative">
        <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
          {/* Map Section */}
          <div className="flex-1 relative" style={{ isolation: 'isolate' }}>
            <MapView
              helpers={[{ ...helper, location: helperPos }]}
              center={[helperPos.lat, helperPos.lng]}
              zoom={15}
            />

            {/* Back Button Overlay */}
            <div className="absolute top-4 left-4 z-10">
              <Link href="/">
                <Button variant="secondary" size="sm" className="gap-2 shadow-lg">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
            </div>

            {/* ETA Card Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 lg:right-auto lg:max-w-sm z-10"
            >
              <div className="bg-card rounded-xl border border-border shadow-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden">
                      <Image
                        src={helper.image}
                        alt={helper.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Navigation className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">{helper.name}</p>
                    <p className="text-sm text-muted-foreground">{helper.profession}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-sm text-muted-foreground">{helper.rating}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-3xl font-bold text-accent">{eta}</p>
                    <p className="text-xs text-muted-foreground">min away</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowChatModal(true)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => window.open(`tel:+919876543210`)}>
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Tracking Details */}
          <div className="w-full lg:w-96 bg-card border-l border-border p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">Live Tracking</h2>

            {/* ETA Banner */}
            <div className="bg-primary/10 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                  <p className="text-lg font-semibold text-card-foreground">
                    {eta} minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {step.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-2 ${
                          step.completed ? 'bg-green-500' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <p
                      className={`font-medium ${
                        step.completed ? 'text-card-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Details */}
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold text-card-foreground mb-4">Booking Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="text-card-foreground">Standard Repair</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-card-foreground">Today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="text-card-foreground font-mono">#DH-{id}847</span>
                </div>
              </div>
            </div>

            {/* Need Help & Hire Again for Tomorrow */}
            <div className="mt-6 space-y-3">
              <Button
                onClick={() => setShowRehireModal(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" /> Hire {helper.name.split(' ')[0]} Again for Tomorrow
              </Button>

              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  Need help with your booking?
                </p>
                <Button variant="link" className="p-0 h-auto text-primary text-xs">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Chat Modal */}
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          bookingId={`b_${id}`}
          recipientName={helper.name}
          recipientRole="helper"
          currentUserId="cust_1"
          currentUserName="Customer"
        />

        {/* Re-hire Quick Booking Modal */}
        <QuickBookingModal
          isOpen={showRehireModal}
          onClose={() => setShowRehireModal(false)}
          helper={helper}
        />
      </main>
    </div>
  );
}
