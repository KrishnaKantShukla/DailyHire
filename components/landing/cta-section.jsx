'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, LayoutDashboard, UserCheck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/auth';

export function CTASection() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const isHelper = user?.role === 'helper' || user?.accountType === 'helper';
  const isCustomer = user && !isHelper;

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-background blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-background blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            className="text-center md:text-left"
          >
            {isHelper ? (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                  Your Worker Dashboard
                </h2>
                <p className="mt-4 text-primary-foreground/80 max-w-md">
                  Manage your active jobs, review customer booking requests, and track your payout account earnings in real time.
                </p>
                <Link href="/dashboard" className="inline-block mt-6">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Worker Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                  Need Help Today?
                </h2>
                <p className="mt-4 text-primary-foreground/80 max-w-md">
                  Join thousands of employers who save time and money by booking verified local helpers through DailyHire.
                </p>
                <Link href="/explore" className="inline-block mt-6">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                    Find a Helper
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            className="text-center md:text-left bg-primary-foreground/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            {isHelper ? (
              <>
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground">
                  Worker Jobs & Payouts
                </h3>
                <p className="mt-3 text-primary-foreground/80">
                  Accept job offers from local employers, communicate with customers, and receive direct bank payouts.
                </p>
                <Link href="/dashboard" className="inline-block mt-6">
                  <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2">
                    Manage Jobs & Payouts
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : isCustomer ? (
              <>
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground">
                  Manage Your Bookings
                </h3>
                <p className="mt-3 text-primary-foreground/80">
                  View your pending and active helper bookings, message assigned workers, and track live job progress.
                </p>
                <Link href="/dashboard" className="inline-block mt-6">
                  <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2">
                    View My Bookings
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground">
                  Want to Earn More?
                </h3>
                <p className="mt-3 text-primary-foreground/80">
                  Join our network of professionals. Complete 2-step verification, set your own rates, and get hired by local employers.
                </p>
                <Link href="/signup" className="inline-block mt-6">
                  <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2">
                    Become a Helper
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
