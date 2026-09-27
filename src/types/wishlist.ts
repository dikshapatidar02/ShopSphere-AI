export interface WishlistItem {
  readonly id: string;
  readonly productId: string;
  readonly addedAt: string;
  readonly note?: string;
}

export interface Wishlist {
  readonly id: string;
  readonly userId: string;
  readonly items: readonly WishlistItem[];
  readonly updatedAt: string;
}
