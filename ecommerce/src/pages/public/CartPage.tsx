// import { motion } from 'framer-motion';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
// import Navbar from '../../components/layout/Navbar';
// import { Footer } from '../../components/layout/Footer';
// import { useAppSelector, useAppDispatch } from '../../hooks/useAuth';
// import cartApi from '../../api/cartApi';

// import {
//   removeFromCart,
//   incrementQuantity,
//   decrementQuantity,
//   clearCart,
// } from '../../store/slices/cartSlice';
// import toast from 'react-hot-toast';

// const CartPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { items, totalPrice, totalItems } = useAppSelector((state) => state.cart);

// const handleRemoveItem = async (
//   itemId: number,
//   productId: number,
//   selectedSize?: string,
//   selectedColor?: string
// ) => {
//   try {
//     await cartApi.removeItem(itemId);

//     dispatch(removeFromCart({ productId, selectedSize, selectedColor }));
//     toast.success('Item removed from cart');
//   } catch (error) {
//     toast.error('Failed to remove item');
//   }
// };

// const handleIncrement = async (
//   itemId: number,
//   productId: number,
//   quantity: number,
//   selectedSize?: string,
//   selectedColor?: string
// ) => {
//   try {
//     await cartApi.updateQuantity(itemId, quantity + 1);

//     dispatch(incrementQuantity({ productId, selectedSize, selectedColor }));
//   } catch (error) {
//     toast.error('Failed to update quantity');
//   }
// };

// const handleDecrement = async (
//   itemId: number,
//   productId: number,
//   quantity: number,
//   selectedSize?: string,
//   selectedColor?: string
// ) => {
//   if (quantity === 1) return;

//   try {
//     await cartApi.updateQuantity(itemId, quantity - 1);

//     dispatch(decrementQuantity({ productId, selectedSize, selectedColor }));
//   } catch (error) {
//     toast.error('Failed to update quantity');
//   }
// };

//   const handleClearCart = () => {
//     dispatch(clearCart());
//     toast.success('Cart cleared');
//   };

//   const shippingCost = totalPrice > 50 ? 0 : 10;
//   const tax = totalPrice * 0.1; // 10% tax
//   const finalTotal = totalPrice + shippingCost + tax;

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen bg-dark-950">
//         <Navbar />
//         <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8  mx-auto">
//           <div className="glass-card rounded-2xl p-12 text-center">
//             <FiShoppingBag className="mx-auto text-dark-600 mb-4" size={64} />
//             <h2 className="text-2xl font-bold text-dark-500 mb-2">Your cart is empty</h2>
//             <p className="text-dark-400 mb-6">Start shopping to add items to your cart</p>
//             <Link to="/products">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn-primary"
//               >
//                 Continue Shopping
//               </motion.button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-dark-950">
//       <Navbar />

//       <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-display font-bold text-dark-500">Shopping Cart</h1>
//             <p className="text-dark-400 mt-2">{totalItems} items in your cart</p>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleClearCart}
//             className="text-red-400 hover:text-red-300 transition-colors"
//           >
//             Clear Cart
//           </motion.button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             {items.map((item) => {
//               const effectivePrice = item.salePrice || item.price;
//               const itemTotal = effectivePrice * item.quantity;

//               return (
//                 <motion.div
//                   key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="glass-card rounded-2xl p-6"
//                 >
//                   <div className="flex gap-6">
//                     {/* Image */}
//                     <Link to={`/products/${item.productId}`}>
//                       <div className="w-32 h-32 rounded-xl overflow-hidden glass-card flex-shrink-0">
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
//                         />
//                       </div>
//                     </Link>

//                     {/* Details */}
//                     <div className="flex-1 flex flex-col justify-between">
//                       <div>
//                         <Link to={`/products/${item.productId}`}>
//                           <h3 className="text-lg font-semibold text-dark-500 hover:text-primary-400 transition-colors">
//                             {item.name}
//                           </h3>
//                         </Link>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {item.selectedSize && (
//                             <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg">
//                               Size: {item.selectedSize}
//                             </span>
//                           )}
//                           {item.selectedColor && (
//                             <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg">
//                               Color: {item.selectedColor}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between mt-4">
//                         {/* Quantity Controls */}
//                         <div className="flex items-center space-x-3">
//                           <motion.button
//                             whileTap={{ scale: 0.9 }}
//                           onClick={() =>
//   handleDecrement(
//     item.itemId,
//     item.productId,
//     item.quantity,
//     item.selectedSize,
//     item.selectedColor
//   )
// }

//                             disabled={item.quantity === 1}
//                             className="w-8 h-8 flex items-center justify-center glass-card rounded-lg font-bold disabled:opacity-50"
//                           >
//                             <FiMinus size={16} />
//                           </motion.button>
//                           <span className="w-8 text-center font-semibold">{item.quantity}</span>
//                           <motion.button
//                             whileTap={{ scale: 0.9 }}
//                           onClick={() =>
//   handleIncrement(
//     item.itemId,
//     item.productId,
//     item.quantity,
//     item.selectedSize,
//     item.selectedColor
//   )
// }

//                             disabled={item.quantity >= item.stock}
//                             className="w-8 h-8 flex items-center justify-center glass-card rounded-lg font-bold disabled:opacity-50"
//                           >
//                             <FiPlus size={16} />
//                           </motion.button>
//                         </div>

//                         {/* Price */}
//                         <div className="text-right">
//                           <div className="text-lg font-bold gradient-text">
//                             ${itemTotal.toFixed(2)}
//                           </div>
//                           {item.salePrice && (
//                             <div className="text-xs text-dark-500 line-through">
//                               ${(item.price * item.quantity).toFixed(2)}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Remove Button */}
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() =>
//   handleRemoveItem(
//     item.itemId,
//     item.productId,
//     item.selectedSize,
//     item.selectedColor
//   )
// }

