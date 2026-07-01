// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSearch } from 'react-icons/fi';
// // import { useAuth } from '../hooks/useAuth';
// import useAuth from '../../hooks/useAuth';
// import { useAppSelector } from '../../hooks/useAuth';
// import { logout } from '../../store/slices/authSlice';
// import toast from 'react-hot-toast';
// import logo from '../../assets/logo.png';
// const Navbar = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, user, isAdmin, dispatch } = useAuth();
//   const { totalItems } = useAppSelector((state) => state.cart);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     toast.success('Logged out successfully');
//     navigate('/');
//     setIsUserMenuOpen(false);
//   };

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled ? 'glass-card shadow-xl' : 'bg-transparent'
//       }`}
//     >
//       <div className="mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           {/* Logo */}
// <Link to="/" className="flex items-center">
//   <motion.img
//     src={logo}
//     alt="Styliste Logo"
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//     className="h-12 w-auto object-contain"
//   />
// </Link>


//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="text-dark-200 hover:text-white transition-colors">
//               Home
//             </Link>
//             <Link to="/products" className="text-dark-200 hover:text-white transition-colors">
//               Products
//             </Link>
//             <Link to="/about" className="text-dark-200 hover:text-white transition-colors">
//               About us
//             </Link>
//             <Link to="/services" className="text-dark-200 hover:text-white transition-colors">
//               Services
//             </Link>
//             <Link to="/contact" className="text-dark-200 hover:text-white transition-colors">
//               Contact us
//             </Link>
//             {isAuthenticated && !isAdmin && (
//               <Link to="/dashboard" className="text-dark-200 hover:text-white transition-colors">
//                 Dashboard
//               </Link>
//             )}
//             {isAdmin && (
//               <Link to="/admin" className="text-dark-200 hover:text-white transition-colors">
//                 Admin
//               </Link>
//             )}
//           </div>

//           {/* Right Side Actions */}
//           <div className="hidden md:flex items-center space-x-4">
//             {/* Search Icon */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => navigate('/products')}
//               className="p-2 text-dark-200 hover:text-white transition-colors"
//             >
//               <FiSearch size={22} />
//             </motion.button>

//             {/* Cart */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => navigate('/cart')}
//               className="relative p-2 text-dark-200 hover:text-white transition-colors"
//             >
//               <FiShoppingCart size={22} />
//               {totalItems > 0 && (
//                 <motion.span
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
//                 >
//                   {totalItems}
//                 </motion.span>
//               )}
//             </motion.button>

//             {/* User Menu */}
//             {isAuthenticated ? (
//               <div className="relative">
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                   className="flex items-center space-x-2 p-2 rounded-xl glass-card-hover"
//                 >
//                   <FiUser size={20} />
//                   <span className="text-sm font-medium">{user?.name}</span>
//                 </motion.button>

