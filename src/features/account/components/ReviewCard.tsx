'use client';

import type { Review } from '@/types/review';
import { CheckCircle2, Edit3, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ReviewCardProps {
  readonly review: Review;
  readonly onEdit: (review: Review) => void;
  readonly onDelete: (reviewId: string) => void;
}

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const formattedDate = new Date(review.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-foreground">{review.title}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
            <span>Posted on {formattedDate}</span>
            {review.verifiedPurchase && (
              <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Verified Purchase
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(review)}
            aria-label="Edit review"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>

          {!showConfirmDelete ? (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              aria-label="Delete review"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDelete(review.id)}
                className="rounded-lg bg-destructive px-2 py-1 text-[10px] font-semibold text-destructive-foreground"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="rounded-lg border border-border px-2 py-1 text-[10px] font-medium text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment Body */}
      <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
        {review.comment}
      </p>
    </div>
  );
}
