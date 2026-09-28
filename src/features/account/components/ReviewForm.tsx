'use client';

import type { Review, ReviewRating } from '@/types/review';
import { Star, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface ReviewFormProps {
  readonly initialReview?: Review | null;
  readonly eligibleProductIds?: readonly string[];
  readonly onSubmit: (data: {
    productId: string;
    rating: ReviewRating;
    title: string;
    comment: string;
  }) => void;
  readonly onCancel: () => void;
}

export function ReviewForm({
  initialReview,
  eligibleProductIds = ['1', '2', '3'],
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [productId, setProductId] = useState(
    initialReview?.productId || eligibleProductIds[0] || '1'
  );
  const [rating, setRating] = useState<ReviewRating>(initialReview?.rating || 5);
  const [title, setTitle] = useState(initialReview?.title || '');
  const [comment, setComment] = useState(initialReview?.comment || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Review title is required.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setError('Please enter a review comment (minimum 5 characters).');
      return;
    }

    onSubmit({
      productId,
      rating,
      title: title.trim(),
      comment: comment.trim(),
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-bold text-foreground">
          {initialReview ? 'Edit Review' : 'Write a Product Review'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {!initialReview && (
          <div className="space-y-1">
            <label htmlFor="review-product" className="font-semibold text-foreground">
              Target Product
            </label>
            <select
              id="review-product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="1">Flagship Smartphone X (Product #1)</option>
              <option value="2">Mid-range Smartphone Y (Product #2)</option>
              <option value="3">Wireless Headphones Pro (Product #3)</option>
            </select>
          </div>
        )}

        <div className="space-y-1">
          <label className="font-semibold text-foreground">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star as ReviewRating)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/30 hover:text-amber-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="review-title" className="font-semibold text-foreground">
            Review Title *
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Sum up your review in a few words"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="review-comment" className="font-semibold text-foreground">
            Review Description *
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            placeholder="What did you like or dislike about this product?"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-input bg-background px-4 py-2 font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2 font-semibold text-primary-foreground hover:bg-primary/90 shadow-xs"
          >
            {initialReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
