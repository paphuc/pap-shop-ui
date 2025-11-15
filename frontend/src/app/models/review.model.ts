export interface Review {
  id: number;
  rating: number;
  comment: string;
  productId: number;
  username: string;
  userFullName: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}