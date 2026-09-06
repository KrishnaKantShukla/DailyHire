'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { loginUser } from '@/lib/api';
import { toast } from 'sonner';

import GoogleAuthModal from '@/components/google-auth-modal';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleGoogleSuccess = (user) => {
    setIsGoogleModalOpen(false);
    toast.success(`Welcome back, ${user.firstName || 'User'}!`);
    router.push(user.role === 'helper' || user.accountType === 'helper' ? '/dashboard' : '/explore');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser({ email, password });
      login(data.user, data.token);
      toast.success(`Logged in successfully! Welcome back.`);
      router.push(data.user.role === 'helper' || data.user.accountType === 'helper' ? '/dashboard' : '/explore');
    } catch (err) {
      setError(err.message || 'Login failed.');
      toast.error(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left panel - Modern Dual-User Brand Showcase */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white flex-col justify-between p-6 lg:p-8 relative overflow-hidden border-r border-slate-800">
        {/* Background Glows & Pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Daily<span className="text-amber-400">Hire</span>
            </span>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md">
            ✨ Verified Service Network
          </span>
        </div>

        {/* Center Content & Feature Highlights */}
        <div className="relative z-10 my-auto py-4 space-y-4">
          <div className="space-y-1.5 max-w-lg">
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Dual-User Ecosystem
            </span>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-snug">
              Connecting Local Employers with Verified Daily Workers.
            </h1>
            <p className="text-slate-300 text-xs leading-relaxed">
              Whether you are hiring skilled help for your home or earning daily wages, DailyHire powers seamless bookings and instant payouts.
            </p>
          </div>

          {/* Highlights Grid for Employers & Workers */}
          <div className="grid grid-cols-1 gap-2.5 max-w-lg">
            {/* Employer Benefits Card */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">For Employers & Homeowners</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Book 100% ID-verified electricians, plumbers & cleaners in under 30 minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Worker Benefits Card */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">For Daily Workers & Professionals</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Get instant 60-second payouts directly to your bank account after every completed job.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Contact Footer Box */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 px-1">
          <span className="flex items-center gap-1">
            Helpline: <strong className="text-amber-400">1800 200 4500</strong>
          </span>
          <span className="flex items-center gap-1">
            Email: <strong className="text-blue-400">support@dailyhire.com</strong>
          </span>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Daily<span className="text-accent">Hire</span>
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground">Log in</h2>
              <p className="text-muted-foreground mt-2">Enter your email and password to access your account.</p>
            </div>

            <div className="grid gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 hover:bg-secondary transition-colors"
                onClick={() => setIsGoogleModalOpen(true)}
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-100 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
      />
    </div>
  );
}
