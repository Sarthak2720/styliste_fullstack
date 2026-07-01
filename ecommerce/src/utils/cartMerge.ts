import cartApi from "../api/cartApi";
import { clearCart, addToCart } from "../store/slices/cartSlice";
import type { AppDispatch } from "../store/store";

export const mergeGuestCartAfterLogin = async (dispatch: AppDispatch) => {
  const guestCartRaw = localStorage.getItem("styliste_guest_cart");

  if (!guestCartRaw) return;

  const guestItems = JSON.parse(guestCartRaw);

  if (!Array.isArray(guestItems) || guestItems.length === 0) {
    localStorage.removeItem("styliste_guest_cart");
    return;
  }

  try {
    // 🔥 MERGE
    const mergedCart = await cartApi.mergeCart(guestItems);

    // 🔁 Reset Redux cart
    dispatch(clearCart());

    // 🔁 Populate Redux from backend response
    mergedCart.items.forEach((item: any) => {
      dispatch(
        addToCart({
          itemId: item.id,
          productId: item.productId,
          name: item.productName,
          price: item.unitPrice,
          salePrice: undefined,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.productImage,
          stock: item.stock || 999,
        })
      );
    });

    // 🧹 CLEANUP
    localStorage.removeItem("styliste_cart");
  } catch (error) {
    console.error("Cart merge failed", error);
  }
};
