'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Users, ShieldCheck, Award, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/10 via-background to-background overflow-hidden border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                Our Story &amp; Mission
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                Empowering Local Workers, Simplifying Daily Hire Services.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                DailyHire was created to bridge the gap between skilled local service workers and customers needing fast, trustworthy, transparent daily hire services.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-16 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-extrabold text-primary">15,000+</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">Verified Workers</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-primary">50,000+</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">Completed Bookings</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-primary">100%</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">Government ID Checked</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-primary">4.9 / 5.0</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Why DailyHire?</h2>
            <p className="text-muted-foreground">We build technology that guarantees safety for customers and fair direct payouts for workers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Strict 2-Step Verification</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every worker undergoes Government ID proof submission (Aadhaar/PAN/Passport) and bank account verification before accepting jobs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Direct Bank Payouts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Workers receive 100% of their hourly rates directly transferred to their linked bank accounts or UPI without middleman commissions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Community &amp; Trust</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Real customer ratings, transparent service prices, and instant live tracking create complete trust for every booking.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold">Ready to experience DailyHire?</h3>
              <p className="text-primary-foreground/80 text-sm max-w-lg">Find trusted helpers near you or sign up as a verified worker to start earning today.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/explore">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Find Helpers</Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary">
                  Worker Signup
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