//                 <AnimatePresence>
//                   {isUserMenuOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-xl overflow-hidden"
//                     >
//                       <Link
//                         to={isAdmin ? '/admin' : '/dashboard'}
//                         onClick={() => setIsUserMenuOpen(false)}
//                         className="block px-4 py-3 hover:bg-white/5 transition-colors"
//                       >
//                         Dashboard
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center space-x-2 text-red-400"
//                       >
//                         <FiLogOut size={18} />
//                         <span>Logout</span>
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-3">
//                 <Link to="/login">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="btn-ghost px-4 py-2"
//                   >
//                     Login
//                   </motion.button>
//                 </Link>
//                 <Link to="/signup">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="btn-primary px-4 py-2"
//                   >
//                     Sign Up
//                   </motion.button>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <motion.button
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 text-dark-200 hover:text-white"
//           >
//             {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//           </motion.button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden glass-card border-t border-white/10"
//           >
//             <div className="px-4 py-4 space-y-3">
//               <Link
//                 to="/"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block py-2 text-dark-200 hover:text-white transition-colors"
//               >
//                 Home
//               </Link>
//               <Link
//                 to="/products"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block py-2 text-dark-200 hover:text-white transition-colors"
//               >
//                 Products
//               </Link>
//               <Link
//                 to="/about"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block py-2 text-dark-200 hover:text-white transition-colors"
//               >
//                 About us
//               </Link>
//               <Link
//                 to="/contact"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block py-2 text-dark-200 hover:text-white transition-colors"
//               >
//                 Contact us
//               </Link>
//               <Link
//                 to="/cart"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block py-2 text-dark-200 hover:text-white transition-colors flex items-center justify-between"
//               >
//                 <span>Cart</span>
//                 {totalItems > 0 && (
//                   <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1">
//                     {totalItems}
//                   </span>
//                 )}
//               </Link>
//               {isAuthenticated ? (
//                 <>
//                   <Link
//                     to={isAdmin ? '/admin' : '/dashboard'}
//                     onClick={() => setIsMenuOpen(false)}
//                     className="block py-2 text-dark-200 hover:text-white transition-colors"
//                   >
//                     Dashboard
//                   </Link>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsMenuOpen(false);
//                     }}
//                     className="w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <div className="space-y-2 pt-2">
//                   <Link to="/login" onClick={() => setIsMenuOpen(false)}>
//                     <button className="w-full btn-ghost py-2">Login</button>
//                   </Link>
//                   <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
//                     <button className="w-full btn-primary py-2">Sign Up</button>
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// };

// export default Navbar;




// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiShoppingCart,
//   FiUser,
//   FiMenu,
//   FiX,
//   FiLogOut,
//   FiSearch,
// } from "react-icons/fi";
// import useAuth from "../../hooks/useAuth";
// import { useAppSelector } from "../../hooks/useAuth";
// import { logout } from "../../store/slices/authSlice";
// import toast from "react-hot-toast";
// import logo from "../../assets/logo.png";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, user, isAdmin, dispatch } = useAuth();
//   const { totalItems } = useAppSelector((state) => state.cart);

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     toast.success("Logged out successfully");
//     navigate("/");
//     setIsUserMenuOpen(false);
//   };

//   return (
//     <motion.nav
//       initial={{ y: -80 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         isScrolled
//           ? "bg-gradient-to-r from-[#7F8F72] via-[#8FA17A] to-[#7F8F72] shadow-xl backdrop-blur"
//           : "bg-gradient-to-r from-[#9CAF88] via-[#A8B79A] to-[#9CAF88]"
//       }`}
//     >
//       <div className="mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           {/* ---------------- LOGO ---------------- */}
//           <Link to="/" className="flex items-center">
//             <motion.img
//               src={logo}
//               alt="Styliste Logo"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="h-12 w-auto object-contain"
//             />
//           </Link>

//           {/* ---------------- DESKTOP NAV ---------------- */}
//           <div className="hidden md:flex items-center space-x-8">
//             {[
//               { name: "Home", path: "/" },
//               { name: "Products", path: "/products" },
//               { name: "About us", path: "/about" },
//               { name: "Services", path: "/services" },
//               { name: "Contact us", path: "/contact" },
//               { name: "Blog", path: "/blog" },
//               { name: "Testimonials", path: "/testimonials" },
//             ].map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className="relative text-white/80 hover:text-white transition-all duration-300
//                   after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-white
//                   after:w-0 hover:after:w-full after:transition-all after:duration-300"
//               >
//                 {item.name}
//               </Link>
//             ))}

//             {isAuthenticated && !isAdmin && (
//               <Link
//                 to="/dashboard"
//                 className="text-white/80 hover:text-white transition-colors"
//               >
//                 Dashboard
//               </Link>
//             )}

//             {isAdmin && (
//               <Link
//                 to="/admin"
//                 className="text-white/80 hover:text-white transition-colors"
//               >
//                 Admin
//               </Link>
//             )}
//           </div>

