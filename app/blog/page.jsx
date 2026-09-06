'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';

const BLOG_POSTS = [
  {
    id: 'b1',
    title: 'How 2-Step Government ID Verification Ensures Safe Home Repairs',
    category: 'Safety & Trust',
    author: 'DailyHire Safety Team',
    date: 'Sep 3, 2026',
    readTime: '4 min read',
    snippet: 'Discover how mandatory Aadhaar, PAN, and document verification protect both employers hiring local technicians and workers receiving direct payouts.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=350&fit=crop',
  },
  {
    id: 'b2',
    title: 'Top 5 Essential Maintenance Tips Every Homeowner Should Know',
    category: 'Home Care Guide',
    author: 'Priya Patel (Master Electrician)',
    date: 'Aug 28, 2026',
    readTime: '6 min read',
    snippet: 'Learn quick, practical tips to prevent plumbing leaks, inspect electrical circuit switches, and maintain AC cooling before monsoon season.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=350&fit=crop',
  },
  {
    id: 'b3',
    title: 'Empowering Independent Workers: Direct Bank Payouts on DailyHire',
    category: 'Worker Spotlight',
    author: 'Rahul Sharma',
    date: 'Aug 20, 2026',
    readTime: '5 min read',
    snippet: 'Read how local service technicians are growing their daily earnings and receiving automated bank transfers with zero platform commission.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=350&fit=crop',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-primary/10 via-background to-background text-center border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              DailyHire Blog &amp; Insights
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Guides, Safety Updates &amp; Worker Stories.</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed with expert home maintenance tips, safety guidelines, and stories from our verified local helpers.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article key={post.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs flex flex-col hover:border-primary/40 transition-colors">
                <div className="relative h-48 w-full bg-muted">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground leading-snug">{post.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{post.snippet}</p>
                  </div>
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{post.author}</span>
                    <Button variant="ghost" size="sm" className="text-xs text-primary gap-1 p-0 hover:bg-transparent">
                      Read Article &rarr;
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
