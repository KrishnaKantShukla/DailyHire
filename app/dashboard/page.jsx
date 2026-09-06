'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HelperDashboard } from '@/components/helper-dashboard';
import { CustomerDashboard } from '@/components/customer-dashboard';
import { HelperCardSkeleton } from '@/components/ui/skeleton-loader';

export default function DashboardPage() {
  const { user, isHelper, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || (!user && isAuthenticated)) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
          <HelperCardSkeleton />
          <HelperCardSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {isHelper ? <HelperDashboard /> : <CustomerDashboard />}
      </main>
      <Footer />
    </div>
  );
}

