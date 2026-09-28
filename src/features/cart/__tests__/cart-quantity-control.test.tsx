import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CartQuantityControl } from '../components/CartQuantityControl';

describe('CartQuantityControl', () => {
  it('renders current quantity and handles increase and decrease', () => {
    const onChange = vi.fn();
    render(
      <CartQuantityControl
        quantity={2}
        maxQuantity={5}
        onQuantityChange={onChange}
        productTitle="Test Product"
      />
    );

    expect(screen.getByText('2')).toBeDefined();

    const increaseBtn = screen.getByRole('button', {
      name: 'Increase quantity for Test Product',
    });
    const decreaseBtn = screen.getByRole('button', {
      name: 'Decrease quantity for Test Product',
    });

    fireEvent.click(increaseBtn);
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.click(decreaseBtn);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('disables decrease button at minimum quantity 1', () => {
    const onChange = vi.fn();
    render(
      <CartQuantityControl
        quantity={1}
        maxQuantity={5}
        onQuantityChange={onChange}
        productTitle="Test Product"
      />
    );

    const decreaseBtn = screen.getByRole('button', {
      name: 'Decrease quantity for Test Product',
    }) as HTMLButtonElement;
    expect(decreaseBtn.disabled).toBe(true);
  });

  it('disables increase button at maximum stock limit', () => {
    const onChange = vi.fn();
    render(
      <CartQuantityControl
        quantity={5}
        maxQuantity={5}
        onQuantityChange={onChange}
        productTitle="Test Product"
      />
    );

    const increaseBtn = screen.getByRole('button', {
      name: 'Increase quantity for Test Product',
    }) as HTMLButtonElement;
    expect(increaseBtn.disabled).toBe(true);
  });
});
