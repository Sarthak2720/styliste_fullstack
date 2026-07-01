// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';
// import Navbar from '../../components/layout/Navbar';
// import { Footer } from '../../components/layout/Footer';
// import { productApi } from '../../api/productApi';
// import type { Product } from '../../types';
// import { useAppDispatch } from '../../hooks/useAuth';
// import { addToCart } from '../../store/slices/cartSlice';
// import toast from 'react-hot-toast';

// // ----------------------------------------------------------------------
// // 1. HELPER: Fix Image URLs
// // ----------------------------------------------------------------------
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL ;
//   const getImageUrl = (path?: string) => {
//     if (!path) return '/placeholder.jpg';
//     if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('https://')) return path; // Already absolute or local blob
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };


// const ProductDetailPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedColor, setSelectedColor] = useState('');

//   useEffect(() => {
//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const data = await productApi.getProductById(Number(id));
//       setProduct(data);

//       // Auto-select first available options
//       const sizes = data.attributes.filter((a) => a.type === 'Size');
//       const colors = data.attributes.filter((a) => a.type === 'Color');
//       if (sizes.length > 0) setSelectedSize(sizes[0].value);
//       if (colors.length > 0) setSelectedColor(colors[0].value);
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to fetch product');
//       navigate('/products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!product) return;

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
//         quantity,
//         selectedSize,
//         selectedColor,
//         image: product.images[0],
//         stock: product.stock,
//       })
//     );
//     toast.success('Added to cart!');
//   };

//   const handleBuyNow = () => {
//     handleAddToCart();
//     navigate('/cart');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background text-foreground">
//         <Navbar />
//         <div className="pt-24 px-4 sm:px-6 lg:px-8  mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="glass-card rounded-2xl h-96 shimmer" />
//             <div className="space-y-4">
//               <div className="glass-card rounded-2xl h-8 w-3/4 shimmer" />
//               <div className="glass-card rounded-2xl h-6 w-1/2 shimmer" />
//               <div className="glass-card rounded-2xl h-32 shimmer" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) return null;

//   const discount = product.salePrice
//     ? Math.round(((product.price - product.salePrice) / product.price) * 100)
//     : 0;

//   const sizes = product.attributes.filter((a) => a.type === 'Size');
//   const colors = product.attributes.filter((a) => a.type === 'Color');

//   return (
//     <div className="min-h-screen bg-background text-foreground">

//       <Navbar />

//       <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 mx-auto">
//         {/* Back Button */}
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => navigate('/products')}
//           className="flex items-center space-x-2 text-muted-foreground hover:text-sage transition-colors"
//         >
//           <FiArrowLeft />
//           <span>Back to Products</span>
//         </motion.button>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//           {/* Images */}
//           <div className="space-y-4">
//             {/* Main Image */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="aspect-square rounded-2xl overflow-hidden glass-card"
//             >
//               <img
//                 src={getImageUrl(product.images[selectedImage])}
//                 alt={product.name}
//                 className="w-full h-full object-cover"
//               />
//             </motion.div>

//             {/* Thumbnails */}
//             {product.images.length > 1 && (
//               <div className="grid grid-cols-4 gap-4">
//                 {product.images.map((image, index) => (
//                   <motion.button
//                     key={index}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setSelectedImage(index)}
//                     className={`aspect-square rounded-xl overflow-hidden ${
//                       selectedImage === index
//                         ? 'ring-2 ring-primary-500'
//                         : 'glass-card'
//                     }`}
//                   >
//                     <img 
//                         // âœ… Fix: Use helper here
//                         src={getImageUrl(image)} 
//                         alt={`${product.name} ${index + 1}`} 
//                         className="w-full h-full object-cover" 
//                     />
//                   </motion.button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Info */}
//           <div className="space-y-6">
//             {/* Category & Stock */}
//             <div className="flex items-center justify-between">
//              <span className="text-sm font-semibold text-sage uppercase tracking-wider">
//                 {product.category}
//               </span>
//               <span
//                 className={`px-3 py-1 rounded-lg text-xs font-semibold ${
//                   product.stock > 0
//                     ? 'bg-green-500/20 text-green-400'
//                     : 'bg-red-500/20 text-red-400'
//                 }`}
//               >
//                 {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
//               </span>
//             </div>

//             {/* Title */}
//             <h1 className="text-4xl font-display font-bold text-foreground">{product.name}</h1>

//             {/* Price */}
//             <div className="flex items-center space-x-4">
//               {product.salePrice ? (
//                 <>
//                   <span className="text-4xl font-bold gradient-text">
//                     ${product.salePrice.toFixed(2)}
//                   </span>
//                   <span className="text-2xl text-muted-foreground line-through">
//                     ${product.price.toFixed(2)}
//                   </span>
//                   <span className="px-3 py-1 bg-red-500 text-foreground text-sm font-bold rounded-lg">
//                     Save {discount}%
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-4xl font-bold gradient-text">
//                   ${product.price.toFixed(2)}
//                 </span>
//               )}
//             </div>

//             {/* Description */}
//            <p className="text-muted-foreground leading-relaxed">
// {product.description}</p>

