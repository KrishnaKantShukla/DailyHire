'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialServices = [
  { id: 1, name: 'Pipe Repair', price: '75', type: 'hourly', active: true },
  { id: 2, name: 'Drain Cleaning', price: '50', type: 'fixed', active: true },
  { id: 3, name: 'Water Heater Fix', price: '120', type: 'fixed', active: false },
  { id: 4, name: 'General Inspection', price: '30', type: 'hourly', active: true },
];

export default function ManageServicesPage() {
  const [services, setServices] = useState(initialServices);

  const toggleService = (id) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const removeService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Manage Services</h1>
                <p className="text-muted-foreground">Add, edit, or remove the services you offer.</p>
              </div>
            </div>
            <Button className="gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              Add New Service
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card rounded-xl border ${
                  service.active ? 'border-border' : 'border-border/50 opacity-75'
                } p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className={`font-semibold text-lg ${service.active ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                      {service.name}
                    </h3>
                    {service.active && (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    ₹{service.price} {service.type === 'hourly' ? 'per hour' : 'fixed rate'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleService(service.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      service.active ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <motion.div
                      animate={{ x: service.active ? 24 : 4 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                    />
                  </button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeService(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
