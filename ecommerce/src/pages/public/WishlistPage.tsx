// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FiX, FiShoppingCart, FiHeart, FiChevronRight } from "react-icons/fi";
// import { motion } from "framer-motion";
// import Navbar from "../../components/layout/Navbar";
// import {Footer} from "../../components/layout/Footer";
// import { wishlistApi } from "../../api/wishlistApi";

// // Mock wishlist data - replace with actual API data
// const IMAGE_BASE_URL =
//   import.meta.env.VITE_API_IMG_URL || "http://localhost:8090";


// const Wishlist = () => {
//   const [wishlistItems, setWishlistItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Remove item from wishlist
// const handleRemoveItem = async (id: number) => {
//   try {
//     await wishlistApi.toggleWishlist(id); // toggle removes it
//     setWishlistItems(prev => prev.filter(item => item.id !== id));
//   } catch (error) {
//     console.error("Failed to remove item from wishlist", error);
//   }
// };

//   // Add item to cart
//   const handleAddToCart = (id: number) => {
//     // TODO: Call API to add to cart
//     console.log(`Added item ${id} to cart`);
//     // Optionally remove from wishlist after adding to cart
//     // setWishlistItems(prev => prev.filter(item => item.id !== id));
//   };

//   // Calculate total savings
//   const totalSavings = wishlistItems.reduce((sum, item) => {
//     return sum + (item.originalPrice - item.discountedPrice);
//   }, 0);
// useEffect(() => {
//   const fetchWishlist = async () => {
//     try {
//       setLoading(true);

// const data = await wishlistApi.getWishlist();

// // âœ… data.products (NOT data.items)
// const formattedItems = data.products.map((product: any) => ({
//   id: product.id,
//   name: product.name,
//   category: product.category ?? "Uncategorized",
//   originalPrice: product.price,
//   discountedPrice: product.salePrice ?? product.price,
//   discount: product.salePrice
//     ? Math.round(
//         ((product.price - product.salePrice) / product.price) * 100
//       )
//     : 0,
//   image: product.images?.[0]
//     ? `${IMAGE_BASE_URL}${product.images[0]}`
//     : "/placeholder.jpg",
// }));


// setWishlistItems(formattedItems);

//     } catch (error) {
//       console.error("Failed to fetch wishlist", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchWishlist();
// }, []);

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Fixed Navbar */}
//       <Navbar />

