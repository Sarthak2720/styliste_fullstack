// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPackage, FiTruck, /* FiCheck, */ FiX, FiEye } from 'react-icons/fi';
// import { orderApi } from '../../api/orderApi';
// import type { Order } from '../../types';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';
// import { formatINR } from '../../utils/currency';

// const AdminOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [filterStatus, setFilterStatus] = useState<string>('ALL');
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [updateStatusModal, setUpdateStatusModal] = useState(false);
//   const [newStatus, setNewStatus] = useState('');
//   const [trackingNumber, setTrackingNumber] = useState('');

//   useEffect(() => {
//     fetchOrders();
//   }, [filterStatus]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await orderApi.getAllOrders(0, 50);
//       let filteredOrders = response.content;

//       if (filterStatus !== 'ALL') {
//         filteredOrders = filteredOrders.filter((order) => order.status === filterStatus);
//       }

//       setOrders(filteredOrders);
//     } catch (error: any) {
//       toast.error('Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!selectedOrder || !newStatus) {
//       toast.error('Please select a status');
//       return;
//     }

//     try {
//       await orderApi.updateOrderStatus(selectedOrder.id, {
//         status: newStatus,
//         trackingNumber: trackingNumber || undefined,
//       });
//       toast.success('Order status updated successfully');
//       setUpdateStatusModal(false);
//       setSelectedOrder(null);
//       setNewStatus('');
//       setTrackingNumber('');
//       fetchOrders();
//     } catch (error: any) {
//       toast.error('Failed to update order status');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       PENDING: 'bg-yellow-500/20 text-yellow-400',
//       PROCESSING: 'bg-blue-500/20 text-blue-400',
//       SHIPPED: 'bg-purple-500/20 text-purple-400',
//       DELIVERED: 'bg-green-500/20 text-green-400',
//       CANCELLED: 'bg-red-500/20 text-red-400',
//       RETURNED: 'bg-orange-500/20 text-orange-400',
//     };
//     return colors[status] || 'bg-dark-700 text-dark-300';
//   };

//   const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];
//   const filterOptions = ['ALL', ...statusOptions];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">Order Management</h2>
//           <p className="text-dark-600 mt-1">{orders.length} orders</p>
//         </div>

//         {/* Filter */}
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="input-field w-full sm:w-auto"
//         >
//           {filterOptions.map((status) => (
//             <option key={status} value={status}>
//               {status === 'ALL' ? 'All Orders' : status}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Orders List */}
//       {loading ? (
//         <div className="space-y-4">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="glass-card rounded-2xl h-32 shimmer" />
//           ))}
//         </div>
//       ) : orders.length === 0 ? (
//         <div className="glass-card rounded-2xl p-12 text-center ring-1 ring-[#8FAE8B]">
//           <FiPackage className="mx-auto text-dark-600 mb-4" size={48} />
//           <p className="text-dark-600">No orders found</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <motion.div
//               key={order.id}
//               whileHover={{ x: 4 }}
//               className="glass-card-hover rounded-2xl p-6 ring-1 ring-[#8FAE8B]"
//             >
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div className="flex-1">
//                   <div className="flex flex-wrap items-center gap-2 mb-2">
//   <h3 className="text-lg font-semibold text-dark-900">
//     Order #{order.id}
//   </h3>

//   {/* Order Status */}
//   <span
//     className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(order.status)}`}
//   >
//     Order: {order.status}
//   </span>

//   {/* Payment Status */}
//   <span
//     className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(order.paymentStatus)}`}
//   >
//     Payment: {order.paymentStatus}
//   </span>
// </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-dark-600">
//                     <p>📅 {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</p>
//                     <p>💰 {formatINR(order.totalAmount)}</p>
//                     <p>📦 {order.items.length} items</p>
//                     {order.trackingNumber && <p>🚚 {order.trackingNumber}</p>}
//                   </div>

//                   {order.shippingAddress && (
//                     <p className="text-sm text-dark-600 mt-2 line-clamp-1">
//                       📍 {order.shippingAddress}
//                     </p>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex items-center space-x-2">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       setSelectedOrder(order);
//                       setShowDetailsModal(true);
//                     }}
//                     className="p-3 glass-card rounded-xl ring-1 ring-[#8FAE8B] hover:bg-primary-50 transition-colors"
//                     title="View Details"
//                   >
//                     <FiEye className="text-primary-400" />
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       setSelectedOrder(order);
//                       setNewStatus(order.status);
//                       setTrackingNumber(order.trackingNumber || '');
//                       setUpdateStatusModal(true);
//                     }}
//                     className="p-3 glass-card rounded-xl ring-1 ring-[#8FAE8B] hover:bg-primary-50 transition-colors"
//                     title="Update Status"
//                   >
//                     <FiTruck className="text-green-400" />
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Order Details Modal */}
//       <AnimatePresence>
//         {showDetailsModal && selectedOrder && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowDetailsModal(false)}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-dark-900">Order #{selectedOrder.id}</h2>
//                   <button onClick={() => setShowDetailsModal(false)}>
//                     <FiX size={24} className="text-dark-400 hover:text-dark-900" />
//                   </button>
//                 </div>

//                 <div className="space-y-6">
//                   {/* Order Info */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-dark-400 mb-1">Status</p>
//                       <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
//                         {selectedOrder.status}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm text-dark-400 mb-1">Payment Status</p>
//                       <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(selectedOrder.paymentStatus)}`}>
//                         {selectedOrder.paymentStatus}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-sm text-dark-400 mb-1">Order Date</p>
//                       <p className="text-dark-900 font-semibold">
//                         {format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy HH:mm')}
//                       </p>
//                     </div>
//                     <div>
//   <p className="text-sm text-dark-400 mb-1">Total Amount</p>
//   <p className="text-dark-900 font-semibold">
//     {formatINR(selectedOrder.totalAmount)}
//   </p>
// </div>

//                   </div>

//                   {/* Shipping Address */}
//                   <div>
//                     <p className="text-sm text-dark-400 mb-2">Shipping Address</p>
//                     <div className="glass-card p-4 rounded-xl ring-1 ring-[#8FAE8B]">
//                       <p className="text-dark-900">{selectedOrder.shippingAddress}</p>
//                     </div>
//                   </div>

//                   {/* Order Items */}
//                   <div>
//                     <p className="text-sm text-dark-400 mb-2">Order Items</p>
//                     <div className="space-y-3">
//                       {selectedOrder.items.map((item) => (
//   <div
//     key={item.id}
//     className="glass-card p-4 rounded-xl flex gap-4 items-center"
//   >
//     {/* 🖼 Product Image */}
//     <div className="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-[#8FAE8B] flex-shrink-0">
//       <img
//        src={(item as any)?.productImage || '/placeholder.jpg'}
//         alt={item.productName}
//         className="w-full h-full object-cover"
//       />
//     </div>

//     {/* 📦 Product Info */}
//     <div className="flex-1">
//       <p className="text-dark-900 font-semibold">
//         {item.productName}
//       </p>

//       <p className="text-sm text-dark-500">
//         Qty: {item.quantity} × {formatINR(item.unitPrice)}
//       </p>

//       {/* Size & Colour */}
//       {(item.selectedSize || item.selectedColor) && (
//         <div className="flex gap-2 mt-2">
//           {item.selectedSize && (
//             <span className="text-xs px-2 py-1 bg-dark-800 rounded">
//               Size: {item.selectedSize}
//             </span>
//           )}
//           {item.selectedColor && (
//             <span className="text-xs px-2 py-1 bg-dark-800 rounded">
//               Colour: {item.selectedColor}
//             </span>
//           )}
//         </div>
//       )}
//     </div>

//     {/* 💰 Price */}
//     <div className="text-right">
//       <p className="text-dark-900 font-semibold">
//         {formatINR(item.totalPrice)}
//       </p>
//     </div>
//   </div>
// ))}

//                     </div>
//                   </div>

//                   {/* Tracking */}
//                   {selectedOrder.trackingNumber && (
//                     <div>
//                       <p className="text-sm text-dark-400 mb-2">Tracking Number</p>
//                       <div className="glass-card p-4 rounded-xl ring-1 ring-[#8FAE8B]">
//                         <p className="text-dark-900 font-mono">{selectedOrder.trackingNumber}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Update Status Modal */}
//       <AnimatePresence>
//         {updateStatusModal && selectedOrder && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setUpdateStatusModal(false)}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="glass-card rounded-2xl p-6 max-w-md w-full"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-dark-900">Update Order Status</h2>
//                   <button onClick={() => setUpdateStatusModal(false)}>
//                     <FiX size={24} className="text-dark-400 hover:text-dark-900" />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-semibold text-dark-300 mb-2 block">
//                       Order Status
//                     </label>
//                     <select
//                       value={newStatus}
//                       onChange={(e) => setNewStatus(e.target.value)}
//                       className="input-field"
//                     >
//                       {statusOptions.map((status) => (
//                         <option key={status} value={status}>
//                           {status}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-sm font-semibold text-dark-300 mb-2 block">
//                       Tracking Number (Optional)
//                     </label>
//                     <input
//                       type="text"
//                       value={trackingNumber}
//                       onChange={(e) => setTrackingNumber(e.target.value)}
//                       placeholder="Enter tracking number"
//                       className="input-field"
//                     />
//                   </div>

//                   <div className="flex space-x-3 pt-4">
//                     <button onClick={handleUpdateStatus} className="flex-1 btn-primary">
//                       Update Status
//                     </button>
//                     <button
//                       onClick={() => setUpdateStatusModal(false)}
//                       className="flex-1 btn-ghost"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminOrders;

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiPackage, FiTruck, /* FiCheck, */ FiX, FiEye, FiLoader } from 'react-icons/fi';
// import { orderApi } from '../../api/orderApi';
// import type { Order } from '../../types';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';
// import { formatINR } from '../../utils/currency';

// // --- ADDED SERVER URL CONSTANT ---
// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// const Spinner = () => (
//   <div className="flex justify-center items-center p-12">
//     <FiLoader className="animate-spin text-primary-500" size={40} />
//   </div>
// );

// const AdminOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [filterStatus, setFilterStatus] = useState<string>('ALL');
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [updateStatusModal, setUpdateStatusModal] = useState(false);
//   const [newStatus, setNewStatus] = useState('');
//   const [trackingNumber, setTrackingNumber] = useState('');

//   // --- HELPER TO CONSTRUCT IMAGE URL ---
//   const getProductImageUrl = (imagePath: string | null) => {
//     if (!imagePath) return '/placeholder.jpg';
//     // If it's already a full URL (starts with http), return as is
//     if (imagePath.startsWith('http')) return imagePath;
//     // Otherwise prepend server URL
//     return `${SERVER_URL}${imagePath}`;
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [filterStatus]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await orderApi.getAllOrders(0, 50);
//       let filteredOrders = response.content || response;
//       if (filterStatus !== 'ALL') {
//         filteredOrders = filteredOrders.filter((order: Order) => order.status === filterStatus);
//       }
//       setOrders(filteredOrders);
//     } catch (error: any) {
//       toast.error('Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrderDetails = async (orderId: number) => {
//     setModalLoading(true);
//     setSelectedOrder(null);
//     setShowDetailsModal(true);
//     try {
//       const fullOrderData = await orderApi.getOrderById(orderId);
//       setSelectedOrder(fullOrderData);
//     } catch (error: any) {
//       toast.error('Failed to fetch order details');
//       setShowDetailsModal(false);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!selectedOrder || !newStatus) {
//       toast.error('Please select a status');
//       return;
//     }
//     try {
//       await orderApi.updateOrderStatus(selectedOrder.id, {
//         status: newStatus,
//         trackingNumber: trackingNumber || undefined,
//       });
//       toast.success('Order status updated successfully');
//       setUpdateStatusModal(false);
//       fetchOrders();
//     } catch (error: any) {
//       toast.error('Failed to update order status');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       PENDING: 'bg-yellow-500/20 text-yellow-400',
//       PROCESSING: 'bg-blue-500/20 text-blue-400',
//       SHIPPED: 'bg-purple-500/20 text-purple-400',
//       DELIVERED: 'bg-green-500/20 text-green-400',
//       CANCELLED: 'bg-red-500/20 text-red-400',
//       RETURNED: 'bg-orange-500/20 text-orange-400',
//     };
//     return colors[status] || 'bg-dark-700 text-dark-300';
//   };

//   const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];
//   const filterOptions = ['ALL', ...statusOptions];

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">Order Management</h2>
//           <p className="text-dark-600 mt-1">{orders.length} orders</p>
//         </div>
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="input-field w-full sm:w-auto"
//         >
//           {filterOptions.map((status) => (
//             <option key={status} value={status}>
//               {status === 'ALL' ? 'All Orders' : status}
//             </option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <div className="space-y-4">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="glass-card rounded-2xl h-32 shimmer" />
//           ))}
//         </div>
//       ) : orders.length === 0 ? (
//         <div className="glass-card rounded-2xl p-12 text-center ring-1 ring-[#8FAE8B]">
//           <FiPackage className="mx-auto text-dark-600 mb-4" size={48} />
//           <p className="text-dark-600">No orders found</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <motion.div
//               key={order.id}
//               whileHover={{ x: 4 }}
//               className="glass-card-hover rounded-2xl p-6 ring-1 ring-[#8FAE8B]"
//             >
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div className="flex-1">
//                   <div className="flex flex-wrap items-center gap-2 mb-2">
//                     <h3 className="text-lg font-semibold text-dark-900">Order #{order.id}</h3>
//                     <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(order.status)}`}>
//                       {order.status}
//                     </span>
//                     <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(order.paymentStatus)}`}>
//                        {order.paymentStatus}
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-dark-600">
//                     <p>📅 {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</p>
//                     <p>💰 {formatINR(order.totalAmount)}</p>
//                     <p>📦 {order.items.length} items</p>
//                     {order.trackingNumber && <p>🚚 {order.trackingNumber}</p>}
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => fetchOrderDetails(order.id)}
//                     className="p-3 glass-card rounded-xl ring-1 ring-[#8FAE8B] hover:bg-primary-50 transition-colors"
//                   >
//                     <FiEye className="text-primary-400" />
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       setSelectedOrder(order);
//                       setNewStatus(order.status);
//                       setTrackingNumber(order.trackingNumber || '');
//                       setUpdateStatusModal(true);
//                     }}
//                     className="p-3 glass-card rounded-xl ring-1 ring-[#8FAE8B] hover:bg-primary-50 transition-colors"
//                   >
//                     <FiTruck className="text-green-400" />
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Order Details Modal */}
//       <AnimatePresence>
//         {showDetailsModal && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowDetailsModal(false)}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-dark-900">Order #{selectedOrder?.id || '...'}</h2>
//                   <button onClick={() => setShowDetailsModal(false)}>
//                     <FiX size={24} className="text-dark-400 hover:text-dark-900" />
//                   </button>
//                 </div>