//                       className="text-red-400 hover:text-red-300 transition-colors"
//                     >
//                       <FiTrash2 size={20} />
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="glass-card rounded-2xl p-6 sticky top-24">
//               <h2 className="text-xl font-bold text-dark-500 mb-6">Order Summary</h2>

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between text-dark-300">
//                   <span>Subtotal ({totalItems} items)</span>
//                   <span className="font-semibold">${totalPrice.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-dark-300">
//                   <span>Shipping</span>
//                   <span className="font-semibold">
//                     {shippingCost === 0 ? (
//                       <span className="text-green-400">FREE</span>
//                     ) : (
//                       `$${shippingCost.toFixed(2)}`
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-dark-300">
//                   <span>Tax (10%)</span>
//                   <span className="font-semibold">${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="border-t border-white/10 pt-4">
//                   <div className="flex justify-between text-dark-500 text-xl font-bold">
//                     <span>Total</span>
//                     <span className="gradient-text">${finalTotal.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               {totalPrice < 50 && (
//                 <div className="mb-6 p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl">
//                   <p className="text-sm text-primary-300">
//                     Add ${(50 - totalPrice).toFixed(2)} more for FREE shipping!
//                   </p>
//                 </div>
//               )}

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => navigate('/checkout')}
//                 className="w-full btn-primary mb-3"
//               >
//                 Proceed to Checkout
//               </motion.button>

//               <Link to="/products">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="w-full btn-ghost"
//                 >
//                   Continue Shopping
//                 </motion.button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default CartPage;



// import { motion } from 'framer-motion';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
// import Navbar from '../../components/layout/Navbar';
// import { Footer } from '../../components/layout/Footer';
// import { useAppSelector, useAppDispatch } from '../../hooks/useAuth';
// import cartApi from '../../api/cartApi';
// import { formatINR } from "../../utils/currency";


// import {
//   addToCart,
//   removeFromCart,
//   incrementQuantity,
//   decrementQuantity,
//   clearCart,
// } from '../../store/slices/cartSlice';
// import toast from 'react-hot-toast';
// import { useState, useEffect } from 'react';

// interface BackendCartItem {
//   id: number;
//   productId: number;
//   productName: string;
//   productImage: string;
//   unitPrice: number;      // ✅ backend field
//   totalPrice: number;     // ✅ backend field
//   quantity: number;
//   selectedSize?: string;
//   selectedColor?: string;
//   stock?: number;
// }


// const CartPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { items, totalPrice, totalItems } = useAppSelector((state) => state.cart);
//   const [isLoading, setIsLoading] = useState(false);
//   const [backendItems, setBackendItems] = useState<BackendCartItem[]>([]);
// const { isAuthenticated, token } = useAppSelector((state) => state.auth);

// // CartPage.tsx - Update the fetchCartFromBackend function
// useEffect(() => {
//   if (!isAuthenticated) {
//     console.log('User not logged in, skipping cart API call');
//     return;
//   }

//   const fetchCartFromBackend = async () => {
//     try {
//       setIsLoading(true);

//       const response = await cartApi.getCart();
//       console.log('Fetched cart from backend:', response);

//       const cartData = response.items || [];
//       setBackendItems(cartData);

//       dispatch(clearCart());

//       cartData.forEach((item: any) => {
//         dispatch(addToCart({
//           itemId: item.id,
//           productId: item.productId,
//           name: item.productName,
//           price: item.unitPrice,
//           salePrice: undefined,
//           quantity: item.quantity,
//           selectedSize: item.selectedSize,
//           selectedColor: item.selectedColor,
//           image: item.productImage,
//           stock: item.stock || 999,
//         }));
//       });

//     } catch (error) {
//       console.error('Failed to fetch cart from backend:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   fetchCartFromBackend();
// }, [dispatch, isAuthenticated]);


// const findBackendItemId = (productId: number, selectedSize?: string, selectedColor?: string): number => {
//  const backendItem = Array.isArray(backendItems)
//   ? backendItems.find(item =>
//       item.productId === productId &&
//       item.selectedSize === selectedSize &&
//       item.selectedColor === selectedColor
//     )
//   : undefined;

  
//   if (backendItem) {
//     return backendItem.id; // This is the backend cart item ID
//   }
  
//   // Try to find in Redux items as fallback
//   const reduxItem = items.find(item => 
//     item.productId === productId &&
//     item.selectedSize === selectedSize &&
//     item.selectedColor === selectedColor
//   );
  
//   return reduxItem?.itemId || 0;
// };

// const handleRemoveItem = async (
//   itemId: number,
//   productId: number,
//   selectedSize?: string,
//   selectedColor?: string
// ) => {
//   // ✅ GUEST USER → LOCAL REMOVE ONLY
//   if (!isAuthenticated) {
//     dispatch(removeFromCart({ productId, selectedSize, selectedColor }));
//     toast.success('Item removed from cart');
//     return;
//   }

//   // ✅ LOGGED-IN USER → BACKEND + REDUX
//   try {
//     const backendItemId = findBackendItemId(productId, selectedSize, selectedColor);

//     if (!backendItemId) {
//       toast.error('Item not found in server cart');
//       return;
//     }

//     await cartApi.removeItem(backendItemId);

//     dispatch(removeFromCart({ productId, selectedSize, selectedColor }));
//     toast.success('Item removed from cart');

//     const updatedCart = await cartApi.getCart();
//     setBackendItems(updatedCart.items || []);
//   } catch (error) {
//     console.error('Remove error:', error);
//     toast.error('Failed to remove item');
//   }
// };


