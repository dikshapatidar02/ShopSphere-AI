import type { Coupon } from '@/types';

export const MOCK_COUPONS: Record<string, Omit<Coupon, 'code' | 'isValid'>> = {
  WELCOME10: {
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 50,
  },
  SAVE20: {
    discountType: 'fixed',
    discountValue: 20,
    minOrderAmount: 50,
  },
  OFF50: {
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 100,
    maxDiscountAmount: 100,
  },
};

export function validateCoupon(code: string, subtotal: number): Coupon {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      code,
      discountType: 'fixed',
      discountValue: 0,
      isValid: false,
      validationError: 'Please enter a coupon code.',
    };
  }

  const match = MOCK_COUPONS[normalizedCode];

  if (!match) {
    return {
      code: normalizedCode,
      discountType: 'fixed',
      discountValue: 0,
      isValid: false,
      validationError: 'Invalid coupon code. Try "WELCOME10" or "SAVE20".',
    };
  }

  if (match.minOrderAmount && subtotal < match.minOrderAmount) {
    return {
      code: normalizedCode,
      ...match,
      isValid: false,
      validationError: `Minimum order subtotal of $${match.minOrderAmount} required for this coupon.`,
    };
  }

  return {
    code: normalizedCode,
    ...match,
    isValid: true,
  };
}