//                 {modalLoading || !selectedOrder ? (
//                   <Spinner />
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 glass-card p-4 rounded-xl bg-dark-50/50">
//                       <div>
//                         <p className="text-sm text-dark-400 mb-1">Status</p>
//                         <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
//                           {selectedOrder.status}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="text-sm text-dark-400 mb-1">Payment</p>
//                         <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(selectedOrder.paymentStatus)}`}>
//                           {selectedOrder.paymentStatus}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="text-sm text-dark-400 mb-1">User ID</p>
//                         <p className="text-dark-900 font-semibold">{selectedOrder.userId}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-dark-400 mb-1">Created At</p>
//                         <p className="text-dark-900 font-semibold">{format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy HH:mm')}</p>
//                       </div>
//                       {selectedOrder.updatedAt && (
//                         <div>
//                             <p className="text-sm text-dark-400 mb-1">Last Updated</p>
//                             <p className="text-dark-900 font-semibold">{format(new Date(selectedOrder.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
//                         </div>
//                       )}
//                       <div>
//                         <p className="text-sm text-dark-400 mb-1">Tracking Info</p>
//                         <p className="text-dark-900 font-semibold font-mono">{selectedOrder.trackingNumber || 'N/A'}</p>
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="text-md font-semibold text-dark-900 mb-2">Shipping Details</h3>
//                       <div className="glass-card p-4 rounded-xl ring-1 ring-[#8FAE8B] bg-dark-50/50">
//                         <p className="text-dark-900 whitespace-pre-wrap">{selectedOrder.shippingAddress}</p>
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="text-md font-semibold text-dark-900 mb-3">Order Items</h3>
//                       <div className="space-y-3 mb-4">
//                         {selectedOrder.items.map((item) => (
//                           <div key={item.id} className="glass-card p-3 rounded-xl flex gap-4 items-center bg-white/50">
//                             <div className="w-14 h-14 rounded-lg overflow-hidden ring-1 ring-[#8FAE8B]/50 flex-shrink-0 bg-gray-100">
//                               {/* --- UPDATED IMAGE SRC LOGIC --- */}
//                               <img
//                                 src={getProductImageUrl((item as any)?.productImage)}
//                                 alt={(item as any)?.productName || 'Product'}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg' }}
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <p className="text-dark-900 font-medium line-clamp-1">{(item as any)?.productName || `Item #${item.id}`}</p>
//                               <div className="flex gap-2 mt-1 text-xs text-dark-500">
//                                 <span>Qty: {item.quantity}</span>
//                                 {(item as any)?.selectedSize && <span>• Size: {(item as any).selectedSize}</span>}
//                                 {(item as any)?.selectedColor && <span>• Color: {(item as any).selectedColor}</span>}
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-dark-900 font-medium">{formatINR(item.totalPrice)}</p>
//                               <p className="text-xs text-dark-500">({formatINR(item.unitPrice)} ea)</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="glass-card p-4 rounded-xl ring-1 ring-[#8FAE8B] bg-primary-50/30 ml-auto max-w-xs">
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between text-dark-600">
//                             <span>Subtotal (Approx):</span>
//                             <span>{formatINR(Number(selectedOrder.totalAmount) - Number(selectedOrder.tax || 0) + Number(selectedOrder.discount || 0))}</span>
//                           </div>
//                           {Number(selectedOrder.discount || 0) > 0 && (
//                             <div className="flex justify-between text-green-600">
//                               <span>Discount:</span>
//                               <span>- {formatINR(selectedOrder.discount || 0)}</span>
//                             </div>
//                           )}
//                           <div className="flex justify-between text-dark-600">
//                             <span>Tax:</span>
//                             <span>{formatINR(selectedOrder.tax || 0)}</span>
//                           </div>
//                           <div className="border-t border-[#8FAE8B]/30 pt-2 mt-2 flex justify-between text-base font-bold text-dark-900">
//                             <span>Total Amount:</span>
//                             <span>{formatINR(selectedOrder.totalAmount)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {updateStatusModal && selectedOrder && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setUpdateStatusModal(false)} className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
//                 className="glass-card rounded-2xl p-6 max-w-md w-full"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-dark-900">Update Order Status</h2>
//                   <button onClick={() => setUpdateStatusModal(false)}>
//                     <FiX size={24} className="text-dark-400 hover:text-dark-900" />
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-semibold text-dark-300 mb-2 block">Order Status</label>
//                     <select
//                       value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
//                       className="input-field"
//                     >
//                       {statusOptions.map((status) => (
//                         <option key={status} value={status}>{status}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-sm font-semibold text-dark-300 mb-2 block">Tracking Number (Optional)</label>
//                     <input
//                       type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)}
//                       placeholder="Enter tracking number" className="input-field"
//                     />
//                   </div>
//                   <div className="flex space-x-3 pt-4">
//                     <button onClick={handleUpdateStatus} className="flex-1 btn-primary">Update Status</button>
//                     <button onClick={() => setUpdateStatusModal(false)} className="flex-1 btn-ghost">Cancel</button>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminOrders;

// import { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiEye, FiEdit2, FiTrash2, FiX, FiSearch, FiPackage, FiTruck, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiLoader } from 'react-icons/fi';
// import { orderApi } from '../../api/orderApi';
// import type { Order } from '../../types';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';
// import { formatINR } from '../../utils/currency';

// const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

// const Spinner = () => (
//   <div className="flex justify-center items-center p-12">
//     <FiLoader className="animate-spin text-sage" size={40} />
//   </div>
// );

// const AdminOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   // Modal states
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [updateStatusModal, setUpdateStatusModal] = useState(false);
//   const [newStatus, setNewStatus] = useState('');
//   const [trackingNumber, setTrackingNumber] = useState('');

//   // Column filters
//   const [columnFilters, setColumnFilters] = useState({
//     product: '',
//     orderId: '',
//     orderStatus: '',
//     paymentStatus: '',
//     status: ''
//   });

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalOrders, setTotalOrders] = useState(0);

//   const getProductImageUrl = (imagePath: string | null) => {
//     if (!imagePath) return '/placeholder.jpg';
//     if (imagePath.startsWith('http')) return imagePath;
//     return `${SERVER_URL}${imagePath}`;
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [page, rowsPerPage]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const offset = (page - 1) * rowsPerPage;
//       const response = await orderApi.getAllOrders(offset, rowsPerPage);

//       let filteredOrders = response.content || response;
//       setTotalOrders(response.totalElements || filteredOrders.length);

//       // Apply column filters
//       if (columnFilters.product) {
//         filteredOrders = filteredOrders.filter((order: Order) =>
//           order.items.some(item =>
//             (item as any)?.productName?.toLowerCase().includes(columnFilters.product.toLowerCase())
//           )
//         );
//       }

//       if (columnFilters.orderId) {
//         filteredOrders = filteredOrders.filter((order: Order) =>
//           order.id.toString().includes(columnFilters.orderId)
//         );
//       }

//       if (columnFilters.orderStatus && columnFilters.orderStatus !== 'ALL') {
//         filteredOrders = filteredOrders.filter((order: Order) =>
//           order.status === columnFilters.orderStatus
//         );
//       }

//       if (columnFilters.paymentStatus && columnFilters.paymentStatus !== 'ALL') {
//         filteredOrders = filteredOrders.filter((order: Order) =>
//           order.paymentStatus === columnFilters.paymentStatus
//         );
//       }

//       setOrders(filteredOrders);
//     } catch (error: any) {
//       toast.error('Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1);
//   };

//   // Apply filters when they change
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchOrders();
//     }, 300); // Debounce for 300ms

//     return () => clearTimeout(timeoutId);
//   }, [columnFilters]);

//   const fetchOrderDetails = async (orderId: number) => {
//     setModalLoading(true);
//     setSelectedOrder(null);
//     setShowDetailsModal(true);
//     try {
//       const fullOrderData = await orderApi.getOrderById(orderId);
//       setSelectedOrder(fullOrderData);
//     } catch (error: any) {
//       toast.error('Failed to fetch order details');
//       setShowDetailsModal(false);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!selectedOrder || !newStatus) {
//       toast.error('Please select a status');
//       return;
//     }
//     try {
//       await orderApi.updateOrderStatus(selectedOrder.id, {
//         status: newStatus,
//         trackingNumber: trackingNumber || undefined,
//       });
//       toast.success('Order status updated successfully');
//       setUpdateStatusModal(false);
//       fetchOrders();
//     } catch (error: any) {
//       toast.error('Failed to update order status');
//     }
//   };

//   // const handleDeleteOrder = async (orderId: number) => {
//   //   if (window.confirm('Are you sure you want to delete this order?')) {
//   //     try {
//   //       await orderApi.deleteOrder(orderId);
//   //       toast.success('Order deleted successfully');
//   //       fetchOrders();
//   //     } catch (error: any) {
//   //       toast.error('Failed to delete order');
//   //     }
//   //   }
//   // };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       PENDING: 'text-yellow-700 bg-yellow-100',
//       PROCESSING: 'text-blue-700 bg-blue-100',
//       SHIPPED: 'text-purple-700 bg-purple-100',
//       DELIVERED: 'text-green-700 bg-green-100',
//       CANCELLED: 'text-red-700 bg-red-100',
//       RETURNED: 'text-orange-700 bg-orange-100',
//     };
//     return colors[status] || 'text-gray-700 bg-gray-100';
//   };

//   const getPaymentColor = (status: string) => {
//     const colors: Record<string, string> = {
//       PAID: 'text-green-700 bg-green-100',
//       PENDING: 'text-yellow-700 bg-yellow-100',
//       FAILED: 'text-red-700 bg-red-100',
//       REFUNDED: 'text-blue-700 bg-blue-100',
//     };
//     return colors[status] || 'text-gray-700 bg-gray-100';
//   };

//   const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];
//   const paymentOptions = ['PAID', 'PENDING', 'FAILED', 'REFUNDED'];

//   const totalPages = Math.ceil(totalOrders / rowsPerPage);

//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">Order Management</h2>
//           <p className="text-dark-600 mt-1">{totalOrders} orders total</p>
//         </div>

//         {/* Export Button */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             Export all orders
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TABLE WITH COLUMN FILTERS --- */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-dark-200">
//           <thead className="bg-dark-50">
//             <tr>
//               {/* PRODUCT Column with filter */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>PRODUCT</span>
//                   <input
//                     type="text"
//                     placeholder="Search Product"
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.product}
//                     onChange={(e) => handleColumnFilterChange('product', e.target.value)}
//                   />
//                 </div>
//               </th>

//               {/* ORDER ID Column with filter */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>ORDER ID</span>
//                   <input
//                     type="text"
//                     placeholder="Search Order ID"
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.orderId}
//                     onChange={(e) => handleColumnFilterChange('orderId', e.target.value)}
//                   />
//                 </div>
//               </th>

//               {/* ORDER STATUS Column with filter */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>ORDER STATUS</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.orderStatus}
//                     onChange={(e) => handleColumnFilterChange('orderStatus', e.target.value)}
//                   >
//                     <option value="">All</option>
//                     {statusOptions.map(status => (
//                       <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                 </div>
//               </th>

//               {/* PAYMENT STATUS Column with filter */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>PAYMENT STATUS</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.paymentStatus}
//                     onChange={(e) => handleColumnFilterChange('paymentStatus', e.target.value)}
//                   >
//                     <option value="">All</option>
//                     {paymentOptions.map(status => (
//                       <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                 </div>
//               </th>

//               {/* ACTIONS Column */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 ACTIONS
//               </th>
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-dark-200">
//             {loading ? (
//               <tr>
//                 <td colSpan={5} className="px-6 py-12 text-center text-dark-500">
//                   Loading orders...
//                 </td>
//               </tr>
//             ) : orders.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="px-6 py-12 text-center text-dark-500">
//                   <FiPackage className="mx-auto text-gray-400 mb-2" size={32} />
//                   No orders found
//                 </td>
//               </tr>
//             ) : (
//               orders.map((order) => (
//                 <tr key={order.id} className="hover:bg-dark-50">
//                   {/* PRODUCT Column */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       {order.items[0] && (
//                         <div className="h-10 w-10 flex-shrink-0 mr-3">
//                           <img
//                             src={getProductImageUrl((order.items[0] as any)?.productImage)}
//                             alt={(order.items[0] as any)?.productName || 'Product'}
//                             className="h-10 w-10 rounded object-cover"
//                           />
//                         </div>
//                       )}
//                       <div>
//                         <div className="text-sm font-medium text-dark-900">
//                           {(order.items[0] as any)?.productName || `Order #${order.id}`}
//                         </div>
//                         <div className="text-xs text-dark-500">
//                           Qty: {order.items.reduce((sum, item) => sum + item.quantity, 0)} • {formatINR(order.totalAmount)}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* ORDER ID Column */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-dark-900">#{order.id}</div>
//                     <div className="text-xs text-dark-500">
//                       User ID: {order.userId}
//                     </div>
//                     <div className="text-xs text-dark-500">
//                       {format(new Date(order.createdAt), 'MMM dd, yyyy')}
//                     </div>
//                   </td>

//                   {/* ORDER STATUS Column */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                       {order.status}
//                     </span>
//                     {order.trackingNumber && (
//                       <div className="text-xs text-dark-500 mt-1">
//                         Tracking: {order.trackingNumber}
//                       </div>
//                     )}
//                   </td>

//                   {/* PAYMENT STATUS Column */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.paymentStatus)}`}>
//                       {order.paymentStatus}
//                     </span>
//                   </td>

