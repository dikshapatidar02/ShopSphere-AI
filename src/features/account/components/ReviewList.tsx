'use client';

import { Plus, Star } from 'lucide-react';
import { useAccountReviews } from '../hooks/use-account-reviews';
import { AccountEmptyState } from './AccountEmptyState';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';

export function ReviewList() {
  const {
    reviews,
    eligibleProducts,
    isFormOpen,
    setIsFormOpen,
    editingReview,
    setEditingReview,
    createReview,
    updateReview,
    deleteReview,
  } = useAccountReviews();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">My Product Reviews</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage reviews and ratings submitted for your purchased products.
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={() => {
              setEditingReview(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-center"
          >
            <Plus className="h-4 w-4" />
            <span>Write a Review</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <ReviewForm
          initialReview={editingReview}
          eligibleProductIds={eligibleProducts}
          onSubmit={(data) => {
            if (editingReview) {
              updateReview(editingReview.id, data);
            } else {
              createReview(data);
            }
          }}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingReview(null);
          }}
        />
      )}

      {reviews.length === 0 && !isFormOpen ? (
        <AccountEmptyState
          title="No product reviews submitted"
          description="Share your feedback on products you've purchased to help other shoppers."
          actionLabel="Write a Review"
          actionHref=""
          icon={<Star className="h-6 w-6 text-amber-500" />}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={(rev) => {
                setEditingReview(rev);
                setIsFormOpen(true);
              }}
              onDelete={deleteReview}
            />
          ))}
        </div>
      )}
    </div>
  );
}
