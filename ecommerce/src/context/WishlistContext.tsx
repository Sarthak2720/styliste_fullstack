import { createContext, useContext, useEffect, useState } from "react";
import { wishlistApi } from "../api/wishlistApi";
import useAuth from "../hooks/useAuth";

interface WishlistContextType {
  wishlistIds: number[];
  toggleWishlist: (productId: number) => Promise<void>;
  removeWishlistId: (productId: number) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const { isAuthenticated } = useAuth(); // ✅ ADD THIS

  useEffect(() => {
    // ⛔ IMPORTANT: Do NOTHING for guest users
    if (!isAuthenticated) {
      setWishlistIds([]); // clear wishlist for guests
      return;
    }

    const load = async () => {
      try {
        const data = await wishlistApi.getWishlist();
        setWishlistIds(data.products.map((p: any) => p.id));
      } catch (error) {
        console.error("Failed to load wishlist", error);
      }
    };

    load();
  }, [isAuthenticated]); // ✅ depend on auth

  const toggleWishlist = async (productId: number) => {
    if (!isAuthenticated) {
      // ❌ do not call backend for guests
      throw new Error("User not authenticated");
    }

    // optimistic update
    setWishlistIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );

    try {
      await wishlistApi.toggleWishlist(productId);
    } catch (error) {
      console.error("Wishlist toggle failed", error);
    }
  };

  const removeWishlistId = (productId: number) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, removeWishlistId }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
