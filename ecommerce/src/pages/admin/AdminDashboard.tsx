// import { useState, useEffect } from 'react';
// import { Routes, Route, Link, useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   FiHome,
//   FiPackage,
//   FiShoppingBag,
//   FiUsers,
//   FiCalendar,
//   FiTrendingUp,
//   FiDollarSign,
//   FiShoppingCart,
// } from 'react-icons/fi';
// import Navbar from '../../components/layout/Navbar';
// import AdminProducts from './AdminProducts';
// import AdminOrders from './AdminOrders';
// import { orderApi } from '../../api/orderApi';
// import { appointmentApi } from '../../api/appointmentApi';
// // import Appointment from './AdminAppointment';
// import type { OrderStatistics, AppointmentStatistics } from '../../types';
// import toast from 'react-hot-toast';
// // import Appointment from './AdminAppoinment';
// import { AppointmentCalendar } from "./AdminAppointment";



// const AdminOverview = () => {
//   const [orderStats, setOrderStats] = useState<OrderStatistics | null>(null);
//   const [appointmentStats, setAppointmentStats] = useState<AppointmentStatistics | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStatistics();
//   }, []);

//   const fetchStatistics = async () => {
//     setLoading(true);
//     try {
//       const [orders, appointments] = await Promise.all([
//         orderApi.getOrderStatistics(),
//         appointmentApi.getAppointmentStatistics(),
//       ]);
//       setOrderStats(orders);
//       setAppointmentStats(appointments);
//     } catch (error: any) {
//       toast.error('Failed to fetch statistics');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[...Array(8)].map((_, i) => (
//           <div key={i} className="glass-card rounded-2xl h-32 shimmer" />
//         ))}
//       </div>
//     );
//   }

//   const statsCards = [
//     {
//       title: 'Total Orders',
//       value: orderStats?.totalOrders || 0,
//       icon: FiShoppingCart,
//       color: 'text-blue-400',
//       bgColor: 'bg-blue-500/20',
//     },
//     {
//       title: 'Pending Orders',
//       value: orderStats?.pendingOrders || 0,
//       icon: FiPackage,
//       color: 'text-yellow-400',
//       bgColor: 'bg-yellow-500/20',
//     },
//     {
//       title: 'Shipped Orders',
//       value: orderStats?.shippedOrders || 0,
//       icon: FiTrendingUp,
//       color: 'text-purple-400',
//       bgColor: 'bg-purple-500/20',
//     },
//     {
//       title: 'Delivered Orders',
//       value: orderStats?.deliveredOrders || 0,
//       icon: FiShoppingBag,
//       color: 'text-green-400',
//       bgColor: 'bg-green-500/20',
//     },
//     {
//       title: 'Total Appointments',
//       value: appointmentStats?.totalAppointments || 0,
//       icon: FiCalendar,
//       color: 'text-primary-400',
//       bgColor: 'bg-primary-500/20',
//     },
//     {
//       title: 'Pending Appointments',
//       value: appointmentStats?.pendingAppointments || 0,
//       icon: FiCalendar,
//       color: 'text-orange-400',
//       bgColor: 'bg-orange-500/20',
//     },
//     {
//       title: 'Confirmed',
//       value: appointmentStats?.confirmedAppointments || 0,
//       icon: FiCalendar,
//       color: 'text-blue-400',
//       bgColor: 'bg-blue-500/20',
//     },
//     {
//       title: 'Completed',
//       value: appointmentStats?.completedAppointments || 0,
//       icon: FiCalendar,
//       color: 'text-green-400',
//       bgColor: 'bg-green-500/20',
//     },
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statsCards.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               whileHover={{ y: -4 }}
//               className="glass-card-hover rounded-2xl p-6"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`p-3 ${stat.bgColor} rounded-xl`}>
//                   <Icon className={stat.color} size={24} />
//                 </div>
//                 <div className="text-right">
//                   <p className="text-3xl font-bold gradient-text">{stat.value}</p>
//                 </div>
//               </div>
//               <p className="text-dark-400 text-sm">{stat.title}</p>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Quick Actions */}
//       <div className="glass-card rounded-2xl p-6">
//         <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Link to="/admin/products">
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full btn-primary flex items-center justify-center space-x-2"
//             >
//               <FiPackage />
//               <span>Manage Products</span>
//             </motion.button>
//           </Link>
//           <Link to="/admin/orders">
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full btn-ghost flex items-center justify-center space-x-2"
//             >
//               <FiShoppingBag />
//               <span>View Orders</span>
//             </motion.button>
//           </Link>
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="w-full btn-ghost flex items-center justify-center space-x-2"
//           >
//             <FiUsers />
//             <span>Manage Users</span>
//           </motion.button>
//         </div>
//       </div>

