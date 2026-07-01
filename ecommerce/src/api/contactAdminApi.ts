import axiosInstance from "./axios";

/* ================= TYPES ================= */

export interface ContactMessage {
  status: string;
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

/* ================= API ================= */
export type ContactStatus = "PENDING" | "READ" | "RESOLVED";
export const ContactAdminApi = {
  // ✅ Get all contact messages (ADMIN)
  getAllContacts: async (): Promise<ContactMessage[]> => {
    const response = await axiosInstance.get("/contact/admin/all");
    return response.data;
  },

  // ✅ Get single contact message by ID
  getContactById: async (id: number): Promise<ContactMessage> => {
    const response = await axiosInstance.get(`/contact/${id}`);
    return response.data;
  },

  // ✅ Delete contact message (optional)
  deleteContact: async (id: number) => {
    const response = await axiosInstance.delete(`/contact/${id}`);
    return response.data;
  },

    updateContactStatus: async (
    id: number,
    status: ContactStatus,
  ): Promise<ContactMessage> => {
    const response = await axiosInstance.patch(
      `/contact/admin/${id}/status`,
      null, // no body
      {
        params: { status }, // ?status=RESOLVED
      },
    );
    return response.data;
  },
};

export default ContactAdminApi;
