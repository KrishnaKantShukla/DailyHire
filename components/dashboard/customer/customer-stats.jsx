'use client';

import React from 'react';
import { ShoppingBag, CheckCircle, Clock, IndianRupee } from 'lucide-react';

export function CustomerStats({ bookings }) {
  const totalBookings = bookings?.length || 0;
  const completedBookings = bookings?.filter((b) => b.status === 'completed')?.length || 0;
  const pendingBookings = bookings?.filter((b) => b.status === 'pending' || b.status === 'confirmed')?.length || 0;
  const totalSpent = bookings?.reduce((acc, b) => acc + (b.price || 0), 0) || 0;

  const stats = [
    { label: 'Total Orders', count: totalBookings, icon: ShoppingBag, color: 'text-primary bg-primary/10' },
    { label: 'Active / Upcoming', count: pendingBookings, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Completed Jobs', count: completedBookings, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Total Spent', count: `₹${totalSpent}`, icon: IndianRupee, color: 'text-indigo-500 bg-indigo-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(({ label, count, icon: Icon, color }) => (
        <div key={label} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</span>
            <div className={`p-2 rounded-xl ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">{count}</h3>
        </div>
      ))}
    </div>
  );
}
