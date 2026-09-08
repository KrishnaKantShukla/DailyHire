'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Clock, CheckCircle, XCircle, Phone, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function HelperJobRequests({ requests, onRequestAction, onSelectRequest }) {
  if (!requests || requests.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <p className="text-muted-foreground">No active job requests right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:border-primary/40 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-950 text-white font-extrabold text-lg flex items-center justify-center border-2 border-slate-700 shrink-0 shadow-xs">
                {req.customerImage && !req.customerImage.includes('unsplash') ? (
                  <img
                    src={req.customerImage}
                    alt={req.customerName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{req.customerName ? req.customerName.trim()[0].toUpperCase() : 'C'}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{req.customerName}</h4>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {req.service}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  {req.location}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {req.time}
                  </span>
                  <span>•</span>
                  <span className="font-medium text-foreground">₹{req.price}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectRequest(req)}
                className="text-xs gap-1"
              >
                Details
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>

              {req.status === 'pending' ? (
                <>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                    onClick={() => {
                      onRequestAction(req.id, 'accepted');
                      toast.success(`Accepted request from ${req.customerName}`);
                    }}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 text-xs gap-1"
                    onClick={() => {
                      onRequestAction(req.id, 'declined');
                      toast.info(`Declined request from ${req.customerName}`);
                    }}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Decline
                  </Button>
                </>
              ) : (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 capitalize">
                  {req.status}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
