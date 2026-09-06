'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Clock, MessageSquare, Navigation, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function CustomerBookings({ bookings, onStatusUpdate, onOpenChat }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">No bookings yet</h3>
        <p className="text-sm text-muted-foreground mb-6">Find trusted local professionals and book your first service today.</p>
        <Link href="/explore">
          <Button className="bg-primary text-primary-foreground">Explore Helpers</Button>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Completed</span>;
      case 'confirmed':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600">Confirmed</span>;
      case 'cancelled':
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">Cancelled</span>;
      default:
        return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600">Pending</span>;
    }
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking._id || booking.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:border-primary/40 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-secondary border border-border">
                <Image
                  src={booking.helperImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'}
                  alt={booking.helperName}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-foreground text-base">{booking.helperName}</h4>
                  {getStatusBadge(booking.status)}
                </div>

                <p className="text-sm font-medium text-primary mt-0.5">{booking.serviceName}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {booking.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {booking.time || '10:00 AM'}
                  </span>
                  <span className="font-semibold text-foreground text-sm">₹{booking.price}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
              {onOpenChat && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenChat(booking)}
                  className="text-xs gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat
                </Button>
              )}

              <Link href={`/tracking/${booking.helperId || booking.id}`}>
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  Track
                </Button>
              </Link>

              {booking.status === 'pending' && onStatusUpdate && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 text-xs"
                  onClick={() => {
                    onStatusUpdate(booking._id || booking.id, 'cancelled');
                    toast.info('Booking cancelled.');
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
