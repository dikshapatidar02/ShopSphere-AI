import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AdminMetricCard } from '../components/AdminMetricCard';
import { ProductInventoryBadge } from '../components/ProductInventoryBadge';
import { ProductDeleteDialog } from '../components/ProductDeleteDialog';
import { OrderStatusControl } from '../components/OrderStatusControl';
import { DollarSign } from 'lucide-react';

describe('Admin UI Components', () => {
  it('renders AdminMetricCard with title, value, and trend', () => {
    render(
      <AdminMetricCard
        title="Total Revenue"
        value="$12,450.00"
        icon={DollarSign}
        trend={{ value: '+15%', isPositive: true }}
        description="Derived from mock orders"
      />
    );

    expect(screen.getByText('Total Revenue')).toBeDefined();
    expect(screen.getByText('$12,450.00')).toBeDefined();
    expect(screen.getByText('+15%')).toBeDefined();
    expect(screen.getByText('Derived from mock orders')).toBeDefined();
  });

  it('renders ProductInventoryBadge with stock status classes', () => {
    const { rerender } = render(<ProductInventoryBadge stock={12} availability="in_stock" />);
    expect(screen.getByText('In Stock (12)')).toBeDefined();

    rerender(<ProductInventoryBadge stock={3} availability="low_stock" />);
    expect(screen.getByText('Low Stock (3)')).toBeDefined();

    rerender(<ProductInventoryBadge stock={0} availability="out_of_stock" />);
    expect(screen.getByText('Out of Stock')).toBeDefined();
  });

  it('renders ProductDeleteDialog modal and handles confirmation click', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(
      <ProductDeleteDialog
        isOpen={true}
        productTitle="Essence Mascara"
        isDeleting={false}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('Confirm Product Deletion')).toBeDefined();
    expect(screen.getByText('Essence Mascara')).toBeDefined();

    const deleteBtn = screen.getByRole('button', { name: /Delete Product/i });
    fireEvent.click(deleteBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('renders OrderStatusControl with status badge and dropdown', async () => {
    const onStatusChange = vi.fn().mockResolvedValue({});

    render(
      <OrderStatusControl
        currentStatus="placed"
        onStatusChange={onStatusChange}
      />
    );

    expect(screen.getByText('placed')).toBeDefined();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'shipped' } });

    expect(onStatusChange).toHaveBeenCalledWith('shipped');
  });
});
