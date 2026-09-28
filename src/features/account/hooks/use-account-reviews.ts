'use client';

import { useAuth } from '@/hooks/use-auth';
import { reviewService } from '@/services/reviews/review.service';
import type { Review, ReviewRating } from '@/types/review';
import { useCallback, useEffect, useState } from 'react';

export function useAccountReviews() {
  const { user } = useAuth();
  const userId = user?.id || '';
  const userName = user?.name || 'Customer';

  const [reviews, setReviews] = useState<readonly Review[]>([]);
  const [eligibleProducts, setEligibleProducts] = useState<readonly string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const userReviews = reviewService.getReviewsByUserId(userId);
    setReviews(userReviews);
    const eligible = await reviewService.getEligibleProductsForReview(userId);
    setEligibleProducts(eligible);
  }, [userId]);

  useEffect(() => {
    let isMounted = true;
    if (!userId) return;

    async function loadData() {
      const userReviews = reviewService.getReviewsByUserId(userId);
      const eligible = await reviewService.getEligibleProductsForReview(userId);
      if (isMounted) {
        setReviews(userReviews);
        setEligibleProducts(eligible);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const createReview = useCallback(
    (params: {
      productId: string;
      rating: ReviewRating;
      title: string;
      comment: string;
    }) => {
      if (!userId) return;
      reviewService.createReview(userId, userName, params);
      refresh();
      setIsFormOpen(false);
    },
    [userId, userName, refresh]
  );

  const updateReview = useCallback(
    (
      reviewId: string,
      params: {
        rating?: ReviewRating;
        title?: string;
        comment?: string;
      }
    ) => {
      if (!userId) return;
      reviewService.updateReview(userId, reviewId, params);
      refresh();
      setIsFormOpen(false);
      setEditingReview(null);
    },
    [userId, refresh]
  );

  const deleteReview = useCallback(
    (reviewId: string) => {
      if (!userId) return;
      reviewService.deleteReview(userId, reviewId);
      refresh();
    },
    [userId, refresh]
  );

  return {
    reviews,
    eligibleProducts,
    isFormOpen,
    setIsFormOpen,
    editingReview,
    setEditingReview,
    createReview,
    updateReview,
    deleteReview,
  };
}
