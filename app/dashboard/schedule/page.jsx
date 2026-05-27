'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Clock } from 'lucide-react';
import Link from 'next/link';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState(
    daysOfWeek.map(day => ({
      day,
      active: day !== 'Saturday' && day !== 'Sunday',
      start: '09:00',
      end: '17:00'
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index].active = !newSchedule[index].active;
    setSchedule(newSchedule);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Set Schedule</h1>
              <p className="text-muted-foreground">Define your weekly working hours.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {schedule.map((slot, index) => (
                <div key={slot.day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-4 min-w-[140px]">
                    <button
                      onClick={() => toggleDay(index)}
                      className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                        slot.active ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <motion.div
                        animate={{ x: slot.active ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                      />
                    </button>
                    <span className={`font-medium ${slot.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {slot.day}
                    </span>
                  </div>

                  {slot.active ? (
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="time"
                          defaultValue={slot.start}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                      <span className="text-muted-foreground">to</span>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="time"
                          defaultValue={slot.end}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 text-right">
                      <span className="text-sm text-muted-foreground italic">Unavailable</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border bg-secondary/30 flex justify-end gap-3">
              <Link href="/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Schedule'}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
