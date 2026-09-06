'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin, Map, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HelperCard } from '@/components/helper-card';
import { MapView } from '@/components/map-view';
import { categories } from '@/lib/mock-data';
import { fetchHelpers } from '@/lib/api';

import { HelperCardSkeleton } from '@/components/ui/skeleton-loader';

const priceRanges = [
  { id: 'all', label: 'All Prices' },
  { id: 'low', label: 'Under ₹400/hr' },
  { id: 'mid', label: '₹400-600/hr' },
  { id: 'high', label: 'Over ₹600/hr' },
];

const ratings = [
  { id: 'all', label: 'All Ratings' },
  { id: '4.5', label: '4.5+' },
  { id: '4.0', label: '4.0+' },
  { id: '3.5', label: '3.5+' },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [helpers, setHelpers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadHelpers = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const data = await fetchHelpers();
        setHelpers(data);
      } catch (error) {
        console.error(error);
        setLoadError(error.message || 'Unable to load helpers.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHelpers();
  }, []);

  const filteredHelpers = helpers.filter((helper) => {
    if (
      debouncedQuery &&
      !helper.name.toLowerCase().includes(debouncedQuery.toLowerCase()) &&
      !helper.profession.toLowerCase().includes(debouncedQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedCategory && helper.profession.toLowerCase().replace(/\s+/g, '-') !== selectedCategory) {
      return false;
    }
    if (selectedRating !== 'all' && helper.rating < parseFloat(selectedRating)) {
      return false;
    }
    if (selectedPrice !== 'all') {
      if (selectedPrice === 'low' && helper.hourlyRate >= 400) return false;
      if (selectedPrice === 'mid' && (helper.hourlyRate < 400 || helper.hourlyRate > 600)) return false;
      if (selectedPrice === 'high' && helper.hourlyRate <= 600) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedPrice('all');
    setSelectedRating('all');
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const hasActiveFilters = selectedCategory || selectedPrice !== 'all' || selectedRating !== 'all' || searchQuery;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Search & Filter Bar */}
        <div className="sticky top-16 z-40 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search helpers or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Filter & View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </Button>

                <div className="flex rounded-lg border border-input overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground hover:bg-secondary'}`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-2 ${viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground hover:bg-secondary'}`}
                    aria-label="Map view"
                  >
                    <Map className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                    <select
                      value={selectedCategory || ''}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Price Range</label>
                    <select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {priceRanges.map((price) => (
                        <option key={price.id} value={price.id}>{price.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Minimum Rating</label>
                    <select
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {ratings.map((rating) => (
                        <option key={rating.id} value={rating.id}>{rating.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              <HelperCardSkeleton />
              <HelperCardSkeleton />
              <HelperCardSkeleton />
              <HelperCardSkeleton />
              <HelperCardSkeleton />
              <HelperCardSkeleton />
            </div>
          ) : loadError ? (
            <div className="text-center py-24">
              <p className="text-lg font-semibold text-foreground">Unable to load helpers</p>
              <p className="text-muted-foreground mt-2">{loadError}</p>
            </div>
          ) : (

            <>
              {/* Results count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredHelpers.length}</span> helpers available
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>New York, NY</span>
                </div>
              </div>

              {filteredHelpers.length > 0 ? (
                viewMode === 'list' ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHelpers.map((helper, index) => (
                      <HelperCard key={helper._id || helper.id} helper={helper} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6" style={{ height: '600px' }}>
                    <div className="h-full rounded-xl overflow-hidden border border-border">
                      <MapView helpers={filteredHelpers} />
                    </div>
                    <div className="h-full overflow-y-auto space-y-4 pr-2">
                      {filteredHelpers.map((helper, index) => (
                        <HelperCard key={helper._id || helper.id} helper={helper} index={index} />
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No helpers found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