// const handleIncrement = async (
//   itemId: number,
//   productId: number,
//   quantity: number,
//   selectedSize?: string,
//   selectedColor?: string
// ) => {
//   // 👤 GUEST USER → LOCAL ONLY
//   if (!isAuthenticated) {
//     dispatch(incrementQuantity({ productId, selectedSize, selectedColor }));
//     return;
//   }

//   try {
//     const backendItemId = findBackendItemId(productId, selectedSize, selectedColor);

//     if (!backendItemId || backendItemId === 0) {
//       toast.error('Cannot find item in server cart');
//       return;
//     }

//     await cartApi.updateQuantity(backendItemId, quantity + 1);
//     dispatch(incrementQuantity({ productId, selectedSize, selectedColor }));

//     const updatedCart = await cartApi.getCart();
//     setBackendItems(updatedCart.items || []);
//   } catch (error) {
//     console.error('Increment error:', error);
//     toast.error('Failed to update quantity');
//   }
// };

//  const handleDecrement = async (
//   itemId: number,
//   productId: number,
//   quantity: number,
//   selectedSize?: string,
//   selectedColor?: string
// ) => {
//   // 👤 GUEST USER → LOCAL ONLY
//   if (!isAuthenticated) {
//     if (quantity === 1) return;
//     dispatch(decrementQuantity({ productId, selectedSize, selectedColor }));
//     return;
//   }

//   if (quantity === 1) return;

//   try {
//     const backendItemId = findBackendItemId(productId, selectedSize, selectedColor);

//     if (!backendItemId || backendItemId === 0) {
//       toast.error('Cannot find item in server cart');
//       return;
//     }

//     await cartApi.updateQuantity(backendItemId, quantity - 1);
//     dispatch(decrementQuantity({ productId, selectedSize, selectedColor }));

//     const updatedCart = await cartApi.getCart();
//     setBackendItems(updatedCart.items || []);
//   } catch (error) {
//     console.error('Decrement error:', error);
//     toast.error('Failed to update quantity');
//   }
// };


//   const handleClearCart = () => {
//     dispatch(clearCart());
//     toast.success('Cart cleared');
//   };

//   // Safe calculations with fallbacks
//   const safeTotalPrice = totalPrice || 0;
//   const safeTotalItems = totalItems || 0;
//   const shippingCost = safeTotalPrice > 50 ? 0 : 10;
//   const tax = safeTotalPrice * 0.1; // 10% tax
//   const finalTotal = safeTotalPrice + shippingCost + tax;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-dark-950">
//         <Navbar />
//         <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
//           <div className="glass-card rounded-2xl p-12 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400 mx-auto mb-4"></div>
//             <h2 className="text-2xl font-bold text-dark-500 mb-2">Loading your cart...</h2>
//             <p className="text-dark-400">Please wait</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!items || items.length === 0) {
//     return (
//       <div className="min-h-screen bg-dark-950">
//         <Navbar />
//         <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
//           <div className="glass-card rounded-2xl p-12 text-center">
//             <FiShoppingBag className="mx-auto text-dark-600 mb-4" size={64} />
//             <h2 className="text-2xl font-bold text-dark-500 mb-2">Your cart is empty</h2>
//             <p className="text-dark-400 mb-6">Start shopping to add items to your cart</p>
//             <Link to="/products">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn-primary"
//               >
//                 Continue Shopping
//               </motion.button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-dark-950">
//       <Navbar />

//       <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-display font-bold text-dark-400">Shopping Cart</h1>
//             <p className="text-dark-400 mt-2">{safeTotalItems} items in your cart</p>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleClearCart}
//             className="text-red-400 hover:text-red-300 transition-colors"
//           >
//             Clear Cart
//           </motion.button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             {items.map((item) => {
//               // Safe item calculations
//               const safePrice = item.price || 0;
//               const safeSalePrice = item.salePrice || undefined;
//               const safeQuantity = item.quantity || 1;
//               const effectivePrice = safeSalePrice || safePrice;
//               const itemTotal = effectivePrice * safeQuantity;

//               return (
//                 <motion.div
//                   key={`${item.productId}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="glass-card rounded-2xl p-6"
//                 >
//                   <div className="flex gap-6">
//                     {/* Image */}
//                     <Link to={`/products/${item.productId}`}>
//                       <div className="w-32 h-32 rounded-xl overflow-hidden glass-card flex-shrink-0">
//                         <img
//                           // src={item.image || '/placeholder-image.jpg'}
//                           alt={item.name || 'Product image'}
//                           className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          
//                         />
//                       </div>
//                     </Link>

//                     {/* Details */}
//                     <div className="flex-1 flex flex-col justify-between">
//                       <div>
//                         <Link to={`/products/${item.productId}`}>
//                           <h3 className="text-lg font-semibold text-dark-700 hover:text-primary-400 transition-colors">
//                             {item.name || 'Unnamed Product'}
//                           </h3>
//                         </Link>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {item.selectedSize && (
//                             <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg">
//                               Size: {item.selectedSize}
//                             </span>
//                           )}
//                           {item.selectedColor && (
//                             <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg">
//                               Color: {item.selectedColor}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between mt-4">
//                         {/* Quantity Controls */}
//                         <div className="flex items-center space-x-3">
//                           <motion.button
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() =>
//                               handleDecrement(
//                                 item.itemId,
//                                 item.productId,
//                                 safeQuantity,
//                                 item.selectedSize,
//                                 item.selectedColor
//                               )
//                             }
//                             disabled={safeQuantity === 1}
//                             className="w-8 h-8 flex items-center justify-center glass-card rounded-lg font-bold disabled:opacity-50"
//                           >
//                             <FiMinus size={16} />
//                           </motion.button>
//                           <span className="w-8 text-center font-semibold">{safeQuantity}</span>
//                           <motion.button
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() =>
//                               handleIncrement(
//                                 item.itemId,
//                                 item.productId,
//                                 safeQuantity,
//                                 item.selectedSize,
//                                 item.selectedColor
//                               )
//                             }
//                             disabled={safeQuantity >= (item.stock || 999)}
//                             className="w-8 h-8 flex items-center justify-center glass-card rounded-lg font-bold disabled:opacity-50"
//                           >
//                             <FiPlus size={16} />
//                           </motion.button>
//                         </div>

