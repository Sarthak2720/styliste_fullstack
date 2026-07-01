import axiosInstance from "./axios";

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactApi = {
  sendMessage: async (payload: ContactRequest) => {
    const response = await axiosInstance.post("/contact", payload);
    return response.data; // plaintext success response
  },
};

export default ContactApi;
