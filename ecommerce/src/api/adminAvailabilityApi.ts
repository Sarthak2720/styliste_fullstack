// src/api/adminAvailabilityApi.ts
import axiosInstance from './axios';

export interface AdminAvailability {
  id: number;
  blockedDate: string; // yyyy-MM-dd
  blockedTimeStart: string | null; // HH:mm
  blockedTimeEnd: string | null;
  isFullDayBlocked: boolean;
  reason: string | null;
}

export interface CreateAdminAvailabilityRequest {
  blockedDate: string;
  blockedTimeStart?: string | null;
  blockedTimeEnd?: string | null;
  isFullDayBlocked: boolean;
  reason?: string | null;
}

export const adminAvailabilityApi = {
  // ➕ Create unavailability
  createUnavailability: async (
    data: CreateAdminAvailabilityRequest
  ): Promise<AdminAvailability> => {
    const response = await axiosInstance.post<{ data: AdminAvailability }>(
      '/admin/availability',
      data
    );
    return response.data.data;
  },

  // 📅 Get upcoming blocks (next 7 days)
  getUpcomingUnavailability: async (): Promise<AdminAvailability[]> => {
    const response = await axiosInstance.get<AdminAvailability[]>(
      '/admin/availability/upcoming'
    );
    return response.data;
  },

  // 📆 Get blocks for a date
  getUnavailabilityForDate: async (
    date: string
  ): Promise<AdminAvailability[]> => {
    const response = await axiosInstance.get<AdminAvailability[]>(
      `/admin/availability/date/${date}`
    );
    return response.data;
  },

  // ❌ Delete block
  deleteUnavailability: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/availability/${id}`);
  },
};

export default adminAvailabilityApi;
