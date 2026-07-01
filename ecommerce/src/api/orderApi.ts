import axiosInstance from './axios';
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  OrderStatistics,
  PaginatedResponse,
  ReturnRequest,
  ReturnTimelineEvent,
  ReturnStatus,
} from '../types';

type PaginatedOrderPayload =
  | PaginatedResponse<Order>
  | {
      content?: Order[];
      data?: Order[];
      orders?: Order[];
      totalElements?: number;
      totalPages?: number;
      size?: number;
      number?: number;
      first?: boolean;
      last?: boolean;
      total?: number;
    }
  | Order[];

export interface InitiatePaymentResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface CalculateShippingRequest {
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    contactPhone: string;
  };
  subtotal: number;
}

export interface CalculateShippingResponse {
  shippingCharges: number;
}

export interface CancelOrderRequest {
  reason: string;
  orderItemIds?: number[];
}

export interface CancelOrderResponse {
  message: string;
}

export interface CreateReturnRequestPayload {
  orderItemId: number;
  quantity: number;
  reason: string;
  proofImages?: File[] | FileList;
  proofImageUrls?: string[];
}

export interface ReturnActionResponse {
  message: string;
}

const toPaginatedResponse = <T>(
  payload: PaginatedResponse<T> | { content?: T[]; data?: T[]; orders?: T[]; totalElements?: number; totalPages?: number; size?: number; number?: number; first?: boolean; last?: boolean; total?: number } | T[],
  fallbackPage = 0,
  fallbackSize = 10
): PaginatedResponse<T> => {
  if (Array.isArray(payload)) {
    return {
      content: payload,
      totalElements: payload.length,
      totalPages: 1,
      size: payload.length || fallbackSize,
      number: fallbackPage,
      first: fallbackPage === 0,
      last: true,
      total: payload.length,
      data: payload,
      orders: payload,
    };
  }

  const content = payload.content || payload.data || payload.orders || [];
  const totalElements = payload.totalElements ?? payload.total ?? content.length;
  const size = payload.size ?? fallbackSize;
  const totalPages =
    payload.totalPages ?? (size > 0 ? Math.max(1, Math.ceil(totalElements / size)) : 1);
  const number = payload.number ?? fallbackPage;

  return {
    content,
    totalElements,
    totalPages,
    size,
    number,
    first: payload.first ?? number <= 0,
    last: payload.last ?? number >= totalPages - 1,
    total: payload.total ?? totalElements,
    data: payload.data,
    orders: payload.orders,
  };
};

