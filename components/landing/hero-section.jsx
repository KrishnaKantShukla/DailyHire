'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Find Trusted Helpers Near You{' '}
              <span className="text-primary">Instantly</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Book nearby professionals in minutes. Plumbers, electricians, cleaners, and more — 
              all vetted, reviewed, and ready to help.
            </p>

            {/* Search Box */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <Link href="/explore">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 h-14 w-full sm:w-auto">
                  Find Helper
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <p className="text-3xl font-bold text-foreground">10K+</p>
                <p className="text-sm text-muted-foreground">Verified Helpers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Jobs Completed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">4.9</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-card rounded-2xl shadow-2xl p-6 border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Find a Helper</p>
                    <p className="text-sm text-muted-foreground">Near your location</p>
                  </div>
                </div>
                
                {/* Mock search result */}
                <div className="space-y-3">
                  {[
                    { name: 'Michael Chen', role: 'Plumber', rating: '4.9', time: '15 min away', color: 'bg-primary' },
                    { name: 'Sarah Johnson', role: 'Electrician', rating: '4.8', time: '20 min away', color: 'bg-accent' },
                    { name: 'Emma Wilson', role: 'Cleaner', rating: '5.0', time: '10 min away', color: 'bg-green-500' },
                  ].map((helper, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${helper.color} flex items-center justify-center text-primary-foreground font-semibold`}>
                          {helper.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{helper.name}</p>
                          <p className="text-xs text-muted-foreground">{helper.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-card-foreground">{helper.rating}</p>
                        <p className="text-xs text-muted-foreground">{helper.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
