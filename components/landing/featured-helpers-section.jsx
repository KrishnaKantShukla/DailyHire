'use client';

import { motion } from 'framer-motion';
import { helpers } from '@/lib/mock-data';
import { HelperCard } from '@/components/helper-card';

export function FeaturedHelpersSection() {
  const featuredHelpers = helpers.slice(0, 4);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Top Rated Helpers Nearby
            </h2>
            <p className="mt-4 text-muted-foreground">
              Highly rated professionals ready to help you today
            </p>
          </div>
          <a
            href="/explore"
            className="mt-4 sm:mt-0 text-primary font-medium hover:underline"
          >
            View all helpers
          </a>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHelpers.map((helper, index) => (
            <HelperCard key={helper.id} helper={helper} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
