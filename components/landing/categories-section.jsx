'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Car,
  Wind,
  Paintbrush,
  Flower2,
} from 'lucide-react';
import { categories } from '@/lib/mock-data';

const iconMap = {
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Car,
  Wind,
  Paintbrush,
  Flower2,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Browse by Category
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Whatever you need, we have skilled professionals ready to help
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Wrench;
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link
                  href={`/explore?category=${category.id}`}
                  className="group flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.helperCount} helpers
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
