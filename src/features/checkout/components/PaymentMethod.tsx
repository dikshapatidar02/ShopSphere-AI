'use client';

import type { MockPaymentMethod } from '@/types';
import { CreditCard, Info, Landmark, QrCode, ShieldCheck, Wallet } from 'lucide-react';
import { useState } from 'react';

interface PaymentMethodProps {
  readonly selectedMethod: MockPaymentMethod;
  readonly onSelectMethod: (method: MockPaymentMethod) => void;
  readonly cardDetails: { cardNumber: string; cardHolderName: string; expiryDate: string };
  readonly onCardDetailsChange: (details: { cardNumber: string; cardHolderName: string; expiryDate: string }) => void;
  readonly upiId: string;
  readonly onUpiIdChange: (upiId: string) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

const METHODS: { id: MockPaymentMethod; name: string; desc: string; icon: React.ElementType }[] = [
  {
    id: 'mock_credit_card',
    name: 'Credit / Debit Card (Simulated)',
    desc: 'Pay securely using mock card details',
    icon: CreditCard,
  },
  {
    id: 'mock_upi',
    name: 'UPI / Instant Pay (Simulated)',
    desc: 'Google Pay, PhonePe, Paytm or VPA',
    icon: QrCode,
  },
  {
    id: 'mock_net_banking',
    name: 'Net Banking (Simulated)',
    desc: 'Simulated online bank transfer',
    icon: Landmark,
  },
  {
    id: 'mock_cod',
    name: 'Cash on Delivery (COD)',
    desc: 'Pay with cash upon delivery at doorstep',
    icon: Wallet,
  },
];

export function PaymentMethod({
  selectedMethod,
  onSelectMethod,
  cardDetails,
  onCardDetailsChange,
  upiId,
  onUpiIdChange,
  onNext,
  onBack,
}: PaymentMethodProps) {
  const [simulateFailureToggle, setSimulateFailureToggle] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Select Payment Method
        </h2>
        <p className="text-xs text-muted-foreground">
          Choose how you would like to complete your order payment.
        </p>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        {METHODS.map((m) => {
          const isSelected = selectedMethod === m.id;
          const Icon = m.icon;

          return (
            <div
              key={m.id}
              onClick={() => onSelectMethod(m.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectMethod(m.id);
                }
              }}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-xs'
                  : 'border-border bg-card hover:border-foreground/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground">{m.name}</h3>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Form Fields based on method */}
      {selectedMethod === 'mock_credit_card' && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <CreditCard className="h-4 w-4 text-primary" />
            <span>Simulated Card Inputs</span>
          </div>

          <div className="space-y-2">
            <div>
              <label htmlFor="cardNumber" className="font-medium text-foreground">
                Card Number (Demo)
              </label>
              <input
                id="cardNumber"
                type="text"
                value={cardDetails.cardNumber}
                onChange={(e) =>
                  onCardDetailsChange({ ...cardDetails, cardNumber: e.target.value })
                }
                placeholder="4000 0000 0000 1234"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="cardHolder" className="font-medium text-foreground">
                  Cardholder Name
                </label>
                <input
                  id="cardHolder"
                  type="text"
                  value={cardDetails.cardHolderName}
                  onChange={(e) =>
                    onCardDetailsChange({ ...cardDetails, cardHolderName: e.target.value })
                  }
                  placeholder="Alex Johnson"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="expiry" className="font-medium text-foreground">
                  Expiry (MM/YY)
                </label>
                <input
                  id="expiry"
                  type="text"
                  value={cardDetails.expiryDate}
                  onChange={(e) =>
                    onCardDetailsChange({ ...cardDetails, expiryDate: e.target.value })
                  }
                  placeholder="12/28"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'mock_upi' && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-xs shadow-xs">
          <label htmlFor="upiId" className="font-semibold text-foreground">
            Virtual Payment Address / UPI ID
          </label>
          <input
            id="upiId"
            type="text"
            value={upiId}
            onChange={(e) => onUpiIdChange(e.target.value)}
            placeholder="alex@upi"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}

      {/* Failure Testing Simulation Toggle */}
      <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
            <Info className="h-4 w-4 shrink-0" />
            <span>Simulate Payment Failure Mode (Testing)</span>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !simulateFailureToggle;
              setSimulateFailureToggle(next);
              onCardDetailsChange({
                ...cardDetails,
                cardNumber: next ? '4000000000004002' : '4000000000001234',
              });
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
              simulateFailureToggle
                ? 'bg-amber-600 text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {simulateFailureToggle ? 'Failure Mode: ON' : 'Failure Mode: OFF'}
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          When ON, the mock payment provider will trigger a simulated bank decline to verify cart preservation & retry handling.
        </p>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>Demo environment only. No real payment credentials or money are used or stored.</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-input bg-background px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        >
          Continue to Order Review
        </button>
      </div>
    </div>
  );
}
