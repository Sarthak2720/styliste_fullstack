// import { useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiEye, FiEdit, FiTrash, FiX, FiSearch } from "react-icons/fi";
// import { format } from "date-fns";

// const STATIC_USERS = [
//   {
//     id: 101,
//     name: "Alice Johnson",
//     email: "alice@example.com",
//     phone: "9876543210",
//     role: "CUSTOMER",
//     status: "ACTIVE",
//     createdAt: "2025-12-20T10:30:00",
//   },
//   {
//     id: 102,
//     name: "Bob Smith",
//     email: "bob@example.com",
//     phone: "9123456789",
//     role: "CUSTOMER",
//     status: "BLOCKED",
//     createdAt: "2025-12-21T14:00:00",
//   },
//   {
//     id: 103,
//     name: "Priya Sharma",
//     email: "priya@example.com",
//     phone: "9012345678",
//     role: "CUSTOMER",
//     status: "ACTIVE",
//     createdAt: "2025-12-19T09:20:00",
//   },
//   {
//     id: 104,
//     name: "Rohit Verma",
//     email: "rohit@example.com",
//     phone: "9988776655",
//     role: "CUSTOMER",
//     status: "ACTIVE",
//     createdAt: "2025-12-18T08:15:00",
//   },
//   {
//     id: 105,
//     name: "Neha Kapoor",
//     email: "neha@example.com",
//     phone: "9090909090",
//     role: "CUSTOMER",
//     status: "BLOCKED",
//     createdAt: "2025-12-17T11:45:00",
//   },
// ];

// const AdminUsers = () => {
//   const [users, setUsers] = useState(STATIC_USERS);

//   // ========= Search =========
//   const [search, setSearch] = useState("");

//   // ========= Sorting =========
//  const [sortKey, setSortKey] = useState<keyof typeof STATIC_USERS[0]>("createdAt");
// const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

//   const handleSort = (key: keyof typeof STATIC_USERS[0]) => {
//    if (sortKey === key) {
//   setSortOrder(sortOrder === "asc" ? "desc" : "asc");
// } else {
//   setSortKey(key);
//   setSortOrder("desc");
// }
//   };

//   // ========= Pagination =========
//  const [page, setPage] = useState(0);
// const [rowsPerPage, setRowsPerPage] = useState(5);

//   const filteredUsers = useMemo(() => {
//     return users
//       .filter(
//         (u) =>
//           u.name.toLowerCase().includes(search.toLowerCase()) ||
//           u.email.toLowerCase().includes(search.toLowerCase())
//       )
//       .sort((a: any, b: any) => {
//         const valA = a[sortKey];
//         const valB = b[sortKey];

//         if (valA < valB) return sortOrder === "asc" ? -1 : 1;
//         if (valA > valB) return sortOrder === "asc" ? 1 : -1;
//         return 0;
//       });
//   }, [users, search, sortKey, sortOrder]);

// const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
// const paginatedUsers = filteredUsers.slice(
//   page * rowsPerPage,
//   page * rowsPerPage + rowsPerPage
// );

//   // ========= Modals =========
//   const [selectedUser, setSelectedUser] = useState<any>(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editName, setEditName] = useState("");
//   const [editRole, setEditRole] = useState("");

//   const deleteUser = (id: number) => {
//     setUsers((prev) => prev.filter((u) => u.id !== id));
//   };

//   const saveEdit = () => {
//     setUsers((prev) =>
//       prev.map((u) =>
//         u.id === selectedUser.id ? { ...u, name: editName, role: editRole } : u
//       )
//     );
//     setShowEditModal(false);
//   };

//   const statusColors: Record<string, string> = {
//     ACTIVE: "bg-green-500/20 text-green-400",
//     BLOCKED: "bg-red-500/20 text-red-400",
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">User Management</h2>
//           <p className="text-dark-400 mt-1">{users.length} users</p>
//         </div>

//         {/* Search */}
//         <div className="relative w-72">
//           <FiSearch className="absolute left-3 top-3 text-dark-400" />
//           <input
//             placeholder="Search users..."
//             className="input-field pl-10"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(0);
//             }}
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="glass-card rounded-2xl overflow-x-auto p-4">
//         <table className="w-full text-sm text-dark-300">
//           <thead>
//             <tr className="text-left text-dark-400 border-b border-dark-700">
//               {[
//                 { key: "id", label: "ID" },
//                 { key: "name", label: "Name" },
//                 { key: "email", label: "Email" },
//                 { key: "phone", label: "Phone" },
//                 { key: "status", label: "Status" },
//                 { key: "role", label: "Role" },
//                 { key: "createdAt", label: "Joined" },
//               ].map((col) => (
//                 <th
//                   key={col.key}
//                   onClick={() => handleSort(col.key as any)}
//                   className="py-3 cursor-pointer select-none"
//                 >
//                   {col.label}{" "}
//                   {sortKey === col.key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
//                 </th>
//               ))}

//               <th className="text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedUsers.map((user) => (
//               <tr key={user.id} className="border-b border-dark-800">
//                 <td className="py-3">{user.id}</td>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.phone}</td>

//                 <td>
//                   <span
//                     className={`px-3 py-1 rounded-lg text-xs font-semibold ${
//                       statusColors[user.status]
//                     }`}
//                   >
//                     {user.status}
//                   </span>
//                 </td>

//                 <td>{user.role}</td>

//                 <td>{format(new Date(user.createdAt), "MMM dd, yyyy")}</td>

//                 <td>
//                   <div className="flex justify-end gap-3">
//                     <FiEye
//                       className="text-primary-400 cursor-pointer"
//                       onClick={() => {
//                         setSelectedUser(user);
//                         setShowViewModal(true);
//                       }}
//                     />
//                     <FiEdit
//                       className="text-yellow-400 cursor-pointer"
//                       onClick={() => {
//                         setSelectedUser(user);
//                         setEditName(user.name);
//                         setEditRole(user.role);
//                         setShowEditModal(true);
//                       }}
//                     />
//                     <FiTrash
//                       className="text-red-400 cursor-pointer"
//                       onClick={() => deleteUser(user.id)}
//                     />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {paginatedUsers.length === 0 && (
//           <p className="text-center text-dark-500 py-6">No results found</p>
//         )}
//       </div>

//    <div className="flex justify-between items-center">
//   {/* Rows Per Page */}
//   <div className="flex items-center gap-2">
//     <span className="text-dark-300">Rows per page:</span>
//     <select
//       value={rowsPerPage}
//       onChange={(e) => {
//         setRowsPerPage(Number(e.target.value));
//         setPage(0);
//       }}
//       className="input-field w-24"
//     >
//       <option value={10}>10</option>
//       <option value={15}>15</option>
//       <option value={20}>20</option>
//       <option value={25}>25</option>
//       <option value={30}>30</option>
//     </select>
//   </div>

//   {/* Pagination Buttons */}
//   <div className="flex items-center gap-3">
//     <button
//       disabled={page === 0}
//       onClick={() => setPage(page - 1)}
//       className="btn-ghost px-6 disabled:opacity-40"
//     >
//       Prev
//     </button>

//     <span className="text-dark-300 pt-2">
//       Page {page + 1} of {totalPages || 1}
//     </span>

//     <button
//       disabled={page + 1 >= totalPages}
//       onClick={() => setPage(page + 1)}
//       className="btn-ghost px-6 disabled:opacity-40"
//     >
//       Next
//     </button>
//   </div>
// </div>


//       {/* VIEW MODAL */}
//       <AnimatePresence>
//         {showViewModal && selectedUser && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowViewModal(false)}
//               className="backdrop-overlay"
//             />

//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="glass-card rounded-2xl p-6 max-w-lg w-full"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-dark-900">
//                     {selectedUser.name}
//                   </h2>
//                   <FiX
//                     className="text-dark-400 cursor-pointer"
//                     size={22}
//                     onClick={() => setShowViewModal(false)}
//                   />
//                 </div>

//                 <p>Email: {selectedUser.email}</p>
//                 <p>Phone: {selectedUser.phone}</p>
//                 <p>Role: {selectedUser.role}</p>
//                 <p>Status: {selectedUser.status}</p>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* EDIT MODAL */}
//       <AnimatePresence>
//         {showEditModal && selectedUser && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowEditModal(false)}
//               className="backdrop-overlay"
//             />

//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="glass-card rounded-2xl p-6 max-w-md w-full"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-dark-900">Edit User</h2>
//                   <FiX
//                     className="text-dark-400 cursor-pointer"
//                     size={22}
//                     onClick={() => setShowEditModal(false)}
//                   />
//                 </div>

//                 <div className="space-y-4">
//                   <input
//                     className="input-field"
//                     value={editName}
//                     onChange={(e) => setEditName(e.target.value)}
//                   />

//                   <select
//                     value={editRole}
//                     onChange={(e) => setEditRole(e.target.value)}
//                     className="input-field"
//                   >
//                     <option value="CUSTOMER">CUSTOMER</option>
//                     <option value="ADMIN">ADMIN</option>
//                   </select>

//                   <div className="flex gap-3 pt-4">
//                     <button onClick={saveEdit} className="btn-primary flex-1">
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setShowEditModal(false)}
//                       className="btn-ghost flex-1"
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

// export default AdminUsers;


// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiEye, FiEdit, FiTrash, FiX, FiSearch } from "react-icons/fi";
// import { format } from "date-fns";
// import { userApi, type User } from "../../api/userApi";

// const AdminUsers = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // -------- SEARCH --------
//   const [search, setSearch] = useState("");

//   // -------- SORT --------
//   const [sortKey, setSortKey] =
//     useState<keyof User>("createdAt");
//   const [sortOrder, setSortOrder] =
//     useState<"asc" | "desc">("desc");

//   const handleSort = (key: keyof User) => {
//     if (sortKey === key)
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     else {
//       setSortKey(key);
//       setSortOrder("desc");
//     }
//   };

//   // -------- FETCH USERS --------
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await userApi.getCustomers(page, rowsPerPage);

//         // ensure newest first
//         const sorted = [...res.content].sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() -
//             new Date(a.createdAt).getTime()
//         );

//         setUsers(sorted);
//         setTotalPages(res.totalPages);
//         setTotalUsers(res.totalElements);
//       } catch (err) {
//         setError("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [page, rowsPerPage]);

//   // -------- FILTER + SORT --------
//   const filteredUsers = useMemo(() => {
//     return users
//       .filter(
//         (u) =>
//           u.name.toLowerCase().includes(search.toLowerCase()) ||
//           u.email.toLowerCase().includes(search.toLowerCase())
//       )
//       .sort((a: any, b: any) => {
//         const valA = a[sortKey];
//         const valB = b[sortKey];

//         if (valA < valB) return sortOrder === "asc" ? -1 : 1;
//         if (valA > valB) return sortOrder === "asc" ? 1 : -1;
//         return 0;
//       });
//   }, [users, search, sortKey, sortOrder]);

//   // -------- MODALS --------
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showViewModal, setShowViewModal] = useState(false);

//   const statusColors: Record<string, string> = {
//     ACTIVE: "bg-green-500/20 text-green-400",
//     BLOCKED: "bg-red-500/20 text-red-400",
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             User Management
//           </h2>
//           <p className="text-dark-400 mt-1">
//             {totalUsers} users
//           </p>
//         </div>

//         {/* Search */}
//         <div className="relative w-72">
//           <FiSearch className="absolute left-3 top-3 text-dark-400" />
//           <input
//             placeholder="Search users..."
//             className="input-field pl-10"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="glass-card rounded-2xl overflow-x-auto p-4">
//         {loading ? (
//           <p className="text-center text-dark-400 py-6">
//             Loading…
//           </p>
//         ) : error ? (
//           <p className="text-center text-red-400 py-6">
//             {error}
//           </p>
//         ) : filteredUsers.length === 0 ? (
//           <p className="text-center text-dark-500 py-6">
//             No users found
//           </p>
//         ) : (
//           <table className="w-full text-sm text-dark-300">
//            <thead>
//   <tr className="text-left text-dark-400 border-b border-dark-700">
//     <th className="py-3">ID</th>
//     <th>Name</th>
//     <th>Email</th>
//     <th>Phone</th>
//     <th className="text-center">Orders</th>
//     <th className="text-center">Appointments</th>
//     <th>Role</th>
//     <th
//       className="cursor-pointer select-none"
//       onClick={() => handleSort("createdAt")}
//     >
//       Joined {sortKey === "createdAt" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
//     </th>
//     <th className="text-right">Actions</th>
//   </tr>
// </thead>

//             <tbody>
//               {filteredUsers.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="border-b border-dark-800"
//                 >
//                   <td className="py-3">{user.id}</td>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                   <td>{user.phone}</td>
//                   <td className="text-center">{user.orderCount}</td>
//                   <td className="text-center">{user.appointmentCount}</td>
//                   <td>{user.role}</td>
//                   <td>
//                     {format(
//                       new Date(user.createdAt),
//                       "MMM dd, yyyy"
//                     )}
//                   </td>

//                   <td>
//                     <div className="flex justify-end gap-3">
//                       <FiEye
//                         className="text-primary-400 cursor-pointer"
//                         onClick={() => {
//                           setSelectedUser(user);
//                           setShowViewModal(true);
//                         }}
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Pagination + Rows Per Page */}
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <span className="text-dark-300">
//             Rows per page:
//           </span>
//           <select
//             value={rowsPerPage}
//             onChange={(e) => {
//               setRowsPerPage(Number(e.target.value));
//               setPage(0);
//             }}
//             className="input-field w-24"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             disabled={page === 0}
//             onClick={() => setPage(page - 1)}
//             className="btn-ghost px-6 disabled:opacity-40"
//           >
//             Prev
//           </button>
//           <span className="text-dark-300 pt-2">
//             Page {page + 1} of {totalPages || 1}
//           </span>

//           <button
//             disabled={page + 1 >= totalPages}
//             onClick={() => setPage(page + 1)}
//             className="btn-ghost px-6 disabled:opacity-40"
//             >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* VIEW MODAL */}
//       <AnimatePresence>
//         {showViewModal && selectedUser && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowViewModal(false)}
//               className="backdrop-overlay"
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="glass-card rounded-2xl p-6 max-w-lg w-full"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-dark-900">
//                     {selectedUser.name}
//                   </h2>
//                   <FiX
//                     className="text-dark-400 cursor-pointer"
//                     size={22}
//                     onClick={() => setShowViewModal(false)}
//                   />
//                 </div>
//                 <p>Email: {selectedUser.email}</p>
//                 <p>Phone: {selectedUser.phone}</p>
//                 <p>Role: {selectedUser.role}</p>
//                 <p>Status: {selectedUser.isActive ? "ACTIVE" : "BLOCKED"}</p>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };
// export default AdminUsers;

// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiEye,
//   FiTrash,
//   FiX,
//   FiSearch,
//   FiPackage,
//   FiCalendar,
// } from "react-icons/fi";
// import { format } from "date-fns";
// import { useNavigate } from "react-router-dom";
// import { userApi, type User } from "../../api/userApi";

// const AdminUsers = () => {
//   const navigate = useNavigate();

//   const [users, setUsers] = useState<User[]>([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Search
//   const [search, setSearch] = useState("");

//   // Sort (Newest first)
//   const [sortKey, setSortKey] = useState<keyof User>("createdAt");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

//   const handleSort = (key: keyof User) => {
//     if (sortKey === key) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortKey(key);
//       setSortOrder("desc");
//     }
//   };

//   // Fetch Users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await userApi.getCustomers(page, rowsPerPage);

//         const sorted = [...res.content].sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() -
//             new Date(a.createdAt).getTime()
//         );

//         setUsers(sorted);
//         setTotalPages(res.totalPages);
//         setTotalUsers(res.totalElements);
//       } catch {
//         setError("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [page, rowsPerPage]);

//   // Search + Sort
//   const filteredUsers = useMemo(() => {
//     return users
//       .filter(
//         (u) =>
//           u.name.toLowerCase().includes(search.toLowerCase()) ||
//           u.email.toLowerCase().includes(search.toLowerCase())
//       )
//       .sort((a: any, b: any) => {
//         const valA = a[sortKey];
//         const valB = b[sortKey];
//         if (valA < valB) return sortOrder === "asc" ? -1 : 1;
//         if (valA > valB) return sortOrder === "asc" ? 1 : -1;
//         return 0;
//       });
//   }, [users, search, sortKey, sortOrder]);

//   // Status Toggle (UI only)
//   const handleStatusChange = (id: number, isActive: boolean) => {
//     setUsers((prev) =>
//       prev.map((u) =>
//         u.id === id ? { ...u, isActive } : u
//       )
//     );
//   };

//   // Delete (UI only)
//   const handleDeleteUser = (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     setUsers((prev) => prev.filter((u) => u.id !== id));
//   };

//   // View Modal
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showViewModal, setShowViewModal] = useState(false);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">User Management</h2>
//           <p className="text-dark-400 mt-1">{totalUsers} users</p>
//         </div>

//         {/* Search */}
//         <div className="relative w-72">
//           <FiSearch className="absolute left-3 top-3 text-dark-400" />
//           <input
//             className="input-field pl-10"
//             placeholder="Search users..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="glass-card rounded-2xl overflow-x-auto p-4">
//         {loading ? (
//           <p className="text-center text-dark-400 py-6">Loading…</p>
//         ) : error ? (
//           <p className="text-center text-red-400 py-6">{error}</p>
//         ) : (
//           <table className="w-full text-sm text-dark-300 table-fixed">
//             {/* COLUMN WIDTH CONTROL */}
//             <colgroup>
//               <col className="w-[70px]" />   {/* ID */}
//               <col className="w-[160px]" />  {/* Name */}
//               <col className="w-[280px]" />  {/* Email */}
//               <col className="w-[160px]" />  {/* Phone */}
//               <col className="w-[200px]" />  {/* Status */}
//               <col className="w-[160px]" />  {/* Created At */}
//               <col className="w-[180px]" />  {/* Actions */}
//             </colgroup>

//             <thead>
//               <tr className="text-left text-dark-400 border-b border-dark-700">
//                 <th className="py-4 px-2">ID</th>
//                 <th className="py-4 px-3">Name</th>
//                 <th className="py-4 px-3">Email</th>
//                 <th className="py-4 px-3">Phone</th>
//                 <th className="py-4 px-3 text-center">Status</th>
//                 <th
//                   className="py-4 px-3 cursor-pointer select-none"
//                   onClick={() => handleSort("createdAt")}
//                 >
//                   Created At{" "}
//                   {sortKey === "createdAt"
//                     ? sortOrder === "asc"
//                       ? "↑"
//                       : "↓"
//                     : ""}
//                 </th>
//                 <th className="py-4 px-3 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredUsers.map((user) => {
//                 const disabled = !user.isActive;

//                 return (
//                   <tr
//                     key={user.id}
//                     className="border-b border-dark-800 hover:bg-white/5 transition"
//                   >
//                     <td className="py-4 px-2">{user.id}</td>
//                     <td className="py-4 px-3">{user.name}</td>

//                     {/* EMAIL (WRAP FIX) */}
//                     <td className="py-4 px-3 break-all leading-5">
//                       {user.email}
//                     </td>

//                     {/* PHONE */}
//                     <td className="py-4 px-3 whitespace-nowrap">
//                       {user.phone}
//                     </td>

//                     {/* STATUS TOGGLE */}
//                     <td className="py-4 px-3">
//                       <div className="flex justify-center items-center gap-4">
//                         <button
//                           onClick={() =>
//                             handleStatusChange(user.id, !user.isActive)
//                           }
//                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition
//                             ${user.isActive ? "bg-green-500" : "bg-red-500"}`}
//                         >
//                           <span
//                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition
//                               ${user.isActive ? "translate-x-6" : "translate-x-1"}`}
//                           />
//                         </button>
//                         <span
//                           className={`text-xs font-semibold
//                             ${user.isActive ? "text-green-400" : "text-red-400"}`}
//                         >
//                           {user.isActive ? "Active" : "Inactive"}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="py-4 px-3">
//                       {format(new Date(user.createdAt), "MMM dd, yyyy")}
//                     </td>

//                     {/* ACTIONS */}
//                     <td className="py-4 px-3">
//                       <div
//                         className={`flex justify-end items-center gap-5 pr-2
//                           ${disabled ? "opacity-40 pointer-events-none" : ""}`}
//                       >
//                         <FiEye
//                           title="View"
//                           className="text-primary-400 cursor-pointer hover:scale-110 transition"
//                           onClick={() => {
//                             setSelectedUser(user);
//                             setShowViewModal(true);
//                           }}
//                         />

//                         <FiTrash
//                           title="Delete"
//                           className="text-red-400 cursor-pointer hover:scale-110 transition"
//                           onClick={() => handleDeleteUser(user.id)}
//                         />

//                         <FiPackage
//                           title="Orders"
//                           className="text-yellow-400 cursor-pointer hover:scale-110 transition"
//                           onClick={() =>
//                             navigate(`/admin/orders?userId=${user.id}`)
//                           }
//                         />

//                         <FiCalendar
//                           title="Appointments"
//                           className="text-blue-400 cursor-pointer hover:scale-110 transition"
//                           onClick={() =>
//                             navigate(`/admin/appointments?userId=${user.id}`)
//                           }
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <span className="text-dark-300">Rows per page:</span>
//           <select
//             value={rowsPerPage}
//             onChange={(e) => {
//               setRowsPerPage(Number(e.target.value));
//               setPage(0);
//             }}
//             className="input-field w-24"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             disabled={page === 0}
//             onClick={() => setPage(page - 1)}
//             className="btn-ghost px-6 disabled:opacity-40"
//           >
//             Prev
//           </button>
//           <span className="text-dark-300">
//             Page {page + 1} of {totalPages || 1}
//           </span>
//           <button
//             disabled={page + 1 >= totalPages}
//             onClick={() => setPage(page + 1)}
//             className="btn-ghost px-6 disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* View Modal */}
//       <AnimatePresence>
//         {showViewModal && selectedUser && (
//           <>
//             <motion.div
//               className="backdrop-overlay"
//               onClick={() => setShowViewModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-2xl p-6 max-w-lg w-full">
//                 <div className="flex justify-between mb-4">
//                   <h2 className="text-xl font-bold text-dark-900">
//                     {selectedUser.name}
//                   </h2>
//                   <FiX
//                     className="cursor-pointer"
//                     onClick={() => setShowViewModal(false)}
//                   />
//                 </div>
//                 <p>Email: {selectedUser.email}</p>
//                 <p>Phone: {selectedUser.phone}</p>
//                 <p>Role: {selectedUser.role}</p>
//                 <p>Status: {selectedUser.isActive ? "ACTIVE" : "INACTIVE"}</p>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminUsers;

// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiEye,
//   FiTrash,
//   FiX,
//   FiSearch,
//   FiPackage,
//   FiCalendar,
// } from "react-icons/fi";
// import { format } from "date-fns";
// import { userApi, type User } from "../../api/userApi";
// import orderApi from "../../api/orderApi";
// import appointmentApi from "../../api/appointmentApi";
// import toast from "react-hot-toast";

// const AdminUsers = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   // const [page, setPage] = useState(0);
//   // const [rowsPerPage, setRowsPerPage] = useState(5);
//   // const [totalPages, setTotalPages] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");

//   // View modal
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showViewModal, setShowViewModal] = useState(false);

//   // Orders modal
//   const [showOrdersModal, setShowOrdersModal] = useState(false);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [userOrders, setUserOrders] = useState<any[]>([]);

//   // Appointments modal
//   const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
//   const [appointmentsLoading, setAppointmentsLoading] = useState(false);
//   const [userAppointments, setUserAppointments] = useState<any[]>([]);

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const res = await userApi.getCustomers(0, 5);
//         setUsers(res.content);
//         // setTotalPages(res.totalPages);
//         setTotalUsers(res.totalElements);
//       } catch {
//         setError("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Search
//   const filteredUsers = useMemo(() => {
//     return users.filter(
//       (u) =>
//         u.name.toLowerCase().includes(search.toLowerCase()) ||
//         u.email.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [users, search]);

// const handleStatusChange = async (user: User) => {
//   try {
//     const updatedUser = user.isActive
//       ? await userApi.deactivateUser(user.id)
//       : await userApi.activateUser(user.id);

//     setUsers((prev) =>
//       prev.map((u) =>
//         u.id === updatedUser.id ? updatedUser : u
//       )
//     );

//     toast.success(
//       updatedUser.isActive ? "User activated" : "User deactivated"
//     );
//   } catch (err) {
//     toast.error("Failed to update user status");
//   }
// };

//   // Orders modal
//   const openOrdersModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowOrdersModal(true);
//     setOrdersLoading(true);

//     try {
//       const res = await orderApi.getUserOrders(user.id, 0, 50);
//       setUserOrders(res.content);
//     } catch {
//       toast.error("Failed to load orders");
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

// const openAppointmentsModal = async (user: User) => {
//   setSelectedUser(user);
//   setShowAppointmentsModal(true);
//   setAppointmentsLoading(true);

//   try {
//     // ✅ CORRECT API METHOD NAME
//     const res = await appointmentApi.getUserAppointments(
//       user.id,
//       0,
//       50
//     );

//     setUserAppointments(res.content);
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to load appointments");
//   } finally {
//     setAppointmentsLoading(false);
//   }
// };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">
//             User Management
//           </h2>
//           <p className="text-dark-600 mt-1">
//             {totalUsers} users
//           </p>
//         </div>

//         <div className="relative w-72">
//           <FiSearch className="absolute left-3 top-3 text-dark-400" />
//           <input
//             className="input-field pl-10"
//             placeholder="Search users..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table (UI UNCHANGED) */}
//       <div className="glass-card rounded-2xl overflow-x-auto p-4">
//         {loading ? (
//           <p className="text-center text-dark-400 py-6">
//             Loading…
//           </p>
//         ) : error ? (
//           <p className="text-center text-red-400 py-6">
//             {error}
//           </p>
//         ) : (
//           <table className="w-full text-sm text-dark-700 table-fixed">
//             <colgroup>
//               <col className="w-[70px]" />
//               <col className="w-[160px]" />
//               <col className="w-[280px]" />
//               <col className="w-[160px]" />
//               <col className="w-[200px]" />
//               <col className="w-[160px]" />
//               <col className="w-[180px]" />
//             </colgroup>

//             <thead>
//               <tr className="text-left text-dark-400 border-b border-dark-700">
//                 <th className="py-4 px-2">ID</th>
//                 <th className="py-4 px-3">Name</th>
//                 <th className="py-4 px-3">Email</th>
//                 <th className="py-4 px-3">Phone</th>
//                 <th className="py-4 px-3 text-center">Status</th>
//                 <th className="py-4 px-3">Created</th>
//                 <th className="py-4 px-3 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredUsers.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="border-b border-dark-200 hover:bg-dark-50 transition"
//                 >
//                   <td className="py-4 px-2">{user.id}</td>
//                   <td className="py-4 px-3">{user.name}</td>
//                   <td className="py-4 px-3 break-all">
//                     {user.email}
//                   </td>
//                   <td className="py-4 px-3">
//                     {user.phone}
//                   </td>

//                   {/* Status */}
//                   <td className="py-4 px-3">
//                     <div className="flex justify-center items-center gap-4">
//                       <button
//                       onClick={() => handleStatusChange(user)}
//                         className={`relative inline-flex h-6 w-11 rounded-full
//                           ${
//                             user.isActive
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                           }`}
//                       >
//                         <span
//                           className={`inline-block h-4 w-4 rounded-full bg-white transition
//                             ${
//                               user.isActive
//                                 ? "translate-x-6"
//                                 : "translate-x-1"
//                             }`}
//                         />
//                       </button>
//                       <span
//                         className={`text-xs font-semibold
//                           ${
//                             user.isActive
//                               ? "text-green-600"
//                               : "text-red-600"
//                           }`}
//                       >
//                         {user.isActive
//                           ? "Active"
//                           : "Inactive"}
//                       </span>
//                     </div>
//                   </td>

//                   <td className="py-4 px-3">
//                     {format(
//                       new Date(user.createdAt),
//                       "MMM dd, yyyy"
//                     )}
//                   </td>

//                   {/* Actions */}
//                   <td className="py-4 px-3">
//                     <div className="flex justify-end items-center gap-4 pr-2">
//                       <FiEye
//                         title="View"
//                         className="text-primary-400 cursor-pointer"
//                         onClick={() => {
//                           setSelectedUser(user);
//                           setShowViewModal(true);
//                         }}
//                       />

//                       <FiPackage
//                         title="Orders"
//                         className="text-yellow-600 cursor-pointer"
//                         onClick={() => openOrdersModal(user)}
//                       />

//                       <FiCalendar
//                         title="Appointments"
//                         className="text-blue-600 cursor-pointer"
//                         onClick={() => openAppointmentsModal(user)}
//                       />

//                     <FiTrash
//   title="Delete"
//   className="text-red-600 cursor-pointer"
//   onClick={async () => {
//     if (!window.confirm(`Delete ${user.name}?`)) return;

//     try {
//       const res = await userApi.deleteUser(user.id);

//       toast.success(res.message || "User deleted");

//       // Remove user from table
//       setUsers((prev) => prev.filter((u) => u.id !== user.id));
//     } catch (err: any) {
//       toast.error(
//         err?.response?.data?.message ||
//         "Cannot delete user. Deactivate instead."
//       );
//     }
//   }}
// />

//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* ================= VIEW USER MODAL ================= */}
//       <AnimatePresence>
//         {showViewModal && selectedUser && (
//           <>
//             <motion.div
//               className="backdrop-overlay"
//               onClick={() => setShowViewModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-3xl p-8 max-w-xl w-full">
//                 <div className="flex justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-dark-900">
//                       {selectedUser.name}
//                     </h2>
//                     <p className="text-sm text-dark-400">
//                       User ID: #{selectedUser.id}
//                     </p>
//                   </div>
//                   <FiX
//                     className="cursor-pointer text-dark-400 hover:text-dark-900"
//                     onClick={() => setShowViewModal(false)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
//                   <div>
//  <p className="text-xs font-semibold uppercase tracking-wider text-dark-700 mb-1">
//   Email
// </p>
// <p className="text-base font-semibold text-dark-900 break-all">

//                       {selectedUser.email}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-dark-700 mb-1">
//   Phone
// </p>
//                    <p className="text-base font-semibold text-dark-900 break-all">
//                       {selectedUser.phone}
//                     </p>
//                   </div>

//                   <div>
//                    <p className="text-xs font-semibold uppercase tracking-wider text-dark-700 mb-1">
//   Status
// </p>
//                     <span
//                       className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
//                         ${
//                           selectedUser.isActive
//                             ? "bg-green-500/20 text-green-400"
//                             : "bg-red-500/20 text-red-400"
//                         }`}
//                     >
//                       {selectedUser.isActive
//                         ? "ACTIVE"
//                         : "INACTIVE"}
//                     </span>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-dark-700 mb-1">
//   Created At
// </p>
//                     <p className="text-base font-semibold text-dark-900 break-all">
//                       {format(
//                         new Date(selectedUser.createdAt),
//                         "MMM dd, yyyy"
//                       )}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="my-6 border-t border-white/10" />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-dark-900">
//                       {selectedUser.orderCount ?? 0}
//                     </p>
//                     <p className="text-xs text-dark-400 mt-1">
//                       Total Orders
//                     </p>
//                   </div>

//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-dark-900">
//                       {selectedUser.appointmentCount ?? 0}
//                     </p>
//                     <p className="text-xs text-dark-400 mt-1">
//                       Appointments
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-8">
//                   <button
//                     onClick={() => setShowViewModal(false)}
//                     className="btn-primary px-6"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ORDERS MODAL ================= */}
//       <AnimatePresence>
//         {showOrdersModal && selectedUser && (
//           <>
//             <motion.div
//               className="backdrop-overlay"
//               onClick={() => setShowOrdersModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-2xl p-6 max-w-3xl w-full">
//                 <div className="flex justify-between mb-4">
//                   <h2 className="text-xl font-bold text-dark-900">
//                     Orders – {selectedUser.name}
//                   </h2>
//                   <FiX
//                     className="cursor-pointer"
//                     onClick={() => setShowOrdersModal(false)}
//                   />
//                 </div>

//                 {ordersLoading ? (
//                   <p className="text-center text-dark-400">
//                     Loading…
//                   </p>
//                 ) : userOrders.length === 0 ? (
//                   <p className="text-center text-dark-400">
//                     No orders found
//                   </p>
//                 ) : (
//                   <div className="space-y-3 max-h-[60vh] overflow-auto">
//                     {userOrders.map((o) => (
//                       <div
//                         key={o.id}
//                         className="glass-card p-4 rounded-xl"
//                       >
//                         <div className="flex justify-between">
//                           <span className="font-semibold text-dark-900">
//                             Order #{o.id}
//                           </span>
//                           <span className="text-sm text-dark-400">
//                             {o.status}
//                           </span>
//                         </div>
//                         <p className="text-sm text-dark-600">
//                           Amount: ₹{o.totalAmount}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= APPOINTMENTS MODAL ================= */}
//       <AnimatePresence>
//         {showAppointmentsModal && selectedUser && (
//           <>
//             <motion.div
//               className="backdrop-overlay"
//               onClick={() => setShowAppointmentsModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-2xl p-6 max-w-3xl w-full">
//                 <div className="flex justify-between mb-4">
//                   <h2 className="text-xl font-bold text-dark-900">
//                     Appointments – {selectedUser.name}
//                   </h2>
//                   <FiX
//                     className="cursor-pointer"
//                     onClick={() =>
//                       setShowAppointmentsModal(false)
//                     }
//                   />
//                 </div>

//                 {appointmentsLoading ? (
//                   <p className="text-center text-dark-400">
//                     Loading…
//                   </p>
//                 ) : userAppointments.length === 0 ? (
//                   <p className="text-center text-dark-400">
//                     No appointments found
//                   </p>
//                 ) : (
//                   <div className="space-y-3 max-h-[60vh] overflow-auto">
//                     {userAppointments.map((a) => (
//                       <div
//                         key={a.id}
//                         className="glass-card p-4 rounded-xl"
//                       >
//                         <p className="font-semibold text-dark-900">
//                           {a.serviceType}
//                         </p>
//                         <p className="text-sm text-dark-400">
//                           {a.appointmentDate} •{" "}
//                           {a.appointmentTime}
//                         </p>
//                         <p className="text-sm text-dark-400">
//                           Status: {a.status}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminUsers;



// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiEye,
//   FiTrash,
//   FiX,
//   FiSearch,
//   FiPackage,
//   FiCalendar,
//   FiMapPin,
//   FiCreditCard,
//   FiTruck,
//   FiCalendar as CalendarIcon,
// } from "react-icons/fi";
// import { format } from "date-fns";
// import { userApi, type User } from "../../api/userApi";
// import orderApi from "../../api/orderApi";
// import appointmentApi from "../../api/appointmentApi";
// import toast from "react-hot-toast";

// interface OrderItem {
//   id: number;
//   productId: number;
//   productName: string;
//   productImage: string;
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
//   selectedSize: string;
//   selectedColor: string;
// }

// interface Order {
//   id: number;
//   userId: number;
//   status: string;
//   paymentStatus: string;
//   totalAmount: number;
//   discount: number | null;
//   tax: number | null;
//   trackingNumber: string | null;
//   shippingAddress: string;
//   createdAt: string;
//   updatedAt: string;
//   items: OrderItem[];
// }

// const AdminUsers = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");

//   // View modal
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showViewModal, setShowViewModal] = useState(false);

//   // Orders modal
//   const [showOrdersModal, setShowOrdersModal] = useState(false);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [userOrders, setUserOrders] = useState<Order[]>([]);

//   // Order detail modal
//   const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   // Appointments modal
//   const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
//   const [appointmentsLoading, setAppointmentsLoading] = useState(false);
//   const [userAppointments, setUserAppointments] = useState<any[]>([]);

//   // Mock product images as fallback
//   const mockProductImages = [
//     "/api/placeholder/400/400", // Use a placeholder or fallback
//   ];

//   // Helper function to build image URL from backend
//   const getProductImageUrl = (imagePath: string | undefined, fallbackIndex: number = 0) => {
//     if (!imagePath) return mockProductImages[fallbackIndex];
    
//     // If imagePath is already a full URL, return it
//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }
    
//     // For Vite, use import.meta.env instead of process.env
//     // const backendBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    
//     // Alternative: Use a relative path or your actual API base URL
//     // If your images are served from the same backend as your API:
//     const backendBaseUrl = ''; // Empty string for relative paths
    
//     // If the imagePath doesn't start with /uploads or similar, prepend it
//     if (!imagePath.startsWith('/') && !imagePath.startsWith('uploads/')) {
//       return `${backendBaseUrl}/uploads/${imagePath}`;
//     }
    
//     return `${backendBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
//   };

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const res = await userApi.getCustomers(0, 5);
//         setUsers(res.content);
//         setTotalUsers(res.totalElements);
//       } catch {
//         setError("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Search
//   const filteredUsers = useMemo(() => {
//     return users.filter(
//       (u) =>
//         u.name.toLowerCase().includes(search.toLowerCase()) ||
//         u.email.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [users, search]);

//   const handleStatusChange = async (user: User) => {
//     try {
//       const updatedUser = user.isActive
//         ? await userApi.deactivateUser(user.id)
//         : await userApi.activateUser(user.id);

//       setUsers((prev) =>
//         prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
//       );

//       toast.success(
//         updatedUser.isActive ? "User activated" : "User deactivated"
//       );
//     } catch (err) {
//       toast.error("Failed to update user status");
//     }
//   };

//   // Get status color using your theme
//   const getStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case "PENDING":
//         return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
//       case "PROCESSING":
//         return "bg-sage/20 text-sage border-sage/30";
//       case "SHIPPED":
//         return "bg-blue-500/20 text-blue-600 border-blue-500/30";
//       case "DELIVERED":
//         return "bg-green-500/20 text-green-600 border-green-500/30";
//       case "CANCELLED":
//         return "bg-red-500/20 text-red-600 border-red-500/30";
//       default:
//         return "bg-muted text-muted-foreground border-border";
//     }
//   };

//   // Get payment status color
//   const getPaymentStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case "PAID":
//         return "text-green-600";
//       case "PENDING":
//         return "text-yellow-600";
//       case "FAILED":
//         return "text-red-600";
//       default:
//         return "text-muted-foreground";
//     }
//   };

//   // Orders modal
//   const openOrdersModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowOrdersModal(true);
//     setOrdersLoading(true);

//     try {
//       const res = await orderApi.getUserOrders(user.id, 0, 50);
//       console.log("Orders API Response:", res); // Debug log
      
//       // SAFER TRANSFORMATION: Check if content exists
//       if (!res || !res.content) {
//         setUserOrders([]);
//         return;
//       }

//       const transformedOrders: Order[] = res.content.map((order: any, index: number) => {
//         // Get a random mock image for fallback
//         const fallbackImage = mockProductImages[0];
        
//         // Check if order has items
//         const hasItems = order.items && Array.isArray(order.items) && order.items.length > 0;
        
//         return {
//           id: order.id || index,
//           userId: order.userId || user.id,
//           status: order.status || "PENDING",
//           paymentStatus: order.paymentStatus || "PENDING",
//           totalAmount: order.totalAmount || 0,
//           discount: order.discount || null,
//           tax: order.tax || null,
//           trackingNumber: order.trackingNumber || null,
//           shippingAddress: order.shippingAddress || "Address not specified",
//           createdAt: order.createdAt || new Date().toISOString(),
//           updatedAt: order.updatedAt || new Date().toISOString(),
//           items: hasItems 
//             ? order.items.map((item: any, itemIndex: number) => ({
//                 id: item.id || itemIndex,
//                 productId: item.productId || 0,
//                 productName: item.productName || `Product ${itemIndex + 1}`,
//                 // Use the actual image path from API, let getProductImageUrl handle it
//                 productImage: item.productImage || item.imageUrl || '',
//                 quantity: item.quantity || 1,
//                 unitPrice: item.unitPrice || item.price || 0,
//                 totalPrice: item.totalPrice || (item.quantity || 1) * (item.unitPrice || item.price || 0),
//                 selectedSize: item.selectedSize || item.size || "M",
//                 selectedColor: item.selectedColor || item.color || "Black",
//               }))
//             : [{
//                 id: 0,
//                 productId: order.id || 0,
//                 productName: order.productName || "Unknown Product",
//                 productImage: fallbackImage,
//                 quantity: 1,
//                 unitPrice: order.totalAmount || 0,
//                 totalPrice: order.totalAmount || 0,
//                 selectedSize: "M",
//                 selectedColor: "Black",
//               }],
//         };
//       });
      
//       console.log("Transformed orders:", transformedOrders); // Debug log
//       setUserOrders(transformedOrders);
//     } catch (error) {
//       console.error("Error loading orders:", error);
//       toast.error("Failed to load orders");
//       setUserOrders([]); // Set empty array on error
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const openAppointmentsModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowAppointmentsModal(true);
//     setAppointmentsLoading(true);

//     try {
//       const res = await appointmentApi.getUserAppointments(user.id, 0, 50);
//       setUserAppointments(res.content || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load appointments");
//     } finally {
//       setAppointmentsLoading(false);
//     }
//   };

//   const openOrderDetail = (order: Order) => {
//     setSelectedOrder(order);
//     setShowOrderDetailModal(true);
//   };

//   // Safe render helper for order items
//   const renderOrderItem = (order: Order) => {
//     if (!order.items || order.items.length === 0) {
//       return {
//         productImage: mockProductImages[0],
//         productName: "Unknown Product",
//         productId: order.id,
//         itemsLength: 0
//       };
//     }
    
//     const firstItem = order.items[0];
//     return {
//       productImage: getProductImageUrl(firstItem.productImage),
//       productName: firstItem.productName || "Unknown Product",
//       productId: firstItem.productId || order.id,
//       itemsLength: order.items.length
//     };
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">User Management</h2>
//           <p className="text-muted-foreground mt-1">{totalUsers} users</p>
//         </div>

//         <div className="relative w-72">
//           <FiSearch className="absolute left-3 top-3 text-muted-foreground" />
//           <input
//             className="input-field pl-10"
//             placeholder="Search users..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="glass-card rounded-2xl overflow-x-auto p-4">
//         {loading ? (
//           <p className="text-center text-muted-foreground py-6">Loading…</p>
//         ) : error ? (
//           <p className="text-center text-destructive py-6">{error}</p>
//         ) : (
//           <table className="w-full text-sm text-foreground table-fixed">
//             <colgroup>
//               <col className="w-[70px]" />
//               <col className="w-[160px]" />
//               <col className="w-[280px]" />
//               <col className="w-[160px]" />
//               <col className="w-[200px]" />
//               <col className="w-[160px]" />
//               <col className="w-[180px]" />
//             </colgroup>

//             <thead>
//               <tr className="text-left text-muted-foreground border-b border-border">
//                 <th className="py-4 px-2">ID</th>
//                 <th className="py-4 px-3">Name</th>
//                 <th className="py-4 px-3">Email</th>
//                 <th className="py-4 px-3">Phone</th>
//                 <th className="py-4 px-3 text-center">Status</th>
//                 <th className="py-4 px-3">Created</th>
//                 <th className="py-4 px-3 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredUsers.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="border-b border-border/50 hover:bg-secondary/50 transition"
//                 >
//                   <td className="py-4 px-2">{user.id}</td>
//                   <td className="py-4 px-3">{user.name}</td>
//                   <td className="py-4 px-3 break-all">{user.email}</td>
//                   <td className="py-4 px-3">{user.phone}</td>

//                   {/* Status */}
//                   <td className="py-4 px-3">
//                     <div className="flex justify-center items-center gap-4">
//                       <button
//                         onClick={() => handleStatusChange(user)}
//                         className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
//                           user.isActive ? "bg-green-500" : "bg-red-500"
//                         }`}
//                       >
//                         <span
//                           className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
//                             user.isActive ? "translate-x-6" : "translate-x-1"
//                           }`}
//                         />
//                       </button>
//                       <span
//                         className={`text-xs font-semibold ${
//                           user.isActive ? "text-green-600" : "text-red-600"
//                         }`}
//                       >
//                         {user.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </div>
//                   </td>