//                   {/* ACTIONS Column - Icons only */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-1">
//                       <button
//                         onClick={() => fetchOrderDetails(order.id)}
//                         className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                         title="View Details"
//                       >
//                         <FiEye size={16} />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSelectedOrder(order);
//                           setNewStatus(order.status);
//                           setTrackingNumber(order.trackingNumber || '');
//                           setUpdateStatusModal(true);
//                         }}
//                         className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                         title="Update Status"
//                       >
//                         <FiEdit2 size={16} />
//                       </button>
//                       {/* <button
//                         onClick={() => handleDeleteOrder(order.id)}
//                         className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                         title="Delete"
//                       >
//                         <FiTrash2 size={16} />
//                       </button> */}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* --- PAGINATION & ROWS PER PAGE --- */}
//       <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-dark-200 sm:px-6">
//         <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-dark-700">Rows per page:</span>
//             <select
//               className="text-sm border border-dark-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//               value={rowsPerPage}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setPage(1);
//               }}
//             >
//               {rowsPerPageOptions.map(option => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <p className="text-sm text-dark-700">
//               Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
//               <span className="font-medium">{Math.min(page * rowsPerPage, totalOrders)}</span>{' '}
//               of <span className="font-medium">{totalOrders}</span> results
//             </p>
//           </div>
//         </div>

//         <div>
//           <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//             <button
//               onClick={() => setPage(prev => Math.max(1, prev - 1))}
//               disabled={page === 1}
//               className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i + 1)}
//                 className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                   page === i + 1
//                     ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
//                     : 'bg-white border-dark-300 text-dark-500 hover:bg-dark-50'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//               disabled={page === totalPages}
//               className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* --- ORDER DETAILS MODAL --- */}
//       <AnimatePresence>
//         {showDetailsModal && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowDetailsModal(false)}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-dark-900">Order #{selectedOrder?.id || '...'}</h2>
//                   <button onClick={() => setShowDetailsModal(false)}>
//                     <FiX size={24} className="text-dark-400 hover:text-dark-900" />
//                   </button>
//                 </div>

//                 {modalLoading || !selectedOrder ? (
//                   <Spinner />
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 glass-card p-4 rounded-xl bg-dark-50/50">
//                       <div>
//                         <p className="text-sm text-dark-400 mb-1">Status</p>
//                         <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
//                           {selectedOrder.status}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="text-sm text-dark-400 mb-1">Payment</p>
//                         <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getPaymentColor(selectedOrder.paymentStatus)}`}>
//                           {selectedOrder.paymentStatus}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="text-sm text-dark-400 mb-1">User ID</p>
//                         <p className="text-dark-900 font-semibold">{selectedOrder.userId}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-dark-400 mb-1">Created At</p>
//                         <p className="text-dark-900 font-semibold">{format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy HH:mm')}</p>
//                       </div>
//                       {selectedOrder.updatedAt && (
//                         <div>
//                             <p className="text-sm text-dark-400 mb-1">Last Updated</p>
//                             <p className="text-dark-900 font-semibold">{format(new Date(selectedOrder.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
//                         </div>
//                       )}
//                       <div>
//                         <p className="text-sm text-dark-400 mb-1">Tracking Info</p>
//                         <p className="text-dark-900 font-semibold font-mono">{selectedOrder.trackingNumber || 'N/A'}</p>
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="text-md font-semibold text-dark-900 mb-2">Shipping Details</h3>
//                       <div className="glass-card p-4 rounded-xl ring-1 ring-[#8FAE8B] bg-dark-50/50">
//                         <p className="text-dark-900 whitespace-pre-wrap">{selectedOrder.shippingAddress}</p>
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="text-md font-semibold text-dark-900 mb-3">Order Items</h3>
//                       <div className="space-y-3 mb-4">
//                         {selectedOrder.items.map((item) => (
//                           <div key={item.id} className="glass-card p-3 rounded-xl flex gap-4 items-center bg-white/50">
//                             <div className="w-14 h-14 rounded-lg overflow-hidden ring-1 ring-[#8FAE8B]/50 flex-shrink-0 bg-gray-100">
//                               <img
//                                 src={getProductImageUrl((item as any)?.productImage)}
//                                 alt={(item as any)?.productName || 'Product'}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <p className="text-dark-900 font-medium line-clamp-1">{(item as any)?.productName || `Item #${item.id}`}</p>
//                               <div className="flex gap-2 mt-1 text-xs text-dark-500">
//                                 <span>Qty: {item.quantity}</span>
//                                 {(item as any)?.selectedSize && <span>• Size: {(item as any).selectedSize}</span>}
//                                 {(item as any)?.selectedColor && <span>• Color: {(item as any).selectedColor}</span>}
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-dark-900 font-medium">{formatINR(item.totalPrice)}</p>
//                               <p className="text-xs text-dark-500">({formatINR(item.unitPrice)} ea)</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="glass-card p-4 rounded-xl ring-1 ring-[#8FAE8B] bg-primary-50/30 ml-auto max-w-xs">
//                         <div className="space-y-2 text-sm">
//                           <div className="flex justify-between text-dark-600">
//                             <span>Subtotal (Approx):</span>
//                             <span>{formatINR(Number(selectedOrder.totalAmount) - Number(selectedOrder.tax || 0) + Number(selectedOrder.discount || 0))}</span>
//                           </div>
//                           {Number(selectedOrder.discount || 0) > 0 && (
//                             <div className="flex justify-between text-green-600">
//                               <span>Discount:</span>
//                               <span>- {formatINR(selectedOrder.discount || 0)}</span>
//                             </div>
//                           )}
//                           <div className="flex justify-between text-dark-600">
//                             <span>Tax:</span>
//                             <span>{formatINR(selectedOrder.tax || 0)}</span>
//                           </div>
//                           <div className="border-t border-[#8FAE8B]/30 pt-2 mt-2 flex justify-between text-base font-bold text-dark-900">
//                             <span>Total Amount:</span>
//                             <span>{formatINR(selectedOrder.totalAmount)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* --- UPDATE STATUS MODAL --- */}
//       <AnimatePresence>
//         {updateStatusModal && selectedOrder && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setUpdateStatusModal(false)}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="glass-card rounded-2xl p-6 max-w-md w-full"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-dark-900">Update Order Status</h2>
//                   <button onClick={() => setUpdateStatusModal(false)}>
//                     <FiX size={24} className="text-dark-400 hover:text-dark-900" />
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-semibold text-dark-300 mb-2 block">Order Status</label>
//                     <select
//                       value={newStatus}
//                       onChange={(e) => setNewStatus(e.target.value)}
//                       className="input-field"
//                     >
//                       {statusOptions.map((status) => (
//                         <option key={status} value={status}>{status}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-sm font-semibold text-dark-300 mb-2 block">Tracking Number (Optional)</label>
//                     <input
//                       type="text"
//                       value={trackingNumber}
//                       onChange={(e) => setTrackingNumber(e.target.value)}
//                       placeholder="Enter tracking number"
//                       className="input-field"
//                     />
//                   </div>
//                   <div className="flex space-x-3 pt-4">
//                     <button onClick={handleUpdateStatus} className="flex-1 btn-primary">Update Status</button>
//                     <button onClick={() => setUpdateStatusModal(false)} className="flex-1 btn-ghost">Cancel</button>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//         .glass-card {
//           @apply bg-white/95 backdrop-blur-sm;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-dark-800 text-dark-300 font-semibold rounded-lg hover:bg-dark-700 transition-colors;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminOrders;

//

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiEye,
//   FiEdit2,
//   FiTrash2,
//   FiX,
//   FiSearch,
//   FiPackage,
//   FiTruck,
//   FiChevronLeft,
//   FiChevronRight,
//   FiChevronsLeft,
//   FiChevronsRight,
//   FiLoader,
//   FiUser,
//   FiMail,
//   FiPhone,
//   FiClock,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiInfo,
//   FiRefreshCw,
//   FiList,
//   FiCheck,
//   FiXCircle,
//   FiAlertTriangle,
//   FiRotateCcw,
//   FiDollarSign,
//   FiImage,
// } from "react-icons/fi";
// import { orderApi } from "../../api/orderApi";
// import type { Order } from "../../types";
// import { format, formatDistanceToNow } from "date-fns";
// import toast from "react-hot-toast";
// import { formatINR } from "../../utils/currency";

// const SERVER_URL =
//   import.meta.env.VITE_API_IMG_URL || "http://192.168.1.111:8090";

// // Add timeline type
// interface TimelineEvent {
//   status: string;
//   message: string;
//   timestamp: string;
// }

// // Define the complete order journey
// const NORMAL_ORDER_FLOW = [
//   "PENDING",
//   "CONFIRMED",
//   "SHIPPED",
//   "OUT_FOR_DELIVERY",
//   "DELIVERED",
// ] as const;

// const RETURN_FLOW = ["RETURN_REQUESTED", "RETURNED", "REFUNDED"] as const;

// // Status configuration with icons and colors
// const STATUS_CONFIG: Record<
//   string,
//   {
//     label: string;
//     icon: any;
//     color: string;
//     activeColor: string;
//     completedIcon: any;
//     completedColor: string;
//     defaultMessage: string;
//   }
// > = {
//   // Normal flow statuses
//   PENDING: {
//     label: "Order Placed",
//     icon: FiPackage,
//     color: "text-gray-700 bg-gray-100",
//     activeColor: "text-yellow-700 bg-yellow-100 border-yellow-300",
//     completedIcon: FiCheckCircle,
//     completedColor: "text-green-600",
//     defaultMessage: "Order has been placed",
//   },
//   CONFIRMED: {
//     label: "Confirmed",
//     icon: FiCheckCircle,
//     color: "text-gray-700 bg-gray-100",
//     activeColor: "text-blue-700 bg-blue-100 border-blue-300",
//     completedIcon: FiCheckCircle,
//     completedColor: "text-green-600",
//     defaultMessage: "Order has been confirmed",
//   },
//   SHIPPED: {
//     label: "Shipped",
//     icon: FiTruck,
//     color: "text-gray-700 bg-gray-100",
//     activeColor: "text-purple-700 bg-purple-100 border-purple-300",
//     completedIcon: FiCheckCircle,
//     completedColor: "text-green-600",
//     defaultMessage: "Order has been shipped",
//   },
//   OUT_FOR_DELIVERY: {
//     label: "Out for Delivery",
//     icon: FiTruck,
//     color: "text-gray-700 bg-gray-100",
//     activeColor: "text-orange-700 bg-orange-100 border-orange-300",
//     completedIcon: FiCheckCircle,
//     completedColor: "text-green-600",
//     defaultMessage: "Order is out for delivery",
//   },
//   DELIVERED: {
//     label: "Delivered",
//     icon: FiCheckCircle,
//     color: "text-gray-700 bg-gray-100",
//     activeColor: "text-green-700 bg-green-100 border-green-300",
//     completedIcon: FiCheckCircle,
//     completedColor: "text-green-600",
//     defaultMessage: "Order has been delivered",
//   },

//   // Edge case statuses
//   CANCELLED: {
//     label: "Cancelled",
//     icon: FiXCircle,
//     color: "text-red-700 bg-red-100 border-red-300",
//     activeColor: "text-red-700 bg-red-100 border-red-300",
//     completedIcon: FiXCircle,
//     completedColor: "text-red-600",
//     defaultMessage: "Order has been cancelled",
//   },

//   // Return flow statuses
//   RETURN_REQUESTED: {
//     label: "Return Requested",
//     icon: FiRotateCcw,
//     color: "text-blue-700 bg-blue-100 border-blue-300",
//     activeColor: "text-blue-700 bg-blue-100 border-blue-300",
//     completedIcon: FiCheckCircle,
//     completedColor: "text-green-600",
//     defaultMessage: "Return has been requested",
//   },
//   RETURNED: {
//     label: "Returned",
//     icon: FiRotateCcw,
//     color: "text-blue-700 bg-blue-100 border-blue-300",
//     activeColor: "text-blue-700 bg-blue-100 border-blue-300",
//     completedIcon: FiCheckCircle,
//     completedColor: "text-green-600",
//     defaultMessage: "Item has been returned",
//   },
//   REFUNDED: {
//     label: "Refunded",
//     icon: FiDollarSign,
//     color: "text-blue-700 bg-blue-100 border-blue-300",
//     activeColor: "text-green-700 bg-green-100 border-green-300",
//     completedIcon: FiCheckCircle,
//     completedColor: "text-green-600",
//     defaultMessage: "Refund has been processed",
//   },
// };

// const Spinner = () => (
//   <div className="flex justify-center items-center p-12">
//     <FiLoader className="animate-spin text-sage" size={40} />
//   </div>
// );

// const AdminOrders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [timelineLoading, setTimelineLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [orderTimeline, setOrderTimeline] = useState<TimelineEvent[]>([]);

//   // Modal states
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showTimelineModal, setShowTimelineModal] = useState(false);
//   const [updateStatusModal, setUpdateStatusModal] = useState(false);
//   const [newStatus, setNewStatus] = useState("");
//   const [trackingNumber, setTrackingNumber] = useState("");

//   // Column filters
//   const [columnFilters, setColumnFilters] = useState({
//     product: "",
//     orderId: "",
//     orderStatus: "",
//     paymentStatus: "",
//     status: "",
//   });

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalOrders, setTotalOrders] = useState(0);

//   // Helper function to get intelligent timeline
//   const getIntelligentTimeline = (
//     order: Order | null,
//     timelineEvents: TimelineEvent[],
//   ) => {
//     if (!order) return [];

//     const currentStatus = order.status || "PENDING";
//     const isCancelled = currentStatus === "CANCELLED";
//     const isDelivered = currentStatus === "DELIVERED";
//     const hasReturn = timelineEvents.some(
//       (event) =>
//         event.status === "RETURN_REQUESTED" ||
//         event.status === "RETURNED" ||
//         event.status === "REFUNDED",
//     );

//     // Create map of actual timeline events
//     const timelineMap = new Map();
//     timelineEvents.forEach((event) => {
//       timelineMap.set(event.status, {
//         ...event,
//         hasOccurred: true,
//       });
//     });

//     // Determine which statuses to show
//     let statusesToShow = [...NORMAL_ORDER_FLOW];

