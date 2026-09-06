'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Star,
  ArrowRight,
  LocateFixed,
  IndianRupee,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBooking, fetchServices } from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function QuickBookingModal({ isOpen, onClose, helper, onSuccess }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [arrivalType, setArrivalType] = useState('immediate'); // 'immediate' | 'scheduled'
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('Within 30 mins');
  const [durationHours, setDurationHours] = useState(1);
  const [address, setAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash_after_job'); // 'cash_after_job' | 'upi_spot' | 'online'
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchServices()
        .then((data) => {
          setServices(data || []);
          if (data && data.length > 0) {
            setSelectedService(data[0]);
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen || !helper) return null;

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAddress(`GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) - Near Sector 62`);
        setIsLocating(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setAddress('Sector 62, Near City Center');
        setIsLocating(false);
      }
    );
  };

  const basePrice = selectedService ? selectedService.basePrice : helper.hourlyRate || 400;
  const subtotal = basePrice * durationHours;
  const platformFee = 20;
  const totalAmount = subtotal + platformFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const user = getUser();
    const userId = user?.id || user?._id;

    if (!user || !userId) {
      window.location.href = '/login';
      return;
    }

    if (!address.trim()) {
      setError('Please enter or auto-detect your service address.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        customerId: userId,
        customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Employer',
        helperId: helper.customId || helper._id || helper.id,
        helperName: helper.name,
        helperImage: helper.image,
        serviceName: selectedService ? selectedService.name : `${helper.profession} Service`,
        price: totalAmount,
        date: arrivalType === 'immediate' ? 'Today (Immediate)' : selectedDate,
        time: arrivalType === 'immediate' ? 'Within 30-45 mins' : selectedTime,
        notes: notes ? `${notes} (Duration: ${durationHours} hrs)` : `Duration: ${durationHours} hrs`,
        address,
        paymentMode,
      };

      const result = await createBooking(payload);

      if (onSuccess) {
        onSuccess(result.booking || result);
      } else {
        window.location.href = `/tracking/${helper.customId || helper._id || helper.id}`;
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-6"
        >
          {/* Top Banner */}
          <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-primary/10 via-background to-accent/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary shrink-0 shadow-sm">
                <Image src={helper.image} alt={helper.name} fill className="object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-foreground">{helper.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 border border-green-500/20">
                    Aadhaar Verified
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{helper.profession}</span> •
                  <span className="flex items-center text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-500 mr-0.5" /> {helper.rating || 4.9}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Step 1: Arrival Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                1. Arrival Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setArrivalType('immediate')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    arrivalType === 'immediate'
                      ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4.5 h-4.5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground">Hire Immediately</div>
                    <div className="text-[11px] text-muted-foreground">Arrive in 30-45 mins</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setArrivalType('scheduled')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    arrivalType === 'scheduled'
                      ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground">Schedule Later</div>
                    <div className="text-[11px] text-muted-foreground">Pick date & time</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Scheduled Date/Time selectors if scheduled */}
            {arrivalType === 'scheduled' && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-secondary/30 border border-border">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Date</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-background border border-input text-foreground"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Day After Tomorrow">Day After Tomorrow</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">Time Slot</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-background border border-input text-foreground"
                  >
                    <option value="9:00 AM - 11:00 AM">Morning (9:00 AM - 11:00 AM)</option>
                    <option value="12:00 PM - 2:00 PM">Afternoon (12:00 PM - 2:00 PM)</option>
                    <option value="4:00 PM - 6:00 PM">Evening (4:00 PM - 6:00 PM)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Service & Duration */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                2. Service Package & Duration
              </label>

              <div className="grid grid-cols-2 gap-2">
                {services.map((srv) => (
                  <button
                    key={srv._id || srv.customId || srv.name}
                    type="button"
                    onClick={() => setSelectedService(srv)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedService?.name === srv.name
                        ? 'border-primary bg-primary/10 text-foreground font-semibold'
                        : 'border-border bg-card text-muted-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <div className="text-foreground font-bold">{srv.name}</div>
                    <div className="text-[11px] text-primary">₹{srv.basePrice} / hr</div>
                  </button>
                ))}
              </div>

              {/* Hours Duration Slider */}
              <div className="p-3 rounded-xl bg-secondary/30 border border-border space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">Estimated Duration:</span>
                  <span className="font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                    {durationHours} {durationHours === 1 ? 'Hour' : 'Hours'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                  <span>1 hr (Quick Fix)</span>
                  <span>4 hrs (Half Day)</span>
                  <span>8 hrs (Full Day)</span>
                </div>
              </div>
            </div>

            {/* Step 3: Location Address */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  3. Service Delivery Address
                </label>
                <button
                  type="button"
                  onClick={handleGeoLocation}
                  disabled={isLocating}
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  {isLocating ? 'Detecting...' : 'Use GPS Location'}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter house no, street, landmark, area"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Step 4: Payment Option */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                4. Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('cash_after_job')}
                  className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                    paymentMode === 'cash_after_job'
                      ? 'border-primary bg-primary/10 text-foreground font-bold'
                      : 'border-border bg-card text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('upi_spot')}
                  className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                    paymentMode === 'upi_spot'
                      ? 'border-primary bg-primary/10 text-foreground font-bold'
                      : 'border-border bg-card text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  UPI / QR Code
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('online')}
                  className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                    paymentMode === 'online'
                      ? 'border-primary bg-primary/10 text-foreground font-bold'
                      : 'border-border bg-card text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  Pay Online
                </button>
              </div>
            </div>

            {/* Total Fare Card */}
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Service Charge ({durationHours} hrs × ₹{basePrice}):</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Platform & Insurance Fee:</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="pt-1.5 border-t border-border flex justify-between font-extrabold text-sm text-foreground">
                <span>Total Amount:</span>
                <span className="text-primary">₹{totalAmount}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 text-xs"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm & Hire {helper.name.split(' ')[0]} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span>100% Direct Worker Payout • Free Cancellation before dispatch</span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