//                   <td className="py-4 px-3">
//                     {format(new Date(user.createdAt), "MMM dd, yyyy")}
//                   </td>

//                   {/* Actions */}
//                   <td className="py-4 px-3">
//                     <div className="flex justify-end items-center gap-4 pr-2">
//                       <FiEye
//                         title="View"
//                         className="text-primary hover:text-primary/80 cursor-pointer transition-colors"
//                         onClick={() => {
//                           setSelectedUser(user);
//                           setShowViewModal(true);
//                         }}
//                       />

//                       <FiPackage
//                         title="Orders"
//                         className="text-sage hover:text-sage/80 cursor-pointer transition-colors"
//                         onClick={() => openOrdersModal(user)}
//                       />

//                       <FiCalendar
//                         title="Appointments"
//                         className="text-blue-600 hover:text-blue-600/80 cursor-pointer transition-colors"
//                         onClick={() => openAppointmentsModal(user)}
//                       />

//                       <FiTrash
//                         title="Delete"
//                         className="text-destructive hover:text-destructive/80 cursor-pointer transition-colors"
//                         onClick={async () => {
//                           if (!window.confirm(`Delete ${user.name}?`)) return;

//                           try {
//                             const res = await userApi.deleteUser(user.id);
//                             toast.success(res.message || "User deleted");
//                             setUsers((prev) =>
//                               prev.filter((u) => u.id !== user.id)
//                             );
//                           } catch (err: any) {
//                             toast.error(
//                               err?.response?.data?.message ||
//                                 "Cannot delete user. Deactivate instead."
//                             );
//                           }
//                         }}
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* ================= VIEW USER MODAL ================= */}
//       <AnimatePresence>
//         {showViewModal && selectedUser && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowViewModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-3xl p-8 max-w-xl w-full">
//                 <div className="flex justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-foreground">
//                       {selectedUser.name}
//                     </h2>
//                     <p className="text-sm text-muted-foreground">
//                       User ID: #{selectedUser.id}
//                     </p>
//                   </div>
//                   <FiX
//                     className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
//                     onClick={() => setShowViewModal(false)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Email
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {selectedUser.email}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Phone
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {selectedUser.phone}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Status
//                     </p>
//                     <span
//                       className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
//                         selectedUser.isActive
//                           ? "bg-green-500/20 text-green-600"
//                           : "bg-red-500/20 text-red-600"
//                       }`}
//                     >
//                       {selectedUser.isActive ? "ACTIVE" : "INACTIVE"}
//                     </span>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Created At
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {format(new Date(selectedUser.createdAt), "MMM dd, yyyy")}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="my-6 border-t border-border" />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-foreground">
//                       {selectedUser.orderCount ?? 0}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
//                   </div>

//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-foreground">
//                       {selectedUser.appointmentCount ?? 0}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Appointments</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-8">
//                   <button
//                     onClick={() => setShowViewModal(false)}
//                     className="bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ENHANCED ORDERS MODAL ================= */}
//       <AnimatePresence>
//         {showOrdersModal && selectedUser && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowOrdersModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-card border border-border rounded-3xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-xl bg-gradient-sage flex items-center justify-center">
//                       <FiPackage className="text-white" size={20} />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-foreground">
//                         Customer Orders
//                       </h2>
//                       <p className="text-sm text-muted-foreground">
//                         {userOrders.length} total orders • {selectedUser.name}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowOrdersModal(false)}
//                     className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
//                   >
//                     <FiX className="text-muted-foreground" size={20} />
//                   </button>
//                 </div>

//                 {ordersLoading ? (
//                   <p className="text-center text-muted-foreground py-10">Loading orders…</p>
//                 ) : userOrders.length === 0 ? (
//                   <p className="text-center text-muted-foreground py-10">
//                     No orders found for this user
//                   </p>
//                 ) : (
//                   <div className="flex-1 overflow-y-auto space-y-4 pr-2">
//                     {userOrders.map((order) => {
//                       // SAFE ACCESS: Use helper function
//                       const firstItem = renderOrderItem(order);
                      
//                       return (
//                         <motion.div
//                           key={order.id}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="bg-gradient-to-br from-background to-secondary/50 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group hover:shadow-lg"
//                         >
//                           <div className="p-5 flex gap-5">
//                             <div className="relative flex-shrink-0">
//                               <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border-2 border-border group-hover:border-primary/50 transition-colors">
//                                 <img
//                                   src={firstItem.productImage}
//                                   alt={firstItem.productName}
//                                   className="w-full h-full object-cover"
//                                   onError={(e) => {
//                                     // Fallback if image fails to load
//                                     e.currentTarget.src = mockProductImages[0];
//                                   }}
//                                 />
//                               </div>
//                               {firstItem.itemsLength > 1 && (
//                                 <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
//                                   +{firstItem.itemsLength - 1}
//                                 </div>
//                               )}
//                             </div>

//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-start justify-between gap-4 mb-3">
//                                 <div>
//                                   <h3 className="text-base font-bold text-foreground mb-1">
//                                     {firstItem.productName}
//                                   </h3>
//                                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
//                                     <span className="font-medium">
//                                       Product ID: #{firstItem.productId}
//                                     </span>
//                                     <span className="w-1 h-1 bg-border rounded-full"></span>
//                                     <span>Order ID: #{order.id}</span>
//                                   </div>
//                                 </div>
//                                 <span
//                                   className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
//                                     order.status
//                                   )}`}
//                                 >
//                                   {order.status}
//                                 </span>
//                               </div>

//                               <div className="flex items-center gap-4 mb-3">
//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                   <CalendarIcon className="text-muted-foreground" size={14} />
//                                   <span>
//                                     {format(new Date(order.createdAt), "MMM dd, yyyy")}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                   <FiCreditCard className="text-muted-foreground" size={14} />
//                                   <span className="font-semibold text-foreground">
//                                     ${order.totalAmount.toFixed(2)}
//                                   </span>
//                                 </div>
//                                 {order.trackingNumber && (
//                                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                     <FiTruck className="text-muted-foreground" size={14} />
//                                     <span className="text-xs">{order.trackingNumber}</span>
//                                   </div>
//                                 )}
//                               </div>

//                               <button
//                                 onClick={() => openOrderDetail(order)}
//                                 className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-sage text-white rounded-lg font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90"
//                               >
//                                 <FiPackage size={14} />
//                                 View Details
//                               </button>
//                             </div>
//                           </div>
//                         </motion.div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ORDER DETAIL MODAL ================= */}
//       <AnimatePresence>
//         {showOrderDetailModal && selectedOrder && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
//               onClick={() => setShowOrderDetailModal(false)}
//             />
//             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-card border border-border rounded-3xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//               >
//                 <div className="bg-gradient-sage px-6 py-5 flex justify-between items-center">
//                   <div>
//                     <h2 className="text-xl font-bold text-white">Order Details</h2>
//                     <p className="text-white/80 text-sm">
//                       Order #{selectedOrder.id}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setShowOrderDetailModal(false)}
//                     className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
//                   >
//                     <FiX className="text-white" size={20} />
//                   </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                           <FiPackage className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-primary font-semibold uppercase tracking-wide">
//                             Status
//                           </p>
//                           <p className="text-base font-bold text-foreground">
//                             {selectedOrder.status}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
//                           <FiCreditCard className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">
//                             Payment
//                           </p>
//                           <p className={`text-base font-bold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
//                             {selectedOrder.paymentStatus}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
//                           <CalendarIcon className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">
//                             Order Date
//                           </p>
//                           <p className="text-base font-bold text-foreground">
//                             {format(new Date(selectedOrder.createdAt), "MMM dd, yyyy")}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-5 border border-border">
//                     <div className="flex items-center gap-3 mb-3">
//                       <FiMapPin className="text-primary" size={18} />
//                       <h3 className="text-base font-bold text-foreground">
//                         Shipping Address
//                       </h3>
//                     </div>
//                     <p className="text-foreground text-sm leading-relaxed">
//                       {selectedOrder.shippingAddress}
//                     </p>
//                     {selectedOrder.trackingNumber && (
//                       <div className="mt-3 pt-3 border-t border-border">
//                         <div className="flex items-center gap-2">
//                           <FiTruck className="text-primary" size={16} />
//                           <span className="text-sm text-muted-foreground">Tracking Number:</span>
//                           <span className="text-sm font-bold text-foreground">
//                             {selectedOrder.trackingNumber}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <h3 className="text-base font-bold text-foreground mb-3">
//                       Order Items
//                     </h3>
//                     <div className="space-y-3">
//                       {selectedOrder.items?.map((item, index) => {
//                         const imageUrl = getProductImageUrl(item.productImage);
//                         return (
//                           <div
//                             key={item.id || index}
//                             className="bg-background rounded-xl border border-border p-4 flex gap-4 hover:border-primary/50 transition-colors"
//                           >
//                             <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
//                               <img
//                                 src={imageUrl}
//                                 alt={item.productName}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   e.currentTarget.src = mockProductImages[0];
//                                 }}
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="text-base font-bold text-foreground mb-1">
//                                 {item.productName || "Unknown Product"}
//                               </h4>
//                               <p className="text-xs text-muted-foreground mb-2">
//                                 Product ID: #{item.productId || "N/A"}
//                               </p>
//                               <div className="flex items-center gap-3 text-xs">
//                                 {item.selectedSize && (
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-muted-foreground">Size:</span>
//                                     <span className="font-semibold text-foreground">
//                                       {item.selectedSize}
//                                     </span>
//                                   </div>
//                                 )}
//                                 {item.selectedColor && (
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-muted-foreground">Color:</span>
//                                     <span className="font-semibold text-foreground">
//                                       {item.selectedColor}
//                                     </span>
//                                   </div>
//                                 )}
//                                 <div className="flex items-center gap-1.5">
//                                   <span className="text-muted-foreground">Qty:</span>
//                                   <span className="font-semibold text-foreground">
//                                     {item.quantity || 1}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-xs text-muted-foreground mb-1">Price</p>
//                               <p className="text-lg font-bold text-foreground">
//                                 ${(item.totalPrice || 0).toFixed(2)}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-border">
//                     <h3 className="text-base font-bold text-foreground mb-3">
//                       Order Summary
//                     </h3>
//                     <div className="space-y-2">
//                       {selectedOrder.discount && selectedOrder.discount > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Discount</span>
//                           <span className="font-semibold text-green-600">
//                             -${selectedOrder.discount.toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                       {selectedOrder.tax && selectedOrder.tax > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Tax</span>
//                           <span className="font-semibold text-foreground">
//                             ${selectedOrder.tax.toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                       <div className="pt-3 border-t-2 border-primary flex justify-between">
//                         <span className="text-base font-bold text-foreground">
//                           Total Amount
//                         </span>
//                         <span className="text-xl font-bold text-primary">
//                           ${selectedOrder.totalAmount.toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-secondary/50 px-6 py-4 flex justify-end gap-3 border-t border-border">
//                   <button
//                     onClick={() => setShowOrderDetailModal(false)}
//                     className="px-5 py-2 bg-background hover:bg-secondary text-foreground font-semibold rounded-lg border border-border transition-colors text-sm"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= APPOINTMENTS MODAL ================= */}
//       <AnimatePresence>
//         {showAppointmentsModal && selectedUser && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowAppointmentsModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-2xl p-6 max-w-3xl w-full">
//                 <div className="flex justify-between mb-4">
//                   <h2 className="text-xl font-bold text-foreground">
//                     Appointments – {selectedUser.name}
//                   </h2>
//                   <FiX
//                     className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
//                     onClick={() => setShowAppointmentsModal(false)}
//                   />
//                 </div>

//                 {appointmentsLoading ? (
//                   <p className="text-center text-muted-foreground">Loading…</p>
//                 ) : userAppointments.length === 0 ? (
//                   <p className="text-center text-muted-foreground">No appointments found</p>
//                 ) : (
//                   <div className="space-y-3 max-h-[60vh] overflow-auto">
//                     {userAppointments.map((a) => (
//                       <div key={a.id} className="glass-card p-4 rounded-xl">
//                         <p className="font-semibold text-foreground">{a.serviceType}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {a.appointmentDate} • {a.appointmentTime}
//                         </p>
//                         <p className="text-sm text-muted-foreground">Status: {a.status}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminUsers;


// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiEye,
//   FiTrash,
//   FiX,
//   FiSearch,
//   FiPackage,
//   FiCalendar,
//   FiMapPin,
//   FiCreditCard,
//   FiTruck,
//   FiCalendar as CalendarIcon,
//   FiEdit2,
//   FiPlay,
//   FiPause,
//   FiChevronLeft,
//   FiChevronRight,
//   FiChevronsLeft,
//   FiChevronsRight,
// } from "react-icons/fi";
// import { format } from "date-fns";
// import { userApi, type User } from "../../api/userApi";
// import orderApi from "../../api/orderApi";
// import appointmentApi from "../../api/appointmentApi";
// import toast from "react-hot-toast";

// interface OrderItem {
//   id: number;
//   productId: number;
//   productName: string;
//   productImage: string;
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
//   selectedSize: string;
//   selectedColor: string;
// }

// interface Order {
//   id: number;
//   userId: number;
//   status: string;
//   paymentStatus: string;
//   totalAmount: number;
//   discount: number | null;
//   tax: number | null;
//   trackingNumber: string | null;
//   shippingAddress: string;
//   createdAt: string;
//   updatedAt: string;
//   items: OrderItem[];
// }

// const AdminUsers = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   // Column filters
//   const [columnFilters, setColumnFilters] = useState({
//     id: '',
//     name: '',
//     email: '',
//     phone: '',
//     status: '',
//     date: ''
//   });

//   // View modal
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showViewModal, setShowViewModal] = useState(false);

//   // Orders modal
//   const [showOrdersModal, setShowOrdersModal] = useState(false);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [userOrders, setUserOrders] = useState<Order[]>([]);

//   // Order detail modal
//   const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   // Appointments modal
//   const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
//   const [appointmentsLoading, setAppointmentsLoading] = useState(false);
//   const [userAppointments, setUserAppointments] = useState<any[]>([]);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   const mockProductImages = [
//     "/api/placeholder/400/400",
//   ];

//   const getProductImageUrl = (imagePath: string | undefined, fallbackIndex: number = 0) => {
//     if (!imagePath) return mockProductImages[fallbackIndex];
    
//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }
    
//     const backendBaseUrl = '';
    
//     if (!imagePath.startsWith('/') && !imagePath.startsWith('uploads/')) {
//       return `${backendBaseUrl}/uploads/${imagePath}`;
//     }
    
//     return `${backendBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
//   };

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const offset = (page - 1) * rowsPerPage;
//         const res = await userApi.getCustomers(offset, rowsPerPage);
//         setUsers(res.content);
//         setTotalUsers(res.totalElements);
//       } catch {
//         setError("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [page, rowsPerPage]);

//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1);
//   };

//   // Filtered users
//   const filteredUsers = useMemo(() => {
//     if (!users || !Array.isArray(users)) return [];
    
//     return users.filter(user => {
//       const matchesId = user.id.toString().includes(columnFilters.id);
//       const matchesName = (user.name || '').toLowerCase().includes(columnFilters.name.toLowerCase());
//       const matchesEmail = (user.email || '').toLowerCase().includes(columnFilters.email.toLowerCase());
//       const matchesPhone = (user.phone || '').includes(columnFilters.phone);
//       const matchesStatus = 
//         columnFilters.status === '' || 
//         (columnFilters.status === 'ACTIVE' && user.isActive) || 
//         (columnFilters.status === 'INACTIVE' && !user.isActive);
//       const matchesDate = 
//         columnFilters.date === '' || 
//         format(new Date(user.createdAt), 'yyyy-MM-dd').includes(columnFilters.date);
      
//       return matchesId && matchesName && matchesEmail && matchesPhone && matchesStatus && matchesDate;
//     });
//   }, [users, columnFilters]);

//   const totalPages = Math.ceil(totalUsers / rowsPerPage);

//   const handleStatusChange = async (user: User) => {
//     try {
//       const updatedUser = user.isActive
//         ? await userApi.deactivateUser(user.id)
//         : await userApi.activateUser(user.id);

//       setUsers((prev) =>
//         prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
//       );

//       toast.success(
//         updatedUser.isActive ? "User activated" : "User deactivated"
//       );
//     } catch (err) {
//       toast.error("Failed to update user status");
//     }
//   };

//   // Get status color using your theme
//   const getStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "PROCESSING":
//         return "bg-blue-100 text-blue-800";
//       case "SHIPPED":
//         return "bg-purple-100 text-purple-800";
//       case "DELIVERED":
//         return "bg-green-100 text-green-800";
//       case "CANCELLED":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Get payment status color
//   const getPaymentStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case "PAID":
//         return "text-green-700";
//       case "PENDING":
//         return "text-yellow-700";
//       case "FAILED":
//         return "text-red-700";
//       default:
//         return "text-gray-700";
//     }
//   };

//   // Orders modal
//   const openOrdersModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowOrdersModal(true);
//     setOrdersLoading(true);

//     try {
//       const res = await orderApi.getUserOrders(user.id, 0, 50);
      
//       if (!res || !res.content) {
//         setUserOrders([]);
//         return;
//       }

//       const transformedOrders: Order[] = res.content.map((order: any, index: number) => {
//         const fallbackImage = mockProductImages[0];
        
//         const hasItems = order.items && Array.isArray(order.items) && order.items.length > 0;
        
//         return {
//           id: order.id || index,
//           userId: order.userId || user.id,
//           status: order.status || "PENDING",
//           paymentStatus: order.paymentStatus || "PENDING",
//           totalAmount: order.totalAmount || 0,
//           discount: order.discount || null,
//           tax: order.tax || null,
//           trackingNumber: order.trackingNumber || null,
//           shippingAddress: order.shippingAddress || "Address not specified",
//           createdAt: order.createdAt || new Date().toISOString(),
//           updatedAt: order.updatedAt || new Date().toISOString(),
//           items: hasItems 
//             ? order.items.map((item: any, itemIndex: number) => ({
//                 id: item.id || itemIndex,
//                 productId: item.productId || 0,
//                 productName: item.productName || `Product ${itemIndex + 1}`,
//                 productImage: item.productImage || item.imageUrl || '',
//                 quantity: item.quantity || 1,
//                 unitPrice: item.unitPrice || item.price || 0,
//                 totalPrice: item.totalPrice || (item.quantity || 1) * (item.unitPrice || item.price || 0),
//                 selectedSize: item.selectedSize || item.size || "M",
//                 selectedColor: item.selectedColor || item.color || "Black",
//               }))
//             : [{
//                 id: 0,
//                 productId: order.id || 0,
//                 productName: order.productName || "Unknown Product",
//                 productImage: fallbackImage,
//                 quantity: 1,
//                 unitPrice: order.totalAmount || 0,
//                 totalPrice: order.totalAmount || 0,
//                 selectedSize: "M",
//                 selectedColor: "Black",
//               }],
//         };
//       });
      
//       setUserOrders(transformedOrders);
//     } catch (error) {
//       console.error("Error loading orders:", error);
//       toast.error("Failed to load orders");
//       setUserOrders([]);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const openAppointmentsModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowAppointmentsModal(true);
//     setAppointmentsLoading(true);

//     try {
//       const res = await appointmentApi.getUserAppointments(user.id, 0, 50);
//       setUserAppointments(res.content || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load appointments");
//     } finally {
//       setAppointmentsLoading(false);
//     }
//   };

//   const openOrderDetail = (order: Order) => {
//     setSelectedOrder(order);
//     setShowOrderDetailModal(true);
//   };

//   const renderOrderItem = (order: Order) => {
//     if (!order.items || order.items.length === 0) {
//       return {
//         productImage: mockProductImages[0],
//         productName: "Unknown Product",
//         productId: order.id,
//         itemsLength: 0
//       };
//     }
    
//     const firstItem = order.items[0];
//     return {
//       productImage: getProductImageUrl(firstItem.productImage),
//       productName: firstItem.productName || "Unknown Product",
//       productId: firstItem.productId || order.id,
//       itemsLength: order.items.length
//     };
//   };

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">User Management</h2>
//           <p className="text-dark-600 mt-1">{totalUsers} users total</p>
//         </div>
        
//         {/* Export Button */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             Export all users
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TABLE WITH COLUMN FILTERS --- */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-dark-200">
//           <thead className="bg-dark-50">
//             <tr>
//               {/* ID Column with filter */}
//                 <th className="w-16 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//       <div className="flex flex-col">
//         <span>ID</span>
//         <input
//           type="text"
//           placeholder="ID"
//           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white w-full"
//           value={columnFilters.id}
//           onChange={(e) => handleColumnFilterChange('id', e.target.value)}
//         />
//       </div>
//     </th>
              
//               {/* NAME Column with filter */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>NAME</span>
//                   <input
//                     type="text"
//                     placeholder="Search Name"
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.name}
//                     onChange={(e) => handleColumnFilterChange('name', e.target.value)}
//                   />
//                 </div>
//               </th>
              
//               {/* EMAIL Column with filter */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>EMAIL</span>
//                   <input
//                     type="text"
//                     placeholder="Search Email"
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.email}
//                     onChange={(e) => handleColumnFilterChange('email', e.target.value)}
//                   />
//                 </div>
//               </th>
              
//               {/* PHONE Column with filter */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>PHONE</span>
//                   <input
//                     type="text"
//                     placeholder="Search Phone"
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.phone}
//                     onChange={(e) => handleColumnFilterChange('phone', e.target.value)}
//                   />
//                 </div>
//               </th>
              
//               {/* STATUS Column with filter */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>STATUS</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.status}
//                     onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                   >
//                     <option value="">All</option>
//                     <option value="ACTIVE">Active</option>
//                     <option value="INACTIVE">Inactive</option>
//                   </select>
//                 </div>
//               </th>
              
//               {/* CREATED AT Column with filter */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>CREATED AT</span>
//                   <input
//                     type="text"
//                     placeholder="YYYY-MM-DD"
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.date}
//                     onChange={(e) => handleColumnFilterChange('date', e.target.value)}
//                   />
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
//                 <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                   Loading users...
//                 </td>
//               </tr>
//             ) : filteredUsers.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                   No users found
//                 </td>
//               </tr>
//             ) : (
//               filteredUsers.map((user) => (
//                 <tr key={user.id} className="hover:bg-dark-50">
//                   {/* ID Column */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                     #{user.id}
//                   </td>
                  
