'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'employer',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactChannels = [
    {
      icon: Phone,
      title: "24/7 Helpline & WhatsApp",
      value: "+91 1800 200 4500",
      subtext: "Toll-free across India for urgent support",
      actionText: "Call Now",
      href: "tel:18002004500"
    },
    {
      icon: Mail,
      title: "Email Support",
      value: "support@dailyhire.com",
      subtext: "For general inquiries & account assistance",
      actionText: "Send Email",
      href: "mailto:support@dailyhire.com"
    },
    {
      icon: MapPin,
      title: "Headquarters",
      value: "DailyHire Tech Pvt Ltd",
      subtext: "Indiranagar 100ft Road, Bengaluru, KA 560038",
      actionText: "Get Directions",
      href: "#"
    },
    {
      icon: Clock,
      title: "Support Operating Hours",
      value: "Round-the-Clock (24x7)",
      subtext: "Instant AI chat & live representative backup",
      actionText: "Live Chat",
      href: "#"
    }
  ];

  const faqs = [
    {
      q: "How fast can I get a verified worker at my doorstep?",
      a: "Our algorithm connects you with nearby available helpers instantly. On average, workers arrive at your location within 30–45 minutes of booking confirmation."
    },
    {
      q: "How do workers receive their daily wages?",
      a: "Workers get instant payouts directly into their registered UPI or bank account within 60 seconds of job completion verification by the employer."
    },
    {
      q: "What if I am unhappy with the service provided?",
      a: "Every booking includes DailyHire Guarantee. If the work is unsatisfactory, contact support within 24 hours for a re-visit or refund evaluation."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-b from-primary/10 via-background to-background border-b border-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              <MessageSquare className="w-3.5 h-3.5" /> We are here to help
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Contact DailyHire Support
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about booking a worker, worker verification, payouts, or partnerships? Reach out and our team will assist you promptly.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactChannels.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.title}</h3>
                    <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
                    <p className="text-muted-foreground text-xs mt-1">{item.subtext}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Main Contact Form & FAQ Grid */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-7 p-8 rounded-3xl bg-card border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground text-sm mb-6">Fill in the details below and our customer care representative will get back to you.</p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center my-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">Message Received!</h3>
                  <p className="text-muted-foreground text-sm mt-2">
                    Thank you for reaching out to DailyHire. Our support team has logged your inquiry and will respond to <span className="font-semibold text-foreground">{formData.email || 'your email'}</span> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Rohan Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="rohan@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">I am a...</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="employer">Employer / Homeowner</option>
                        <option value="worker">Daily Worker / Professional</option>
                        <option value="partner">Corporate / Vendor Partner</option>
                        <option value="other">Other Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Question about electrician booking or payout"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Provide details about your query..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-bold shadow-md hover:bg-accent/90 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Quick FAQ Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                <div className="flex items-center gap-2 text-primary font-semibold mb-4 text-sm">
                  <HelpCircle className="w-4 h-4" /> Quick Answers
                </div>
                <h3 className="text-xl font-bold text-foreground mb-6">Frequently Asked Questions</h3>

                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-border pb-5 last:border-none last:pb-0">
                      <h4 className="font-semibold text-foreground text-sm leading-snug">{faq.q}</h4>
                      <p className="text-muted-foreground text-xs mt-2 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety badge box */}
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-4">
                <ShieldCheck className="w-10 h-10 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground text-sm">Emergency Support Needed?</h4>
                  <p className="text-muted-foreground text-xs mt-0.5">Call our priority safety helpline at <strong>1800 200 4500</strong> anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
