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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { MapView } from '@/components/map-view';
import { helpers } from '@/lib/mock-data';

const trackingSteps = [
  { id: 1, label: 'Booking Confirmed', time: '10:00 AM', completed: true },
  { id: 2, label: 'Helper on the way', time: '10:15 AM', completed: true },
  { id: 3, label: 'Helper arrived', time: 'Est. 10:25 AM', completed: false },
  { id: 4, label: 'Job completed', time: '-', completed: false },
];

const mockMessages = [
  { id: 1, sender: 'helper', text: "Hi! I'm on my way to your location.", time: '10:15 AM' },
  { id: 2, sender: 'user', text: "Great! I'll be waiting at the front door.", time: '10:16 AM' },
  { id: 3, sender: 'helper', text: 'Perfect. I should arrive in about 10 minutes.', time: '10:17 AM' },
];

export default function TrackingPage({ params }) {
  const { id } = React.use(params);
  const helper = helpers.find((h) => h.id === id) || helpers[0];

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [eta, setEta] = useState(10);

  // Simulate ETA countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'user',
          text: newMessage,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 relative">
        <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
          {/* Map Section */}
          <div className="flex-1 relative" style={{ isolation: 'isolate' }}>
            <MapView
              helpers={[{ ...helper, location: { lat: 40.7148, lng: -74.008 } }]}
              center={[40.7128, -74.006]}
              zoom={14}
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
                    onClick={() => setShowChat(true)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                  <Button variant="outline" className="gap-2">
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

            {/* Need Help */}
            <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
              <p className="text-sm text-muted-foreground">
                Need help with your booking?
              </p>
              <Button variant="link" className="p-0 h-auto text-primary">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Modal */}
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-foreground/50 flex items-end justify-center lg:items-center p-4"
            style={{ zIndex: 9999 }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card w-full max-w-md rounded-t-2xl lg:rounded-2xl border border-border shadow-2xl overflow-hidden"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={helper.image}
                      alt={helper.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{helper.name}</p>
                    <p className="text-xs text-green-500">Online</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChat(false)}
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-secondary text-secondary-foreground rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    className="rounded-full bg-primary text-primary-foreground"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