//             {/* Size Selection */}
//             {sizes.length > 0 && (
//               <div>
//                 <label className="text-sm font-semibold text-muted-foreground mb-3 block">
//                   Size: {selectedSize}
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {sizes.map((size) => (
//                     <motion.button
//                       key={size.value}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setSelectedSize(size.value)}
//                       className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
//                         selectedSize === size.value
//                           ? 'bg-primary-500 text-foreground'
//                           : 'glass-card hover:bg-accent/20'
//                       }`}
//                     >
//                       {size.value}
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Color Selection */}
//             {colors.length > 0 && (
//               <div>
//                 <label className="text-sm font-semibold text-sage mb-3 block">
//                   Color: {selectedColor}
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {colors.map((color) => (
//                     <motion.button
//                       key={color.value}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setSelectedColor(color.value)}
//                       className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
//                         selectedColor === color.value
//                           ? 'bg-primary-500 text-foreground'
//                           : 'glass-card hover:bg-accent/20'
//                       }`}
//                     >
//                       {color.value}
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quantity */}
//             <div>
//               <label className="text-sm font-semibold text-sage">
//                 Quantity
//               </label>
//               <div className="flex items-center space-x-3">
//                 <motion.button
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="w-10 h-10 flex items-center justify-center glass-card rounded-xl font-bold text-lg text-foreground hover:bg-accent/20 text-foreground hover:bg-accent/20 text-foreground hover:bg-accent/20"
//                 >
//                   -
//                 </motion.button>
//                 <span className="w-16 text-center text-xl font-bold text-foreground">{quantity}</span>
//                 <motion.button
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                   className="w-10 h-10 flex items-center justify-center glass-card rounded-xl font-bold text-lg text-foreground hover:bg-accent/20 text-foreground hover:bg-accent/20 text-foreground hover:bg-accent/20"
//                 >
//                   +
//                 </motion.button>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleAddToCart}
//                 disabled={product.stock === 0}
//                 className="flex-1 btn-ghost flex items-center justify-center space-x-2 disabled:opacity-50"
//               >
//                 <FiShoppingCart />
//                 <span>Add to Cart</span>
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleBuyNow}
//                 disabled={product.stock === 0}
//                 className="flex-1 btn-primary disabled:opacity-50"
//               >
//                 Buy Now
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="p-4 glass-card rounded-xl hover:bg-white/10"
//               >
//                 <FiHeart size={24} />
//               </motion.button>
//             </div>

//             {/* Features */}
//             <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
//               <div className="flex items-center space-x-3">
//                 <FiTruck className="text-primary-400" size={24} />
//                 <div>
//                   <div className="font-semibold text-foreground">Free Shipping</div>
//                   <div className="text-xs text-muted-foreground">On orders over $50</div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <FiShield className="text-primary-400" size={24} />
//                 <div>
//                   <div className="font-semibold text-foreground">Secure Payment</div>
//                   <div className="text-xs text-muted-foreground">100% Protected</div>
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

// export default ProductDetailPage;


// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiArrowLeft, FiStar } from 'react-icons/fi';
// import { FaFacebookF, FaTwitter, FaPinterestP } from 'react-icons/fa';
// import Navbar from '../../components/layout/Navbar';
// import { Footer } from '../../components/layout/Footer';
// import { productApi } from '../../api/productApi';
// import type { Product } from '../../types';
// import { useAppDispatch } from '../../hooks/useAuth';
// import { addToCart } from '../../store/slices/cartSlice';
// import toast from 'react-hot-toast';
// import { wishlistApi } from "../../api/wishlistApi";

// // ----------------------------------------------------------------------
// // 1. HELPER: Fix Image URLs
// // ----------------------------------------------------------------------
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL;
// const getImageUrl = (path?: string) => {
//   if (!path) return '/placeholder.jpg';
//   if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('https://')) return path;
//   return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
// };

// const ProductDetailPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedColor, setSelectedColor] = useState('');
//   const [isWishlisted, setIsWishlisted] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const data = await productApi.getProductById(Number(id));
//       setProduct(data);

//       // Auto-select first available options
//       const sizes = data.attributes.filter((a) => a.type === 'Size');
//       const colors = data.attributes.filter((a) => a.type === 'Color');
//       if (sizes.length > 0) setSelectedSize(sizes[0].value);
//       if (colors.length > 0) setSelectedColor(colors[0].value);
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to fetch product');
//       navigate('/products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!product) return;

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
//         quantity,
//         selectedSize,
//         selectedColor,
//         image: product.images[0],
//         stock: product.stock,
//         itemId: 0
//       })
//     );
//     toast.success('Added to cart!');
//   };

//   const handleBuyNow = () => {
//     handleAddToCart();
//     navigate('/cart');
//   };

//   // Clear selection function
//   const handleClearSelection = () => {
//     const sizes = product?.attributes.filter((a) => a.type === 'Size') || [];
//     const colors = product?.attributes.filter((a) => a.type === 'Color') || [];
//     if (sizes.length > 0) setSelectedSize(sizes[0].value);
//     if (colors.length > 0) setSelectedColor(colors[0].value);
//     setQuantity(1);
//     toast.success('Selection cleared!');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background text-foreground">
//         <Navbar />
//         <div className=" sm:px-6 lg:px-8 mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="glass-card rounded-2xl h-96 shimmer" />
//             <div className="space-y-4">
//               <div className="glass-card rounded-2xl h-8 w-3/4 shimmer" />
//               <div className="glass-card rounded-2xl h-6 w-1/2 shimmer" />
//               <div className="glass-card rounded-2xl h-32 shimmer" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) return null;

//   const discount = product.salePrice
//     ? Math.round(((product.price - product.salePrice) / product.price) * 100)
//     : 0;

//   const sizes = product.attributes.filter((a) => a.type === 'Size');
//   const colors = product.attributes.filter((a) => a.type === 'Color');

//   // Mock review data from the image
//   const reviewData = {
//     rating: 4.8,
//     reviewCount: 245,
//     stars: 5
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <Navbar />

//       <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
//         {/* Back Button - Smaller */}
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => navigate(-1)}
//           className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-sage transition-colors mb-4"
//         >
//           <FiArrowLeft className="w-4 h-4" />
//           <span>Back to Products</span>
//         </motion.button>

//         {/* Breadcrumb - Smaller */}
//         <div className="mb-4 text-xs text-muted-foreground">
//           <button 
//             onClick={() => navigate('/')}
//             className="hover:text-sage cursor-pointer"
//           >
//             Home
//           </button>
//           <span className="mx-1">/</span>
//           <button 
//             onClick={() => navigate('/products')}
//             className="hover:text-sage cursor-pointer"
//           >
//             Products
//           </button>
//           <span className="mx-1">/</span>
//           <span className="text-foreground font-medium">{product.name}</span>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Images - Smaller */}
//           <div className="space-y-3">
//             {/* Main Image - Reduced size */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="aspect-square rounded-xl overflow-hidden glass-card p-3"
//             >
//               <img
//                 src={getImageUrl(product.images[selectedImage])}
//                 alt={product.name}
//                 className="w-full h-full object-contain"
//               />
//             </motion.div>

//             {/* Thumbnails - Smaller */}
//             {product.images.length > 1 && (
//               <div className="grid grid-cols-5 gap-2">
//                 {product.images.map((image, index) => (
//                   <motion.button
//                     key={index}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setSelectedImage(index)}
//                     className={`aspect-square rounded-lg overflow-hidden border ${
//                       selectedImage === index
//                         ? 'border-sage ring-1 ring-sage'
//                         : 'border-transparent'
//                     }`}
//                   >
//                     <img
//                       src={getImageUrl(image)}
//                       alt={`${product.name} ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </motion.button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right Column - Product Info - Smaller */}
//           <div className="space-y-4">
//             {/* Category */}
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-semibold text-sage uppercase tracking-wider">
//                 {product.category}
//               </span>
//               <span
//                 className={`px-2 py-1 rounded text-xs font-semibold ${
//                   product.stock > 0
//                     ? 'bg-green-500/20 text-green-400'
//                     : 'bg-red-500/20 text-red-400'
//                 }`}
//               >
//                 {product.stock > 0 ? `In Stock` : 'Out of stock'}
//               </span>
//             </div>

//             {/* Title - Smaller */}
//             <h1 className="text-2xl font-display font-bold text-foreground">
//               {product.name}
//             </h1>

//             {/* Rating - Smaller */}
//             <div className="flex items-center space-x-1">
//               <div className="flex items-center">
//                 {[...Array(reviewData.stars)].map((_, i) => (
//                   <FiStar
//                     key={i}
//                     className={`w-3 h-3 ${
//                       i < Math.floor(reviewData.rating)
//                         ? 'text-yellow-500 fill-yellow-500'
//                         : 'text-gray-300'
//                     }`}
//                   />
//                 ))}
//               </div>
//               <span className="text-xs font-semibold text-foreground">
//                 {reviewData.rating}
//               </span>
//               <span className="text-xs text-muted-foreground">
//                 ({reviewData.reviewCount} Reviews)
//               </span>
//             </div>

//             {/* Price - Smaller */}
//             <div className="flex items-center space-x-3">
//               {product.salePrice ? (
//                 <>
//                   <span className="text-2xl font-bold text-foreground">
//                     ${product.salePrice.toFixed(2)}
//                   </span>
//                   <span className="text-lg text-muted-foreground line-through">
//                     ${product.price.toFixed(2)}
//                   </span>
//                   <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
//                     -{discount}%
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-2xl font-bold text-foreground">
//                   ${product.price.toFixed(2)}
//                 </span>
//               )}
//             </div>

//             {/* Description - Smaller */}
//             <p className="text-sm text-muted-foreground leading-relaxed border-b border-border pb-4">
//               {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
//             </p>

//             {/* Color Selection - Smaller */}
//             {colors.length > 0 && (
//               <div>
//                 <label className="text-xs font-semibold text-muted-foreground mb-2 block">
//                   Color: <span className="text-foreground font-bold">{selectedColor}</span>
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {colors.map((color) => (
//                     <motion.button
//                       key={color.value}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setSelectedColor(color.value)}
//                       className={`w-8 h-8 rounded-full border ${
//                         selectedColor === color.value
//                           ? 'border-sage ring-1 ring-sage/30 bg-sage/10'
//                           : 'border-border'
//                       }`}
//                       style={{
//                         backgroundColor: color.value.toLowerCase() === 'brown' ? '#8B4513' :
//                                         color.value.toLowerCase() === 'black' ? '#000000' :
//                                         color.value.toLowerCase() === 'blue' ? '#0000FF' :
//                                         color.value.toLowerCase() === 'white' ? '#FFFFFF' : '#F3F4F6',
//                       }}
//                       title={color.value}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Size Selection - Smaller */}
//             {sizes.length > 0 && (
//               <div>
//                 <label className="text-xs font-semibold text-muted-foreground mb-2 block">
//                   Size: <span className="text-foreground font-bold">{selectedSize}</span>
//                 </label>
//                 <div className="flex flex-wrap items-center gap-2">
//                   {sizes.map((size) => (
//                     <motion.button
//                       key={size.value}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setSelectedSize(size.value)}
//                       className={`px-3 py-1.5 text-sm rounded font-medium transition-all ${
//                         selectedSize === size.value
//                           ? 'bg-sage text-white'
//                           : 'glass-card hover:bg-accent/20 text-foreground'
//                       }`}
//                     >
//                       {size.value}
//                     </motion.button>
//                   ))}
//                   <button className="text-xs text-sage hover:underline font-medium">
//                     View Size Guide
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* SKU and Clear */}
//             <div className="flex items-center justify-between text-xs text-muted-foreground">
//               <span>SKU: <span className="font-semibold text-foreground">GHT95245AAA</span></span>
//               <button 
//                 onClick={handleClearSelection}
//                 className="text-red-400 hover:text-red-500 font-medium"
//               >
//                 Clear
//               </button>
//             </div>

//             {/* Quantity and Actions - Smaller */}
//             <div className="space-y-3">
//               <div>
//                 <label className="text-xs font-semibold text-sage mb-1 block">
//                   Quantity
//                 </label>
//                 <div className="flex items-center space-x-3">
//                   <div className="flex items-center space-x-2">
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="w-8 h-8 flex items-center justify-center glass-card rounded-lg font-bold text-base hover:bg-accent/20"
//                     >
//                       -
//                     </motion.button>
//                     <span className="w-10 text-center text-lg font-bold text-foreground">{quantity}</span>
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                       className="w-8 h-8 flex items-center justify-center glass-card rounded-lg font-bold text-base hover:bg-accent/20"
//                     >
//                       +
//                     </motion.button>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons - Smaller */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleAddToCart}
//                   disabled={product.stock === 0}
//                   className="col-span-2 btn-ghost flex items-center justify-center space-x-1 disabled:opacity-50 h-11 text-sm"
//                 >
//                   <FiShoppingCart className="w-4 h-4" />
//                   <span>Add to Cart</span>
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleBuyNow}
//                   disabled={product.stock === 0}
//                   className="btn-primary disabled:opacity-50 h-11 text-sm"
//                 >
//                   Buy Now
//                 </motion.button>
//               </div>

//               {/* Wishlist Button - Smaller */}
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full flex items-center justify-center space-x-1 py-2 text-sm glass-card rounded-lg hover:bg-accent/10"
//               >
//                 <FiHeart className="w-4 h-4" />
//                 <span className="font-medium">Add to Wishlist</span>
//               </motion.button>
//             </div>

//             {/* Tags and Share - Smaller */}
//             <div className="pt-4 border-t border-border space-y-3">
//               {/* Tags */}
//               <div>
//                 <span className="text-xs font-semibold text-muted-foreground">Tags: </span>
//                 <div className="flex flex-wrap gap-1.5 mt-1">
//                   {['Women', 'Coat', 'Fashion', 'Jacket'].map((tag) => (
//                     <span
//                       key={tag}
//                       className="px-2 py-0.5 text-xs glass-card rounded-full hover:bg-accent/20 cursor-pointer"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Share - Smaller */}
//               <div className="flex items-center space-x-3">
//                 <span className="text-xs font-semibold text-muted-foreground">Share:</span>
//                 <div className="flex space-x-2">
//                   <button className="w-7 h-7 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-90">
//                     <FaFacebookF className="w-3 h-3" />
//                   </button>
//                   <button className="w-7 h-7 rounded-full bg-[#1da1f2] flex items-center justify-center text-white hover:opacity-90">
//                     <FaTwitter className="w-3 h-3" />
//                   </button>
//                   <button className="w-7 h-7 rounded-full bg-[#e60023] flex items-center justify-center text-white hover:opacity-90">
//                     <FaPinterestP className="w-3 h-3" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Features - Smaller */}
//             <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
//               <div className="flex items-center space-x-2">
//                 <FiTruck className="text-sage w-5 h-5" />
//                 <div>
//                   <div className="text-sm font-semibold text-foreground">Free Shipping</div>
//                   <div className="text-xs text-muted-foreground">On orders over $50</div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <FiShield className="text-sage w-5 h-5" />
//                 <div>
//                   <div className="text-sm font-semibold text-foreground">Secure Payment</div>
//                   <div className="text-xs text-muted-foreground">100% Protected</div>
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

// export default ProductDetailPage;



// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiArrowLeft, FiStar } from 'react-icons/fi';
// import { FaFacebookF, FaTwitter, FaPinterestP } from 'react-icons/fa';
// import Navbar from '../../components/layout/Navbar';
// import { Footer } from '../../components/layout/Footer';
// import { productApi } from '../../api/productApi';
// import type { Product, ProductAttribute } from '../../types';
// import { useAppDispatch } from '../../hooks/useAuth';
// import { addToCart } from '../../store/slices/cartSlice';
// import toast from 'react-hot-toast';

// // ----------------------------------------------------------------------
// // HELPER: Fix Image URLs
// // ----------------------------------------------------------------------
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL;
// const getImageUrl = (path?: string) => {
//   if (!path) return '/placeholder.jpg';
//   if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('https://')) return path;
//   return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
// };

// const ProductDetailPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState<string>('');
//   const [selectedColor, setSelectedColor] = useState<string>('');
//   const [isWishlisted, setIsWishlisted] = useState(false);
  
//   // State for available options
//   const [availableSizes, setAvailableSizes] = useState<ProductAttribute[]>([]);
//   const [availableColors, setAvailableColors] = useState<ProductAttribute[]>([]);

//   useEffect(() => {
//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const data = await productApi.getProductById(Number(id));
//       setProduct(data);

//       // Extract sizes and colors from product attributes
//       const sizes = data.attributes.filter((attr) => 
//         attr.type && attr.type.toUpperCase() === 'SIZE'
//       );
//       const colors = data.attributes.filter((attr) => 
//         attr.type && attr.type.toUpperCase() === 'COLOR'
//       );

//       setAvailableSizes(sizes);
//       setAvailableColors(colors);

//       // Auto-select first available options
//       if (sizes.length > 0) {
//         setSelectedSize(sizes[0].value);
//       }
//       if (colors.length > 0) {
//         setSelectedColor(colors[0].value);
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to fetch product');
//       navigate('/products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!product) return;

//     if (product.stock === 0) {
//       toast.error('Product is out of stock');
//       return;
//     }

//     // Validate selections
//     if (availableSizes.length > 0 && !selectedSize) {
//       toast.error('Please select a size');
//       return;
//     }

//     if (availableColors.length > 0 && !selectedColor) {
//       toast.error('Please select a color');
//       return;
//     }

//     dispatch(
//       addToCart({
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         salePrice: product.salePrice,
//         quantity,
//         selectedSize,
//         selectedColor,
//         image: product.images[0],
//         stock: product.stock,
//         itemId: 0
//       })
//     );
//     toast.success('Added to cart!');
//   };

//   const handleBuyNow = () => {
//     handleAddToCart();
//     navigate('/cart');
//   };

//   const handleClearSelection = () => {
//     if (availableSizes.length > 0) {
//       setSelectedSize(availableSizes[0].value);
//     } else {
//       setSelectedSize('');
//     }
    
//     if (availableColors.length > 0) {
//       setSelectedColor(availableColors[0].value);
//     } else {
//       setSelectedColor('');
//     }
    
//     setQuantity(1);
//     toast.success('Selection cleared!');
//   };

//   // Helper function to get color name from value
//   const getColorName = (colorValue: string) => {
//     const colorMap: Record<string, string> = {
//       '#000000': 'Black',
//       '#FFFFFF': 'White',
//       '#FF0000': 'Red',
//       '#00FF00': 'Green',
//       '#0000FF': 'Blue',
//       '#FFFF00': 'Yellow',
//       '#800080': 'Purple',
//       '#FFA500': 'Orange',
//       '#808080': 'Gray',
//       '#A52A2A': 'Brown',
//       '#FFC0CB': 'Pink',
//       '#8B4513': 'Brown',
//       '#C0C0C0': 'Silver',
//       '#FFD700': 'Gold'
//     };
    
//     return colorMap[colorValue.toUpperCase()] || colorValue;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background text-foreground">
//         <Navbar />
//         <div className="pt-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="glass-card rounded-2xl h-96 shimmer" />
//             <div className="space-y-4">
//               <div className="glass-card rounded-2xl h-8 w-3/4 shimmer" />
//               <div className="glass-card rounded-2xl h-6 w-1/2 shimmer" />
//               <div className="glass-card rounded-2xl h-32 shimmer" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-background text-foreground">
//         <Navbar />
//         <div className="pt-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl text-center">
//           <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
//           <button 
//             onClick={() => navigate('/products')}
//             className="mt-4 px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
//           >
//             Browse Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const discount = product.salePrice
//     ? Math.round(((product.price - product.salePrice) / product.price) * 100)
//     : 0;

//   // Mock review data
//   const reviewData = {
//     rating: 4.8,
//     reviewCount: 245,
//     stars: 5
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <Navbar />

//       <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
//         {/* Back Button */}
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => navigate(-1)}
//           className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-sage transition-colors mb-4"
//         >
//           <FiArrowLeft className="w-4 h-4" />
//           <span>Back to Products</span>
//         </motion.button>

//         {/* Breadcrumb */}
//         <div className="mb-6 text-xs text-muted-foreground">
//           <button 
//             onClick={() => navigate('/')}
//             className="hover:text-sage cursor-pointer"
//           >
//             Home
//           </button>
//           <span className="mx-1">/</span>
//           <button 
//             onClick={() => navigate('/products')}
//             className="hover:text-sage cursor-pointer"
//           >
//             Products
//           </button>
//           <span className="mx-1">/</span>
//           <span className="text-foreground font-medium">{product.name}</span>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Images */}
//           <div className="space-y-3">
//             {/* Main Image */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="aspect-square rounded-xl overflow-hidden glass-card p-3"
//             >
//               <img
//                 src={getImageUrl(product.images[selectedImage])}
//                 alt={product.name}
//                 className="w-full h-full object-contain"
//               />
//             </motion.div>

//             {/* Thumbnails */}
//             {product.images.length > 1 && (
//               <div className="grid grid-cols-5 gap-2">
//                 {product.images.map((image, index) => (
//                   <motion.button
//                     key={index}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setSelectedImage(index)}
//                     className={`aspect-square rounded-lg overflow-hidden border ${
//                       selectedImage === index
//                         ? 'border-sage ring-1 ring-sage'
//                         : 'border-transparent'
//                     }`}
//                   >
//                     <img
//                       src={getImageUrl(image)}
//                       alt={`${product.name} ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </motion.button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right Column - Product Info */}
//           <div className="space-y-6">
//             {/* Category and Stock */}
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-semibold text-sage uppercase tracking-wider">
//                 {product.category}
//               </span>
//               <span
//                 className={`px-2 py-1 rounded text-xs font-semibold ${
//                   product.stock > 0
//                     ? 'bg-green-500/20 text-green-400'
//                     : 'bg-red-500/20 text-red-400'
//                 }`}
//               >
//                 {product.stock > 0 ? `${product.stock} in Stock` : 'Out of stock'}
//               </span>
//             </div>

//             {/* Title */}
//             <h1 className="text-2xl font-display font-bold text-foreground">
//               {product.name}
//             </h1>

//             {/* Rating */}
//             <div className="flex items-center space-x-1">
//               <div className="flex items-center">
//                 {[...Array(reviewData.stars)].map((_, i) => (
//                   <FiStar
//                     key={i}
//                     className={`w-3 h-3 ${
//                       i < Math.floor(reviewData.rating)
//                         ? 'text-yellow-500 fill-yellow-500'
//                         : 'text-gray-300'
//                     }`}
//                   />
//                 ))}
//               </div>
//               <span className="text-xs font-semibold text-foreground">
//                 {reviewData.rating}
//               </span>
//               <span className="text-xs text-muted-foreground">
//                 ({reviewData.reviewCount} Reviews)
//               </span>
//             </div>

//             {/* Price */}
//             <div className="flex items-center space-x-3">
//               {product.salePrice ? (
//                 <>
//                   <span className="text-2xl font-bold text-foreground">
//                     ${product.salePrice.toFixed(2)}
//                   </span>
//                   <span className="text-lg text-muted-foreground line-through">
//                     ${product.price.toFixed(2)}
//                   </span>
//                   <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
//                     -{discount}%
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-2xl font-bold text-foreground">
//                   ${product.price.toFixed(2)}
//                 </span>
//               )}
//             </div>

//             {/* Description */}
//             <p className="text-sm text-muted-foreground leading-relaxed border-b border-border pb-4">
//               {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
//             </p>

//             {/* Color Selection */}
//             {availableColors.length > 0 && (
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-muted-foreground flex justify-between">
//                   <span>Select Color:</span>
//                   {selectedColor && (
//                     <span className="text-foreground font-normal">
//                       Selected: {getColorName(selectedColor)}
//                     </span>
//                   )}
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {availableColors.map((colorAttr) => {
//                     const colorValue = colorAttr.value;
//                     const colorName = getColorName(colorValue);
                    
//                     return (
//                       <motion.button
//                         key={colorAttr.id}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setSelectedColor(colorValue)}
//                         className={`flex flex-col items-center space-y-1 p-2 rounded-lg border ${
//                           selectedColor === colorValue
//                             ? 'border-sage ring-1 ring-sage/30 bg-sage/10'
//                             : 'border-border hover:border-sage/50'
//                         }`}
//                       >
//                         <div
//                           className="w-8 h-8 rounded-full border border-border"
//                           style={{ backgroundColor: colorValue }}
//                           title={colorName}
//                         />
//                         <span className="text-xs font-medium text-foreground">
//                           {colorName}
//                         </span>
//                       </motion.button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Size Selection */}
//             {availableSizes.length > 0 && (
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-muted-foreground flex justify-between">
//                   <span>Select Size:</span>
//                   {selectedSize && (
//                     <span className="text-foreground font-normal">
//                       Selected: {selectedSize}
//                     </span>
//                   )}
//                 </label>
//                 <div className="flex flex-wrap items-center gap-2">
//                   {availableSizes.map((sizeAttr) => (
//                     <motion.button
//                       key={sizeAttr.id}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setSelectedSize(sizeAttr.value)}
//                       className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
//                         selectedSize === sizeAttr.value
//                           ? 'bg-sage text-white'
//                           : 'glass-card hover:bg-accent/20 text-foreground'
//                       }`}
//                     >
//                       {sizeAttr.value}
//                     </motion.button>
//                   ))}
//                   <button className="text-xs text-sage hover:underline font-medium">
//                     View Size Guide
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* SKU and Clear Selection */}
//             <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
//               <div>
//                 <span className="font-medium">SKU: </span>
//                 <span className="font-semibold text-foreground">GHT95245AAA</span>
//               </div>
//               {(selectedSize || selectedColor) && (
//                 <button 
//                   onClick={handleClearSelection}
//                   className="text-red-400 hover:text-red-500 font-medium"
//                 >
//                   Clear Selection
//                 </button>
//               )}
//             </div>

//             {/* Quantity and Actions */}
//             <div className="space-y-4 pt-4 border-t border-border">
//               <div>
//                 <label className="text-sm font-semibold text-sage mb-2 block">
//                   Quantity
//                 </label>
//                 <div className="flex items-center space-x-3">
//                   <div className="flex items-center space-x-2">
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="w-10 h-10 flex items-center justify-center glass-card rounded-lg font-bold text-lg hover:bg-accent/20"
//                       disabled={quantity <= 1}
//                     >
//                       -
//                     </motion.button>
//                     <span className="w-12 text-center text-lg font-bold text-foreground">
//                       {quantity}
//                     </span>
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                       className="w-10 h-10 flex items-center justify-center glass-card rounded-lg font-bold text-lg hover:bg-accent/20"
//                       disabled={quantity >= product.stock}
//                     >
//                       +
//                     </motion.button>
//                   </div>
//                   <span className="text-sm text-muted-foreground">
//                     {product.stock} available
//                   </span>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleAddToCart}
//                   disabled={product.stock === 0}
//                   className="btn-ghost flex items-center justify-center space-x-2 disabled:opacity-50 h-12 text-sm"
//                 >
//                   <FiShoppingCart className="w-5 h-5" />
//                   <span>Add to Cart</span>
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleBuyNow}
//                   disabled={product.stock === 0}
//                   className="btn-primary disabled:opacity-50 h-12 text-sm"
//                 >
//                   Buy Now
//                 </motion.button>
//               </div>

//               {/* Wishlist Button */}
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsWishlisted(!isWishlisted)}
//                 className="w-full flex items-center justify-center space-x-2 py-3 text-sm glass-card rounded-lg hover:bg-accent/10"
//               >
//                 <FiHeart 
//                   className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} 
//                 />
//                 <span className="font-medium">
//                   {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
//                 </span>
//               </motion.button>
//             </div>

//             {/* Tags and Share */}
//             <div className="pt-4 border-t border-border space-y-4">
//               {/* Tags */}
//               <div>
//                 <span className="text-sm font-semibold text-muted-foreground">Tags: </span>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {['Women', 'Coat', 'Fashion', 'Jacket'].map((tag) => (
//                     <span
//                       key={tag}
//                       className="px-3 py-1 text-xs glass-card rounded-full hover:bg-accent/20 cursor-pointer"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Share */}
//               <div className="flex items-center space-x-3">
//                 <span className="text-sm font-semibold text-muted-foreground">Share:</span>
//                 <div className="flex space-x-2">
//                   <button className="w-8 h-8 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-90">
//                     <FaFacebookF className="w-4 h-4" />
//                   </button>
//                   <button className="w-8 h-8 rounded-full bg-[#1da1f2] flex items-center justify-center text-white hover:opacity-90">
//                     <FaTwitter className="w-4 h-4" />
//                   </button>
//                   <button className="w-8 h-8 rounded-full bg-[#e60023] flex items-center justify-center text-white hover:opacity-90">
//                     <FaPinterestP className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Features */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
//                   <FiTruck className="text-sage w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold text-foreground">Free Shipping</div>
//                   <div className="text-xs text-muted-foreground">On orders over $50</div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
//                   <FiShield className="text-sage w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold text-foreground">Secure Payment</div>
//                   <div className="text-xs text-muted-foreground">100% Protected</div>
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

// export default ProductDetailPage;


// import { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiArrowLeft, FiStar } from 'react-icons/fi';
// import Navbar from '../../components/layout/Navbar';
// import { Footer } from '../../components/layout/Footer';
// import { productApi } from '../../api/productApi';
// import type { Product, ProductAttribute } from '../../types';
// import { useAppDispatch } from '../../hooks/useAuth';
// import { addToCart } from '../../store/slices/cartSlice';
// import toast from 'react-hot-toast';
// import useAuth from "../../hooks/useAuth";
// import { cartApi } from "../../api/cartApi";
// import { useAppSelector } from "../../hooks/useAuth";
// import reviewApi, { type Review } from "../../api/reviewApi";
// import { useWishlist } from "../../context/WishlistContext";

// // ----------------------------------------------------------------------
// // HELPER: Fix Image URLs
// // ----------------------------------------------------------------------
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL;
// const getImageUrl = (path?: string) => {
//   if (!path) return '/placeholder.jpg';
//   if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('https://')) return path;
//   return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
// };

// // ----------------------------------------------------------------------
// // HELPER: Format price in INR
// // ----------------------------------------------------------------------
// export const formatINR = (amount: number) => {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     minimumFractionDigits: 2,
//   }).format(amount);
// };

// // ----------------------------------------------------------------------
// // HELPER: Safely render HTML content
// // ----------------------------------------------------------------------
// const createMarkup = (htmlContent: string) => {
//   return { __html: htmlContent };
// };

// const ProductDetailPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState<string>('');
//   const [selectedColor, setSelectedColor] = useState<string>('');
//   const { wishlistIds, toggleWishlist } = useWishlist();
// const isWishlisted = product ? wishlistIds.includes(product.id) : false;

  
//   // State for available options
//   const [availableSizes, setAvailableSizes] = useState<ProductAttribute[]>([]);
//   const [availableColors, setAvailableColors] = useState<ProductAttribute[]>([]);
// const { isAuthenticated } = useAuth();

// const [reviews, setReviews] = useState<Review[]>([]);
// const [reviewCount, setReviewCount] = useState(0);
// const [averageRating, setAverageRating] = useState(0);

//   const ratingScale = [5, 4, 3, 2, 1];
//   const ratingDistribution = useMemo(
//     () =>
//       ratingScale.map(
//         (rating) =>
//           reviews.filter((review) => Math.round(review.rating) === rating).length
//       ),
//     [reviews]
//   );
//   const totalRecentRatings = ratingDistribution.reduce((sum, count) => sum + count, 0);
//   const customerPhotos = useMemo(
//     () =>
//       reviews
//         .flatMap((review) => review.imageUrls ?? [])
//         .filter((url): url is string => Boolean(url)),
//     [reviews]
//   );
//   const previewPhotos = customerPhotos.slice(0, 4);
//   const extraPhotoCount = Math.max(customerPhotos.length - previewPhotos.length, 0);
//   const formatReviewDate = (dateString: string) =>
//     new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });


// useEffect(() => {
//   const productId = product?.id ?? (id ? Number(id) : NaN);
//   if (!Number.isFinite(productId)) return;

//   const fetchReviews = async () => {
//     try {
//       const data = await reviewApi.getProductReviews(productId, 0, 5);

//       setReviews(data.content);
//       setReviewCount(data.totalElements);

//       if (data.content.length > 0) {
//         const avg =
//           data.content.reduce((sum, r) => sum + r.rating, 0) /
//           data.content.length;

//         setAverageRating(Number(avg.toFixed(1)));
//       } else {
//         setAverageRating(0);
//       }
//     } catch (err) {
//       console.error("Failed to load reviews", err);
//     }
//   };

//   fetchReviews();
// }, [product?.id, id]);

//   useEffect(() => {
//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const data = await productApi.getProductById(Number(id));
//       setProduct(data);

//       // Extract sizes and colors from product attributes
//       const sizes = data.attributes.filter((attr) => 
//         attr.type && attr.type.toUpperCase() === 'SIZE'
//       );
//       const colors = data.attributes.filter((attr) => 
//         attr.type && attr.type.toUpperCase() === 'COLOR'
//       );

//       setAvailableSizes(sizes);
//       setAvailableColors(colors);

//       // Auto-select first available options
//       if (sizes.length > 0) {
//         setSelectedSize(sizes[0].value);
//       }
//       if (colors.length > 0) {
//         setSelectedColor(colors[0].value);
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to fetch product');
//       navigate('/products');
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleAddToCart = async () => {
//   if (!product) return;

//   if (product.stock === 0) {
//     toast.error("Product is out of stock");
//     return;
//   }

//   if (availableSizes.length > 0 && !selectedSize) {
//     toast.error("Please select a size");
//     return;
//   }

//   if (availableColors.length > 0 && !selectedColor) {
//     toast.error("Please select a color");
//     return;
//   }

//   try {
//     if (isAuthenticated) {
//       // âœ… BACKEND CART
//       const backendItem = await cartApi.addToCart({
//         productId: product.id,
//         quantity,
//         selectedSize,
//         selectedColor,
//       });

//       dispatch(
//         addToCart({
//           productId: product.id,
//           name: product.name,
//           price: product.price,
//           salePrice: product.salePrice,
//           quantity: backendItem.quantity,
//           selectedSize,
//           selectedColor,
//           image: product.images[0],
//           stock: product.stock,
//           itemId: backendItem.id, // âœ… REAL ID
//         })
//       );
//     } else {
//       // âœ… GUEST CART
//       dispatch(
//         addToCart({
//           productId: product.id,
//           name: product.name,
//           price: product.price,
//           salePrice: product.salePrice,
//           quantity,
//           selectedSize,
//           selectedColor,
//           image: product.images[0],
//           stock: product.stock,
//           itemId: 0,
//         })
//       );
//     }

//     toast.success("Added to cart!");
//   } catch (err: any) {
//     console.error("Add to cart failed:", err);
//     toast.error("Failed to add to cart");
//   }
// };


//   const handleBuyNow = () => {
//     handleAddToCart();
//     navigate('/cart');
//   };

//   const handleClearSelection = () => {
//     if (availableSizes.length > 0) {
//       setSelectedSize(availableSizes[0].value);
//     } else {
//       setSelectedSize('');
//     }
    
//     if (availableColors.length > 0) {
//       setSelectedColor(availableColors[0].value);
//     } else {
//       setSelectedColor('');
//     }
    
//     setQuantity(1);
//     toast.success('Selection cleared!');
//   };

//   // Helper function to get color name from value
//   const getColorName = (colorValue: string) => {
//     const colorMap: Record<string, string> = {
//       '#000000': 'Black',
//       '#FFFFFF': 'White',
//       '#FF0000': 'Red',
//       '#00FF00': 'Green',
//       '#0000FF': 'Blue',
//       '#FFFF00': 'Yellow',
//       '#800080': 'Purple',
//       '#FFA500': 'Orange',
//       '#808080': 'Gray',
//       '#A52A2A': 'Brown',
//       '#FFC0CB': 'Pink',
//       '#8B4513': 'Brown',
//       '#C0C0C0': 'Silver',
//       '#FFD700': 'Gold'
//     };
    
//     return colorMap[colorValue.toUpperCase()] || colorValue;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background text-foreground">
//         <Navbar />
//         <div className="pt-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="glass-card rounded-2xl h-96 shimmer" />
//             <div className="space-y-4">
//               <div className="glass-card rounded-2xl h-8 w-3/4 shimmer" />
//               <div className="glass-card rounded-2xl h-6 w-1/2 shimmer" />
//               <div className="glass-card rounded-2xl h-32 shimmer" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-background text-foreground">
//         <Navbar />
//         <div className="pt-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl text-center">
//           <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
//           <button 
//             onClick={() => navigate('/products')}
//             className="mt-4 px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
//           >
//             Browse Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const discount = product.salePrice
//     ? Math.round(((product.price - product.salePrice) / product.price) * 100)
//     : 0;

//   // Default description with HTML formatting
//   const defaultDescription = `<b>sdivbsdfvb</b><div><br></div><div><ul><li><b>sdfgh</b></li><li><b>sdfgh</b></li><li><b><u>sdfgh</u></b></li></ul></div>`;
  
//   // Use product description if available, otherwise use default
//   const descriptionHtml = product.description || defaultDescription;

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <Navbar />

//       <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
//         {/* Back Button */}
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => navigate(-1)}
//           className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-sage transition-colors mb-4"
//         >
//           <FiArrowLeft className="w-4 h-4" />
//           <span>Back to Products</span>
//         </motion.button>

//         {/* Breadcrumb */}
//         <div className="mb-6 text-xs text-muted-foreground">
//           <button 
//             onClick={() => navigate('/')}
//             className="hover:text-sage cursor-pointer"
//           >
//             Home
//           </button>
//           <span className="mx-1">/</span>
//           <button 
//             onClick={() => navigate('/products')}
//             className="hover:text-sage cursor-pointer"
//           >
//             Products
//           </button>
//           <span className="mx-1">/</span>
//           <span className="text-foreground font-medium">{product.name}</span>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Images */}
//           <div className="space-y-3">
//             {/* Main Image */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="aspect-square rounded-xl overflow-hidden glass-card p-3"
//             >
//               <img
//                 src={getImageUrl(product.images[selectedImage])}
//                 alt={product.name}
//                 className="w-full h-full object-contain"
//               />
//             </motion.div>

//             {/* Thumbnails */}
//             {product.images.length > 1 && (
//               <div className="grid grid-cols-5 gap-2">
//                 {product.images.map((image, index) => (
//                   <motion.button
//                     key={index}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setSelectedImage(index)}
//                     className={`aspect-square rounded-lg overflow-hidden border ${
//                       selectedImage === index
//                         ? 'border-sage ring-1 ring-sage'
//                         : 'border-transparent'
//                     }`}
//                   >
//                     <img
//                       src={getImageUrl(image)}
//                       alt={`${product.name} ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </motion.button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right Column - Product Info */}
//           <div className="space-y-6">
//             {/* Category and Stock */}
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-semibold text-sage uppercase tracking-wider">
//                 {product.category}
//               </span>
//               <span
//                 className={`px-2 py-1 rounded text-xs font-semibold ${
//                   product.stock > 0
//                     ? 'bg-green-500/20 text-green-400'
//                     : 'bg-red-500/20 text-red-400'
//                 }`}
//               >
//                 {product.stock > 0 ? `${product.stock} in Stock` : 'Out of stock'}
//               </span>
//             </div>

//             {/* Title */}
//             <h1 className="text-2xl font-display font-bold text-foreground">
//               {product.name}
//             </h1>

//             {/* Rating */}
//          {/* Rating */}
// <div className="flex items-center space-x-1">
//   <div className="flex items-center">
//     {[...Array(5)].map((_, i) => (
//       <FiStar
//         key={i}
//         className={`w-3 h-3 ${
//           i < Math.round(averageRating)
//             ? "text-yellow-500 fill-yellow-500"
//             : "text-gray-300"
//         }`}
//       />
//     ))}
//   </div>

//   <span className="text-xs font-semibold text-foreground">
//     {averageRating}
//   </span>

//   <span className="text-xs text-muted-foreground">
//     ({reviewCount} Reviews)
//   </span>
// </div>


//             {/* Price in INR */}
//             <div className="flex items-center space-x-3">
//               {product.salePrice ? (
//                 <>
//                   <span className="text-2xl font-bold text-foreground">
//                     {formatINR(product.salePrice)}
//                   </span>
//                   <span className="text-lg text-muted-foreground line-through">
//                     {formatINR(product.price)}
//                   </span>
//                   <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
//                     -{discount}%
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-2xl font-bold text-foreground">
//                   {formatINR(product.price)}
//                 </span>
//               )}
//             </div>

//             {/* Description with HTML formatting */}
//             <div className="text-sm text-muted-foreground leading-relaxed border-b border-border pb-4">
// <div
//   className="text-sm leading-relaxed text-muted-foreground
//              [&_ul]:list-disc
//              [&_ul]:pl-6
//              [&_li]:mb-1
//              [&_b]:font-semibold
//              [&_strong]:font-semibold
//              [&_u]:underline"
//   dangerouslySetInnerHTML={createMarkup(descriptionHtml)}
// />
//             </div>

//             {/* Color Selection */}
//             {availableColors.length > 0 && (
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-muted-foreground flex justify-between">
//                   <span>Select Color:</span>
//                   {selectedColor && (
//                     <span className="text-foreground font-normal">
//                       Selected: {getColorName(selectedColor)}
//                     </span>
//                   )}
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {availableColors.map((colorAttr) => {
//                     const colorValue = colorAttr.value;
//                     const colorName = getColorName(colorValue);
                    
//                     return (
//                       <motion.button
//                         key={colorAttr.id}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setSelectedColor(colorValue)}
//                         className={`flex flex-col items-center space-y-1 p-2 rounded-lg border ${
//                           selectedColor === colorValue
//                             ? 'border-sage ring-1 ring-sage/30 bg-sage/10'
//                             : 'border-border hover:border-sage/50'
//                         }`}
//                       >
//                         <div
//                           className="w-8 h-8 rounded-full border border-border"
//                           style={{ backgroundColor: colorValue }}
//                           title={colorName}
//                         />
//                         <span className="text-xs font-medium text-foreground">
//                           {colorName}
//                         </span>
//                       </motion.button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Size Selection */}
//             {availableSizes.length > 0 && (
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-muted-foreground flex justify-between">
//                   <span>Select Size:</span>
//                   {selectedSize && (
//                     <span className="text-foreground font-normal">
//                       Selected: {selectedSize}
//                     </span>
//                   )}
//                 </label>
//                 <div className="flex flex-wrap items-center gap-2">
//                   {availableSizes.map((sizeAttr) => (
//                     <motion.button
//                       key={sizeAttr.id}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setSelectedSize(sizeAttr.value)}
//                       className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
//                         selectedSize === sizeAttr.value
//                           ? 'bg-sage text-white'
//                           : 'glass-card hover:bg-accent/20 text-foreground'
//                       }`}
//                     >
//                       {sizeAttr.value}
//                     </motion.button>
//                   ))}
//                   <button className="text-xs text-sage hover:underline font-medium">
//                     View Size Guide
//                   </button>
//                 </div>
//               </div>
//             )}

           

//             {/* Quantity and Actions */}
//             <div className="space-y-4 pt-4 border-t border-border">
//               <div>
//                 <label className="text-sm font-semibold text-sage mb-2 block">
//                   Quantity
//                 </label>
//                 <div className="flex items-center space-x-3">
//                   <div className="flex items-center space-x-2">
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="w-10 h-10 flex items-center justify-center glass-card rounded-lg font-bold text-lg hover:bg-accent/20"
//                       disabled={quantity <= 1}
//                     >
//                       -
//                     </motion.button>
//                     <span className="w-12 text-center text-lg font-bold text-foreground">
//                       {quantity}
//                     </span>
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                       className="w-10 h-10 flex items-center justify-center glass-card rounded-lg font-bold text-lg hover:bg-accent/20"
//                       disabled={quantity >= product.stock}
//                     >
//                       +
//                     </motion.button>
//                   </div>
//                   <span className="text-sm text-muted-foreground">
//                     {product.stock} available
//                   </span>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleAddToCart}
//                   disabled={product.stock === 0}
//                   className="btn-ghost flex items-center justify-center space-x-2 disabled:opacity-50 h-12 text-sm"
//                 >
//                   <FiShoppingCart className="w-5 h-5" />
//                   <span>Add to Cart</span>
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleBuyNow}
//                   disabled={product.stock === 0}
//                   className="btn-primary disabled:opacity-50 h-12 text-sm"
//                 >
//                   Buy Now
//                 </motion.button>
//               </div>

//               {/* Wishlist Button */}
//               <motion.button
//   whileHover={{ scale: 1.05 }}
//   whileTap={{ scale: 0.95 }}
//   onClick={async () => {
//     if (!isAuthenticated) {
//       toast.error("Please login to use wishlist");
//       navigate("/login");
//       return;
//     }

//     if (!product) return;

//     try {
//       await toggleWishlist(product.id);
//       toast.success(
//         isWishlisted ? "Removed from wishlist" : "Added to wishlist"
//       );
//     } catch (error) {
//       console.error("Wishlist toggle failed", error);
//       toast.error("Failed to update wishlist");
//     }
//   }}
//   className="w-full flex items-center justify-center space-x-2 py-3 text-sm glass-card rounded-lg hover:bg-accent/10"
// >
//   <FiHeart
//     className={`w-5 h-5 ${
//       isWishlisted ? "text-red-500 fill-red-500" : ""
//     }`}
//   />
//   <span className="font-medium">
//     {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
//   </span>
// </motion.button>
//             </div>

//             {/* Tags and Share */}
//             <div className="pt-4 border-t border-border space-y-4">
              
             
//             </div>

//             {/* Features */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
//                   <FiTruck className="text-sage w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold text-foreground">Free Shipping</div>
//                   <div className="text-xs text-muted-foreground">On orders over â‚¹500</div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
//                   <FiShield className="text-sage w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold text-foreground">Secure Payment</div>
//                   <div className="text-xs text-muted-foreground">100% Protected</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Ratings & Reviews */}
//         <section className="mt-12 border-t border-border pt-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-foreground">Ratings & Reviews</h2>
//             <span className="text-xs text-muted-foreground">
//               {reviewCount} Verified Buyers
//             </span>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <span className="text-4xl font-bold text-foreground">
//                   {averageRating.toFixed(1)}
//                 </span>
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-1">
//                     {[...Array(5)].map((_, i) => (
//                       <FiStar
//                         key={i}
//                         className={`h-4 w-4 ${
//                           i < Math.round(averageRating)
//                             ? 'text-yellow-500 fill-yellow-500'
//                             : 'text-gray-300'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     {reviewCount} ratings
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-5 shadow-sm space-y-2">
//               {ratingScale.map((rating, index) => {
//                 const count = ratingDistribution[index] ?? 0;
//                 const percent = totalRecentRatings
//                   ? Math.round((count / totalRecentRatings) * 100)
//                   : 0;

//                 return (
//                   <div key={rating} className="flex items-center gap-3">
//                     <span className="w-6 text-xs font-semibold text-foreground">
//                       {rating}
//                     </span>
//                     <div className="flex-1 h-2 rounded-full bg-sage/10 overflow-hidden">
//                       <div className="h-full bg-sage" style={{ width: `${percent}%` }} />
//                     </div>
//                     <span className="w-8 text-xs text-muted-foreground text-right">
//                       {count}
//                     </span>
//                   </div>
//                 );
//               })}
//               <p className="text-[11px] text-muted-foreground">
//                 Based on {totalRecentRatings} recent ratings
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-sm font-semibold text-foreground">Customer Photos</h3>
//                 <span className="text-xs text-muted-foreground">
//                   ({customerPhotos.length})
//                 </span>
//               </div>
//               {previewPhotos.length === 0 ? (
//                 <p className="text-xs text-muted-foreground">
//                   No photos yet. Be the first to share!
//                 </p>
//               ) : (
//                 <div className="grid grid-cols-4 gap-2">
//                   {previewPhotos.map((photo, index) => (
//                     <div
//                       key={`${photo}-${index}`}
//                       className="relative aspect-square rounded-lg overflow-hidden border border-border"
//                     >
//                       <img
//                         src={getImageUrl(photo)}
//                         alt={`Customer ${index + 1}`}
//                         className="h-full w-full object-cover"
//                       />
//                       {index === previewPhotos.length - 1 && extraPhotoCount > 0 && (
//                         <div className="absolute inset-0 bg-black/60 text-white text-xs font-semibold flex items-center justify-center">
//                           +{extraPhotoCount}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="lg:col-span-2 space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-sm font-semibold text-foreground">Customer Reviews</h3>
//                 <span className="text-xs text-muted-foreground">
//                   {reviewCount} total Â· {reviews.length} recent
//                 </span>
//               </div>

//               {reviews.length === 0 ? (
//                 <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-sm text-muted-foreground">
//                   No reviews yet. Be the first to review this product.
//                 </div>
//               ) : (
//                 reviews.map((review) => (
//                   <div
//                     key={review.id}
//                     className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-3"
//                   >
//                     <div className="flex items-start justify-between gap-4">
//                       <div className="flex items-start gap-3">
//                         <div className="h-10 w-10 rounded-full bg-sage/10 text-sage flex items-center justify-center text-sm font-semibold">
//                           {(review.username || 'V').slice(0, 1).toUpperCase()}
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">
//                             {review.username || 'Verified Buyer'}
//                           </p>
//                           <div className="flex items-center gap-1 mt-1">
//                             {[...Array(5)].map((_, i) => (
//                               <FiStar
//                                 key={i}
//                                 className={`h-3.5 w-3.5 ${
//                                   i < Math.round(review.rating)
//                                     ? 'text-yellow-500 fill-yellow-500'
//                                     : 'text-gray-300'
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                       <span className="text-xs text-muted-foreground">
//                         {formatReviewDate(review.createdAt)}
//                       </span>
//                     </div>

//                     {review.title && (
//                       <p className="text-sm font-semibold text-foreground">{review.title}</p>
//                     )}
//                     <p className="text-sm text-muted-foreground">{review.body}</p>

//                     {review.imageUrls?.length > 0 && (
//                       <div className="grid grid-cols-4 gap-2">
//                         {review.imageUrls.slice(0, 4).map((imageUrl, index) => (
//                           <div
//                             key={`${review.id}-${index}`}
//                             className="aspect-square rounded-lg overflow-hidden border border-border"
//                           >
//                             <img
//                               src={getImageUrl(imageUrl)}
//                               alt={`Review ${review.id}`}
//                               className="h-full w-full object-cover"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </section>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ProductDetailPage;


// import { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiArrowLeft, FiStar } from 'react-icons/fi';
// import { FaFacebookF, FaTwitter, FaPinterestP } from 'react-icons/fa';
// import Navbar from '../../components/layout/Navbar';
// import { Footer } from '../../components/layout/Footer';
// import { productApi } from '../../api/productApi';
// import type { Product, ProductAttribute } from '../../types';
// import { useAppDispatch } from '../../hooks/useAuth';
// import { addToCart } from '../../store/slices/cartSlice';
// import toast from 'react-hot-toast';
// import useAuth from "../../hooks/useAuth";
// import { cartApi } from "../../api/cartApi";
// import { useAppSelector } from "../../hooks/useAuth";
// import reviewApi, { type Review } from "../../api/reviewApi";
// import { useWishlist } from "../../context/WishlistContext";

// // ----------------------------------------------------------------------
// // HELPER: Fix Image URLs
// // ----------------------------------------------------------------------
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL;
// const getImageUrl = (path?: string) => {
//   if (!path) return '/placeholder.jpg';
//   if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('https://')) return path;
//   return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
// };

// // ----------------------------------------------------------------------
// // HELPER: Format price in INR
// // ----------------------------------------------------------------------
// export const formatINR = (amount: number) => {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     minimumFractionDigits: 2,
//   }).format(amount);
// };

// // ----------------------------------------------------------------------
// // HELPER: Safely render HTML content
// // ----------------------------------------------------------------------
// const createMarkup = (htmlContent: string) => {
//   return { __html: htmlContent };
// };

// const ProductDetailPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState<string>('');
//   const [selectedColor, setSelectedColor] = useState<string>('');
//   const { wishlistIds, toggleWishlist } = useWishlist();
//   const isWishlisted = product ? wishlistIds.includes(product.id) : false;
  
//   // State for available options
//   const [availableSizes, setAvailableSizes] = useState<ProductAttribute[]>([]);
//   const [availableColors, setAvailableColors] = useState<ProductAttribute[]>([]);
//   const { isAuthenticated } = useAuth();

//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [reviewCount, setReviewCount] = useState(0);
//   const [averageRating, setAverageRating] = useState(0);

//   const ratingScale = [5, 4, 3, 2, 1];
//   const ratingDistribution = useMemo(
//     () =>
//       ratingScale.map(
//         (rating) =>
//           reviews.filter((review) => Math.round(review.rating) === rating).length
//       ),
//     [reviews]
//   );
//   const totalRecentRatings = ratingDistribution.reduce((sum, count) => sum + count, 0);
//   const customerPhotos = useMemo(
//     () =>
//       reviews
//         .flatMap((review) => review.imageUrls ?? [])
//         .filter((url): url is string => Boolean(url)),
//     [reviews]
//   );
//   const previewPhotos = customerPhotos.slice(0, 4);
//   const extraPhotoCount = Math.max(customerPhotos.length - previewPhotos.length, 0);
//   const formatReviewDate = (dateString: string) =>
//     new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });

//   useEffect(() => {
//     const productId = product?.id ?? (id ? Number(id) : NaN);
//     if (!Number.isFinite(productId)) return;

//     const fetchReviews = async () => {
//       try {
//         const data = await reviewApi.getProductReviews(productId, 0, 5);

//         setReviews(data.content);
//         setReviewCount(data.totalElements);

//         if (data.content.length > 0) {
//           const avg =
//             data.content.reduce((sum, r) => sum + r.rating, 0) /
//             data.content.length;

//           setAverageRating(Number(avg.toFixed(1)));
//         } else {
//           setAverageRating(0);
//         }
//       } catch (err) {
//         console.error("Failed to load reviews", err);
//       }
//     };

//     fetchReviews();
//   }, [product?.id, id]);

//   useEffect(() => {
//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const data = await productApi.getProductById(Number(id));
//       setProduct(data);

//       // Extract sizes and colors from product attributes
//       const sizes = data.attributes.filter((attr) => 
//         attr.type && attr.type.toUpperCase() === 'SIZE'
//       );
//       const colors = data.attributes.filter((attr) => 
//         attr.type && attr.type.toUpperCase() === 'COLOR'
//       );

//       setAvailableSizes(sizes);
//       setAvailableColors(colors);

//       // Auto-select first available options
//       if (sizes.length > 0) {
//         setSelectedSize(sizes[0].value);
//       }
//       if (colors.length > 0) {
//         setSelectedColor(colors[0].value);
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to fetch product');
//       navigate('/products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!product) return;

//     if (product.stock === 0) {
//       toast.error("Product is out of stock");
//       return;
//     }

//     if (availableSizes.length > 0 && !selectedSize) {
//       toast.error("Please select a size");
//       return;
//     }

//     if (availableColors.length > 0 && !selectedColor) {
//       toast.error("Please select a color");
//       return;
//     }

//     try {
//       if (isAuthenticated) {
//         // âœ… BACKEND CART
//         const backendItem = await cartApi.addToCart({
//           productId: product.id,
//           quantity: quantity, // Make sure quantity is passed correctly
//           selectedSize,
//           selectedColor,
//         });

//         console.log("Backend item added:", backendItem);

//         dispatch(
//           addToCart({
//             productId: product.id,
//             name: product.name,
//             price: product.price,
//             salePrice: product.salePrice,
//             quantity: quantity, // Ensure this matches the quantity variable
//             selectedSize,
//             selectedColor,
//             image: product.images[0],
//             stock: product.stock,
//             itemId: backendItem.id, // âœ… REAL ID from backend
//           })
//         );
//       } else {
//         // âœ… GUEST CART
//         dispatch(
//           addToCart({
//             productId: product.id,
//             name: product.name,
//             price: product.price,
//             salePrice: product.salePrice,
//             quantity: quantity, // Ensure this matches the quantity variable
//             selectedSize,
//             selectedColor,
//             image: product.images[0],
//             stock: product.stock,
//             itemId: 0,
//           })
//         );
//       }

//       toast.success("Added to cart!");
      
//       // Force a small delay to ensure state is updated before Navbar re-renders
//       setTimeout(() => {
//         console.log("Cart added successfully");
//       }, 100);
      
//     } catch (err: any) {
//       console.error("Add to cart failed:", err);
//       toast.error(err.message || "Failed to add to cart");
//     }
//   };

//   const handleBuyNow = () => {
//     handleAddToCart();
//     setTimeout(() => {
//       navigate('/cart');
//     }, 300);
//   };

//   const handleClearSelection = () => {
//     if (availableSizes.length > 0) {
//       setSelectedSize(availableSizes[0].value);
//     } else {
//       setSelectedSize('');
//     }
    
//     if (availableColors.length > 0) {
//       setSelectedColor(availableColors[0].value);
//     } else {
//       setSelectedColor('');
//     }
    
//     setQuantity(1);
//     toast.success('Selection cleared!');
//   };

//   // Helper function to get color name from value
//   const getColorName = (colorValue: string) => {
//     const colorMap: Record<string, string> = {
//       '#000000': 'Black',
//       '#FFFFFF': 'White',
//       '#FF0000': 'Red',
//       '#00FF00': 'Green',
//       '#0000FF': 'Blue',
//       '#FFFF00': 'Yellow',
//       '#800080': 'Purple',
//       '#FFA500': 'Orange',
//       '#808080': 'Gray',
//       '#A52A2A': 'Brown',
//       '#FFC0CB': 'Pink',
//       '#8B4513': 'Brown',
//       '#C0C0C0': 'Silver',
//       '#FFD700': 'Gold'
//     };
    
//     return colorMap[colorValue.toUpperCase()] || colorValue;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background text-foreground">
//         <Navbar />
//         <div className="pt-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="glass-card rounded-2xl h-96 shimmer" />
//             <div className="space-y-4">
//               <div className="glass-card rounded-2xl h-8 w-3/4 shimmer" />
//               <div className="glass-card rounded-2xl h-6 w-1/2 shimmer" />
//               <div className="glass-card rounded-2xl h-32 shimmer" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-background text-foreground">
//         <Navbar />
//         <div className="pt-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl text-center">
//           <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
//           <button 
//             onClick={() => navigate('/products')}
//             className="mt-4 px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
//           >
//             Browse Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const discount = product.salePrice
//     ? Math.round(((product.price - product.salePrice) / product.price) * 100)
//     : 0;

//   // Default description with HTML formatting
//   const defaultDescription = `<b>sdivbsdfvb</b><div><br></div><div><ul><li><b>sdfgh</b></li><li><b>sdfgh</b></li><li><b><u>sdfgh</u></b></li></ul></div>`;
  
//   // Use product description if available, otherwise use default
//   const descriptionHtml = product.description || defaultDescription;

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <Navbar />

//       <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
//         {/* Back Button */}
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => navigate(-1)}
//           className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-sage transition-colors mb-4"
//         >
//           <FiArrowLeft className="w-4 h-4" />
//           <span>Back to Products</span>
//         </motion.button>

//         {/* Breadcrumb */}
//         <div className="mb-6 text-xs text-muted-foreground">
//           <button 
//             onClick={() => navigate('/')}
//             className="hover:text-sage cursor-pointer"
//           >
//             Home
//           </button>
//           <span className="mx-1">/</span>
//           <button 
//             onClick={() => navigate('/products')}
//             className="hover:text-sage cursor-pointer"
//           >
//             Products
//           </button>
//           <span className="mx-1">/</span>
//           <span className="text-foreground font-medium">{product.name}</span>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Images */}
//           <div className="space-y-3">
//             {/* Main Image */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="aspect-square rounded-xl overflow-hidden glass-card p-3"
//             >
//               <img
//                 src={getImageUrl(product.images[selectedImage])}
//                 alt={product.name}
//                 className="w-full h-full object-contain"
//               />
//             </motion.div>

//             {/* Thumbnails */}
//             {product.images.length > 1 && (
//               <div className="grid grid-cols-5 gap-2">
//                 {product.images.map((image, index) => (
//                   <motion.button
//                     key={index}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setSelectedImage(index)}
//                     className={`aspect-square rounded-lg overflow-hidden border ${
//                       selectedImage === index
//                         ? 'border-sage ring-1 ring-sage'
//                         : 'border-transparent'
//                     }`}
//                   >
//                     <img
//                       src={getImageUrl(image)}
//                       alt={`${product.name} ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </motion.button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right Column - Product Info */}
//           <div className="space-y-6">
//             {/* Category and Stock */}
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-semibold text-sage uppercase tracking-wider">
//                 {product.category}
//               </span>
//               <span
//                 className={`px-2 py-1 rounded text-xs font-semibold ${
//                   product.stock > 0
//                     ? 'bg-green-500/20 text-green-400'
//                     : 'bg-red-500/20 text-red-400'
//                 }`}
//               >
//                 {product.stock > 0 ? `${product.stock} in Stock` : 'Out of stock'}
//               </span>
//             </div>

//             {/* Title */}
//             <h1 className="text-2xl font-display font-bold text-foreground">
//               {product.name}
//             </h1>

//             {/* Rating */}
//             <div className="flex items-center space-x-1">
//               <div className="flex items-center">
//                 {[...Array(5)].map((_, i) => (
//                   <FiStar
//                     key={i}
//                     className={`w-3 h-3 ${
//                       i < Math.round(averageRating)
//                         ? "text-yellow-500 fill-yellow-500"
//                         : "text-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>

//               <span className="text-xs font-semibold text-foreground">
//                 {averageRating}
//               </span>

//               <span className="text-xs text-muted-foreground">
//                 ({reviewCount} Reviews)
//               </span>
//             </div>

//             {/* Price in INR */}
//             <div className="flex items-center space-x-3">
//               {product.salePrice ? (
//                 <>
//                   <span className="text-2xl font-bold text-foreground">
//                     {formatINR(product.salePrice)}
//                   </span>
//                   <span className="text-lg text-muted-foreground line-through">
//                     {formatINR(product.price)}
//                   </span>
//                   <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
//                     -{discount}%
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-2xl font-bold text-foreground">
//                   {formatINR(product.price)}
//                 </span>
//               )}
//             </div>

//             {/* Description with HTML formatting */}
//             <div className="text-sm text-muted-foreground leading-relaxed border-b border-border pb-4">
//               <div
//                 className="text-sm leading-relaxed text-muted-foreground
//                            [&_ul]:list-disc
//                            [&_ul]:pl-6
//                            [&_li]:mb-1
//                            [&_b]:font-semibold
//                            [&_strong]:font-semibold
//                            [&_u]:underline"
//                 dangerouslySetInnerHTML={createMarkup(descriptionHtml)}
//               />
//             </div>

//             {/* Color Selection */}
//             {availableColors.length > 0 && (
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-muted-foreground flex justify-between">
//                   <span>Select Color:</span>
//                   {selectedColor && (
//                     <span className="text-foreground font-normal">
//                       Selected: {getColorName(selectedColor)}
//                     </span>
//                   )}
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {availableColors.map((colorAttr) => {
//                     const colorValue = colorAttr.value;
//                     const colorName = getColorName(colorValue);
                    
//                     return (
//                       <motion.button
//                         key={colorAttr.id}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setSelectedColor(colorValue)}
//                         className={`flex flex-col items-center space-y-1 p-2 rounded-lg border ${
//                           selectedColor === colorValue
//                             ? 'border-sage ring-1 ring-sage/30 bg-sage/10'
//                             : 'border-border hover:border-sage/50'
//                         }`}
//                       >
//                         <div
//                           className="w-8 h-8 rounded-full border border-border"
//                           style={{ backgroundColor: colorValue }}
//                           title={colorName}
//                         />
//                         <span className="text-xs font-medium text-foreground">
//                           {colorName}
//                         </span>
//                       </motion.button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Size Selection */}
//             {availableSizes.length > 0 && (
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-muted-foreground flex justify-between">
//                   <span>Select Size:</span>
//                   {selectedSize && (
//                     <span className="text-foreground font-normal">
//                       Selected: {selectedSize}
//                     </span>
//                   )}
//                 </label>
//                 <div className="flex flex-wrap items-center gap-2">
//                   {availableSizes.map((sizeAttr) => (
//                     <motion.button
//                       key={sizeAttr.id}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setSelectedSize(sizeAttr.value)}
//                       className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
//                         selectedSize === sizeAttr.value
//                           ? 'bg-sage text-white'
//                           : 'glass-card hover:bg-accent/20 text-foreground'
//                       }`}
//                     >
//                       {sizeAttr.value}
//                     </motion.button>
//                   ))}
//                   <button className="text-xs text-sage hover:underline font-medium">
//                     View Size Guide
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Quantity and Actions */}
//             <div className="space-y-4 pt-4 border-t border-border">
//               <div>
//                 <label className="text-sm font-semibold text-sage mb-2 block">
//                   Quantity
//                 </label>
//                 <div className="flex items-center space-x-3">
//                   <div className="flex items-center space-x-2">
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="w-10 h-10 flex items-center justify-center glass-card rounded-lg font-bold text-lg hover:bg-accent/20"
//                       disabled={quantity <= 1}
//                     >
//                       -
//                     </motion.button>
//                     <span className="w-12 text-center text-lg font-bold text-foreground">
//                       {quantity}
//                     </span>
//                     <motion.button
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                       className="w-10 h-10 flex items-center justify-center glass-card rounded-lg font-bold text-lg hover:bg-accent/20"
//                       disabled={quantity >= product.stock}
//                     >
//                       +
//                     </motion.button>
//                   </div>
//                   <span className="text-sm text-muted-foreground">
//                     {product.stock} available
//                   </span>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleAddToCart}
//                   disabled={product.stock === 0}
//                   className="btn-ghost flex items-center justify-center space-x-2 disabled:opacity-50 h-12 text-sm"
//                 >
//                   <FiShoppingCart className="w-5 h-5" />
//                   <span>Add to Cart</span>
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleBuyNow}
//                   disabled={product.stock === 0}
//                   className="btn-primary disabled:opacity-50 h-12 text-sm"
//                 >
//                   Buy Now
//                 </motion.button>
//               </div>

//               {/* Wishlist Button */}
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={async () => {
//                   if (!isAuthenticated) {
//                     toast.error("Please login to use wishlist");
//                     navigate("/login");
//                     return;
//                   }

//                   if (!product) return;

//                   try {
//                     await toggleWishlist(product.id);
//                     toast.success(
//                       isWishlisted ? "Removed from wishlist" : "Added to wishlist"
//                     );
//                   } catch (error) {
//                     console.error("Wishlist toggle failed", error);
//                     toast.error("Failed to update wishlist");
//                   }
//                 }}
//                 className="w-full flex items-center justify-center space-x-2 py-3 text-sm glass-card rounded-lg hover:bg-accent/10"
//               >
//                 <FiHeart
//                   className={`w-5 h-5 ${
//                     isWishlisted ? "text-red-500 fill-red-500" : ""
//                   }`}
//                 />
//                 <span className="font-medium">
//                   {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
//                 </span>
//               </motion.button>
//             </div>

//             {/* Tags and Share */}
//             <div className="pt-4 border-t border-border space-y-4">
//               {/* Add share buttons or tags here if needed */}
//             </div>

//             {/* Features */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
//                   <FiTruck className="text-sage w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold text-foreground">Free Shipping</div>
//                   <div className="text-xs text-muted-foreground">On orders over â‚¹500</div>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
//                   <FiShield className="text-sage w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-semibold text-foreground">Secure Payment</div>
//                   <div className="text-xs text-muted-foreground">100% Protected</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Ratings & Reviews */}
//         <section className="mt-12 border-t border-border pt-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-foreground">Ratings & Reviews</h2>
//             <span className="text-xs text-muted-foreground">
//               {reviewCount} Verified Buyers
//             </span>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <span className="text-4xl font-bold text-foreground">
//                   {averageRating.toFixed(1)}
//                 </span>
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-1">
//                     {[...Array(5)].map((_, i) => (
//                       <FiStar
//                         key={i}
//                         className={`h-4 w-4 ${
//                           i < Math.round(averageRating)
//                             ? 'text-yellow-500 fill-yellow-500'
//                             : 'text-gray-300'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     {reviewCount} ratings
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-5 shadow-sm space-y-2">
//               {ratingScale.map((rating, index) => {
//                 const count = ratingDistribution[index] ?? 0;
//                 const percent = totalRecentRatings
//                   ? Math.round((count / totalRecentRatings) * 100)
//                   : 0;

//                 return (
//                   <div key={rating} className="flex items-center gap-3">
//                     <span className="w-6 text-xs font-semibold text-foreground">
//                       {rating}
//                     </span>
//                     <div className="flex-1 h-2 rounded-full bg-sage/10 overflow-hidden">
//                       <div className="h-full bg-sage" style={{ width: `${percent}%` }} />
//                     </div>
//                     <span className="w-8 text-xs text-muted-foreground text-right">
//                       {count}
//                     </span>
//                   </div>
//                 );
//               })}
//               <p className="text-[11px] text-muted-foreground">
//                 Based on {totalRecentRatings} recent ratings
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-sm font-semibold text-foreground">Customer Photos</h3>
//                 <span className="text-xs text-muted-foreground">
//                   ({customerPhotos.length})
//                 </span>
//               </div>
//               {previewPhotos.length === 0 ? (
//                 <p className="text-xs text-muted-foreground">
//                   No photos yet. Be the first to share!
//                 </p>
//               ) : (
//                 <div className="grid grid-cols-4 gap-2">
//                   {previewPhotos.map((photo, index) => (
//                     <div
//                       key={`${photo}-${index}`}
//                       className="relative aspect-square rounded-lg overflow-hidden border border-border"
//                     >
//                       <img
//                         src={getImageUrl(photo)}
//                         alt={`Customer ${index + 1}`}
//                         className="h-full w-full object-cover"
//                       />
//                       {index === previewPhotos.length - 1 && extraPhotoCount > 0 && (
//                         <div className="absolute inset-0 bg-black/60 text-white text-xs font-semibold flex items-center justify-center">
//                           +{extraPhotoCount}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="lg:col-span-2 space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-sm font-semibold text-foreground">Customer Reviews</h3>
//                 <span className="text-xs text-muted-foreground">
//                   {reviewCount} total Â· {reviews.length} recent
//                 </span>
//               </div>

//               {reviews.length === 0 ? (
//                 <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-sm text-muted-foreground">
//                   No reviews yet. Be the first to review this product.
//                 </div>
//               ) : (
//                 reviews.map((review) => (
//                   <div
//                     key={review.id}
//                     className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-3"
//                   >
//                     <div className="flex items-start justify-between gap-4">
//                       <div className="flex items-start gap-3">
//                         <div className="h-10 w-10 rounded-full bg-sage/10 text-sage flex items-center justify-center text-sm font-semibold">
//                           {(review.username || 'V').slice(0, 1).toUpperCase()}
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">
//                             {review.username || 'Verified Buyer'}
//                           </p>
//                           <div className="flex items-center gap-1 mt-1">
//                             {[...Array(5)].map((_, i) => (
//                               <FiStar
//                                 key={i}
//                                 className={`h-3.5 w-3.5 ${
//                                   i < Math.round(review.rating)
//                                     ? 'text-yellow-500 fill-yellow-500'
//                                     : 'text-gray-300'
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                       <span className="text-xs text-muted-foreground">
//                         {formatReviewDate(review.createdAt)}
//                       </span>
//                     </div>

//                     {review.title && (
//                       <p className="text-sm font-semibold text-foreground">{review.title}</p>
//                     )}
//                     <p className="text-sm text-muted-foreground">{review.body}</p>

//                     {review.imageUrls?.length > 0 && (
//                       <div className="grid grid-cols-4 gap-2">
//                         {review.imageUrls.slice(0, 4).map((imageUrl, index) => (
//                           <div
//                             key={`${review.id}-${index}`}
//                             className="aspect-square rounded-lg overflow-hidden border border-border"
//                           >
//                             <img
//                               src={getImageUrl(imageUrl)}
//                               alt={`Review ${review.id}`}
//                               className="h-full w-full object-cover"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </section>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ProductDetailPage;



import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiArrowLeft, FiStar, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { productApi } from '../../api/productApi';
import type { Product, ProductAttribute } from '../../types';
import { useAppDispatch } from '../../hooks/useAuth';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import useAuth from "../../hooks/useAuth";
import { cartApi } from "../../api/cartApi";
import reviewApi, { type Review } from "../../api/reviewApi";
import { useWishlist } from "../../context/WishlistContext";

// ----------------------------------------------------------------------
// HELPER: Fix Image URLs
// ----------------------------------------------------------------------
const SERVER_URL = import.meta.env.VITE_API_IMG_URL;
const REVIEW_PREVIEW_LIMIT = 5;
const REVIEW_INITIAL_FETCH_SIZE = 50;
const getImageUrl = (path?: string) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('https://')) return path;
  return `${SERVER_URL}${path}`;
};

// ----------------------------------------------------------------------
// HELPER: Get Video MIME type from URL
// ----------------------------------------------------------------------
const getVideoSourceType = (url: string): string => {
  if (!url) return 'video/mp4';
  
  const extension = url.split('.').pop()?.toLowerCase() || '';
  const videoTypes: Record<string, string> = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'ogv': 'video/ogg',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'mkv': 'video/x-matroska',
    'm4v': 'video/mp4',
    'mpg': 'video/mpeg',
    'mpeg': 'video/mpeg'
  };
  
  return videoTypes[extension] || 'video/mp4';
};

// ----------------------------------------------------------------------
// HELPER: Check if file is video by extension
// ----------------------------------------------------------------------
const isVideoFile = (filename: string): boolean => {
  if (!filename) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.m4v', '.mpg', '.mpeg'];
  const lowerFilename = filename.toLowerCase();
  return videoExtensions.some(ext => lowerFilename.endsWith(ext));
};
const getVideoUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// ----------------------------------------------------------------------
// HELPER: Format price in INR
// ----------------------------------------------------------------------
const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

// ----------------------------------------------------------------------
// HELPER: Safely render HTML content
// ----------------------------------------------------------------------
const createMarkup = (htmlContent: string) => {
  return { __html: htmlContent };
};

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  poster?: string;
  videoThumbnail?: string; // First frame of video as thumbnail
  videoDuration?: number; // Video duration in seconds
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const quantity = 1;
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const { wishlistIds, toggleWishlist } = useWishlist();
  const isWishlisted = product ? wishlistIds.includes(product.id) : false;
  
  // State for available options
  const [availableSizes, setAvailableSizes] = useState<ProductAttribute[]>([]);
  const [availableColors, setAvailableColors] = useState<ProductAttribute[]>([]);
  const { isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [allReviewsLoading, setAllReviewsLoading] = useState(false);
  const [allPhotosModalOpen, setAllPhotosModalOpen] = useState(false);
  const [allReviewsModalOpen, setAllReviewsModalOpen] = useState(false);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [fullscreenVideo, setFullscreenVideo] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  const ratingScale = [5, 4, 3, 2, 1];
  const applyReviewSnapshot = useCallback(
    (reviewList: Review[], totalElements?: number) => {
      const normalizedReviews = Array.isArray(reviewList) ? reviewList : [];
      setReviews(normalizedReviews);
      setReviewCount(totalElements ?? normalizedReviews.length);

      if (normalizedReviews.length > 0) {
        const avg =
          normalizedReviews.reduce((sum, review) => sum + review.rating, 0) /
          normalizedReviews.length;
        setAverageRating(Number(avg.toFixed(1)));
      } else {
        setAverageRating(0);
      }
    },
    []
  );

  const ratingDistribution = useMemo(
    () =>
      ratingScale.map(
        (rating) =>
          reviews.filter((review) => Math.round(review.rating) === rating).length
      ),
    [reviews]
  );
  const totalRecentRatings = ratingDistribution.reduce((sum, count) => sum + count, 0);
  const photoItems = useMemo(
    () =>
      reviews.flatMap((review) =>
        (review.imageUrls || [])
          .filter((url): url is string => Boolean(url))
          .map((url) => ({ url, review }))
      ),
    [reviews]
  );
  const previewPhotos = photoItems.slice(0, 4);
  const extraPhotoCount = Math.max(photoItems.length - previewPhotos.length, 0);
  const previewReviews = useMemo(
    () => reviews.slice(0, REVIEW_PREVIEW_LIMIT),
    [reviews]
  );
  const currentPhotoItem = photoItems[activePhotoIndex] || null;

  const formatReviewDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const showPreviousPhoto = useCallback(() => {
    setActivePhotoIndex((previous) => {
      if (photoItems.length === 0) return 0;
      return (previous - 1 + photoItems.length) % photoItems.length;
    });
  }, [photoItems.length]);

  const showNextPhoto = useCallback(() => {
    setActivePhotoIndex((previous) => {
      if (photoItems.length === 0) return 0;
      return (previous + 1) % photoItems.length;
    });
  }, [photoItems.length]);

  const openPhotoViewer = useCallback(
    (photoIndex: number) => {
      if (photoItems.length === 0) return;
      const boundedIndex = Math.min(Math.max(photoIndex, 0), photoItems.length - 1);
      setActivePhotoIndex(boundedIndex);
      setPhotoViewerOpen(true);
    },
    [photoItems.length]
  );

  const getPhotoIndexByUrl = useCallback(
    (url: string) => photoItems.findIndex((photo) => photo.url === url),
    [photoItems]
  );

  const ensureAllReviewsLoaded = useCallback(async () => {
    const productId = product?.id ?? (id ? Number(id) : NaN);
    if (!Number.isFinite(productId)) return;
    if (reviewCount <= reviews.length) return;

    setAllReviewsLoading(true);
    try {
      const firstPage = await reviewApi.getProductReviews(
        productId,
        0,
        REVIEW_INITIAL_FETCH_SIZE
      );
      let mergedReviews = [...(firstPage.content || [])];
      const totalPages = Math.max(firstPage.totalPages || 1, 1);

      for (let page = 1; page < totalPages; page += 1) {
        const nextPage = await reviewApi.getProductReviews(
          productId,
          page,
          REVIEW_INITIAL_FETCH_SIZE
        );
        mergedReviews = mergedReviews.concat(nextPage.content || []);
      }

      const uniqueReviews = Array.from(
        new Map(mergedReviews.map((review) => [review.id, review])).values()
      );

      applyReviewSnapshot(uniqueReviews, firstPage.totalElements || uniqueReviews.length);
    } catch (error) {
      console.error('Failed to load all reviews', error);
      toast.error('Failed to load all reviews');
    } finally {
      setAllReviewsLoading(false);
    }
  }, [applyReviewSnapshot, id, product?.id, reviewCount, reviews.length]);

  const handleOpenAllPhotos = useCallback(async () => {
    setAllPhotosModalOpen(true);
    await ensureAllReviewsLoaded();
  }, [ensureAllReviewsLoaded]);

  const handleOpenAllReviews = useCallback(async () => {
    setAllReviewsModalOpen(true);
    await ensureAllReviewsLoaded();
  }, [ensureAllReviewsLoaded]);

  useEffect(() => {
    const productId = product?.id ?? (id ? Number(id) : NaN);
    if (!Number.isFinite(productId)) return;
    let mounted = true;

    const fetchReviews = async () => {
      try {
        const data = await reviewApi.getProductReviews(
          productId,
          0,
          REVIEW_INITIAL_FETCH_SIZE
        );
        if (!mounted) return;
        applyReviewSnapshot(data.content || [], data.totalElements || 0);
      } catch (err) {
        if (mounted) {
          console.error('Failed to load reviews', err);
        }
      }
    };

    fetchReviews();
    return () => {
      mounted = false;
    };
  }, [applyReviewSnapshot, product?.id, id]);

  useEffect(() => {
    const shouldLockBody =
      allPhotosModalOpen || allReviewsModalOpen || photoViewerOpen;
    if (!shouldLockBody) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [allPhotosModalOpen, allReviewsModalOpen, photoViewerOpen]);

  useEffect(() => {
    if (!photoViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPhotoViewerOpen(false);
      } else if (event.key === 'ArrowLeft') {
        showPreviousPhoto();
      } else if (event.key === 'ArrowRight') {
        showNextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photoViewerOpen, showNextPhoto, showPreviousPhoto]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Video cleanup on unmount
  useEffect(() => {
    return () => {
      [videoRef.current, thumbnailVideoRef.current, fullscreenVideoRef.current].forEach(video => {
        if (video) {
          video.pause();
          video.src = '';
          video.load();
        }
      });
    };
  }, []);

  // Function to generate video thumbnail from first frame
  const generateVideoThumbnail = useCallback((videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;
      video.currentTime = 0.1; // Set to first frame
      video.muted = true;
      video.playsInline = true;
      
      video.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg');
          resolve(thumbnailUrl);
        } else {
          reject(new Error('Canvas context not available'));
        }
        
        video.remove();
      });
      
      video.addEventListener('error', (e) => {
        console.error('Failed to load video for thumbnail:', e);
        video.remove();
        reject(new Error('Failed to load video'));
      });
      
      // Fallback if video doesn't load within timeout
      setTimeout(() => {
        video.remove();
        reject(new Error('Video thumbnail generation timeout'));
      }, 5000);
    });
  }, []);

  // Get all media (images + videos) with proper detection
  const getAllMedia = useMemo(() => {
    if (!product) return [];
    
    const media: MediaItem[] = [];
    
    // Check images array for both images and videos
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (!img) return;
        
        const isVideo = isVideoFile(img);
        const mediaItem: MediaItem = {
          type: isVideo ? 'video' : 'image',
          url: img,
          thumbnail: getImageUrl(img),
          poster: isVideo && product.images[0] 
            ? getImageUrl(product.images[0]) 
            : undefined
        };
        
       const fullVideoUrl = getImageUrl(img);

if (isVideo && videoThumbnails[fullVideoUrl]) {
  mediaItem.videoThumbnail = videoThumbnails[fullVideoUrl];
}
        
        media.push(mediaItem);
      });
    }
    
    // Add videos from videos array
    if (product.videos && product.videos.length > 0) {
      product.videos.forEach(video => {
        if (!video) return;
        
        const mediaItem: MediaItem = {
          type: 'video',
          url: video,
          thumbnail: getImageUrl(video),
          poster: product.images[0] ? getImageUrl(product.images[0]) : undefined
        };
        
     const fullVideoUrl = getImageUrl(video);

if (videoThumbnails[fullVideoUrl]) {
  mediaItem.videoThumbnail = videoThumbnails[fullVideoUrl];
}

        media.push(mediaItem);
      });
    }
    
    console.log('All Media Compiled:', media);
    return media;
  }, [product, videoThumbnails]);

  // Generate thumbnails for all videos
  useEffect(() => {
    if (!product) return;

    const generateAllThumbnails = async () => {
      const videos: string[] = [];
      
      // Collect all video URLs
      if (product.images) {
        product.images.forEach(img => {
          if (img && isVideoFile(img)) {
            videos.push(getImageUrl(img));
          }
        });
      }
      
      if (product.videos) {
        product.videos.forEach(video => {
          if (video) {
            videos.push(getImageUrl(video));
          }
        });
      }
      
      // Generate thumbnails for each video
      const newThumbnails: Record<string, string> = { ...videoThumbnails };
      
      for (const videoUrl of videos) {
        if (!newThumbnails[videoUrl]) {
          try {
            const thumbnail = await generateVideoThumbnail(videoUrl);
            newThumbnails[videoUrl] = thumbnail;
          } catch (error) {
            console.warn('Failed to generate thumbnail for:', videoUrl, error);
            // Use fallback image
            newThumbnails[videoUrl] = '/placeholder.jpg';
          }
        }
      }
      
      setVideoThumbnails(newThumbnails);
    };

    generateAllThumbnails();
  }, [product, generateVideoThumbnail]);

  // Count media types
  const videoCount = useMemo(() => {
    return getAllMedia.filter(item => item.type === 'video').length;
  }, [getAllMedia]);

  const imageCount = useMemo(() => {
    return getAllMedia.filter(item => item.type === 'image').length;
  }, [getAllMedia]);

  const hasVideos = videoCount > 0;
  const hasImages = imageCount > 0;
  const totalMedia = getAllMedia.length;