//                         {/* Price */}
//                         <div className="text-right">
//                           <div className="text-lg font-bold gradient-text">
//                             {formatINR(itemTotal || 0)}
//                           </div>
//                           {safeSalePrice && safeSalePrice < safePrice && (
//                             <div className="text-xs text-dark-500 line-through">
//                               {formatINR(safePrice * safeQuantity)}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Remove Button */}
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() =>
//                         handleRemoveItem(
//                           item.itemId,
//                           item.productId,
//                           item.selectedSize,
//                           item.selectedColor
//                         )
//                       }
//                       className="text-red-400 hover:text-red-300 transition-colors"
//                     >
//                       <FiTrash2 size={20} />
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="glass-card rounded-2xl p-6 sticky top-24">
//               <h2 className="text-xl font-bold text-dark-500 mb-6">Order Summary</h2>

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between text-dark-300">
//                   <span>Subtotal ({safeTotalItems} items)</span>
//                   <span className="font-semibold">{formatINR(safeTotalPrice || 0)}</span>
//                 </div>
//                 <div className="flex justify-between text-dark-300">
//                   <span>Shipping</span>
//                   <span className="font-semibold">
//                     {shippingCost === 0 ? (
//                       <span className="text-green-400">FREE</span>
//                     ) : (
//                       `${formatINR(shippingCost)}`
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-dark-300">
//                   <span>Tax (10%)</span>
//                   <span className="font-semibold">{formatINR(tax || 0)}</span>
//                 </div>
//                 <div className="border-t border-white/10 pt-4">
//                   <div className="flex justify-between text-dark-500 text-xl font-bold">
//                     <span>Total</span>
//                     <span className="gradient-text">{formatINR(finalTotal || 0)}</span>
//                   </div>
//                 </div>
//               </div>

//               {safeTotalPrice < 50 && (
//                 <div className="mb-6 p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl">
//                   <p className="text-sm text-primary-300">
//                     Add {formatINR(50 - safeTotalPrice)} more for FREE shipping!
//                   </p>
//                 </div>
//               )}

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => navigate('/checkout')}
//                 className="w-full btn-primary mb-3"
//                 disabled={safeTotalPrice <= 0}
//               >
//                 Proceed to Checkout
//               </motion.button>

//               <Link to="/products">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="w-full btn-ghost"
//                 >
//                   Continue Shopping
//                 </motion.button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default CartPage;


// import { motion } from 'framer-motion';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
// import Navbar from '../../components/layout/Navbar';
// import { Footer } from '../../components/layout/Footer';
// import { useAppSelector, useAppDispatch } from '../../hooks/useAuth';
// import cartApi from '../../api/cartApi';
// import { formatINR } from "../../utils/currency";
// import {
//   addToCart,
//   removeFromCart,
//   incrementQuantity,
//   decrementQuantity,
//   clearCart,
// } from '../../store/slices/cartSlice';
// import toast from 'react-hot-toast';
// import { useState, useEffect } from 'react';

// // ----------------------------------------------------------------------
// // HELPER: Fix Image URLs - ADD THIS AT THE TOP
// // ----------------------------------------------------------------------
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://localhost:3000';
// const getImageUrl = (path?: string) => {
//   if (!path) return '/placeholder-image.jpg';
//   if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('https://')) return path;
//   if (path.startsWith('/')) return `${SERVER_URL}${path}`;
//   return `${SERVER_URL}/${path}`;
// };

// interface BackendCartItem {
//   id: number;
//   productId: number;
//   productName: string;
//   productImage: string;
//   unitPrice: number;
//   totalPrice: number;
//   quantity: number;
//   selectedSize?: string;
//   selectedColor?: string;
//   stock?: number;
// }

// const CartPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { items, totalPrice, totalItems } = useAppSelector((state) => state.cart);
//   const [isLoading, setIsLoading] = useState(false);
//   const [backendItems, setBackendItems] = useState<BackendCartItem[]>([]);
//   const { isAuthenticated } = useAppSelector((state) => state.auth);

//   // Debug logging for images
//   useEffect(() => {
//     console.log('Cart items debug:', {
//       items,
//       backendItems,
//       hasItems: items.length > 0,
//       firstItem: items[0],
//       SERVER_URL,
//       imageUrlExample: items[0]?.image ? getImageUrl(items[0].image) : 'No image'
//     });
//   }, [items, backendItems]);

//   // CartPage.tsx - Update the fetchCartFromBackend function
//   useEffect(() => {
//     if (!isAuthenticated) {
//       console.log('User not logged in, skipping cart API call');
//       return;
//     }

//     const fetchCartFromBackend = async () => {
//       try {
//         setIsLoading(true);

//         const response = await cartApi.getCart();
//         console.log('Fetched cart from backend:', response);

//         const cartData = response.items || [];
//         setBackendItems(cartData);

//         dispatch(clearCart());

//         cartData.forEach((item: any) => {
//           console.log('Processing cart item:', {
//             itemId: item.id,
//             productId: item.productId,
//             productName: item.productName,
//             originalImage: item.productImage,
//             fixedImage: getImageUrl(item.productImage),
//             unitPrice: item.unitPrice,
//             quantity: item.quantity
//           });

