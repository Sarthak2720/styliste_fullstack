import axiosInstance from './axios'; // your existing axios instance

export interface ProductFiltersResponse {
  COLOR: string[];
  SIZE: string[];
}

const productFilterApi = {
  getFilters: () =>
    axiosInstance.get<ProductFiltersResponse>('/products/filters'),
};

export default productFilterApi;
