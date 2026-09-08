'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, MapPin, BadgeCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/auth';
import QuickBookingModal from '@/components/quick-booking-modal';

export function HelperCard({ helper, index = 0 }) {
  const [isQuickHireOpen, setIsQuickHireOpen] = useState(false);
  const helperId = helper._id || helper.id;
  const currentUser = getUser();
  const currentUserId = currentUser?.id || currentUser?._id;
  const isSelf = Boolean(
    currentUser && helper && (
      (currentUserId && (currentUserId === helper._id || currentUserId === helper.id || currentUserId === helper.userId || currentUserId === helper.customId)) ||
      (helper.customId && helper.customId === `h_${currentUserId}`) ||
      (currentUser.email && helper.email && currentUser.email.toLowerCase() === helper.email.toLowerCase())
    )
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col justify-between"
      >
        <Link href={`/helper/${helperId}`} className="p-4 block">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-border">
              {helper.image && !helper.image.includes('unsplash') ? (
                <Image
                  src={helper.image}
                  alt={helper.name || 'Helper'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 text-white font-extrabold flex items-center justify-center text-xl shadow-inner">
                  {helper.name ? helper.name.trim()[0].toUpperCase() : 'H'}
                </div>
              )}
              {helper.available && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-card-foreground truncate">{helper.name}</h3>
                {helper.verified && (
                  <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{helper.profession}</p>
              
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-sm font-medium text-card-foreground">{helper.rating}</span>
                  <span className="text-sm text-muted-foreground">({helper.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs">{helper.distance}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Price & CTA */}
        <div className="px-4 pb-4 pt-3 border-t border-border flex items-center justify-between bg-secondary/10">
          <div>
            <p className="text-xs text-muted-foreground">Hourly Rate</p>
            <p className="font-bold text-sm text-foreground">{helper.priceRange}</p>
          </div>

          {isSelf ? (
            <Link href={`/helper/${helperId}`}>
              <Button size="sm" variant="outline" className="text-xs">
                Your Profile
              </Button>
            </Link>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setIsQuickHireOpen(true);
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-xs px-4"
              >
                Hire
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Booking Modal */}
      <QuickBookingModal
        isOpen={isQuickHireOpen}
        onClose={() => setIsQuickHireOpen(false)}
        helper={helper}
      />
    </>
  );
}

