'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, ArrowLeft, KeyRound, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { loginUser } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser({ email, password });
      
      // Verify admin role
      const isAdmin =
        data.user?.role === 'admin' ||
        data.user?.accountType === 'admin' ||
        data.user?.isAdmin ||
        data.user?.email === 'admin@dailyhire.com';

      if (!isAdmin) {
        setError('Access Denied: This account does not have Administrator privileges.');
        toast.error('Access Denied: Non-administrator account.');
        setIsLoading(false);
        return;
      }

      login(data.user, data.token);
      toast.success('Welcome Administrator! Accessing Central Admin Portal.');
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Invalid Administrator credentials.');
      toast.error(err.message || 'Admin authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Soft Ambient Background Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full pt-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 shadow-md shadow-blue-500/10">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            Daily<span className="text-amber-500">Hire</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition text-xs font-semibold shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to User Login
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Restricted Admin Gateway
          </div>
        </div>
      </div>

      {/* Main Admin Login Card */}
      <div className="relative z-10 my-auto flex justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50"
        >
          {/* Header Icon & Title */}
          <div className="text-center space-y-3 mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-amber-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 shadow-xs">
              <Lock className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Central Admin Portal</h1>
              <p className="text-slate-500 text-xs mt-1.5">
                Sign in with your administrator credentials to access platform controls.
              </p>
            </div>
          </div>

          {/* Error Alert Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Secure Admin Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-bold text-slate-700">
                Administrator Email / User ID
              </Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@dailyhire.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-blue-600 text-sm h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password" className="text-xs font-bold text-slate-700">
                  Password
                </Label>
                <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Protected
                </span>
              </div>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-blue-600 text-sm h-11 rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Sign In to Admin Panel <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Security Note */}
          <div className="mt-7 pt-4 border-t border-slate-100 text-center space-y-1">
            <p className="text-[11px] text-slate-500 font-medium">
               Authorized Administrator Gateway • DailyHire Platform
            </p>
            <p className="text-[10px] text-slate-400">
              All administrative access and activities are logged for security auditing.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 text-center text-slate-400 text-xs max-w-6xl mx-auto w-full pb-2">
        &copy; {new Date().getFullYear()} DailyHire Ecosystem. All administrative rights reserved.
      </div>
    </div>
  );
}
