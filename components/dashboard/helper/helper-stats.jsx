'use client';

import React from 'react';
import { IndianRupee, TrendingUp, Calendar, Clock } from 'lucide-react';

const EARNINGS_META = {
  today: { label: "Today's Earnings", icon: IndianRupee, color: 'text-emerald-500 bg-emerald-500/10' },
  week: { label: 'This Week', icon: TrendingUp, color: 'text-primary bg-primary/10' },
  month: { label: 'This Month', icon: Calendar, color: 'text-indigo-500 bg-indigo-500/10' },
  pending: { label: 'Pending Payout', icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
};

export function HelperStats({ earnings }) {
  const stats = [
    { key: 'today', total: earnings?.today ?? 0, change: earnings?.today > 0 ? '+100%' : '0%' },
    { key: 'week', total: earnings?.week ?? 0, change: earnings?.week > 0 ? '+100%' : '0%' },
    { key: 'month', total: earnings?.month ?? 0, change: earnings?.month > 0 ? '+100%' : '0%' },
    { key: 'pending', total: earnings?.pending ?? 0, change: 'Scheduled' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(({ key, total, change }) => {
        const meta = EARNINGS_META[key];
        const Icon = meta.icon;

        return (
          <div key={key} className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">{meta.label}</span>
              <div className={`p-2 rounded-xl ${meta.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">₹{total}</h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                {change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