//           dispatch(addToCart({
//             itemId: item.id,
//             productId: item.productId,
//             name: item.productName,
//             price: item.unitPrice,
//             salePrice: undefined,
//             quantity: item.quantity,
//             selectedSize: item.selectedSize,
//             selectedColor: item.selectedColor,
//             image: getImageUrl(item.productImage), // FIXED: Use getImageUrl here
//             stock: item.stock || 999,
//           }));
//         });

//       } catch (error) {
//         console.error('Failed to fetch cart from backend:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCartFromBackend();
//   }, [dispatch, isAuthenticated]);

//   const findBackendItemId = (productId: number, selectedSize?: string, selectedColor?: string): number => {
//     const backendItem = Array.isArray(backendItems)
//       ? backendItems.find(item =>
//         item.productId === productId &&
//         item.selectedSize === selectedSize &&
//         item.selectedColor === selectedColor
//       )
//       : undefined;

//     if (backendItem) {
//       return backendItem.id;
//     }

//     // Try to find in Redux items as fallback
//     const reduxItem = items.find(item =>
//       item.productId === productId &&
//       item.selectedSize === selectedSize &&
//       item.selectedColor === selectedColor
//     );

//     return reduxItem?.itemId || 0;
//   };

//   const handleRemoveItem = async (
//     itemId: number,
//     productId: number,
//     selectedSize?: string,
//     selectedColor?: string
//   ) => {
//     // ✅ GUEST USER → LOCAL REMOVE ONLY
//     if (!isAuthenticated) {
//       dispatch(removeFromCart({ productId, selectedSize, selectedColor }));
//       toast.success('Item removed from cart');
//       return;
//     }

//     // ✅ LOGGED-IN USER → BACKEND + REDUX
//     try {
//       const backendItemId = findBackendItemId(productId, selectedSize, selectedColor);

//       if (!backendItemId) {
//         toast.error('Item not found in server cart');
//         return;
//       }

//       await cartApi.removeItem(backendItemId);

//       dispatch(removeFromCart({ productId, selectedSize, selectedColor }));
//       toast.success('Item removed from cart');

//       const updatedCart = await cartApi.getCart();
//       setBackendItems(updatedCart.items || []);
//     } catch (error) {
//       console.error('Remove error:', error);
//       toast.error('Failed to remove item');
//     }
//   };

//   const handleIncrement = async (
//     itemId: number,
//     productId: number,
//     quantity: number,
//     selectedSize?: string,
//     selectedColor?: string
//   ) => {
//     // 👤 GUEST USER → LOCAL ONLY
//     if (!isAuthenticated) {
//       dispatch(incrementQuantity({ productId, selectedSize, selectedColor }));
//       return;
//     }

//     try {
//       const backendItemId = findBackendItemId(productId, selectedSize, selectedColor);

//       if (!backendItemId || backendItemId === 0) {
//         toast.error('Cannot find item in server cart');
//         return;
//       }

//       await cartApi.updateQuantity(backendItemId, quantity + 1);
//       dispatch(incrementQuantity({ productId, selectedSize, selectedColor }));

//       const updatedCart = await cartApi.getCart();
//       setBackendItems(updatedCart.items || []);
//     } catch (error) {
//       console.error('Increment error:', error);
//       toast.error('Failed to update quantity');
//     }
//   };

//   const handleDecrement = async (
//     itemId: number,
//     productId: number,
//     quantity: number,
//     selectedSize?: string,
//     selectedColor?: string
//   ) => {
//     // 👤 GUEST USER → LOCAL ONLY
//     if (!isAuthenticated) {
//       if (quantity === 1) return;
//       dispatch(decrementQuantity({ productId, selectedSize, selectedColor }));
//       return;
//     }

//     if (quantity === 1) return;

//     try {
//       const backendItemId = findBackendItemId(productId, selectedSize, selectedColor);

//       if (!backendItemId || backendItemId === 0) {
//         toast.error('Cannot find item in server cart');
//         return;
//       }

//       await cartApi.updateQuantity(backendItemId, quantity - 1);
//       dispatch(decrementQuantity({ productId, selectedSize, selectedColor }));

//       const updatedCart = await cartApi.getCart();
//       setBackendItems(updatedCart.items || []);
//     } catch (error) {
//       console.error('Decrement error:', error);
//       toast.error('Failed to update quantity');
//     }
//   };

//   const handleClearCart = () => {
//     dispatch(clearCart());
//     toast.success('Cart cleared');
//   };

//   // Safe calculations with fallbacks
//   const safeTotalPrice = totalPrice || 0;
//   const safeTotalItems = totalItems || 0;
//   const shippingCost = safeTotalPrice > 50 ? 0 : 10;
//   const tax = safeTotalPrice * 0.1;
//   const finalTotal = safeTotalPrice + shippingCost + tax;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-dark-950">
//         <Navbar />
//         <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
//           <div className="glass-card rounded-2xl p-12 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400 mx-auto mb-4"></div>
//             <h2 className="text-2xl font-bold text-dark-500 mb-2">Loading your cart...</h2>
//             <p className="text-dark-400">Please wait</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!items || items.length === 0) {
//     return (
//       <div className="min-h-screen bg-dark-950">
//         <Navbar />
//         <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
//           <div className="glass-card rounded-2xl p-12 text-center">
//             <FiShoppingBag className="mx-auto text-dark-600 mb-4" size={64} />
//             <h2 className="text-2xl font-bold text-dark-500 mb-2">Your cart is empty</h2>
//             <p className="text-dark-400 mb-6">Start shopping to add items to your cart</p>
//             <Link to="/products">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn-primary"
//               >
//                 Continue Shopping
//               </motion.button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-dark-950">
//       <Navbar />

