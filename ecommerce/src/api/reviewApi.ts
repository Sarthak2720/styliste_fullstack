import axiosInstance from './axios';

export interface Review {
  id: number;
  productId?: number;
  userId?: number;
  orderId?: number;
  media?: ReviewMedia[];
  title: string;
  body: string;
  rating: number;
  username?: string | null;
  createdAt: string;
  updatedAt?: string;
  imageUrls: string[];
  videoUrls: string[];
}

export interface ReviewCreatePayload {
  productId: number;
  orderId: number;
  rating: number;
  title: string;
  body: string;
}

export interface ReviewUpdatePayload {
  videosToDelete: string[];
  imagesToDelete: string[];
  rating: number;
  title: string;
  body: string;
  mediaIdsToDelete?: number[];
}

export interface ReviewMedia {
  id: number;
  url: string;
  mediaType: 'IMAGE' | 'VIDEO';
}

export interface ReviewUpdateResponse {
  id: number;
  productId: number;
  userId: number;
  orderId: number;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  media: ReviewMedia[];
}

export interface ReviewPageResponse {
  content: Review[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

const appendFiles = (formData: FormData, key: string, files?: File[] | FileList) => {
  if (!files) return;
  const list = Array.isArray(files) ? files : Array.from(files);
  list.forEach((file) => {
    formData.append(key, file);
  });
};

const reviewApi = {
  getProductReviews: async (
    productId: number,
    page = 0,
    size = 5
  ): Promise<ReviewPageResponse> => {
    const response = await axiosInstance.get<ReviewPageResponse>(
      `/reviews/product/${productId}`,
      { params: { page, size } }
    );
    return response.data;
  },
  createReview: async (
    review: ReviewCreatePayload,
    images?: File[] | FileList,
    videos?: File[] | FileList
  ): Promise<Review> => {
    const formData = new FormData();
    formData.append(
      'review',
      new Blob([JSON.stringify(review)], { type: 'application/json' })
    );
    appendFiles(formData, 'images', images);
    appendFiles(formData, 'videos', videos);

    const response = await axiosInstance.post<Review>('/reviews', formData);
    return response.data;
  },
  updateReview: async (
    reviewId: number,
    review: ReviewUpdatePayload,
    images?: File[] | FileList,
    videos?: File[] | FileList
  ): Promise<ReviewUpdateResponse> => {
    const formData = new FormData();
    formData.append(
      'review',
      new Blob([JSON.stringify(review)], { type: 'application/json' })
    );
    appendFiles(formData, 'images', images);
    appendFiles(formData, 'videos', videos);

    const response = await axiosInstance.put<ReviewUpdateResponse>(
      `/reviews/${reviewId}`,
      formData
    );
    return response.data;
  },
  deleteReview: async (reviewId: number): Promise<void> => {
    const response = await axiosInstance.delete<void>(`/reviews/${reviewId}`);
    return response.data;
  },
};

export default reviewApi;
