import Link from 'next/link';
import { MapPin, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background border-t border-background/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background">
                Daily<span className="text-accent">Hire</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm max-w-sm leading-relaxed">
              DailyHire connects customers with verified local workers and professionals instantly. Fast, reliable, transparent, and direct bank payouts.
            </p>
            <div className="flex items-center gap-2 text-xs text-background/80 pt-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Government ID Verified Workers • Secured Payments</span>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div>
            <h3 className="font-semibold text-background text-sm mb-4 uppercase tracking-wider">Quick Navigation</h3>
            <ul className="space-y-2.5 text-sm text-background/70">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/safety" className="hover:text-primary transition-colors">Safety &amp; Trust</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Employers & Workers Column */}
          <div>
            <h3 className="font-semibold text-background text-sm mb-4 uppercase tracking-wider">Employers &amp; Workers</h3>
            <ul className="space-y-2.5 text-sm text-background/70">
              <li><Link href="/explore" className="hover:text-primary transition-colors">Find Local Helpers</Link></li>
              <li><Link href="/explore?category=plumbing" className="hover:text-primary transition-colors">Plumbing Services</Link></li>
              <li><Link href="/explore?category=electrical" className="hover:text-primary transition-colors">Electrical Repairs</Link></li>
              <li><Link href="/explore?category=cleaning" className="hover:text-primary transition-colors">Deep Housekeeping</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">Become a Worker</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Worker Payout Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact & Support Column */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-background text-sm mb-4 uppercase tracking-wider">Contact &amp; Support</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:support@dailyhire.com" className="hover:text-background truncate">support@dailyhire.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+91 1800 200 4500</span>
              </li>
              <li className="pt-1">
                <Link href="/contact">
                  <span className="inline-block px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                    Get Support &rarr;
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Social & Copyright */}
        <div className="mt-12 pt-8 border-t border-background/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-background/60">
          <p>&copy; {new Date().getFullYear()} DailyHire Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/safety" className="hover:text-background">Safety Policy</Link>
            <Link href="/contact" className="hover:text-background">Contact Us</Link>
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 text-background transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 text-background transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 text-background transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 text-background transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
