import axiosInstance from './axios';

export interface Testimonial {
  id?: string | number;
  name: string;
  location: string;
  rating: number;
  tag: string;
  message: string;
  photo: string;
}

export interface VideoTestimonial {
  id?: string | number;
  videoUrl: string;
  caption: string;
}

const testimonialApi = {
  getTestimonials: async (): Promise<Testimonial[]> => {
    const response = await axiosInstance.get<Testimonial[]>('/testimonials');
    return response.data;
  },

  createTestimonial: async (testimonial: Testimonial): Promise<Testimonial> => {
    const response = await axiosInstance.post<Testimonial>('/testimonials', testimonial);
    return response.data;
  },

  updateTestimonial: async (id: string | number, testimonial: Testimonial): Promise<Testimonial> => {
    const response = await axiosInstance.put<Testimonial>(`/testimonials/${id}`, testimonial);
    return response.data;
  },

  deleteTestimonial: async (id: string | number): Promise<{ deleted: boolean }> => {
    const response = await axiosInstance.delete<{ deleted: boolean }>(`/testimonials/${id}`);
    return response.data;
  },

  getVideoTestimonials: async (): Promise<VideoTestimonial[]> => {
    const response = await axiosInstance.get<VideoTestimonial[]>('/testimonials/videos');
    return response.data;
  },

  createVideoTestimonial: async (video: VideoTestimonial): Promise<VideoTestimonial> => {
    const response = await axiosInstance.post<VideoTestimonial>('/testimonials/videos', video);
    return response.data;
  },

  updateVideoTestimonial: async (id: string | number, video: VideoTestimonial): Promise<VideoTestimonial> => {
    const response = await axiosInstance.put<VideoTestimonial>(`/testimonials/videos/${id}`, video);
    return response.data;
  },

  deleteVideoTestimonial: async (id: string | number): Promise<{ deleted: boolean }> => {
    const response = await axiosInstance.delete<{ deleted: boolean }>(`/testimonials/videos/${id}`);
    return response.data;
  },

  getFeaturedQuote: async (): Promise<string> => {
    const response = await axiosInstance.get<{ quote: string }>('/testimonials/quote');
    return response.data.quote;
  },

  updateFeaturedQuote: async (quote: string): Promise<string> => {
    const response = await axiosInstance.post<{ quote: string }>('/testimonials/quote', { quote });
    return response.data.quote;
  },

  uploadFile: async (file: File, type: 'image' | 'video'): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await axiosInstance.post<{ url: string }>('/testimonials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 0, // Disable Axios timeout for large files like videos
    });
    return response.data;
  },
};

export default testimonialApi;
