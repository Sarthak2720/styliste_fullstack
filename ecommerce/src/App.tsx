// import { useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAppDispatch } from './hooks/useAuth';
// import { loadUserFromStorage } from './store/slices/authSlice';
// import { loadCartFromStorage } from './store/slices/cartSlice';

// // Public Pages
// import HomePage from './pages/public/HomePage';
// import LoginPage from './pages/auth/LoginPage';
// import SignUpPage from './pages/auth/SignUpPage';
// import ProductsPage from './pages/public/ProductsPage';
// import ProductDetailPage from './pages/public/ProductDetailPage';
// import CartPage from './pages/public/CartPage';
// import CheckoutPage from './pages/public/CheckoutPage';
// import About from './pages/public/About';
// import Contact from './pages/public/ContactUs';
// import Appointment from './pages/public/Appointment';

// // User & Admin Pages
// import UserDashboard from './pages/user/UserDashboard';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ProtectedRoute from './components/common/ProtectedRoute';


// const NotFound = () => <div className="p-8 text-center text-red-500">404 - Page Not Found</div>;

// function App() {
//   const dispatch = useAppDispatch();

//   // Load user and cart from localStorage on app mount
//   useEffect(() => {
//     dispatch(loadUserFromStorage());
//     dispatch(loadCartFromStorage());
//   }, [dispatch]);

//   return (
//     <div className="min-h-screen bg-dark-950 text-dark-50">
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/home" element={<Navigate to="/" replace />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignUpPage />} />
//         <Route path="/products" element={<ProductsPage />} />
//         <Route path="/products/:id" element={<ProductDetailPage />} />
//         <Route path="/cart" element={<CartPage />} />
//         <Route path="/checkout" element={<CheckoutPage />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/appointment" element={<Appointment />} />

//         {/* Protected User Routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <UserDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* Protected Admin Routes */}
//         <Route
//           path="/admin/*"
//           element={
//             <ProtectedRoute requireAdmin>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* Fallback */}
//         <Route path="/404" element={<NotFound />} />
//         <Route path="*" element={<Navigate to="/404" replace />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;


// import { useEffect } from 'react';
// import { /* BrowserRouter, */ Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useAppDispatch } from './hooks/useAuth';
// import { loadUserFromStorage } from './store/slices/authSlice';
// import { loadCartFromStorage } from './store/slices/cartSlice';
// import { FloatingAppointmentButton } from "./pages/public/FloatingAppointmentButton";
// import { useAppSelector } from "./hooks/useAuth";

// // Public Pages
// import HomePage from './pages/public/HomePage';
// import LoginPage from './pages/auth/LoginPage';
// import SignUpPage from './pages/auth/SignUpPage';
// import ProductsPage from './pages/public/ProductsPage';
// import ProductDetailPage from './pages/public/ProductDetailPage';
// import CartPage from './pages/public/CartPage';
// import CheckoutPage from './pages/public/CheckoutPage';
// import About from './pages/public/About';
// import Contact from './pages/public/ContactUs';
// import Appointment from './pages/public/AppointmentBooking';
// import SizeGuide from './pages/public/SizeGuide';
// import services from './pages/public/Services';
// import PrivacyPolicy from './pages/public/PrivacyPolicy';
// import TermsOfService from './pages/public/TermsAndConditions';
// import RefundPolicy from './pages/public/RefundPolicy';
// import Testimonial from './pages/public/Testimonial';
// // import sustainability from './pages/public/SustainabilityComingSoon';

// // User & Admin Pages
// import UserDashboard from './pages/user/UserDashboard';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ProtectedRoute from './components/common/ProtectedRoute';
// import { WhatsAppButton } from './pages/public/WhatsAppButton';
// import SustainabilityComingSoon from './pages/public/SustainabilityComingSoon';
// import ComingSoon from './pages/public/ShippingCommingSoon';
// import ShippingCommingSoon from './pages/public/ShippingCommingSoon';
// import ReturnCommingSoon from './pages/public/ReturnCommingSoon';



// const NotFound = () => (
//   <div className="p-8 text-center text-red-500">
//     404 - Page Not Found
//   </div>
// );

// // 👉 Scroll To Top on Route Change
// function ScrollToTop() {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// }

// function App() {
//   const dispatch = useAppDispatch();
// const { user, isAuthenticated } = useAppSelector((state) => state.auth);
//   const isAdmin = user?.role === "ADMIN";
//   // Load user and cart from localStorage on app mount
//   useEffect(() => {
//     dispatch(loadUserFromStorage());
//     dispatch(loadCartFromStorage());
//   }, [dispatch]);

//   return (
    
//     <div className="min-h-screen bg-dark-950 text-dark-50">
//       {/* Scroll To Top Component */}
//       <ScrollToTop />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/home" element={<Navigate to="/" replace />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignUpPage />} />
//         <Route path="/products" element={<ProductsPage />} />
//         <Route path="/products/:id" element={<ProductDetailPage />} />
//         <Route path="/cart" element={<CartPage />} />
//         <Route path="/checkout" element={<CheckoutPage />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/appointment" element={<Appointment />} />
//         <Route path="/sizeGuide" element={<SizeGuide />} />
//         <Route path="/services" element={services()} />
//         <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//         <Route path="/terms-of-service" element={<TermsOfService />} />
//         <Route path="/refund-policy" element={<RefundPolicy />} />
//         <Route path="/testimonials" element={<Testimonial />} />
//         <Route path="/sustainability" element={<SustainabilityComingSoon />} />
//         <Route path="/shipping" element={<ShippingCommingSoon />} />
//         <Route path="/returns" element={<ReturnCommingSoon />} />
        

