import axiosInstance from './axios';
import type { GoogleReview } from '../types';

export const reviewsApi = {
  /**
   * Fetch cached Google Maps reviews
   */
  getGoogleReviews: async (): Promise<GoogleReview[]> => {
    try {
      const response = await axiosInstance.get<GoogleReview[]>('/reviews');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch Google reviews:', error);
      return [];
    }
  },
};

export default reviewsApi;
