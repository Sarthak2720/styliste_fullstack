// import axiosInstance from './axios';
// import type {
//   Product,
//   // CreateProductRequest,
//   // UpdateProductRequest,
//   ProductFilterRequest,
//   PaginatedResponse,
// } from '../types';

// export const productApi = {
//   // Get all products with pagination
//   getAllProducts: async (page = 0, pageSize = 12): Promise<PaginatedResponse<Product>> => {
//     const response = await axiosInstance.get<PaginatedResponse<Product>>('/products', {
//       params: { page, pageSize },
//     });
//     return response.data;
//   },

//   // Get product by ID
//   getProductById: async (id: number): Promise<Product> => {
//     const response = await axiosInstance.get<Product>(`/products/${id}`);
//     return response.data;
//   },

//   // Search products with filters
//   searchProducts: async (filters: ProductFilterRequest): Promise<PaginatedResponse<Product>> => {
//     const response = await axiosInstance.post<PaginatedResponse<Product>>('/products/search', filters);
//     return response.data;
//   },

//   // Get products by category
//   getProductsByCategory: async (category: string): Promise<Product[]> => {
//     const response = await axiosInstance.get<Product[]>(`/products/category/${category}`);
//     return response.data;
//   },

//   // Get products by subcategory
//   getProductsBySubcategory: async (subcategory: string): Promise<Product[]> => {
//     const response = await axiosInstance.get<Product[]>(`/products/subcategory/${subcategory}`);
//     return response.data;
//   },

//   // Create product (Admin only)
//   createProduct: async (formData: FormData): Promise<Product> => {
//     // Note: We don't manually set Content-Type here; Axios sets 'multipart/form-data' automatically when it sees FormData
//     const response = await axiosInstance.post<Product>('/products', formData);
//     return response.data;
//   },

//   // Update product (Admin only)
// updateProduct: async (id: number, data: FormData) => {
//   const response = await axiosInstance.put(`/products/${id}`, data, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   });
//   return response.data;
// },

//   // Delete product (Admin only)
//   deleteProduct: async (id: number): Promise<void> => {
//     await axiosInstance.delete(`/products/${id}`);
//   },

//   // Deactivate product (Admin only)
//   deactivateProduct: async (id: number): Promise<void> => {
//     await axiosInstance.patch(`/products/${id}/deactivate`);
//   },

//   // Add this new method
//   activateProduct: async (id: number): Promise<void> => {
//     await axiosInstance.patch(`/products/${id}/activate`);
//   },
// };

// export default productApi

import axiosInstance from './axios';
import type {
  Product,
  ProductFilterRequest,
  PaginatedResponse,
} from '../types';

/* =======================
   CATEGORY & SUBCATEGORY TYPES
======================= */

export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  description: string;
}

export interface CategoryRequest {
  name: string;
  description: string;
}

export interface SubCategoryRequest {
  name: string;
  description: string;
}


/* =======================
   PRODUCT + CATEGORY API
======================= */

export const productApi = {
  /* ---------- PRODUCTS ---------- */

  // Get all products with pagination
  getAllProducts: async (
    page = 0,
    pageSize = 12
  ): Promise<PaginatedResponse<Product>> => {
    const response = await axiosInstance.get('/products', {
      params: { page, pageSize },
    });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // Search products with filters
  searchProducts: async (
    filters: ProductFilterRequest
  ): Promise<PaginatedResponse<Product>> => {
    const response = await axiosInstance.post('/products/search', filters);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/category/${category}`);
    return response.data;
  },

  // Get products by subcategory
  getProductsBySubcategory: async (subcategory: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/subcategory/${subcategory}`);
    return response.data;
  },

  // Create product (Admin)
  createProduct: async (formData: FormData): Promise<Product> => {
    const response = await axiosInstance.post('/products', formData);
    return response.data;
  },

  // Update product (Admin)
  updateProduct: async (id: number, data: FormData): Promise<Product> => {
    const response = await axiosInstance.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete product (Admin)
  deleteProduct: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },

  // Deactivate product
  deactivateProduct: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/products/${id}/deactivate`);
  },

  // Activate product
  activateProduct: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/products/${id}/activate`);
  },

  /* ---------- CATEGORY MANAGEMENT ---------- */

  // Create Category (ADMIN)
  createCategory: async (data: CategoryRequest): Promise<Category> => {
    try {
      const response = await axiosInstance.post('/api/categories', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Update Category (ADMIN)
  updateCategory: async (
    id: number,
    data: CategoryRequest
  ): Promise<Category> => {
    try {
      const response = await axiosInstance.put(`/api/categories/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Delete Category (ADMIN)
  deleteCategory: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/categories/${id}`);
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  /* ---------- SUBCATEGORY MANAGEMENT ---------- */

  // Create SubCategory (ADMIN)
  createSubCategory: async (
    categoryId: number,
    data: SubCategoryRequest
  ): Promise<SubCategory> => {
    try {
      const response = await axiosInstance.post(
        `/api/categories/${categoryId}/subcategories`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Update SubCategory (ADMIN)
  updateSubCategory: async (
    subId: number,
    data: SubCategoryRequest
  ): Promise<SubCategory> => {
    try {
      const response = await axiosInstance.put(
        `/api/categories/subcategories/${subId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Delete SubCategory (ADMIN)
  deleteSubCategory: async (subId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/categories/subcategories/${subId}`);
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },




};



export default productApi;