//                   {/* NAME Column */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-dark-900">
//                       {user.name}
//                     </div>
//                   </td>
                  
//                   {/* EMAIL Column */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-dark-900 break-all">
//                       {user.email}
//                     </div>
//                   </td>
                  
//                   {/* PHONE Column */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                     {user.phone || 'N/A'}
//                   </td>
                  
//                   {/* STATUS Column */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handleStatusChange(user)}
//                         className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
//                           user.isActive ? "bg-green-500" : "bg-red-500"
//                         }`}
//                       >
//                         <span
//                           className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
//                             user.isActive ? "translate-x-6" : "translate-x-1"
//                           }`}
//                         />
//                       </button>
//                       <span className={`text-xs font-medium ${
//                         user.isActive ? "text-green-700" : "text-red-700"
//                       }`}>
//                         {user.isActive ? "ACTIVE" : "INACTIVE"}
//                       </span>
//                     </div>
//                   </td>
                  
//                   {/* CREATED AT Column */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900">
//                     {format(new Date(user.createdAt), "MMM dd, yyyy")}
//                   </td>
                  
//                   {/* ACTIONS Column - Icons only */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-1">
//                       <button
//                         onClick={() => {
//                           setSelectedUser(user);
//                           setShowViewModal(true);
//                         }}
//                         className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                         title="View Details"
//                       >
//                         <FiEye size={16} />
//                       </button>
//                       <button
//                         onClick={() => openOrdersModal(user)}
//                         className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                         title="View Orders"
//                       >
//                         <FiPackage size={16} />
//                       </button>
//                       <button
//                         onClick={() => openAppointmentsModal(user)}
//                         className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                         title="View Appointments"
//                       >
//                         <FiCalendar size={16} />
//                       </button>
//                       <button
//                         onClick={async () => {
//                           if (!window.confirm(`Delete ${user.name}?`)) return;
//                           try {
//                             const res = await userApi.deleteUser(user.id);
//                             toast.success(res.message || "User deleted");
//                             setUsers((prev) => prev.filter((u) => u.id !== user.id));
//                           } catch (err: any) {
//                             toast.error(
//                               err?.response?.data?.message ||
//                                 "Cannot delete user. Deactivate instead."
//                             );
//                           }
//                         }}
//                         className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                         title="Delete"
//                       >
//                         <FiTrash size={16} />
//                       </button>
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
//               <span className="font-medium">{Math.min(page * rowsPerPage, totalUsers)}</span>{' '}
//               of <span className="font-medium">{totalUsers}</span> results
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

//       {/* ================= VIEW USER MODAL ================= */}
//       <AnimatePresence>
//         {showViewModal && selectedUser && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowViewModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-3xl p-8 max-w-xl w-full">
//                 <div className="flex justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-foreground">
//                       {selectedUser.name}
//                     </h2>
//                     <p className="text-sm text-muted-foreground">
//                       User ID: #{selectedUser.id}
//                     </p>
//                   </div>
//                   <FiX
//                     className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
//                     onClick={() => setShowViewModal(false)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Email
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {selectedUser.email}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Phone
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {selectedUser.phone}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Status
//                     </p>
//                     <span
//                       className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
//                         selectedUser.isActive
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {selectedUser.isActive ? "ACTIVE" : "INACTIVE"}
//                     </span>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Created At
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {format(new Date(selectedUser.createdAt), "MMM dd, yyyy")}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="my-6 border-t border-border" />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-foreground">
//                       {selectedUser.orderCount ?? 0}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
//                   </div>

//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-foreground">
//                       {selectedUser.appointmentCount ?? 0}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Appointments</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-8">
//                   <button
//                     onClick={() => setShowViewModal(false)}
//                     className="bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ENHANCED ORDERS MODAL ================= */}
//       <AnimatePresence>
//         {showOrdersModal && selectedUser && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowOrdersModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-card border border-border rounded-3xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-xl bg-gradient-sage flex items-center justify-center">
//                       <FiPackage className="text-white" size={20} />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-foreground">
//                         Customer Orders
//                       </h2>
//                       <p className="text-sm text-muted-foreground">
//                         {userOrders.length} total orders • {selectedUser.name}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowOrdersModal(false)}
//                     className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
//                   >
//                     <FiX className="text-muted-foreground" size={20} />
//                   </button>
//                 </div>

//                 {ordersLoading ? (
//                   <p className="text-center text-muted-foreground py-10">Loading orders…</p>
//                 ) : userOrders.length === 0 ? (
//                   <p className="text-center text-muted-foreground py-10">
//                     No orders found for this user
//                   </p>
//                 ) : (
//                   <div className="flex-1 overflow-y-auto space-y-4 pr-2">
//                     {userOrders.map((order) => {
//                       const firstItem = renderOrderItem(order);
                      
//                       return (
//                         <motion.div
//                           key={order.id}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="bg-gradient-to-br from-background to-secondary/50 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group hover:shadow-lg"
//                         >
//                           <div className="p-5 flex gap-5">
//                             <div className="relative flex-shrink-0">
//                               <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border-2 border-border group-hover:border-primary/50 transition-colors">
//                                 <img
//                                   src={firstItem.productImage}
//                                   alt={firstItem.productName}
//                                   className="w-full h-full object-cover"
//                                   onError={(e) => {
//                                     e.currentTarget.src = mockProductImages[0];
//                                   }}
//                                 />
//                               </div>
//                               {firstItem.itemsLength > 1 && (
//                                 <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
//                                   +{firstItem.itemsLength - 1}
//                                 </div>
//                               )}
//                             </div>

//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-start justify-between gap-4 mb-3">
//                                 <div>
//                                   <h3 className="text-base font-bold text-foreground mb-1">
//                                     {firstItem.productName}
//                                   </h3>
//                                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
//                                     <span className="font-medium">
//                                       Product ID: #{firstItem.productId}
//                                     </span>
//                                     <span className="w-1 h-1 bg-border rounded-full"></span>
//                                     <span>Order ID: #{order.id}</span>
//                                   </div>
//                                 </div>
//                                 <span
//                                   className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
//                                     order.status
//                                   )}`}
//                                 >
//                                   {order.status}
//                                 </span>
//                               </div>

//                               <div className="flex items-center gap-4 mb-3">
//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                   <CalendarIcon className="text-muted-foreground" size={14} />
//                                   <span>
//                                     {format(new Date(order.createdAt), "MMM dd, yyyy")}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                   <FiCreditCard className="text-muted-foreground" size={14} />
//                                   <span className="font-semibold text-foreground">
//                                     ${order.totalAmount.toFixed(2)}
//                                   </span>
//                                 </div>
//                                 {order.trackingNumber && (
//                                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                     <FiTruck className="text-muted-foreground" size={14} />
//                                     <span className="text-xs">{order.trackingNumber}</span>
//                                   </div>
//                                 )}
//                               </div>

//                               <button
//                                 onClick={() => openOrderDetail(order)}
//                                 className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-sage text-white rounded-lg font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90"
//                               >
//                                 <FiPackage size={14} />
//                                 View Details
//                               </button>
//                             </div>
//                           </div>
//                         </motion.div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ORDER DETAIL MODAL ================= */}
//       <AnimatePresence>
//         {showOrderDetailModal && selectedOrder && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
//               onClick={() => setShowOrderDetailModal(false)}
//             />
//             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-card border border-border rounded-3xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//               >
//                 <div className="bg-gradient-sage px-6 py-5 flex justify-between items-center">
//                   <div>
//                     <h2 className="text-xl font-bold text-white">Order Details</h2>
//                     <p className="text-white/80 text-sm">
//                       Order #{selectedOrder.id}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setShowOrderDetailModal(false)}
//                     className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
//                   >
//                     <FiX className="text-white" size={20} />
//                   </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                           <FiPackage className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-primary font-semibold uppercase tracking-wide">
//                             Status
//                           </p>
//                           <p className="text-base font-bold text-foreground">
//                             {selectedOrder.status}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
//                           <FiCreditCard className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">
//                             Payment
//                           </p>
//                           <p className={`text-base font-bold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
//                             {selectedOrder.paymentStatus}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
//                           <CalendarIcon className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">
//                             Order Date
//                           </p>
//                           <p className="text-base font-bold text-foreground">
//                             {format(new Date(selectedOrder.createdAt), "MMM dd, yyyy")}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-5 border border-border">
//                     <div className="flex items-center gap-3 mb-3">
//                       <FiMapPin className="text-primary" size={18} />
//                       <h3 className="text-base font-bold text-foreground">
//                         Shipping Address
//                       </h3>
//                     </div>
//                     <p className="text-foreground text-sm leading-relaxed">
//                       {selectedOrder.shippingAddress}
//                     </p>
//                     {selectedOrder.trackingNumber && (
//                       <div className="mt-3 pt-3 border-t border-border">
//                         <div className="flex items-center gap-2">
//                           <FiTruck className="text-primary" size={16} />
//                           <span className="text-sm text-muted-foreground">Tracking Number:</span>
//                           <span className="text-sm font-bold text-foreground">
//                             {selectedOrder.trackingNumber}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <h3 className="text-base font-bold text-foreground mb-3">
//                       Order Items
//                     </h3>
//                     <div className="space-y-3">
//                       {selectedOrder.items?.map((item, index) => {
//                         const imageUrl = getProductImageUrl(item.productImage);
//                         return (
//                           <div
//                             key={item.id || index}
//                             className="bg-background rounded-xl border border-border p-4 flex gap-4 hover:border-primary/50 transition-colors"
//                           >
//                             <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
//                               <img
//                                 src={imageUrl}
//                                 alt={item.productName}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   e.currentTarget.src = mockProductImages[0];
//                                 }}
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="text-base font-bold text-foreground mb-1">
//                                 {item.productName || "Unknown Product"}
//                               </h4>
//                               <p className="text-xs text-muted-foreground mb-2">
//                                 Product ID: #{item.productId || "N/A"}
//                               </p>
//                               <div className="flex items-center gap-3 text-xs">
//                                 {item.selectedSize && (
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-muted-foreground">Size:</span>
//                                     <span className="font-semibold text-foreground">
//                                       {item.selectedSize}
//                                     </span>
//                                   </div>
//                                 )}
//                                 {item.selectedColor && (
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-muted-foreground">Color:</span>
//                                     <span className="font-semibold text-foreground">
//                                       {item.selectedColor}
//                                     </span>
//                                   </div>
//                                 )}
//                                 <div className="flex items-center gap-1.5">
//                                   <span className="text-muted-foreground">Qty:</span>
//                                   <span className="font-semibold text-foreground">
//                                     {item.quantity || 1}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-xs text-muted-foreground mb-1">Price</p>
//                               <p className="text-lg font-bold text-foreground">
//                                 ${(item.totalPrice || 0).toFixed(2)}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-border">
//                     <h3 className="text-base font-bold text-foreground mb-3">
//                       Order Summary
//                     </h3>
//                     <div className="space-y-2">
//                       {selectedOrder.discount && selectedOrder.discount > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Discount</span>
//                           <span className="font-semibold text-green-600">
//                             -${selectedOrder.discount.toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                       {selectedOrder.tax && selectedOrder.tax > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Tax</span>
//                           <span className="font-semibold text-foreground">
//                             ${selectedOrder.tax.toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                       <div className="pt-3 border-t-2 border-primary flex justify-between">
//                         <span className="text-base font-bold text-foreground">
//                           Total Amount
//                         </span>
//                         <span className="text-xl font-bold text-primary">
//                           ${selectedOrder.totalAmount.toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-secondary/50 px-6 py-4 flex justify-end gap-3 border-t border-border">
//                   <button
//                     onClick={() => setShowOrderDetailModal(false)}
//                     className="px-5 py-2 bg-background hover:bg-secondary text-foreground font-semibold rounded-lg border border-border transition-colors text-sm"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= APPOINTMENTS MODAL ================= */}
//       <AnimatePresence>
//         {showAppointmentsModal && selectedUser && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowAppointmentsModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-2xl p-6 max-w-3xl w-full">
//                 <div className="flex justify-between mb-4">
//                   <h2 className="text-xl font-bold text-foreground">
//                     Appointments – {selectedUser.name}
//                   </h2>
//                   <FiX
//                     className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
//                     onClick={() => setShowAppointmentsModal(false)}
//                   />
//                 </div>

//                 {appointmentsLoading ? (
//                   <p className="text-center text-muted-foreground">Loading…</p>
//                 ) : userAppointments.length === 0 ? (
//                   <p className="text-center text-muted-foreground">No appointments found</p>
//                 ) : (
//                   <div className="space-y-3 max-h-[60vh] overflow-auto">
//                     {userAppointments.map((a) => (
//                       <div key={a.id} className="glass-card p-4 rounded-xl">
//                         <p className="font-semibold text-foreground">{a.serviceType}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {a.appointmentDate} • {a.appointmentTime}
//                         </p>
//                         <p className="text-sm text-muted-foreground">Status: {a.status}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminUsers;


// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiEye,
//   FiTrash,
//   FiX,
//   FiSearch,
//   FiPackage,
//   FiCalendar,
//   FiMapPin,
//   FiCreditCard,
//   FiTruck,
//   FiCalendar as CalendarIcon,
//   FiEdit2,
//   FiPlay,
//   FiPause,
//   FiChevronLeft,
//   FiChevronRight,
//   FiChevronsLeft,
//   FiChevronsRight,
// } from "react-icons/fi";
// import { format } from "date-fns";
// import { userApi, type User } from "../../api/userApi";
// import orderApi from "../../api/orderApi";
// import appointmentApi from "../../api/appointmentApi";
// import toast from "react-hot-toast";

// interface OrderItem {
//   id: number;
//   productId: number;
//   productName: string;
//   productImage: string;
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
//   selectedSize: string;
//   selectedColor: string;
// }

// interface Order {
//   id: number;
//   userId: number;
//   status: string;
//   paymentStatus: string;
//   totalAmount: number;
//   discount: number | null;
//   tax: number | null;
//   trackingNumber: string | null;
//   shippingAddress: string;
//   createdAt: string;
//   updatedAt: string;
//   items: OrderItem[];
// }

// const AdminUsers = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   // Column filters
//   const [columnFilters, setColumnFilters] = useState({
//     id: '',
//     name: '',
//     email: '',
//     phone: '',
//     status: '',
//     date: ''
//   });

//   // View modal
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showViewModal, setShowViewModal] = useState(false);

//   // Orders modal
//   const [showOrdersModal, setShowOrdersModal] = useState(false);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [userOrders, setUserOrders] = useState<Order[]>([]);

//   // Order detail modal
//   const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   // Appointments modal
//   const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
//   const [appointmentsLoading, setAppointmentsLoading] = useState(false);
//   const [userAppointments, setUserAppointments] = useState<any[]>([]);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   const mockProductImages = [
//     "/api/placeholder/400/400",
//   ];

//   const getProductImageUrl = (imagePath: string | undefined, fallbackIndex: number = 0) => {
//     if (!imagePath) return mockProductImages[fallbackIndex];
    
//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }
    
//     const backendBaseUrl = '';
    
//     if (!imagePath.startsWith('/') && !imagePath.startsWith('uploads/')) {
//       return `${backendBaseUrl}/uploads/${imagePath}`;
//     }
    
//     return `${backendBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
//   };

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const offset = (page - 1) * rowsPerPage;
//         const res = await userApi.getCustomers(offset, rowsPerPage);
//         setUsers(res.content);
//         setTotalUsers(res.totalElements);
//       } catch {
//         setError("Failed to load users");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [page, rowsPerPage]);

//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1);
//   };

//   // Filtered users
//   const filteredUsers = useMemo(() => {
//     if (!users || !Array.isArray(users)) return [];
    
//     return users.filter(user => {
//       const matchesId = user.id.toString().includes(columnFilters.id);
//       const matchesName = (user.name || '').toLowerCase().includes(columnFilters.name.toLowerCase());
//       const matchesEmail = (user.email || '').toLowerCase().includes(columnFilters.email.toLowerCase());
//       const matchesPhone = (user.phone || '').includes(columnFilters.phone);
//       const matchesStatus = 
//         columnFilters.status === '' || 
//         (columnFilters.status === 'ACTIVE' && user.isActive) || 
//         (columnFilters.status === 'INACTIVE' && !user.isActive);
//       const matchesDate = 
//         columnFilters.date === '' || 
//         format(new Date(user.createdAt), 'yyyy-MM-dd').includes(columnFilters.date);
      
//       return matchesId && matchesName && matchesEmail && matchesPhone && matchesStatus && matchesDate;
//     });
//   }, [users, columnFilters]);

//   const totalPages = Math.ceil(totalUsers / rowsPerPage);

//   const handleStatusChange = async (user: User) => {
//     try {
//       const updatedUser = user.isActive
//         ? await userApi.deactivateUser(user.id)
//         : await userApi.activateUser(user.id);

//       setUsers((prev) =>
//         prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
//       );

//       toast.success(
//         updatedUser.isActive ? "User activated" : "User deactivated"
//       );
//     } catch (err) {
//       toast.error("Failed to update user status");
//     }
//   };

//   // Get status color using your theme
//   const getStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "PROCESSING":
//         return "bg-blue-100 text-blue-800";
//       case "SHIPPED":
//         return "bg-purple-100 text-purple-800";
//       case "DELIVERED":
//         return "bg-green-100 text-green-800";
//       case "CANCELLED":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Get payment status color
//   const getPaymentStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case "PAID":
//         return "text-green-700";
//       case "PENDING":
//         return "text-yellow-700";
//       case "FAILED":
//         return "text-red-700";
//       default:
//         return "text-gray-700";
//     }
//   };

//   // Orders modal
//   const openOrdersModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowOrdersModal(true);
//     setOrdersLoading(true);

//     try {
//       const res = await orderApi.getUserOrders(user.id, 0, 50);
      
//       if (!res || !res.content) {
//         setUserOrders([]);
//         return;
//       }

//       const transformedOrders: Order[] = res.content.map((order: any, index: number) => {
//         const fallbackImage = mockProductImages[0];
        
//         const hasItems = order.items && Array.isArray(order.items) && order.items.length > 0;
        
//         return {
//           id: order.id || index,
//           userId: order.userId || user.id,
//           status: order.status || "PENDING",
//           paymentStatus: order.paymentStatus || "PENDING",
//           totalAmount: order.totalAmount || 0,
//           discount: order.discount || null,
//           tax: order.tax || null,
//           trackingNumber: order.trackingNumber || null,
//           shippingAddress: order.shippingAddress || "Address not specified",
//           createdAt: order.createdAt || new Date().toISOString(),
//           updatedAt: order.updatedAt || new Date().toISOString(),
//           items: hasItems 
//             ? order.items.map((item: any, itemIndex: number) => ({
//                 id: item.id || itemIndex,
//                 productId: item.productId || 0,
//                 productName: item.productName || `Product ${itemIndex + 1}`,
//                 productImage: item.productImage || item.imageUrl || '',
//                 quantity: item.quantity || 1,
//                 unitPrice: item.unitPrice || item.price || 0,
//                 totalPrice: item.totalPrice || (item.quantity || 1) * (item.unitPrice || item.price || 0),
//                 selectedSize: item.selectedSize || item.size || "M",
//                 selectedColor: item.selectedColor || item.color || "Black",
//               }))
//             : [{
//                 id: 0,
//                 productId: order.id || 0,
//                 productName: order.productName || "Unknown Product",
//                 productImage: fallbackImage,
//                 quantity: 1,
//                 unitPrice: order.totalAmount || 0,
//                 totalPrice: order.totalAmount || 0,
//                 selectedSize: "M",
//                 selectedColor: "Black",
//               }],
//         };
//       });
      
//       setUserOrders(transformedOrders);
//     } catch (error) {
//       console.error("Error loading orders:", error);
//       toast.error("Failed to load orders");
//       setUserOrders([]);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const openAppointmentsModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowAppointmentsModal(true);
//     setAppointmentsLoading(true);

//     try {
//       const res = await appointmentApi.getUserAppointments(user.id, 0, 50);
//       setUserAppointments(res.content || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load appointments");
//     } finally {
//       setAppointmentsLoading(false);
//     }
//   };

//   const openOrderDetail = (order: Order) => {
//     setSelectedOrder(order);
//     setShowOrderDetailModal(true);
//   };

//   const renderOrderItem = (order: Order) => {
//     if (!order.items || order.items.length === 0) {
//       return {
//         productImage: mockProductImages[0],
//         productName: "Unknown Product",
//         productId: order.id,
//         itemsLength: 0
//       };
//     }
    
//     const firstItem = order.items[0];
//     return {
//       productImage: getProductImageUrl(firstItem.productImage),
//       productName: firstItem.productName || "Unknown Product",
//       productId: firstItem.productId || order.id,
//       itemsLength: order.items.length
//     };
//   };

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">User Management</h2>
//           <p className="text-dark-600 mt-1">{totalUsers} users total</p>
//         </div>
        
//         {/* Export Button */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             Export all users
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TABLE WITH COLUMN FILTERS --- */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <div className="inline-block min-w-full align-middle">
//             <div className="overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     {/* ID Column with filter - Fixed width */}
//                     <th className="w-24 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>ID</span>
//                         <input
//                           type="text"
//                           placeholder="ID"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white w-full"
//                           value={columnFilters.id}
//                           onChange={(e) => handleColumnFilterChange('id', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* NAME Column with filter - Fixed width */}
//                     <th className="w-64 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>NAME</span>
//                         <input
//                           type="text"
//                           placeholder="Search Name"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.name}
//                           onChange={(e) => handleColumnFilterChange('name', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* EMAIL Column with filter - Fixed width */}
//                     <th className="w-80 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>EMAIL</span>
//                         <input
//                           type="text"
//                           placeholder="Search Email"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.email}
//                           onChange={(e) => handleColumnFilterChange('email', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* PHONE Column with filter - Fixed width */}
//                     <th className="w-48 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>PHONE</span>
//                         <input
//                           type="text"
//                           placeholder="Search Phone"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.phone}
//                           onChange={(e) => handleColumnFilterChange('phone', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* STATUS Column with filter - Fixed width */}
//                     <th className="w-40 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>STATUS</span>
//                         <select
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.status}
//                           onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                         >
//                           <option value="">All</option>
//                           <option value="ACTIVE">Active</option>
//                           <option value="INACTIVE">Inactive</option>
//                         </select>
//                       </div>
//                     </th>
                    
