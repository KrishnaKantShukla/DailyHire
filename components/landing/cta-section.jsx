'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-background blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-background blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* For Users */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
              Need Help Today?
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-md">
              Join thousands of users who save time and money by booking trusted local helpers through DailyHire.
            </p>
            <Link href="/explore" className="inline-block mt-6">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Find a Helper
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* For Helpers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            className="text-center md:text-left bg-primary-foreground/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-primary-foreground">
              Want to Earn More?
            </h3>
            <p className="mt-3 text-primary-foreground/80">
              Join our network of professionals and connect with customers in your area. Set your own rates and schedule.
            </p>
            <Link href="/dashboard" className="inline-block mt-6">
              <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Become a Helper
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
