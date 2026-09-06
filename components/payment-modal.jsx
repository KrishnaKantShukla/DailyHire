"use client"

import { useState } from 'react'
import { CheckCircle2, CreditCard, QrCode, Wallet, DollarSign, X, ShieldCheck, Loader2, ArrowRight, Download } from 'lucide-react'

export default function PaymentModal({ isOpen, onClose, booking, onPaymentSuccess }) {
  const [method, setMethod] = useState('upi')
  const [upiId, setUpiId] = useState('user@upi')
  const [processing, setProcessing] = useState(false)
  const [completedPayment, setCompletedPayment] = useState(null)

  if (!isOpen || !booking) return null

  const amount = booking.price || 450

  const handlePay = async () => {
    setProcessing(true)
    try {
      const res = await fetch('http://localhost:5000/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking._id || booking.id,
          customerId: booking.customerId || 'cust_1',
          helperId: booking.helperId || '1',
          amount: amount,
          paymentMethod: method,
        }),
      })

      const data = await res.json()
      if (data.success && data.payment) {
        setCompletedPayment(data.payment)
        if (onPaymentSuccess) onPaymentSuccess(data.payment)
      }
    } catch (err) {
      console.error('Payment error:', err)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-foreground text-sm">Secure Payment Gateway</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!completedPayment ? (
          <div className="p-5 space-y-5">
            {/* Booking Overview Card */}
            <div className="bg-muted/40 p-4 rounded-xl border border-border/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Service Fee</p>
                <h4 className="font-semibold text-foreground text-base">{booking.serviceName || 'Plumbing Repair'}</h4>
                <p className="text-xs text-muted-foreground">Provider: {booking.helperName || 'Rahul Sharma'}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">₹{amount}</span>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Incl. all taxes</p>
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'upi', label: 'UPI / GPay', icon: QrCode },
                  { id: 'card', label: 'Credit / Debit', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Wallet },
                  { id: 'cod', label: 'Cash after Service', icon: DollarSign },
                ].map((item) => {
                  const Icon = item.icon
                  const active = method === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id)}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium transition-all ${
                        active
                          ? 'border-primary bg-primary/10 text-primary font-semibold shadow-2xs'
                          : 'border-border bg-background hover:bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sub-inputs */}
            {method === 'upi' && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="text-xs text-muted-foreground">UPI VPA ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. 9876543210@paytm"
                  className="w-full bg-muted/30 border border-input rounded-xl px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
                </>
              ) : (
                <>
                  Pay ₹{amount} Now <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-bit Encrypted SSL Gateway Simulation
            </p>
          </div>
        ) : (
          /* Payment Success & Receipt View */
          <div className="p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Payment Successful!</h3>
              <p className="text-xs text-muted-foreground mt-1">Transaction ID: <span className="font-mono font-medium text-foreground">{completedPayment.transactionId}</span></p>
            </div>

            <div className="bg-muted/50 p-4 rounded-xl border border-border text-xs text-left space-y-2">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-foreground text-sm">₹{completedPayment.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium text-foreground uppercase">{completedPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">{completedPayment.status}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  alert(`Receipt invoice downloaded for transaction ${completedPayment.transactionId}`)
                }}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-border"
              >
                <Download className="w-3.5 h-3.5" /> Receipt PDF
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
