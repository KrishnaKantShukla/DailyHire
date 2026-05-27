'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Shield,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { fetchHelper, fetchServices, createBooking } from '@/lib/api';
import { getUser } from '@/lib/auth';

const steps = ['Select Service', 'Date & Time', 'Payment', 'Confirmation'];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

export default function BookingPage({ params }) {
  const { id } = React.use(params);
  const [helper, setHelper] = useState(null);
  const [servicesList, setServicesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const service = servicesList.find((s) => s._id === selectedService);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [helperData, serviceData] = await Promise.all([
          fetchHelper(id),
          fetchServices(),
        ]);
        setHelper(helperData);
        setServicesList(serviceData);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError.message || 'Unable to load booking details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const confirmBooking = async () => {
    if (!service || !selectedDate || !selectedTime || !helper) {
      setError('Please select a service, date, and time.');
      return;
    }

    const user = getUser();
    if (!user || !user._id) {
      window.location.href = '/login';
      return;
    }

    setIsBooking(true);
    setError('');

    try {
      await createBooking({
        customerId: user._id,
        helperId: helper._id,
        serviceId: service._id,
        date: selectedDate,
        time: selectedTime,
        totalPrice: service.basePrice,
      });
      setCurrentStep(3);
    } catch (bookingError) {
      console.error(bookingError);
      setError(bookingError.message || 'Could not confirm booking.');
    } finally {
      setIsBooking(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedService !== null;
      case 1:
        return selectedDate !== null && selectedTime !== null;
      case 2:
        return true;
      default:
        return true;
    }
  };

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      full: date.toISOString().split('T')[0],
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                <p className="mt-4 text-muted-foreground">Loading booking checkout...</p>
              </div>
            </div>
          ) : error && !helper ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center max-w-lg">
                <p className="text-lg font-semibold text-foreground mb-3">Oops — we could not load your booking.</p>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Link href="/explore">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Return to Explore</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Back button */}
              <Link
                href={`/helper/${helper._id}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to profile
              </Link>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                            index < currentStep
                              ? 'bg-primary text-primary-foreground'
                              : index === currentStep
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                        </div>
                        <span className="text-xs mt-2 text-muted-foreground hidden sm:block">
                          {step}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 rounded ${
                            index < currentStep ? 'bg-primary' : 'bg-secondary'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Select Service */}
                    {currentStep === 0 && (
                      <motion.div
                        key="step-0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-card rounded-xl border border-border p-6"
                      >
                        <h2 className="text-xl font-semibold text-card-foreground mb-6">
                          Select a Service
                        </h2>
                        <div className="space-y-4">
                          {servicesList.map((svc) => (
                            <button
                              key={svc._id}
                              onClick={() => setSelectedService(svc._id)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                selectedService === svc._id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium text-card-foreground">{svc.name}</h3>
                                  <p className="text-sm text-muted-foreground">{svc.description}</p>
                                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    <span>{svc.duration}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-card-foreground">
                                    ₹{svc.basePrice}
                                  </p>
                                  {selectedService === svc._id && (
                                    <div className="mt-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                      <Check className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Date & Time */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-card rounded-xl border border-border p-6"
                      >
                        <h2 className="text-xl font-semibold text-card-foreground mb-6">
                          Choose Date & Time
                        </h2>

                        {/* Date Selection */}
                        <div className="mb-8">
                          <h3 className="font-medium text-card-foreground mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Select Date
                          </h3>
                          <div className="grid grid-cols-7 gap-2">
                            {dates.map((d) => (
                              <button
                                key={d.full}
                                onClick={() => setSelectedDate(d.full)}
                                className={`p-3 rounded-lg text-center transition-all ${
                                  selectedDate === d.full
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                              >
                                <p className="text-xs">{d.day}</p>
                                <p className="text-lg font-semibold">{d.date}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Time Selection */}
                        <div>
                          <h3 className="font-medium text-card-foreground mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            Select Time
                          </h3>
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {timeSlots.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                                  selectedTime === time
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-card rounded-xl border border-border p-6"
                      >
                        <h2 className="text-xl font-semibold text-card-foreground mb-6">
                          Payment Details
                        </h2>

                        <div className="space-y-4">
                          {/* Card Number */}
                          <div>
                            <label className="text-sm font-medium text-card-foreground mb-2 block">
                              Card Number
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Expiry */}
                            <div>
                              <label className="text-sm font-medium text-card-foreground mb-2 block">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                            </div>
                            {/* CVV */}
                            <div>
                              <label className="text-sm font-medium text-card-foreground mb-2 block">
                                CVV
                              </label>
                              <input
                                type="text"
                                placeholder="123"
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                            </div>
                          </div>

                          {/* Address */}
                          <div>
                            <label className="text-sm font-medium text-card-foreground mb-2 block">
                              Service Address
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Enter your address"
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        {/* Security Note */}
                        <div className="flex items-center gap-2 mt-6 p-4 rounded-lg bg-secondary/50">
                          <Shield className="w-5 h-5 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            Your payment is secured with 256-bit SSL encryption
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Confirmation */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-card rounded-xl border border-border p-6 text-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                          <Check className="w-10 h-10 text-green-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-card-foreground mb-2">
                          Booking Confirmed!
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          Your booking has been successfully placed. {helper.name} will arrive at your location.
                        </p>

                        <div className="bg-secondary/50 rounded-lg p-4 mb-6 text-left">
                          <h3 className="font-semibold text-card-foreground mb-3">Booking Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Service</span>
                              <span className="text-card-foreground">{service?.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Date</span>
                              <span className="text-card-foreground">{selectedDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Time</span>
                              <span className="text-card-foreground">{selectedTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total</span>
                              <span className="font-semibold text-card-foreground">₹{service?.basePrice}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link href={`/tracking/${helper._id}`} className="flex-1">
                            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                              Track Helper
                            </Button>
                          </Link>
                          <Link href="/" className="flex-1">
                            <Button variant="outline" className="w-full">
                              Back to Home
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  {currentStep < 3 && (
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <Button
                        onClick={currentStep === 2 ? confirmBooking : nextStep}
                        disabled={!canProceed() || isBooking}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                      >
                        {currentStep === 2 ? (isBooking ? 'Booking...' : 'Confirm Booking') : 'Continue'}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Inline error for booking failures */}
                  {error && helper && (
                    <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
                  )}
                </div>

                {/* Sidebar - Order Summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                    <h3 className="font-semibold text-card-foreground mb-4">Order Summary</h3>

                    {/* Helper Info */}
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={helper.image}
                          alt={helper.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{helper.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          <span className="text-sm text-muted-foreground">{helper.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Selected Items */}
                    <div className="py-4 space-y-3">
                      {service && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{service.name}</span>
                          <span className="text-card-foreground">₹{service.basePrice}</span>
                        </div>
                      )}
                      {selectedDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Date</span>
                          <span className="text-card-foreground">{selectedDate}</span>
                        </div>
                      )}
                      {selectedTime && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time</span>
                          <span className="text-card-foreground">{selectedTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between">
                        <span className="font-semibold text-card-foreground">Total</span>
                        <span className="font-semibold text-card-foreground">
                          ₹{service?.basePrice || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}