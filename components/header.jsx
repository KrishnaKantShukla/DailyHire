'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, LogOut, LayoutDashboard, ChevronDown, ShoppingBag, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

import NotificationCenter from '@/components/notification-center';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isHelper, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const pathname = usePathname();

  // Track scroll for elevated shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change / resize past lg
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
    : '';

  const displayName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User'
    : '';


  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/safety', label: 'Safety' },
    { href: '/blog', label: 'Blog' },
    { href: '/careers', label: 'Careers' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => {
              setIsMenuOpen(false);
              setIsProfileOpen(false);
            }}
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Daily<span className="text-accent">Hire</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-sm font-semibold transition-colors whitespace-nowrap group ${isActive ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-[3px] bg-black dark:bg-white rounded-full transition-all duration-200 ${isActive
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop & Mobile Right Bar Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Desktop Quick Role Button */}
            <div className="hidden md:block">
              {isHelper ? (
                <Link href="/dashboard">
                  <Button size="sm" variant="outline" className="text-xs font-semibold gap-1.5 border-primary text-primary hover:bg-primary/10">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Worker Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/explore">
                  <Button size="sm" className="text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90">
                    Find Helpers
                  </Button>
                </Link>
              )}
            </div>

            {/* Notification Center */}
            <NotificationCenter userId={user?._id || user?.id || 'cust_1'} />

            {/* Profile Avatar Button & Interactive Menu (Desktop + Mobile) */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  id="profile-menu-button"
                  onClick={() => {
                    setIsProfileOpen((v) => !v);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-1 rounded-full border border-border bg-card hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Open profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold select-none flex-shrink-0">
                    {initials}
                  </div>
                  <span className="hidden sm:inline-block text-sm font-medium text-foreground max-w-[100px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Shared Mobile/Desktop Dropdown Popover */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-60 sm:w-64 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 bg-secondary/50 border-b border-border">
                        <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        {user.accountType === 'helper' && user.profession && (
                          <span className="inline-block mt-1 text-[11px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                            {user.profession}
                          </span>
                        )}
                      </div>
                      <div className="py-1 border-b border-border">
                        {/* 1. Dashboard */}
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary" />
                          <span>Dashboard</span>
                        </Link>
                        {/* 2. My Orders / My Jobs */}
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-amber-500" />
                          <span>{isHelper ? 'My Jobs' : 'My Orders'}</span>
                        </Link>
                        {/* 3. Edit Profile */}
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          <User className="w-4 h-4 text-blue-500" />
                          <span>Edit Profile</span>
                        </Link>
                        {/* 4. Settings */}
                        <Link
                          href="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          <Settings className="w-4 h-4 text-emerald-500" />
                          <span>Settings</span>
                        </Link>
                      </div>
                      <div className="py-1">
                        {/* 5. Log Out */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-foreground">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile 3-line Hamburger Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-foreground hover:bg-secondary transition-colors focus:outline-none"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsProfileOpen(false);
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMenuOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (3-Line Menu Bar) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border bg-background/98 backdrop-blur-lg overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-xl text-base font-semibold transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="border-t border-border my-2" />

              {/* If logged out, show Login / Signup */}
              {!user && (
                <div className="flex flex-col gap-2 pt-1 pb-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center h-11 text-base font-semibold">Log in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-center h-11 text-base font-semibold bg-primary text-primary-foreground">Sign up</Button>
                  </Link>
                </div>
              )}

              {/* Quick action for logged in user */}
              {user && (
                <div className="pt-1 pb-2">
                  {isHelper ? (
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full justify-center h-11 text-base font-semibold gap-2">
                        <LayoutDashboard className="w-5 h-5" />
                        Worker Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/explore" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full justify-center h-11 text-base font-semibold bg-accent text-accent-foreground">
                        Find Helpers Near You
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
