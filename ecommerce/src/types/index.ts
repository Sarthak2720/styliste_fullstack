import type { Key, ReactNode } from "react";

// ==================== USER & AUTH ====================
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'CUSTOMER';
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  name: string;
  role: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// ==================== PRODUCT ====================
export interface ProductAttribute {
  id: Key | null | undefined;
  key: string;
  type: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: string;
  subcategory: string;
  images: string[];
  videos?: string[];
  attributes: ProductAttribute[];
  isActive: boolean;
  isWishlisted?: boolean;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: string;
  subcategory: string;
  images: string[];
  videos?: string[];
  attributes?: ProductAttribute[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isActive?: boolean;
}

export interface ProductFilterRequest {
  category?: string;
  subcategory?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  first?: boolean;
  last?: boolean;
  total?: number;
  data?: T[];
  orders?: T[];
}

// ==================== CART ====================
export interface CartItem {
  itemId: number; 
  productId: number;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image: string;
  stock: number;
}

// ==================== ORDER ====================
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedSize?: string;
  selectedColor?: string;
  reviewId?: number;
  itemStatus?: 'ACTIVE' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED';
  returnedQuantity?: number;
  returnStatus?: ReturnStatus;
  returnWindowEndsAt?: string;
  returnEligibleUntil?: string;
}

export type ReturnStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'PICKED_UP'
  | 'REFUND_INITIATED'
  | 'REFUNDED'
  | 'REJECTED';

export interface ReturnTimelineEvent {
  status: string;
  message: string;
  timestamp: string;
}

export interface ReturnRequest {
  id: number;
  orderId?: number;
  orderItemId: number;
  productId?: number;
  quantity?: number;
  requestedQuantity?: number;
  remainingQuantity?: number;
  returnableQuantity?: number;
  returnedQuantity?: number;
  productName?: string;
  productImage?: string;
  reason: string;
  status: ReturnStatus;
  refundAmount?: number;
  proofImageUrls?: string[];
  adminComment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Order {
  userName: string;
  userPhone: string;
  userEmail: string;
  orderNumber: number;
  id: number;
  userId: number;
  status:
    | 'PENDING'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURNED';
  paymentMethod?: 'RAZORPAY' | 'COD';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  itemsSubtotal?: number;
  shippingCharges?: number;
  totalAmount: number;
  transactionId?: string;
  discount?: number;
  tax?: number;
  trackingNumber?: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  timeline?: {
    status: string;
    message: string;
    timestamp: string;
  }[];
  items: OrderItem[];
}

export interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  contactPhone: string;
}

export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'RAZORPAY' | 'COD';
}

export interface UpdateOrderStatusRequest {
  status: string;
  trackingNumber?: string;
}

export interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  outForDeliveryOrders?: number;
  deliveredOrders: number;
  cancelledOrders: number;
  processingOrders: number;
  returnedOrders?: number;
}

// ==================== APPOINTMENT ====================
export interface Appointment {
  name: ReactNode;
  id: number;
  userId: number;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: 'STYLING_CONSULTATION' | 'PERSONAL_SHOPPING' | 'ALTERATIONS' | 'VIRTUAL_CONSULTATION' | 'IN_STORE_VISIT';
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  createdAt: string;
}

export interface CreateAppointmentRequest {
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  status?: string;
  notes?: string;
}

export interface AppointmentStatistics {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
}

// ==================== ADDRESS ====================
export interface Address {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  contactPhone?: string;
  isDefault: boolean;
}

// ==================== API ERROR ====================
export interface ApiError {
  timestamp: string;
  status: number;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}