//         {/* Protected User Routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <UserDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* Protected Admin Routes */}
//        <Route
//   path="/admin/*"
//   element={
//     <ProtectedRoute requireAdmin>
//       <AdminDashboard />
//     </ProtectedRoute>
//   }
// />

//         {/* Fallback */}
//         <Route path="/404" element={<NotFound />} />
//         <Route path="*" element={<Navigate to="/404" replace />} />
//       </Routes>
//       {/* Floating buttons only for non-admin */}
// {(!isAuthenticated || !isAdmin) && (
//   <>
//     <FloatingAppointmentButton />
//     <WhatsAppButton />
//   </>
// )}

//     </div>
      
//   );
// }

// export default App;


import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from './hooks/useAuth';
import { loadUserFromStorage } from './store/slices/authSlice';
import { loadCartFromStorage } from './store/slices/cartSlice';
import { FloatingAppointmentButton } from "./pages/public/FloatingAppointmentButton";
import { useAppSelector } from "./hooks/useAuth";

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ProductsPage from './pages/public/ProductsPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';
import PaymentStatusPage from './pages/public/PaymentStatusPage';
import About from './pages/public/About';
import Contact from './pages/public/ContactUs';
import Appointment from './pages/public/AppointmentBooking';
import SizeGuide from './pages/public/SizeGuide';
import services from './pages/public/Services';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsAndConditions';
import RefundPolicy from './pages/public/RefundPolicy';
import Testimonial from './pages/public/Testimonial';
import Wishlist from './pages/public/WishlistPage';
import { WishlistProvider } from "./context/WishlistContext";
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import Blog from './pages/public/Blog';
import BlogPost from './pages/public/BlogPost';
import VirtualTryOn from './pages/public/VirtualTryOn';
// User & Admin Pages
import UserDashboard from './pages/user/UserDashboard';
import OrderDetailsPage from './pages/user/OrderDetailsPage';
import Measurement from './pages/public/Measurement';
import MeasurementsHistory from './pages/user/MeasurementsHistory';
import MeasurementDetailPage from './pages/user/MeasurementDetailPage';

// Admin Components
import AdminLayout from './components/layout/AdminLayout';
// import AdminDashboardContent from './pages/admin/AdminDashboardContent'; // We'll create this
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReturns from './pages/admin/AdminReturns';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAppointment from './pages/admin/AdminAppointment';
import ContactMessages from './pages/admin/ContactMessages';

import ProtectedRoute from './components/common/ProtectedRoute';
import { MeasurementJobProvider } from './context/MeasurementJobContext';
import { WhatsAppButton } from './pages/public/WhatsAppButton';
import SustainabilityComingSoon from './pages/public/SustainabilityComingSoon';
import ShippingCommingSoon from './pages/public/ShippingCommingSoon';
import ReturnCommingSoon from './pages/public/ReturnCommingSoon';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMeasurements from './pages/admin/AdminMeasurements';
import AdminBlogCreate from './pages/admin/AdminBlogCreate';
import AdminTryOnSettings from './pages/admin/AdminTryOnSettings';

const NotFound = () => (
  <div className="p-8 text-center text-red-500">
    404 - Page Not Found
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN";
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  useEffect(() => {
    dispatch(loadUserFromStorage());
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  return (
    <WishlistProvider>
      <MeasurementJobProvider>
    <div className="min-h-screen bg-dark-950 text-dark-50">
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/sizeGuide" element={<SizeGuide />} />
        <Route path="/services" element={services()} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/testimonials" element={<Testimonial />} />
        <Route path="/sustainability" element={<SustainabilityComingSoon />} />
        <Route path="/shipping" element={<ShippingCommingSoon />} />
        <Route path="/returns" element={<ReturnCommingSoon />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/virtual-try-on/:id" element={<VirtualTryOn />} />
        <Route
          path="/measurements"
          element={
            <ProtectedRoute>
              <Measurement />
            </ProtectedRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-status"
          element={
            <ProtectedRoute>
              <PaymentStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/measurements/history"
          element={
            <ProtectedRoute>
              <MeasurementsHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/measurements/:id"
          element={
            <ProtectedRoute>
              <MeasurementDetailPage />
            </ProtectedRoute>
          }
        />

{/* Admin Routes */}
<Route
  path="/admin/*"
  element={
    <ProtectedRoute requireAdmin>
      <AdminLayout />
    </ProtectedRoute>
  }
>

  <Route index element={<AdminDashboard />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="orders" element={<AdminOrders />} />
  <Route path="returns" element={<AdminReturns />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="appointments" element={<AdminAppointment />} />
  <Route path="contacts" element={<ContactMessages />} />
  <Route path="measurements" element={<AdminMeasurements />} />
  <Route path="blogs" element={<AdminBlogCreate />} />
  <Route path="reports" element={<div className="p-6">Reports Page</div>} />
  <Route path="settings" element={<div className="p-6">Settings Page</div>} />
  <Route path="try-on-settings" element={<AdminTryOnSettings />} />
</Route>

        {/* Fallback */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {/* Floating buttons only for non-admin */}
      {(!isAuthenticated || !isAdmin) && !isAuthRoute && (
        <>
          <FloatingAppointmentButton />
          <WhatsAppButton />
        </>
      )}
    </div>
      </MeasurementJobProvider>
    </WishlistProvider>
  );
}

export default App;
