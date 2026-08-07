import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://192.168.1.115:8080/api';

// Queue to handle multiple concurrent requests when token is refreshing
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // Send secure cookies automatically
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[Interceptor] Preparing ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally & automatically refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const { status, data, config } = error.response;
      
      console.error(`[API Error] ${status}`, data);
      
      // 1. If refresh call itself fails with 401, force logout immediately to prevent loop
      if (status === 401 && config.url?.includes('/auth/refresh')) {
        console.warn("[API] 401 Unauthorized during refresh - logging out user");
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        localStorage.removeItem('styliste_cart');
        const path = window.location.pathname || '';
        const isAuthPage = path === '/login' || path === '/signup' || path === '/forgot-password';
        if (!isAuthPage) {
          window.location.replace('/login?expired=1');
        }
        return Promise.reject(data);
      }

      // 2. Handle 401 Unauthorized - Attempt access token refresh
      if (status === 401) {
        const originalRequest = config as any;
        
        // Prevent infinite loops if retry flag is already set
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return axiosInstance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }
          
          isRefreshing = true;
          console.log("[API] Access token expired. Initiating background refresh...");
          
          return new Promise((resolve, reject) => {
            axiosInstance.post('/auth/refresh')
              .then(() => {
                console.log("[API] Token refreshed successfully. Retrying original request.");
                processQueue(null);
                resolve(axiosInstance(originalRequest));
              })
              .catch((err) => {
                console.error("[API] Token refresh failed:", err);
                processQueue(err);
                
                // Clear state on failure and redirect
                localStorage.removeItem('user');
                localStorage.removeItem('cart');
                localStorage.removeItem('styliste_cart');
                
                const path = window.location.pathname || '';
                const isAuthPage = path === '/login' || path === '/signup' || path === '/forgot-password';
                if (!isAuthPage) {
                  window.location.replace('/login?expired=1');
                }
                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        }
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.warn('Forbidden - Insufficient permissions');
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        console.warn('Resource not found');
      }
      
      // Handle 500 Internal Server Error
      if (status === 500) {
        console.error('Server error - Please try again later');
      }
      
      return Promise.reject(data);
    } else if (error.request) {
      // No response (timeout, network error, or cancelled)
      const isTimeout = error.code === 'ECONNABORTED' || (typeof error.message === 'string' && error.message.toLowerCase().includes('timeout'));
      console.error('[API Error] No response received', isTimeout ? '(timeout)' : '', error.request);
      return Promise.reject({
        message: isTimeout
          ? 'Request took too long. The server may still be processing your measurement—please check the measurement page or try again in a few minutes.'
          : 'Network error - Please check your connection',
        status: 0,
      });
    } else {
      // Something happened in setting up the request
      console.error('[API Error] Request setup error', error.message);
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
      });
    }
  }
);

export default axiosInstance;