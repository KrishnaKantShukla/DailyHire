'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchHelpers } from '@/lib/api';
import { HelperCard } from '@/components/helper-card';

export function FeaturedHelpersSection() {
  const [helpersList, setHelpersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelpers()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setHelpersList(data.slice(0, 4));
        }
      })
      .catch((err) => console.error('Failed to load featured helpers:', err))
      .finally(() => setLoading(false));
  }, []);

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

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-muted/40 animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpersList.map((helper, index) => (
              <HelperCard key={helper.customId || helper._id || helper.id} helper={helper} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