useEffect(() => {
  if (showVideo && currentVideo && videoRef.current) {
    videoRef.current
      .play()
      .catch(() => console.warn('Autoplay blocked'));
  }
}, [showVideo, currentVideo]);

  // Debug logging
  useEffect(() => {
    console.log('Product Detail State:', {
      productId: id,
      product: product,
      hasVideos: hasVideos,
      videoCount: videoCount,
      currentVideo,
      showVideo,
      fullscreenVideo,
      videoLoading,
      videoError,
      allMediaCount: totalMedia,
      videoThumbnails: Object.keys(videoThumbnails).length
    });
  }, [product, currentVideo, showVideo, fullscreenVideo, videoLoading, videoError, totalMedia, hasVideos, videoCount, id, videoThumbnails]);

  // Video player controls
  const handlePlayPause = () => {
    const currentVideoRef = fullscreenVideo ? fullscreenVideoRef.current : videoRef.current;
    if (!currentVideoRef) return;
    
    try {
      if (isPlaying) {
        currentVideoRef.pause();
      } else {
        currentVideoRef.play()
          .then(() => {
            console.log('Video started playing');
          })
          .catch(error => {
            console.error('Video play failed:', error);
            toast.error('Unable to play video');
          });
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Play/pause error:', error);
    }
  };

  const handleVolumeToggle = () => {
    const currentVideoRef = fullscreenVideo ? fullscreenVideoRef.current : videoRef.current;
    if (currentVideoRef) {
      currentVideoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    const currentVideoRef = fullscreenVideo ? fullscreenVideoRef.current : videoRef.current;
    if (currentVideoRef) {
      currentVideoRef.currentTime = 0;
    }
  };

  const handleVideoClick = (videoUrl: string, fullscreen = false) => {
    const fullVideoUrl = getVideoUrl(videoUrl);
    console.log('Video clicked:', {
      original: videoUrl,
      full: fullVideoUrl,
      fullscreen: fullscreen,
      type: getVideoSourceType(fullVideoUrl)
    });
    
    setVideoError(false);
    setVideoLoading(true);
    setCurrentVideo(fullVideoUrl);
    setShowVideo(true);
    setFullscreenVideo(fullscreen);
    setIsPlaying(true);
  };

  const handleCloseVideo = () => {
    [videoRef.current, fullscreenVideoRef.current].forEach(video => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    
    setShowVideo(false);
    setFullscreenVideo(false);
    setIsPlaying(false);
    setCurrentVideo(null);
    setVideoError(false);
    setVideoLoading(false);
  };

  const handleFullscreenToggle = () => {
    setFullscreenVideo(!fullscreenVideo);
  };

  const handleVideoError = () => {
    const currentVideoRef = fullscreenVideo ? fullscreenVideoRef.current : videoRef.current;
    console.error('Video element error:', currentVideoRef?.error);
    setVideoError(true);
    setVideoLoading(false);
    toast.error('Failed to load video');
  };

  const handleVideoLoaded = () => {
    console.log('Video loaded successfully');
    setVideoLoading(false);
    setVideoError(false);
  };

  const fetchProduct = async () => {
    try {
      const data = await productApi.getProductById(Number(id));
      console.log('Product data received:', {
        ...data,
        images: data.images?.length || 0,
        videos: data.videos?.length || 0,
        videoDetails: data.videos
      });
      
      setProduct(data);

      // Extract sizes and colors from product attributes
      const sizes = data.attributes.filter((attr) => 
        attr.type && attr.type.toUpperCase() === 'SIZE'
      );
      const colors = data.attributes.filter((attr) => 
        attr.type && attr.type.toUpperCase() === 'COLOR'
      );

      setAvailableSizes(sizes);
      setAvailableColors(colors);

      // Check if product has videos and set the first one
      if (data.videos && data.videos.length > 0) {
        const firstVideo = data.videos[0];
        const videoUrl = getImageUrl(firstVideo);
        console.log('Setting initial video:', videoUrl);
        setCurrentVideo(videoUrl);
      } else {
        // Also check images array for video files
        const videoFromImages = data.images?.find(img => isVideoFile(img));
        if (videoFromImages) {
          const videoUrl = getImageUrl(videoFromImages);
          console.log('Found video in images array:', videoUrl);
          setCurrentVideo(videoUrl);
        }
      }

      // Auto-select first available options
      if (sizes.length > 0) {
        setSelectedSize(sizes[0].value);
      }
      if (colors.length > 0) {
        setSelectedColor(colors[0].value);
      }
    } catch (error: any) {
      console.error('Failed to fetch product:', error);
      toast.error(error.message || 'Failed to fetch product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    try {
      if (isAuthenticated) {
        const backendItem = await cartApi.addToCart({
          productId: product.id,
          quantity: quantity,
          selectedSize,
          selectedColor,
        });

        console.log("Backend item added:", backendItem);

        dispatch(
          addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            quantity: quantity,
            selectedSize,
            selectedColor,
            image: product.images[0],
            stock: product.stock,
            itemId: Number(backendItem?.id ?? backendItem?.itemId ?? 0),
          })
        );
      } else {
        dispatch(
          addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            quantity: quantity,
            selectedSize,
            selectedColor,
            image: product.images[0],
            stock: product.stock,
            itemId: 0,
          })
        );
      }

      toast.success("Added to cart!");
      
      setTimeout(() => {
        console.log("Cart added successfully");
      }, 100);
      
    } catch (err: unknown) {
      console.error("Add to cart failed:", err);
      const candidate =
        err && typeof err === "object"
          ? (err as { status?: unknown; message?: unknown; error?: unknown })
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
        toast.error("Stock changed. Please refresh and try again.");
      } else {
        toast.error(message || "Failed to add to cart");
      }
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 300);
  };

  const getColorName = (colorValue: string) => {
    const colorMap: Record<string, string> = {
      '#000000': 'Black',
      '#ffffff': 'White',
      '#fff': 'White',
      '#ff0000': 'Red',
      '#00ff00': 'Green',
      '#0000ff': 'Blue',
      '#ffff00': 'Yellow',
      '#800080': 'Purple',
      '#ffa500': 'Orange',
      '#808080': 'Gray',
      '#a52a2a': 'Brown',
      '#ffc0cb': 'Pink',
      '#8b4513': 'Brown',
      '#c0c0c0': 'Silver',
      '#ffd700': 'Gold',
      'black': 'Black',
      'white': 'White',
      'red': 'Red',
      'green': 'Green',
      'blue': 'Blue',
      'yellow': 'Yellow',
      'purple': 'Purple',
      'orange': 'Orange',
      'gray': 'Gray',
      'grey': 'Gray',
      'brown': 'Brown',
      'pink': 'Pink',
      'silver': 'Silver',
      'gold': 'Gold'
    };
    
    const lowerValue = colorValue.toLowerCase();
    return colorMap[lowerValue] || colorValue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl h-96 shimmer" />
            <div className="space-y-4">
              <div className="glass-card rounded-2xl h-8 w-3/4 shimmer" />
              <div className="glass-card rounded-2xl h-6 w-1/2 shimmer" />
              <div className="glass-card rounded-2xl h-32 shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <button 
            onClick={() => navigate('/products')}
            className="mt-4 px-6 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const descriptionHtml = product.description;

  // Get current media URL safely
const getCurrentMediaUrl = () => {
  if (!getAllMedia.length) return '/placeholder.jpg';

  const media = getAllMedia[selectedImage];

  if (!media) return '/placeholder.jpg';

  // â­ PRIORITY â†’ generated video thumbnail
  if (media.type === 'video') {
    return (
      media.videoThumbnail ||
      media.poster ||
      '/video-placeholder.jpg'
    );
  }

  return getImageUrl(media.url);
};

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Fullscreen Video Modal */}
      {showVideo && fullscreenVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={handleCloseVideo}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <FiX size={24} />
            </button>

            {/* Video Container */}
            <div className="relative w-full max-w-6xl h-full max-h-[80vh]">
              {/* Video Loading Indicator */}
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-lg font-medium">
                    Loading video...
                  </div>
                </div>
              )}
              
              {/* Video Error Message */}
              {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="text-white text-center mb-6">
                    <p className="text-xl font-medium mb-2">Failed to load video</p>
                    <p className="opacity-80">The video format may not be supported</p>
                  </div>
                  <button
                    onClick={() => {
                      setVideoError(false);
                      setVideoLoading(true);
                      if (fullscreenVideoRef.current) {
                        fullscreenVideoRef.current.load();
                      }
                    }}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {/* Video Player */}
              <video
                ref={fullscreenVideoRef}
                className="w-full h-full object-contain"
                onEnded={handleVideoEnded}
                onLoadedData={handleVideoLoaded}
                onError={handleVideoError}
                onLoadStart={() => setVideoLoading(true)}
                autoPlay
                muted={isMuted}
                playsInline
                preload="metadata"
              >
                <source 
                  src={currentVideo || ''} 
                  type={currentVideo ? getVideoSourceType(currentVideo) : 'video/mp4'} 
                />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 min-w-[300px] justify-center">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-sage transition-colors p-2"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                </button>
                <button
                  onClick={handleVolumeToggle}
                  className="text-white hover:text-sage transition-colors p-2"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
                </button>
                <button
                  onClick={handleFullscreenToggle}
                  className="text-white hover:text-sage transition-colors p-2"
                  title="Exit Fullscreen"
                >
                  <FiMaximize size={24} />
                </button>
                <div className="h-6 w-px bg-white/30" />
                <button
                  onClick={handleCloseVideo}
                  className="text-white hover:text-red-300 transition-colors px-4 py-2 rounded-full bg-black/40 font-medium"
                >
                  Close
                </button>
              </div>
              
              {/* Video Progress Bar */}
              <div className="absolute bottom-20 left-4 right-4">
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sage transition-all duration-300"
                    style={{ 
                      width: fullscreenVideoRef.current && fullscreenVideoRef.current.duration 
                        ? `${(fullscreenVideoRef.current.currentTime / fullscreenVideoRef.current.duration) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-sage transition-colors mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </motion.button>

        {/* Breadcrumb */}
        <div className="mb-6 text-xs text-muted-foreground">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-sage cursor-pointer"
          >
            Home
          </button>
          <span className="mx-1">/</span>
          <button 
            onClick={() => navigate('/products')}
            className="hover:text-sage cursor-pointer"
          >
            Products
          </button>
          <span className="mx-1">/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Media */}
          <div className="space-y-3">
            {/* Main Media Display */}
            <div className="aspect-square rounded-xl overflow-hidden glass-card p-3 relative">
              {showVideo && !fullscreenVideo && currentVideo ? (
                <div className="relative w-full h-full">
                  {/* Video Loading Indicator */}
                  {videoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-lg">
                        Loading video...
                      </div>
                    </div>
                  )}
                  
                  {/* Video Error Message */}
                  {videoError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4">
                      <div className="text-white text-center mb-3">
                        <p className="font-medium">Failed to load video</p>
                        <p className="text-sm opacity-80 mt-1">The video format may not be supported</p>
                      </div>
                      <button
                        onClick={() => {
                          setVideoError(false);
                          setVideoLoading(true);
                          if (videoRef.current) {
                            videoRef.current.load();
                          }
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                  
                  {/* Video Player */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain bg-black"
                    onEnded={handleVideoEnded}
                    onLoadedData={handleVideoLoaded}
                    onError={handleVideoError}
                    onLoadStart={() => setVideoLoading(true)}
                    autoPlay
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                  >
                    <source 
                      src={currentVideo} 
                      type={getVideoSourceType(currentVideo)} 
                    />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 min-w-[200px] justify-center">
                    <button
                      onClick={handlePlayPause}
                      className="text-white hover:text-sage transition-colors p-1"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
                    </button>
                    <button
                      onClick={handleVolumeToggle}
                      className="text-white hover:text-sage transition-colors p-1"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                    </button>
                    <button
                      onClick={handleFullscreenToggle}
                      className="text-white hover:text-sage transition-colors p-1"
                      title="Fullscreen"
                    >
                      <FiMaximize size={18} />
                    </button>
                    <button
                      onClick={handleCloseVideo}
                      className="text-white hover:text-red-300 transition-colors text-sm font-medium ml-2 px-3 py-1 rounded-full bg-black/40"
                    >
                      Close
                    </button>
                  </div>
                  
                  {/* Video Progress Bar */}
                  <div className="absolute bottom-12 left-0 right-0 px-4">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sage transition-all duration-300"
                        style={{ 
                          width: videoRef.current && videoRef.current.duration 
                            ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : !showVideo && getAllMedia[selectedImage]?.type === 'video' ? (
  <div className="relative w-full h-full cursor-pointer">

    {/* Video Thumbnail */}
    <img
      src={getCurrentMediaUrl()}
      alt={product.name}
      className="w-full h-full object-contain"
    />

    {/* CENTER PLAY BUTTON */}
    <button
      onClick={() =>
        handleVideoClick(getAllMedia[selectedImage].url, false)
      }
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="w-16 h-16 rounded-full bg-black/70 flex items-center justify-center hover:scale-110 transition-transform">
        <FiPlay className="text-white ml-1" size={28} />
      </div>
    </button>

  </div>
) : (
  <img
    src={getCurrentMediaUrl()}
    alt={product.name}
    className="w-full h-full object-contain"
    onError={(e) => {
      e.currentTarget.src = '/placeholder.jpg';
    }}
  />
)
}
              
              {/* Video Badge if current selection is a video */}
              {!showVideo && getAllMedia[selectedImage]?.type === 'video' && (
                <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                  <FiPlay size={12} className="ml-0.5" />
                  <span>VIDEO</span>
                </div>
              )}

              {/* Fullscreen Button for Videos */}
              {!showVideo && getAllMedia[selectedImage]?.type === 'video' && (
                <button
                  onClick={() => handleVideoClick(getAllMedia[selectedImage].url, true)}
                  className="absolute bottom-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                  title="Play in fullscreen"
                >
                  <FiMaximize size={18} />
                </button>
              )}
            </div>

            {/* Media Thumbnails */}
            {totalMedia > 1 && (
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {getAllMedia.map((media, index) => (
                    <motion.button
                      key={`${media.type}-${index}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        console.log('Media clicked:', media);
                        if (media.type === 'video') {
                          // For video thumbnails, give option to play in main viewer
                          setSelectedImage(index);
                          setShowVideo(false);
                        } else {
                          setSelectedImage(index);
                          setShowVideo(false);
                        }
                      }}
                      className={`aspect-square rounded-lg overflow-hidden border-2 relative group ${
                        selectedImage === index && !showVideo
                          ? 'border-sage ring-2 ring-sage/30'
                          : 'border-transparent hover:border-sage/50'
                      }`}
                    >
                      {media.type === 'video' ? (
                        <>
                          {/* Video thumbnail with first frame */}
                          {media.videoThumbnail ? (
                            <img
                              src={media.videoThumbnail}
                              alt={`${product.name} video ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = getImageUrl(media.thumbnail);
                              }}
                            />
                          ) : (
                            // Fallback to poster or regular thumbnail
                            <img
  src={media.videoThumbnail || media.poster || '/video-placeholder.jpg'}
  alt={`${product.name} video ${index + 1}`}
  className="w-full h-full object-cover"
/>

                          )}
              
                          
                          {/* Play button overlay */}
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <FiPlay className="text-black ml-0.5" size={16} />
                            </div>
                          </div>
                          
                          {/* Video badge */}
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                            VIDEO
                          </div>
                          
                          {/* Fullscreen play button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVideoClick(media.url, true);
                            }}
                            className="absolute top-1 right-1 p-1 rounded bg-black/60 hover:bg-black/80 text-white transition-colors opacity-0 group-hover:opacity-100"
                            title="Play in fullscreen"
                          >
                            <FiMaximize size={10} />
                          </button>
                        </>
                      ) : (
                        <img
                          src={getImageUrl(media.url)}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg';
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
                
                {/* Media Type Indicators */}
                {/* <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                  {hasImages && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-sage/20 border border-sage"></div>
                      <span>{imageCount} image(s)</span>
                    </div>
                  )}
                  {hasVideos && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500"></div>
                      <span>{videoCount} video(s)</span>
                    </div>
                  )}
                </div> */}

                {/* Video Play Options */}
              </div>
            )}

            {/* Media Help Text */}
            {(hasVideos || hasImages) && totalMedia === 0 && (
              <div className="text-center py-4 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg">
                No media available for this product
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6 lg:sticky lg:top-24 self-start">
            {/* Category and Stock */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sage uppercase tracking-wider">
                {product.category}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  product.stock > 0
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {product.stock > 0 ? `${product.stock} in Stock` : 'Out of stock'}
              </span>
            </div>

            {/* Virtual Try On Button */}
            {isAuthenticated && (
              <div className="flex justify-end -mt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/virtual-try-on/${product.id}`)}
                  className="px-4 flex items-center justify-center space-x-2 h-9 text-xs font-bold border-2 border-sage text-sage rounded-lg hover:bg-sage hover:text-white transition-colors"
                >
                  <span>Virtual Try On</span>
                </motion.button>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl font-display font-bold text-foreground">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(averageRating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs font-semibold text-foreground">
                {averageRating}
              </span>

              <span className="text-xs text-muted-foreground">
                ({reviewCount} Reviews)
              </span>
            </div>

            {/* Price in INR */}
            <div className="flex items-center space-x-3">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-foreground">
                    {formatINR(product.salePrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatINR(product.price)}
                  </span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                    -{discount}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-foreground">
                  {formatINR(product.price)}
                </span>
              )}
            </div>

            {/* Description with HTML formatting */}
            <div className="text-sm text-muted-foreground leading-relaxed border-b border-border pb-4">
              <div
                className="text-sm leading-relaxed text-muted-foreground
                           [&_ul]:list-disc
                           [&_ul]:pl-6
                           [&_li]:mb-1
                           [&_b]:font-semibold
                           [&_strong]:font-semibold
                           [&_u]:underline"
                dangerouslySetInnerHTML={createMarkup(descriptionHtml)}
              />
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground flex justify-between">
                  <span>Select Color:</span>
                  {selectedColor && (
                    <span className="text-foreground font-normal">
                      Selected: {getColorName(selectedColor)}
                    </span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((colorAttr) => {
                    const colorValue = colorAttr.value;
                    const colorName = getColorName(colorValue);
                    
                    return (
                      <motion.button
                        key={colorAttr.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(colorValue)}
                        className={`flex flex-col items-center space-y-1 p-2 rounded-lg border ${
                          selectedColor === colorValue
                            ? 'border-sage ring-1 ring-sage/30 bg-sage/10'
                            : 'border-border hover:border-sage/50'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full border border-border shadow-sm"
                          style={{ 
                            backgroundColor: colorValue.includes('#') ? colorValue : 
                                           colorValue.toLowerCase() === 'white' ? '#FFFFFF' :
                                           colorValue.toLowerCase() === 'blue' ? '#0000FF' :
                                           colorValue.toLowerCase() === 'red' ? '#FF0000' :
                                           colorValue.toLowerCase() === 'green' ? '#00FF00' :
                                           colorValue.toLowerCase() === 'yellow' ? '#FFFF00' :
                                           colorValue.toLowerCase() === 'purple' ? '#800080' :
                                           colorValue.toLowerCase() === 'orange' ? '#FFA500' :
                                           colorValue.toLowerCase() === 'pink' ? '#FFC0CB' :
                                           colorValue.toLowerCase() === 'gray' ? '#808080' : '#000000'
                          }}
                          title={colorName}
                        />
                        <span className="text-xs font-medium text-foreground">
                          {colorName}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground flex justify-between">
                  <span>Select Size:</span>
                  {selectedSize && (
                    <span className="text-foreground font-normal">
                      Selected: {selectedSize}
                    </span>
                  )}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {availableSizes.map((sizeAttr) => (
                    <motion.button
                      key={sizeAttr.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(sizeAttr.value)}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                        selectedSize === sizeAttr.value
                          ? 'bg-sage text-white'
                          : 'glass-card hover:bg-accent/20 text-foreground'
                      }`}
                    >
                      {sizeAttr.value}
                    </motion.button>
                  ))}
                  <button
  onClick={() => navigate("/sizeGuide")}
  className="text-xs text-sage hover:underline font-medium"
>
  View Size Guide
</button>
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4 border-t border-border">
              {/* <div>
                <label className="text-sm font-semibold text-sage mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center glass-card rounded-lg font-bold text-lg hover:bg-accent/20 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      -
                    </motion.button>
                    <span className="w-12 text-center text-lg font-bold text-foreground">
                      {quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center glass-card rounded-lg font-bold text-lg hover:bg-accent/20 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </motion.button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.stock} available
                  </span>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed h-12 text-sm"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed h-12 text-sm"
                >
                  Buy Now
                </motion.button>
              </div>

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  if (!isAuthenticated) {
                    toast.error("Please login to use wishlist");
                    navigate("/login");
                    return;
                  }

                  if (!product) return;

                  try {
                    await toggleWishlist(product.id);
                    toast.success(
                      isWishlisted ? "Removed from wishlist" : "Added to wishlist"
                    );
                  } catch (error) {
                    console.error("Wishlist toggle failed", error);
                    toast.error("Failed to update wishlist");
                  }
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 text-sm glass-card rounded-lg hover:bg-accent/10 transition-colors"
              >
                <FiHeart
                  className={`w-5 h-5 transition-colors ${
                    isWishlisted ? "text-red-500 fill-red-500" : ""
                  }`}
                />
                <span className="font-medium">
                  {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
                </span>
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                  <FiTruck className="text-sage w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Free Shipping</div>
                  <div className="text-xs text-muted-foreground">On orders over â‚¹500</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                  <FiShield className="text-sage w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Secure Payment</div>
                  <div className="text-xs text-muted-foreground">100% Protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings & Reviews Section */}
        <section className="mt-8 space-y-6 lg:w-[calc(50%-1rem)] lg:ml-auto">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Ratings</h3>
              <span className="text-xs text-muted-foreground">{reviewCount} Verified Buyers</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] gap-5">
              <div className="space-y-2 border-r border-border pr-4">
                <p className="text-5xl leading-none font-bold text-foreground">
                  {averageRating.toFixed(1)}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <FiStar
                      key={index}
                      className={`h-4 w-4 ${
                        index < Math.round(averageRating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {ratingScale.map((rating, index) => {
                  const count = ratingDistribution[index] ?? 0;
                  const percent = totalRecentRatings
                    ? Math.round((count / totalRecentRatings) * 100)
                    : 0;

                  return (
                    <div key={rating} className="flex items-center gap-2 text-xs">
                      <span className="w-6 text-muted-foreground">{rating}★</span>
                      <div className="flex-1 h-1.5 rounded-full bg-sage/10 overflow-hidden">
                        <div className="h-full bg-sage" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-base font-semibold text-foreground">What Customers Said</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">Fit</span>
                  <span className="font-semibold text-foreground">Just Right ({fitPercent}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-sage/10 overflow-hidden">
                  <div className="h-full bg-sage" style={{ width: `${fitPercent}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">Length</span>
                  <span className="font-semibold text-foreground">Just Right ({lengthPercent}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-sage/10 overflow-hidden">
                  <div className="h-full bg-sage" style={{ width: `${lengthPercent}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">Transparency</span>
                  <span className="font-semibold text-foreground">Low ({transparencyPercent}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-sage/10 overflow-hidden">
                  <div className="h-full bg-sage" style={{ width: `${transparencyPercent}%` }} />
                </div>
              </div>
            </div>
          </div> */}

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                Customer Photos ({photoItems.length})
              </h3>
              {photoItems.length > 4 && (
                <button
                  type="button"
                  onClick={handleOpenAllPhotos}
                  className="text-sm font-semibold text-sage hover:underline"
                >
                  View All Photos
                </button>
              )}
            </div>
            {previewPhotos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No photos yet. Be the first to share your product photo.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {previewPhotos.map((photoItem, index) => {
                  const isOverlayTile = index === previewPhotos.length - 1 && extraPhotoCount > 0;
                  return (
                    <button
                      key={`${photoItem.url}-${index}`}
                      type="button"
                      onClick={() =>
                        isOverlayTile ? handleOpenAllPhotos() : openPhotoViewer(index)
                      }
                      className="relative aspect-square overflow-hidden rounded-lg border border-border"
                    >
                      <img
                        src={getImageUrl(photoItem.url)}
                        alt={`Customer photo ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      {isOverlayTile && (
                        <div className="absolute inset-0 bg-black/55 text-white flex items-center justify-center text-xl font-semibold">
                          +{extraPhotoCount}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                Customer Reviews ({reviewCount})
              </h3>
              {reviewCount > REVIEW_PREVIEW_LIMIT && (
                <button
                  type="button"
                  onClick={handleOpenAllReviews}
                  className="inline-flex items-center rounded-md border border-[#D5DDCF] px-3 py-1.5 text-sm font-semibold text-sage transition-colors hover:bg-[#F3F6F1]"
                >
                  View All Reviews
                </button>
              )}
            </div>

            {previewReviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                No reviews yet. Be the first to review this product.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {previewReviews.map((review) => (
                  <div key={review.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {(review.username || 'Verified Buyer')} | {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded bg-sage px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        {Math.round(review.rating)}★
                      </div>
                      <p className="text-base text-foreground leading-relaxed">{review.body}</p>
                    </div>
                    {review.imageUrls?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pl-9">
                        {review.imageUrls.slice(0, 4).map((imageUrl, imageIndex) => {
                          const photoIndex = getPhotoIndexByUrl(imageUrl);
                          return (
                            <button
                              key={`${review.id}-${imageIndex}`}
                              type="button"
                              className="h-20 w-20 overflow-hidden rounded border border-border"
                              onClick={() => {
                                if (photoIndex >= 0) {
                                  openPhotoViewer(photoIndex);
                                }
                              }}
                            >
                              <img
                                src={getImageUrl(imageUrl)}
                                alt={`Review image ${imageIndex + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {allPhotosModalOpen && (
          <div className="fixed inset-0 z-[70] bg-black/60 p-4 sm:p-6">
            <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="text-lg font-semibold text-foreground">All Customer Photos</h3>
                <button
                  type="button"
                  onClick={() => setAllPhotosModalOpen(false)}
                  className="rounded p-1 text-muted-foreground hover:bg-sage/10 hover:text-foreground"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {allReviewsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading photos...</p>
                ) : photoItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No customer photos available.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                    {photoItems.map((photoItem, index) => (
                      <button
                        key={`${photoItem.url}-${index}`}
                        type="button"
                        onClick={() => {
                          setAllPhotosModalOpen(false);
                          openPhotoViewer(index);
                        }}
                        className="aspect-square overflow-hidden rounded-lg border border-border"
                      >
                        <img
                          src={getImageUrl(photoItem.url)}
                          alt={`Customer photo ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {allReviewsModalOpen && (
          <div className="fixed inset-0 z-[70] bg-black/60 p-4 sm:p-6">
            <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="text-lg font-semibold text-foreground">All Customer Reviews</h3>
                <button
                  type="button"
                  onClick={() => setAllReviewsModalOpen(false)}
                  className="rounded p-1 text-muted-foreground hover:bg-sage/10 hover:text-foreground"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {allReviewsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reviews available.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {reviews.map((review) => (
                      <div key={review.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {(review.username || 'Verified Buyer')} | {formatReviewDate(review.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="rounded bg-sage px-1.5 py-0.5 text-[11px] font-semibold text-white">
                            {Math.round(review.rating)}★
                          </div>
                          <p className="text-base text-foreground leading-relaxed">{review.body}</p>
                        </div>
                        {review.imageUrls?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pl-9">
                            {review.imageUrls.map((imageUrl, imageIndex) => {
                              const photoIndex = getPhotoIndexByUrl(imageUrl);
                              return (
                                <button
                                  key={`${review.id}-all-${imageIndex}`}
                                  type="button"
                                  className="h-20 w-20 overflow-hidden rounded border border-border"
                                  onClick={() => {
                                    if (photoIndex >= 0) {
                                      setAllReviewsModalOpen(false);
                                      openPhotoViewer(photoIndex);
                                    }
                                  }}
                                >
                                  <img
                                    src={getImageUrl(imageUrl)}
                                    alt={`Review image ${imageIndex + 1}`}
                                    className="h-full w-full object-cover"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {photoViewerOpen && currentPhotoItem && (
          <div className="fixed inset-0 z-[80] bg-black/70 p-4">
            <div className="mx-auto flex h-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="relative flex-1 bg-[#2A3047] p-5">
                <button
                  type="button"
                  onClick={() => setPhotoViewerOpen(false)}
                  className="absolute left-4 top-4 z-10 rounded p-1 text-white/90 hover:bg-white/15"
                >
                  <FiX size={22} />
                </button>

                {photoItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPreviousPhoto}
                      className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={showNextPhoto}
                      className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </>
                )}

                <div className="flex h-full items-center justify-center">
                  <img
                    src={getImageUrl(currentPhotoItem.url)}
                    alt="Customer uploaded"
                    className="max-h-full max-w-full rounded-lg object-contain"
                  />
                </div>
              </div>

              <div className="hidden w-[340px] flex-col gap-4 overflow-y-auto bg-white p-5 md:flex">
                <div className="rounded bg-sage px-2 py-1 text-xs font-semibold text-white w-fit">
                  {Math.round(currentPhotoItem.review.rating)}★
                </div>
                {currentPhotoItem.review.title && (
                  <p className="text-sm font-semibold text-foreground">
                    {currentPhotoItem.review.title}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {currentPhotoItem.review.body}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(currentPhotoItem.review.username || 'Verified Buyer')} |{' '}
                  {formatReviewDate(currentPhotoItem.review.createdAt)}
                </p>

                <div className="mt-2 grid grid-cols-4 gap-2">
                  {photoItems.slice(0, 8).map((photoItem, index) => (
                    <button
                      key={`${photoItem.url}-thumb-${index}`}
                      type="button"
                      onClick={() => setActivePhotoIndex(index)}
                      className={`aspect-square overflow-hidden rounded border ${
                        index === activePhotoIndex ? 'border-sage ring-1 ring-sage/40' : 'border-border'
                      }`}
                    >
                      <img
                        src={getImageUrl(photoItem.url)}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
