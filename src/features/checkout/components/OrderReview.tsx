'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { paymentService } from '@/services/payment/payment.service';
import { orderService } from '@/services/orders/order.service';
import { productService } from '@/services/products/product.service';
import { useCheckoutStore } from '@/store/checkout.store';
import type { Address, CartItem, DeliveryOption, MockPaymentMethod, OrderItem } from '@/types';
import { AlertCircle, ArrowRight, CreditCard, MapPin, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OrderReviewProps {
  readonly items: readonly CartItem[];
  readonly shippingAddress: Address;
  readonly deliveryOption: DeliveryOption;
  readonly paymentMethod: MockPaymentMethod;
  readonly cardDetails: { cardNumber: string; cardHolderName: string; expiryDate: string };
  readonly upiId: string;
  readonly onBack: () => void;
}

export function OrderReview({
  items,
  shippingAddress,
  deliveryOption,
  paymentMethod,
  cardDetails,
  upiId,
  onBack,
}: OrderReviewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { summary, clearCart } = useCart();
  const { isProcessing, setIsProcessing, resetCheckout } = useCheckoutStore();

  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [revalidationWarning, setRevalidationWarning] = useState<string | null>(null);

  const fallbackImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80';

  const handlePlaceOrder = async () => {
    if (isProcessing) return; // Prevent double submission
    setIsProcessing(true);
    setPaymentError(null);
    setRevalidationWarning(null);

    try {
      // Step 1: Cart Revalidation
      let revalidationFailed = false;
      await Promise.all(
        items.map(async (item) => {
          const res = await productService.getProductById(item.productId);
          if (res.success && res.data) {
            if (res.data.stock < item.quantity || res.data.availability === 'out_of_stock') {
              revalidationFailed = true;
            }
          }
        })
      );

      if (revalidationFailed) {
        setRevalidationWarning('One or more items in your cart have updated stock limits. Please review your cart.');
        setIsProcessing(false);
        return;
      }

      // Step 2: Process Mock Payment
      const paymentRes = await paymentService.processPayment(paymentMethod, summary.grandTotal, {
        simulateFailure: cardDetails.cardNumber.endsWith('4002'),
        cardDetails,
        upiId,
      });

      if (paymentRes.status !== 'successful') {
        setPaymentError(paymentRes.errorMessage || 'Payment transaction failed. Your cart has been preserved.');
        setIsProcessing(false);
        return;
      }

      // Step 3: Map Order Items Historical Snapshot
      const orderItems: OrderItem[] = items.map((i) => ({
        id: `oitem-${i.id}-${Date.now()}`,
        productId: i.productId,
        productTitle: i.productTitle,
        productThumbnail: i.productThumbnail || fallbackImage,
        selectedVariantId: i.selectedVariantId,
        variantAttributes: i.selectedAttributes,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        totalPrice: i.unitPrice * i.quantity,
      }));

      // Step 4: Create Order
      const createRes = await orderService.createOrder({
        userId: user?.id || 'user-guest-1',
        customerName: user?.name || shippingAddress.recipientName,
        customerEmail: user?.email || 'customer@example.com',
        items: orderItems,
        shippingAddress,
        billingAddress: shippingAddress,
        deliveryOption,
        subtotal: summary.subtotal,
        discountTotal: summary.discountTotal,
        shippingTotal: summary.shippingTotal,
        taxTotal: summary.taxTotal,
        grandTotal: summary.grandTotal,
        paymentDetails: paymentRes,
      });

      if (!createRes.success || !createRes.data) {
        setPaymentError('Failed to create order record. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Step 5: Success — Clear Cart, Reset Checkout, Navigate
      clearCart();
      resetCheckout();
      router.push(`/checkout/success/${createRes.data.id}`);
    } catch {
      setPaymentError('An unexpected error occurred during order submission.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Review & Confirm Order
        </h2>
        <p className="text-xs text-muted-foreground">
          Please review your order details before placing your order.
        </p>
      </div>

      {revalidationWarning && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{revalidationWarning}</span>
        </div>
      )}

      {paymentError && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-2" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{paymentError}</span>
        </div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Shipping Address */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Shipping Address</span>
          </div>
          <p className="font-semibold text-foreground">{shippingAddress.recipientName}</p>
          <p className="text-muted-foreground">{shippingAddress.line1}</p>
          <p className="text-muted-foreground">
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
          </p>
        </div>

        {/* Delivery Method */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Truck className="h-4 w-4 text-primary" />
            <span>Delivery Method</span>
          </div>
          <p className="font-semibold text-foreground">{deliveryOption.name}</p>
          <p className="text-muted-foreground">{deliveryOption.description}</p>
          <p className="text-muted-foreground font-medium">Est. {deliveryOption.estimatedDays}</p>
        </div>

        {/* Payment Method */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <CreditCard className="h-4 w-4 text-primary" />
            <span>Payment Method</span>
          </div>
          <p className="font-semibold text-foreground capitalize">
            {paymentMethod.replace('mock_', '').replace('_', ' ')}
          </p>
          <p className="text-muted-foreground">Simulated Demo Transaction</p>
        </div>
      </div>

      {/* Items Snapshot */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
        <h3 className="font-bold text-sm text-foreground border-b border-border pb-2">
          Order Items ({items.length})
        </h3>

        <div className="divide-y divide-border/60">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 rounded-lg bg-muted border border-border overflow-hidden">
                  <Image
                    src={item.productThumbnail || fallbackImage}
                    alt={item.productTitle}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-foreground line-clamp-1">{item.productTitle}</h4>
                  <p className="text-muted-foreground text-[11px]">
                    Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <span className="font-bold text-foreground shrink-0">
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Place Order CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="w-full sm:w-auto rounded-xl border border-input bg-background px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-colors"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all"
        >
          {isProcessing ? (
            <span>Processing Order & Payment...</span>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              <span>Place Order (${summary.grandTotal.toFixed(2)})</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>By placing this order, you authorize the simulated demo checkout transaction.</span>
      </div>
    </div>
  );
}
