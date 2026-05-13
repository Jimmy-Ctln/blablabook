import api from "./axios";
import type { Review, CreateReviewPayload } from "../@types/reviews";

export const getReviewsByIsbn = async (isbn: string): Promise<Review[]> => {
  const response = await api.get<Review[]>(`/reviews/book/${isbn}`);
  return response.data;
};

export const createReview = async (payload: CreateReviewPayload): Promise<Review> => {
  const response = await api.post<Review>("/reviews", payload);
  return response.data;
};

export const deleteReview = async (reviewId: number): Promise<{ id: number }> => {
  const response = await api.delete<{ id: number }>(`/reviews/${reviewId}`);
  return response.data;
};
