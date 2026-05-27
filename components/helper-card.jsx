'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, MapPin, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HelperCard({ helper, index = 0 }) {
  const helperId = helper._id || helper.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      <Link href={`/helper/${helperId}`}>
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
              <Image
                src={helper.image}
                alt={helper.name}
                fill
                className="object-cover"
              />
              {helper.available && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-card-foreground truncate">{helper.name}</h3>
                {helper.verified && (
                  <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{helper.profession}</p>
              
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-medium text-card-foreground">{helper.rating}</span>
                  <span className="text-sm text-muted-foreground">({helper.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="text-sm">{helper.distance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Starting at</p>
              <p className="font-semibold text-card-foreground">{helper.priceRange}</p>
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Book Now
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