//     // Add cancelled status if cancelled
//     if (isCancelled) {
//       statusesToShow = ["PENDING", "CANCELLED"];
//     }

//     // Add return flow if delivered and has return
//     if (isDelivered && hasReturn) {
//       statusesToShow = [...NORMAL_ORDER_FLOW, ...RETURN_FLOW];
//     }

//     // Process each status
//     return statusesToShow
//       .map((status) => {
//         const config = STATUS_CONFIG[status];
//         if (!config) return null;

//         const hasOccurred = timelineMap.has(status);
//         const normalFlowIndex = NORMAL_ORDER_FLOW.indexOf(status as any);
//         const currentNormalFlowIndex = NORMAL_ORDER_FLOW.indexOf(
//           currentStatus as any,
//         );

//         // Determine state
//         let state: "completed" | "active" | "pending" | "cancelled" = "pending";
//         let showDetails = false;

//         if (isCancelled) {
//           if (status === "CANCELLED") {
//             state = "cancelled";
//             showDetails = true;
//           } else if (
//             hasOccurred &&
//             normalFlowIndex !== -1 &&
//             normalFlowIndex < currentNormalFlowIndex
//           ) {
//             state = "completed";
//             showDetails = true;
//           } else {
//             return null; // Don't show future steps for cancelled orders
//           }
//         } else if (hasOccurred) {
//           state = "completed";
//           showDetails = true;
//         } else if (status === currentStatus) {
//           state = "active";
//           showDetails = true;
//         } else if (normalFlowIndex < currentNormalFlowIndex) {
//           state = "completed";
//         } else {
//           state = "pending";
//         }

//         // Get event data
//         const event = timelineMap.get(status);

//         return {
//           status,
//           label: config.label,
//           icon: state === "completed" ? config.completedIcon : config.icon,
//           message: event?.message || config.defaultMessage,
//           timestamp: event?.timestamp,
//           state,
//           showDetails,
//           colorClass:
//             state === "completed"
//               ? "text-green-700 bg-green-100"
//               : state === "active"
//                 ? config.activeColor
//                 : state === "cancelled"
//                   ? "text-red-700 bg-red-100 border-red-300"
//                   : "text-gray-500 bg-gray-100",
//           iconColor:
//             state === "completed"
//               ? "text-green-500"
//               : state === "active"
//                 ? "text-current"
//                 : state === "cancelled"
//                   ? "text-red-500"
//                   : "text-gray-400",
//           showMessage: showDetails,
//           showTimestamp: showDetails && event?.timestamp,
//         };
//       })
//       .filter(Boolean);
//   };

//   const getProductImageUrl = (imagePath: string | null) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith("http")) return imagePath;
//     return `${SERVER_URL}${imagePath}`;
//   };

//   const renderProductImage = (
//     imagePath: string | null,
//     alt: string,
//     className: string,
//   ) => {
//     const imageUrl = getProductImageUrl(imagePath);

//     if (!imageUrl) {
//       return (
//         <div
//           className={`${className} flex items-center justify-center bg-gray-100`}
//         >
//           <FiImage className="text-gray-400" size={20} />
//         </div>
//       );
//     }

//     return (
//       <img
//         src={imageUrl}
//         alt={alt}
//         className={className}
//         onError={(e) => {
//           // If image fails to load, show icon instead
//           const target = e.currentTarget;
//           target.style.display = "none";
//           const parent = target.parentElement;
//           if (parent) {
//             const fallbackDiv = document.createElement("div");
//             fallbackDiv.className = `${className} flex items-center justify-center bg-gray-100`;
//             const icon = document.createElement("div");
//             icon.innerHTML =
//               '<svg class="text-gray-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
//             fallbackDiv.appendChild(icon);
//             parent.appendChild(fallbackDiv);
//           }
//         }}
//       />
//     );
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [page, rowsPerPage]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const offset = (page - 1) * rowsPerPage;

//       const response = await orderApi.getAllOrders(offset, rowsPerPage);

//       let filteredOrders: Order[] = [];
//       let totalCount = 0;

//       // Handle different API response structures
//       if (Array.isArray(response)) {
//         filteredOrders = response;
//         totalCount = response.length;
//       } else if (response.content && Array.isArray(response.content)) {
//         filteredOrders = response.content;
//         totalCount =
//           response.totalElements || response.total || response.content.length;
//       } else if (response.orders && Array.isArray(response.orders)) {
//         filteredOrders = response.orders;
//         totalCount = response.total || response.orders.length;
//       } else if (response.data && Array.isArray(response.data)) {
//         filteredOrders = response.data;
//         totalCount = response.total || response.data.length;
//       } else {
//         console.error("Unexpected API response structure:", response);
//         toast.error("Unexpected response format from server");
//         setOrders([]);
//         setTotalOrders(0);
//         return;
//       }

//       // Apply column filters
//       if (columnFilters.product) {
//         filteredOrders = filteredOrders.filter(
//           (order: Order) =>
//             order.items &&
//             order.items.some(
//               (item) =>
//                 (item as any)?.productName
//                   ?.toLowerCase()
//                   .includes(columnFilters.product.toLowerCase()) ||
//                 (item as any)?.name
//                   ?.toLowerCase()
//                   .includes(columnFilters.product.toLowerCase()),
//             ),
//         );
//       }

//       if (columnFilters.orderId) {
//         filteredOrders = filteredOrders.filter((order: Order) =>
//           order.id.toString().includes(columnFilters.orderId),
//         );
//       }

//       if (columnFilters.orderStatus && columnFilters.orderStatus !== "ALL") {
//         filteredOrders = filteredOrders.filter(
//           (order: Order) => order.status === columnFilters.orderStatus,
//         );
//       }

//       if (
//         columnFilters.paymentStatus &&
//         columnFilters.paymentStatus !== "ALL"
//       ) {
//         filteredOrders = filteredOrders.filter(
//           (order: Order) => order.paymentStatus === columnFilters.paymentStatus,
//         );
//       }

//       setOrders(filteredOrders);
//       setTotalOrders(totalCount);
//     } catch (error: any) {
//       console.error("Error fetching orders:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to fetch orders";
//       toast.error(errorMessage);
//       setOrders([]);
//       setTotalOrders(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrderTimeline = async (orderId: number) => {
//     setTimelineLoading(true);
//     try {
//       const timeline = await orderApi.getOrderTimeline(orderId);
//       // Sort timeline events by timestamp (oldest first for display)
//       const sortedTimeline = timeline.sort(
//         (a, b) =>
//           new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
//       );
//       setOrderTimeline(sortedTimeline);
//     } catch (error: any) {
//       console.error("Failed to fetch timeline:", error);
//       toast.error("Failed to load timeline");
//       setOrderTimeline([]);
//     } finally {
//       setTimelineLoading(false);
//     }
//   };

//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters((prev) => ({
//       ...prev,
//       [column]: value,
//     }));
//     setPage(1);
//   };

//   // Apply filters when they change
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchOrders();
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [columnFilters]);

//   const fetchOrderDetails = async (orderId: number) => {
//     setModalLoading(true);
//     setSelectedOrder(null);
//     setShowDetailsModal(true);
//     try {
//       const fullOrderData = await orderApi.getOrderById(orderId);
//       setSelectedOrder(fullOrderData);
//     } catch (error: any) {
//       console.error("Error fetching order details:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to fetch order details";
//       toast.error(errorMessage);
//       setShowDetailsModal(false);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleViewTimeline = async (orderId: number) => {
//     setSelectedOrder(null);
//     setOrderTimeline([]);
//     setShowTimelineModal(true);

//     // Find the order in the current list
//     const order = orders.find((o) => o.id === orderId);
//     if (order) {
//       setSelectedOrder(order);
//     }

//     // Fetch timeline data
//     await fetchOrderTimeline(orderId);
//   };

//   const handleUpdateStatus = async () => {
//     if (!selectedOrder || !newStatus) {
//       toast.error("Please select a status");
//       return;
//     }
//     try {
//       await orderApi.updateOrderStatus(selectedOrder.id, {
//         status: newStatus,
//         trackingNumber: trackingNumber || undefined,
//       });
//       toast.success("Order status updated successfully");
//       setUpdateStatusModal(false);

//       // Refresh order details if modal is open
//       if (showDetailsModal) {
//         await fetchOrderDetails(selectedOrder.id);
//       }

//       // Refresh orders list
//       fetchOrders();
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to update order status";
//       toast.error(errorMessage);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       PENDING: "text-yellow-700 bg-yellow-100",
//       CONFIRMED: "text-blue-700 bg-blue-100",
//       PROCESSING: "text-blue-700 bg-blue-100",
//       SHIPPED: "text-purple-700 bg-purple-100",
//       OUT_FOR_DELIVERY: "text-orange-700 bg-orange-100",
//       DELIVERED: "text-green-700 bg-green-100",
//       CANCELLED: "text-red-700 bg-red-100",
//       RETURNED: "text-orange-700 bg-orange-100",
//       RETURN_REQUESTED: "text-blue-700 bg-blue-100",
//       REFUNDED: "text-green-700 bg-green-100",
//     };
//     return colors[status] || "text-gray-700 bg-gray-100";
//   };

//   const getPaymentColor = (status: string) => {
//     const colors: Record<string, string> = {
//       PAID: "text-green-700 bg-green-100",
//       PENDING: "text-yellow-700 bg-yellow-100",
//       FAILED: "text-red-700 bg-red-100",
//       REFUNDED: "text-blue-700 bg-blue-100",
//     };
//     return colors[status] || "text-gray-700 bg-gray-100";
//   };

//   const statusOptions = [
//     "PENDING",
//     "CONFIRMED",
//     "PROCESSING",
//     "SHIPPED",
//     "OUT_FOR_DELIVERY",
//     "DELIVERED",
//     "CANCELLED",
//     "RETURNED",
//     "RETURN_REQUESTED",
//     "REFUNDED",
//   ];
//   const paymentOptions = ["PAID", "PENDING", "FAILED", "REFUNDED"];

//   const totalPages = Math.ceil(totalOrders / rowsPerPage);
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   // Get intelligent timeline data
//   const intelligentTimeline = getIntelligentTimeline(
//     selectedOrder,
//     orderTimeline,
//   );

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">Order Management</h2>
//           <p className="text-dark-600 mt-1">{totalOrders} orders total</p>
//         </div>

//         <div className="flex space-x-3">
//           <button
//             onClick={fetchOrders}
//             className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
//           >
//             <FiRefreshCw className={loading ? "animate-spin" : ""} />
//             Refresh Orders
//           </button>
//         </div>
//       </div>

//       {/* --- TABLE WITH COLUMN FILTERS --- */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-dark-200">
//           <thead className="bg-dark-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>PRODUCT</span>
//                   <input
//                     type="text"
//                     placeholder="Search Product"
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.product}
//                     onChange={(e) =>
//                       handleColumnFilterChange("product", e.target.value)
//                     }
//                   />
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>ORDER ID</span>
//                   <input
//                     type="text"
//                     placeholder="Search Order ID"
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.orderId}
//                     onChange={(e) =>
//                       handleColumnFilterChange("orderId", e.target.value)
//                     }
//                   />
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>ORDER STATUS</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.orderStatus}
//                     onChange={(e) =>
//                       handleColumnFilterChange("orderStatus", e.target.value)
//                     }
//                   >
//                     <option value="">All</option>
//                     {statusOptions.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>PAYMENT STATUS</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.paymentStatus}
//                     onChange={(e) =>
//                       handleColumnFilterChange("paymentStatus", e.target.value)
//                     }
//                   >
//                     <option value="">All</option>
//                     {paymentOptions.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 ACTIONS
//               </th>
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-dark-200">
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="px-6 py-12 text-center text-dark-500"
//                 >
//                   <div className="flex flex-col items-center">
//                     <FiLoader
//                       className="animate-spin text-sage mb-2"
//                       size={24}
//                     />
//                     Loading orders...
//                   </div>
//                 </td>
//               </tr>
//             ) : orders.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="px-6 py-12 text-center text-dark-500"
//                 >
//                   <div className="flex flex-col items-center">
//                     <FiPackage
//                       className="mx-auto text-gray-400 mb-3"
//                       size={40}
//                     />
//                     <p className="text-lg font-medium mb-2">No orders found</p>
//                     <p className="text-sm text-gray-500">
//                       {columnFilters.product ||
//                       columnFilters.orderId ||
//                       columnFilters.orderStatus ||
//                       columnFilters.paymentStatus
//                         ? "Try adjusting your filters"
//                         : "No orders have been placed yet"}
//                     </p>
//                     {(columnFilters.product ||
//                       columnFilters.orderId ||
//                       columnFilters.orderStatus ||
//                       columnFilters.paymentStatus) && (
//                       <button
//                         onClick={() => {
//                           setColumnFilters({
//                             product: "",
//                             orderId: "",
//                             orderStatus: "",
//                             paymentStatus: "",
//                             status: "",
//                           });
//                         }}
//                         className="mt-4 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
//                       >
//                         Clear All Filters
//                       </button>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               orders.map((order) => {
//                 const firstItem =
//                   order.items && order.items.length > 0 ? order.items[0] : null;
//                 const productImage = firstItem
//                   ? (firstItem as any)?.productImage ||
//                     (firstItem as any)?.image
//                   : null;
//                 const productName = firstItem
//                   ? (firstItem as any)?.productName || (firstItem as any)?.name
//                   : `Order #${order.id}`;

