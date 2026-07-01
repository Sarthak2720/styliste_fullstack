// src/pages/admin/AdminDashboardContent.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShoppingCart,
  FiPackage,
  FiShoppingBag,
  FiCalendar,
  FiTrendingUp,
  FiXCircle,
  FiCornerDownLeft,
  FiTruck,
  FiRotateCcw,
} from 'react-icons/fi';
import { orderApi } from '../../api/orderApi';
import { appointmentApi } from '../../api/appointmentApi';
import type { OrderStatistics, AppointmentStatistics, Order, Appointment } from '../../types';
import toast from 'react-hot-toast';

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

const AdminDashboardContent = () => {
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
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Manage your store, products, and customers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Order #{order.orderNumber || order.id}</p>
                    <p className="text-sm text-gray-600">₹{order.totalAmount}</p>
                    {order.items?.map((item: any) => (
                      <p key={item.id} className="text-xs text-gray-500">
                        {item.productName} × {item.quantity}
                      </p>
                    ))}
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Appointments</h2>
            <Link to="/admin/appointments" className="text-sm text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent appointments</p>
            ) : (
              recentAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{appt.name}</p>
                    <p className="text-sm text-gray-600">{appt.serviceType?.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500">
                      {appt.appointmentDate} at {appt.appointmentTime?.slice(0, 5)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/products">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Manage Products
            </button>
          </Link>
          <Link to="/admin/orders">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              View Orders
            </button>
          </Link>
          <Link to="/admin/users">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Manage Users
            </button>
          </Link>
          <Link to="/admin/appointments">
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              View Appointments
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
