import { describe, expect, it } from 'vitest';
import { validateAddress } from '../address.service';

describe('Address Validation', () => {
  it('validates a complete and correct address', () => {
    const result = validateAddress({
      recipientName: 'Alex Johnson',
      line1: '123 Market Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States',
      phone: '+1 (555) 234-5678',
    });

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('detects missing required address fields', () => {
    const result = validateAddress({
      recipientName: '',
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.recipientName).toBeDefined();
    expect(result.errors.line1).toBeDefined();
    expect(result.errors.city).toBeDefined();
    expect(result.errors.state).toBeDefined();
    expect(result.errors.postalCode).toBeDefined();
    expect(result.errors.country).toBeDefined();
  });

  it('rejects invalid postal code format', () => {
    const result = validateAddress({
      recipientName: 'Alex Johnson',
      line1: '123 Market Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '!',
      country: 'United States',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.postalCode).toBeDefined();
  });
});