//       <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-display font-bold text-dark-400">Shopping Cart</h1>
//             <p className="text-dark-400 mt-2">{safeTotalItems} items in your cart</p>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleClearCart}
//             className="text-red-400 hover:text-red-300 transition-colors"
//           >
//             Clear Cart
//           </motion.button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             {items.map((item) => {
//               // Safe item calculations
//               const safePrice = item.price || 0;
//               const safeSalePrice = item.salePrice || undefined;
//               const safeQuantity = item.quantity || 1;
//               const effectivePrice = safeSalePrice || safePrice;
//               const itemTotal = effectivePrice * safeQuantity;

//               // Get the properly formatted image URL
//               const imageUrl = getImageUrl(item.image);
              
//               console.log('Rendering cart item:', {
//                 productId: item.productId,
//                 itemName: item.name,
//                 originalImage: item.image,
//                 formattedImage: imageUrl,
//                 item
//               });

//               return (
//                 <motion.div
//                   key={`${item.productId}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="glass-card rounded-2xl p-6"
//                 >
//                   <div className="flex gap-6">
//                     {/* Image */}
//                     <Link to={`/products/${item.productId}`}>
//                       <div className="w-32 h-32 rounded-xl overflow-hidden glass-card flex-shrink-0 relative">
//                         <img
//                           src={imageUrl}
//                           alt={item.name || 'Product image'}
//                           className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
//                           onError={(e) => {
//                             console.error('Image failed to load:', {
//                               attemptedUrl: e.currentTarget.src,
//                               productId: item.productId,
//                               itemName: item.name
//                             });
//                             e.currentTarget.src = '/placeholder-image.jpg';
//                           }}
//                           onLoad={() => {
//                             console.log('Image loaded successfully:', {
//                               productId: item.productId,
//                               url: imageUrl
//                             });
//                           }}
//                         />
//                         {/* Loading indicator */}
//                         <div className="absolute inset-0 bg-dark-800/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                           <span className="text-xs text-dark-500 bg-black/50 px-2 py-1 rounded">
//                             View Product
//                           </span>
//                         </div>
//                       </div>
//                     </Link>
                    
//                     {/* Details */}
//                     <div className="flex-1 flex flex-col justify-between">
//                       <div>
//                         <Link to={`/products/${item.productId}`}>
//                           <h3 className="text-lg font-semibold text-dark-700 hover:text-primary-400 transition-colors">
//                             {item.name || 'Unnamed Product'}
//                           </h3>
//                         </Link>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {item.selectedSize && (
//                             <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg">
//                               Size: {item.selectedSize}
//                             </span>
//                           )}
//                           {item.selectedColor && (
//                             <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg">
//                               Color: {item.selectedColor}
//                             </span>
//                           )}
//                         </div>
//                         {/* Price per unit */}
//                         <div className="mt-2">
//                           <span className="text-sm text-dark-500">
//                             {formatINR(effectivePrice)} each
//                           </span>
//                           {safeSalePrice && safeSalePrice < safePrice && (
//                             <span className="text-xs text-red-400 ml-2 line-through">
//                               {formatINR(safePrice)} each
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between mt-4">
//                         {/* Quantity Controls */}
//                         <div className="flex items-center space-x-3">
//                           <motion.button
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() =>
//                               handleDecrement(
//                                 item.itemId,
//                                 item.productId,
//                                 safeQuantity,
//                                 item.selectedSize,
//                                 item.selectedColor
//                               )
//                             }
//                             disabled={safeQuantity === 1}
//                             className="w-8 h-8 flex items-center justify-center glass-card rounded-lg font-bold disabled:opacity-50 hover:bg-dark-800 transition-colors"
//                           >
//                             <FiMinus size={16} />
//                           </motion.button>
//                           <span className="w-8 text-center font-semibold text-dark-500">{safeQuantity}</span>
//                           <motion.button
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() =>
//                               handleIncrement(
//                                 item.itemId,
//                                 item.productId,
//                                 safeQuantity,
//                                 item.selectedSize,
//                                 item.selectedColor
//                               )
//                             }
//                             disabled={safeQuantity >= (item.stock || 999)}
//                             className="w-8 h-8 flex items-center justify-center glass-card rounded-lg font-bold disabled:opacity-50 hover:bg-dark-800 transition-colors"
//                           >
//                             <FiPlus size={16} />
//                           </motion.button>
//                         </div>

//                         {/* Total Price */}
//                         <div className="text-right">
//                           <div className="text-lg font-bold gradient-text">
//                             {formatINR(itemTotal || 0)}
//                           </div>
//                           <div className="text-xs text-dark-500">
//                             {safeQuantity} × {formatINR(effectivePrice)}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Remove Button */}
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() =>
//                         handleRemoveItem(
//                           item.itemId,
//                           item.productId,
//                           item.selectedSize,
//                           item.selectedColor
//                         )
//                       }
//                       className="text-red-400 hover:text-red-300 transition-colors self-start"
//                       title="Remove item"
//                     >
//                       <FiTrash2 size={20} />
//                     </motion.button>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="glass-card rounded-2xl p-6 sticky top-24">
//               <h2 className="text-xl font-bold text-dark-800 mb-6">Order Summary</h2>

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between text-dark-300">
//                   <span>Subtotal ({safeTotalItems} items)</span>
//                   <span className="font-semibold">{formatINR(safeTotalPrice || 0)}</span>
//                 </div>
//                 <div className="flex justify-between text-dark-300">
//                   <span>Shipping</span>
//                   <span className="font-semibold">
//                     {shippingCost === 0 ? (
//                       <span className="text-green-400">FREE</span>
//                     ) : (
//                       formatINR(shippingCost)
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-dark-300">
//                   <span>Tax (10%)</span>
//                   <span className="font-semibold">{formatINR(tax || 0)}</span>
//                 </div>
//                 <div className="border-t border-white/10 pt-4">
//                   <div className="flex justify-between text-dark-400 text-xl font-bold">
//                     <span>Total</span>
//                     <span className="gradient-text">{formatINR(finalTotal || 0)}</span>
//                   </div>
//                 </div>
//               </div>

