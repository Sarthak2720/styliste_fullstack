import axiosInstance from './axios';
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentStatistics,
  PaginatedResponse,
} from '../types';

export const appointmentApi = {
  // Create appointment
  createAppointment: async (appointmentData: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await axiosInstance.post<Appointment>('/appointments', appointmentData);
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (id: number): Promise<Appointment> => {
    const response = await axiosInstance.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  // Get user appointments with pagination
  getUserAppointments: async (userId: number, page = 0, pageSize = 10): Promise<PaginatedResponse<Appointment>> => {
    const response = await axiosInstance.get<PaginatedResponse<Appointment>>(`/appointments/user/${userId}`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  // Get all appointments (Admin only)
  getAllAppointments: async (page = 0, pageSize = 10): Promise<PaginatedResponse<Appointment>> => {
    const response = await axiosInstance.get<PaginatedResponse<Appointment>>('/appointments', {
      params: { page, pageSize },
    });
    return response.data;
  },
// ✅ Approve appointment (Admin)
approveAppointment: async (id: number): Promise<Appointment> => {
  const response = await axiosInstance.put<Appointment>(`/appointments/${id}/approve`);
  return response.data;
},

// ❌ Reject appointment (Admin)
rejectAppointment: async (id: number): Promise<Appointment> => {
  const response = await axiosInstance.put<Appointment>(`/appointments/${id}/reject`);
  return response.data;
},

  // Get appointments by date (Admin only)
  getAppointmentsByDate: async (date: string): Promise<Appointment[]> => {
    const response = await axiosInstance.get<Appointment[]>(`/appointments/date/${date}`);
    return response.data;
  },

  // Update appointment (Admin only)
  updateAppointment: async (id: number, updateData: UpdateAppointmentRequest): Promise<Appointment> => {
    const response = await axiosInstance.put<Appointment>(`/appointments/${id}`, updateData);
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/appointments/${id}`);
  },

  // Get appointment statistics (Admin only)
  getAppointmentStatistics: async (): Promise<AppointmentStatistics> => {
    const response = await axiosInstance.get<AppointmentStatistics>('/appointments/statistics');
    return response.data;
  },
  
};

export default appointmentApi;