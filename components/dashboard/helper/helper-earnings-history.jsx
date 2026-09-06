'use client';

import React, { useState } from 'react';
import { IndianRupee, Wrench, Droplets, Zap, Home } from 'lucide-react';

const SERVICE_ICONS = { Wrench, Droplets, Zap, Home };

export function HelperEarningsHistory({ history }) {
  const [activePeriod, setActivePeriod] = useState('today');
  const items = history[activePeriod] || [];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Earnings & Payout Logs</h3>
          <p className="text-xs text-muted-foreground">Track completed jobs and payouts</p>
        </div>

        <div className="flex rounded-xl border border-border p-1 bg-secondary/40 self-start sm:self-auto">
          {['today', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activePeriod === period
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-center py-6 text-sm text-muted-foreground">No earnings recorded for this period.</p>
        ) : (
          items.map((item) => {
            const IconComponent = SERVICE_ICONS[item.icon] || Wrench;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">{item.service}</h5>
                    <p className="text-xs text-muted-foreground">{item.customer} • {item.location}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-foreground">₹{item.amount}</span>
                  <p className="text-[11px] text-muted-foreground">{item.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