//                 return (
//                   <tr key={order.id} className="hover:bg-dark-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="h-10 w-10 flex-shrink-0 mr-3">
//                           {renderProductImage(
//                             productImage,
//                             productName,
//                             "h-10 w-10 rounded object-cover bg-gray-100",
//                           )}
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-dark-900">
//                             {productName}
//                           </div>
//                           <div className="text-xs text-dark-500">
//                             Qty:{" "}
//                             {order.items
//                               ? order.items.reduce(
//                                   (sum, item) => sum + (item.quantity || 0),
//                                   0,
//                                 )
//                               : 0}{" "}
//                             • {formatINR(order.totalAmount || 0)}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-dark-900">
//                         #{order.id}
//                       </div>
//                       <div className="text-xs text-dark-500">
//                         User ID: {order.userId || "N/A"}
//                       </div>
//                       <div className="text-xs text-dark-500">
//                         {order.createdAt
//                           ? format(new Date(order.createdAt), "MMM dd, yyyy")
//                           : "Date N/A"}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {order.status ? (
//                         <>
//                           <span
//                             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
//                           >
//                             {order.status}
//                           </span>
//                           {order.trackingNumber && (
//                             <div className="text-xs text-dark-500 mt-1">
//                               Tracking: {order.trackingNumber}
//                             </div>
//                           )}
//                         </>
//                       ) : (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-700 bg-gray-100">
//                           UNKNOWN
//                         </span>
//                       )}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {order.paymentStatus ? (
//                         <span
//                           className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.paymentStatus)}`}
//                         >
//                           {order.paymentStatus}
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-700 bg-gray-100">
//                           UNKNOWN
//                         </span>
//                       )}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-1">
//                         <button
//                           onClick={() => fetchOrderDetails(order.id)}
//                           className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
//                           title="View Details"
//                         >
//                           <FiEye size={16} />
//                         </button>

//                         <button
//                           onClick={() => handleViewTimeline(order.id)}
//                           className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors"
//                           title="View Timeline"
//                         >
//                           <FiList size={16} />
//                         </button>

//                         <button
//                           onClick={() => {
//                             setSelectedOrder(order);
//                             setNewStatus(order.status || "PENDING");
//                             setTrackingNumber(order.trackingNumber || "");
//                             setUpdateStatusModal(true);
//                           }}
//                           className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded transition-colors"
//                           title="Update Status"
//                         >
//                           <FiEdit2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* --- PAGINATION & ROWS PER PAGE --- */}
//       <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-dark-200 sm:px-6">
//         <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-dark-700">Rows per page:</span>
//             <select
//               className="text-sm border border-dark-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//               value={rowsPerPage}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setPage(1);
//               }}
//             >
//               {rowsPerPageOptions.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <p className="text-sm text-dark-700">
//               Showing{" "}
//               <span className="font-medium">
//                 {(page - 1) * rowsPerPage + 1}
//               </span>{" "}
//               to{" "}
//               <span className="font-medium">
//                 {Math.min(page * rowsPerPage, totalOrders)}
//               </span>{" "}
//               of <span className="font-medium">{totalOrders}</span> results
//             </p>
//           </div>
//         </div>

//         <div>
//           <nav
//             className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//             aria-label="Pagination"
//           >
//             <button
//               onClick={() => setPage((prev) => Math.max(1, prev - 1))}
//               disabled={page === 1}
//               className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i + 1)}
//                 className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                   page === i + 1
//                     ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
//                     : "bg-white border-dark-300 text-dark-500 hover:bg-dark-50"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
//               disabled={page === totalPages}
//               className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* --- ORDER DETAILS MODAL --- */}
//       <AnimatePresence>
//         {showDetailsModal && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowDetailsModal(false)}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-dark-900">
//                     Order #{selectedOrder?.id || "..."}
//                   </h2>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => {
//                         if (selectedOrder) {
//                           setShowDetailsModal(false);
//                           handleViewTimeline(selectedOrder.id);
//                         }
//                       }}
//                       className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
//                       title="View Timeline"
//                     >
//                       <FiList size={18} />
//                     </button>
//                     <button onClick={() => setShowDetailsModal(false)}>
//                       <FiX
//                         size={24}
//                         className="text-dark-400 hover:text-dark-900"
//                       />
//                     </button>
//                   </div>
//                 </div>

//                 {modalLoading || !selectedOrder ? (
//                   <Spinner />
//                 ) : (
//                   <div className="space-y-6">
//                     {/* User Information Section */}
//                     <div className="bg-gradient-to-br from-[#8FAE8B]/10 to-[#7E9F7A]/5 rounded-2xl p-5 border border-[#8FAE8B]/20">
//                       <h3 className="text-lg font-bold text-dark-900 mb-4 flex items-center gap-2">
//                         <FiUser className="text-[#8FAE8B]" />
//                         Customer Information
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2">
//                             <FiUser className="text-dark-400" size={16} />
//                             <span className="text-sm font-medium text-dark-400">
//                               Customer Name
//                             </span>
//                           </div>
//                           <p className="text-dark-900 font-semibold text-lg pl-6">
//                             {selectedOrder.userName || "Not Available"}
//                           </p>
//                         </div>

//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2">
//                             <FiMail className="text-dark-400" size={16} />
//                             <span className="text-sm font-medium text-dark-400">
//                               Email Address
//                             </span>
//                           </div>
//                           <p className="text-dark-900 font-semibold text-lg pl-6 break-all">
//                             {selectedOrder.userEmail || "Not Available"}
//                           </p>
//                         </div>

//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2">
//                             <FiPhone className="text-dark-400" size={16} />
//                             <span className="text-sm font-medium text-dark-400">
//                               Phone Number
//                             </span>
//                           </div>
//                           <p className="text-dark-900 font-semibold text-lg pl-6">
//                             {selectedOrder.userPhone || "Not Available"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Order Status Section */}
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                       <div className="bg-white p-4 rounded-xl border border-[#8FAE8B]/20 shadow-sm">
//                         <p className="text-sm text-dark-400 mb-1">
//                           Order Status
//                         </p>
//                         <span
//                           className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(selectedOrder.status || "UNKNOWN")}`}
//                         >
//                           {selectedOrder.status || "UNKNOWN"}
//                         </span>
//                       </div>
//                       <div className="bg-white p-4 rounded-xl border border-[#8FAE8B]/20 shadow-sm">
//                         <p className="text-sm text-dark-400 mb-1">
//                           Payment Status
//                         </p>
//                         <span
//                           className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getPaymentColor(selectedOrder.paymentStatus || "UNKNOWN")}`}
//                         >
//                           {selectedOrder.paymentStatus || "UNKNOWN"}
//                         </span>
//                       </div>
//                       <div className="bg-white p-4 rounded-xl border border-[#8FAE8B]/20 shadow-sm">
//                         <p className="text-sm text-dark-400 mb-1">Order ID</p>
//                         <p className="text-dark-900 font-semibold">
//                           #{selectedOrder.id}
//                         </p>
//                       </div>
//                       <div className="bg-white p-4 rounded-xl border border-[#8FAE8B]/20 shadow-sm">
//                         <p className="text-sm text-dark-400 mb-1">User ID</p>
//                         <p className="text-dark-900 font-semibold">
//                           {selectedOrder.userId || "N/A"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Dates and Tracking Info */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="bg-white p-4 rounded-xl border border-[#8FAE8B]/20 shadow-sm">
//                         <p className="text-sm text-dark-400 mb-1">Order Date</p>
//                         <p className="text-dark-900 font-semibold">
//                           {selectedOrder.createdAt
//                             ? format(
//                                 new Date(selectedOrder.createdAt),
//                                 "MMM dd, yyyy HH:mm",
//                               )
//                             : "Date not available"}
//                         </p>
//                       </div>
//                       {selectedOrder.updatedAt && (
//                         <div className="bg-white p-4 rounded-xl border border-[#8FAE8B]/20 shadow-sm">
//                           <p className="text-sm text-dark-400 mb-1">
//                             Last Updated
//                           </p>
//                           <p className="text-dark-900 font-semibold">
//                             {format(
//                               new Date(selectedOrder.updatedAt),
//                               "MMM dd, yyyy HH:mm",
//                             )}
//                           </p>
//                         </div>
//                       )}
//                       <div className="bg-white p-4 rounded-xl border border-[#8FAE8B]/20 shadow-sm">
//                         <div className="flex items-center gap-2 mb-1">
//                           <FiTruck className="text-dark-400" size={14} />
//                           <p className="text-sm text-dark-400">Tracking Info</p>
//                         </div>
//                         <p className="text-dark-900 font-semibold font-mono text-sm">
//                           {selectedOrder.trackingNumber || "Not Available"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Shipping Details */}
//                     <div className="bg-white p-5 rounded-xl border border-[#8FAE8B]/20 shadow-sm">
//                       <h3 className="text-lg font-semibold text-dark-900 mb-3 flex items-center gap-2">
//                         <FiPackage className="text-[#8FAE8B]" />
//                         Shipping Details
//                       </h3>
//                       <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
//                         <p className="text-dark-900 whitespace-pre-wrap leading-relaxed">
//                           {selectedOrder.shippingAddress ||
//                             "No shipping address provided"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Order Items */}
//                     <div className="bg-white p-5 rounded-xl border border-[#8FAE8B]/20 shadow-sm">
//                       <h3 className="text-lg font-semibold text-dark-900 mb-4">
//                         Order Items
//                       </h3>
//                       <div className="space-y-3 mb-6">
//                         {selectedOrder.items &&
//                         selectedOrder.items.length > 0 ? (
//                           selectedOrder.items.map((item) => {
//                             const itemImage =
//                               (item as any)?.productImage ||
//                               (item as any)?.image;
//                             const itemName =
//                               (item as any)?.productName ||
//                               (item as any)?.name ||
//                               `Item #${item.id}`;

//                             return (
//                               <div
//                                 key={item.id}
//                                 className="bg-gray-50 p-4 rounded-xl flex gap-4 items-center hover:bg-gray-100 transition-colors border border-gray-200"
//                               >
//                                 <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#8FAE8B]/30 flex-shrink-0 bg-white">
//                                   {renderProductImage(
//                                     itemImage,
//                                     itemName,
//                                     "w-full h-full object-cover",
//                                   )}
//                                 </div>
//                                 <div className="flex-1">
//                                   <p className="text-dark-900 font-semibold text-lg mb-1">
//                                     {itemName}
//                                   </p>
//                                   <div className="flex flex-wrap gap-3 mt-2 text-sm text-dark-600">
//                                     <span className="bg-gray-200 px-2 py-1 rounded">
//                                       Qty: {item.quantity || 0}
//                                     </span>
//                                     {(item as any)?.selectedSize && (
//                                       <span className="bg-gray-200 px-2 py-1 rounded">
//                                         Size: {(item as any).selectedSize}
//                                       </span>
//                                     )}
//                                     {(item as any)?.selectedColor && (
//                                       <span className="bg-gray-200 px-2 py-1 rounded">
//                                         Color: {(item as any).selectedColor}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="text-dark-900 font-bold text-lg">
//                                     {formatINR(item.totalPrice || 0)}
//                                   </p>
//                                   <p className="text-sm text-dark-500">
//                                     ({formatINR(item.unitPrice || 0)} each)
//                                   </p>
//                                 </div>
//                               </div>
//                             );
//                           })
//                         ) : (
//                           <div className="text-center py-8 text-gray-500">
//                             <FiPackage className="mx-auto mb-3" size={32} />
//                             No items found for this order
//                           </div>
//                         )}
//                       </div>

//                       {/* Order Summary */}
//                       <div className="bg-gradient-to-br from-[#8FAE8B]/10 to-[#7E9F7A]/5 p-5 rounded-xl border border-[#8FAE8B]/30 ml-auto max-w-md">
//                         <h4 className="text-lg font-bold text-dark-900 mb-4">
//                           Order Summary
//                         </h4>
//                         <div className="space-y-3">
//                           <div className="flex justify-between text-dark-700">
//                             <span>Subtotal:</span>
//                             <span>
//                               {formatINR(
//                                 Number(selectedOrder.totalAmount || 0) -
//                                   Number(selectedOrder.tax || 0) +
//                                   Number(selectedOrder.discount || 0),
//                               )}
//                             </span>
//                           </div>
//                           {Number(selectedOrder.discount || 0) > 0 && (
//                             <div className="flex justify-between text-green-600">
//                               <span>Discount:</span>
//                               <span className="font-semibold">
//                                 - {formatINR(selectedOrder.discount || 0)}
//                               </span>
//                             </div>
//                           )}
//                           {Number(selectedOrder.tax || 0) > 0 && (
//                             <div className="flex justify-between text-dark-700">
//                               <span>Tax:</span>
//                               <span>{formatINR(selectedOrder.tax || 0)}</span>
//                             </div>
//                           )}
//                           <div className="border-t border-[#8FAE8B]/30 pt-3 mt-2 flex justify-between text-lg font-bold text-dark-900">
//                             <span>Total Amount:</span>
//                             <span className="text-xl">
//                               {formatINR(selectedOrder.totalAmount || 0)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Buttons at Bottom */}
//                     <div className="flex gap-3 pt-4">
//                       <button
//                         onClick={() => {
//                           setSelectedOrder(selectedOrder);
//                           setNewStatus(selectedOrder.status || "PENDING");
//                           setTrackingNumber(selectedOrder.trackingNumber || "");
//                           setUpdateStatusModal(true);
//                           setShowDetailsModal(false);
//                         }}
//                         className="flex-1 btn-primary flex items-center justify-center gap-2"
//                       >
//                         <FiEdit2 />
//                         Update Status
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (selectedOrder) {
//                             handleViewTimeline(selectedOrder.id);
//                             setShowDetailsModal(false);
//                           }
//                         }}
//                         className="flex-1 btn-ghost flex items-center justify-center gap-2"
//                       >
//                         <FiList />
//                         View Timeline
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* --- TIMELINE MODAL (Intelligent Amazon-style) --- */}
//       <AnimatePresence>
//         {showTimelineModal && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowTimelineModal(false)}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-dark-900">
//                       Order Timeline
//                     </h2>
//                     {selectedOrder && (
//                       <p className="text-dark-600 mt-1">
//                         Order #{selectedOrder.id} •{" "}
//                         {selectedOrder.items?.length || 0} item(s)
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() =>
//                         selectedOrder && fetchOrderTimeline(selectedOrder.id)
//                       }
//                       className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
//                       title="Refresh Timeline"
//                       disabled={timelineLoading}
//                     >
//                       <FiRefreshCw
//                         className={timelineLoading ? "animate-spin" : ""}
//                         size={18}
//                       />
//                     </button>
//                     <button onClick={() => setShowTimelineModal(false)}>
//                       <FiX
//                         size={24}
//                         className="text-dark-400 hover:text-dark-900"
//                       />
//                     </button>
//                   </div>
//                 </div>

