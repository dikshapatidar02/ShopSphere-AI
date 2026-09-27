export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  readonly id: string;
  readonly productId: string;
  readonly userId: string;
  readonly userName: string;
  readonly userAvatar?: string;
  readonly rating: ReviewRating;
  readonly title: string;
  readonly comment: string;
  readonly verifiedPurchase: boolean;
  readonly createdAt: string;
  readonly updatedAt?: string;
}
