'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, User, Briefcase, Star, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setUser } from '@/lib/auth';
import { signupUser } from '@/lib/api';

const PROFESSIONS = [
  'Cleaning & Housekeeping',
  'Plumbing',
  'Electrical Work',
  'Carpentry & Furniture',
  'Painting & Decoration',
  'Gardening & Landscaping',
  'Cooking & Catering',
  'Driving & Delivery',
  'Security & Guard',
  'Tutoring & Teaching',
  'IT & Tech Support',
  'Other',
];

const EXPERIENCE_LEVELS = [
  { value: 'less-than-1', label: 'Less than 1 year' },
  { value: '1-3', label: '1 – 3 years' },
  { value: '3-5', label: '3 – 5 years' },
  { value: '5-plus', label: '5+ years' },
];

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState('customer');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profession, setProfession] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signupUser({
        firstName,
        lastName,
        email,
        password,
        accountType,
        username: email.split('@')[0],
      });
      setUser(result.user, result.token);
      router.push(result.user.role === 'helper' ? '/dashboard' : '/explore');
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left panel - Brand */}
      <div className="hidden md:flex w-1/2 bg-secondary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2 w-fit">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Daily<span className="text-accent">Hire</span>
          </span>
        </Link>

        <div className="relative z-10 mt-auto">
          <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">
            Join the fastest growing network of local professionals.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Whether you need help or want to offer your services, DailyHire connects you with the right people in minutes.
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 overflow-y-auto">
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
              <h2 className="text-3xl font-bold text-foreground">Create an account</h2>
              <p className="text-muted-foreground mt-2">Sign up to get started with DailyHire.</p>
            </div>

            {/* Account Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAccountType('customer')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  accountType === 'customer'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-medium">I need help</span>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('helper')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  accountType === 'helper'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                }`}
              >
                <Briefcase className="w-6 h-6" />
                <span className="font-medium">I am a helper</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Sign up with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Helper-only fields */}
              <AnimatePresence>
                {accountType === 'helper' && (
                  <motion.div
                    key="helper-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden space-y-4"
                  >
                    {/* Divider */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex-1 border-t border-border" />
                      <span className="text-xs uppercase text-muted-foreground px-2 flex items-center gap-1">
                        <Star className="w-3 h-3" /> Helper Profile
                      </span>
                      <div className="flex-1 border-t border-border" />
                    </div>

                    {/* Profession */}
                    <div className="space-y-2">
                      <Label htmlFor="profession">
                        <Briefcase className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
                        Profession / Service Type
                      </Label>
                      <div className="relative">
                        <select
                          id="profession"
                          value={profession}
                          onChange={(e) => setProfession(e.target.value)}
                          required={accountType === 'helper'}
                          className="w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        >
                          <option value="" disabled>Select your profession…</option>
                          {PROFESSIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-2">
                      <Label htmlFor="experience">
                        <Star className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
                        Years of Experience
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {EXPERIENCE_LEVELS.map((lvl) => (
                          <button
                            key={lvl.value}
                            type="button"
                            onClick={() => setExperience(lvl.value)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                              experience === lvl.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                            }`}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio">
                        <FileText className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
                        Short Bio
                        <span className="text-muted-foreground font-normal ml-1">(max 200 chars)</span>
                      </Label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value.slice(0, 200))}
                        placeholder="Tell customers a bit about yourself and your work…"
                        rows={3}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                      />
                      <p className="text-xs text-muted-foreground text-right">{bio.length}/200</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
