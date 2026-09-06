'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, Lock, PhoneCall, AlertTriangle, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';

export default function SafetyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-green-500/10 via-background to-background border-b border-border text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto border border-green-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Safety First, Always.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your security and peace of mind are our top priorities. Learn how DailyHire ensures 100% verified workers, safe payments, and 24/7 support.
            </p>
          </div>
        </section>

        {/* Safety Pillars */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">1. Mandatory 2-Step Government ID Verification</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Before any worker can accept bookings, they must complete Step 2 verification by submitting valid Government ID proofs (Aadhaar Card, PAN Card, Driving License, or Passport) which undergo document validation.
              </p>
              <ul className="space-y-2 text-xs text-foreground font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> Identity verification against government records
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> Physical address &amp; phone number validation
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">2. Secure Payment Escrow &amp; Bank Transfers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Payments are processed through 256-bit SSL encrypted gateways. Employers pay only when booking, and funds are disbursed safely to workers upon job completion.
              </p>
              <ul className="space-y-2 text-xs text-foreground font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> 256-Bit SSL Encrypted checkout
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> Direct bank account &amp; UPI payouts
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">3. Real-Time Tracking &amp; In-App Messaging</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track assigned workers live on map view during active bookings. Communicate safely using our built-in end-to-end chat system without sharing personal phone numbers.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">4. Emergency Assistance &amp; 24/7 Helpline</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our support team is available 24/7 to resolve disputes, handle emergency safety alerts, and guarantee satisfaction for both employers and workers.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border text-center max-w-2xl mx-auto space-y-4">
            <h3 className="text-xl font-bold text-foreground">Have questions about safety?</h3>
            <p className="text-sm text-muted-foreground">Read our full safety policy or speak directly with our Trust &amp; Safety team.</p>
            <Link href="/contact">
              <Button className="gap-2">
                Contact Safety Support <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
