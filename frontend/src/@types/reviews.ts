export type Review = {
  id: number;
  review_text: string | null;
  rating: number;
  createdAt: string;
  userId: number | null;
  username: string | null;
  avatar_url: string | null;
};

export type CreateReviewPayload = {
  bookId: number;
  rating: number;
  review_text: string;
};
