import axiosInstance from './axios';
import type { AnnouncementPopup } from '../types';

export const announcementApi = {
  /**
   * Public: Get currently active scheduled announcement popup
   */
  getActiveAnnouncement: async (): Promise<AnnouncementPopup | null> => {
    try {
      const response = await axiosInstance.get<AnnouncementPopup>('/announcements/active');
      return response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Admin: List all announcements
   */
  getAllAnnouncements: async (): Promise<AnnouncementPopup[]> => {
    const response = await axiosInstance.get<AnnouncementPopup[]>('/admin/announcements');
    return response.data || [];
  },

  /**
   * Admin: Get announcement by id
   */
  getAnnouncementById: async (id: number): Promise<AnnouncementPopup> => {
    const response = await axiosInstance.get<AnnouncementPopup>(`/admin/announcements/${id}`);
    return response.data;
  },

  /**
   * Admin: Create new announcement
   */
  createAnnouncement: async (data: Partial<AnnouncementPopup>): Promise<AnnouncementPopup> => {
    const response = await axiosInstance.post<AnnouncementPopup>('/admin/announcements', data);
    return response.data;
  },

  /**
   * Admin: Update announcement
   */
  updateAnnouncement: async (id: number, data: Partial<AnnouncementPopup>): Promise<AnnouncementPopup> => {
    const response = await axiosInstance.put<AnnouncementPopup>(`/admin/announcements/${id}`, data);
    return response.data;
  },

  /**
   * Admin: Quick Toggle Enable/Disable
   */
  toggleEnabled: async (id: number): Promise<AnnouncementPopup> => {
    const response = await axiosInstance.patch<AnnouncementPopup>(`/admin/announcements/${id}/toggle`);
    return response.data;
  },

  /**
   * Admin: Delete announcement
   */
  deleteAnnouncement: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/announcements/${id}`);
  },

  /**
   * Admin: Upload popup image
   */
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post<{ url: string }>('/admin/announcements/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default announcementApi;
