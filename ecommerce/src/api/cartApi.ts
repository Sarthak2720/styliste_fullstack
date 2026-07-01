// import axiosInstance from "./axios";

// export const cartApi = {
//   addToCart: async (payload: {
//     productId: number;
//     quantity: number;
//     selectedSize?: string;
//     selectedColor?: string;
//   }) => {
//     const response = await axiosInstance.post("/cart/item", payload);
//     return response.data;
//   },
// };

// export default cartApi;


import axiosInstance from "./axios";

/* =========================
   Types (optional but recommended)
========================= */

export interface AddToCartPayload {
  productId: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface GuestItemDTO {
  productId: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

/* =========================
   Cart API
========================= */

export const cartApi = {
  /* -------------------------
     1. Sync Cart (GET)
     GET /api/cart
  ------------------------- */
  getCart: async () => {
    const response = await axiosInstance.get("/cart");
    console.log('GET /cart response:', response.data);
    return response.data;
  },

  /* -------------------------
     2. Add Item
     POST /api/cart/item
  ------------------------- */
  addToCart: async (payload: AddToCartPayload) => {
    const response = await axiosInstance.post("/cart/item", payload);
    console.log('POST /cart/item response:', response.data); // Debug log
    return response.data;
  },

  /* -------------------------
     3. Update Quantity
     PATCH /api/cart/item/{itemId}?quantity=5
  ------------------------- */
  updateQuantity: async (itemId: number, quantity: number) => {
    const response = await axiosInstance.patch(
      `/cart/item/${itemId}`,
      null,
      {
        params: { quantity },
      }
    );
    return response.data;
  },

  /* -------------------------
     4. Remove Item
     DELETE /api/cart/item/{itemId}
  ------------------------- */
  removeItem: async (itemId: number) => {
    const response = await axiosInstance.delete(
      `/cart/item/${itemId}`
    );
    return response.data;
  },

  /* -------------------------
     5. Merge Cart
     POST /api/cart/merge
  ------------------------- */
  mergeCart: async (guestItems: GuestItemDTO[]) => {
    const response = await axiosInstance.post(
      "/cart/merge",
      guestItems
    );
    return response.data;
  },
};

export default cartApi;
