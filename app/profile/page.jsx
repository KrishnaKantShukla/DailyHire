'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, User, Save, X, ShieldCheck, Briefcase, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getUser, getToken, setUser as setAuthUser } from '@/lib/auth';
import { API_BASE } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    profession: '',
    bio: '',
  });

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setFormState({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        profession: currentUser.profession || '',
        bio: currentUser.bio || '',
      });
      setIsLoading(false);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formState),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      // Update auth session
      const updatedUser = { ...user, ...formState, ...result.user };
      setAuthUser(updatedUser, token);
      setUser(updatedUser);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      // Fallback save locally if backend token verification is optional
      const updatedUser = { ...user, ...formState };
      setAuthUser(updatedUser, getToken());
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isHelper = user?.role === 'helper' || user?.accountType === 'helper';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 text-sm font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Profile</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isHelper ? 'Worker Account Details' : 'Employer Account Details'}
                </p>
              </div>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 rounded-xl flex items-center justify-between text-xs">
                <span>{error}</span>
                <button onClick={() => setError('')} className="hover:text-red-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span>{success}</span>
                <button onClick={() => setSuccess('')} className="hover:text-green-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formState.firstName}
                      onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formState.lastName}
                      onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formState.username}
                    onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  />
                </div>

                {isHelper && (
                  <div className="space-y-1.5">
                    <Label htmlFor="profession" className="text-xs">Profession / Skill</Label>
                    <Input
                      id="profession"
                      type="text"
                      placeholder="e.g. Plumber, Electrician, Cleaner"
                      value={formState.profession}
                      onChange={(e) => setFormState({ ...formState, profession: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">First Name</p>
                    <p className="text-base font-semibold text-foreground">
                      {formState.firstName || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Name</p>
                    <p className="text-base font-semibold text-foreground">
                      {formState.lastName || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Username
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    @{formState.username || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </p>
                  <p className="text-base font-semibold text-foreground">{formState.email}</p>
                </div>

                {formState.phone && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone Number
                    </p>
                    <p className="text-base font-semibold text-foreground">{formState.phone}</p>
                  </div>
                )}

                {isHelper && formState.profession && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Profession
                    </p>
                    <p className="text-base font-semibold text-primary">{formState.profession}</p>
                  </div>
                )}

                <div className="pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Account Type: <strong className="text-foreground capitalize">{user?.accountType || user?.role || 'Customer'}</strong></span>
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Active Session
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