//           {/* ---------------- RIGHT ACTIONS ---------------- */}
//           <div className="hidden md:flex items-center space-x-4">
//             {/* Search */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => navigate("/products")}
//               className="p-2 text-white/80 hover:text-white"
//             >
//               <FiSearch size={22} />
//             </motion.button>

//             {/* Cart */}
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => navigate("/cart")}
//               className="relative p-2 text-white/80 hover:text-white"
//             >
//               <FiShoppingCart size={22} />
//               {totalItems > 0 && (
//                 <motion.span
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="absolute -top-1 -right-1 bg-white text-[#7F8F72] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
//                 >
//                   {totalItems}
//                 </motion.span>
//               )}
//             </motion.button>

//             {/* User Menu */}
//             {isAuthenticated ? (
//               <div className="relative">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                   className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/10 text-white"
//                 >
//                   <FiUser size={18} />
//                   <span className="text-sm font-medium">{user?.name}</span>
//                 </motion.button>

//                 <AnimatePresence>
//                   {isUserMenuOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       className="absolute right-0 mt-2 w-48 bg-[#7F8F72] rounded-xl shadow-xl overflow-hidden"
//                     >
//                       <Link
//                         to={isAdmin ? "/admin" : "/dashboard"}
//                         onClick={() => setIsUserMenuOpen(false)}
//                         className="block px-4 py-3 text-white/90 hover:bg-white/10"
//                       >
//                         Dashboard
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-3 flex items-center gap-2 text-red-300 hover:bg-white/10"
//                       >
//                         <FiLogOut />
//                         Logout
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-3">
//                 <Link to="/login">
//                   <button className="px-4 py-2 rounded-lg text-white hover:bg-white/10">
//                     Login
//                   </button>
//                 </Link>
//                 <Link to="/signup">
//                   <button className="px-4 py-2 rounded-lg bg-white text-[#7F8F72] font-semibold">
//                     Sign Up
//                   </button>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* ---------------- MOBILE MENU BUTTON ---------------- */}
//           <motion.button
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 text-white"
//           >
//             {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//           </motion.button>
//         </div>
//       </div>

//       {/* ---------------- MOBILE MENU ---------------- */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-gradient-to-b from-[#9CAF88] to-[#7F8F72]"
//           >
//             <div className="px-4 py-4 space-y-3">
//               {[
//                 { name: "Home", path: "/" },
//                 { name: "Products", path: "/products" },
//                 { name: "About us", path: "/about" },
//                 { name: "Contact us", path: "/contact" },
//               ].map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   onClick={() => setIsMenuOpen(false)}
//                   className="block py-2 text-white/80 hover:text-white"
//                 >
//                   {item.name}
//                 </Link>
//               ))}

//               <Link
//                 to="/cart"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="flex justify-between items-center py-2 text-white"
//               >
//                 Cart
//                 {totalItems > 0 && (
//                   <span className="bg-white text-[#7F8F72] text-xs rounded-full px-2 py-1">
//                     {totalItems}
//                   </span>
//                 )}
//               </Link>

//               {isAuthenticated ? (
//                 <>
//                   <Link
//                     to={isAdmin ? "/admin" : "/dashboard"}
//                     onClick={() => setIsMenuOpen(false)}
//                     className="block py-2 text-white/80 hover:text-white"
//                   >
//                     Dashboard
//                   </Link>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsMenuOpen(false);
//                     }}
//                     className="w-full text-left py-2 text-red-300"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <div className="space-y-2 pt-2">
//                   <Link to="/login" onClick={() => setIsMenuOpen(false)}>
//                     <button className="w-full py-2 rounded-lg bg-white/10 text-white">
//                       Login
//                     </button>
//                   </Link>
//                   <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
//                     <button className="w-full py-2 rounded-lg bg-white text-[#7F8F72] font-semibold">
//                       Sign Up
//                     </button>
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// };

// export default Navbar;