//                     {/* CREATED AT Column with filter - Fixed width */}
//                     <th className="w-48 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>CREATED AT</span>
//                         <input
//                           type="text"
//                           placeholder="YYYY-MM-DD"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.date}
//                           onChange={(e) => handleColumnFilterChange('date', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* ACTIONS Column - Fixed width */}
//                     <th className="w-40 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       ACTIONS
//                     </th>
//                   </tr>
//                 </thead>
                
//                 <tbody className="bg-white divide-y divide-dark-200 max-h-[400px] overflow-y-auto">
//                   {loading ? (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                         Loading users...
//                       </td>
//                     </tr>
//                   ) : filteredUsers.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                         No users found
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredUsers.map((user) => (
//                       <tr key={user.id} className="hover:bg-dark-50">
//                         {/* ID Column - Fixed width */}
//                         <td className="w-24 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
//                           #{user.id}
//                         </td>
                        
//                         {/* NAME Column - Fixed width with ellipsis */}
//                         <td className="w-64 px-3 py-4">
//                           <div className="text-sm font-medium text-dark-900 truncate max-w-[240px]" title={user.name}>
//                             {user.name}
//                           </div>
//                         </td>
                        
//                         {/* EMAIL Column - Fixed width with ellipsis */}
//                         <td className="w-80 px-3 py-4">
//                           <div className="text-sm text-dark-900 truncate max-w-[300px]" title={user.email}>
//                             {user.email}
//                           </div>
//                         </td>
                        
//                         {/* PHONE Column - Fixed width */}
//                         <td className="w-48 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
//                           <div className="truncate max-w-[180px]" title={user.phone || 'N/A'}>
//                             {user.phone || 'N/A'}
//                           </div>
//                         </td>
                        
//                         {/* STATUS Column - Fixed width */}
//                         <td className="w-40 px-3 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handleStatusChange(user)}
//                               className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
//                                 user.isActive ? "bg-green-500" : "bg-red-500"
//                               }`}
//                             >
//                               <span
//                                 className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
//                                   user.isActive ? "translate-x-6" : "translate-x-1"
//                                 }`}
//                               />
//                             </button>
//                             <span className={`text-xs font-medium ${
//                               user.isActive ? "text-green-700" : "text-red-700"
//                             }`}>
//                               {user.isActive ? "ACTIVE" : "INACTIVE"}
//                             </span>
//                           </div>
//                         </td>
                        
//                         {/* CREATED AT Column - Fixed width */}
//                         <td className="w-48 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {format(new Date(user.createdAt), "MMM dd, yyyy")}
//                         </td>
                        
//                         {/* ACTIONS Column - Fixed width */}
//                         <td className="w-40 px-3 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => {
//                                 setSelectedUser(user);
//                                 setShowViewModal(true);
//                               }}
//                               className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                               title="View Details"
//                             >
//                               <FiEye size={16} />
//                             </button>
//                             <button
//                               onClick={() => openOrdersModal(user)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="View Orders"
//                             >
//                               <FiPackage size={16} />
//                             </button>
//                             <button
//                               onClick={() => openAppointmentsModal(user)}
//                               className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                               title="View Appointments"
//                             >
//                               <FiCalendar size={16} />
//                             </button>
//                             <button
//                               onClick={async () => {
//                                 if (!window.confirm(`Delete ${user.name}?`)) return;
//                                 try {
//                                   const res = await userApi.deleteUser(user.id);
//                                   toast.success(res.message || "User deleted");
//                                   setUsers((prev) => prev.filter((u) => u.id !== user.id));
//                                 } catch (err: any) {
//                                   toast.error(
//                                     err?.response?.data?.message ||
//                                       "Cannot delete user. Deactivate instead."
//                                   );
//                                 }
//                               }}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
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
//               <span className="font-medium">{Math.min(page * rowsPerPage, totalUsers)}</span>{' '}
//               of <span className="font-medium">{totalUsers}</span> results
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

//       {/* ================= VIEW USER MODAL ================= */}
//       <AnimatePresence>
//         {showViewModal && selectedUser && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowViewModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-3xl p-8 max-w-xl w-full">
//                 <div className="flex justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-foreground">
//                       {selectedUser.name}
//                     </h2>
//                     <p className="text-sm text-muted-foreground">
//                       User ID: #{selectedUser.id}
//                     </p>
//                   </div>
//                   <FiX
//                     className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
//                     onClick={() => setShowViewModal(false)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Email
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {selectedUser.email}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Phone
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {selectedUser.phone}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Status
//                     </p>
//                     <span
//                       className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
//                         selectedUser.isActive
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {selectedUser.isActive ? "ACTIVE" : "INACTIVE"}
//                     </span>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Created At
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {format(new Date(selectedUser.createdAt), "MMM dd, yyyy")}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="my-6 border-t border-border" />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-foreground">
//                       {selectedUser.orderCount ?? 0}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
//                   </div>

//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-foreground">
//                       {selectedUser.appointmentCount ?? 0}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Appointments</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-8">
//                   <button
//                     onClick={() => setShowViewModal(false)}
//                     className="bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ENHANCED ORDERS MODAL ================= */}
//       <AnimatePresence>
//         {showOrdersModal && selectedUser && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowOrdersModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-card border border-border rounded-3xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-xl bg-gradient-sage flex items-center justify-center">
//                       <FiPackage className="text-white" size={20} />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-foreground">
//                         Customer Orders
//                       </h2>
//                       <p className="text-sm text-muted-foreground">
//                         {userOrders.length} total orders • {selectedUser.name}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowOrdersModal(false)}
//                     className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
//                   >
//                     <FiX className="text-muted-foreground" size={20} />
//                   </button>
//                 </div>

//                 {ordersLoading ? (
//                   <p className="text-center text-muted-foreground py-10">Loading orders…</p>
//                 ) : userOrders.length === 0 ? (
//                   <p className="text-center text-muted-foreground py-10">
//                     No orders found for this user
//                   </p>
//                 ) : (
//                   <div className="flex-1 overflow-y-auto space-y-4 pr-2">
//                     {userOrders.map((order) => {
//                       const firstItem = renderOrderItem(order);
                      
//                       return (
//                         <motion.div
//                           key={order.id}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="bg-gradient-to-br from-background to-secondary/50 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group hover:shadow-lg"
//                         >
//                           <div className="p-5 flex gap-5">
//                             <div className="relative flex-shrink-0">
//                               <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border-2 border-border group-hover:border-primary/50 transition-colors">
//                                 <img
//                                   src={firstItem.productImage}
//                                   alt={firstItem.productName}
//                                   className="w-full h-full object-cover"
//                                   onError={(e) => {
//                                     e.currentTarget.src = mockProductImages[0];
//                                   }}
//                                 />
//                               </div>
//                               {firstItem.itemsLength > 1 && (
//                                 <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
//                                   +{firstItem.itemsLength - 1}
//                                 </div>
//                               )}
//                             </div>

//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-start justify-between gap-4 mb-3">
//                                 <div>
//                                   <h3 className="text-base font-bold text-foreground mb-1">
//                                     {firstItem.productName}
//                                   </h3>
//                                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
//                                     <span className="font-medium">
//                                       Product ID: #{firstItem.productId}
//                                     </span>
//                                     <span className="w-1 h-1 bg-border rounded-full"></span>
//                                     <span>Order ID: #{order.id}</span>
//                                   </div>
//                                 </div>
//                                 <span
//                                   className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
//                                     order.status
//                                   )}`}
//                                 >
//                                   {order.status}
//                                 </span>
//                               </div>

//                               <div className="flex items-center gap-4 mb-3">
//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                   <CalendarIcon className="text-muted-foreground" size={14} />
//                                   <span>
//                                     {format(new Date(order.createdAt), "MMM dd, yyyy")}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                   <FiCreditCard className="text-muted-foreground" size={14} />
//                                   <span className="font-semibold text-foreground">
//                                     ${order.totalAmount.toFixed(2)}
//                                   </span>
//                                 </div>
//                                 {order.trackingNumber && (
//                                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                     <FiTruck className="text-muted-foreground" size={14} />
//                                     <span className="text-xs">{order.trackingNumber}</span>
//                                   </div>
//                                 )}
//                               </div>

//                               <button
//                                 onClick={() => openOrderDetail(order)}
//                                 className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-sage text-white rounded-lg font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90"
//                               >
//                                 <FiPackage size={14} />
//                                 View Details
//                               </button>
//                             </div>
//                           </div>
//                         </motion.div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ORDER DETAIL MODAL ================= */}
//       <AnimatePresence>
//         {showOrderDetailModal && selectedOrder && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
//               onClick={() => setShowOrderDetailModal(false)}
//             />
//             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-card border border-border rounded-3xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//               >
//                 <div className="bg-gradient-sage px-6 py-5 flex justify-between items-center">
//                   <div>
//                     <h2 className="text-xl font-bold text-white">Order Details</h2>
//                     <p className="text-white/80 text-sm">
//                       Order #{selectedOrder.id}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setShowOrderDetailModal(false)}
//                     className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
//                   >
//                     <FiX className="text-white" size={20} />
//                   </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                           <FiPackage className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-primary font-semibold uppercase tracking-wide">
//                             Status
//                           </p>
//                           <p className="text-base font-bold text-foreground">
//                             {selectedOrder.status}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
//                           <FiCreditCard className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">
//                             Payment
//                           </p>
//                           <p className={`text-base font-bold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
//                             {selectedOrder.paymentStatus}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
//                           <CalendarIcon className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">
//                             Order Date
//                           </p>
//                           <p className="text-base font-bold text-foreground">
//                             {format(new Date(selectedOrder.createdAt), "MMM dd, yyyy")}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-5 border border-border">
//                     <div className="flex items-center gap-3 mb-3">
//                       <FiMapPin className="text-primary" size={18} />
//                       <h3 className="text-base font-bold text-foreground">
//                         Shipping Address
//                       </h3>
//                     </div>
//                     <p className="text-foreground text-sm leading-relaxed">
//                       {selectedOrder.shippingAddress}
//                     </p>
//                     {selectedOrder.trackingNumber && (
//                       <div className="mt-3 pt-3 border-t border-border">
//                         <div className="flex items-center gap-2">
//                           <FiTruck className="text-primary" size={16} />
//                           <span className="text-sm text-muted-foreground">Tracking Number:</span>
//                           <span className="text-sm font-bold text-foreground">
//                             {selectedOrder.trackingNumber}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <h3 className="text-base font-bold text-foreground mb-3">
//                       Order Items
//                     </h3>
//                     <div className="space-y-3">
//                       {selectedOrder.items?.map((item, index) => {
//                         const imageUrl = getProductImageUrl(item.productImage);
//                         return (
//                           <div
//                             key={item.id || index}
//                             className="bg-background rounded-xl border border-border p-4 flex gap-4 hover:border-primary/50 transition-colors"
//                           >
//                             <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
//                               <img
//                                 src={imageUrl}
//                                 alt={item.productName}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   e.currentTarget.src = mockProductImages[0];
//                                 }}
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="text-base font-bold text-foreground mb-1">
//                                 {item.productName || "Unknown Product"}
//                               </h4>
//                               <p className="text-xs text-muted-foreground mb-2">
//                                 Product ID: #{item.productId || "N/A"}
//                               </p>
//                               <div className="flex items-center gap-3 text-xs">
//                                 {item.selectedSize && (
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-muted-foreground">Size:</span>
//                                     <span className="font-semibold text-foreground">
//                                       {item.selectedSize}
//                                     </span>
//                                   </div>
//                                 )}
//                                 {item.selectedColor && (
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-muted-foreground">Color:</span>
//                                     <span className="font-semibold text-foreground">
//                                       {item.selectedColor}
//                                     </span>
//                                   </div>
//                                 )}
//                                 <div className="flex items-center gap-1.5">
//                                   <span className="text-muted-foreground">Qty:</span>
//                                   <span className="font-semibold text-foreground">
//                                     {item.quantity || 1}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-xs text-muted-foreground mb-1">Price</p>
//                               <p className="text-lg font-bold text-foreground">
//                                 ${(item.totalPrice || 0).toFixed(2)}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-border">
//                     <h3 className="text-base font-bold text-foreground mb-3">
//                       Order Summary
//                     </h3>
//                     <div className="space-y-2">
//                       {selectedOrder.discount && selectedOrder.discount > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Discount</span>
//                           <span className="font-semibold text-green-600">
//                             -${selectedOrder.discount.toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                       {selectedOrder.tax && selectedOrder.tax > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Tax</span>
//                           <span className="font-semibold text-foreground">
//                             ${selectedOrder.tax.toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                       <div className="pt-3 border-t-2 border-primary flex justify-between">
//                         <span className="text-base font-bold text-foreground">
//                           Total Amount
//                         </span>
//                         <span className="text-xl font-bold text-primary">
//                           ${selectedOrder.totalAmount.toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-secondary/50 px-6 py-4 flex justify-end gap-3 border-t border-border">
//                   <button
//                     onClick={() => setShowOrderDetailModal(false)}
//                     className="px-5 py-2 bg-background hover:bg-secondary text-foreground font-semibold rounded-lg border border-border transition-colors text-sm"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= APPOINTMENTS MODAL ================= */}
//       <AnimatePresence>
//         {showAppointmentsModal && selectedUser && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowAppointmentsModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-2xl p-6 max-w-3xl w-full">
//                 <div className="flex justify-between mb-4">
//                   <h2 className="text-xl font-bold text-foreground">
//                     Appointments – {selectedUser.name}
//                   </h2>
//                   <FiX
//                     className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
//                     onClick={() => setShowAppointmentsModal(false)}
//                   />
//                 </div>

//                 {appointmentsLoading ? (
//                   <p className="text-center text-muted-foreground">Loading…</p>
//                 ) : userAppointments.length === 0 ? (
//                   <p className="text-center text-muted-foreground">No appointments found</p>
//                 ) : (
//                   <div className="space-y-3 max-h-[60vh] overflow-auto">
//                     {userAppointments.map((a) => (
//                       <div key={a.id} className="glass-card p-4 rounded-xl">
//                         <p className="font-semibold text-foreground">{a.serviceType}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {a.appointmentDate} • {a.appointmentTime}
//                         </p>
//                         <p className="text-sm text-muted-foreground">Status: {a.status}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminUsers;



// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiEye,
//   FiTrash,
//   FiX,
//   FiSearch,
//   FiPackage,
//   FiCalendar,
//   FiMapPin,
//   FiCreditCard,
//   FiTruck,
//   FiCalendar as CalendarIcon,
//   FiEdit2,
//   FiPlay,
//   FiPause,
//   FiChevronLeft,
//   FiChevronRight,
//   FiChevronsLeft,
//   FiChevronsRight,
// } from "react-icons/fi";
// import { format } from "date-fns";
// import { userApi, type User } from "../../api/userApi";
// import orderApi from "../../api/orderApi";
// import appointmentApi from "../../api/appointmentApi";
// import toast from "react-hot-toast";

// interface OrderItem {
//   id: number;
//   productId: number;
//   productName: string;
//   productImage: string;
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
//   selectedSize: string;
//   selectedColor: string;
// }

// interface Order {
//   id: number;
//   userId: number;
//   status: string;
//   paymentStatus: string;
//   totalAmount: number;
//   discount: number | null;
//   tax: number | null;
//   trackingNumber: string | null;
//   shippingAddress: string;
//   createdAt: string;
//   updatedAt: string;
//   items: OrderItem[];
// }

// const AdminUsers = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   // Column filters
//   const [columnFilters, setColumnFilters] = useState({
//     id: '',
//     name: '',
//     email: '',
//     phone: '',
//     status: '',
//     date: ''
//   });

//   // View modal
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showViewModal, setShowViewModal] = useState(false);

//   // Orders modal
//   const [showOrdersModal, setShowOrdersModal] = useState(false);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [userOrders, setUserOrders] = useState<Order[]>([]);

//   // Order detail modal
//   const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   // Appointments modal
//   const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
//   const [appointmentsLoading, setAppointmentsLoading] = useState(false);
//   const [userAppointments, setUserAppointments] = useState<any[]>([]);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';
  
//   // Better mock images that will actually display
//   const mockProductImages = [
//     "https://via.placeholder.com/400x400/8FAE8B/FFFFFF?text=Product+Image",
//     "https://via.placeholder.com/400x400/7E9F7A/FFFFFF?text=Product+Image",
//     "https://via.placeholder.com/400x400/6D8F6A/FFFFFF?text=Product+Image",
//   ];

//   const getProductImageUrl = (imagePath: string | undefined, fallbackIndex: number = 0) => {
//     // If no image path, return a placeholder
//     if (!imagePath) {
//       return mockProductImages[fallbackIndex % mockProductImages.length];
//     }
    
//     // If it's already a full URL, return as is
//     if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
//       return imagePath;
//     }
    
//     // If it's a placeholder URL, return as is
//     if (imagePath.includes('via.placeholder.com') || imagePath.includes('placeholder')) {
//       return imagePath;
//     }
    
//     // Otherwise, construct the full URL using your server URL
//     // Remove any leading slash if present
//     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
//     // Check if the path already contains 'uploads'
//     if (cleanPath.includes('uploads/')) {
//       return `${SERVER_URL}/${cleanPath}`;
//     }
    
//     // Otherwise, assume it's in uploads folder
//     return `${SERVER_URL}/uploads/${cleanPath}`;
//   };

//   const getMediaUrl = (path?: string) => {
//     if (!path) return mockProductImages[0];
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const offset = (page - 1) * rowsPerPage;
//         const res = await userApi.getCustomers(offset, rowsPerPage);
//         setUsers(res.content);
//         setTotalUsers(res.totalElements);
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 
//                             error.response?.data?.error || 
//                             error.message || 
//                             'Failed to load users';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [page, rowsPerPage]);

//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1);
//   };

//   // Filtered users
//   const filteredUsers = useMemo(() => {
//     if (!users || !Array.isArray(users)) return [];
    
//     return users.filter(user => {
//       const matchesId = user.id.toString().includes(columnFilters.id);
//       const matchesName = (user.name || '').toLowerCase().includes(columnFilters.name.toLowerCase());
//       const matchesEmail = (user.email || '').toLowerCase().includes(columnFilters.email.toLowerCase());
//       const matchesPhone = (user.phone || '').includes(columnFilters.phone);
//       const matchesStatus = 
//         columnFilters.status === '' || 
//         (columnFilters.status === 'ACTIVE' && user.isActive) || 
//         (columnFilters.status === 'INACTIVE' && !user.isActive);
//       const matchesDate = 
//         columnFilters.date === '' || 
//         format(new Date(user.createdAt), 'yyyy-MM-dd').includes(columnFilters.date);
      
//       return matchesId && matchesName && matchesEmail && matchesPhone && matchesStatus && matchesDate;
//     });
//   }, [users, columnFilters]);

//   const totalPages = Math.ceil(totalUsers / rowsPerPage);

//   const handleStatusChange = async (user: User) => {
//     try {
//       const updatedUser = user.isActive
//         ? await userApi.deactivateUser(user.id)
//         : await userApi.activateUser(user.id);

//       setUsers((prev) =>
//         prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
//       );

//       toast.success(
//         updatedUser.isActive ? "User activated" : "User deactivated"
//       );
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 
//                           err.response?.data?.error || 
//                           err.message || 
//                           'Failed to update user status';
//       toast.error(errorMessage);
//     }
//   };

//   // Get status color using your theme
//   const getStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "PROCESSING":
//         return "bg-blue-100 text-blue-800";
//       case "SHIPPED":
//         return "bg-purple-100 text-purple-800";
//       case "DELIVERED":
//         return "bg-green-100 text-green-800";
//       case "CANCELLED":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Get payment status color
//   const getPaymentStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case "PAID":
//         return "text-green-700";
//       case "PENDING":
//         return "text-yellow-700";
//       case "FAILED":
//         return "text-red-700";
//       default:
//         return "text-gray-700";
//     }
//   };

//   // Orders modal
//   const openOrdersModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowOrdersModal(true);
//     setOrdersLoading(true);

//     try {
//       const res = await orderApi.getUserOrders(user.id, 0, 50);
      
//       if (!res || !res.content) {
//         setUserOrders([]);
//         return;
//       }

//       const transformedOrders: Order[] = res.content.map((order: any, index: number) => {
//         const fallbackImage = mockProductImages[index % mockProductImages.length];
        
//         const hasItems = order.items && Array.isArray(order.items) && order.items.length > 0;
        
//         return {
//           id: order.id || index,
//           userId: order.userId || user.id,
//           status: order.status || "PENDING",
//           paymentStatus: order.paymentStatus || "PENDING",
//           totalAmount: order.totalAmount || 0,
//           discount: order.discount || null,
//           tax: order.tax || null,
//           trackingNumber: order.trackingNumber || null,
//           shippingAddress: order.shippingAddress || "Address not specified",
//           createdAt: order.createdAt || new Date().toISOString(),
//           updatedAt: order.updatedAt || new Date().toISOString(),
//           items: hasItems 
//             ? order.items.map((item: any, itemIndex: number) => ({
//                 id: item.id || itemIndex,
//                 productId: item.productId || 0,
//                 productName: item.productName || `Product ${itemIndex + 1}`,
//                 productImage: item.productImage || item.imageUrl || '',
//                 quantity: item.quantity || 1,
//                 unitPrice: item.unitPrice || item.price || 0,
//                 totalPrice: item.totalPrice || (item.quantity || 1) * (item.unitPrice || item.price || 0),
//                 selectedSize: item.selectedSize || item.size || "M",
//                 selectedColor: item.selectedColor || item.color || "Black",
//               }))
//             : [{
//                 id: 0,
//                 productId: order.id || 0,
//                 productName: order.productName || "Unknown Product",
//                 productImage: fallbackImage,
//                 quantity: 1,
//                 unitPrice: order.totalAmount || 0,
//                 totalPrice: order.totalAmount || 0,
//                 selectedSize: "M",
//                 selectedColor: "Black",
//               }],
//         };
//       });
      
//       setUserOrders(transformedOrders);
//     } catch (error: any) {
//       console.error("Error loading orders:", error);
//       const errorMessage = error.response?.data?.message || 
//                           error.response?.data?.error || 
//                           error.message || 
//                           'Failed to load orders';
//       toast.error(errorMessage);
//       setUserOrders([]);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const openAppointmentsModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowAppointmentsModal(true);
//     setAppointmentsLoading(true);

//     try {
//       const res = await appointmentApi.getUserAppointments(user.id, 0, 50);
//       setUserAppointments(res.content || []);
//     } catch (err: any) {
//       console.error(err);
//       const errorMessage = err.response?.data?.message || 
//                           err.response?.data?.error || 
//                           err.message || 
//                           'Failed to load appointments';
//       toast.error(errorMessage);
//     } finally {
//       setAppointmentsLoading(false);
//     }
//   };

//   const openOrderDetail = (order: Order) => {
//     setSelectedOrder(order);
//     setShowOrderDetailModal(true);
//   };

//   const renderOrderItem = (order: Order) => {
//     if (!order.items || order.items.length === 0) {
//       const fallbackIndex = order.id % mockProductImages.length;
//       return {
//         productImage: mockProductImages[fallbackIndex],
//         productName: "Unknown Product",
//         productId: order.id,
//         itemsLength: 0
//       };
//     }
    
//     const firstItem = order.items[0];
//     return {
//       productImage: getProductImageUrl(firstItem.productImage, order.id % mockProductImages.length),
//       productName: firstItem.productName || "Unknown Product",
//       productId: firstItem.productId || order.id,
//       itemsLength: order.items.length
//     };
//   };

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">User Management</h2>
//           <p className="text-dark-600 mt-1">{totalUsers} users total</p>
//         </div>
        
//         {/* Export Button */}
//         <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             Export all users
//           </motion.button>
//         </div>
//       </div>

//       {/* --- TABLE WITH COLUMN FILTERS --- */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <div className="inline-block min-w-full align-middle">
//             <div className="overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     {/* ID Column with filter - Fixed width */}
//                     <th className="w-24 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>ID</span>
//                         <input
//                           type="text"
//                           placeholder="ID"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white w-full"
//                           value={columnFilters.id}
//                           onChange={(e) => handleColumnFilterChange('id', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* NAME Column with filter - Fixed width */}
//                     <th className="w-64 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>NAME</span>
//                         <input
//                           type="text"
//                           placeholder="Search Name"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.name}
//                           onChange={(e) => handleColumnFilterChange('name', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* EMAIL Column with filter - Fixed width */}
//                     <th className="w-80 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>EMAIL</span>
//                         <input
//                           type="text"
//                           placeholder="Search Email"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.email}
//                           onChange={(e) => handleColumnFilterChange('email', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* PHONE Column with filter - Fixed width */}
//                     <th className="w-48 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>PHONE</span>
//                         <input
//                           type="text"
//                           placeholder="Search Phone"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.phone}
//                           onChange={(e) => handleColumnFilterChange('phone', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* STATUS Column with filter - Fixed width */}
//                     <th className="w-40 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>STATUS</span>
//                         <select
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.status}
//                           onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                         >
//                           <option value="">All</option>
//                           <option value="ACTIVE">Active</option>
//                           <option value="INACTIVE">Inactive</option>
//                         </select>
//                       </div>
//                     </th>
                    