//       {/* Breadcrumb Navigation */}
//       <div className="bg-gray-50 border-b border-gray-200">
//         <div className="container mx-auto px-4 py-3">
//           <nav className="flex items-center space-x-2 text-sm">
//             <Link to="/" className="text-gray-600 hover:text-gray-900">
//               Home
//             </Link>
//             <FiChevronRight className="text-gray-400" size={16} />
//             <span className="text-gray-900 font-medium">Wishlist</span>
//           </nav>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 container mx-auto px-4 py-8">
//         {/* Page Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 My Wishlist
//                 <span className="ml-2 text-gray-600 font-normal">
//                   {wishlistItems.length} items
//                 </span>
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 {totalSavings > 0 && (
//                   <span className="text-green-600 font-medium">
//                     Total Savings: â‚¹{totalSavings.toLocaleString()}
//                   </span>
//                 )}
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               {wishlistItems.length > 0 && (
//                 <button className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors">
//                   Clear All
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//           </div>
//         ) : wishlistItems.length > 0 ? (
//           <>
//             {/* Wishlist Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {wishlistItems.map((item) => (
//                 <motion.div
//                   key={item.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
//                 >
//                   {/* Image Container */}
//                   <div className="relative">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-full h-64 object-cover"
//                     />
                    
//                     {/* Cancel Icon (Top Right) */}
//                     <button
//                       onClick={() => handleRemoveItem(item.id)}
//                       className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
//                       aria-label="Remove from wishlist"
//                     >
//                       <FiX className="text-gray-700" size={18} />
//                     </button>

//                     {/* Category Badge */}
//                     <div className="absolute bottom-3 left-3">
//                       <span className="px-3 py-1 bg-black/70 text-white text-xs font-medium rounded-full">
//                         {item.category}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Product Info */}
//                   <div className="p-4">
//                     {/* Product Name */}
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
//                       {item.name}
//                     </h3>

//                     {/* Price Section */}
//                     <div className="space-y-1 mb-4">
//                       <div className="flex items-baseline space-x-2">
//                         <span className="text-2xl font-bold text-gray-900">
//                           â‚¹{item.discountedPrice.toLocaleString()}
//                         </span>
//                         <span className="text-sm text-gray-500 line-through">
//                           â‚¹{item.originalPrice.toLocaleString()}
//                         </span>
//                         <span className="text-sm font-medium text-green-600">
//                           ({item.discount}% OFF)
//                         </span>
//                       </div>
//                     </div>

//                     {/* Add to Cart Button */}
//                     <button
//                       onClick={() => handleAddToCart(item.id)}
//                       className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors"
//                     >
//                       <FiShoppingCart size={18} />
//                       <span>ADD TO CART</span>
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Empty Wishlist Message (Hidden when items exist) */}
//             <div className="hidden"></div>
//           </>
//         ) : (
//           // Empty Wishlist State
//           <div className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//               <FiHeart className="w-16 h-16 text-gray-400" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">
//               Your wishlist is empty
//             </h2>
//             <p className="text-gray-600 max-w-md mb-8">
//               Add items you like to your wishlist. Review them anytime and easily move them to the bag.
//             </p>
//             <Link
//               to="/products"
//               className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         )}
//       </main>

//       {/* Fixed Footer */}
//       <Footer />

//       {/* Custom Styles */}
//       <style>{`
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
        
//         /* Ensure main content doesn't hide behind fixed navbar/footer */
//         main {
//           margin-top: 80px; /* Adjust based on your navbar height */
//           margin-bottom: 80px; /* Adjust based on your footer height */
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Wishlist;





import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiX,  FiHeart, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import {Footer} from "../../components/layout/Footer";
import { wishlistApi } from "../../api/wishlistApi";
import { formatINR } from "../../utils/currency";
import { cartApi } from "../../api/cartApi";
import { productApi } from "../../api/productApi";
import { useAppDispatch } from "../../hooks/useAuth";
import { addToCart as addToCartRedux } from "../../store/slices/cartSlice";
import useAuth from "../../hooks/useAuth";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";
// Mock wishlist data - replace with actual API data
const IMAGE_BASE_URL =
  import.meta.env.VITE_API_IMG_URL || "http://localhost:8090";

const formatWishlistItems = (products: any[]) =>
  products.map((product: any) => ({
    id: product.id,
    name: product.name,
    category: product.category ?? "Uncategorized",
    originalPrice: product.price,
    discountedPrice: product.salePrice ?? product.price,
    discount: product.salePrice
      ? Math.round(
          ((product.price - product.salePrice) / product.price) * 100
        )
      : 0,
    image: product.images?.[0]
      ? `${IMAGE_BASE_URL}${product.images[0]}`
      : "/placeholder.jpg",
  }));


const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
const [activeProductId, setActiveProductId] = useState<number | null>(null);

const [sizes, setSizes] = useState<string[]>([]);
const [colors, setColors] = useState<string[]>([]);

const [selectedSize, setSelectedSize] = useState("");
const [selectedColor, setSelectedColor] = useState("");
const dispatch = useAppDispatch();
const { isAuthenticated } = useAuth();
const { removeWishlistId } = useWishlist();

const removeWishlistItemIfPresent = async (productId: number) => {
  const latestWishlist = await wishlistApi.getWishlist();
  const products = Array.isArray(latestWishlist?.products)
    ? latestWishlist.products
    : [];
  const existsInWishlist = products.some(
    (product) => Number(product.id) === Number(productId)
  );

  if (existsInWishlist) {
    await wishlistApi.toggleWishlist(productId);
  }
};


  // Remove item from wishlist
const handleRemoveItem = async (id: number) => {
  try {
    await removeWishlistItemIfPresent(id);
    removeWishlistId(Number(id));
    setWishlistItems((prev) =>
      prev.filter((item) => Number(item.id) !== Number(id))
    );
  } catch (error) {
    console.error("Failed to remove item from wishlist", error);
  }
};
const openAddToCartModal = async (productId: number) => {
  try {
    setActiveProductId(productId);
    setSelectedSize("");
    setSelectedColor("");

    // ðŸ”¥ USE YOUR API HERE
    const product = await productApi.getProductById(productId);

const backendSizes =
  product.attributes
    ?.filter((attr: any) => attr.type?.toUpperCase() === "SIZE")
    .map((attr: any) => attr.value) || [];

const backendColors =
  product.attributes
    ?.filter((attr: any) => attr.type?.toUpperCase() === "COLOR")
    .map((attr: any) => attr.value) || [];


    setSizes(backendSizes);
    setColors(backendColors);

    setShowVariantModal(true);
  } catch (error) {
    console.error("Failed to load product variants", error);
  }
};
const confirmAddToCart = async () => {
  if (!activeProductId || !selectedSize || !selectedColor) return;
  const productId = activeProductId;

  const product = wishlistItems.find((p) => Number(p.id) === Number(productId));
  if (!product) return;

  try {
    // 1ï¸âƒ£ BACKEND CART
 const response = await cartApi.addToCart({
  productId,
  quantity: 1,
  selectedSize,
  selectedColor,
});


 dispatch(
  addToCartRedux({
    itemId: Number(response?.itemId ?? response?.id ?? 0),
    productId: Number(response?.productId ?? productId),
    name: response?.name ?? response?.productName ?? product.name,
    price: Number(response?.price ?? response?.unitPrice ?? product.originalPrice ?? 0),
    salePrice:
      response?.salePrice != null
        ? Number(response.salePrice)
        : product.discountedPrice !== product.originalPrice
          ? Number(product.discountedPrice)
          : undefined,
    quantity: Number(response?.quantity ?? 1),
    selectedSize: response?.selectedSize ?? selectedSize,
    selectedColor: response?.selectedColor ?? selectedColor,
    image: response?.image ?? response?.productImage ?? product.image,
    stock: Number(response?.stock ?? 999),
  })
);

    // 3ï¸âƒ£ REMOVE FROM WISHLIST (BACKEND + UI)
    await removeWishlistItemIfPresent(productId);
    removeWishlistId(Number(productId));
    setWishlistItems((prev) =>
      prev.filter((item) => Number(item.id) !== Number(productId))
    );

    // 4ï¸âƒ£ RESET MODAL
    setShowVariantModal(false);
    setSelectedSize("");
    setSelectedColor("");
    setActiveProductId(null);

  } catch (error: unknown) {
    const candidate =
      error && typeof error === "object"
        ? (error as { status?: unknown; message?: unknown; error?: unknown })
        : null;
    const status = typeof candidate?.status === "number" ? candidate.status : undefined;
    const message =
      typeof candidate?.message === "string"
        ? candidate.message
        : typeof candidate?.error === "string"
          ? candidate.error
          : "";
    const normalized = message.toLowerCase();
    if (
      status === 409 ||
      normalized.includes("modified by another request") ||
      normalized.includes("stock")
    ) {
      toast.error("Stock changed. Please refresh products and try again.");
    } else {
      toast.error(message || "Failed to add to cart");
    }
    console.error("Failed to add to cart", error);
  }
};


  // Calculate total savings
  const totalSavings = wishlistItems.reduce((sum, item) => {
    return sum + (item.originalPrice - item.discountedPrice);
  }, 0);
useEffect(() => {
  // â›” STOP for guests â€” DO NOT call wishlist API
  if (!isAuthenticated) {
    setWishlistItems([]);
    setLoading(false);
    return;
  }

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const data = await wishlistApi.getWishlist();

      const formattedItems = formatWishlistItems(data.products || []);

      setWishlistItems(formattedItems);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  fetchWishlist();
}, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <FiChevronRight className="text-gray-400" size={16} />
            <span className="text-gray-900 font-medium">Wishlist</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header - Adjusted padding */}
        <div className="mb-6 pt-0"> {/* Removed top padding */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Wishlist
                <span className="ml-2 text-gray-600 font-normal">
                  {wishlistItems.length} items
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                {totalSavings > 0 && (
                  <span className="text-green-600 font-medium">
                    Total Savings: {formatINR(totalSavings)}
                  </span>
                )}
              </p>
            </div>
            {/* <div className="flex items-center space-x-4">
              {wishlistItems.length > 0 && (
                <button className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors">
                  Clear All
                </button>
              )}
            </div> */}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : wishlistItems.length > 0 ? (
          <>
            {/* Wishlist Grid - Changed to fewer columns to reduce width */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3"> {/* Changed from 5 to 6 columns, reduced gap */}
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300"
                >
                  {/* Image Container - Reduced height further */}
                  <div className="relative pt-[75%]"> {/* Reduced from 80% to 75% */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    
                    {/* Cancel Icon (Top Right) */}
                    <button
                     onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <FiX className="text-gray-700 text-xs" size={10} /> {/* Added size prop */}
                    </button>
                  </div>

                  {/* Product Info - Reduced padding further */}
                  <div className="p-2"> {/* Reduced from p-3 to p-2 */}
                    {/* Product Name - Smaller font and less margin */}
                    <h3 className="text-[10px] font-medium text-gray-900 mb-0.5 line-clamp-2"> {/* text-xs to text-[10px] */}
                      {item.name}
                    </h3>

                    {/* Price Section - More compact */}
                    <div className="mb-1.5"> {/* Reduced from mb-2 to mb-1.5 */}
                      <div className="flex items-center space-x-0.5"> {/* Reduced space further */}
                        <span className="text-xs font-bold text-gray-900"> {/* text-sm to text-xs */}
                          {formatINR(item.discountedPrice)}
                        </span>
                        <span className="text-[10px] text-gray-500 line-through"> {/* text-xs to text-[10px] */}
                          {formatINR(item.originalPrice)}
                        </span>
                      </div>
                      {item.discount > 0 && (
                        <div className="text-[10px] font-medium text-green-600"> {/* text-xs to text-[10px] */}
                          ({item.discount}% OFF)
                        </div>
                      )}
                    </div>

                    {/* ADD TO CART Button - Even smaller */}
                    <button
                     onClick={() => openAddToCartModal(item.id)}
                      className="w-full py-1 text-[10px] font-medium rounded border border-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center" /* py-1.5 to py-1, text-xs to text-[10px] */
                    >
                      <span>ADD TO CART</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty Wishlist Message (Hidden when items exist) */}
            <div className="hidden"></div>
          </>
        ) : (
          // Empty Wishlist State
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FiHeart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 max-w-md mb-8">
              Add items you like to your wishlist. Review them anytime and easily move them to the bag.
            </p>
            <Link
              to="/products"
              className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </main>
{showVariantModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-lg p-5 w-full max-w-sm">

      <h3 className="text-lg font-semibold mb-4">
        Select Size & Color
      </h3>

      {/* COLORS FROM BACKEND */}
      {colors.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Color</p>
          <div className="flex gap-2 flex-wrap">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-1 border rounded text-sm ${
                  selectedColor === color
                    ? "border-black bg-gray-100"
                    : "border-gray-300"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SIZES FROM BACKEND */}
      {sizes.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Size</p>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 border rounded text-sm ${
                  selectedSize === size
                    ? "border-black bg-gray-100"
                    : "border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowVariantModal(false)}
          className="px-4 py-2 border rounded text-sm"
        >
          Cancel
        </button>

        <button
          onClick={confirmAddToCart}
          disabled={!selectedSize || !selectedColor}
          className="px-4 py-2 bg-black text-white rounded text-sm disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
)}
      {/* Fixed Footer */}
      <Footer />

      {/* Custom Styles */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
      `}</style>
    </div>
  );
};

export default Wishlist;


// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FiX, FiShoppingCart, FiHeart, FiChevronRight, FiLock } from "react-icons/fi";
// import Navbar from "../../components/layout/Navbar";
// import { Footer } from "../../components/layout/Footer";
// import { wishlistApi } from "../../api/wishlistApi";
// import { cartApi } from "../../api/cartApi";
// import { productApi } from "../../api/productApi";
// import { useAppDispatch } from "../../hooks/useAuth";
// import { addToCart as addToCartRedux } from "../../store/slices/cartSlice";
// import useAuth from "../../hooks/useAuth";

// const IMAGE_BASE_URL = import.meta.env.VITE_API_IMG_URL || "http://localhost:8090";

// const Wishlist = () => {
//   const [wishlistItems, setWishlistItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showVariantModal, setShowVariantModal] = useState(false);
//   const [activeProductId, setActiveProductId] = useState<number | null>(null);
//   const [sizes, setSizes] = useState<string[]>([]);
//   const [colors, setColors] = useState<string[]>([]);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const dispatch = useAppDispatch();
//   const { isAuthenticated } = useAuth();

//   const handleRemoveItem = async (id: number) => {
//     try {
//       await wishlistApi.toggleWishlist(id);
//       setWishlistItems(prev => prev.filter(item => item.id !== id));
//     } catch (error) {
//       console.error("Failed to remove item from wishlist", error);
//     }
//   };

//   const openAddToCartModal = async (productId: number) => {
//     try {
//       setActiveProductId(productId);
//       setSelectedSize("");
//       setSelectedColor("");

//       const product = await productApi.getProductById(productId);
//       const backendSizes =
//         product.attributes
//           ?.filter((attr: any) => attr.type?.toUpperCase() === "SIZE")
//           .map((attr: any) => attr.value) || [];

//       const backendColors =
//         product.attributes
//           ?.filter((attr: any) => attr.type?.toUpperCase() === "COLOR")
//           .map((attr: any) => attr.value) || [];

//       setSizes(backendSizes);
//       setColors(backendColors);
//       setShowVariantModal(true);
//     } catch (error) {
//       console.error("Failed to load product variants", error);
//     }
//   };

//   const confirmAddToCart = async () => {
//     if (!activeProductId || !selectedSize || !selectedColor) return;

//     const product = wishlistItems.find(p => p.id === activeProductId);
//     if (!product) return;

//     try {
//       const response = await cartApi.addToCart({
//         productId: activeProductId,
//         quantity: 1,
//         selectedSize,
//         selectedColor,
//       });

//       dispatch(
//         addToCartRedux({
//           itemId: response.itemId,
//           productId: response.productId,
//           name: response.name,
//           price: response.price,
//           salePrice: response.salePrice,
//           quantity: response.quantity,
//           selectedSize: response.selectedSize,
//           selectedColor: response.selectedColor,
//           image: response.image,
//           stock: response.stock,
//         })
//       );

//       await wishlistApi.toggleWishlist(activeProductId);
//       setWishlistItems(prev =>
//         prev.filter(item => item.id !== activeProductId)
//       );

//       setShowVariantModal(false);
//       setSelectedSize("");
//       setSelectedColor("");
//       setActiveProductId(null);
//     } catch (error) {
//       console.error("Failed to add to cart", error);
//     }
//   };

//   const totalSavings = wishlistItems.reduce((sum, item) => {
//     return sum + (item.originalPrice - item.discountedPrice);
//   }, 0);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       setWishlistItems([]);
//       setLoading(false);
//       return;
//     }

//     const fetchWishlist = async () => {
//       try {
//         setLoading(true);
//         const data = await wishlistApi.getWishlist();

//         const formattedItems = data.products.map((product: any) => ({
//           id: product.id,
//           name: product.name,
//           category: product.category ?? "Uncategorized",
//           originalPrice: product.price,
//           discountedPrice: product.salePrice ?? product.price,
//           discount: product.salePrice
//             ? Math.round(
//                 ((product.price - product.salePrice) / product.price) * 100
//               )
//             : 0,
//           image: product.images?.[0]
//             ? `${IMAGE_BASE_URL}${product.images[0]}`
//             : "/placeholder.jpg",
//         }));

//         setWishlistItems(formattedItems);
//       } catch (error) {
//         console.error("Failed to fetch wishlist", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, [isAuthenticated]);

//   // Not logged in state
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Navbar />
        
//         {/* Breadcrumb */}
//         <div className="bg-white border-b border-gray-100">
//           <div className="container mx-auto px-4 py-3">
//             <nav className="flex items-center space-x-2 text-sm text-gray-600">
//               <Link to="/" className="hover:text-gray-900">
//                 Home
//               </Link>
//               <FiChevronRight size={14} />
//               <span className="text-gray-900">Wishlist</span>
//             </nav>
//           </div>
//         </div>

//         {/* Main Content - Simple guest view */}
//         <main className="flex-1 container mx-auto px-4 py-16">
//           <div className="max-w-md mx-auto text-center">
//             {/* Icon */}
//             <div className="w-24 h-24 mx-auto mb-6 bg-sage-100 rounded-full flex items-center justify-center">
//               <FiLock className="w-12 h-12 text-sage-600" />
//             </div>

//             {/* Header */}
//             <h1 className="text-2xl font-semibold text-gray-900 mb-3">
//               Please Log In
//             </h1>
            
//             <p className="text-gray-600 mb-8">
//               Login to view items in your wishlist.
//             </p>

//             {/* CTA Button */}
//             <Link
//   to="/login"
//   // className="inline-flex items-center justify-center px-8 py-3 bg-sage-600 text-dark-500 font-medium rounded-lg shadow-md hover:bg-sage-700 transition-colors"
//   className="inline-flex items-center justify-center px-8 py-3 bg-sage-600 text-dark-50 font-medium rounded-lg shadow-lg hover:bg-sage-700 hover:shadow-xl transition-all"
// >
//   Login to View Wishlist
// </Link>


//             {/* Divider */}
//             <div className="my-8 flex items-center">
//               <div className="flex-1 border-t border-gray-200"></div>
//               <span className="px-4 text-sm text-gray-500">or</span>
//               <div className="flex-1 border-t border-gray-200"></div>
//             </div>

//             {/* Continue Shopping */}
//             <Link
//               to="/products"
//               className="inline-block px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         </main>

//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Navbar />

//       {/* Breadcrumb */}
//       <div className="bg-white border-b border-gray-100">
//         <div className="container mx-auto px-4 py-3">
//           <nav className="flex items-center space-x-2 text-sm text-gray-600">
//             <Link to="/" className="hover:text-gray-900">
//               Home
//             </Link>
//             <FiChevronRight size={14} />
//             <span className="text-gray-900">Wishlist</span>
//           </nav>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 container mx-auto px-4 py-8">
//         {/* Page Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-900">
//                 My Wishlist
//                 <span className="ml-2 text-gray-600 text-lg">
//                   ({wishlistItems.length})
//                 </span>
//               </h1>
//               {totalSavings > 0 && (
//                 <p className="text-sage-600 font-medium mt-1">
//                   Total Savings: â‚¹{totalSavings.toLocaleString()}
//                 </p>
//               )}
//             </div>
            
//             {wishlistItems.length > 0 && (
//               <button
//                 onClick={() => setWishlistItems([])}
//                 className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 Clear All
//               </button>
//             )}
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sage-600"></div>
//           </div>
//         ) : wishlistItems.length > 0 ? (
//           <>
//             {/* Wishlist Grid - Simple & Clean */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {wishlistItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
//                 >
//                   {/* Image Container */}
//                   <div className="relative pt-[100%] bg-gray-100">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="absolute top-0 left-0 w-full h-full object-cover"
//                     />
                    
//                     {/* Discount Badge */}
//                     {item.discount > 0 && (
//                       <div className="absolute top-3 left-3 bg-sage-600 text-dark-500 text-xs font-medium px-2 py-1 rounded">
//                         {item.discount}% OFF
//                       </div>
//                     )}
                    
//                     {/* Remove Button */}
//                     <button
//                       onClick={() => handleRemoveItem(item.id)}
//                       className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-shadow"
//                     >
//                       <FiX className="text-gray-500 hover:text-gray-700" size={14} />
//                     </button>
//                   </div>

//                   {/* Product Info */}
//                   <div className="p-4">
//                     <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
//                       {item.name}
//                     </h3>

//                     {/* Price */}
//                     <div className="flex items-baseline gap-2 mb-4">
//                       <span className="text-lg font-semibold text-gray-900">
//                         â‚¹{item.discountedPrice.toLocaleString()}
//                       </span>
//                       {item.originalPrice > item.discountedPrice && (
//                         <span className="text-sm text-gray-500 line-through">
//                           â‚¹{item.originalPrice.toLocaleString()}
//                         </span>
//                       )}
//                     </div>

//                     {/* Action Button */}
//                     <button
//                       onClick={() => openAddToCartModal(item.id)}
//                       className="w-full py-2.5 bg-sage-600 text-dark-500 font-medium rounded-lg hover:bg-sage-700 transition-colors text-sm"
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Summary */}
//             {wishlistItems.length > 0 && (
//               <div className="mt-8 pt-6 border-t border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <div className="text-gray-600">
//                     {wishlistItems.length} items in wishlist
//                   </div>
//                   <Link
//                     to="/products"
//                     className="px-6 py-2.5 bg-gray-900 text-dark-500 font-medium rounded-lg hover:bg-gray-800 transition-colors"
//                   >
//                     Continue Shopping
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           // Empty Wishlist State
//           <div className="flex flex-col items-center justify-center py-20 text-center">
//             <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mb-6">
//               <FiHeart className="w-10 h-10 text-sage-600" />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-3">
//               Your wishlist is empty
//             </h2>
//             <p className="text-gray-600 max-w-md mb-8">
//               Save items you love to your wishlist. Review them anytime and easily move them to cart.
//             </p>
//             <Link
//               to="/products"
//               className="px-8 py-3 bg-sage-600 text-dark-500 font-medium rounded-lg hover:bg-sage-700 transition-colors"
//             >
//               Start Shopping
//             </Link>
//           </div>
//         )}
//       </main>

//       {/* Variant Modal */}
//       {showVariantModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-sm">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Select Options
//             </h3>

//             {/* Colors */}
//             {colors.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
//                 <div className="flex flex-wrap gap-2">
//                   {colors.map(color => (
//                     <button
//                       key={color}
//                       onClick={() => setSelectedColor(color)}
//                       className={`px-3 py-1.5 text-sm rounded border ${
//                         selectedColor === color
//                           ? "border-sage-600 bg-sage-50 text-sage-700"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       {color}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Sizes */}
//             {sizes.length > 0 && (
//               <div className="mb-6">
//                 <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
//                 <div className="flex flex-wrap gap-2">
//                   {sizes.map(size => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`px-3 py-1.5 text-sm rounded border ${
//                         selectedSize === size
//                           ? "border-gray-900 bg-gray-900 text-dark-500"
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Actions */}
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowVariantModal(false)}
//                 className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmAddToCart}
//                 disabled={!selectedSize || !selectedColor}
//                 className={`flex-1 py-2.5 rounded-lg transition-colors ${
//                   selectedSize && selectedColor
//                     ? "bg-sage-600 text-dark-500 hover:bg-sage-700"
//                     : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Footer />

//       <style>{`
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Wishlist;
