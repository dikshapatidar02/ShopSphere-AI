import { render, screen, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccessibilityAnnouncer, announceToScreenReader } from '../AccessibilityAnnouncer';

describe('AccessibilityAnnouncer Live Region', () => {
  it('renders screen reader polite live region and announces dynamic messages', () => {
    render(<AccessibilityAnnouncer />);

    const liveRegion = screen.getByLabelText('Screen reader announcements');
    expect(liveRegion).toBeTruthy();
    expect(liveRegion.getAttribute('aria-live')).toBe('polite');

    act(() => {
      announceToScreenReader('Added 1 item of Wireless Headphones to cart');
    });

    expect(screen.getByText('Added 1 item of Wireless Headphones to cart')).toBeTruthy();
  });
});