//                     {/* CREATED AT Column with filter - Fixed width */}
//                     <th className="w-48 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>CREATED AT</span>
//                         <input
//                           type="text"
//                           placeholder="YYYY-MM-DD"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.date}
//                           onChange={(e) => handleColumnFilterChange('date', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* ACTIONS Column - Fixed width */}
//                     <th className="w-40 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       ACTIONS
//                     </th>
//                   </tr>
//                 </thead>
                
//                 <tbody className="bg-white divide-y divide-dark-200 max-h-[400px] overflow-y-auto">
//                   {loading ? (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                         Loading users...
//                       </td>
//                     </tr>
//                   ) : filteredUsers.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                         No users found
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredUsers.map((user) => (
//                       <tr key={user.id} className="hover:bg-dark-50">
//                         {/* ID Column - Fixed width */}
//                         <td className="w-24 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
//                           #{user.id}
//                         </td>
                        
//                         {/* NAME Column - Fixed width with ellipsis */}
//                         <td className="w-64 px-3 py-4">
//                           <div className="text-sm font-medium text-dark-900 truncate max-w-[240px]" title={user.name}>
//                             {user.name}
//                           </div>
//                         </td>
                        
//                         {/* EMAIL Column - Fixed width with ellipsis */}
//                         <td className="w-80 px-3 py-4">
//                           <div className="text-sm text-dark-900 truncate max-w-[300px]" title={user.email}>
//                             {user.email}
//                           </div>
//                         </td>
                        
//                         {/* PHONE Column - Fixed width */}
//                         <td className="w-48 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
//                           <div className="truncate max-w-[180px]" title={user.phone || 'N/A'}>
//                             {user.phone || 'N/A'}
//                           </div>
//                         </td>
                        
//                         {/* STATUS Column - Fixed width */}
//                         <td className="w-40 px-3 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handleStatusChange(user)}
//                               className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
//                                 user.isActive ? "bg-green-500" : "bg-red-500"
//                               }`}
//                             >
//                               <span
//                                 className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
//                                   user.isActive ? "translate-x-6" : "translate-x-1"
//                                 }`}
//                               />
//                             </button>
//                             <span className={`text-xs font-medium ${
//                               user.isActive ? "text-green-700" : "text-red-700"
//                             }`}>
//                               {user.isActive ? "ACTIVE" : "INACTIVE"}
//                             </span>
//                           </div>
//                         </td>
                        
//                         {/* CREATED AT Column - Fixed width */}
//                         <td className="w-48 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {format(new Date(user.createdAt), "MMM dd, yyyy")}
//                         </td>
                        
//                         {/* ACTIONS Column - Fixed width */}
//                         <td className="w-40 px-3 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => {
//                                 setSelectedUser(user);
//                                 setShowViewModal(true);
//                               }}
//                               className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                               title="View Details"
//                             >
//                               <FiEye size={16} />
//                             </button>
//                             <button
//                               onClick={() => openOrdersModal(user)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="View Orders"
//                             >
//                               <FiPackage size={16} />
//                             </button>
//                             <button
//                               onClick={() => openAppointmentsModal(user)}
//                               className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                               title="View Appointments"
//                             >
//                               <FiCalendar size={16} />
//                             </button>
//                             <button
//                               onClick={async () => {
//                                 if (!window.confirm(`Delete ${user.name}?`)) return;
//                                 try {
//                                   const res = await userApi.deleteUser(user.id);
//                                   toast.success(res.message || "User deleted");
//                                   setUsers((prev) => prev.filter((u) => u.id !== user.id));
//                                 } catch (err: any) {
//                                   const errorMessage = err.response?.data?.message || 
//                                                       err.response?.data?.error || 
//                                                       err.message || 
//                                                       'Cannot delete user. Deactivate instead.';
//                                   toast.error(errorMessage);
//                                 }
//                               }}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
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
//               <span className="font-medium">{Math.min(page * rowsPerPage, totalUsers)}</span>{' '}
//               of <span className="font-medium">{totalUsers}</span> results
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

//       {/* ================= VIEW USER MODAL ================= */}
//       <AnimatePresence>
//         {showViewModal && selectedUser && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowViewModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-3xl p-8 max-w-xl w-full">
//                 <div className="flex justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-foreground">
//                       {selectedUser.name}
//                     </h2>
//                     <p className="text-sm text-muted-foreground">
//                       User ID: #{selectedUser.id}
//                     </p>
//                   </div>
//                   <FiX
//                     className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
//                     onClick={() => setShowViewModal(false)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Email
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {selectedUser.email}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Phone
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {selectedUser.phone}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Status
//                     </p>
//                     <span
//                       className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
//                         selectedUser.isActive
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {selectedUser.isActive ? "ACTIVE" : "INACTIVE"}
//                     </span>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Created At
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {format(new Date(selectedUser.createdAt), "MMM dd, yyyy")}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="my-6 border-t border-border" />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-foreground">
//                       {selectedUser.orderCount ?? 0}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
//                   </div>

//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-foreground">
//                       {selectedUser.appointmentCount ?? 0}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Appointments</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-8">
//                   <button
//                     onClick={() => setShowViewModal(false)}
//                     className="bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ENHANCED ORDERS MODAL ================= */}
//       <AnimatePresence>
//         {showOrdersModal && selectedUser && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowOrdersModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-card border border-border rounded-3xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-xl bg-gradient-sage flex items-center justify-center">
//                       <FiPackage className="text-white" size={20} />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-foreground">
//                         Customer Orders
//                       </h2>
//                       <p className="text-sm text-muted-foreground">
//                         {userOrders.length} total orders • {selectedUser.name}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowOrdersModal(false)}
//                     className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
//                   >
//                     <FiX className="text-muted-foreground" size={20} />
//                   </button>
//                 </div>

//                 {ordersLoading ? (
//                   <p className="text-center text-muted-foreground py-10">Loading orders…</p>
//                 ) : userOrders.length === 0 ? (
//                   <p className="text-center text-muted-foreground py-10">
//                     No orders found for this user
//                   </p>
//                 ) : (
//                   <div className="flex-1 overflow-y-auto space-y-4 pr-2">
//                     {userOrders.map((order) => {
//                       const firstItem = renderOrderItem(order);
                      
//                       return (
//                         <motion.div
//                           key={order.id}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="bg-gradient-to-br from-background to-secondary/50 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group hover:shadow-lg"
//                         >
//                           <div className="p-5 flex gap-5">
//                             <div className="relative flex-shrink-0">
//                               <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border-2 border-border group-hover:border-primary/50 transition-colors">
//                                 <img
//                                   src={firstItem.productImage}
//                                   alt={firstItem.productName}
//                                   className="w-full h-full object-cover"
//                                   onError={(e) => {
//                                     e.currentTarget.src = mockProductImages[order.id % mockProductImages.length];
//                                   }}
//                                 />
//                               </div>
//                               {firstItem.itemsLength > 1 && (
//                                 <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
//                                   +{firstItem.itemsLength - 1}
//                                 </div>
//                               )}
//                             </div>

//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-start justify-between gap-4 mb-3">
//                                 <div>
//                                   <h3 className="text-base font-bold text-foreground mb-1">
//                                     {firstItem.productName}
//                                   </h3>
//                                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
//                                     <span className="font-medium">
//                                       Product ID: #{firstItem.productId}
//                                     </span>
//                                     <span className="w-1 h-1 bg-border rounded-full"></span>
//                                     <span>Order ID: #{order.id}</span>
//                                   </div>
//                                 </div>
//                                 <span
//                                   className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
//                                     order.status
//                                   )}`}
//                                 >
//                                   {order.status}
//                                 </span>
//                               </div>

//                               <div className="flex items-center gap-4 mb-3">
//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                   <CalendarIcon className="text-muted-foreground" size={14} />
//                                   <span>
//                                     {format(new Date(order.createdAt), "MMM dd, yyyy")}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                   <FiCreditCard className="text-muted-foreground" size={14} />
//                                   <span className="font-semibold text-foreground">
//                                     ${order.totalAmount.toFixed(2)}
//                                   </span>
//                                 </div>
//                                 {order.trackingNumber && (
//                                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                     <FiTruck className="text-muted-foreground" size={14} />
//                                     <span className="text-xs">{order.trackingNumber}</span>
//                                   </div>
//                                 )}
//                               </div>

//                               <button
//                                 onClick={() => openOrderDetail(order)}
//                                 className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-sage text-white rounded-lg font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90"
//                               >
//                                 <FiPackage size={14} />
//                                 View Details
//                               </button>
//                             </div>
//                           </div>
//                         </motion.div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ORDER DETAIL MODAL ================= */}
//       <AnimatePresence>
//         {showOrderDetailModal && selectedOrder && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
//               onClick={() => setShowOrderDetailModal(false)}
//             />
//             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-card border border-border rounded-3xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//               >
//                 <div className="bg-gradient-sage px-6 py-5 flex justify-between items-center">
//                   <div>
//                     <h2 className="text-xl font-bold text-white">Order Details</h2>
//                     <p className="text-white/80 text-sm">
//                       Order #{selectedOrder.id}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setShowOrderDetailModal(false)}
//                     className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
//                   >
//                     <FiX className="text-white" size={20} />
//                   </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                           <FiPackage className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-primary font-semibold uppercase tracking-wide">
//                             Status
//                           </p>
//                           <p className="text-base font-bold text-foreground">
//                             {selectedOrder.status}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
//                           <FiCreditCard className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">
//                             Payment
//                           </p>
//                           <p className={`text-base font-bold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
//                             {selectedOrder.paymentStatus}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
//                           <CalendarIcon className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">
//                             Order Date
//                           </p>
//                           <p className="text-base font-bold text-foreground">
//                             {format(new Date(selectedOrder.createdAt), "MMM dd, yyyy")}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-5 border border-border">
//                     <div className="flex items-center gap-3 mb-3">
//                       <FiMapPin className="text-primary" size={18} />
//                       <h3 className="text-base font-bold text-foreground">
//                         Shipping Address
//                       </h3>
//                     </div>
//                     <p className="text-foreground text-sm leading-relaxed">
//                       {selectedOrder.shippingAddress}
//                     </p>
//                     {selectedOrder.trackingNumber && (
//                       <div className="mt-3 pt-3 border-t border-border">
//                         <div className="flex items-center gap-2">
//                           <FiTruck className="text-primary" size={16} />
//                           <span className="text-sm text-muted-foreground">Tracking Number:</span>
//                           <span className="text-sm font-bold text-foreground">
//                             {selectedOrder.trackingNumber}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <h3 className="text-base font-bold text-foreground mb-3">
//                       Order Items
//                     </h3>
//                     <div className="space-y-3">
//                       {selectedOrder.items?.map((item, index) => {
//                         const imageUrl = getProductImageUrl(item.productImage, index % mockProductImages.length);
//                         return (
//                           <div
//                             key={item.id || index}
//                             className="bg-background rounded-xl border border-border p-4 flex gap-4 hover:border-primary/50 transition-colors"
//                           >
//                             <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
//                               <img
//                                 src={imageUrl}
//                                 alt={item.productName}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   e.currentTarget.src = mockProductImages[index % mockProductImages.length];
//                                 }}
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="text-base font-bold text-foreground mb-1">
//                                 {item.productName || "Unknown Product"}
//                               </h4>
//                               <p className="text-xs text-muted-foreground mb-2">
//                                 Product ID: #{item.productId || "N/A"}
//                               </p>
//                               <div className="flex items-center gap-3 text-xs">
//                                 {item.selectedSize && (
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-muted-foreground">Size:</span>
//                                     <span className="font-semibold text-foreground">
//                                       {item.selectedSize}
//                                     </span>
//                                   </div>
//                                 )}
//                                 {item.selectedColor && (
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-muted-foreground">Color:</span>
//                                     <span className="font-semibold text-foreground">
//                                       {item.selectedColor}
//                                     </span>
//                                   </div>
//                                 )}
//                                 <div className="flex items-center gap-1.5">
//                                   <span className="text-muted-foreground">Qty:</span>
//                                   <span className="font-semibold text-foreground">
//                                     {item.quantity || 1}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-xs text-muted-foreground mb-1">Price</p>
//                               <p className="text-lg font-bold text-foreground">
//                                 ${(item.totalPrice || 0).toFixed(2)}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-border">
//                     <h3 className="text-base font-bold text-foreground mb-3">
//                       Order Summary
//                     </h3>
//                     <div className="space-y-2">
//                       {selectedOrder.discount && selectedOrder.discount > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Discount</span>
//                           <span className="font-semibold text-green-600">
//                             -${selectedOrder.discount.toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                       {selectedOrder.tax && selectedOrder.tax > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Tax</span>
//                           <span className="font-semibold text-foreground">
//                             ${selectedOrder.tax.toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                       <div className="pt-3 border-t-2 border-primary flex justify-between">
//                         <span className="text-base font-bold text-foreground">
//                           Total Amount
//                         </span>
//                         <span className="text-xl font-bold text-primary">
//                           ${selectedOrder.totalAmount.toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-secondary/50 px-6 py-4 flex justify-end gap-3 border-t border-border">
//                   <button
//                     onClick={() => setShowOrderDetailModal(false)}
//                     className="px-5 py-2 bg-background hover:bg-secondary text-foreground font-semibold rounded-lg border border-border transition-colors text-sm"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= APPOINTMENTS MODAL ================= */}
//       <AnimatePresence>
//         {showAppointmentsModal && selectedUser && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowAppointmentsModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-2xl p-6 max-w-3xl w-full">
//                 <div className="flex justify-between mb-4">
//                   <h2 className="text-xl font-bold text-foreground">
//                     Appointments – {selectedUser.name}
//                   </h2>
//                   <FiX
//                     className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
//                     onClick={() => setShowAppointmentsModal(false)}
//                   />
//                 </div>

//                 {appointmentsLoading ? (
//                   <p className="text-center text-muted-foreground">Loading…</p>
//                 ) : userAppointments.length === 0 ? (
//                   <p className="text-center text-muted-foreground">No appointments found</p>
//                 ) : (
//                   <div className="space-y-3 max-h-[60vh] overflow-auto">
//                     {userAppointments.map((a) => (
//                       <div key={a.id} className="glass-card p-4 rounded-xl">
//                         <p className="font-semibold text-foreground">{a.serviceType}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {a.appointmentDate} • {a.appointmentTime}
//                         </p>
//                         <p className="text-sm text-muted-foreground">Status: {a.status}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminUsers;

// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiEye,
//   FiTrash,
//   FiX,
//   FiSearch,
//   FiPackage,
//   FiCalendar,
//   FiMapPin,
//   FiCreditCard,
//   FiTruck,
//   FiCalendar as CalendarIcon,
//   FiEdit2,
//   FiPlay,
//   FiPause,
//   FiChevronLeft,
//   FiChevronRight,
//   FiChevronsLeft,
//   FiChevronsRight,
// } from "react-icons/fi";
// import { format } from "date-fns";
// import { userApi, type User } from "../../api/userApi";
// import orderApi from "../../api/orderApi";
// import appointmentApi from "../../api/appointmentApi";
// import toast from "react-hot-toast";

// interface OrderItem {
//   id: number;
//   productId: number;
//   productName: string;
//   productImage: string;
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
//   selectedSize: string;
//   selectedColor: string;
// }

// interface Order {
//   id: number;
//   userId: number;
//   status: string;
//   paymentStatus: string;
//   totalAmount: number;
//   discount: number | null;
//   tax: number | null;
//   trackingNumber: string | null;
//   shippingAddress: string;
//   createdAt: string;
//   updatedAt: string;
//   items: OrderItem[];
// }

// const AdminUsers = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   // Column filters
//   const [columnFilters, setColumnFilters] = useState({
//     id: '',
//     name: '',
//     email: '',
//     phone: '',
//     status: '',
//     date: ''
//   });

//   // View modal
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showViewModal, setShowViewModal] = useState(false);

//   // Orders modal
//   const [showOrdersModal, setShowOrdersModal] = useState(false);
//   const [ordersLoading, setOrdersLoading] = useState(false);
//   const [userOrders, setUserOrders] = useState<Order[]>([]);

//   // Order detail modal
//   const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   // Appointments modal
//   const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
//   const [appointmentsLoading, setAppointmentsLoading] = useState(false);
//   const [userAppointments, setUserAppointments] = useState<any[]>([]);

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

//   const getProductImageUrl = (imagePath: string | undefined) => {
//     // If no image path, return null to show broken image
//     if (!imagePath) {
//       return null;
//     }
    
//     // If it's already a full URL, return as is
//     if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
//       return imagePath;
//     }
    
//     // Remove any leading slash if present
//     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
//     // Construct the full URL using your server URL
//     return `${SERVER_URL}/${cleanPath}`;
//   };

//   const getMediaUrl = (path?: string) => {
//     if (!path) return null;
//     if (path.startsWith('http') || path.startsWith('blob:')) return path;
//     return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };
// // format currency as Indian Rupees
// const formatCurrency = (amount?: number | null) => {
//   const val = Number(amount ?? 0);
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     minimumFractionDigits: 2,
//   }).format(val); // e.g. "₹1,234.00"
// };

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const offset = (page - 1) * rowsPerPage;
//         const res = await userApi.getCustomers(offset, rowsPerPage);
//         setUsers(res.content);
//         setTotalUsers(res.totalElements);
//       } catch (error: any) {
//         const errorMessage = error.response?.data?.message || 
//                             error.response?.data?.error || 
//                             error.message || 
//                             'Failed to load users';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [page, rowsPerPage]);

//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setPage(1);
//   };

//   // Filtered users
//   const filteredUsers = useMemo(() => {
//     if (!users || !Array.isArray(users)) return [];
    
//     return users.filter(user => {
//       const matchesId = user.id.toString().includes(columnFilters.id);
//       const matchesName = (user.name || '').toLowerCase().includes(columnFilters.name.toLowerCase());
//       const matchesEmail = (user.email || '').toLowerCase().includes(columnFilters.email.toLowerCase());
//       const matchesPhone = (user.phone || '').includes(columnFilters.phone);
//       const matchesStatus = 
//         columnFilters.status === '' || 
//         (columnFilters.status === 'ACTIVE' && user.isActive) || 
//         (columnFilters.status === 'INACTIVE' && !user.isActive);
//       const matchesDate = 
//         columnFilters.date === '' || 
//         format(new Date(user.createdAt), 'yyyy-MM-dd').includes(columnFilters.date);
      
//       return matchesId && matchesName && matchesEmail && matchesPhone && matchesStatus && matchesDate;
//     });
//   }, [users, columnFilters]);

//   const totalPages = Math.ceil(totalUsers / rowsPerPage);

//   const handleStatusChange = async (user: User) => {
//     try {
//       const updatedUser = user.isActive
//         ? await userApi.deactivateUser(user.id)
//         : await userApi.activateUser(user.id);

//       setUsers((prev) =>
//         prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
//       );

//       toast.success(
//         updatedUser.isActive ? "User activated" : "User deactivated"
//       );
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 
//                           err.response?.data?.error || 
//                           err.message || 
//                           'Failed to update user status';
//       toast.error(errorMessage);
//     }
//   };

//   // Get status color using your theme
//   const getStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "PROCESSING":
//         return "bg-blue-100 text-blue-800";
//       case "SHIPPED":
//         return "bg-purple-100 text-purple-800";
//       case "DELIVERED":
//         return "bg-green-100 text-green-800";
//       case "CANCELLED":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Get payment status color
//   const getPaymentStatusColor = (status: string) => {
//     switch (status.toUpperCase()) {
//       case "PAID":
//         return "text-green-700";
//       case "PENDING":
//         return "text-yellow-700";
//       case "FAILED":
//         return "text-red-700";
//       default:
//         return "text-gray-700";
//     }
//   };

//   // Orders modal
//   const openOrdersModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowOrdersModal(true);
//     setOrdersLoading(true);

//     try {
//       const res = await orderApi.getUserOrders(user.id, 0, 50);
      
//       if (!res || !res.content) {
//         setUserOrders([]);
//         return;
//       }

//       const transformedOrders: Order[] = res.content.map((order: any, index: number) => {
//         const hasItems = order.items && Array.isArray(order.items) && order.items.length > 0;
        
//         return {
//           id: order.id || index,
//           userId: order.userId || user.id,
//           status: order.status || "PENDING",
//           paymentStatus: order.paymentStatus || "PENDING",
//           totalAmount: order.totalAmount || 0,
//           discount: order.discount || null,
//           tax: order.tax || null,
//           trackingNumber: order.trackingNumber || null,
//           shippingAddress: order.shippingAddress || "Address not specified",
//           createdAt: order.createdAt || new Date().toISOString(),
//           updatedAt: order.updatedAt || new Date().toISOString(),
//           items: hasItems 
//             ? order.items.map((item: any, itemIndex: number) => ({
//                 id: item.id || itemIndex,
//                 productId: item.productId || 0,
//                 productName: item.productName || `Product ${itemIndex + 1}`,
//                 productImage: item.productImage || item.imageUrl || '',
//                 quantity: item.quantity || 1,
//                 unitPrice: item.unitPrice || item.price || 0,
//                 totalPrice: item.totalPrice || (item.quantity || 1) * (item.unitPrice || item.price || 0),
//                 selectedSize: item.selectedSize || item.size || "M",
//                 selectedColor: item.selectedColor || item.color || "Black",
//               }))
//             : [{
//                 id: 0,
//                 productId: order.id || 0,
//                 productName: order.productName || "Unknown Product",
//                 productImage: '',
//                 quantity: 1,
//                 unitPrice: order.totalAmount || 0,
//                 totalPrice: order.totalAmount || 0,
//                 selectedSize: "M",
//                 selectedColor: "Black",
//               }],
//         };
//       });
      
//       setUserOrders(transformedOrders);
//     } catch (error: any) {
//       console.error("Error loading orders:", error);
//       const errorMessage = error.response?.data?.message || 
//                           error.response?.data?.error || 
//                           error.message || 
//                           'Failed to load orders';
//       toast.error(errorMessage);
//       setUserOrders([]);
//     } finally {
//       setOrdersLoading(false);
//     }
//   };

//   const openAppointmentsModal = async (user: User) => {
//     setSelectedUser(user);
//     setShowAppointmentsModal(true);
//     setAppointmentsLoading(true);

//     try {
//       const res = await appointmentApi.getUserAppointments(user.id, 0, 50);
//       setUserAppointments(res.content || []);
//     } catch (err: any) {
//       console.error(err);
//       const errorMessage = err.response?.data?.message || 
//                           err.response?.data?.error || 
//                           err.message || 
//                           'Failed to load appointments';
//       toast.error(errorMessage);
//     } finally {
//       setAppointmentsLoading(false);
//     }
//   };

//   const openOrderDetail = (order: Order) => {
//     setSelectedOrder(order);
//     setShowOrderDetailModal(true);
//   };

//   const renderOrderItem = (order: Order) => {
//     if (!order.items || order.items.length === 0) {
//       return {
//         productImage: null,
//         productName: "Unknown Product",
//         productId: order.id,
//         itemsLength: 0
//       };
//     }
    
//     const firstItem = order.items[0];
//     return {
//       productImage: getProductImageUrl(firstItem.productImage),
//       productName: firstItem.productName || "Unknown Product",
//       productId: firstItem.productId || order.id,
//       itemsLength: order.items.length
//     };
//   };

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">User Management</h2>
//           <p className="text-dark-600 mt-1">{totalUsers} users total</p>
//         </div>
        
//         {/* Export Button */}
//         {/* <div className="flex space-x-3">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
//           >
//             Export all users
//           </motion.button>
//         </div> */}
//       </div>

//       {/* --- TABLE WITH COLUMN FILTERS --- */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <div className="inline-block min-w-full align-middle">
//             <div className="overflow-hidden">
//               <table className="min-w-full divide-y divide-dark-200">
//                 <thead className="bg-dark-50">
//                   <tr>
//                     {/* ID Column with filter - Fixed width */}
//                     <th className="w-28 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>ID</span>
//                         <input
//                           type="text"
//                           placeholder="ID"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white w-full"
//                           value={columnFilters.id}
//                           onChange={(e) => handleColumnFilterChange('id', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* NAME Column with filter - Fixed width */}
//                     <th className="w-64 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>NAME</span>
//                         <input
//                           type="text"
//                           placeholder="Search Name"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.name}
//                           onChange={(e) => handleColumnFilterChange('name', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* EMAIL Column with filter - Fixed width */}
//                     <th className="w-80 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>EMAIL</span>
//                         <input
//                           type="text"
//                           placeholder="Search Email"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.email}
//                           onChange={(e) => handleColumnFilterChange('email', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* PHONE Column with filter - Fixed width */}
//                     <th className="w-48 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>PHONE</span>
//                         <input
//                           type="text"
//                           placeholder="Search Phone"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.phone}
//                           onChange={(e) => handleColumnFilterChange('phone', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* STATUS Column with filter - Fixed width */}
//                     <th className="w-40 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>STATUS</span>
//                         <select
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.status}
//                           onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                         >
//                           <option value="">All</option>
//                           <option value="ACTIVE">Active</option>
//                           <option value="INACTIVE">Inactive</option>
//                         </select>
//                       </div>
//                     </th>
                    
