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
  isbn: string;
  rating: number;
  review_text: string;
  bookName: string;
  bookCoverUrl: string;
  bookAuthor: string;
  bookDescription: string;
  bookPublishingHouse: string;
  bookPublishedAt: string;
  bookCategories?: string[];
};
