// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { FiShoppingCart, FiHeart } from 'react-icons/fi';
// import type { Product } from '../../types';
// import { useAppDispatch } from '../../hooks/useAuth';
// import { addToCart } from '../../store/slices/cartSlice';
// import toast from 'react-hot-toast';

// interface ProductCardProps {
//   product: Product;
// }

// const ProductCard = ({ product }: ProductCardProps) => {
//   const dispatch = useAppDispatch();

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (product.stock === 0) {
//       toast.error('Product is out of stock');
//       return;
//     }

//     dispatch(
//       addToCart({
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         salePrice: product.salePrice,
//         quantity: 1,
//         image: product.images[0] || '/placeholder.jpg',
//         stock: product.stock,
//       })
//     );
//     toast.success('Added to cart!');
//   };

//   const discount = product.salePrice
//     ? Math.round(((product.price - product.salePrice) / product.price) * 100)
//     : 0;

//   return (
//     <Link to={`/products/${product.id}`}>
//       <motion.div
//         whileHover={{ y: -8 }}
//         className="glass-card-hover rounded-2xl overflow-hidden group cursor-pointer"
//       >
//         {/* Image Container */}
//         <div className="relative aspect-[3/4] overflow-hidden bg-dark-900">
//           <img
//             src={product.images[0] || '/placeholder.jpg'}
//             alt={product.name}
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//           />

//           {/* Overlay Actions */}
//           <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="p-3 glass-card rounded-xl hover:bg-white/20 transition-colors"
//               >
//                 <FiHeart size={20} />
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleAddToCart}
//                 disabled={product.stock === 0}
//                 className="flex items-center space-x-2 px-4 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FiShoppingCart size={18} />
//                 <span className="text-sm font-semibold">Add to Cart</span>
//               </motion.button>
//             </div>
//           </div>

//           {/* Badges */}
//           <div className="absolute top-4 left-4 flex flex-col gap-2">
//             {discount > 0 && (
//               <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
//                 -{discount}%
//               </span>
//             )}
//             {product.stock === 0 && (
//               <span className="px-3 py-1 bg-dark-800 text-dark-300 text-xs font-bold rounded-lg">
//                 Out of Stock
//               </span>
//             )}
//             {product.stock > 0 && product.stock <= 5 && (
//               <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg">
//                 Low Stock
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4 space-y-2">
//           {/* Category */}
//           <div className="text-xs text-primary-400 font-semibold uppercase tracking-wider">
//             {product.category}
//           </div>

//           {/* Title */}
//           <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-primary-400 transition-colors">
//             {product.name}
//           </h3>

//           {/* Description */}
//           <p className="text-sm text-dark-400 line-clamp-2">{product.description}</p>

//           {/* Price */}
//           <div className="flex items-center space-x-2 pt-2">
//             {product.salePrice ? (
//               <>
//                 <span className="text-xl font-bold gradient-text">
//                   ${product.salePrice.toFixed(2)}
//                 </span>
//                 <span className="text-sm text-dark-500 line-through">
//                   ${product.price.toFixed(2)}
//                 </span>
//               </>
//             ) : (
//               <span className="text-xl font-bold gradient-text">
//                 ${product.price.toFixed(2)}
//               </span>
//             )}
//           </div>

//           {/* Attributes */}
//           {product.attributes && product.attributes.length > 0 && (
//             <div className="flex flex-wrap gap-2 pt-2">
//               {product.attributes.slice(0, 3).map((attr, index) => (
//                 <span
//                   key={index}
//                   className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg"
//                 >
//                   {attr.value}
//                 </span>
//               ))}
//               {product.attributes.length > 3 && (
//                 <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg">
//                   +{product.attributes.length - 3}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </Link>
//   );
// };

// export default ProductCard;


// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { FiShoppingCart, FiHeart } from 'react-icons/fi';
// import type { Product } from '../../types';
// import { useAppDispatch } from '../../hooks/useAuth';
// import { addToCart } from '../../store/slices/cartSlice';
// import toast from 'react-hot-toast';
// import { formatINR } from "../../utils/currency";

// // --- CONFIGURATION ---
// // In production, this should come from import.meta.env.VITE_API_URL
// // We strip '/api' if your env var includes it, or just define the server root.
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://localhost:8090';

// interface ProductCardProps {
//   product: Product;
// }

// const ProductCard = ({ product }: ProductCardProps) => {
//   const dispatch = useAppDispatch();

//   // --- HELPER: Resolve Image URL ---
//   const getImageUrl = (path?: string) => {
//     if (!path) return "/placeholder.jpg";

//     // If it's already a full URL (external image), return it
//     if (path.startsWith("http") || path.startsWith("blob:")) {
//       return path;
//     }

//     // Otherwise, prepend the Backend Server URL
//     // Ensure we don't have double slashes
//     const cleanPath = path.startsWith("/") ? path : `/${path}`;
//     return `${SERVER_URL}${cleanPath}`;
//   };