//                     {/* CREATED AT Column with filter - Fixed width */}
//                     <th className="w-48 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       <div className="flex flex-col">
//                         <span>CREATED AT</span>
//                         <input
//                           type="text"
//                           placeholder="YYYY-MM-DD"
//                           className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                           value={columnFilters.date}
//                           onChange={(e) => handleColumnFilterChange('date', e.target.value)}
//                         />
//                       </div>
//                     </th>
                    
//                     {/* ACTIONS Column - Fixed width */}
//                     <th className="w-40 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                       ACTIONS
//                     </th>
//                   </tr>
//                 </thead>
                
//                 <tbody className="bg-white divide-y divide-dark-200 max-h-[400px] overflow-y-auto">
//                   {loading ? (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                         Loading users...
//                       </td>
//                     </tr>
//                   ) : filteredUsers.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                         No users found
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredUsers.map((user) => (
//                       <tr key={user.id} className="hover:bg-dark-50">
//                         {/* ID Column - Fixed width */}
//                         <td className="w-24 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
//                           #{user.id}
//                         </td>
                        
//                         {/* NAME Column - Fixed width with ellipsis */}
//                         <td className="w-64 px-3 py-4">
//                           <div className="text-sm font-medium text-dark-900 truncate max-w-[240px]" title={user.name}>
//                             {user.name}
//                           </div>
//                         </td>
                        
//                         {/* EMAIL Column - Fixed width with ellipsis */}
//                         <td className="w-80 px-3 py-4">
//                           <div className="text-sm text-dark-900 truncate max-w-[300px]" title={user.email}>
//                             {user.email}
//                           </div>
//                         </td>
                        
//                         {/* PHONE Column - Fixed width */}
//                         <td className="w-48 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
//                           <div className="truncate max-w-[180px]" title={user.phone || 'N/A'}>
//                             {user.phone || 'N/A'}
//                           </div>
//                         </td>
                        
//                         {/* STATUS Column - Fixed width */}
//                         <td className="w-40 px-3 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handleStatusChange(user)}
//                               className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
//                                 user.isActive ? "bg-green-500" : "bg-red-500"
//                               }`}
//                             >
//                               <span
//                                 className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
//                                   user.isActive ? "translate-x-6" : "translate-x-1"
//                                 }`}
//                               />
//                             </button>
//                             <span className={`text-xs font-medium ${
//                               user.isActive ? "text-green-700" : "text-red-700"
//                             }`}>
//                               {user.isActive ? "ACTIVE" : "INACTIVE"}
//                             </span>
//                           </div>
//                         </td>
                        
//                         {/* CREATED AT Column - Fixed width */}
//                         <td className="w-48 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
//                           {format(new Date(user.createdAt), "MMM dd, yyyy")}
//                         </td>
                        
//                         {/* ACTIONS Column - Fixed width */}
//                         <td className="w-40 px-3 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => {
//                                 setSelectedUser(user);
//                                 setShowViewModal(true);
//                               }}
//                               className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                               title="View Details"
//                             >
//                               <FiEye size={16} />
//                             </button>
//                             <button
//                               onClick={() => openOrdersModal(user)}
//                               className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
//                               title="View Orders"
//                             >
//                               <FiPackage size={16} />
//                             </button>
//                             <button
//                               onClick={() => openAppointmentsModal(user)}
//                               className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
//                               title="View Appointments"
//                             >
//                               <FiCalendar size={16} />
//                             </button>
//                             <button
//                               onClick={async () => {
//                                 if (!window.confirm(`Delete ${user.name}?`)) return;
//                                 try {
//                                   const res = await userApi.deleteUser(user.id);
//                                   toast.success(res.message || "User deleted");
//                                   setUsers((prev) => prev.filter((u) => u.id !== user.id));
//                                 } catch (err: any) {
//                                   const errorMessage = err.response?.data?.message || 
//                                                       err.response?.data?.error || 
//                                                       err.message || 
//                                                       'Cannot delete user. Deactivate instead.';
//                                   toast.error(errorMessage);
//                                 }
//                               }}
//                               className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
//                               title="Delete"
//                             >
//                               <FiTrash size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
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
//               <span className="font-medium">{Math.min(page * rowsPerPage, totalUsers)}</span>{' '}
//               of <span className="font-medium">{totalUsers}</span> results
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

//       {/* ================= VIEW USER MODAL ================= */}
//       <AnimatePresence>
//         {showViewModal && selectedUser && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowViewModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-3xl p-8 max-w-xl w-full">
//                 <div className="flex justify-between mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-foreground">
//                       {selectedUser.name}
//                     </h2>
//                     <p className="text-sm text-muted-foreground">
//                       User ID: #{selectedUser.id}
//                     </p>
//                   </div>
//                   <FiX
//                     className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
//                     onClick={() => setShowViewModal(false)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Email
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {selectedUser.email}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Phone
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {selectedUser.phone}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Status
//                     </p>
//                     <span
//                       className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
//                         selectedUser.isActive
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {selectedUser.isActive ? "ACTIVE" : "INACTIVE"}
//                     </span>
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
//                       Created At
//                     </p>
//                     <p className="text-base font-semibold text-foreground break-all">
//                       {format(new Date(selectedUser.createdAt), "MMM dd, yyyy")}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="my-6 border-t border-border" />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-foreground">
//                       {selectedUser.orderCount ?? 0}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
//                   </div>

//                   <div className="glass-card p-4 rounded-xl text-center">
//                     <p className="text-3xl font-bold text-foreground">
//                       {selectedUser.appointmentCount ?? 0}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">Appointments</p>
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-8">
//                   <button
//                     onClick={() => setShowViewModal(false)}
//                     className="bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ENHANCED ORDERS MODAL ================= */}
//       <AnimatePresence>
//         {showOrdersModal && selectedUser && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowOrdersModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-card border border-border rounded-3xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-xl bg-gradient-sage flex items-center justify-center">
//                       <FiPackage className="text-white" size={20} />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-foreground">
//                         Customer Orders
//                       </h2>
//                       <p className="text-sm text-muted-foreground">
//                         {userOrders.length} total orders • {selectedUser.name}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowOrdersModal(false)}
//                     className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
//                   >
//                     <FiX className="text-muted-foreground" size={20} />
//                   </button>
//                 </div>

//                 {ordersLoading ? (
//                   <p className="text-center text-muted-foreground py-10">Loading orders…</p>
//                 ) : userOrders.length === 0 ? (
//                   <p className="text-center text-muted-foreground py-10">
//                     No orders found for this user
//                   </p>
//                 ) : (
//                   <div className="flex-1 overflow-y-auto space-y-4 pr-2">
//                     {userOrders.map((order) => {
//                       const firstItem = renderOrderItem(order);
//                       const imageUrl = firstItem.productImage;
                      
//                       return (
//                         <motion.div
//                           key={order.id}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="bg-gradient-to-br from-background to-secondary/50 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group hover:shadow-lg"
//                         >
//                           <div className="p-5 flex gap-5">
//                             <div className="relative flex-shrink-0">
//                               <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border-2 border-border group-hover:border-primary/50 transition-colors">
//                                 {imageUrl ? (
//                                   <img
//                                     src={imageUrl}
//                                     alt={firstItem.productName}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 ) : (
//                                   <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                                     <FiPackage className="text-gray-400" size={24} />
//                                   </div>
//                                 )}
//                               </div>
//                               {firstItem.itemsLength > 1 && (
//                                 <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
//                                   +{firstItem.itemsLength - 1}
//                                 </div>
//                               )}
//                             </div>

//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-start justify-between gap-4 mb-3">
//                                 <div>
//                                   <h3 className="text-base font-bold text-foreground mb-1">
//                                     {firstItem.productName}
//                                   </h3>
//                                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
//                                     <span className="font-medium">
//                                       Product ID: #{firstItem.productId}
//                                     </span>
//                                     <span className="w-1 h-1 bg-border rounded-full"></span>
//                                     <span>Order ID: #{order.id}</span>
//                                   </div>
//                                 </div>
//                                 <span
//                                   className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
//                                     order.status
//                                   )}`}
//                                 >
//                                   {order.status}
//                                 </span>
//                               </div>

//                               <div className="flex items-center gap-4 mb-3">
//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                   <CalendarIcon className="text-muted-foreground" size={14} />
//                                   <span>
//                                     {format(new Date(order.createdAt), "MMM dd, yyyy")}
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                   <FiCreditCard className="text-muted-foreground" size={14} />
//                                   <span className="font-semibold text-foreground">
//                                     {formatCurrency(order.totalAmount)}
//                                   </span>
//                                 </div>
//                                 {order.trackingNumber && (
//                                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                     <FiTruck className="text-muted-foreground" size={14} />
//                                     <span className="text-xs">{order.trackingNumber}</span>
//                                   </div>
//                                 )}
//                               </div>

//                               <button
//                                 onClick={() => openOrderDetail(order)}
//                                 className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-sage text-white rounded-lg font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90"
//                               >
//                                 <FiPackage size={14} />
//                                 View Details
//                               </button>
//                             </div>
//                           </div>
//                         </motion.div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= ORDER DETAIL MODAL ================= */}
//       <AnimatePresence>
//         {showOrderDetailModal && selectedOrder && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
//               onClick={() => setShowOrderDetailModal(false)}
//             />
//             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="bg-card border border-border rounded-3xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//               >
//                 <div className="bg-gradient-sage px-6 py-5 flex justify-between items-center">
//                   <div>
//                     <h2 className="text-xl font-bold text-white">Order Details</h2>
//                     <p className="text-white/80 text-sm">
//                       Order #{selectedOrder.id}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setShowOrderDetailModal(false)}
//                     className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
//                   >
//                     <FiX className="text-white" size={20} />
//                   </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                           <FiPackage className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-primary font-semibold uppercase tracking-wide">
//                             Status
//                           </p>
//                           <p className="text-base font-bold text-foreground">
//                             {selectedOrder.status}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
//                           <FiCreditCard className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">
//                             Payment
//                           </p>
//                           <p className={`text-base font-bold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
//                             {selectedOrder.paymentStatus}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-border">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
//                           <CalendarIcon className="text-white" size={16} />
//                         </div>
//                         <div>
//                           <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">
//                             Order Date
//                           </p>
//                           <p className="text-base font-bold text-foreground">
//                             {format(new Date(selectedOrder.createdAt), "MMM dd, yyyy")}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-5 border border-border">
//                     <div className="flex items-center gap-3 mb-3">
//                       <FiMapPin className="text-primary" size={18} />
//                       <h3 className="text-base font-bold text-foreground">
//                         Shipping Address
//                       </h3>
//                     </div>
//                     <p className="text-foreground text-sm leading-relaxed">
//                       {selectedOrder.shippingAddress}
//                     </p>
//                     {selectedOrder.trackingNumber && (
//                       <div className="mt-3 pt-3 border-t border-border">
//                         <div className="flex items-center gap-2">
//                           <FiTruck className="text-primary" size={16} />
//                           <span className="text-sm text-muted-foreground">Tracking Number:</span>
//                           <span className="text-sm font-bold text-foreground">
//                             {selectedOrder.trackingNumber}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <h3 className="text-base font-bold text-foreground mb-3">
//                       Order Items
//                     </h3>
//                     <div className="space-y-3">
//                       {selectedOrder.items?.map((item, index) => {
//                         const imageUrl = getProductImageUrl(item.productImage);
//                         return (
//                           <div
//                             key={item.id || index}
//                             className="bg-background rounded-xl border border-border p-4 flex gap-4 hover:border-primary/50 transition-colors"
//                           >
//                             <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
//                               {imageUrl ? (
//                                 <img
//                                   src={imageUrl}
//                                   alt={item.productName}
//                                   className="w-full h-full object-cover"
//                                 />
//                               ) : (
//                                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                                   <FiPackage className="text-gray-400" size={24} />
//                                 </div>
//                               )}
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="text-base font-bold text-foreground mb-1">
//                                 {item.productName || "Unknown Product"}
//                               </h4>
//                               <p className="text-xs text-muted-foreground mb-2">
//                                 Product ID: #{item.productId || "N/A"}
//                               </p>
//                               <div className="flex items-center gap-3 text-xs">
//                                 {item.selectedSize && (
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-muted-foreground">Size:</span>
//                                     <span className="font-semibold text-foreground">
//                                       {item.selectedSize}
//                                     </span>
//                                   </div>
//                                 )}
//                                 {item.selectedColor && (
//                                   <div className="flex items-center gap-1.5">
//                                     <span className="text-muted-foreground">Color:</span>
//                                     <span className="font-semibold text-foreground">
//                                       {item.selectedColor}
//                                     </span>
//                                   </div>
//                                 )}
//                                 <div className="flex items-center gap-1.5">
//                                   <span className="text-muted-foreground">Qty:</span>
//                                   <span className="font-semibold text-foreground">
//                                     {item.quantity || 1}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-xs text-muted-foreground mb-1">Price</p>
//                               <p className="text-lg font-bold text-foreground">
//                                 {formatCurrency(item.totalPrice)}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-border">
//                     <h3 className="text-base font-bold text-foreground mb-3">
//                       Order Summary
//                     </h3>
//                     <div className="space-y-2">
//                       {selectedOrder.discount && selectedOrder.discount > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Discount</span>
//                           <span className="font-semibold text-green-600">
//                             -{formatCurrency(selectedOrder.discount)}
//                           </span>
//                         </div>
//                       )}
//                       {selectedOrder.tax && selectedOrder.tax > 0 && (
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground">Tax</span>
//                           <span className="font-semibold text-foreground">
//                             {formatCurrency(selectedOrder.tax)}
//                           </span>
//                         </div>
//                       )}
//                       <div className="pt-3 border-t-2 border-primary flex justify-between">
//                         <span className="text-base font-bold text-foreground">
//                           Total Amount
//                         </span>
//                         <span className="text-xl font-bold text-primary">
//                           {formatCurrency(selectedOrder.totalAmount)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-secondary/50 px-6 py-4 flex justify-end gap-3 border-t border-border">
//                   <button
//                     onClick={() => setShowOrderDetailModal(false)}
//                     className="px-5 py-2 bg-background hover:bg-secondary text-foreground font-semibold rounded-lg border border-border transition-colors text-sm"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* ================= APPOINTMENTS MODAL ================= */}
//       <AnimatePresence>
//         {showAppointmentsModal && selectedUser && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               onClick={() => setShowAppointmentsModal(false)}
//             />
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <motion.div className="glass-card rounded-2xl p-6 max-w-3xl w-full">
//                 <div className="flex justify-between mb-4">
//                   <h2 className="text-xl font-bold text-foreground">
//                     Appointments – {selectedUser.name}
//                   </h2>
//                   <FiX
//                     className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
//                     onClick={() => setShowAppointmentsModal(false)}
//                   />
//                 </div>

//                 {appointmentsLoading ? (
//                   <p className="text-center text-muted-foreground">Loading…</p>
//                 ) : userAppointments.length === 0 ? (
//                   <p className="text-center text-muted-foreground">No appointments found</p>
//                 ) : (
//                   <div className="space-y-3 max-h-[60vh] overflow-auto">
//                     {userAppointments.map((a) => (
//                       <div key={a.id} className="glass-card p-4 rounded-xl">
//                         <p className="font-semibold text-foreground">{a.serviceType}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {a.appointmentDate} • {a.appointmentTime}
//                         </p>
//                         <p className="text-sm text-muted-foreground">Status: {a.status}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminUsers;


import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiTrash,
  FiX,
  FiSearch,
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiCalendar as CalendarIcon,
  // FiEdit2,
  // FiPlay,
  // FiPause,
  // FiChevronLeft,
  // FiChevronRight,
  // FiChevronsLeft,
  // FiChevronsRight,
} from "react-icons/fi";
import { format } from "date-fns";
import { userApi, type User } from "../../api/userApi";
import orderApi from "../../api/orderApi";
import appointmentApi from "../../api/appointmentApi";
import toast from "react-hot-toast";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedSize: string;
  selectedColor: string;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  discount: number | null;
  tax: number | null;
  trackingNumber: string | null;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState("");
  
  // Column filters
  const [columnFilters, setColumnFilters] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    status: '',
    date: ''
  });

  // View modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Orders modal
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Order filters and sorting
  const [productSearch, setProductSearch] = useState('');
  const [productIdSearch, setProductIdSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');

  // Order detail modal
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Appointments modal
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const rowsPerPageOptions = [5, 10, 20, 50, 100];

  useEffect(() => {
    const isModalOpen =
      showViewModal ||
      showOrdersModal ||
      showOrderDetailModal ||
      showAppointmentsModal;
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    showViewModal,
    showOrdersModal,
    showOrderDetailModal,
    showAppointmentsModal,
  ]);

  const SERVER_URL = import.meta.env.VITE_API_IMG_URL || 'http://192.168.1.111:8090';

  const getProductImageUrl = (imagePath: string | undefined) => {
    // If no image path, return null to show broken image
    if (!imagePath) {
      return null;
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
      return imagePath;
    }
    
    // Remove any leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // Construct the full URL using your server URL
    return `${SERVER_URL}/${cleanPath}`;
  };

  // const getMediaUrl = (path?: string) => {
  //   if (!path) return null;
  //   if (path.startsWith('http') || path.startsWith('blob:')) return path;
  //   return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  // };

  // format currency as Indian Rupees
  const formatCurrency = (amount?: number | null) => {
    const val = Number(amount ?? 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(val); // e.g. "₹1,234.00"
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const currentPage = Math.max(0, page - 1);
        const res = await userApi.getCustomers(currentPage, rowsPerPage);
        setUsers(res.content);
        setTotalUsers(res.totalElements || res.total || res.content.length);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            error.message || 
                            'Failed to load users';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, rowsPerPage]);

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
    setPage(1);
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    
    return users.filter(user => {
      const matchesId = user.id.toString().includes(columnFilters.id);
      const matchesName = (user.name || '').toLowerCase().includes(columnFilters.name.toLowerCase());
      const matchesEmail = (user.email || '').toLowerCase().includes(columnFilters.email.toLowerCase());
      const matchesPhone = (user.phone || '').includes(columnFilters.phone);
      const matchesStatus = 
        columnFilters.status === '' || 
        (columnFilters.status === 'ACTIVE' && user.isActive) || 
        (columnFilters.status === 'INACTIVE' && !user.isActive);
      const matchesDate = 
        columnFilters.date === '' || 
        format(new Date(user.createdAt), 'yyyy-MM-dd').includes(columnFilters.date);
      
      return matchesId && matchesName && matchesEmail && matchesPhone && matchesStatus && matchesDate;
    });
  }, [users, columnFilters]);

  const totalPages = Math.ceil(totalUsers / rowsPerPage);

  const handleStatusChange = async (user: User) => {
    try {
      const updatedUser = user.isActive
        ? await userApi.deactivateUser(user.id)
        : await userApi.activateUser(user.id);

      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );

      toast.success(
        updatedUser.isActive ? "User activated" : "User deactivated"
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to update user status';
      toast.error(errorMessage);
    }
  };

  // Get status color using your theme
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "OUT_FOR_DELIVERY":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "RETURNED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
      case "PAID":
        return "text-green-700";
      case "PENDING":
        return "text-yellow-700";
      case "FAILED":
        return "text-red-700";
      case "REFUNDED":
        return "text-blue-700";
      default:
        return "text-gray-700";
    }
  };

  // Orders modal
  const openOrdersModal = async (user: User) => {
    setSelectedUser(user);
    setShowOrdersModal(true);
    setOrdersLoading(true);

    try {
      const res = await orderApi.getUserOrders(user.id, 0, 50);
      
      if (!res || !res.content) {
        setUserOrders([]);
        return;
      }

      const transformedOrders: Order[] = res.content.map((order: any, index: number) => {
        const hasItems = order.items && Array.isArray(order.items) && order.items.length > 0;
        
        return {
          id: order.id || index,
          userId: order.userId || user.id,
          status: order.status || "PENDING",
          paymentStatus: order.paymentStatus || "PENDING",
          totalAmount: order.totalAmount || 0,
          discount: order.discount || null,
          tax: order.tax || null,
          trackingNumber: order.trackingNumber || null,
          shippingAddress: order.shippingAddress || "Address not specified",
          createdAt: order.createdAt || new Date().toISOString(),
          updatedAt: order.updatedAt || new Date().toISOString(),
          items: hasItems 
            ? order.items.map((item: any, itemIndex: number) => ({
                id: item.id || itemIndex,
                productId: item.productId || 0,
                productName: item.productName || `Product ${itemIndex + 1}`,
                productImage: item.productImage || item.imageUrl || '',
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || item.price || 0,
                totalPrice: item.totalPrice || (item.quantity || 1) * (item.unitPrice || item.price || 0),
                selectedSize: item.selectedSize || item.size || "M",
                selectedColor: item.selectedColor || item.color || "Black",
              }))
            : [{
                id: 0,
                productId: order.id || 0,
                productName: order.productName || "Unknown Product",
                productImage: '',
                quantity: 1,
                unitPrice: order.totalAmount || 0,
                totalPrice: order.totalAmount || 0,
                selectedSize: "M",
                selectedColor: "Black",
              }],
        };
      });
      
      setUserOrders(transformedOrders);
    } catch (error: any) {
      console.error("Error loading orders:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to load orders';
      toast.error(errorMessage);
      setUserOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    if (!userOrders || !Array.isArray(userOrders)) return [];

    let filtered = [...userOrders];

    // Filter by product name
    if (productSearch) {
      const searchTerm = productSearch.toLowerCase();
      filtered = filtered.filter(order =>
        order.items?.some(item =>
          item.productName?.toLowerCase().includes(searchTerm)
        )
      );
    }

    // Filter by product ID
    if (productIdSearch) {
      filtered = filtered.filter(order =>
        order.items?.some(item =>
          item.productId?.toString().includes(productIdSearch)
        )
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(order =>
        order.status?.toUpperCase() === statusFilter.toUpperCase()
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [userOrders, productSearch, productIdSearch, statusFilter, dateSort]);

  // Handle date sort
  const handleDateSort = (sort: 'asc' | 'desc') => {
    setDateSort(sort);
  };

  // Clear all filters
  const clearFilters = () => {
    setProductSearch('');
    setProductIdSearch('');
    setStatusFilter('');
    setDateSort('desc');
  };

  const openAppointmentsModal = async (user: User) => {
    setSelectedUser(user);
    setShowAppointmentsModal(true);
    setAppointmentsLoading(true);

    try {
      const res = await appointmentApi.getUserAppointments(user.id, 0, 50);
      setUserAppointments(res.content || []);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to load appointments';
      toast.error(errorMessage);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };

  const renderOrderItem = (order: Order) => {
    if (!order.items || order.items.length === 0) {
      return {
        productImage: null,
        productName: "Unknown Product",
        productId: order.id,
        itemsLength: 0
      };
    }
    
    const firstItem = order.items[0];
    return {
      productImage: getProductImageUrl(firstItem.productImage),
      productName: firstItem.productName || "Unknown Product",
      productId: firstItem.productId || order.id,
      itemsLength: order.items.length
    };
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-900">User Management</h2>
          <p className="text-dark-600 mt-1">{totalUsers} users total</p>
        </div>
        
        {/* Export Button */}
        {/* <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl flex items-center space-x-2 glass-card text-dark-800 ring-1 ring-[#8FAE8B] hover:bg-primary-50"
          >
            Export all users
          </motion.button>
        </div> */}
      </div>

      {/* --- TABLE WITH COLUMN FILTERS --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-dark-200">
                <thead className="bg-dark-50">
                  <tr>
                    {/* ID Column with filter - Fixed width */}
                    <th className="w-28 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <span>ID</span>
                        <input
                          type="text"
                          placeholder="ID"
                          className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white w-full"
                          value={columnFilters.id}
                          onChange={(e) => handleColumnFilterChange('id', e.target.value)}
                        />
                      </div>
                    </th>
                    
                    {/* NAME Column with filter - Fixed width */}
                    <th className="w-64 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <span>NAME</span>
                        <input
                          type="text"
                          placeholder="Search Name"
                          className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          value={columnFilters.name}
                          onChange={(e) => handleColumnFilterChange('name', e.target.value)}
                        />
                      </div>
                    </th>
                    
                    {/* EMAIL Column with filter - Fixed width */}
                    <th className="w-80 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <span>EMAIL</span>
                        <input
                          type="text"
                          placeholder="Search Email"
                          className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          value={columnFilters.email}
                          onChange={(e) => handleColumnFilterChange('email', e.target.value)}
                        />
                      </div>
                    </th>
                    
                    {/* PHONE Column with filter - Fixed width */}
                    <th className="w-48 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <span>PHONE</span>
                        <input
                          type="text"
                          placeholder="Search Phone"
                          className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          value={columnFilters.phone}
                          onChange={(e) => handleColumnFilterChange('phone', e.target.value)}
                        />
                      </div>
                    </th>
                    
                    {/* STATUS Column with filter - Fixed width */}
                    <th className="w-40 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <span>STATUS</span>
                        <select
                          className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          value={columnFilters.status}
                          onChange={(e) => handleColumnFilterChange('status', e.target.value)}
                        >
                          <option value="">All</option>
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </th>
                    
                    {/* CREATED AT Column with filter - Fixed width */}
                    <th className="w-48 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <span>CREATED AT</span>
                        <input
                          type="text"
                          placeholder="YYYY-MM-DD"
                          className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          value={columnFilters.date}
                          onChange={(e) => handleColumnFilterChange('date', e.target.value)}
                        />
                      </div>
                    </th>
                    
                    {/* ACTIONS Column - Fixed width */}
                    <th className="w-40 px-3 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-dark-200 max-h-[400px] overflow-y-auto">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-dark-50">
                        {/* ID Column - Fixed width */}
                        <td className="w-24 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
                          #{user.id}
                        </td>
                        
                        {/* NAME Column - Fixed width with ellipsis */}
                        <td className="w-64 px-3 py-4">
                          <div className="text-sm font-medium text-dark-900 truncate max-w-[240px]" title={user.name}>
                            {user.name}
                          </div>
                        </td>
                        
                        {/* EMAIL Column - Fixed width with ellipsis */}
                        <td className="w-80 px-3 py-4">
                          <div className="text-sm text-dark-900 truncate max-w-[300px]" title={user.email}>
                            {user.email}
                          </div>
                        </td>
                        
                        {/* PHONE Column - Fixed width */}
                        <td className="w-48 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
                          <div className="truncate max-w-[180px]" title={user.phone || 'N/A'}>
                            {user.phone || 'N/A'}
                          </div>
                        </td>
                        
                        {/* STATUS Column - Fixed width */}
                        <td className="w-40 px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStatusChange(user)}
                              className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                                user.isActive ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                                  user.isActive ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span className={`text-xs font-medium ${
                              user.isActive ? "text-green-700" : "text-red-700"
                            }`}>
                              {user.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </div>
                        </td>
                        
                        {/* CREATED AT Column - Fixed width */}
                        <td className="w-48 px-3 py-4 whitespace-nowrap text-sm text-dark-900">
                          {format(new Date(user.createdAt), "MMM dd, yyyy")}
                        </td>
                        
                        {/* ACTIONS Column - Fixed width */}
                        <td className="w-40 px-3 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowViewModal(true);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                              title="View Details"
                            >
                              <FiEye size={16} />
                            </button>
                            <button
                              onClick={() => openOrdersModal(user)}
                              className="p-1 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded"
                              title="View Orders"
                            >
                              <FiPackage size={16} />
                            </button>
                            <button
                              onClick={() => openAppointmentsModal(user)}
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                              title="View Appointments"
                            >
                              <FiCalendar size={16} />
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm(`Delete ${user.name}?`)) return;
                                try {
                                  const res = await userApi.deleteUser(user.id);
                                  toast.success(res.message || "User deleted");
                                  setUsers((prev) => prev.filter((u) => u.id !== user.id));
                                } catch (err: any) {
                                  const errorMessage = err.response?.data?.message || 
                                                      err.response?.data?.error || 
                                                      err.message || 
                                                      'Cannot delete user. Deactivate instead.';
                                  toast.error(errorMessage);
                                }
                              }}
                              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <FiTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
              {rowsPerPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm text-dark-700">
              Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * rowsPerPage, totalUsers)}</span>{' '}
              of <span className="font-medium">{totalUsers}</span> results
            </p>
          </div>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
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
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                    : 'bg-white border-dark-300 text-dark-500 hover:bg-dark-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-dark-300 bg-white text-sm font-medium text-dark-500 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* ================= VIEW USER MODAL ================= */}
      {createPortal(
        <AnimatePresence>
          {showViewModal && selectedUser && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990]"
                onClick={() => setShowViewModal(false)}
              />
              <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div className="glass-card rounded-3xl p-8 max-w-xl w-full">
                <div className="flex justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedUser.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      User ID: #{selectedUser.id}
                    </p>
                  </div>
                  <FiX
                    className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowViewModal(false)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Email
                    </p>
                    <p className="text-base font-semibold text-foreground break-all">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Phone
                    </p>
                    <p className="text-base font-semibold text-foreground break-all">
                      {selectedUser.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedUser.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedUser.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Created At
                    </p>
                    <p className="text-base font-semibold text-foreground break-all">
                      {format(new Date(selectedUser.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="my-6 border-t border-border" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-foreground">
                      {selectedUser.orderCount ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
                  </div>

                  <div className="glass-card p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-foreground">
                      {selectedUser.appointmentCount ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Appointments</p>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* ================= ENHANCED ORDERS MODAL ================= */}
      {createPortal(
        <AnimatePresence>
          {showOrdersModal && selectedUser && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990]"
                onClick={() => setShowOrdersModal(false)}
              />
              <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-3xl shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-sage flex items-center justify-center">
                      <FiPackage className="text-white" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        Customer Orders
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {filteredOrders.length} of {userOrders.length} orders • {selectedUser.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOrdersModal(false)}
                    className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
                  >
                    <FiX className="text-muted-foreground" size={20} />
                  </button>
                </div>

                {/* SEARCH AND FILTERS SECTION */}
                <div className="mb-6 p-4 bg-secondary/30 rounded-xl border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Product Name Search */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Search by Product Name
                      </label>
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                          type="text"
                          placeholder="Enter product name..."
                          className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Product ID Search */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Search by Product ID
                      </label>
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                          type="text"
                          placeholder="Enter product ID..."
                          className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={productIdSearch}
                          onChange={(e) => setProductIdSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Filter by Status
                      </label>
                      <select
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Date Sorting */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-muted-foreground">Sort by Date:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDateSort('asc')}
                          className={`px-3 py-1 text-xs rounded-lg border transition-colors ${dateSort === 'asc' ? 'bg-primary text-white border-primary' : 'bg-background text-foreground border-border hover:bg-secondary'}`}
                        >
                          <FiCalendar className="inline mr-1" size={12} />
                          Oldest First
                        </button>
                        <button
                          onClick={() => handleDateSort('desc')}
                          className={`px-3 py-1 text-xs rounded-lg border transition-colors ${dateSort === 'desc' ? 'bg-primary text-white border-primary' : 'bg-background text-foreground border-border hover:bg-secondary'}`}
                        >
                          <FiCalendar className="inline mr-1" size={12} />
                          Newest First
                        </button>
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(productSearch || productIdSearch || statusFilter || dateSort !== 'desc') && (
                      <button
                        onClick={clearFilters}
                        className="px-3 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Orders Count */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredOrders.length} of {userOrders.length} orders
                  </p>
                </div>

                {ordersLoading ? (
                  <p className="text-center text-muted-foreground py-10">Loading orders…</p>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-10">
                    <FiPackage className="mx-auto text-muted-foreground mb-3" size={48} />
                    <p className="text-muted-foreground mb-2">No orders found</p>
                    {(productSearch || productIdSearch || statusFilter) && (
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filter criteria
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {filteredOrders.map((order) => {
                      const firstItem = renderOrderItem(order);
                      const imageUrl = firstItem.productImage;
                      
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-background to-secondary/50 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group hover:shadow-lg"
                        >
                          <div className="p-5 flex gap-5">
                            <div className="relative flex-shrink-0">
                              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border-2 border-border group-hover:border-primary/50 transition-colors">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={firstItem.productName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <FiPackage className="text-gray-400" size={24} />
                                  </div>
                                )}
                              </div>
                              {firstItem.itemsLength > 1 && (
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                  +{firstItem.itemsLength - 1}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                  <h3 className="text-base font-bold text-foreground mb-1">
                                    {firstItem.productName}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium">
                                      Product ID: #{firstItem.productId}
                                    </span>
                                    <span className="w-1 h-1 bg-border rounded-full"></span>
                                    <span>Order ID: #{order.id}</span>
                                    <span className="w-1 h-1 bg-border rounded-full"></span>
                                    <span className="font-medium">
                                      Total Items: {firstItem.itemsLength}
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 mb-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CalendarIcon className="text-muted-foreground" size={14} />
                                  <span>
                                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <FiCreditCard className="text-muted-foreground" size={14} />
                                  <span className="font-semibold text-foreground">
                                    {formatCurrency(order.totalAmount)}
                                  </span>
                                </div>
                                {order.trackingNumber && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FiTruck className="text-muted-foreground" size={14} />
                                    <span className="text-xs">{order.trackingNumber}</span>
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => openOrderDetail(order)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-sage text-white rounded-lg font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90"
                              >
                                <FiPackage size={14} />
                                View Details
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* ================= ORDER DETAIL MODAL ================= */}
      {createPortal(
        <AnimatePresence>
          {showOrderDetailModal && selectedOrder && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990]"
                onClick={() => setShowOrderDetailModal(false)}
              />
              <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-3xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                >
                <div className="bg-gradient-sage px-6 py-5 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Order Details</h2>
                    <p className="text-white/80 text-sm">
                      Order #{selectedOrder.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrderDetailModal(false)}
                    className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <FiX className="text-white" size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <FiPackage className="text-white" size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-primary font-semibold uppercase tracking-wide">
                            Status
                          </p>
                          <p className="text-base font-bold text-foreground">
                            {selectedOrder.status}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <FiCreditCard className="text-white" size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">
                            Payment
                          </p>
                          <p className={`text-base font-bold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                            {selectedOrder.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="text-white" size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">
                            Order Date
                          </p>
                          <p className="text-base font-bold text-foreground">
                            {format(new Date(selectedOrder.createdAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-secondary/50 to-secondary rounded-xl p-5 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <FiMapPin className="text-primary" size={18} />
                      <h3 className="text-base font-bold text-foreground">
                        Shipping Address
                      </h3>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">
                      {selectedOrder.shippingAddress}
                    </p>
                    {selectedOrder.trackingNumber && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <FiTruck className="text-primary" size={16} />
                          <span className="text-sm text-muted-foreground">Tracking Number:</span>
                          <span className="text-sm font-bold text-foreground">
                            {selectedOrder.trackingNumber}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground mb-3">
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => {
                        const imageUrl = getProductImageUrl(item.productImage);
                        return (
                          <div
                            key={item.id || index}
                            className="bg-background rounded-xl border border-border p-4 flex gap-4 hover:border-primary/50 transition-colors"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <FiPackage className="text-gray-400" size={24} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-base font-bold text-foreground mb-1">
                                {item.productName || "Unknown Product"}
                              </h4>
                              <p className="text-xs text-muted-foreground mb-2">
                                Product ID: #{item.productId || "N/A"}
                              </p>
                              <div className="flex items-center gap-3 text-xs">
                                {item.selectedSize && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-muted-foreground">Size:</span>
                                    <span className="font-semibold text-foreground">
                                      {item.selectedSize}
                                    </span>
                                  </div>
                                )}
                                {item.selectedColor && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-muted-foreground">Color:</span>
                                    <span className="font-semibold text-foreground">
                                      {item.selectedColor}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                  <span className="text-muted-foreground">Qty:</span>
                                  <span className="font-semibold text-foreground">
                                    {item.quantity || 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground mb-1">Price</p>
                              <p className="text-lg font-bold text-foreground">
                                {formatCurrency(item.totalPrice)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-border">
                    <h3 className="text-base font-bold text-foreground mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      {selectedOrder.discount && selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="font-semibold text-green-600">
                            -{formatCurrency(selectedOrder.discount)}
                          </span>
                        </div>
                      )}
                      {selectedOrder.tax && selectedOrder.tax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(selectedOrder.tax)}
                          </span>
                        </div>
                      )}
                      <div className="pt-3 border-t-2 border-primary flex justify-between">
                        <span className="text-base font-bold text-foreground">
                          Total Amount
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {formatCurrency(selectedOrder.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/50 px-6 py-4 flex justify-end gap-3 border-t border-border">
                  <button
                    onClick={() => setShowOrderDetailModal(false)}
                    className="px-5 py-2 bg-background hover:bg-secondary text-foreground font-semibold rounded-lg border border-border transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* ================= APPOINTMENTS MODAL ================= */}
      {createPortal(
        <AnimatePresence>
          {showAppointmentsModal && selectedUser && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990]"
                onClick={() => setShowAppointmentsModal(false)}
              />
              <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div className="glass-card rounded-2xl p-6 max-w-3xl w-full">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">
                    Appointments – {selectedUser.name}
                  </h2>
                  <FiX
                    className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowAppointmentsModal(false)}
                  />
                </div>

                {appointmentsLoading ? (
                  <p className="text-center text-muted-foreground">Loading…</p>
                ) : userAppointments.length === 0 ? (
                  <p className="text-center text-muted-foreground">No appointments found</p>
                ) : (
                  <div className="space-y-3 max-h-[60vh] overflow-auto">
                    {userAppointments.map((a) => (
                      <div key={a.id} className="glass-card p-4 rounded-xl">
                        <p className="font-semibold text-foreground">{a.serviceType}</p>
                        <p className="text-sm text-muted-foreground">
                          {a.appointmentDate} • {a.appointmentTime}
                        </p>
                        <p className="text-sm text-muted-foreground">Status: {a.status}</p>
                      </div>
                    ))}
                  </div>
                )}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};

export default AdminUsers;
