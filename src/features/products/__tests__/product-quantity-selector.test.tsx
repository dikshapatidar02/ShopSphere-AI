import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductQuantitySelector } from '../components/ProductQuantitySelector';

describe('ProductQuantitySelector Component', () => {
  it('should render quantity and handle increase/decrease', () => {
    const handleChange = vi.fn();
    render(
      <ProductQuantitySelector
        quantity={2}
        maxQuantity={5}
        onChange={handleChange}
      />
    );

    const decreaseBtn = screen.getByLabelText('Decrease quantity');
    const increaseBtn = screen.getByLabelText('Increase quantity');

    fireEvent.click(decreaseBtn);
    expect(handleChange).toHaveBeenCalledWith(1);

    fireEvent.click(increaseBtn);
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('should disable decrease button when quantity is 1', () => {
    const handleChange = vi.fn();
    render(
      <ProductQuantitySelector
        quantity={1}
        maxQuantity={5}
        onChange={handleChange}
      />
    );

    const decreaseBtn = screen.getByLabelText('Decrease quantity') as HTMLButtonElement;
    expect(decreaseBtn.disabled).toBe(true);
  });

  it('should disable increase button when quantity reaches maxQuantity', () => {
    const handleChange = vi.fn();
    render(
      <ProductQuantitySelector
        quantity={5}
        maxQuantity={5}
        onChange={handleChange}
      />
    );

    const increaseBtn = screen.getByLabelText('Increase quantity') as HTMLButtonElement;
    expect(increaseBtn.disabled).toBe(true);
  });
});
