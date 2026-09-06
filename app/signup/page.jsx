'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  Star,
  FileText,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Building,
  Upload,
  CheckCircle2,
  FileCheck,
  Phone,
  DollarSign,
  Play,
  Mail,
  X,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { signupUser } from '@/lib/api';
import { toast } from 'sonner';
import GoogleAuthModal from '@/components/google-auth-modal';

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

const GOV_ID_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'passport', label: 'Passport' },
  { value: 'voter_id', label: 'Voter ID Card' },
];

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState('customer'); // 'customer' or 'helper'
  const [step, setStep] = useState(1); // 1 or 2 for helper signup
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Step 1 Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [profession, setProfession] = useState('Cleaning & Housekeeping');
  const [experience, setExperience] = useState('1-3');
  const [hourlyRate, setHourlyRate] = useState('450');
  const [bio, setBio] = useState('');

  // Step 2 Form state (Worker verification & payment details)
  const [govIdType, setGovIdType] = useState('aadhaar');
  const [govIdNumber, setGovIdNumber] = useState('');
  const [govIdDocName, setGovIdDocName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');

  const handleGoogleSuccess = (user) => {
    setIsGoogleModalOpen(false);
    toast.success(`Welcome to DailyHire, ${user.firstName || 'User'}!`);
    router.push(user.role === 'helper' || user.accountType === 'helper' ? '/dashboard' : '/explore');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setGovIdDocName(file.name);
    }
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!firstName || !email || !password) {
      setError('First name, email, and password are required.');
      return;
    }
    setError('');

    if (accountType === 'helper') {
      setStep(2);
    } else {
      executeSignup();
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    executeSignup();
  };

  const executeSignup = async () => {
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        password,
        accountType,
        username: email.split('@')[0],
        profession,
        experience,
        hourlyRate: hourlyRate ? Number(hourlyRate) : 400,
        bio,
        // Step 2 worker data
        govIdType,
        govIdNumber,
        govIdProofUrl: govIdDocName ? `https://storage.dailyhire.local/docs/${govIdDocName}` : '',
        bankName,
        accountHolderName: accountHolderName || `${firstName} ${lastName}`.trim(),
        accountNumber,
        ifscCode,
        upiId,
      };

      const result = await signupUser(payload);
      login(result.user, result.token);
      toast.success('Account created successfully! Welcome to DailyHire.');
      router.push(result.user.role === 'helper' || result.user.accountType === 'helper' ? '/dashboard' : '/explore');
    } catch (err) {
      setError(err.message || 'Signup failed.');
      toast.error(err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background items-stretch">
      {/* Left panel - Sticky/Fixed Modern Dual-User Brand Showcase */}
      <div className="hidden md:flex w-1/2 sticky top-0 h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white flex-col justify-between p-6 lg:p-8 relative overflow-hidden border-r border-slate-800 shrink-0">
        {/* Background Glows & Pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Daily<span className="text-amber-400">Hire</span>
            </span>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md">
            ✨ Join 50,000+ Members
          </span>
        </div>

        {/* Center Content & Dynamic Role Showcase */}
        <div className="relative z-10 my-auto py-2 space-y-3">
          <div className="space-y-1 max-w-lg">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              {accountType === 'helper' ? 'Worker Registration' : 'Employer Registration'}
            </span>
            <h1 className="text-lg lg:text-xl font-extrabold text-white tracking-tight leading-snug">
              {accountType === 'helper'
                ? 'Start your local service business with instant payouts.'
                : 'Hire verified local workers for household & repair jobs.'}
            </h1>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {accountType === 'helper'
                ? 'DailyHire connects you directly with nearby employers needing plumbers, electricians, housekeepers, and skilled workers.'
                : 'Access thousands of background-checked electricians, plumbers, housekeepers, and carpenters at transparent hourly rates.'}
            </p>
          </div>

          {/* Easy Onboarding Pathway Steps */}
          {accountType === 'helper' ? (
            <div className="space-y-2 max-w-lg">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Easy 4-Step Worker Onboarding Guide
              </h3>
              
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-2">
                  <span className="w-4 h-4 rounded-md bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">1</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">Create Profile & Skill Category</h4>
                    <p className="text-slate-300 text-[10px] leading-tight">Select your profession (Plumbing, Electrical) & hourly rate.</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-2">
                  <span className="w-4 h-4 rounded-md bg-blue-400/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">2</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">Upload Govt ID (Aadhaar / PAN)</h4>
                    <p className="text-slate-300 text-[10px] leading-tight">Instant verification badge builds trust and gets 3x more bookings.</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-2">
                  <span className="w-4 h-4 rounded-md bg-purple-400/20 text-purple-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">3</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">Receive Local Job Requests</h4>
                    <p className="text-slate-300 text-[10px] leading-tight">Get mobile alerts when nearby customers book doorstep services.</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-2">
                  <span className="w-4 h-4 rounded-md bg-emerald-400/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">4</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">Instant 60-Second Bank Transfer</h4>
                    <p className="text-slate-300 text-[10px] leading-tight">Daily earnings deposited into your bank/UPI within 60s of job completion.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-w-lg">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">30-Minute Doorstep Arrival</h3>
                  <p className="text-[10px] text-slate-300">Nearby verified helpers dispatched directly to your location.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">100% ID Verified Workers</h3>
                  <p className="text-[10px] text-slate-300">Every worker is background checked with 2-step Government ID proof.</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Star className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">DailyWage Service Guarantee</h3>
                  <p className="text-[10px] text-slate-300">Satisfaction guaranteed with transparent fixed hourly rates.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Registration Help & Contact Support Footer Box */}
        <div className="relative z-10 pt-2 border-t border-white/10 space-y-1.5">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                <Play className="w-3 h-3 fill-amber-400" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">Registration Help?</p>
                <p className="text-[9px] text-slate-300">Watch 2-min worker video guide</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold transition-all whitespace-nowrap flex items-center gap-1 shadow-sm"
            >
              <Play className="w-2.5 h-2.5 fill-slate-950" /> Watch Video
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-300 px-1">
            <a href="tel:18002004500" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Helpline: <strong>1800 200 4500</strong></span>
            </a>
            <a href="mailto:support@dailyhire.com" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <Mail className="w-3 h-3 text-blue-400" />
              <span>support@dailyhire.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right panel - Scrollable Form & Wizard */}
      <div className="flex-1 flex flex-col justify-center items-center py-6 px-4 sm:px-8 overflow-y-auto min-h-screen">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="md:hidden flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Daily<span className="text-accent">Hire</span>
              </span>
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {accountType === 'helper' && step === 2
                  ? 'Verification & Payout Details'
                  : 'Create an account'}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {accountType === 'helper'
                  ? step === 1
                    ? 'Step 1 of 2: Basic Information & Introduction'
                    : 'Step 2 of 2: Provide Government ID & Bank Account for payments'
                  : 'Sign up to get started with DailyHire.'}
              </p>
            </div>

            {/* Account Type Selector (Only on Step 1) */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType('customer');
                    setStep(1);
                  }}
                  className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                    accountType === 'customer'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <User className="w-6 h-6" />
                  <span className="font-bold text-sm text-foreground">Employer</span>
                  <span className="text-[11px] text-muted-foreground font-normal">(I need help)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('helper')}
                  className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border-2 transition-all ${
                    accountType === 'helper'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <Briefcase className="w-6 h-6" />
                  <span className="font-bold text-sm text-foreground">Employee or Helper</span>
                  <span className="text-[11px] text-muted-foreground font-normal">(Worker Profile)</span>
                </button>
              </div>
            )}

            {/* Stepper Progress Bar (Placed below Account Type Selector for Helper signup) */}
            {accountType === 'helper' && (
              <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-secondary border border-border">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    step === 1
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  1. Personal & Bio
                </button>
                <div className="w-4 text-center text-muted-foreground text-xs font-bold">→</div>
                <button
                  type="button"
                  onClick={() => {
                    if (firstName && email) setStep(2);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    step === 2
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  2. ID & Payment Payout
                </button>
              </div>
            )}

            {/* Google Signup Option (Employer only) */}
            {step === 1 && accountType === 'customer' && (
              <>
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
                  Sign up with Google (Employers)
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or fill details manually</span>
                  </div>
                </div>
              </>
            )}

            {/* Error banner */}
            {error && (
              <div className="rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {/* STEP 1 FORM */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="Rahul"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Sharma"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Helper-only fields for Step 1 */}
                {accountType === 'helper' && (
                  <div className="space-y-4 pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary" />
                      <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                        Worker Profile & Introduction
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Profession */}
                      <div className="space-y-2">
                        <Label htmlFor="profession">
                          <Briefcase className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
                          Profession / Service Category
                        </Label>
                        <div className="relative">
                          <select
                            id="profession"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            required
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

                      {/* Hourly Rate */}
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">
                          <DollarSign className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
                          Expected Hourly Rate (₹/hr)
                        </Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          placeholder="450"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {EXPERIENCE_LEVELS.map((lvl) => (
                          <button
                            key={lvl.value}
                            type="button"
                            onClick={() => setExperience(lvl.value)}
                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
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

                    {/* Personal Introduction / Short Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio">
                        <FileText className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
                        Brief Personal Introduction / Bio
                        <span className="text-muted-foreground font-normal ml-1">(max 250 chars)</span>
                      </Label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value.slice(0, 250))}
                        placeholder="Introduce yourself to customers (e.g. Master plumber with 5 years experience in pipe repair and leak fixes)..."
                        rows={3}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                      />
                      <p className="text-xs text-muted-foreground text-right">{bio.length}/250</p>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full gap-2 mt-4" disabled={isLoading}>
                  {accountType === 'helper' ? (
                    <>
                      Proceed to Verification & Payout Details
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Customer Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* STEP 2 FORM (Worker Government ID Proofs & Payout Account) */}
            {accountType === 'helper' && step === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                {/* Section 1: Government ID Verification */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">1. Government ID Proof</h4>
                      <p className="text-xs text-muted-foreground">Required for identity verification & safety compliance</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ID Type */}
                    <div className="space-y-2">
                      <Label htmlFor="govIdType">Document Proof Type</Label>
                      <div className="relative">
                        <select
                          id="govIdType"
                          value={govIdType}
                          onChange={(e) => setGovIdType(e.target.value)}
                          className="w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        >
                          {GOV_ID_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* ID Number */}
                    <div className="space-y-2">
                      <Label htmlFor="govIdNumber">Government ID Number</Label>
                      <Input
                        id="govIdNumber"
                        placeholder="e.g. 5489 1204 8921"
                        value={govIdNumber}
                        onChange={(e) => setGovIdNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* ID Proof File Upload Dropzone */}
                  <div className="space-y-2">
                    <Label>Upload Government ID Proof Photo/PDF</Label>
                    <div className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-border hover:border-primary/50 rounded-xl bg-secondary/30 transition-all text-center">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {govIdDocName ? (
                        <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                          <FileCheck className="w-5 h-5" />
                          <span>Uploaded: {govIdDocName}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-xs text-foreground font-medium">Click or drag & drop ID document file</p>
                          <p className="text-[11px] text-muted-foreground mt-1">Supports JPG, PNG, PDF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Bank Payout Account Details */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">2. Bank Payout Account Details</h4>
                      <p className="text-xs text-muted-foreground">Payments for completed jobs will be directly deposited here</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Account Holder Name */}
                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        placeholder="Name as per bank passbook"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Bank Name */}
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="e.g. State Bank of India / HDFC"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Account Number */}
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        type="password"
                        placeholder="Enter bank account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                      />
                    </div>

                    {/* IFSC Code */}
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC / Branch Code</Label>
                      <Input
                        id="ifscCode"
                        placeholder="e.g. SBIN0001234"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* UPI ID (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID (Optional for instant payouts)</Label>
                    <Input
                      id="upiId"
                      placeholder="e.g. username@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Step 1
                  </Button>
                  <Button type="submit" className="flex-[2] gap-2" disabled={isLoading}>
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Submit & Create Worker Profile
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        defaultRole={accountType}
      />

      {/* Registration Video Guide Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-white"
            >
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-2">
                <Play className="w-4 h-4 fill-amber-400" /> Video Registration Tutorial
              </div>
              <h3 className="text-xl font-bold text-white mb-4">How to Sign Up & Start Earning on DailyHire</h3>

              {/* Video Player Box Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex flex-col items-center justify-center p-6 text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/20 mb-3 animate-pulse">
                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                </div>
                <p className="text-sm font-bold text-white">Worker Profile Setup Walkthrough</p>
                <p className="text-xs text-slate-400 mt-1">2-Step Aadhaar ID Verification & Instant UPI Bank Payouts Guide</p>
              </div>

              <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-400" /> Toll-Free Helpline: <strong>1800 200 4500</strong>
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" /> <strong>support@dailyhire.com</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-full mt-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
              >
                Close Video Guide
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
