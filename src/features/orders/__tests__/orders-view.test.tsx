import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OrdersView } from '../components/OrdersView';

describe('OrdersView Component', () => {
  it('renders page title and empty state when user has no orders', async () => {
    render(<OrdersView />);
    expect(screen.getByText('My Orders')).toBeDefined();
    await waitFor(() => {
      expect(screen.getByText('No Orders Found')).toBeDefined();
    });
  });
});
