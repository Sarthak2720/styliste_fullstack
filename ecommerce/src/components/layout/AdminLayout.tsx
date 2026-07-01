// import { Outlet, useLocation, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   FiHome,
//   FiPackage,
//   FiShoppingBag,
//   FiUsers,
//   FiCalendar,
//   FiTrendingUp,
//   FiFileText,
//   FiSettings,
//   FiLogOut,
// } from 'react-icons/fi';
// import useAuth from '../../hooks/useAuth';

// const AdminLayout = () => {
//   const location = useLocation();
//   const { user, dispatch } = useAuth();

//   const menuItems = [
//     { name: 'Dashboard', path: '/admin', icon: FiHome },
//     { name: 'Products', path: '/admin/products', icon: FiPackage },
//     { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
//     { name: 'Users', path: '/admin/users', icon: FiUsers },
//     { name: 'Appointments', path: '/admin/appointments', icon: FiCalendar },
//     { name: 'Reports', path: '/admin/reports', icon: FiTrendingUp },
//     { name: 'Content', path: '/admin/content', icon: FiFileText },
//     { name: 'Settings', path: '/admin/settings', icon: FiSettings },
//   ];

//   const isActive = (path: string) => {
//     if (path === '/admin') {
//       return location.pathname === path;
//     }
//     return location.pathname.startsWith(path);
//   };

//   const handleLogout = () => {
//     // Add your logout logic here
//     console.log('Logout clicked');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hide the regular navbar for admin */}
//       <style>{`
//         nav { display: none !important; }
//         .h-20 { height: 0 !important; }
//       `}</style>

//       {/* Static Sidebar */}
//       <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#2C3E50] to-[#1A252F] text-white shadow-xl z-40">
//         {/* Logo/Header */}
//         <div className="p-6 border-b border-white/10">
//           <h1 className="text-2xl font-bold">Admin Panel</h1>
//           <p className="text-sm text-white/60 mt-1">Styliste Couturier</p>
//           <p className="text-xs text-white/40 mt-2">Logged in as: {user?.name || 'Admin'}</p>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="p-4 space-y-1">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const active = isActive(item.path);

//             return (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   active
//                     ? 'bg-white/20 text-white shadow-md border-l-4 border-white'
//                     : 'text-white/80 hover:text-white hover:bg-white/10'
//                 }`}
//               >
//                 <Icon size={20} className={active ? 'text-white' : 'text-white/70'} />
//                 <span className="font-medium">{item.name}</span>
//                 {active && (
//                   <motion.div
//                     layoutId="activeTab"
//                     className="ml-auto w-2 h-2 bg-white rounded-full"
//                   />
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Logout Button */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
//           >
//             <FiLogOut size={18} />
//             <span className="font-medium">Logout</span>
//           </button>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <main className="ml-64 p-6">
//         <div className="max-w-7xl mx-auto">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;

import { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiCalendar,
  FiLogOut,
  FiExternalLink,
  FiMail,
  FiMenu,
  FiRotateCcw,
  FiX,
  FiFileText,
  FiUserCheck,
  FiSettings,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/logo.png";

// Add your logo import - replace with your actual logo
// import Logo from '../../assets/logo.svg';

const AdminLayout = () => {
  const location = useLocation();
  const { user, dispatch } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Main navigation items
  const mainMenuItems = [
    { name: "Dashboard", path: "/admin", icon: FiHome },
    { name: "Product Management", path: "/admin/products", icon: FiPackage },
    { name: "Order Management", path: "/admin/orders", icon: FiShoppingBag },
    { name: "Returns", path: "/admin/returns", icon: FiRotateCcw },
    { name: "Users Management", path: "/admin/users", icon: FiUsers },
    { name: "Appointments", path: "/admin/appointments", icon: FiCalendar },
    { name: "Measurements", path: "/admin/measurements", icon: FiUserCheck },
    { name: "Blog Management", path: "/admin/blogs", icon: FiFileText },
    { name: "Virtual Try On", path: "/admin/try-on-settings", icon: FiSettings },
    { name: "Visit Site", path: "/", icon: FiExternalLink, external: true },
    { name: "Contact Messages", path: "/admin/contacts", icon: FiMail },

    // Auth
    { name: "Log Out", icon: FiLogOut, onClick: true },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });

    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
      state: { logout: true },
    });
  };
  const getInitials = (name?: string) => {
    if (!name) return "A";

    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();

    return words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded">
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <img src={logo} alt="Logo" className="h-10 w-auto ml-3" />
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-white to-gray-50 text-gray-800 shadow-lg z-40 border-r border-gray-200 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo/Header */}
        <div className="p-6 bg-[#5E6E54] border-b border-[#4F5D47]">
          <div className="flex justify-center items-center">
            <img
              src={logo}
              alt="Styliste Couturier Logo"
              className="w-12.5 h-14 object-contain mr-3 bg"
            />
            <div>
              {/* <p className="text-xs text-gray-500">Admin Panel</p> */}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {mainMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isLogout = item.onClick === true;
            const active = item.path ? isActive(item.path) : false;

            return (
              <div key={`${item.name}-${index}`}>
                {isLogout ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-left"
                  >
                    {Icon && <Icon size={18} className="text-gray-500" />}
                    <span className="text-[15px] font-normal tracking-wide whitespace-nowrap">{item.name}</span>
                  </button>
                ) : (
                  <Link
                    to={item.path!}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-[#8FAE8B]/10 text-[#8FAE8B] border-l-4 border-[#8FAE8B]"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        size={18}
                        className={active ? "text-[#8FAE8B] font-medium" : "text-gray-500"}
                      />
                    )}
                    <span className="text-[15px] font-normal tracking-wide whitespace-nowrap">{item.name}</span>

                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-2 h-2 bg-[#8FAE8B] rounded-full"
                      />
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div
              className="
  w-10 h-10 
  rounded-full 
  bg-[#8FAE8B]
  flex items-center justify-center
  text-white 
  font-semibold 
  text-sm
  leading-none
  shrink-0
"
>
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-wide text-gray-900 truncate">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="md:ml-72 min-h-screen p-4 md:p-6 bg-gray-50 pt-20 md:pt-6">
        <div className="w-full min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
