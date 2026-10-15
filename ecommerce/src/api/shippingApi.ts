import axiosInstance from './axios';
import type { Order } from '../types';

export interface ShippingLabelResponse {
  labelUrl: string;
}

export const shippingApi = {
  /**
   * Admin: Creates shipment on Shiprocket and auto-assigns AWB
   */
  createShipment: async (orderId: number): Promise<Order> => {
    const response = await axiosInstance.post<{ success: boolean; message: string; data: Order }>(
      `/shipping/admin/orders/${orderId}/create-shipment`
    );
    return response.data.data;
  },

  /**
   * Admin: Fetches shipping label PDF URL
   */
  getShippingLabel: async (orderId: number): Promise<string> => {
    const response = await axiosInstance.get<{ success: boolean; message: string; data: ShippingLabelResponse }>(
      `/shipping/admin/orders/${orderId}/label`
    );
    return response.data.data.labelUrl;
  },

  /**
   * Public: Fetches live tracking data using AWB tracking code
   */
  trackShipment: async (awbCode: string): Promise<any> => {
    const response = await axiosInstance.get<{ success: boolean; message: string; data: any }>(
      `/shipping/track/${awbCode}`
    );
    return response.data.data;
  },
};
