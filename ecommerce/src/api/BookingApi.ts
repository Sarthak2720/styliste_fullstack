// import axiosInstance from "./axios";

// export interface CreateAppointmentRequest {
//   appointmentDate: string;
//   appointmentTime: string;
//   serviceType: string;
//   notes?: string;
// }

// export interface AppointmentResponse {
//   id: number | null;
//   userId: number;
//   appointmentDate: string;
//   appointmentTime: string;
//   serviceType: string;
//   notes: string;
//   status: string;
//   createdAt: string;
// }

// export const BookingApi = {
//   // CUSTOMER - Create Appointment
//   createAppointment: async (
//     payload: CreateAppointmentRequest
//   ): Promise<AppointmentResponse> => {
//     const response = await axiosInstance.post("/appointments", payload);
//     return response.data;
//   },

//   // ADMIN - Get Appointments By Date
//   getAppointmentsByDate: async (
//     date: string
//   ): Promise<AppointmentResponse[]> => {
//     const response = await axiosInstance.get(`/appointments/date/${date}`);
//     return response.data;
//   },
//   getAppointmentTypes: async (): Promise<string[]> => {
//     const response = await axiosInstance.get("/appointments/types");
//     return response.data;
//   },
// };

// export default BookingApi;


// api/BookingApi.ts
import axiosInstance from "./axios";

export interface CreateAppointmentRequest {
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  notes?: string;
}

// 👇 GUEST payload
export interface GuestAppointmentRequest {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  notes?: string;
}

export const BookingApi = {
  // ✅ LOGGED-IN USER
  createAppointment: async (
    payload: CreateAppointmentRequest
  ) => {
    const response = await axiosInstance.post("/appointments", payload);
    return response.data;
  },

  // ✅ GUEST USER
  createGuestAppointment: async (
    payload: GuestAppointmentRequest
  ) => {
    const response = await axiosInstance.post(
      "/appointments/guest",
      payload
    );
    return response.data;
  },

  // ADMIN / COMMON
  getAppointmentsByDate: async (date: string) => {
    const response = await axiosInstance.get(`/appointments/date/${date}`);
    return response.data;
  },
getAvailableSlots: async (date: string): Promise<string[]> => {
  const response = await axiosInstance.get(
    `/appointments/available-slots`,
    { params: { date } }
  );
  return response.data; // ["10:00","12:00","15:00"]
},

  getAppointmentTypes: async (): Promise<string[]> => {
    const response = await axiosInstance.get("/appointments/types");
    return response.data;
  },
};

export default BookingApi;






