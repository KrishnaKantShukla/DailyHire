'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HelperDashboard } from '@/components/helper-dashboard';
import { CustomerDashboard } from '@/components/customer-dashboard';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const isHelper = user?.role === 'helper' || user?.accountType === 'helper';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {isHelper ? (
          <HelperDashboard user={user} />
        ) : (
          <CustomerDashboard user={user} />
        )}
      </main>
      <Footer />
    </div>
  );
}