//       {/* Recent Activity Placeholder */}
//       <div className="glass-card rounded-2xl p-6">
//         <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="flex items-center space-x-4 p-4 glass-card rounded-xl">
//               <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
//               <div className="flex-1">
//                 <p className="text-white font-semibold">New order received</p>
//                 <p className="text-sm text-dark-400">Order #100{i} - $149.99</p>
//               </div>
//               <span className="text-xs text-dark-500">{i}h ago</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const location = useLocation();

//   const navItems = [
//     { path: '/admin', label: 'Overview', icon: FiHome },
//     { path: '/admin/products', label: 'Products', icon: FiPackage },
//     { path: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
//     { path: '/admin/users', label: 'Users', icon: FiUsers },
//    { path: '/admin/appointments', label:'Appointments', icon:FiCalendar }
//   ];

//   return (
//     <div className="min-h-screen bg-dark-950">
//       <Navbar />

//       <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-display font-bold text-white mb-2">
//             Admin Dashboard
//           </h1>
//           <p className="text-dark-400">Manage your store, products, and customers</p>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;
//             return (
//               <Link key={item.path} to={item.path}>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap ${
//                     isActive
//                       ? 'bg-primary-500 text-white'
//                       : 'glass-card hover:bg-white/10 text-dark-300'
//                   }`}
//                 >
//                   <Icon size={20} />
//                   <span>{item.label}</span>
//                 </motion.button>
//               </Link>
//             );
//           })}
//         </div>

//         {/* Routes */}
//         <Routes>
//           <Route index element={<AdminOverview />} />
//           <Route path="products" element={<AdminProducts />} />
//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="appointments" element={<AppointmentCalendar />} />
//           <Route
//             path="users"
//             element={
//               <div className="glass-card rounded-2xl p-12 text-center">
//                 <FiUsers className="mx-auto text-dark-600 mb-4" size={48} />
//                 <p className="text-dark-400">User management coming soon</p>
//               </div>
//             }
//           />
//           <Route
//             path="appointments"
//             element={
//               <div className="glass-card rounded-2xl p-12 text-center">
//                 <FiCalendar className="mx-auto text-dark-600 mb-4" size={48} />
//                 <p className="text-dark-400">Appointment management coming soon</p>
//               </div>
//             }
//           />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiCalendar,
  FiTrendingUp,
  FiShoppingCart,
  FiXCircle,        // ❌ Cancelled
  FiCornerDownLeft, // ↩ Returned
  FiTruck,
  FiRotateCcw,
} from 'react-icons/fi';

import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import { orderApi } from '../../api/orderApi';
import { appointmentApi } from '../../api/appointmentApi';

import type { OrderStatistics, AppointmentStatistics, Order, Appointment } from '../../types';
import toast from 'react-hot-toast';

// IMPORTANT — Correct Import
import AdminAppointment from './AdminAppointment';
import AdminTryOnSettings from './AdminTryOnSettings';

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-500/20 text-yellow-600';
    case 'PROCESSING':
      return 'bg-blue-500/20 text-blue-600';
    case 'SHIPPED':
      return 'bg-purple-500/20 text-purple-600';
    case 'OUT_FOR_DELIVERY':
      return 'bg-indigo-500/20 text-indigo-600';
    case 'DELIVERED':
      return 'bg-green-500/20 text-green-600';
    case 'RETURNED':
      return 'bg-orange-500/20 text-orange-600';
    case 'CONFIRMED':
      return 'bg-blue-500/20 text-blue-600';
    case 'COMPLETED':
      return 'bg-green-500/20 text-green-600';
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-600';
    default:
      return 'bg-gray-500/20 text-gray-600';
  }
};

