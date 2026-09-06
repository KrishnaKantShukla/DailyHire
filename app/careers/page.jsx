'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Rocket, Users, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';

const JOB_OPENINGS = [
  {
    id: 'j1',
    title: 'Senior Full Stack Engineer (Node.js & Next.js)',
    department: 'Engineering',
    location: 'Remote / Delhi NCR',
    type: 'Full-time',
    description: 'Build real-time matching algorithms, geospatial tracking, and MongoDB data pipelines for daily hire worker dispatch.',
  },
  {
    id: 'j2',
    title: 'Trust & Safety Operations Manager',
    department: 'Operations',
    location: 'Delhi NCR, India',
    type: 'Full-time',
    description: 'Lead 2-step Government ID verification, worker background check protocols, and platform safety operations.',
  },
  {
    id: 'j3',
    title: 'Product Designer (UI/UX)',
    department: 'Design',
    location: 'Remote / Bengaluru',
    type: 'Full-time',
    description: 'Design sleek, accessible interfaces for employers booking workers and workers managing their payouts.',
  },
  {
    id: 'j4',
    title: 'Worker Community & Growth Lead',
    department: 'Growth',
    location: 'Mumbai / Remote',
    type: 'Full-time',
    description: 'Empower local service worker communities, onboard skilled technicians, and manage partner onboarding events.',
  },
];

export default function CareersPage() {
  const [appliedJob, setAppliedJob] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-primary/10 via-background to-background text-center border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              Careers at DailyHire
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Help Us Shape the Future of On-Demand Local Work.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are building the platform that powers daily employment and local hiring for millions. Join our mission!
            </p>
          </div>
        </section>

        {/* Culture / Perks */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">High Impact Work</h3>
              <p className="text-sm text-muted-foreground">Directly impact the livelihoods of thousands of local service professionals and daily workers.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Competitive Compensation</h3>
              <p className="text-sm text-muted-foreground">Market-leading salaries, equity options, comprehensive medical insurance, and learning stipends.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Flexible Remote Culture</h3>
              <p className="text-sm text-muted-foreground">Work remotely or from our hubs with flexible working hours and autonomous teams.</p>
            </div>
          </div>

          {/* Open Roles */}
          <div className="space-y-6 pt-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Open Positions</h2>
              <p className="text-muted-foreground text-sm mt-1">Join our fast-growing engineering, design, and operations teams.</p>
            </div>

            <div className="space-y-4">
              {JOB_OPENINGS.map((job) => (
                <div key={job.id} className="p-6 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{job.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">{job.type}</span>
                    </div>
                    <p className="text-xs text-primary font-medium">{job.department} • {job.location}</p>
                    <p className="text-xs text-muted-foreground mt-2">{job.description}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setAppliedJob(job.title);
                      alert(`Application received for ${job.title}! Our talent team will contact you shortly.`);
                    }}
                    className="shrink-0 gap-1.5"
                  >
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