//                 {timelineLoading ? (
//                   <div className="flex justify-center items-center py-12">
//                     <FiLoader className="animate-spin text-sage" size={40} />
//                   </div>
//                 ) : intelligentTimeline.length === 0 ? (
//                   <div className="text-center py-12 text-dark-500">
//                     <FiClock className="mx-auto mb-3 text-gray-400" size={48} />
//                     <h3 className="text-xl font-medium mb-2">
//                       No Timeline Available
//                     </h3>
//                     <p className="text-gray-600">
//                       No timeline events found for this order.
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     {/* Timeline Header with Summary */}
//                     <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-5 rounded-xl border border-primary-200">
//                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                         <div className="flex items-center gap-3">
//                           <div className="p-3 bg-white rounded-lg border border-primary-200">
//                             <FiClock className="text-primary-600" size={24} />
//                           </div>
//                           <div>
//                             <h3 className="font-bold text-dark-900">
//                               Order Journey
//                             </h3>
//                             <p className="text-sm text-dark-600">
//                               Tracking order progress in real-time
//                             </p>
//                           </div>
//                         </div>
//                         {selectedOrder && (
//                           <div className="flex flex-col items-end">
//                             <div
//                               className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getStatusColor(selectedOrder.status || "UNKNOWN")}`}
//                             >
//                               Current Status:{" "}
//                               {selectedOrder.status || "UNKNOWN"}
//                             </div>
//                             {selectedOrder.trackingNumber && (
//                               <p className="text-xs text-dark-500 mt-1">
//                                 Tracking:{" "}
//                                 <span className="font-mono">
//                                   {selectedOrder.trackingNumber}
//                                 </span>
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Timeline Visualization */}
//                     <div className="relative">
//                       {/* Main timeline line */}
//                       <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-300 via-primary-200 to-primary-100"></div>

//                       {/* Timeline steps */}
//                       <div className="space-y-8">
//                         {intelligentTimeline.map((step, index) => {
//                           const Icon = step.icon;

//                           return (
//                             <motion.div
//                               key={step.status}
//                               initial={{ opacity: 0, x: -20 }}
//                               animate={{ opacity: 1, x: 0 }}
//                               transition={{ delay: index * 0.1 }}
//                               className="relative pl-14"
//                             >
//                               {/* Timeline node */}
//                               <div
//                                 className={`absolute left-6 top-4 w-4 h-4 rounded-full border-4 border-white ${
//                                   step.state === "completed"
//                                     ? "bg-green-500 shadow-sm"
//                                     : step.state === "active"
//                                       ? "bg-primary-500 ring-2 ring-primary-200"
//                                       : step.state === "cancelled"
//                                         ? "bg-red-500 ring-2 ring-red-200"
//                                         : "bg-gray-300"
//                                 }`}
//                               >
//                                 {step.state === "completed" && (
//                                   <FiCheck
//                                     className="absolute -top-0.5 -left-0.5 text-white"
//                                     size={16}
//                                   />
//                                 )}
//                                 {step.state === "cancelled" && (
//                                   <FiX
//                                     className="absolute -top-0.5 -left-0.5 text-white"
//                                     size={16}
//                                   />
//                                 )}
//                               </div>

//                               {/* Step card */}
//                               <div
//                                 className={`rounded-xl p-5 border transition-all ${
//                                   step.state === "completed"
//                                     ? "bg-green-50 border-green-200"
//                                     : step.state === "active"
//                                       ? "bg-primary-50 border-primary-200 shadow-sm"
//                                       : step.state === "cancelled"
//                                         ? "bg-red-50 border-red-200"
//                                         : "bg-gray-50 border-gray-200"
//                                 }`}
//                               >
//                                 <div className="flex items-start justify-between mb-3">
//                                   <div className="flex items-center gap-3">
//                                     <div
//                                       className={`p-2 rounded-lg ${step.state === "completed" ? "bg-green-100" : step.state === "active" ? "bg-primary-100" : step.state === "cancelled" ? "bg-red-100" : "bg-gray-100"}`}
//                                     >
//                                       <Icon
//                                         className={step.iconColor}
//                                         size={20}
//                                       />
//                                     </div>
//                                     <div>
//                                       <span
//                                         className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${step.colorClass}`}
//                                       >
//                                         {step.label}
//                                       </span>
//                                       {step.state === "active" && (
//                                         <div className="flex items-center gap-1 mt-1">
//                                           <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
//                                           <span className="text-xs text-primary-600 font-medium">
//                                             IN PROGRESS
//                                           </span>
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>

//                                   {step.showTimestamp && step.timestamp && (
//                                     <div className="text-right">
//                                       <div className="text-sm font-medium text-dark-900">
//                                         {format(
//                                           new Date(step.timestamp),
//                                           "MMM dd, yyyy",
//                                         )}
//                                       </div>
//                                       <div className="text-xs text-dark-500">
//                                         {format(
//                                           new Date(step.timestamp),
//                                           "hh:mm a",
//                                         )}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>

//                                 {/* Message and details (only shown for occurred steps) */}
//                                 {step.showMessage && (
//                                   <div className="mt-3">
//                                     <p className="text-dark-700">
//                                       {step.message}
//                                     </p>
//                                     {step.showTimestamp && step.timestamp && (
//                                       <div className="flex items-center gap-2 mt-2 text-sm text-dark-500">
//                                         <FiClock size={14} />
//                                         <span>
//                                           {formatDistanceToNow(
//                                             new Date(step.timestamp),
//                                             { addSuffix: true },
//                                           )}
//                                         </span>
//                                       </div>
//                                     )}
//                                   </div>
//                                 )}

//                                 {/* For pending steps, show generic message */}
//                                 {!step.showMessage && (
//                                   <div className="mt-3 text-dark-500 italic">
//                                     {step.state === "pending"
//                                       ? "This step will be updated when it occurs"
//                                       : "Waiting for update..."}
//                                   </div>
//                                 )}
//                               </div>

//                               {/* Connecting line between steps */}
//                               {index < intelligentTimeline.length - 1 && (
//                                 <div
//                                   className={`absolute left-7 top-20 bottom-0 w-0.5 ${
//                                     step.state === "completed"
//                                       ? "bg-green-300"
//                                       : step.state === "active"
//                                         ? "bg-primary-200"
//                                         : "bg-gray-200"
//                                   }`}
//                                 ></div>
//                               )}
//                             </motion.div>
//                           );
//                         })}
//                       </div>
//                     </div>

//                     {/* Legend */}
//                     <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//                       <h4 className="font-medium text-dark-900 mb-3">
//                         Status Legend
//                       </h4>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                           <span className="text-sm text-dark-700">
//                             Completed
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse"></div>
//                           <span className="text-sm text-dark-700">
//                             In Progress
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded-full bg-gray-300"></div>
//                           <span className="text-sm text-dark-700">Pending</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex gap-3 pt-4">
//                       <button
//                         onClick={() => {
//                           if (selectedOrder) {
//                             setShowTimelineModal(false);
//                             fetchOrderDetails(selectedOrder.id);
//                           }
//                         }}
//                         className="flex-1 btn-ghost flex items-center justify-center gap-2"
//                       >
//                         <FiEye />
//                         Back to Order Details
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (selectedOrder) {
//                             setShowTimelineModal(false);
//                             setSelectedOrder(selectedOrder);
//                             setNewStatus(selectedOrder.status || "PENDING");
//                             setTrackingNumber(
//                               selectedOrder.trackingNumber || "",
//                             );
//                             setUpdateStatusModal(true);
//                           }
//                         }}
//                         className="flex-1 btn-primary flex items-center justify-center gap-2"
//                       >
//                         <FiEdit2 />
//                         Update Status
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* --- UPDATE STATUS MODAL --- */}
//       <AnimatePresence>
//         {updateStatusModal && selectedOrder && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setUpdateStatusModal(false)}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className="glass-card rounded-2xl p-6 max-w-md w-full"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-dark-900">
//                     Update Order Status
//                   </h2>
//                   <button onClick={() => setUpdateStatusModal(false)}>
//                     <FiX
//                       size={24}
//                       className="text-dark-400 hover:text-dark-900"
//                     />
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-semibold text-dark-300 mb-2 block">
//                       Order Status
//                     </label>
//                     <select
//                       value={newStatus}
//                       onChange={(e) => setNewStatus(e.target.value)}
//                       className="input-field"
//                     >
//                       {statusOptions.map((status) => (
//                         <option key={status} value={status}>
//                           {status}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-sm font-semibold text-dark-300 mb-2 block">
//                       Tracking Number (Optional)
//                     </label>
//                     <input
//                       type="text"
//                       value={trackingNumber}
//                       onChange={(e) => setTrackingNumber(e.target.value)}
//                       placeholder="Enter tracking number"
//                       className="input-field"
//                     />
//                   </div>
//                   <div className="flex space-x-3 pt-4">
//                     <button
//                       onClick={handleUpdateStatus}
//                       className="flex-1 btn-primary"
//                     >
//                       Update Status
//                     </button>
//                     <button
//                       onClick={() => setUpdateStatusModal(false)}
//                       className="flex-1 btn-ghost"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .backdrop-overlay {
//           @apply fixed inset-0 bg-black/50 z-40;
//         }
//         .glass-card {
//           @apply bg-white/95 backdrop-blur-sm;
//         }
//         .input-field {
//           @apply w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors;
//         }
//         .btn-primary {
//           @apply px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors;
//         }
//         .btn-ghost {
//           @apply px-6 py-2 bg-dark-800 text-dark-300 font-semibold rounded-lg hover:bg-dark-700 transition-colors;
//         }
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #8FAE8B;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #7E9F7A;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminOrders;

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  // FiTrash2,
  FiX,
  // FiSearch,
  FiPackage,
  FiTruck,
  // FiChevronLeft,
  // FiChevronRight,
  // FiChevronsLeft,
  // FiChevronsRight,
  FiLoader,
  // FiUser,
  // FiMail,
  // FiPhone,
  FiClock,
  FiCheckCircle,
  // FiAlertCircle,
  // FiInfo,
  FiRefreshCw,
  FiList,
  FiCheck,
  FiXCircle,
  // FiAlertTriangle,
  FiRotateCcw,
  // FiDollarSign,
  FiImage,
} from "react-icons/fi";
import { orderApi } from "../../api/orderApi";
import type { Order } from "../../types";
import { format, formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { formatINR } from "../../utils/currency";

const SERVER_URL =
  import.meta.env.VITE_API_IMG_URL || "http://192.168.1.111:8090";

// Add timeline type
interface TimelineEvent {
  status: string;
  message: string;
  timestamp: string;
}

// Define the complete order flow based on update order status options
const ORDER_FLOW = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
] as const;

const ORDER_STATE_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  CANCELLED: [],
  RETURNED: [],
};

// Status configuration with icons and colors
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    icon: any;
    color: string;
    activeColor: string;
    completedIcon: any;
    completedColor: string;
    defaultMessage: string;
  }
> = {
  // Normal flow statuses
  PENDING: {
    label: "Order Placed",
    icon: FiPackage,
    color: "text-yellow-700 bg-yellow-100",
    activeColor: "text-yellow-700 bg-yellow-100 border-yellow-300",
    completedIcon: FiCheckCircle,
    completedColor: "text-green-600",
    defaultMessage: "Order has been placed",
  },
  PROCESSING: {
    label: "Processing",
    icon: FiPackage,
    color: "text-blue-700 bg-blue-100",
    activeColor: "text-blue-700 bg-blue-100 border-blue-300",
    completedIcon: FiCheckCircle,
    completedColor: "text-green-600",
    defaultMessage: "Order is being processed",
  },
  SHIPPED: {
    label: "Shipped",
    icon: FiTruck,
    color: "text-purple-700 bg-purple-100",
    activeColor: "text-purple-700 bg-purple-100 border-purple-300",
    completedIcon: FiCheckCircle,
    completedColor: "text-green-600",
    defaultMessage: "Order has been shipped",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    icon: FiTruck,
    color: "text-orange-700 bg-orange-100",
    activeColor: "text-orange-700 bg-orange-100 border-orange-300",
    completedIcon: FiCheckCircle,
    completedColor: "text-green-600",
    defaultMessage: "Order is out for delivery",
  },
  DELIVERED: {
    label: "Delivered",
    icon: FiCheckCircle,
    color: "text-green-700 bg-green-100",
    activeColor: "text-green-700 bg-green-100 border-green-300",
    completedIcon: FiCheckCircle,
    completedColor: "text-green-600",
    defaultMessage: "Order has been delivered",
  },

  // Edge case statuses
  CANCELLED: {
    label: "Cancelled",
    icon: FiXCircle,
    color: "text-red-700 bg-red-100 border-red-300",
    activeColor: "text-red-700 bg-red-100 border-red-300",
    completedIcon: FiXCircle,
    completedColor: "text-red-600",
    defaultMessage: "Order has been cancelled",
  },
  RETURNED: {
    label: "Returned",
    icon: FiRotateCcw,
    color: "text-orange-700 bg-orange-100",
    activeColor: "text-orange-700 bg-orange-100 border-orange-300",
    completedIcon: FiCheckCircle,
    completedColor: "text-green-600",
    defaultMessage: "Item has been returned",
  },
};

