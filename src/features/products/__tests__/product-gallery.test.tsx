import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductGallery } from '../components/ProductGallery';

const sampleImages = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
];

describe('ProductGallery Component', () => {
  it('should render primary main image and thumbnails', () => {
    render(<ProductGallery images={sampleImages} title="Test Laptop" />);

    const mainImg = screen.getByAltText('Test Laptop - Main view');
    expect(mainImg).toBeDefined();

    const thumb1 = screen.getByLabelText('View Test Laptop image 1');
    const thumb2 = screen.getByLabelText('View Test Laptop image 2');

    expect(thumb1).toBeDefined();
    expect(thumb2).toBeDefined();
  });

  it('should switch active image when clicking thumbnails', () => {
    render(<ProductGallery images={sampleImages} title="Test Laptop" />);

    const thumb2 = screen.getByLabelText('View Test Laptop image 2');
    fireEvent.click(thumb2);

    expect(thumb2.getAttribute('aria-pressed')).toBe('true');
  });
});
