'use client';

import React, { useState } from 'react';
import { ShieldCheck, FileText, CreditCard, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function HelperProfileTab({ user, onUpdateProfile }) {
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    profession: user?.profession || '',
    hourlyRate: user?.hourlyRate || 450,
    bio: user?.bio || '',
    govIdType: user?.govIdType || 'Aadhaar Card',
    govIdNumber: user?.govIdNumber || '',
    bankName: user?.bankName || '',
    accountHolderName: user?.accountHolderName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    accountNumber: user?.accountNumber || '',
    ifscCode: user?.ifscCode || '',
    upiId: user?.upiId || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(formData);
      }
      toast.success('Worker verification details updated successfully!');
    } catch (err) {
      toast.error('Failed to update details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Worker Profile & Verification</h3>
          <p className="text-xs text-muted-foreground">Manage your profession, government ID, and bank payout settings</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>{user?.verificationStatus === 'verified' ? 'Verified Partner' : 'Pending Verification'}</span>
        </div>
      </div>

      {/* Professional Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Profession / Primary Skill</label>
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. Master Plumber"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Hourly Rate (₹/hr)</label>
          <input
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Gov ID */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Government ID Proof
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">ID Document Type</label>
            <select
              value={formData.govIdType}
              onChange={(e) => setFormData({ ...formData, govIdType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="PAN Card">PAN Card</option>
              <option value="Driving License">Driving License</option>
              <option value="Voter ID">Voter ID</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Document Number</label>
            <input
              type="text"
              value={formData.govIdNumber}
              onChange={(e) => setFormData({ ...formData, govIdNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="XXXX XXXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* Payout & Bank Info */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          Payout & Bank Account Details
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Bank Name</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. HDFC Bank"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Account Number</label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="XXXXXXXXXXXX"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">IFSC Code</label>
            <input
              type="text"
              value={formData.ifscCode}
              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="HDFC0001234"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">UPI ID (Fast Payout)</label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="name@upi"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Profile Details'}
        </Button>
      </div>
    </form>
  );
}