// const Spinner = () => (
//   <div className="flex justify-center items-center p-12">
//     <FiLoader className="animate-spin text-sage" size={40} />
//   </div>
// );

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderTimeline, setOrderTimeline] = useState<TimelineEvent[]>([]);

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  // Column filters
  const [columnFilters, setColumnFilters] = useState({
    product: "",
    orderId: "",
    orderStatus: "",
    paymentStatus: "",
    status: "",
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  const getAllowedNextStatuses = (currentStatus?: string) =>
    ORDER_STATE_TRANSITIONS[String(currentStatus || "").toUpperCase()] || [];

  const getStatusSelectOptions = (currentStatus?: string) => {
    const normalized = String(currentStatus || "PENDING").toUpperCase();
    const allowed = getAllowedNextStatuses(normalized);
    if (!ORDER_FLOW.includes(normalized as (typeof ORDER_FLOW)[number])) {
      return ORDER_FLOW;
    }
    return [normalized, ...allowed];
  };

  // Helper function to get timeline with all statuses from update modal
  const getTimelineWithAllStatuses = (
    order: Order | null,
    timelineEvents: TimelineEvent[],
  ) => {
    if (!order) return [];

    const currentStatus = order.status || "PENDING";

    // Create map of actual timeline events
    const timelineMap = new Map();
    timelineEvents.forEach((event) => {
      timelineMap.set(event.status, {
        ...event,
        hasOccurred: true,
      });
    });

    // Define the normal flow sequence
    const NORMAL_FLOW = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];

    // Check for special statuses in timeline
    const hasCancelledEvent = timelineEvents.some(
      (event) => event.status === "CANCELLED",
    );
    const hasReturnedEvent = timelineEvents.some(
      (event) => event.status === "RETURNED",
    );
    const hasDeliveredEvent = timelineEvents.some(
      (event) => event.status === "DELIVERED",
    );

    // Determine which statuses to show
    let statusesToShow: string[] = [];

    if (hasCancelledEvent) {
      // For cancelled orders, show only statuses that occurred before cancellation
      const cancelledEvent = timelineEvents.find(
        (event) => event.status === "CANCELLED",
      );

      if (cancelledEvent?.timestamp) {
        // Get events that happened before cancellation
        const eventsBeforeCancellation = timelineEvents.filter((event) => {
          if (!event.timestamp) return true;
          return new Date(event.timestamp) < new Date(cancelledEvent.timestamp);
        });

        // Get unique statuses that occurred before cancellation
        const occurredStatuses = new Set(
          eventsBeforeCancellation.map((e) => e.status),
        );

        // Add statuses in normal flow order
        NORMAL_FLOW.forEach((status) => {
          if (occurredStatuses.has(status)) {
            statusesToShow.push(status);
          }
        });

        // Add CANCELLED at the end
        statusesToShow.push("CANCELLED");
      } else {
        // No timestamp - show all normal flow steps + CANCELLED
        statusesToShow = [...NORMAL_FLOW, "CANCELLED"];
      }
    } else if (hasReturnedEvent) {
      // For returned orders
      if (hasDeliveredEvent) {
        // If delivered then returned, show full normal flow + RETURNED
        statusesToShow = [...NORMAL_FLOW, "RETURNED"];
      } else {
        // Returned without delivery - show what actually happened
        const returnedEvent = timelineEvents.find(
          (event) => event.status === "RETURNED",
        );

        if (returnedEvent?.timestamp) {
          const eventsBeforeReturn = timelineEvents.filter((event) => {
            if (!event.timestamp) return true;
            return (
              new Date(event.timestamp) < new Date(returnedEvent.timestamp)
            );
          });

          const occurredStatuses = new Set(
            eventsBeforeReturn.map((e) => e.status),
          );

          NORMAL_FLOW.forEach((status) => {
            if (occurredStatuses.has(status)) {
              statusesToShow.push(status);
            }
          });

          statusesToShow.push("RETURNED");
        } else {
          statusesToShow = [...NORMAL_FLOW, "RETURNED"];
        }
      }
    } else if (hasDeliveredEvent) {
      // Delivered order - show all normal flow steps
      statusesToShow = [...NORMAL_FLOW];
    } else {
      // Ongoing order - show all normal flow steps
      statusesToShow = [...NORMAL_FLOW];
    }

    // Map statuses to timeline items
    return statusesToShow
      .map((status) => {
        const config = STATUS_CONFIG[status];
        if (!config) return null;

        const hasOccurred = timelineMap.has(status);
        const isCurrentStatus = status === currentStatus;

        // Determine if this status should be marked as completed
        let isCompleted = false;
        let isFuture = false;

        if (hasCancelledEvent) {
          // For cancelled orders, all statuses before CANCELLED are completed
          const cancelledIndex = statusesToShow.indexOf("CANCELLED");
          const statusIndex = statusesToShow.indexOf(status);
          isCompleted = statusIndex < cancelledIndex;
          isFuture = statusIndex > cancelledIndex;
        } else if (hasReturnedEvent) {
          // For returned orders
          if (hasDeliveredEvent) {
            // Delivered then returned - all normal flow steps are completed
            const returnedIndex = statusesToShow.indexOf("RETURNED");
            const statusIndex = statusesToShow.indexOf(status);
            isCompleted = statusIndex < returnedIndex;
            isFuture = statusIndex > returnedIndex;
          } else {
            // Returned without delivery
            const returnedIndex = statusesToShow.indexOf("RETURNED");
            const statusIndex = statusesToShow.indexOf(status);
            isCompleted = statusIndex < returnedIndex;
            isFuture = statusIndex > returnedIndex;
          }
        } else if (hasDeliveredEvent) {
          // Delivered orders - all steps are completed
          isCompleted = true;
        } else {
          // Ongoing order
          const currentIndex = NORMAL_FLOW.indexOf(currentStatus as any);
          const statusIndex = NORMAL_FLOW.indexOf(status as any);

          if (currentIndex !== -1 && statusIndex !== -1) {
            isCompleted = statusIndex < currentIndex;
            isFuture = statusIndex > currentIndex;
          }
        }

        let state: "completed" | "active" | "pending" = "pending";
        if (isCurrentStatus) {
          state = "active";
        } else if (isCompleted) {
          state = "completed";
        }

        const event = timelineMap.get(status);

        return {
          status,
          label: config.label,
          icon: state === "completed" ? config.completedIcon : config.icon,
          message: event?.message || config.defaultMessage,
          timestamp: event?.timestamp,
          state,
          isFuture,
          colorClass:
            state === "completed"
              ? "text-green-700 bg-green-100"
              : state === "active"
                ? config.activeColor
                : "text-gray-500 bg-gray-100",
          iconColor:
            state === "completed"
              ? "text-green-500"
              : state === "active"
                ? "text-current"
                : "text-gray-400",
          showMessage: hasOccurred || isCurrentStatus,
          showTimestamp: event?.timestamp,
        };
      })
      .filter((step): step is NonNullable<typeof step> => step !== null);
  };

  const getProductImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${SERVER_URL}${imagePath}`;
  };

  const renderProductImage = (
    imagePath: string | null,
    alt: string,
    className: string,
  ) => {
    const imageUrl = getProductImageUrl(imagePath);

    if (!imageUrl) {
      return (
        <div
          className={`${className} flex items-center justify-center bg-gray-100`}
        >
          <FiImage className="text-gray-400" size={20} />
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        onError={(e) => {
          // If image fails to load, show icon instead
          const target = e.currentTarget;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            const fallbackDiv = document.createElement("div");
            fallbackDiv.className = `${className} flex items-center justify-center bg-gray-100`;
            const icon = document.createElement("div");
            icon.innerHTML =
              '<svg class="text-gray-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
            fallbackDiv.appendChild(icon);
            parent.appendChild(fallbackDiv);
          }
        }}
      />
    );
  };

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const currentPage = Math.max(0, page - 1);
      const response = await orderApi.getAllOrders(currentPage, rowsPerPage);

      let filteredOrders: Order[] = [];
      let totalCount = 0;

      // Handle different API response structures
      if (Array.isArray(response)) {
        filteredOrders = response as Order[];
        totalCount = response.length;
      } else if (response.content && Array.isArray(response.content)) {
        filteredOrders = response.content as Order[];
        totalCount =
          response.totalElements || response.total || response.content.length;
      } else if (response.orders && Array.isArray(response.orders)) {
        filteredOrders = response.orders as unknown as Order[];
        totalCount = response.total || response.orders.length;
      } else if (response.data && Array.isArray(response.data)) {
        filteredOrders = response.data as Order[];
        totalCount = response.total || response.data.length;
      } else {
        console.error("Unexpected API response structure:", response);
        toast.error("Unexpected response format from server");
        setOrders([]);
        setTotalOrders(0);
        return;
      }

      // Apply column filters
      if (columnFilters.product) {
        filteredOrders = filteredOrders.filter(
          (order: Order) =>
            order.items &&
            order.items.some(
              (item) =>
                (item as any)?.productName
                  ?.toLowerCase()
                  .includes(columnFilters.product.toLowerCase()) ||
                (item as any)?.name
                  ?.toLowerCase()
                  .includes(columnFilters.product.toLowerCase()),
            ),
        );
      }

      if (columnFilters.orderId) {
        filteredOrders = filteredOrders.filter((order: Order) =>
          order.id.toString().includes(columnFilters.orderId),
        );
      }

      if (columnFilters.orderStatus && columnFilters.orderStatus !== "ALL") {
        filteredOrders = filteredOrders.filter(
          (order: Order) => order.status === columnFilters.orderStatus,
        );
      }

      if (
        columnFilters.paymentStatus &&
        columnFilters.paymentStatus !== "ALL"
      ) {
        filteredOrders = filteredOrders.filter(
          (order: Order) => order.paymentStatus === columnFilters.paymentStatus,
        );
      }

      setOrders(filteredOrders);
      setTotalOrders(totalCount);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch orders";
      toast.error(errorMessage);
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderTimeline = async (orderId: number) => {
    setTimelineLoading(true);
    try {
      const timeline = await orderApi.getOrderTimeline(orderId);
      setOrderTimeline(timeline);
    } catch (error: any) {
      console.error("Failed to fetch timeline:", error);
      toast.error("Failed to load timeline");
      setOrderTimeline([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setPage(1);
  };

  // Apply filters when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [columnFilters]);

  const fetchOrderDetails = async (orderId: number) => {
    setModalLoading(true);
    setSelectedOrder(null);
    setShowDetailsModal(true);
    try {
      const fullOrderData = await orderApi.getOrderById(orderId);
      setSelectedOrder(fullOrderData);
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch order details";
      toast.error(errorMessage);
      setShowDetailsModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewTimeline = async (orderId: number) => {
    setSelectedOrder(null);
    setOrderTimeline([]);
    setShowTimelineModal(true);

    // Find the order in the current list
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }

    // Fetch timeline data
    await fetchOrderTimeline(orderId);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) {
      toast.error("Please select a status");
      return;
    }

    if (newStatus === selectedOrder.status) {
      toast.error("Order is already in this status");
      return;
    }

    const allowedTransitions = getAllowedNextStatuses(selectedOrder.status);
    if (!allowedTransitions.includes(newStatus)) {
      const allowedText = allowedTransitions.length
        ? allowedTransitions.join(", ")
        : "No transitions allowed";
      toast.error(
        `Cannot transition from ${selectedOrder.status} to ${newStatus}. Allowed: ${allowedText}`
      );
      return;
    }

    try {
      if (newStatus === "CANCELLED") {
        await orderApi.adminCancelOrder(selectedOrder.id, {
          reason: "Cancelled by admin from dashboard",
        });
      } else {
        await orderApi.updateOrderStatus(selectedOrder.id, {
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
        });
      }
      toast.success("Order status updated successfully");
      setUpdateStatusModal(false);

      // Refresh order details if modal is open
      if (showDetailsModal) {
        await fetchOrderDetails(selectedOrder.id);
      }

      // Refresh orders list
      fetchOrders();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update order status";
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    const config = STATUS_CONFIG[status];
    return config ? config.color : "text-gray-700 bg-gray-100";
  };

  const getPaymentColor = (status: string) => {
    const colors: Record<string, string> = {
      COMPLETED: "text-green-700 bg-green-100",
      PAID: "text-green-700 bg-green-100",
      PENDING: "text-yellow-700 bg-yellow-100",
      FAILED: "text-red-700 bg-red-100",
      REFUNDED: "text-blue-700 bg-blue-100",
    };
    return colors[String(status || "").toUpperCase()] || "text-gray-700 bg-gray-100";
  };

  // Get unique status options from all orders
  const getStatusOptions = () => {
    const statusSet = new Set<string>();
    orders.forEach((order) => {
      if (order.status) {
        statusSet.add(order.status);
      }
    });
    return Array.from(statusSet).sort();
  };

  const paymentOptions = ["COMPLETED", "PAID", "PENDING", "FAILED", "REFUNDED"];

  const totalPages = Math.ceil(totalOrders / rowsPerPage);
  const rowsPerPageOptions = [5, 10, 20, 50, 100];

  useEffect(() => {
    const isModalOpen =
      showDetailsModal ||
      showTimelineModal ||
      updateStatusModal;
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDetailsModal, showTimelineModal, updateStatusModal]);

  // Get timeline with all statuses
  const timelineData = getTimelineWithAllStatuses(selectedOrder, orderTimeline);

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-900">Order Management</h2>
          <p className="text-dark-600 mt-1">{totalOrders} orders total</p>
        </div>

      <div className="flex space-x-3">
        <button
            onClick={() => {
              fetchOrders();
            }}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh Orders
        </button>
      </div>
    </div>

      {/* --- TABLE WITH COLUMN FILTERS --- */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-dark-200">
          <thead className="bg-dark-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>PRODUCT</span>
                  <input
                    type="text"
                    placeholder="Search Product"
                    className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    value={columnFilters.product}
                    onChange={(e) =>
                      handleColumnFilterChange("product", e.target.value)
                    }
                  />
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>ORDER ID</span>
                  <input
                    type="text"
                    placeholder="Search Order ID"
                    className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    value={columnFilters.orderId}
                    onChange={(e) =>
                      handleColumnFilterChange("orderId", e.target.value)
                    }
                  />
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>ORDER STATUS</span>
                  <select
                    className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    value={columnFilters.orderStatus}
                    onChange={(e) =>
                      handleColumnFilterChange("orderStatus", e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {getStatusOptions().map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>PAYMENT STATUS</span>
                  <select
                    className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    value={columnFilters.paymentStatus}
                    onChange={(e) =>
                      handleColumnFilterChange("paymentStatus", e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {paymentOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-dark-200">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-dark-500"
                >
                  <div className="flex flex-col items-center">
                    <FiLoader
                      className="animate-spin text-sage mb-2"
                      size={24}
                    />
                    Loading orders...
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-dark-500"
                >
                  <div className="flex flex-col items-center">
                    <FiPackage
                      className="mx-auto text-gray-400 mb-3"
                      size={40}
                    />
                    <p className="text-lg font-medium mb-2">No orders found</p>
                    <p className="text-sm text-gray-500">
                      {columnFilters.product ||
                      columnFilters.orderId ||
                      columnFilters.orderStatus ||
                      columnFilters.paymentStatus
                        ? "Try adjusting your filters"
                        : "No orders have been placed yet"}
                    </p>
                    {(columnFilters.product ||
                      columnFilters.orderId ||
                      columnFilters.orderStatus ||
                      columnFilters.paymentStatus) && (
                      <button
                        onClick={() => {
                          setColumnFilters({
                            product: "",
                            orderId: "",
                            orderStatus: "",
                            paymentStatus: "",
                            status: "",
                          });
                        }}
                        className="mt-4 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const firstItem =
                  order.items && order.items.length > 0 ? order.items[0] : null;
                const productImage = firstItem
                  ? (firstItem as any)?.productImage ||
                    (firstItem as any)?.image
                  : null;
                const productName = firstItem
                  ? (firstItem as any)?.productName || (firstItem as any)?.name
                  : `Order #${order.id}`;

                return (
                  <tr key={order.id} className="hover:bg-dark-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {renderProductImage(
                            productImage,
                            productName,
                            "h-10 w-10 rounded object-cover bg-gray-100",
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-dark-900">
                            {productName}
                          </div>
                          <div className="text-xs text-dark-500">
                            Qty:{" "}
                            {order.items
                              ? order.items.reduce(
                                  (sum, item) => sum + (item.quantity || 0),
                                  0,
                                )
                              : 0}{" "}
                            • {formatINR(order.totalAmount || 0)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-dark-900">
                        #{order.id}
                      </div>
                      <div className="text-xs text-dark-500">
                        User ID: {order.userId || "N/A"}
                      </div>
                      <div className="text-xs text-dark-500">
                        {order.createdAt
                          ? format(new Date(order.createdAt), "MMM dd, yyyy")
                          : "Date N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.status ? (
                        <>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                          {order.trackingNumber && (
                            <div className="text-xs text-dark-500 mt-1">
                              Tracking: {order.trackingNumber}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-700 bg-gray-100">
                          UNKNOWN
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.paymentStatus ? (
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-700 bg-gray-100">
                          UNKNOWN
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => fetchOrderDetails(order.id)}
                          className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>

                        <button
                          onClick={() => handleViewTimeline(order.id)}
                          className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors"
                          title="View Timeline"
                        >
                          <FiList size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status || "PENDING");
                            setTrackingNumber(order.trackingNumber || "");
                            setUpdateStatusModal(true);
                          }}
                          className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded transition-colors"
                          title="Update Status"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION & ROWS PER PAGE --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-dark-200 sm:px-6">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-dark-700">Rows per page:</span>
            <select
              className="text-sm border border-dark-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm text-dark-700">
              Showing{" "}
              <span className="font-medium">
                {(page - 1) * rowsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * rowsPerPage, totalOrders)}
              </span>{" "}
              of <span className="font-medium">{totalOrders}</span> results
            </p>
          </div>
        </div>

        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === i + 1
                    ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                    : "bg-white border-dark-300 text-dark-500 hover:bg-dark-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* --- ORDER DETAILS MODAL --- */}
      {createPortal(
        <AnimatePresence>
          {showDetailsModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDetailsModal(false)}
                className="backdrop-overlay"
              />
              <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-dark-900">
                      Order #{selectedOrder?.id || "..."}
                    </h2>
                    {selectedOrder && (
                      <p className="text-dark-600 mt-1">
                        {selectedOrder.items?.length || 0} item(s) ·{" "}
                        {selectedOrder.createdAt
                          ? format(
                              new Date(selectedOrder.createdAt),
                              "MMM dd, yyyy HH:mm",
                            )
                          : "Date N/A"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedOrder && (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleViewTimeline(selectedOrder.id);
                        }}
                        className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View Timeline"
                      >
                        <FiList size={18} />
                      </button>
                    )}
                    <button onClick={() => setShowDetailsModal(false)}>
                      <FiX size={24} className="text-dark-400 hover:text-dark-900" />
                    </button>
                  </div>
                </div>

                {modalLoading || !selectedOrder ? (
                  <div className="flex justify-center items-center py-12">
                    <FiLoader className="animate-spin text-sage" size={40} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-dark-500 mb-1">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            selectedOrder.status || "UNKNOWN",
                          )}`}
                        >
                          {selectedOrder.status || "UNKNOWN"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-dark-500 mb-1">Payment</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentColor(
                            selectedOrder.paymentStatus || "PENDING",
                          )}`}
                        >
                          {selectedOrder.paymentStatus || "PENDING"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-dark-500 mb-1">Total</p>
                        <p className="text-sm font-semibold text-dark-900">
                          {formatINR(selectedOrder.totalAmount || 0)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-dark-500 mb-2">Shipping Address</p>
                      <div className="rounded-xl border border-dark-200 bg-white p-4 text-sm text-dark-700">
                        {selectedOrder.shippingAddress || "Not available"}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs text-dark-500">Order Items</p>
                      {selectedOrder.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-wrap md:flex-nowrap items-center gap-4 rounded-xl border border-dark-200 bg-white p-4"
                        >
                          {renderProductImage(
                            (item as any)?.productImage || null,
                            item.productName,
                            "h-16 w-16 rounded-lg overflow-hidden",
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-dark-900">
                              {item.productName}
                            </p>
                            <p className="text-xs text-dark-500 mt-1">
                              Qty: {item.quantity} · {formatINR(item.unitPrice)}
                            </p>
                            {(item.selectedSize || item.selectedColor) && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {item.selectedSize && (
                                  <span className="text-[11px] px-2 py-1 bg-gray-100 rounded">
                                    Size: {item.selectedSize}
                                  </span>
                                )}
                                {item.selectedColor && (
                                  <span className="text-[11px] px-2 py-1 bg-gray-100 rounded">
                                    Color: {item.selectedColor}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-dark-900">
                            {formatINR(item.totalPrice)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedOrder.trackingNumber && (
                      <div>
                        <p className="text-xs text-dark-500 mb-2">Tracking Number</p>
                        <div className="rounded-xl border border-dark-200 bg-white p-4 text-sm text-dark-700 font-mono">
                          {selectedOrder.trackingNumber}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* --- TIMELINE MODAL (Showing all statuses from update modal) --- */}
      {createPortal(
        <AnimatePresence>
          {showTimelineModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTimelineModal(false)}
                className="backdrop-overlay"
              />
              <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-dark-900">
                      Order Timeline
                    </h2>
                    {selectedOrder && (
                      <p className="text-dark-600 mt-1">
                        Order #{selectedOrder.id} •{" "}
                        {selectedOrder.items?.length || 0} item(s)
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        selectedOrder && fetchOrderTimeline(selectedOrder.id)
                      }
                      className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Refresh Timeline"
                      disabled={timelineLoading}
                    >
                      <FiRefreshCw
                        className={timelineLoading ? "animate-spin" : ""}
                        size={18}
                      />
                    </button>
                    <button onClick={() => setShowTimelineModal(false)}>
                      <FiX
                        size={24}
                        className="text-dark-400 hover:text-dark-900"
                      />
                    </button>
                  </div>
                </div>

                {timelineLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <FiLoader className="animate-spin text-sage" size={40} />
                  </div>
                ) : timelineData.length === 0 ? (
                  <div className="text-center py-12 text-dark-500">
                    <FiClock className="mx-auto mb-3 text-gray-400" size={48} />
                    <h3 className="text-xl font-medium mb-2">
                      No Timeline Available
                    </h3>
                    <p className="text-gray-600">
                      No timeline events found for this order.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Timeline Header with Summary */}
                    <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-5 rounded-xl border border-primary-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-white rounded-lg border border-primary-200">
                            <FiClock className="text-primary-600" size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-dark-900">
                              Order Journey
                            </h3>
                            <p className="text-sm text-dark-600">
                              Tracking order progress in real-time
                            </p>
                          </div>
                        </div>
                        {selectedOrder && (
                          <div className="flex flex-col items-end">
                            <div
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getStatusColor(selectedOrder.status || "UNKNOWN")}`}
                            >
                              Current Status:{" "}
                              {selectedOrder.status || "UNKNOWN"}
                            </div>
                            {selectedOrder.trackingNumber && (
                              <p className="text-xs text-dark-500 mt-1">
                                Tracking:{" "}
                                <span className="font-mono">
                                  {selectedOrder.trackingNumber}
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline Visualization */}
                    <div className="relative">
                      {/* Main timeline line */}
                      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-300 via-primary-200 to-primary-100"></div>

                      {/* Timeline steps */}
                      <div className="space-y-8">
                        {timelineData.map((step, index) => {
                          const Icon = step.icon;
                          const isCompleted = step.state === "completed";
                          const isActive = step.state === "active";
                          const isPending = step.state === "pending";

                          return (
                            <motion.div
                              key={step.status}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative pl-14"
                            >
                              {/* Timeline node */}
                              <div
                                className={`absolute left-6 top-4 w-4 h-4 rounded-full border-4 border-white ${
                                  isCompleted
                                    ? "bg-green-500 shadow-sm"
                                    : isActive
                                      ? "bg-primary-500 ring-2 ring-primary-200"
                                      : "bg-gray-300"
                                }`}
                              >
                                {isCompleted && (
                                  <FiCheck
                                    className="absolute -top-0.5 -left-0.5 text-white"
                                    size={16}
                                  />
                                )}
                              </div>

                              {/* Step card */}
                              <div
                                className={`rounded-xl p-5 border transition-all ${
                                  isCompleted
                                    ? "bg-green-50 border-green-200"
                                    : isActive
                                      ? "bg-primary-50 border-primary-200 shadow-sm"
                                      : "bg-gray-50 border-gray-200"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-lg ${isCompleted ? "bg-green-100" : isActive ? "bg-primary-100" : "bg-gray-100"}`}
                                    >
                                      <Icon
                                        className={step.iconColor}
                                        size={20}
                                      />
                                    </div>
                                    <div>
                                      <span
                                        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${step.colorClass}`}
                                      >
                                        {step.label}
                                      </span>
                                      {isActive && (
                                        <div className="flex items-center gap-1 mt-1">
                                          <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                                          <span className="text-xs text-primary-600 font-medium">
                                            CURRENT STATUS
                                          </span>
                                        </div>
                                      )}
                                      {isPending && (
                                        <div className="flex items-center gap-1 mt-1">
                                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                          <span className="text-xs text-gray-600 font-medium">
                                            PENDING
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {step.showTimestamp && step.timestamp && (
                                    <div className="text-right">
                                      <div className="text-sm font-medium text-dark-900">
                                        {format(
                                          new Date(step.timestamp),
                                          "MMM dd, yyyy",
                                        )}
                                      </div>
                                      <div className="text-xs text-dark-500">
                                        {format(
                                          new Date(step.timestamp),
                                          "hh:mm a",
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Message and details */}
                                <div className="mt-3">
                                  {step.showMessage ? (
                                    <p className="text-dark-700">
                                      {step.message}
                                    </p>
                                  ) : isPending ? (
                                    <p className="text-gray-500 italic">
                                      This step will be updated when it occurs
                                    </p>
                                  ) : (
                                    <p className="text-dark-700">
                                      {step.message}
                                    </p>
                                  )}
                                  {step.showTimestamp && step.timestamp && (
                                    <div className="flex items-center gap-2 mt-2 text-sm text-dark-500">
                                      <FiClock size={14} />
                                      <span>
                                        {formatDistanceToNow(
                                          new Date(step.timestamp),
                                          { addSuffix: true },
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Connecting line between steps */}
                              {index < timelineData.length - 1 && (
                                <div
                                  className={`absolute left-7 top-20 bottom-0 w-0.5 ${
                                    isCompleted
                                      ? "bg-green-300"
                                      : isActive
                                        ? "bg-primary-200"
                                        : "bg-gray-200"
                                  }`}
                                ></div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="font-medium text-dark-900 mb-3">
                        Status Legend
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm text-dark-700">
                            Completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse"></div>
                          <span className="text-sm text-dark-700">
                            Current Status
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                          <span className="text-sm text-dark-700">Pending</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          if (selectedOrder) {
                            setShowTimelineModal(false);
                            fetchOrderDetails(selectedOrder.id);
                          }
                        }}
                        className="flex-1 btn-ghost flex items-center justify-center gap-2"
                      >
                        <FiEye />
                        Back to Order Details
                      </button>
                      <button
                        onClick={() => {
                          if (selectedOrder) {
                            setShowTimelineModal(false);
                            setSelectedOrder(selectedOrder);
                            setNewStatus(selectedOrder.status || "PENDING");
                            setTrackingNumber(
                              selectedOrder.trackingNumber || "",
                            );
                            setUpdateStatusModal(true);
                          }
                        }}
                        className="flex-1 btn-primary flex items-center justify-center gap-2"
                      >
                        <FiEdit2 />
                        Update Status
                      </button>
                    </div>
                  </div>
                )}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* --- UPDATE STATUS MODAL --- */}
      {createPortal(
        <AnimatePresence>
          {updateStatusModal && selectedOrder && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setUpdateStatusModal(false)}
                className="backdrop-overlay"
              />
              <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-2xl p-6 max-w-md w-full"
                >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-dark-900">
                    Update Order Status
                  </h2>
                  <button onClick={() => setUpdateStatusModal(false)}>
                    <FiX
                      size={24}
                      className="text-dark-400 hover:text-dark-900"
                    />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-dark-300 mb-2 block">
                      Order Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="input-field"
                    >
                      {getStatusSelectOptions(selectedOrder.status).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {getAllowedNextStatuses(selectedOrder.status).length === 0 && (
                      <p className="mt-2 text-xs text-dark-500">
                        This order is in a terminal state. No further transitions are allowed.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-dark-300 mb-2 block">
                      Tracking Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="input-field"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleUpdateStatus}
                      disabled={newStatus === selectedOrder.status}
                      className="flex-1 btn-primary disabled:opacity-60"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => setUpdateStatusModal(false)}
                      className="flex-1 btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <style>{`
        .backdrop-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.48);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          z-index: 9990;
        }
        .glass-card {
          @apply bg-white/95 backdrop-blur-sm;
        }
        .input-field {
          @apply w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors;
        }
        .btn-primary {
          @apply px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors;
        }
        .btn-ghost {
          @apply px-6 py-2 bg-dark-800 text-dark-300 font-semibold rounded-lg hover:bg-dark-700 transition-colors;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8FAE8B;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7E9F7A;
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
