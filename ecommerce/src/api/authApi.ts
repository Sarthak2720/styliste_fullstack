// import axiosInstance from './axios';
// import type { AuthResponse, LoginRequest, SignUpRequest } from '../types';

// export const authApi = {
//   // Login
//   login: async (credentials: LoginRequest): Promise<AuthResponse> => {
//     const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
//     return response.data;
//   },

//   // Sign Up
//   signup: async (userData: SignUpRequest): Promise<AuthResponse> => {
//     const response = await axiosInstance.post<AuthResponse>('/auth/signup', userData);
//     return response.data;
//   },

//   // Logout
//   logout: async (): Promise<void> => {
//     await axiosInstance.post('/auth/logout');
//   },

//   // Verify token (optional - for checking if token is still valid)
//   verifyToken: async (): Promise<boolean> => {
//     try {
//       await axiosInstance.get('/auth/verify');
//       return true;
//     } catch (error) {
//       return false;
//     }
//   },
// };

// export default authApi;


import axiosInstance from './axios';
import type { AuthResponse, LoginRequest, SignUpRequest } from '../types';

export const authApi = {

  // =============================
  // Login
  // =============================
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  // =============================
  // Sign Up
  // =============================
  signup: async (userData: SignUpRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/signup',
      userData
    );
    return response.data;
  },

  // =============================
  // Logout
  // =============================
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  // =============================
  // Verify Token
  // =============================
  verifyToken: async (): Promise<boolean> => {
    try {
      await axiosInstance.get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  },

  // =====================================================
  // ⭐ Forgot Password Flow
  // =====================================================

  // Stage 1 → Request OTP
  forgotPassword: async (email: string): Promise<string> => {
    const response = await axiosInstance.post<string>(
      '/auth/forgot-password',
      { email }
    );
    return response.data;
  },

  // Stage 2 → Verify OTP
  verifyOtp: async (email: string, otp: string): Promise<string> => {
    const response = await axiosInstance.post<string>(
      '/auth/verify-otp',
      { email, otp }
    );
    return response.data;
  },

  // Stage 3 → Reset Password
  resetPassword: async (
    email: string,
    newPassword: string
  ): Promise<string> => {
    const response = await axiosInstance.post<string>(
      '/auth/reset-password',
      { email, newPassword }
    );
    return response.data;
  },
};

export default authApi;
