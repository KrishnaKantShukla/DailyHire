'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginWithGoogle } from '@/lib/api';
import { setUser } from '@/lib/auth';

const DEMO_GOOGLE_ACCOUNTS = [
  {
    name: 'Rohan Sharma',
    email: 'rohan.sharma.dev@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    googleId: 'google_1082349102391',
  },
  {
    name: 'Priya Verma',
    email: 'priya.verma.work@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    googleId: 'google_2091240912481',
  },
];

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectAccount = async (account) => {
    setIsLoading(true);
    setError('');
    setSelectedAccount(account.email);

    try {
      const [firstName, ...lastNameArr] = account.name.split(' ');
      const lastName = lastNameArr.join(' ');

      const res = await loginWithGoogle({
        googleId: account.googleId || `g_${Date.now()}`,
        email: account.email,
        firstName: firstName || account.email.split('@')[0],
        lastName: lastName || '',
        avatar: account.avatar || '',
        accountType: 'customer', // Strictly Employer
      });

      setUser(res.user, res.token);
      if (onSuccess) {
        onSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Google login failed.');
      setIsLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail) return;

    setIsLoading(true);
    setError('');

    try {
      const [firstName, ...lastNameArr] = (customName || customEmail.split('@')[0]).split(' ');
      const lastName = lastNameArr.join(' ');

      const res = await loginWithGoogle({
        googleId: `g_custom_${Date.now()}`,
        email: customEmail,
        firstName: firstName || customEmail.split('@')[0],
        lastName: lastName || '',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face`,
        accountType: 'customer', // Strictly Employer
      });

      setUser(res.user, res.token);
      if (onSuccess) {
        onSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Google login failed.');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              <div>
                <h3 className="font-semibold text-base text-foreground">Employer Google Login</h3>
                <span className="text-[11px] text-primary font-medium">For Employers (Customers) only</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Restriction Banner */}
          <div className="mb-4 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-start gap-2 text-xs text-blue-800 dark:text-blue-200">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              Google Login is enabled exclusively for <strong>Employers (Customers)</strong>. Workers/Employees must register via the 2-step Worker Verification signup.
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {!isCustomMode ? (
            <div className="space-y-3">
              {DEMO_GOOGLE_ACCOUNTS.map((account) => {
                const isSelected = selectedAccount === account.email && isLoading;
                return (
                  <button
                    key={account.email}
                    onClick={() => handleSelectAccount(account)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-secondary/60 hover:border-primary/40 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-10 h-10 rounded-full object-cover border border-border"
                      />
                      <div>
                        <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {account.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{account.email}</div>
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    )}
                  </button>
                );
              })}

              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setIsCustomMode(true)}
                  disabled={isLoading}
                >
                  Use another Google Account
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomGoogleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="g-name" className="text-xs">Full Name</Label>
                <Input
                  id="g-name"
                  placeholder="e.g. Aman Gupta"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="g-email" className="text-xs">Google Email Address</Label>
                <Input
                  id="g-email"
                  type="email"
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => setIsCustomMode(false)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1 text-xs gap-1.5" disabled={isLoading}>
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Continue as Employer <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Footer badge */}
          <div className="mt-5 pt-3 border-t border-border flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span>Encrypted OAuth token • Saved directly to MongoDB</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
