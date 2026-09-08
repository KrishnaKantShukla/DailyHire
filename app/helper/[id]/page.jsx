'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  BadgeCheck,
  Clock,
  Briefcase,
  ChevronLeft,
  MessageCircle,
  Phone,
  Share2,
  Heart,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { services } from '@/lib/mock-data';
import { getUser } from '@/lib/auth';
import { fetchHelper, fetchBookings, fetchReviews } from '@/lib/api';
import QuickBookingModal from '@/components/quick-booking-modal';

export default function HelperProfilePage({ params }) {
  const { id } = React.use(params);
  const [helper, setHelper] = useState(null);
  const [helperReviews, setHelperReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [hasPreviouslyHired, setHasPreviouslyHired] = useState(false);
  const [isQuickHireOpen, setIsQuickHireOpen] = useState(false);

  const currentUser = getUser();
  const currentUserId = currentUser?.id || currentUser?._id;
  const isSelf = Boolean(
    currentUser && helper && (
      (currentUserId && (currentUserId === helper._id || currentUserId === helper.id || currentUserId === helper.userId || currentUserId === helper.customId)) ||
      (helper.customId && helper.customId === `h_${currentUserId}`) ||
      (currentUser.email && helper.email && currentUser.email.toLowerCase() === helper.email.toLowerCase())
    )
  );

  useEffect(() => {
    const loadHelperData = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const [helperData, reviewsData] = await Promise.all([
          fetchHelper(id).catch(() => null),
          fetchReviews(id).catch(() => []),
        ]);

        if (helperData) {
          setHelper(helperData);
        }
        if (Array.isArray(reviewsData) && reviewsData.length > 0) {
          setHelperReviews(reviewsData);
        }

        if (currentUserId) {
          try {
            const userBookings = await fetchBookings({ customerId: currentUserId });
            const matched = (userBookings || []).some(
              (b) => b.helperId === id || b.helperId === helperData?._id || b.helperId === helperData?.customId
            );
            setHasPreviouslyHired(matched);
          } catch (e) {
            console.error('Error verifying previous hire:', e);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setLoadError('Failed to load profile details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHelperData();
  }, [id, currentUserId]);

if (isLoading) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="mt-4 text-muted-foreground">Loading helper profile...</p>
      </div>
    </div>
  );
}

if (loadError || !helper) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Could not load helper profile</h2>
        <p className="text-muted-foreground mb-6">{loadError || 'Please try again later.'}</p>
        <Link href="/explore">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Return to Explore</Button>
        </Link>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen flex flex-col bg-background">
    <Header />

    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to search
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border border-border">
                    {helper.image && !helper.image.includes('unsplash') ? (
                      <Image
                        src={helper.image}
                        alt={helper.name || 'Helper Profile'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 text-white font-extrabold flex items-center justify-center text-4xl shadow-inner">
                        {helper.name ? helper.name.trim()[0].toUpperCase() : 'H'}
                      </div>
                    )}
                  </div>
                  {helper.available && (
                    <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      Available
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-card-foreground">{helper.name}</h1>
                        {helper.verified && (
                          <BadgeCheck className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <p className="text-lg text-muted-foreground">{helper.profession}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" aria-label="Share">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" aria-label="Save">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-accent text-accent" />
                      <span className="font-semibold text-card-foreground">{helper.rating}</span>
                      <span className="text-muted-foreground">({helper.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      <span>{helper.distance} away</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="w-5 h-5" />
                      <span>{helper.completedJobs} jobs completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="mt-6 text-card-foreground">{helper.bio}</p>

              {/* Skills */}
              <div className="mt-6">
                <h3 className="font-semibold text-card-foreground mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {helper.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Services & Pricing</h2>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-card-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-card-foreground">
                        ₹{service.basePrice}
                      </p>
                      <p className="text-sm text-muted-foreground">starting</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">Reviews</h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="font-semibold text-card-foreground">{helper.rating}</span>
                  <span className="text-muted-foreground">({helper.reviewCount})</span>
                </div>
              </div>

              <div className="space-y-6">
                {(helperReviews.length > 0 ? helperReviews : reviews).map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={review.userImage}
                          alt={review.userName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-card-foreground">{review.userName}</h4>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                        </div>
                        <p className="mt-2 text-card-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6">
                View all reviews
              </Button>
            </motion.div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 bg-card rounded-xl border border-border p-6"
            >
              <div className="text-center mb-6">
                <p className="text-muted-foreground">Starting at</p>
                <p className="text-3xl font-bold text-card-foreground">{helper.priceRange}</p>
              </div>

              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6 w-full justify-center ${helper.available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-secondary text-secondary-foreground'
                }`}>
                <div className={`w-2 h-2 rounded-full ${helper.available ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                {helper.available ? 'Available Now' : 'Currently Busy'}
              </div>

              {hasPreviouslyHired && !isSelf && (
                <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <span className="text-xs font-bold text-primary flex items-center justify-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> Previously Hired by You
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    You booked {helper.name} before. Click below to re-hire for another day.
                  </p>
                </div>
              )}

              {isSelf ? (
                <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed mb-3" size="lg">
                  Your Worker Profile (Self-Booking N/A)
                </Button>
              ) : hasPreviouslyHired ? (
                <Button
                  onClick={() => setIsQuickHireOpen(true)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm gap-2 mb-3 shadow-md"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4" /> Hire Again
                </Button>
              ) : (
                <Link href={`/booking/${helper._id}`}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm mb-3 shadow-sm" size="lg">
                    Hire {helper.name.split(' ')[0]}
                  </Button>
                </Link>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" size="sm">
                  <MessageCircle className="w-4 h-4" /> Chat
                </Button>
                <Button variant="outline" className="flex-1 gap-2" size="sm">
                  <Phone className="w-4 h-4" /> Call
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Typically responds within 5 minutes
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
);
}
