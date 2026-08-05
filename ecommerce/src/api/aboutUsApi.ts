import axiosInstance from './axios';

export interface AboutSection {
  id?: string | number;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  icon?: string;
  layoutType: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

const aboutUsApi = {
  getAboutSections: async (): Promise<AboutSection[]> => {
    const response = await axiosInstance.get<AboutSection[]>('/about-sections');
    return response.data;
  },

  createAboutSection: async (section: AboutSection): Promise<AboutSection> => {
    const response = await axiosInstance.post<AboutSection>('/about-sections', section);
    return response.data;
  },

  updateAboutSection: async (id: string | number, section: AboutSection): Promise<AboutSection> => {
    const response = await axiosInstance.put<AboutSection>(`/about-sections/${id}`, section);
    return response.data;
  },

  deleteAboutSection: async (id: string | number): Promise<{ deleted: boolean }> => {
    const response = await axiosInstance.delete<{ deleted: boolean }>(`/about-sections/${id}`);
    return response.data;
  },

  reorderAboutSections: async (sectionIds: (string | number)[]): Promise<{ reordered: boolean }> => {
    const response = await axiosInstance.put<{ reordered: boolean }>('/about-sections/reorder', sectionIds);
    return response.data;
  },

  uploadFile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');
    const response = await axiosInstance.post<{ url: string }>('/about-sections/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default aboutUsApi;