//   const displayImage = getImageUrl(product.images[0]);

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (product.stock === 0) {
//       toast.error("Product is out of stock");
//       return;
//     }

//     dispatch(
//       addToCart({
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         salePrice: product.salePrice,
//         quantity: 1,
//         image: displayImage, // 👈 Use the processed URL here
//         stock: product.stock,
//       })
//     );
//     toast.success("Added to cart!");
//   };

//   const discount = product.salePrice
//     ? Math.round(((product.price - product.salePrice) / product.price) * 100)
//     : 0;

//   return (
//     <Link to={`/products/${product.id}`}>
//       <motion.div
//         whileHover={{ y: -8 }}
//         className="glass-card-hover rounded-2xl overflow-hidden group cursor-pointer"
//       >
//         {/* Image Container */}
//         <div className="relative aspect-[3/4] overflow-hidden bg-dark-900">
//           <img
//             src={displayImage} // 👈 Updated Source
//             alt={product.name}
//             loading="lazy" // Optimization for lists
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//           />

//           {/* Overlay Actions */}
//           <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="p-3 glass-card rounded-xl hover:bg-white/20 transition-colors"
//               >
//                 <FiHeart size={20} />
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={handleAddToCart}
//                 disabled={product.stock === 0}
//                 className="flex items-center space-x-2 px-4 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FiShoppingCart size={18} />
//                 <span className="text-sm font-semibold">Add to Cart</span>
//               </motion.button>
//             </div>
//           </div>

//           {/* Badges */}
//           <div className="absolute top-4 left-4 flex flex-col gap-2">
//             {discount > 0 && (
//               <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
//                 -{discount}%
//               </span>
//             )}
//             {product.stock === 0 && (
//               <span className="px-3 py-1 bg-dark-800 text-dark-300 text-xs font-bold rounded-lg">
//                 Out of Stock
//               </span>
//             )}
//             {product.stock > 0 && product.stock <= 5 && (
//               <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg">
//                 Low Stock
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4 space-y-2">
//           {/* Category */}
//           <div className="text-xs text-primary-400 font-semibold uppercase tracking-wider">
//             {product.category}
//           </div>

//           {/* Title */}
//           <h3 className="text-lg font-semibold text-foreground line-clamp-1 hover:text-sage transition-colors">
//             {product.name}
//           </h3>

//           {/* Description */}
//           <p className="text-sm text-dark-400 line-clamp-2">
//             {product.description}
//           </p>

//           {/* Price */}
//           <div className="flex items-center space-x-2 pt-2">
//             {product.salePrice ? (
//               <>
//                 <span className="text-xl font-bold gradient-text">
//   {formatINR(product.salePrice)}
// </span>
// <span className="text-sm text-dark-500 line-through">
//   {formatINR(product.price)}
// </span>

//               </>
//             ) : (
//               <span className="text-xl font-bold gradient-text">
//   {formatINR(product.price)}
// </span>

//             )}
//           </div>

//           {/* Attributes */}
//           {product.attributes && product.attributes.length > 0 && (
//             <div className="flex flex-wrap gap-2 pt-2">
//               {product.attributes.slice(0, 3).map((attr, index) => (
//                 <span
//                   key={index}
//                   className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg"
//                 >
//                   {attr.value}
//                 </span>
//               ))}
//               {product.attributes.length > 3 && (
//                 <span className="px-2 py-1 bg-dark-800 text-dark-300 text-xs rounded-lg">
//                   +{product.attributes.length - 3}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </Link>
//   );
// };

// export default ProductCard;


import { useState, useEffect, useRef } from 'react';
import { FiHeart } from 'react-icons/fi';
import type { Product } from '../../types';
import { formatINR } from "../../utils/currency";
import { useNavigate } from "react-router-dom";
// import { wishlistApi } from "../../api/wishlistApi";
import { useWishlist } from "../../context/WishlistContext";
import useAuth from "../../hooks/useAuth";
import { toast } from 'sonner';

// --- CONFIGURATION ---
const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://localhost:8090';

interface ProductCardProps {
  product: Product;
  compact?: boolean;   // 👈 ADD THIS LINE
  className?: string;
  //  isWishlisted: boolean;
  // onWishlistToggle: (productId: number, added: boolean) => void;
}

const ProductCard = ({ product }: ProductCardProps) => {

  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const slideshowIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
const navigate = useNavigate();
const { wishlistIds, toggleWishlist } = useWishlist();
const isWishlisted = wishlistIds.includes(product.id);

// example: token-based auth
const { isAuthenticated } = useAuth();

  // --- HELPER: Resolve Image URL ---
  const getImageUrl = (path?: string) => {
    if (!path) return "/placeholder.jpg";

    // If it's already a full URL (external image), return it
    if (path.startsWith("http") || path.startsWith("blob:")) {
      return path;
    }

    // Otherwise, prepend the Backend Server URL
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${SERVER_URL}${cleanPath}`;
  };
const handleWishlistClick = async (
  e: React.MouseEvent<HTMLButtonElement>
) => {
  e.preventDefault();
  e.stopPropagation();

  if (!isAuthenticated) {
    toast.error("Please login to use wishlist");
    navigate("/login");
    return;
  }

  try {
    await toggleWishlist(product.id);
  } catch (error) {
    console.error("Wishlist toggle failed", error);
  }
};


  const images = product.images?.map(getImageUrl) || [getImageUrl()];
  const displayImage = images[currentImageIndex];

  // Image slideshow on hover with 2-second delay
  useEffect(() => {
    // Clear any existing interval
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
      slideshowIntervalRef.current = null;
    }

    // If hovered and multiple images exist
    if (isHovered && images.length > 1) {
      // Set up new interval with 2-second delay
      slideshowIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 2000); // 2 seconds = 2000 milliseconds
    } else {
      // Reset to first image when not hovered
      setCurrentImageIndex(0);
    }

    // Cleanup on unmount
    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    };
  }, [isHovered, images.length]);

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

 // Get ALL sizes first
const allSizes =
  product.attributes
    ?.filter(attr => attr?.type?.toLowerCase() === "size")
    .map(attr => attr.value)
    .filter(Boolean) || [];

// Show only first 4
const visibleSizes = allSizes.slice(0, 4);

// Remaining size count
const remainingSizes = allSizes.length - visibleSizes.length;


  return (
    // <Link to={`/products/${product.id}`}>
    <div
  onClick={() => navigate(`/products/${product.id}`)}
  className="relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer"
>
      <div 
        className="relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            -{discount}%
          </div>
        )}

        {/* Image Container with Slideshow */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Current Image */}
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          
          {/* Image Counter (only show when multiple images exist) */}
          {images.length > 1 && isHovered && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
              {currentImageIndex + 1}/{images.length}
            </div>
          )}
          
          {/* Wishlist Button - Top Right */}
          <button
  onClick={handleWishlistClick}
  className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm z-10"
>
  <FiHeart size={18} className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"} />
</button>


          {/* Out of Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute top-12 left-3 px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-full">
              Out of Stock
            </div>
          )}

          {/* Low Stock Badge */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-12 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
              Low Stock
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-2 min-h-[88px] relative">
          
          {/* Content container */}
          <div className="h-full">
            {/* NORMAL STATE - Category, Product Name, Price */}
            <div 
              className={`h-full transition-all duration-200 ${
                isHovered ? 'opacity-0 invisible absolute' : 'opacity-100 visible'
              }`}
              style={{ top: 0, left: 0, right: 0 }}
            >
              {/* Category */}
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-0">
                {product.category || 'CATEGORY'}
              </div>

              {/* Product Name */}
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mt-0.5 mb-0.5">
                {product.name}
              </h3>

              {/* Price */}
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm font-bold text-gray-900">
                  {formatINR(product.salePrice || product.price)}
                </span>
                {product.salePrice && (
                  <>
                    <span className="text-xs text-gray-400 line-through">
                      {formatINR(product.price)}
                    </span>
                    <span className="text-xs text-red-500 font-semibold">({discount}% OFF)</span>
                  </>
                )}
              </div>
            </div>

            {/* HOVER STATE - Sizes and Price (without OFF) */}
            <div 
              className={`h-full transition-all duration-200 ${
                isHovered ? 'opacity-100 visible' : 'opacity-0 invisible absolute'
              }`}
              style={{ top: 0, left: 0, right: 0 }}
            >
              {/* Size Options */}
              <div className="flex flex-wrap justify-center gap-1">
  {visibleSizes.length > 0 ? (
    <>
      {visibleSizes.map((size, index) => (
        <button
          key={index}
          className="px-1.5 py-0.5 text-xs border border-gray-300 text-gray-800 rounded hover:border-gray-900 hover:bg-gray-50 transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {size}
        </button>
      ))}

      {/* +N Indicator */}
      {remainingSizes > 0 && (
        <button
          className="px-1.5 py-0.5 text-xs border border-gray-300 text-gray-600 rounded bg-gray-100 cursor-default"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          +{remainingSizes}
        </button>
      )}
    </>
  ) : (
    ["S", "M", "L", "XL"].map((size, index) => (
      <button
        key={index}
        className="px-1.5 py-0.5 text-xs border border-gray-300 text-gray-800 rounded"
      >
        {size}
      </button>
    ))
  )}
</div>
              {/* Price on hover */}
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-sm font-bold text-gray-900">
                  {formatINR(product.salePrice || product.price)}
                </span>
                {product.salePrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatINR(product.price)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    {/* </Link> */}
    </div>
  );
};

export default ProductCard;