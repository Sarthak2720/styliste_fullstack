import axiosInstance from "./axios";
import type { Appointment, PaginatedResponse } from "../types";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  orderCount: number;
  appointmentCount: number;
};

export const userApi = {
  getCustomers: async (
    page = 0,
    pageSize = 10
  ): Promise<PaginatedResponse<User>> => {
    const response = await axiosInstance.get<PaginatedResponse<User>>(
      "/users",
      {
        params: {
          role: "CUSTOMER",   // required
          page,
          pageSize,
        },
      }
    );
    return response.data;
  },
  // ✅ ACTIVATE USER
  activateUser: async (id: number): Promise<User> => {
    const response = await axiosInstance.patch<User>(`/users/${id}/activate`);
    return response.data;
  },

  // ✅ DEACTIVATE USER
  deactivateUser: async (id: number): Promise<User> => {
    const response = await axiosInstance.patch<User>(`/users/${id}/deactivate`);
    return response.data;
  },

  // ✅ DELETE USER
  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },
  getAppointmentsByUserId: async (
    userId: number,
    page = 0,
    pageSize = 5
  ): Promise<PaginatedResponse<Appointment>> => {
    const response = await axiosInstance.get<
      PaginatedResponse<Appointment>
    >(`/appointments/user/${userId}`, {
      params: { page, pageSize },
    });
    return response.data;
  }
  
};

export default userApi;