const AdminOverview = () => {
  const [orderStats, setOrderStats] = useState<OrderStatistics | null>(null);
  const [appointmentStats, setAppointmentStats] = useState<AppointmentStatistics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const [
        orderStatsRes,
        appointmentStatsRes,
        ordersRes,
        appointmentsRes,
      ] = await Promise.all([
        orderApi.getOrderStatistics(),
        appointmentApi.getAppointmentStatistics(),

        // ✅ RECENT 3 (latest)
        orderApi.getAllOrders(0, 3),
        appointmentApi.getAllAppointments(0, 3),
      ]);

      setOrderStats(orderStatsRes);
      setAppointmentStats(appointmentStatsRes);

      setRecentOrders(ordersRes?.content || []);
      setRecentAppointments(appointmentsRes?.content || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl h-32 shimmer" />
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Orders',
      value: orderStats?.totalOrders || 0,
      icon: FiShoppingCart,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Pending Orders',
      value: orderStats?.pendingOrders || 0,
      icon: FiPackage,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
    {
      title: 'Shipped Orders',
      value: orderStats?.shippedOrders || 0,
      icon: FiTrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      title: 'Delivered Orders',
      value: orderStats?.deliveredOrders || 0,
      icon: FiShoppingBag,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    // ✅ NEW — Cancelled Orders
    {
      title: 'Cancelled Orders',
      value: orderStats?.cancelledOrders || 0,
      icon: FiXCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
    },
    {
      title: 'Out for Delivery',
      value: orderStats?.outForDeliveryOrders || 0,
      icon: FiTruck,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
    },
    {
      title: 'Returned Orders',
      value: orderStats?.returnedOrders || 0,
      icon: FiRotateCcw,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },

    {
      title: 'Processing Orders',
      value: orderStats?.processingOrders || 0,
      icon: FiCornerDownLeft,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/20',
    },
    {
      title: 'Total Appointments',
      value: appointmentStats?.totalAppointments || 0,
      icon: FiCalendar,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/20',
    },
    {
      title: 'Pending Appointments',
      value: appointmentStats?.pendingAppointments || 0,
      icon: FiCalendar,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
    {
      title: 'Confirmed',
      value: appointmentStats?.confirmedAppointments || 0,
      icon: FiCalendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Completed',
      value: appointmentStats?.completedAppointments || 0,
      icon: FiCalendar,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header - Added back for overview page */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-dark-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-dark-600">
          Manage your store, products, and customers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card-hover rounded-2xl p-6 border border-dark-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <Icon className={stat.color} size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                </div>
              </div>
              <p className="text-dark-600 text-sm">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= RECENT ORDERS ================= */}
        <div className="glass-card rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-900">
              Recent Orders
            </h2>

            <Link
              to="/admin/orders"
              className="text-sm font-medium text-primary-500 hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Orders */}
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-dark-600 text-sm text-center">
                No recent orders
              </p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 glass-card rounded-xl border border-dark-200"
                >
                  {/* Left */}
                  <div>
                    <p className="text-dark-900 font-semibold">
                      Order #{order.orderNumber ?? order.id}
                    </p>

                    <p className="text-sm text-dark-600">
                      ₹{order.totalAmount}
                    </p>

                    {/* Products */}
                    <div className="mt-1 space-y-0.5">
                      {order.items?.map((item: any) => (
                        <p
                          key={item.id}
                          className="text-xs text-dark-500"
                        >
                          {item.productName} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full
                                border border-white/10
                                backdrop-blur-sm
                                whitespace-nowrap
                                ${getStatusClasses(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= RECENT APPOINTMENTS ================= */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-900">
              Recent Appointments
            </h2>

            <Link
              to="/admin/appointments" // Fixed: Changed from /admin/orders to /admin/appointments
              className="text-sm font-medium text-primary-500 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentAppointments.length === 0 ? (
              <p className="text-dark-600 text-sm text-center">
                No recent appointments
              </p>
            ) : (
              recentAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between p-4 glass-card rounded-xl border border-dark-200"
                >
                  {/* LEFT INFO */}
                  <div>
                    <p className="text-dark-900 font-semibold">
                      {appt.name}
                    </p>

                    <p className="text-sm text-dark-600">
                      {appt.serviceType.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-dark-500">
                      {appt.appointmentDate} at {appt.appointmentTime?.slice(0, 5)}
                    </p>
                  </div>

                  {/* STATUS BADGE (RIGHT END) */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(appt.status)}`}
                  >
                    {appt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-dark-900 mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/admin/products">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <FiPackage />
              <span>Manage Products</span>
            </motion.button>
          </Link>

          <Link to="/admin/orders">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-ghost flex items-center justify-center space-x-2 h-12 rounded-3xl ring-1 ring-[#8FAE8B] hover:bg-primary-50 hover:ring-[#7E9F7A] text-dark-800 transition-all"
            >
              <FiShoppingBag />
              <span>View Orders</span>
            </motion.button>
          </Link>

          <Link to="/admin/users">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-ghost flex items-center justify-center space-x-2 h-12 rounded-3xl ring-1 ring-[#8FAE8B] hover:bg-primary-50 hover:ring-[#7E9F7A] text-dark-800 transition-all"
            >
              <FiUsers />
              <span>Manage Users</span>
            </motion.button>
          </Link>

          {/* ✅ New View Appointments Button */}
          <Link to="/admin/appointments">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-ghost flex items-center justify-center space-x-2 h-12 rounded-3xl ring-1 ring-[#8FAE8B] hover:bg-primary-50 hover:ring-[#7E9F7A] text-dark-800 transition-all"
            >
              <FiCalendar />
              <span>View Appointments</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Content Area - No padding needed since AdminLayout already has padding */}
      <div className="pb-12">
        {/* Routes */}
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="appointments" element={<AdminAppointment />} />
          <Route path="try-on-settings" element={<AdminTryOnSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
