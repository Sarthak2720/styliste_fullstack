import axiosInstance from './axios';

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  orderCount: number;
  appointmentCount: number;
  createdAt: string;
};

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type UserAddress = {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  contactPhone: string;
  isDefault: boolean;
};

export type AddressPayload = {
  id?: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  contactPhone: string;
  isDefault?: boolean;
};

export type OrderItemPayload = {
  productId: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};

export type OrderAddressPayload = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  contactPhone: string;
};

export type CreateOrderPayload = {
  items: OrderItemPayload[];
  shippingAddress: OrderAddressPayload;
};

export type OrderDetailItem = {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedSize?: string;
  selectedColor?: string;
};

export type OrderDetail = {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAddress: string;
  items: OrderDetailItem[];
};

export const userProfileApi = {
  // 1A. Get User Profile
  getUserProfile: async (id: number): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>(`/users/${id}`);
    return response.data;
  },

  // 1B. Update Profile Details
  updateUserProfile: async (
    id: number,
    payload: UpdateProfilePayload
  ): Promise<UserProfile> => {
    const response = await axiosInstance.put<UserProfile>(`/users/${id}`, payload);
    return response.data;
  },

  // 1C. Update Password
  changePassword: async (
    id: number,
    payload: ChangePasswordPayload
  ): Promise<{ message?: string }> => {
    const response = await axiosInstance.post<{ message?: string }>(
      `/users/${id}/change-password`,
      payload
    );
    return response.data;
  },

  // 2A. Get Saved Addresses
  getAddresses: async (id: number): Promise<UserAddress[]> => {
    const response = await axiosInstance.get<UserAddress[]>(`/users/${id}/addresses`);
    return response.data;
  },

  // 2B. Add Address
  addAddress: async (id: number, payload: AddressPayload): Promise<UserAddress> => {
    const response = await axiosInstance.post<UserAddress>(`/users/${id}/addresses`, payload);
    return response.data;
  },

  // 2B. Update Address
  updateAddress: async (
    id: number,
    addressId: number,
    payload: AddressPayload
  ): Promise<UserAddress> => {
    const response = await axiosInstance.put<UserAddress>(
      `/users/${id}/addresses/${addressId}`,
      payload
    );
    return response.data;
  },

  // 2D. Delete Address
  deleteAddress: async (id: number, addressId: number): Promise<{ message?: string }> => {
    const response = await axiosInstance.delete<{ message?: string }>(
      `/users/${id}/addresses/${addressId}`
    );
    return response.data;
  },

  // 2C. Set Default Address
  setDefaultAddress: async (
    id: number,
    addressId: number
  ): Promise<{ message?: string }> => {
    const response = await axiosInstance.patch<{ message?: string }>(
      `/users/${id}/addresses/${addressId}/default`
    );
    return response.data;
  },

  // 3A. Create Order (Snapshot Address)
  createOrder: async (payload: CreateOrderPayload): Promise<OrderDetail> => {
    const response = await axiosInstance.post<OrderDetail>('/orders', payload);
    return response.data;
  },

  // 3B. Get Single Order Detail
  getOrderDetail: async (orderId: number): Promise<OrderDetail> => {
    const response = await axiosInstance.get<OrderDetail>(`/orders/${orderId}`);
    return response.data;
  },
};

export default userProfileApi;
