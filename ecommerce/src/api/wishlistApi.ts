import axiosInstance from "./axios";

/* ================= TYPES ================= */

export interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  salePrice: number | null;
  images: string[];
  isActive: boolean;
}

export interface Wishlist {
  isWishlisted: boolean;
  id: number;
  userId: number;
  products: WishlistProduct[];
}

/* ================= API ================= */

export const wishlistApi = {
  /**
   * ✅ Fetch logged-in user's wishlist
   * GET /api/wishlist
   */
  getWishlist: async (): Promise<Wishlist> => {
    const response = await axiosInstance.get("/wishlist");
    return response.data;
  },

  /**
   * ❤️ Toggle product in wishlist
   * POST /api/wishlist/toggle/{productId}
   */
  toggleWishlist: async (productId: number): Promise<Wishlist> => {
    const response = await axiosInstance.post(
      `/wishlist/toggle/${productId}`,
    );
    return response.data;
  },
};

export default wishlistApi;
