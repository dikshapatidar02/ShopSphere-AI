import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AccountEmptyState } from '../components/AccountEmptyState';
import { AccountErrorState } from '../components/AccountErrorState';

describe('Account UI Components', () => {
  it('renders AccountEmptyState with custom title, description, and action button', () => {
    render(
      <AccountEmptyState
        title="No Orders Found"
        description="You have not placed any orders yet."
        actionLabel="Start Shopping"
        actionHref="/products"
      />
    );

    expect(screen.getByText('No Orders Found')).toBeDefined();
    expect(screen.getByText('You have not placed any orders yet.')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Start Shopping' })).toBeDefined();
  });

  it('renders AccountErrorState with custom error message', () => {
    render(<AccountErrorState message="Failed to load orders." />);

    expect(screen.getByText('Failed to load orders.')).toBeDefined();
  });
});