import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiHeart,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { useAppSelector } from "../../hooks/useAuth";
import { logout } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import { useWishlist } from "../../context/WishlistContext";
// import { logout } from "../../store/slices/authSlice";
import { clearCart, addToCart } from "../../store/slices/cartSlice";
import { useAppDispatch } from "../../hooks/useAuth";
import { userProfileApi } from "../../api/userProfileApi";
import cartApi from "../../api/cartApi";


const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin, dispatch } = useAuth();
  const { totalItems } = useAppSelector((state) => state.cart);
  const { wishlistIds } = useWishlist();
const location = useLocation();
const isActive = (path: string) => location.pathname === path;
const reduxDispatch = useAppDispatch(); // ✅ for cart actions

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
useEffect(() => {
  // 🔒 Prevent mobile menu glitch on refresh / resize
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsMenuOpen(false);
    }
  };

  handleResize(); // 👈 run once on mount

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
  let isMounted = true;

  const fetchProfileName = async () => {
    if (!isAuthenticated || !user?.id) {
      if (isMounted) setProfileName(null);
      return;
    }

    try {
      const profile = await userProfileApi.getUserProfile(user.id);
      if (isMounted) setProfileName(profile.name);
    } catch (error) {
      console.warn("Failed to fetch profile for navbar", error);
    }
  };

  fetchProfileName();

  const handleProfileUpdated = () => {
    fetchProfileName();
  };

  window.addEventListener("profile:updated", handleProfileUpdated);

  return () => {
    isMounted = false;
    window.removeEventListener("profile:updated", handleProfileUpdated);
  };
}, [isAuthenticated, user?.id]);

// Fetch cart from backend when user logs in
useEffect(() => {
  if (!isAuthenticated) {
    return;
  }

  const fetchCartFromBackend = async () => {
    try {
      const response = await cartApi.getCart();
      const cartData = response.items || [];
      
      // Clear Redux cart and repopulate with backend items
      reduxDispatch(clearCart());
      
      cartData.forEach((item: any) => {
        reduxDispatch(addToCart({
          itemId: item.id,
          productId: item.productId,
          name: item.productName,
          price: item.unitPrice,
          salePrice: undefined,
          quantity: item.quantity,
          image: item.productImage || '',
          stock: item.stock || 999,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        }));
      });
    } catch (error) {
      console.error('Failed to fetch cart on login:', error);
    }
  };

  fetchCartFromBackend();
}, [isAuthenticated, reduxDispatch]);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // if click is inside navbar, ignore
    if (target.closest("#navbar-root")) return;

    setIsUserMenuOpen(false);
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