const toReturnRequestList = (
  payload: ReturnRequest[] | { content?: ReturnRequest[]; data?: ReturnRequest[] }
): ReturnRequest[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const appendFiles = (formData: FormData, key: string, files?: File[] | FileList) => {
  if (!files) return;
  const list = Array.isArray(files) ? files : Array.from(files);
  list.forEach((file) => {
    formData.append(key, file);
  });
};

export const orderApi = {
  // Create order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await axiosInstance.post<Order>('/orders', orderData);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Get user orders with pagination
  getUserOrders: async (userId: number, page = 0, pageSize = 10): Promise<PaginatedResponse<Order>> => {
    const response = await axiosInstance.get<PaginatedOrderPayload>(`/orders/user/${userId}`, {
      params: { page, pageSize },
    });
    return toPaginatedResponse(response.data as PaginatedOrderPayload, page, pageSize);
  },

  // Get current user orders (Customer)
  getMyOrders: async (page = 0, pageSize = 10): Promise<PaginatedResponse<Order>> => {
    const response = await axiosInstance.get<PaginatedOrderPayload>('/orders/my-orders', {
      params: { page, pageSize },
    });
    return toPaginatedResponse(response.data as PaginatedOrderPayload, page, pageSize);
  },

  // Get all orders (Admin only)
  getAllOrders: async (page = 0, pageSize = 10): Promise<PaginatedResponse<Order>> => {
    const response = await axiosInstance.get<PaginatedOrderPayload>('/orders', {
      params: { page, pageSize },
    });
    return toPaginatedResponse(response.data as PaginatedOrderPayload, page, pageSize);
  },

  // Get orders by status (Admin only)
  getOrdersByStatus: async (status: string): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>(`/orders/status/${status}`);
    return response.data;
  },

  // Track order by tracking number
  trackOrder: async (trackingNumber: string): Promise<Order> => {
    const response = await axiosInstance.get<Order>(`/orders/track/${trackingNumber}`);
    return response.data;
  },

// Update order status (Admin only)
updateOrderStatus: async (
  id: number,
  statusData: UpdateOrderStatusRequest
): Promise<Order> => {
  const response = await axiosInstance.patch<Order>(
    `/orders/${id}/status`,
    statusData
  );
  return response.data;
},
  // Fetch order timeline (User / Admin)
getOrderTimeline: async (id: number): Promise<
  {
    status: string;
    message: string;
    timestamp: string;
  }[]
> => {
  const response = await axiosInstance.get<
    {
      status: string;
      message: string;
      timestamp: string;
    }[]
  >(`/orders/${id}/timeline`);
  return response.data;
},

  cancelOrder: async (
    orderId: number,
    payload: CancelOrderRequest
  ): Promise<CancelOrderResponse> => {
    const response = await axiosInstance.post<CancelOrderResponse>(
      `/orders/${orderId}/cancel`,
      payload
    );
    return response.data;
  },

  adminCancelOrder: async (
    orderId: number,
    payload: CancelOrderRequest
  ): Promise<CancelOrderResponse> => {
    const response = await axiosInstance.post<CancelOrderResponse>(
      `/orders/${orderId}/admin-cancel`,
      payload
    );
    return response.data;
  },

  createReturnRequest: async (
    payload: CreateReturnRequestPayload
  ): Promise<ReturnRequest> => {
    const formData = new FormData();
    formData.append('orderItemId', String(payload.orderItemId));
    formData.append('quantity', String(payload.quantity));
    formData.append('reason', payload.reason);

    appendFiles(formData, 'proofImages', payload.proofImages);
    (payload.proofImageUrls || []).forEach((url) => {
      formData.append('proofImageUrls', url);
    });

    const response = await axiosInstance.post<ReturnRequest>('/orders/returns', formData);
    return response.data;
  },

  getReturnRequests: async (status?: ReturnStatus): Promise<ReturnRequest[]> => {
    const response = await axiosInstance.get<
      ReturnRequest[] | { content?: ReturnRequest[]; data?: ReturnRequest[] }
    >('/orders/returns', {
      params: status ? { status } : undefined,
    });
    return toReturnRequestList(response.data);
  },

  getMyReturnRequests: async (): Promise<ReturnRequest[]> => {
    const response = await axiosInstance.get<
      ReturnRequest[] | { content?: ReturnRequest[]; data?: ReturnRequest[] }
    >('/orders/my-returns');
    return toReturnRequestList(response.data);
  },

  approveReturnRequest: async (
    returnRequestId: number,
    adminComment: string
  ): Promise<ReturnActionResponse> => {
    const response = await axiosInstance.patch<ReturnActionResponse | ReturnRequest>(
      `/orders/returns/${returnRequestId}/approve`,
      { adminComment }
    );
    const data = response.data as unknown;
    if (
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof (data as { message?: unknown }).message === 'string'
    ) {
      return { message: (data as { message: string }).message };
    }
    return { message: 'Return approved' };
  },

  rejectReturnRequest: async (
    returnRequestId: number,
    adminComment: string
  ): Promise<ReturnActionResponse> => {
    const response = await axiosInstance.patch<ReturnActionResponse | ReturnRequest>(
      `/orders/returns/${returnRequestId}/reject`,
      { adminComment }
    );
    const data = response.data as unknown;
    if (
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof (data as { message?: unknown }).message === 'string'
    ) {
      return { message: (data as { message: string }).message };
    }
    return { message: 'Return rejected' };
  },

  markReturnPickedUp: async (
    returnRequestId: number
  ): Promise<ReturnActionResponse> => {
    const response = await axiosInstance.patch<ReturnActionResponse>(
      `/orders/returns/${returnRequestId}/picked-up`
    );
    return response.data;
  },

  getReturnTimeline: async (returnRequestId: number): Promise<ReturnTimelineEvent[]> => {
    const response = await axiosInstance.get<ReturnTimelineEvent[]>(
      `/orders/returns/${returnRequestId}/timeline`
    );
    return response.data;
  },

  // Initiate Razorpay payment for an order
  initiatePayment: async (orderId: number): Promise<InitiatePaymentResponse> => {
    const response = await axiosInstance.post<InitiatePaymentResponse>(
      `/orders/${orderId}/pay`
    );
    return response.data;
  },

  // Calculate shipping charges based on address and subtotal
  calculateShipping: async (payload: CalculateShippingRequest): Promise<CalculateShippingResponse> => {
    const response = await axiosInstance.post<CalculateShippingResponse>(
      '/orders/calculate-shipping',
      payload
    );
    return response.data;
  },

  verifyPayment: async (orderId: number, payload: VerifyPaymentRequest): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(
      `/orders/${orderId}/verify-payment`,
      payload
    );
    return response.data;
  },

  // Download invoice for an order
  downloadInvoice: async (orderId: number): Promise<Blob> => {
    const response = await axiosInstance.get<Blob>(`/invoices/order/${orderId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get order statistics (Admin only)
  getOrderStatistics: async (): Promise<OrderStatistics> => {
    const response = await axiosInstance.get<OrderStatistics>('/orders/statistics');
    return response.data;
  },
};

export default orderApi;
