import Link from 'next/link';
import { MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background">
                Daily<span className="text-accent">Hire</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm">
              Find trusted local helpers instantly. Fast, reliable, and transparent.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-background mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link href="/explore?category=plumber" className="hover:text-background transition-colors">Plumbers</Link></li>
              <li><Link href="/explore?category=electrician" className="hover:text-background transition-colors">Electricians</Link></li>
              <li><Link href="/explore?category=cleaner" className="hover:text-background transition-colors">Cleaners</Link></li>
              <li><Link href="/explore?category=carpenter" className="hover:text-background transition-colors">Carpenters</Link></li>
              <li><Link href="/explore?category=mechanic" className="hover:text-background transition-colors">Mechanics</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-background mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link href="/about" className="hover:text-background transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-background transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-background transition-colors">Blog</Link></li>
              <li><Link href="/press" className="hover:text-background transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-background mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link href="/help" className="hover:text-background transition-colors">Help Center</Link></li>
              <li><Link href="/safety" className="hover:text-background transition-colors">Safety</Link></li>
              <li><Link href="/terms" className="hover:text-background transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/70">
            &copy; {new Date().getFullYear()} DailyHire. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-background/70 hover:text-background transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-background/70 hover:text-background transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-background/70 hover:text-background transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-background/70 hover:text-background transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