const handleLogout = async () => {
  // 🔥 clear Redux cart state
  reduxDispatch(clearCart());

  // 🔥 clear auth + storage
  dispatch(logout());

  toast.success("Logged out successfully");
  navigate("/");
  setIsUserMenuOpen(false);
};

  return (
    <>
      {/* ---------------- NAVBAR ---------------- */}
<nav
 id="navbar-root"
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled
      ? "bg-gradient-to-r from-[#5E6E54] via-[#6B7D60] to-[#5E6E54] shadow-xl backdrop-blur"
      : "bg-gradient-to-r from-[#6B7D60] via-[#7A8D6D] to-[#6B7D60]"
  }`}
>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* ---------------- LOGO ---------------- */}
            <Link to="/" className="flex items-center">
              <motion.img
                src={logo}
                alt="Styliste Couturier Logo"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-12 w-15 object-contain"
              />
            </Link>

            {/* ---------------- DESKTOP NAV ---------------- */}
            {/* <div className="hidden md:flex items-center space-x-8"> */}
              <div className="hidden md:flex items-center space-x-8">
  {/* PUBLIC PAGES — ONLY FOR NON-ADMIN */}
{/* PUBLIC NAV — SHOW TO USERS & ADMINS OUTSIDE ADMIN PANEL */}
{(!isAdmin || !isAdminRoute) &&
  [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Contact us", path: "/contact" },
    { name: "Testimonials", path: "/testimonials" },
    ...(isAuthenticated
      ? [{ name: "Measurements", path: "/measurements" }]
      : []),
  ].map((item) => (
    <Link
      key={item.name}
      to={item.path}
      className={`relative transition-all duration-300
        ${
          isActive(item.path)
            ? "text-white font-medium after:w-full"
            : "text-white/80 hover:text-white after:w-0"
        }
        after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-white
        after:transition-all after:duration-300`}
    >
      {item.name}
    </Link>
  ))}
</div>
            {/* ---------------- RIGHT ACTIONS ---------------- */}
            <div className="hidden md:flex items-center space-x-4">
{!isAdmin && (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => navigate("/wishlist")}
    className="relative p-2 text-white/80 hover:text-white"
  >
    <FiHeart size={22} />

    {wishlistIds.length > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 bg-white text-[#7F8F72] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
      >
        {wishlistIds.length}
      </motion.span>
    )}
  </motion.button>
)}
             {!isAdmin && (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => navigate("/cart")}
    className="relative p-2 text-white/80 hover:text-white"
  >
    <FiShoppingCart size={22} />
    {totalItems > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 bg-white text-[#7F8F72] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
      >
        {totalItems}
      </motion.span>
    )}
  </motion.button>
)}


              <div
  className="relative"
  onClick={(e) => e.stopPropagation()}
>
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
    className="p-2 text-white/80 hover:text-white"
  >
    <FiUser size={22} />
  </motion.button>

  <AnimatePresence initial={false}>
    {isUserMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute right-0 mt-2 w-48 bg-[#7F8F72] rounded-xl shadow-xl overflow-hidden z-[999]
md:right-0 md:w-48
max-md:fixed max-md:top-20 max-md:left-4 max-md:right-4 max-md:w-auto"
      >

        {/* 🔓 NOT LOGGED IN */}
        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              onClick={() => setIsUserMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsUserMenuOpen(false)}
              className="block px-4 py-3 text-white hover:bg-white/10"
            >
              Create New Account
            </Link>
          </>
        )}

        {/* 🔐 LOGGED IN */}
        {isAuthenticated && (
          <>
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-white/70 text-sm">Hello,</p>
              <p className="text-white font-semibold">{profileName || user?.name || "User"}</p>
            </div>

            {!isAdmin && (
              <>
                <button
                  onClick={() => {
                    navigate("/dashboard", { state: { tab: "profile" } });
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 font-light text-sm"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard", { state: { tab: "orders" } });
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 font-light text-sm"
                >
                  Orders
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard", { state: { tab: "appointments" } });
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 font-light text-sm"
                >
                  Appointments
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard", { state: { tab: "addresses" } });
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 font-light text-sm"
                >
                  Address
                </button>
                  <button
                    onClick={() => {
                      navigate("/measurements/history");
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-white hover:bg-white/10 font-light text-sm"
                >
                  Measurements
                </button> 
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="block px-4 py-3 text-white hover:bg-white/10"
                >
                  Dashboard
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 flex items-center gap-2 text-red-300 hover:bg-white/10"
            >
              <FiLogOut />
              Logout
            </button>
          </>
        )}
      </motion.div>
    )}
  </AnimatePresence>
</div>
            </div>

            {/* ---------------- MOBILE MENU BUTTON ---------------- */}
            {/* ---------------- MOBILE RIGHT ICONS ---------------- */}
<div className="flex items-center gap-3 md:hidden relative z-[60]">
  {!isAdmin && (
    <button
      onClick={() => navigate("/wishlist")}
      className="relative text-white"
    >
      <FiHeart size={20} />
      {wishlistIds.length > 0 && (
        <span className="absolute -top-1 -right-2 bg-white text-[#7F8F72] text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {wishlistIds.length}
        </span>
      )}
    </button>
  )}

  {!isAdmin && (
    <button
      onClick={() => navigate("/cart")}
      className="relative text-white"
    >
      <FiShoppingCart size={20} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-2 bg-white text-[#7F8F72] text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {totalItems}
        </span>
      )}
    </button>
  )}

  <button
    onClick={() => {
  setIsUserMenuOpen((prev) => !prev);
}}
    className="text-white"
  >
    <FiUser size={20} />
  </button>

  {/* Hamburger */}
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="text-white"
  >
    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
  </motion.button>

</div>
          </div>
        </div>

        {/* MOBILE USER MENU DROPDOWN */}
<AnimatePresence initial={false}>
  {isUserMenuOpen && !isMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden bg-[#6B7D60] border-t border-white/10"
    >
      <div className="px-4 py-3 space-y-2">
        {isAuthenticated ? (
          <>
            <p className="text-white/70 text-sm font-medium mb-3">
              {profileName || user?.name || "User"}
            </p>
            <Link
              to={isAdmin ? "/admin" : "/dashboard"}
              onClick={() => {
                setIsUserMenuOpen(false);
              }}
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            {/* (Admin Settings moved to dashboard) */}
            <button
              onClick={() => {
                handleLogout();
                setIsUserMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 flex items-center gap-2 text-red-300 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiLogOut />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => {
                setIsUserMenuOpen(false);
              }}
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => {
                setIsUserMenuOpen(false);
              }}
              className="block px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>

        {/* ---------------- MOBILE MENU ---------------- */}
 {/* ---------------- MOBILE MENU ---------------- */}
<AnimatePresence initial={false}>
  {isMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden bg-gradient-to-b from-[#9CAF88] to-[#7F8F72]"
    >
     {/* 🔒 MOBILE ONLY CONTENT */}
<div className="px-4 py-4 space-y-3 md:hidden">

  {/* ===== MOBILE ICON ROW ===== */}
  <div className="flex items-center justify-around mb-4">

    {!isAdmin && (
      <button
        onClick={() => {
          navigate("/wishlist");
          setIsMenuOpen(false);
        }}
        className="relative text-white"
      >
        <FiHeart size={22} />
        {wishlistIds.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-white text-[#7F8F72] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {wishlistIds.length}
          </span>
        )}
      </button>
    )}

    {!isAdmin && (
      <button
        onClick={() => {
          navigate("/cart");
          setIsMenuOpen(false);
        }}
        className="relative text-white"
      >
        <FiShoppingCart size={22} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-2 bg-white text-[#7F8F72] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </button>
    )}

   <button
  onClick={(e) => {
    e.stopPropagation();
    setIsUserMenuOpen((prev) => !prev);
  }}
  className="text-white"
>
      <FiUser size={22} />
    </button>

  </div>

  {/* ========== ADMIN MOBILE VIEW ONLY ========== */}
  {isAdmin && (
    <>
      <Link
        to="/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setIsMenuOpen(false)}
        className="block py-2 text-white font-semibold"
      >
        Home
      </Link>

      <Link
        to="/admin"
        onClick={() => setIsMenuOpen(false)}
        className="block py-2 text-white font-semibold"
      >
        Dashboard
      </Link>
    </>
  )}
        {/* ========== NON-ADMIN MOBILE VIEW ========== */}
        {!isAdmin &&
          [
            { name: "Home", path: "/" },
            { name: "About us", path: "/about" },
            {name: "Products", path: "/products" },
            { name: "Services", path: "/services" },
            { name: "Blog", path: "/blog" },
            { name: "Testimonials", path: "/testimonials" },
            { name: "Contact us", path: "/contact" },
            ...(isAuthenticated
              ? [{ name: "Measurements", path: "/measurements" }]
              : []),
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-white/80 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>


      </nav>

      {/* ---------------- NAVBAR SPACER (IMPORTANT FIX) ---------------- */}
      <div className="h-20" />

      {/* ---------------- TRY ON SETTINGS MODAL REMOVED ---------------- */}
    </>
  );
};
export default Navbar;