//               {safeTotalPrice < 50 && (
//                 <div className="mb-6 p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl">
//                   <p className="text-sm text-primary-300">
//                     Add {formatINR(50 - safeTotalPrice)} more for FREE shipping!
//                   </p>
//                 </div>
//               )}

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => navigate('/checkout')}
//                 className="w-full btn-primary mb-3"
//                 disabled={safeTotalPrice <= 0}
//               >
//                 Proceed to Checkout
//               </motion.button>

//               <Link to="/products">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="w-full btn-ghost"
//                 >
//                   Continue Shopping
//                 </motion.button>
//               </Link>

//               {/* Cart Stats */}
//               <div className="mt-6 pt-6 border-t border-white/10 text-sm text-dark-400">
//                 <div className="flex justify-between mb-2">
//                   <span>Items in cart:</span>
//                   <span className="text-dark-800">{safeTotalItems}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span>Unique products:</span>
//                   <span className="text-dark-800">{new Set(items.map(item => item.productId)).size}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Average price per item:</span>
//                   <span className="text-dark-800">
//                     {formatINR(safeTotalItems > 0 ? safeTotalPrice / safeTotalItems : 0)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default CartPage;


import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAppSelector, useAppDispatch } from '../../hooks/useAuth';
import cartApi from '../../api/cartApi';
import { formatINR } from "../../utils/currency";
import {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------
// HELPER: Fix Image URLs
// ----------------------------------------------------------------------
const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://localhost:3000';
const getImageUrl = (path?: string) => {
  if (!path) return '/placeholder-image.jpg';
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${SERVER_URL}${path}`;
  return `${SERVER_URL}/${path}`;
};

interface BackendCartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  stock?: number;
}

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalPrice, totalItems } = useAppSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [backendItems, setBackendItems] = useState<BackendCartItem[]>([]);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const getApiErrorDetails = (error: unknown) => {
    if (error && typeof error === 'object') {
      const candidate = error as {
        status?: unknown;
        message?: unknown;
        error?: unknown;
      };
      const status =
        typeof candidate.status === 'number' ? candidate.status : undefined;
      const message =
        typeof candidate.message === 'string'
          ? candidate.message
          : typeof candidate.error === 'string'
            ? candidate.error
            : '';
      return { status, message };
    }
    return { status: undefined, message: '' };
  };

  const syncCartFromBackend = useCallback(async () => {
    const response = await cartApi.getCart();
    const cartData = response.items || [];
    setBackendItems(cartData);
    dispatch(clearCart());
    cartData.forEach((item: any) => {
      dispatch(addToCart({
        itemId: item.id,
        productId: item.productId,
        name: item.productName,
        price: item.unitPrice,
        salePrice: undefined,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        image: getImageUrl(item.productImage),
        stock: item.stock || 999,
      }));
    });
  }, [dispatch]);

  // Fetch cart from backend for authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchCartFromBackend = async () => {
      try {
        setIsLoading(true);
        await syncCartFromBackend();
      } catch (error) {
        console.error('Failed to fetch cart from backend:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartFromBackend();
  }, [isAuthenticated, syncCartFromBackend]);

  const findBackendItemId = (productId: number, selectedSize?: string, selectedColor?: string): number => {
    const backendItem = Array.isArray(backendItems)
      ? backendItems.find(item =>
        item.productId === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
      )
      : undefined;

    if (backendItem) {
      return backendItem.id;
    }

    const reduxItem = items.find(item =>
      item.productId === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );

    return reduxItem?.itemId || 0;
  };

  const handleRemoveItem = async (
    productId: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    if (!isAuthenticated) {
      dispatch(removeFromCart({ productId, selectedSize, selectedColor }));
      toast.success('Item removed from cart');
      return;
    }

    try {
      const backendItemId = findBackendItemId(productId, selectedSize, selectedColor);
      if (!backendItemId) {
        toast.error('Item not found in server cart');
        return;
      }

      await cartApi.removeItem(backendItemId);
      dispatch(removeFromCart({ productId, selectedSize, selectedColor }));
      toast.success('Item removed from cart');
      await syncCartFromBackend();
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleIncrement = async (
    productId: number,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    if (!isAuthenticated) {
      dispatch(incrementQuantity({ productId, selectedSize, selectedColor }));
      return;
    }

    try {
      const backendItemId = findBackendItemId(productId, selectedSize, selectedColor);
      if (!backendItemId || backendItemId === 0) {
        toast.error('Cannot find item in server cart');
        return;
      }

      await cartApi.updateQuantity(backendItemId, quantity + 1);
      dispatch(incrementQuantity({ productId, selectedSize, selectedColor }));
      await syncCartFromBackend();
    } catch (error: unknown) {
      console.error('Increment error:', error);
      const { status, message } = getApiErrorDetails(error);
      const normalizedMessage = message.toLowerCase();
      const isStockConflict =
        status === 409 ||
        normalizedMessage.includes('modified by another request') ||
        normalizedMessage.includes('stock');
      if (isStockConflict) {
        await syncCartFromBackend();
        toast.error('Stock changed. Cart updated with latest availability.');
      } else {
        toast.error(message || 'Failed to update quantity');
      }
    }
  };

  const handleDecrement = async (
    productId: number,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    if (!isAuthenticated) {
      if (quantity === 1) return;
      dispatch(decrementQuantity({ productId, selectedSize, selectedColor }));
      return;
    }

    if (quantity === 1) return;

    try {
      const backendItemId = findBackendItemId(productId, selectedSize, selectedColor);
      if (!backendItemId || backendItemId === 0) {
        toast.error('Cannot find item in server cart');
        return;
      }

      await cartApi.updateQuantity(backendItemId, quantity - 1);
      dispatch(decrementQuantity({ productId, selectedSize, selectedColor }));
      await syncCartFromBackend();
    } catch (error: unknown) {
      console.error('Decrement error:', error);
      const { status, message } = getApiErrorDetails(error);
      const normalizedMessage = message.toLowerCase();
      const isStockConflict =
        status === 409 ||
        normalizedMessage.includes('modified by another request') ||
        normalizedMessage.includes('stock');
      if (isStockConflict) {
        await syncCartFromBackend();
        toast.error('Stock changed. Cart updated with latest availability.');
      } else {
        toast.error(message || 'Failed to update quantity');
      }
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  // Simple checkout handler - just checks authentication
  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    // User is authenticated, proceed to checkout
    navigate('/checkout');
  };

  // Safe calculations with fallbacks
  const safeTotalPrice = totalPrice || 0;
  const safeTotalItems = totalItems || 0;
  // const shippingCost = safeTotalPrice > 50 ? 0 : 10;
  // const tax = safeTotalPrice * 0.1;
  const finalTotal = safeTotalPrice  ;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950">
        <Navbar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-dark-500 mb-2">Loading your cart...</h2>
            <p className="text-dark-400">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-dark-950">
        <Navbar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="glass-card rounded-2xl p-12 text-center">
            <FiShoppingBag className="mx-auto text-dark-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-dark-500 mb-2">Your cart is empty</h2>
            <p className="text-dark-400 mb-6">Start shopping to add items to your cart</p>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-dark-400">Shopping Cart</h1>
            <p className="text-dark-400 mt-2">{safeTotalItems} items in your cart</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearCart}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Clear Cart
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const safePrice = item.price || 0;
              const safeSalePrice = item.salePrice || undefined;
              const safeQuantity = item.quantity || 1;
              const effectivePrice = safeSalePrice || safePrice;
              const itemTotal = effectivePrice * safeQuantity;
              const imageUrl = getImageUrl(item.image);

              return (
                <motion.div
                  key={`${item.productId}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <Link to={`/products/${item.productId}`}>
                      <div className="w-32 h-32 rounded-xl overflow-hidden glass-card flex-shrink-0 relative">
                        <img
                          src={imageUrl}
                          alt={item.name || 'Product image'}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    </Link>
                    
                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link to={`/products/${item.productId}`}>
                          <h3 className="text-lg font-semibold text-dark-700 hover:text-primary-400 transition-colors">
                            {item.name || 'Unnamed Product'}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.selectedSize && (
                            <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg">
                              Color: {item.selectedColor}
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-dark-500">
                            {formatINR(effectivePrice)} each
                          </span>
                          {safeSalePrice && safeSalePrice < safePrice && (
                            <span className="text-xs text-red-400 ml-2 line-through">
                              {formatINR(safePrice)} each
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleDecrement(
                                item.productId,
                                safeQuantity,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            disabled={safeQuantity === 1}
                            className="w-8 h-8 flex items-center justify-center glass-card rounded-lg font-bold disabled:opacity-50 hover:bg-dark-800 transition-colors"
                          >
                            <FiMinus size={16} />
                          </motion.button>
                          <span className="w-8 text-center font-semibold text-dark-500">{safeQuantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleIncrement(
                                item.productId,
                                safeQuantity,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            disabled={safeQuantity >= (item.stock || 999)}
                            className="w-8 h-8 flex items-center justify-center glass-card rounded-lg font-bold disabled:opacity-50 hover:bg-dark-800 transition-colors"
                          >
                            <FiPlus size={16} />
                          </motion.button>
                        </div>

                        {/* Total Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold gradient-text">
                            {formatINR(itemTotal || 0)}
                          </div>
                          <div className="text-xs text-dark-500">
                            {safeQuantity} × {formatINR(effectivePrice)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        handleRemoveItem(
                          item.productId,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                      className="text-red-400 hover:text-red-300 transition-colors self-start"
                      title="Remove item"
                    >
                      <FiTrash2 size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-dark-500 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-dark-300">
                  <span>Subtotal ({safeTotalItems} items)</span>
                  <span className="font-semibold">{formatINR(safeTotalPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-dark-300">
                  {/* <span>Shipping</span> */}
                  {/* <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      formatINR(shippingCost)
                    )}
                  </span> */}
                </div>
                {/* <div className="flex justify-between text-dark-300">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">{formatINR(tax || 0)}</span>
                </div> */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-dark-500 text-xl font-bold">
                    <span>Total</span>
                    <span className="gradient-text">{formatINR(finalTotal || 0)}</span>
                  </div>
                </div>
              </div>

              {safeTotalPrice < 50 && (
                <div className="mb-6 p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                  <p className="text-sm text-primary-300">
                    Add {formatINR(50 - safeTotalPrice)} more for FREE shipping!
                  </p>
                </div>
              )}

              {/* Simple Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToCheckout}
                className="w-full btn-primary mb-3"
                disabled={safeTotalPrice <= 0}
              >
                Proceed to Checkout
              </motion.button>

              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-ghost"
                >
                  Continue Shopping
                </motion.button>
              </Link>

              {/* Cart Stats */}
              <div className="mt-6 pt-6 border-t border-white/10 text-sm text-dark-400">
                <div className="flex justify-between mb-2">
                  <span>Items in cart:</span>
                  <span className="text-dark-500">{safeTotalItems}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Unique products:</span>
                  <span className="text-dark-500">{new Set(items.map(item => item.productId)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average price per item:</span>
                  <span className="text-dark-500">
                    {formatINR(safeTotalItems > 0 ? safeTotalPrice / safeTotalItems : 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
