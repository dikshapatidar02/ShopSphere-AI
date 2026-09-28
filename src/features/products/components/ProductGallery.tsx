'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  readonly images?: readonly string[];
  readonly title: string;
}

export function ProductGallery({ images = [], title }: ProductGalleryProps) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=80';

  const validImages = images.length > 0 ? images : [fallbackImage];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const currentImageSrc = imageErrors[selectedIndex]
    ? fallbackImage
    : validImages[selectedIndex] || fallbackImage;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Primary Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-xs">
        <Image
          src={currentImageSrc}
          alt={`${title} - Main view`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          priority
          onError={() => {
            setImageErrors((prev) => ({ ...prev, [selectedIndex]: true }));
          }}
          className="h-full w-full object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnails List (Only if more than 1 image) */}
      {validImages.length > 1 && (
        <div
          role="region"
          aria-label="Product Image Thumbnails"
          className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar"
        >
          {validImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            const thumbSrc = imageErrors[idx] ? fallbackImage : img;

            return (
              <button
                key={`thumb-${idx}`}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View ${title} image ${idx + 1}`}
                aria-pressed={isSelected}
                className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  isSelected
                    ? 'border-primary shadow-xs ring-2 ring-primary/30'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={thumbSrc}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  onError={() => {
                    setImageErrors((prev) => ({ ...prev, [idx]: true }));
                  }}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
