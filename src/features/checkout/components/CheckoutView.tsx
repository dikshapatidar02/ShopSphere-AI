'use client';

import { useCart } from '@/hooks/use-cart';
import { useCheckoutStore } from '@/store/checkout.store';
import { useState } from 'react';
import { AddressList } from './AddressList';
import { CheckoutEmptyState } from './CheckoutEmptyState';
import { CheckoutHeader } from './CheckoutHeader';
import { CheckoutSummary } from './CheckoutSummary';
import { DeliveryMethod } from './DeliveryMethod';
import { OrderReview } from './OrderReview';
import { PaymentMethod } from './PaymentMethod';

export function CheckoutView() {
  const { items, summary, isEmpty } = useCart();
  const {
    currentStep,
    shippingAddress,
    selectedDeliveryOption,
    selectedPaymentMethod,
    setStep,
    setShippingAddress,
    setDeliveryOption,
    setPaymentMethod,
  } = useCheckoutStore();

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4000000000001234',
    cardHolderName: 'Alex Johnson',
    expiryDate: '12/28',
  });

  const [upiId, setUpiId] = useState('alex@upi');

  if (isEmpty) {
    return <CheckoutEmptyState />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <CheckoutHeader currentStep={currentStep} onStepClick={setStep} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Step Content */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {currentStep === 'shipping_address' && (
            <AddressList
              selectedAddress={shippingAddress}
              onSelectAddress={setShippingAddress}
              onNext={() => setStep('delivery_method')}
            />
          )}

          {currentStep === 'delivery_method' && (
            <DeliveryMethod
              selectedOption={selectedDeliveryOption}
              onSelectOption={setDeliveryOption}
              subtotal={summary.subtotal}
              onNext={() => setStep('payment_method')}
              onBack={() => setStep('shipping_address')}
            />
          )}

          {currentStep === 'payment_method' && (
            <PaymentMethod
              selectedMethod={selectedPaymentMethod}
              onSelectMethod={setPaymentMethod}
              cardDetails={cardDetails}
              onCardDetailsChange={setCardDetails}
              upiId={upiId}
              onUpiIdChange={setUpiId}
              onNext={() => setStep('review_order')}
              onBack={() => setStep('delivery_method')}
            />
          )}

          {(currentStep === 'review_order' || currentStep === 'confirmation') && shippingAddress && (
            <OrderReview
              items={items}
              shippingAddress={shippingAddress}
              deliveryOption={selectedDeliveryOption}
              paymentMethod={selectedPaymentMethod}
              cardDetails={cardDetails}
              upiId={upiId}
              onBack={() => setStep('payment_method')}
            />
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
          <CheckoutSummary
            summary={summary}
            selectedDeliveryOption={selectedDeliveryOption}
          />
        </div>
      </div>
    </main>
  );
}
