// import { useEffect, useMemo, useState } from "react";
// import { format } from "date-fns";
// import { FiRefreshCw, FiEye } from "react-icons/fi";
// import { toast } from "sonner";
// import measurementStoreApi, { type MeasurementSummary } from "../../api/measurementStoreApi";
// import { useNavigate } from "react-router-dom";

// const AdminMeasurements = () => {
//   const [items, setItems] = useState<MeasurementSummary[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     id: "",
//     gender: "",
//     bodyType: "All",
//     bmiCategory: "All",
//   });
//   const navigate = useNavigate();

//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await measurementStoreApi.adminListAll();
//       setItems(data);
//     } catch (err) {
//       toast.error("Failed to load measurements");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const filtered = useMemo(() => {
//     const matchText = (value: string, search: string) =>
//       value.toLowerCase().includes(search.trim().toLowerCase());

//     return items.filter((m) =>
//       (!filters.id || matchText(String(m.id), filters.id)) &&
//       (!filters.gender || matchText(m.gender, filters.gender)) &&
//       (filters.bodyType === "All" || matchText(m.bodyType, filters.bodyType)) &&
//       (filters.bmiCategory === "All" || matchText(m.bmiCategory, filters.bmiCategory))
//     );
//   }, [items, filters]);

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-serif">Measurements</h2>
//           <p className="text-sm text-muted-foreground">
//             {filtered.length} of {items.length} records
//           </p>
//         </div>
//         <button
//           onClick={load}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
//         >
//           <FiRefreshCw size={16} /> Refresh
//         </button>
//       </div>

//       <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//         <div className="grid grid-cols-7 gap-3 px-4 py-3 border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wide">
//           <div>Id</div>
//           <div>Gender</div>
//           <div>Body Type</div>
//           <div>Size</div>
//           <div>BMI Category</div>
//           <div>Created</div>
//           <div className="text-center">Actions</div>
//         </div>

//         <div className="grid grid-cols-7 gap-3 px-4 py-3 border-b border-gray-100 text-sm">
//           <input
//             placeholder="Search Id"
//             className="h-9 px-3 rounded border border-gray-300 bg-white text-sm placeholder:text-gray-500"
//             value={filters.id}
//             onChange={(e) => setFilters((f) => ({ ...f, id: e.target.value }))}
//           />
//           <input
//             placeholder="Search Gender"
//             className="h-9 px-3 rounded border border-gray-300 bg-white text-sm placeholder:text-gray-500"
//             value={filters.gender}
//             onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value }))}
//           />
//           <select
//             className="h-9 px-3 rounded border border-gray-300 bg-white text-sm"
//             value={filters.bodyType}
//             onChange={(e) => setFilters((f) => ({ ...f, bodyType: e.target.value }))}
//           >
//             <option value="All">All</option>
//             <option value="rectangle">Rectangle</option>
//             <option value="hourglass">Hourglass</option>
//             <option value="triangle">Triangle</option>
//             <option value="inverted_triangle">Inverted Triangle</option>
//           </select>
//           <div />
//           <select
//             className="h-9 px-3 rounded border border-gray-300 bg-white text-sm"
//             value={filters.bmiCategory}
//             onChange={(e) => setFilters((f) => ({ ...f, bmiCategory: e.target.value }))}
//           >
//             <option value="All">All</option>
//             <option value="underweight">Underweight</option>
//             <option value="normal">Normal</option>
//             <option value="overweight">Overweight</option>
//             <option value="obese">Obese</option>
//           </select>
//           <div />
//           <div />
//         </div>

//         {loading ? (
//           <p className="px-4 py-6 text-muted-foreground text-sm">Loading...</p>
//         ) : filtered.length === 0 ? (
//           <p className="px-4 py-6 text-muted-foreground text-sm">No measurements found.</p>
//         ) : (
//           <div className="divide-y divide-gray-100">
//             {filtered.map((m) => (
//               <div
//                 key={m.id}
//                 className="grid grid-cols-7 gap-3 px-4 py-4 text-sm items-center"
//               >
//                 <div className="font-semibold text-gray-800">#{m.id}</div>
//                 <div className="capitalize">{m.gender}</div>
//                 <div>{m.bodyType}</div>
//                 <div className="font-semibold text-gray-800">{m.recommendedSize}</div>
//                 <div className="text-gray-700">
//                   {m.bmiCategory}  {m.bmi.toFixed(1)}
//                 </div>
//                 <div className="flex items-center justify-between gap-3">
//                   <span className="text-gray-600">
//                     {format(new Date(m.createdAt), "dd MMM yyyy, HH:mm")}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 justify-center">
//                   <button
//                     onClick={() => navigate(`/measurements/${m.id}`)}
//                     className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-primary hover:bg-primary/5"
//                     title="View details"
//                   >
//                     <FiEye size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminMeasurements;


// import { useState, useEffect, useMemo } from "react";
// import { createPortal } from "react-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiEye,
//   FiX,
//   FiLoader,
//   FiRefreshCw,
//   FiUser,
//   FiActivity,
//   FiPercent,
//   FiScissors,
//   FiHeart,
//   FiGitBranch,  // Using FiGitBranch as alternative for ruler
//   FiArrowUp,    // Alternative icons for measurements
//   FiArrowDown,
//   FiArrowRight,
//   FiMaximize,   // For size measurements
// } from "react-icons/fi";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import measurementStoreApi, { type MeasurementSummary, type MeasurementDetail } from "../../api/measurementStoreApi";
// import { useNavigate } from "react-router-dom";

// type MeasurementDetails = MeasurementDetail;

// const AdminMeasurements = () => {
//   const [items, setItems] = useState<MeasurementSummary[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementDetails | null>(null);
  
//   // Modal states
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
  
//   // Column filters
//   const [columnFilters, setColumnFilters] = useState({
//     id: "",
//     gender: "",
//     bodyType: "",
//     bmiCategory: "",
//   });

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const navigate = useNavigate();

//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await measurementStoreApi.adminListAll();
//       setItems(data);
//     } catch (err) {
//       toast.error("Failed to load measurements");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   // Apply filters when they change
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       // Filtering is done in useMemo, just need to reset page
//       setPage(1);
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [columnFilters]);

//   const fetchMeasurementDetails = async (id: number) => {
//     setModalLoading(true);
//     setSelectedMeasurement(null);
//     setShowDetailsModal(true);
//     try {
//       const details = await measurementStoreApi.getById(id);
//       setSelectedMeasurement(details);
//     } catch (error: any) {
//       console.error("Error fetching measurement details:", error);
//       toast.error(error.response?.data?.message || "Failed to fetch measurement details");
//       setShowDetailsModal(false);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters((prev) => ({
//       ...prev,
//       [column]: value,
//     }));
//   };

//   const filtered = useMemo(() => {
//     const matchText = (value: string, search: string) =>
//       value?.toLowerCase().includes(search.trim().toLowerCase());

//     return items.filter((m) =>
//       (!columnFilters.id || matchText(String(m.id), columnFilters.id)) &&
//       (!columnFilters.gender || matchText(m.gender, columnFilters.gender)) &&
//       (!columnFilters.bodyType || columnFilters.bodyType === "All" || matchText(m.bodyType, columnFilters.bodyType)) &&
//       (!columnFilters.bmiCategory || columnFilters.bmiCategory === "All" || matchText(m.bmiCategory, columnFilters.bmiCategory))
//     );
//   }, [items, columnFilters]);

//   // Pagination
//   const paginatedItems = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     return filtered.slice(start, start + rowsPerPage);
//   }, [filtered, page, rowsPerPage]);

//   const totalPages = Math.ceil(filtered.length / rowsPerPage);
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   // Get unique options for dropdowns
//   const bodyTypeOptions = ["All", ...Array.from(new Set(items.map(m => m.bodyType)))].filter(Boolean);
//   const bmiCategoryOptions = ["All", ...Array.from(new Set(items.map(m => m.bmiCategory)))].filter(Boolean);
//   const genderOptions = ["All", ...Array.from(new Set(items.map(m => m.gender)))].filter(Boolean);

//   const getBmiColor = (category: string) => {
//     const colors: Record<string, string> = {
//       underweight: "text-blue-700 bg-blue-100",
//       normal: "text-green-700 bg-green-100",
//       overweight: "text-orange-700 bg-orange-100",
//       obese: "text-red-700 bg-red-100",
//     };
//     return colors[category?.toLowerCase()] || "text-gray-700 bg-gray-100";
//   };

//   const getBodyTypeColor = (type: string) => {
//     const colors: Record<string, string> = {
//       rectangle: "text-blue-700 bg-blue-100",
//       hourglass: "text-purple-700 bg-purple-100",
//       triangle: "text-orange-700 bg-orange-100",
//       inverted_triangle: "text-indigo-700 bg-indigo-100",
//     };
//     return colors[type?.toLowerCase()] || "text-gray-700 bg-gray-100";
//   };

//   // Function to get icon for measurement type
//   const getMeasurementIcon = (key: string) => {
//     const iconMap: Record<string, any> = {
//       bust: FiMaximize,
//       waist: FiArrowDown,
//       hips: FiArrowUp,
//       shoulderWidth: FiMaximize,
//       armLength: FiArrowRight,
//       torsoLength: FiArrowDown,
//       inseam: FiArrowDown,
//       thighCircumference: FiActivity,
//       calfCircumference: FiActivity,
//       chest: FiMaximize,
//       sleeveLength: FiArrowRight,
//       neckCircumference: FiActivity,
//     };
//     return iconMap[key] || FiGitBranch;
//   };

//   useEffect(() => {
//     const isModalOpen = showDetailsModal;
//     document.body.style.overflow = isModalOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showDetailsModal]);

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-dark-900">Measurement Management</h2>
//           <p className="text-dark-600 mt-1">{filtered.length} measurements found</p>
//         </div>

//         <div className="flex space-x-3">
//           <button
//             onClick={load}
//             className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
//           >
//             <FiRefreshCw className={loading ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* --- TABLE WITH COLUMN FILTERS --- */}
//       <div className="bg-white rounded-lg shadow overflow-x-auto">
//         <table className="min-w-full divide-y divide-dark-200">
//           <thead className="bg-dark-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>USER</span>
//                   <input
//                     type="text"
//                     placeholder="Search ID"
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.id}
//                     onChange={(e) => handleColumnFilterChange("id", e.target.value)}
//                   />
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>GENDER</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.gender}
//                     onChange={(e) => handleColumnFilterChange("gender", e.target.value)}
//                   >
//                     <option value="">All</option>
//                     {genderOptions.filter(g => g !== "All").map((gender) => (
//                       <option key={gender} value={gender}>
//                         {gender}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>BODY TYPE</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.bodyType}
//                     onChange={(e) => handleColumnFilterChange("bodyType", e.target.value)}
//                   >
//                     <option value="">All</option>
//                     {bodyTypeOptions.filter(b => b !== "All").map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>REC. SIZE</span>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>BMI CATEGORY</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-dark-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
//                     value={columnFilters.bmiCategory}
//                     onChange={(e) => handleColumnFilterChange("bmiCategory", e.target.value)}
//                   >
//                     <option value="">All</option>
//                     {bmiCategoryOptions.filter(b => b !== "All").map((category) => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>CREATED</span>
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
//                 <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                   <div className="flex flex-col items-center">
//                     <FiLoader className="animate-spin text-sage mb-2" size={24} />
//                     Loading measurements...
//                   </div>
//                 </td>
//               </tr>
//             ) : paginatedItems.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-6 py-12 text-center text-dark-500">
//                   <div className="flex flex-col items-center">
//                     <FiGitBranch className="mx-auto text-gray-400 mb-3" size={40} />
//                     <p className="text-lg font-medium mb-2">No measurements found</p>
//                     <p className="text-sm text-gray-500">
//                       {columnFilters.id || columnFilters.gender || columnFilters.bodyType || columnFilters.bmiCategory
//                         ? "Try adjusting your filters"
//                         : "No measurements have been recorded yet"}
//                     </p>
//                     {(columnFilters.id || columnFilters.gender || columnFilters.bodyType || columnFilters.bmiCategory) && (
//                       <button
//                         onClick={() => {
//                           setColumnFilters({
//                             id: "",
//                             gender: "",
//                             bodyType: "",
//                             bmiCategory: "",
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
//               paginatedItems.map((measurement) => (
//                 <tr key={measurement.id} className="hover:bg-dark-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 flex-shrink-0 mr-3 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
//                         <FiUser />
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-dark-900">
//                           #{measurement.id}
//                         </div>
//                         <div className="text-xs text-dark-500">
//                           User ID: {measurement.userId || "N/A"}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="text-sm text-dark-900 capitalize">
//                       {measurement.gender || "N/A"}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {measurement.bodyType ? (
//                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBodyTypeColor(measurement.bodyType)}`}>
//                         {measurement.bodyType}
//                       </span>
//                     ) : (
//                       <span className="text-sm text-dark-500">N/A</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="text-sm font-semibold text-dark-900">
//                       {measurement.recommendedSize || "N/A"}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {measurement.bmiCategory ? (
//                       <>
//                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBmiColor(measurement.bmiCategory)}`}>
//                           {measurement.bmiCategory}
//                         </span>
//                         <span className="text-xs text-dark-500 ml-1">
//                           ({measurement.bmi?.toFixed(1)})
//                         </span>
//                       </>
//                     ) : (
//                       <span className="text-sm text-dark-500">N/A</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-dark-500">
//                       {measurement.createdAt
//                         ? format(new Date(measurement.createdAt), "MMM dd, yyyy")
//                         : "N/A"}
//                     </div>
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-1">
//                       <button
//                         onClick={() => fetchMeasurementDetails(measurement.id)}
//                         className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
//                         title="View Details"
//                       >
//                         <FiEye size={16} />
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
//                 {filtered.length > 0 ? (page - 1) * rowsPerPage + 1 : 0}
//               </span>{" "}
//               to{" "}
//               <span className="font-medium">
//                 {Math.min(page * rowsPerPage, filtered.length)}
//               </span>{" "}
//               of <span className="font-medium">{filtered.length}</span> results
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

//       {/* --- MEASUREMENT DETAILS MODAL --- */}
//       {createPortal(
//         <AnimatePresence>
//           {showDetailsModal && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={() => setShowDetailsModal(false)}
//                 className="backdrop-overlay"
//               />
//               <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4 overflow-y-auto">
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   className="glass-card rounded-2xl p-6 ring-1 ring-[#8FAE8B] max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
//                 >
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <h2 className="text-2xl font-bold text-dark-900">
//                         Measurement #{selectedMeasurement?.id || "..."}
//                       </h2>
//                       {selectedMeasurement && (
//                         <p className="text-dark-600 mt-1">
//                           Created: {selectedMeasurement.createdAt
//                             ? format(new Date(selectedMeasurement.createdAt), "MMM dd, yyyy HH:mm")
//                             : "N/A"}
//                         </p>
//                       )}
//                     </div>
//                     <button onClick={() => setShowDetailsModal(false)}>
//                       <FiX size={24} className="text-dark-400 hover:text-dark-900" />
//                     </button>
//                   </div>

//                   {modalLoading || !selectedMeasurement ? (
//                     <div className="flex justify-center items-center py-12">
//                       <FiLoader className="animate-spin text-sage" size={40} />
//                     </div>
//                   ) : (
//                     <div className="space-y-6">
//                       {/* Summary Cards */}
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-primary-100 rounded-lg">
//                               <FiUser className="text-primary-600" size={20} />
//                             </div>
//                             <div>
//                               <p className="text-xs text-primary-600">Gender</p>
//                               <p className="text-lg font-semibold text-primary-700 capitalize">
//                                 {selectedMeasurement.gender || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-purple-100 rounded-lg">
//                               <FiActivity className="text-purple-600" size={20} />
//                             </div>
//                             <div>
//                               <p className="text-xs text-purple-600">Body Type</p>
//                               <p className="text-lg font-semibold text-purple-700 capitalize">
//                                 {selectedMeasurement.bodyType || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-blue-100 rounded-lg">
//                               <FiPercent className="text-blue-600" size={20} />
//                             </div>
//                             <div>
//                               <p className="text-xs text-blue-600">BMI</p>
//                               <p className="text-lg font-semibold text-blue-700">
//                                 {selectedMeasurement.bmi?.toFixed(1) || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="bg-green-50 rounded-xl p-4 border border-green-200">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-green-100 rounded-lg">
//                               <FiScissors className="text-green-600" size={20} />
//                             </div>
//                             <div>
//                               <p className="text-xs text-green-600">Rec. Size</p>
//                               <p className="text-lg font-semibold text-green-700">
//                                 {selectedMeasurement.recommendedSize || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* BMI Category */}
//                       <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-5 rounded-xl border border-primary-200">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="p-3 bg-white rounded-lg border border-primary-200">
//                               <FiHeart className="text-primary-600" size={24} />
//                             </div>
//                             <div>
//                               <h3 className="font-bold text-dark-900">BMI Category</h3>
//                               <p className="text-sm text-dark-600">Body Mass Index classification</p>
//                             </div>
//                           </div>
//                           <div className="flex flex-col items-end">
//                             <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getBmiColor(selectedMeasurement.bmiCategory)}`}>
//                               {selectedMeasurement.bmiCategory || "N/A"}
//                             </span>
//                             {selectedMeasurement.bmi && (
//                               <p className="text-xs text-dark-500 mt-1">
//                                 BMI Value: {selectedMeasurement.bmi.toFixed(2)}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Measurements Grid */}
//                       {selectedMeasurement.measurements && (
//                         <div>
//                           <h3 className="text-lg font-semibold text-dark-900 mb-4">Body Measurements</h3>
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {Object.entries(selectedMeasurement.measurements).map(([key, value]) => {
//                               if (!value) return null;
                              
//                               const Icon = getMeasurementIcon(key);
                              
//                               return (
//                                 <div key={key} className="bg-white rounded-xl border border-dark-200 p-4">
//                                   <div className="flex items-center gap-3">
//                                     <div className="p-2 bg-gray-100 rounded-lg">
//                                       <Icon className="text-dark-600" size={18} />
//                                     </div>
//                                     <div>
//                                       <p className="text-xs text-dark-500 capitalize">
//                                         {key.replace(/([A-Z])/g, ' $1').trim()}
//                                       </p>
//                                       <p className="text-lg font-semibold text-dark-900">
//                                         {value} cm
//                                       </p>
//                                     </div>
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       )}

//                       {/* User Information (if available) */}
//                       {selectedMeasurement.user && (
//                         <div>
//                           <h3 className="text-lg font-semibold text-dark-900 mb-4">User Information</h3>
//                           <div className="bg-white rounded-xl border border-dark-200 p-4">
//                             <div className="flex items-center gap-4">
//                               <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
//                                 <FiUser className="text-primary-600" size={24} />
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-dark-900">{selectedMeasurement.user.name}</p>
//                                 <p className="text-sm text-dark-500">{selectedMeasurement.user.email}</p>
//                                 <p className="text-xs text-dark-400 mt-1">User ID: {selectedMeasurement.user.id}</p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Action Buttons */}
//                       <div className="flex gap-3 pt-4">
//                         <button
//                           onClick={() => {
//                             setShowDetailsModal(false);
//                             navigate(`/measurements/${selectedMeasurement.id}`);
//                           }}
//                           className="flex-1 btn-primary flex items-center justify-center gap-2"
//                         >
//                           <FiEye />
//                           View Full Details
//                         </button>
//                         <button
//                           onClick={() => setShowDetailsModal(false)}
//                           className="flex-1 btn-ghost"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               </div>
//             </>
//           )}
//         </AnimatePresence>,
//         document.body
//       )}

//       <style>{`
//         .backdrop-overlay {
//           position: fixed;
//           inset: 0;
//           background: rgba(0, 0, 0, 0.48);
//           backdrop-filter: blur(2px);
//           -webkit-backdrop-filter: blur(2px);
//           z-index: 9990;
//         }
//         .glass-card {
//           @apply bg-white/95 backdrop-blur-sm;
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

// export default AdminMeasurements;



// import { useState, useEffect, useMemo } from "react";
// import { createPortal } from "react-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiEye,
//   FiX,
//   FiLoader,
//   FiRefreshCw,
//   FiUser,
//   FiActivity,
//   FiPercent,
//   FiScissors,
//   FiHeart,
//   FiGitBranch,
//   FiArrowUp,
//   FiArrowDown,
//   FiArrowRight,
//   FiMaximize,
//   FiAlertCircle,
// } from "react-icons/fi";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import measurementStoreApi, { type MeasurementSummary, type MeasurementDetail } from "../../api/measurementStoreApi";
// import { useNavigate } from "react-router-dom";

// type MeasurementDetails = MeasurementDetail;

// // Extended interface for fallback data
// interface ExtendedMeasurementDetails extends MeasurementSummary {
//   measurements?: {
//     bust?: number;
//     waist?: number;
//     hips?: number;
//     shoulderWidth?: number;
//     armLength?: number;
//     torsoLength?: number;
//     inseam?: number;
//     thighCircumference?: number;
//     calfCircumference?: number;
//     chest?: number;
//     sleeveLength?: number;
//     neckCircumference?: number;
//     // Add these fields that might be nested objects
//     [key: string]: any; // Allow for nested objects
//   };
//   user?: {
//     id: number;
//     name: string;
//     email: string;
//   };
// }

// const AdminMeasurements = () => {
//   const [items, setItems] = useState<MeasurementSummary[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedMeasurement, setSelectedMeasurement] = useState<ExtendedMeasurementDetails | null>(null);
//   const [isLimitedData, setIsLimitedData] = useState(false);
  
//   // Modal states
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
  
//   // Column filters
//   const [columnFilters, setColumnFilters] = useState({
//     id: "",
//     gender: "",
//     bodyType: "",
//     bmiCategory: "",
//   });

//   // Pagination
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const navigate = useNavigate();

//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await measurementStoreApi.adminListAll();
//       // newest first
//       const sorted = [...data].sort((a, b) => {
//         const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//         const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//         if (aDate !== bDate) return bDate - aDate;
//         return (b.id || 0) - (a.id || 0);
//       });
//       setItems(sorted);
//     } catch (err) {
//       toast.error("Failed to load measurements");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   // Apply filters when they change
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       setPage(1);
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [columnFilters]);

//   const fetchMeasurementDetails = async (id: number) => {
//     setModalLoading(true);
//     setSelectedMeasurement(null);
//     setIsLimitedData(false);
    
//     try {
//       console.log("Fetching details for measurement ID:", id);
      
//       // Try to fetch full details from API
//       const details = await measurementStoreApi.getById(id);
//       console.log("Received full details:", details);
      
//       setSelectedMeasurement(details);
//       setShowDetailsModal(true);
//     } catch (error: any) {
//       console.error("Error fetching measurement details:", error);
      
//       if (error.response?.status === 403) {
//         // If forbidden, try to use the data we already have from the list
//         const summaryItem = items.find(item => item.id === id);
        
//         if (summaryItem) {
//           console.log("Using summary data as fallback for ID:", id);
          
//           // Create a basic details object from summary
//           const fallbackDetails: ExtendedMeasurementDetails = {
//             ...summaryItem,
//             measurements: {}, // Empty measurements object as fallback
//             user: summaryItem.userId ? { 
//               id: summaryItem.userId,
//               name: `User #${summaryItem.userId}`,
//               email: "Email not available"
//             } : undefined
//           };
          
//           setSelectedMeasurement(fallbackDetails);
//           setIsLimitedData(true);
//           setShowDetailsModal(true);
          
//           // Show a warning that detailed data is not available
//           toast.warning("Showing limited data. Admin permissions required for full details.", {
//             duration: 5000,
//             icon: <FiAlertCircle className="text-yellow-500" />
//           });
//         } else {
//           toast.error("Measurement not found in the list");
//         }
//       } else {
//         toast.error(error.response?.data?.message || "Failed to fetch measurement details");
//       }
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleColumnFilterChange = (column: string, value: string) => {
//     setColumnFilters((prev) => ({
//       ...prev,
//       [column]: value,
//     }));
//   };

//   const filtered = useMemo(() => {
//     const matchText = (value: string, search: string) =>
//       value?.toLowerCase().includes(search.trim().toLowerCase());

//     return items.filter((m) =>
//       (!columnFilters.id || matchText(String(m.id), columnFilters.id)) &&
//       (!columnFilters.gender || matchText(m.gender, columnFilters.gender)) &&
//       (!columnFilters.bodyType || columnFilters.bodyType === "All" || matchText(m.bodyType, columnFilters.bodyType)) &&
//       (!columnFilters.bmiCategory || columnFilters.bmiCategory === "All" || matchText(m.bmiCategory, columnFilters.bmiCategory))
//     );
//   }, [items, columnFilters]);

//   // Pagination
//   const paginatedItems = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     return filtered.slice(start, start + rowsPerPage);
//   }, [filtered, page, rowsPerPage]);

//   const totalPages = Math.ceil(filtered.length / rowsPerPage);
//   const rowsPerPageOptions = [5, 10, 20, 50, 100];

//   // Get unique options for dropdowns
//   const bodyTypeOptions = ["All", ...Array.from(new Set(items.map(m => m.bodyType)))].filter(Boolean);
//   const bmiCategoryOptions = ["All", ...Array.from(new Set(items.map(m => m.bmiCategory)))].filter(Boolean);
//   const genderOptions = ["All", ...Array.from(new Set(items.map(m => m.gender)))].filter(Boolean);

//   const getBmiColor = (category: string) => {
//     const colors: Record<string, string> = {
//       underweight: "text-blue-700 bg-blue-100",
//       normal: "text-green-700 bg-green-100",
//       overweight: "text-orange-700 bg-orange-100",
//       obese: "text-red-700 bg-red-100",
//     };
//     return colors[category?.toLowerCase()] || "text-gray-700 bg-gray-100";
//   };

//   const getBodyTypeColor = (type: string) => {
//     const colors: Record<string, string> = {
//       rectangle: "text-blue-700 bg-blue-100",
//       hourglass: "text-purple-700 bg-purple-100",
//       triangle: "text-orange-700 bg-orange-100",
//       inverted_triangle: "text-indigo-700 bg-indigo-100",
//     };
//     return colors[type?.toLowerCase()] || "text-gray-700 bg-gray-100";
//   };

//   // Function to get icon for measurement type
//   const getMeasurementIcon = (key: string) => {
//     const iconMap: Record<string, any> = {
//       bust: FiMaximize,
//       waist: FiArrowDown,
//       hips: FiArrowUp,
//       shoulderWidth: FiMaximize,
//       armLength: FiArrowRight,
//       torsoLength: FiArrowDown,
//       inseam: FiArrowDown,
//       thighCircumference: FiActivity,
//       calfCircumference: FiActivity,
//       chest: FiMaximize,
//       sleeveLength: FiArrowRight,
//       neckCircumference: FiActivity,
//     };
//     return iconMap[key] || FiGitBranch;
//   };

//   // Function to safely render measurement value
//   const renderMeasurementValue = (value: any): string => {
//     if (value === null || value === undefined) return "N/A";
    
//     // If it's a number, format it
//     if (typeof value === 'number') {
//       return `${value.toFixed(1)} cm`;
//     }
    
//     // If it's a string, return it
//     if (typeof value === 'string') {
//       return value;
//     }
    
//     // If it's an object, stringify it or show a placeholder
//     if (typeof value === 'object') {
//       // Check if it has specific properties we want to display
//       if (value.hand_to_elbow || value.shoulder_to_elbow || value.total_length) {
//         // This is a nested measurement object - return a summary
//         return "Multiple values (click for details)";
//       }
//       return "Complex data";
//     }
    
//     return String(value);
//   };

//   // Function to check if value is a simple number (for styling)
//   const isSimpleNumber = (value: any): boolean => {
//     return typeof value === 'number';
//   };

//   // Function to recursively render nested measurements
//   const renderNestedMeasurements = (obj: any, parentKey: string = ''): JSX.Element[] => {
//     if (!obj || typeof obj !== 'object') return [];
    
//     return Object.entries(obj).map(([key, value]) => {
//       const fullKey = parentKey ? `${parentKey}.${key}` : key;
      
//       if (value && typeof value === 'object') {
//         // Recursively render nested objects
//         return (
//           <div key={fullKey} className="col-span-1 md:col-span-2 lg:col-span-3">
//             <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//               <h4 className="text-sm font-semibold text-gray-700 mb-3 capitalize">
//                 {key.replace(/([A-Z])/g, ' $1').trim()}
//               </h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {renderNestedMeasurements(value, fullKey)}
//               </div>
//             </div>
//           </div>
//         );
//       } else {
//         // Render leaf values
//         const Icon = getMeasurementIcon(key);
//         return (
//           <div key={fullKey} className="bg-white rounded-xl border border-gray-200 p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gray-100 rounded-lg">
//                 <Icon className="text-gray-600" size={18} />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 capitalize">
//                   {key.replace(/([A-Z])/g, ' $1').trim()}
//                 </p>
//                 <p className={`text-lg font-semibold ${isSimpleNumber(value) ? 'text-gray-900' : 'text-gray-600'}`}>
//                   {renderMeasurementValue(value)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       }
//     });
//   };

//   useEffect(() => {
//     const isModalOpen = showDetailsModal;
//     document.body.style.overflow = isModalOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showDetailsModal]);

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Measurement Management</h2>
//           <p className="text-gray-600 mt-1">{filtered.length} measurements found</p>
//         </div>

//         <div className="flex space-x-3">
//           <button
//             onClick={load}
//             className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
//           >
//             <FiRefreshCw className={loading ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* --- TABLE WITH COLUMN FILTERS --- */}
//       <div className="bg-white rounded-lg shadow overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>USER</span>
//                   <input
//                     type="text"
//                     placeholder="Search ID"
//                     className="mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
//                     value={columnFilters.id}
//                     onChange={(e) => handleColumnFilterChange("id", e.target.value)}
//                   />
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>GENDER</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
//                     value={columnFilters.gender}
//                     onChange={(e) => handleColumnFilterChange("gender", e.target.value)}
//                   >
//                     <option value="">All</option>
//                     {genderOptions.filter(g => g !== "All").map((gender) => (
//                       <option key={gender} value={gender}>
//                         {gender}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>BODY TYPE</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
//                     value={columnFilters.bodyType}
//                     onChange={(e) => handleColumnFilterChange("bodyType", e.target.value)}
//                   >
//                     <option value="">All</option>
//                     {bodyTypeOptions.filter(b => b !== "All").map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>REC. SIZE</span>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>BMI CATEGORY</span>
//                   <select
//                     className="mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
//                     value={columnFilters.bmiCategory}
//                     onChange={(e) => handleColumnFilterChange("bmiCategory", e.target.value)}
//                   >
//                     <option value="">All</option>
//                     {bmiCategoryOptions.filter(b => b !== "All").map((category) => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <div className="flex flex-col">
//                   <span>CREATED</span>
//                 </div>
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 ACTIONS
//               </th>
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
//                   <div className="flex flex-col items-center">
//                     <FiLoader className="animate-spin text-green-600 mb-2" size={24} />
//                     Loading measurements...
//                   </div>
//                 </td>
//               </tr>
//             ) : paginatedItems.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
//                   <div className="flex flex-col items-center">
//                     <FiGitBranch className="mx-auto text-gray-400 mb-3" size={40} />
//                     <p className="text-lg font-medium mb-2">No measurements found</p>
//                     <p className="text-sm text-gray-500">
//                       {columnFilters.id || columnFilters.gender || columnFilters.bodyType || columnFilters.bmiCategory
//                         ? "Try adjusting your filters"
//                         : "No measurements have been recorded yet"}
//                     </p>
//                     {(columnFilters.id || columnFilters.gender || columnFilters.bodyType || columnFilters.bmiCategory) && (
//                       <button
//                         onClick={() => {
//                           setColumnFilters({
//                             id: "",
//                             gender: "",
//                             bodyType: "",
//                             bmiCategory: "",
//                           });
//                         }}
//                         className="mt-4 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
//                       >
//                         Clear All Filters
//                       </button>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               paginatedItems.map((measurement) => (
//                 <tr key={measurement.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 flex-shrink-0 mr-3 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
//                         <FiUser />
//                       </div>
//                       <div>
//                         {/* <div className="text-sm font-medium text-gray-900">
//                           #{measurement.id}
//                         </div> */}
//                         <div className="text-xs text-gray-500">
//                           User ID: {measurement.userId ?? "N/A"}
//                         </div>
//                         {measurement.userName && (
//                           <div className="text-xs text-black-800">
//                             {measurement.userName}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="text-sm text-gray-900 capitalize">
//                       {measurement.gender || "N/A"}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {measurement.bodyType ? (
//                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBodyTypeColor(measurement.bodyType)}`}>
//                         {measurement.bodyType}
//                       </span>
//                     ) : (
//                       <span className="text-sm text-gray-500">N/A</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="text-sm font-semibold text-gray-900">
//                       {measurement.recommendedSize || "N/A"}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {measurement.bmiCategory ? (
//                       <>
//                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBmiColor(measurement.bmiCategory)}`}>
//                           {measurement.bmiCategory}
//                         </span>
//                         <span className="text-xs text-gray-500 ml-1">
//                           ({measurement.bmi?.toFixed(1)})
//                         </span>
//                       </>
//                     ) : (
//                       <span className="text-sm text-gray-500">N/A</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">
//                       {measurement.createdAt
//                         ? format(new Date(measurement.createdAt), "MMM dd, yyyy")
//                         : "N/A"}
//                     </div>
//                   </td>

//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-1">
//                       <button
//                         onClick={() => fetchMeasurementDetails(measurement.id)}
//                         className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
//                         title="View Details"
//                       >
//                         <FiEye size={16} />
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
//       <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
//         <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-700">Rows per page:</span>
//             <select
//               className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
//             <p className="text-sm text-gray-700">
//               Showing{" "}
//               <span className="font-medium">
//                 {filtered.length > 0 ? (page - 1) * rowsPerPage + 1 : 0}
//               </span>{" "}
//               to{" "}
//               <span className="font-medium">
//                 {Math.min(page * rowsPerPage, filtered.length)}
//               </span>{" "}
//               of <span className="font-medium">{filtered.length}</span> results
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
//               className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i + 1)}
//                 className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                   page === i + 1
//                     ? "z-10 bg-green-50 border-green-500 text-green-600"
//                     : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
//               disabled={page === totalPages}
//               className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* --- MEASUREMENT DETAILS MODAL --- */}
//       {createPortal(
//         <AnimatePresence mode="wait">
//           {showDetailsModal && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={() => setShowDetailsModal(false)}
//                 style={{
//                   position: 'fixed',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   backgroundColor: 'rgba(0, 0, 0, 0.48)',
//                   backdropFilter: 'blur(2px)',
//                   zIndex: 9990
//                 }}
//               />
//               <div style={{
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 padding: '1rem',
//                 zIndex: 9991,
//                 pointerEvents: 'none'
//               }}>
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   style={{
//                     backgroundColor: 'white',
//                     borderRadius: '1rem',
//                     padding: '1.5rem',
//                     maxWidth: '56rem',
//                     width: '100%',
//                     maxHeight: '90vh',
//                     overflowY: 'auto',
//                     boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//                     pointerEvents: 'auto'
//                   }}
//                 >
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         Measurement #{selectedMeasurement?.id || "..."}
//                       </h2>
//                       {selectedMeasurement && (
//                         <p className="text-gray-600 mt-1">
//                           Created: {selectedMeasurement.createdAt
//                             ? format(new Date(selectedMeasurement.createdAt), "MMM dd, yyyy HH:mm")
//                             : "N/A"}
//                         </p>
//                       )}
//                     </div>
//                     <button 
//                       onClick={() => setShowDetailsModal(false)}
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                       <FiX size={24} className="text-gray-400 hover:text-gray-900" />
//                     </button>
//                   </div>

//                   {/* Limited Data Warning */}
//                   {isLimitedData && (
//                     <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
//                       <FiAlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
//                       <div>
//                         <h3 className="font-semibold text-yellow-800">Limited Data Available</h3>
//                         <p className="text-sm text-yellow-700">
//                           You're viewing summary data. For full measurement details, you need admin permissions.
//                           Contact your system administrator to upgrade your access.
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {modalLoading || !selectedMeasurement ? (
//                     <div className="flex justify-center items-center py-12">
//                       <FiLoader className="animate-spin text-green-600" size={40} />
//                     </div>
//                   ) : (
//                     <div className="space-y-6">
//                       {/* Summary Cards */}
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <div className="bg-green-50 rounded-xl p-4 border border-green-200">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-green-100 rounded-lg">
//                               <FiUser className="text-green-600" size={20} />
//                             </div>
//                             <div>
//                               <p className="text-xs text-green-600">Gender</p>
//                               <p className="text-lg font-semibold text-green-700 capitalize">
//                                 {selectedMeasurement.gender || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-purple-100 rounded-lg">
//                               <FiActivity className="text-purple-600" size={20} />
//                             </div>
//                             <div>
//                               <p className="text-xs text-purple-600">Body Type</p>
//                               <p className="text-lg font-semibold text-purple-700 capitalize">
//                                 {selectedMeasurement.bodyType || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-blue-100 rounded-lg">
//                               <FiPercent className="text-blue-600" size={20} />
//                             </div>
//                             <div>
//                               <p className="text-xs text-blue-600">BMI</p>
//                               <p className="text-lg font-semibold text-blue-700">
//                                 {selectedMeasurement.bmi?.toFixed(1) || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
//                           <div className="flex items-center gap-3">
//                             <div className="p-2 bg-orange-100 rounded-lg">
//                               <FiScissors className="text-orange-600" size={20} />
//                             </div>
//                             <div>
//                               <p className="text-xs text-orange-600">Rec. Size</p>
//                               <p className="text-lg font-semibold text-orange-700">
//                                 {selectedMeasurement.recommendedSize || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                        {/* User Information */}
//                       {(selectedMeasurement.user || selectedMeasurement.userId) && (
//                         <div>
//                           <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
//                           <div className="bg-white rounded-xl border border-gray-200 p-4">
//                             <div className="flex items-center gap-4">
//                               <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
//                                 <FiUser className="text-green-600" size={24} />
//                               </div>
//                               <div className="space-y-1">
//                                 <p className="font-semibold text-gray-900">
//                                   {selectedMeasurement.user?.name || selectedMeasurement.userName || "N/A"}
//                                 </p>
//                                 <p className="text-sm text-gray-500">
//                                   {selectedMeasurement.user?.email || selectedMeasurement.userEmail || "N/A"}
//                                 </p>
//                                 {selectedMeasurement.userPhone && (
//                                   <p className="text-sm text-gray-500">
//                                     Phone: {selectedMeasurement.userPhone}
//                                   </p>
//                                 )}
//                                 {selectedMeasurement.userAddress && (
//                                   <p className="text-sm text-gray-500">
//                                     {selectedMeasurement.userAddress}
//                                   </p>
//                                 )}
//                                 <p className="text-xs text-gray-400 mt-1">
//                                   User ID: {selectedMeasurement.user?.id ?? selectedMeasurement.userId ?? "N/A"}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* BMI Category */}
//                       <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 rounded-xl border border-green-200">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="p-3 bg-white rounded-lg border border-green-200">
//                               <FiHeart className="text-green-600" size={24} />
//                             </div>
//                             <div>
//                               <h3 className="font-bold text-gray-900">BMI Category</h3>
//                               <p className="text-sm text-gray-600">Body Mass Index classification</p>
//                             </div>
//                           </div>
//                           <div className="flex flex-col items-end">
//                             <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getBmiColor(selectedMeasurement.bmiCategory)}`}>
//                               {selectedMeasurement.bmiCategory || "N/A"}
//                             </span>
//                             {selectedMeasurement.bmi && (
//                               <p className="text-xs text-gray-500 mt-1">
//                                 BMI Value: {selectedMeasurement.bmi.toFixed(2)}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Measurements Grid - Handle nested objects */}
//                       {selectedMeasurement.measurements && Object.keys(selectedMeasurement.measurements).length > 0 ? (
//                         <div>
//                           <h3 className="text-lg font-semibold text-gray-900 mb-4">Body Measurements</h3>
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {renderNestedMeasurements(selectedMeasurement.measurements)}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
//                           <FiGitBranch className="mx-auto text-gray-400 mb-2" size={32} />
//                           <p className="text-gray-600">No detailed measurements available</p>
//                           {isLimitedData && (
//                             <p className="text-sm text-gray-500 mt-1">
//                               Detailed measurements require admin permissions
//                             </p>
//                           )}
//                         </div>
//                       )}

                     

//                       {/* Action Buttons */}
//                       {/* <div className="flex gap-3 pt-4">
//                         <button
//                           onClick={() => {
//                             setShowDetailsModal(false);
//                             navigate(`/measurements/${selectedMeasurement.id}`);
//                           }}
//                           className="flex-1 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
//                         >
//                           <FiEye />
//                           View Full Details
//                         </button>
//                         <button
//                           onClick={() => setShowDetailsModal(false)}
//                           className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
//                         >
//                           Close
//                         </button>
//                       </div> */}
//                     </div>
//                   )}
//                 </motion.div>
//               </div>
//             </>
//           )}
//         </AnimatePresence>,
//         document.body
//       )}
//     </div>
//   );
// };

// export default AdminMeasurements;




import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiX,
  FiLoader,
  FiRefreshCw,
  FiUser,
  FiActivity,
  FiPercent,
  FiScissors,
  FiHeart,
  FiGitBranch,
  FiArrowUp,
  FiArrowDown,
  FiArrowRight,
  FiMaximize,
  FiAlertCircle,
} from "react-icons/fi";
import { format } from "date-fns";
import { toast } from "sonner";
import measurementStoreApi, { type MeasurementSummary, type MeasurementDetail } from "../../api/measurementStoreApi";

type MeasurementModalData =
  | MeasurementDetail
  | (MeasurementSummary & {
      user?: MeasurementDetail["user"];
    });

const AdminMeasurements = () => {
  const [items, setItems] = useState<MeasurementSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementModalData | null>(null);
  const [isLimitedData, setIsLimitedData] = useState(false);
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Column filters
  const [columnFilters, setColumnFilters] = useState({
    id: "",
    gender: "",
    bodyType: "",
    bmiCategory: "",
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = async () => {
    setLoading(true);
    try {
      const data = await measurementStoreApi.adminListAll();
      // newest first
      const sorted = [...data].sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (aDate !== bDate) return bDate - aDate;
        return (b.id || 0) - (a.id || 0);
      });
      setItems(sorted);
    } catch (err) {
      toast.error("Failed to load measurements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [columnFilters]);

  const fetchMeasurementDetails = async (id: number) => {
    setModalLoading(true);
    setSelectedMeasurement(null);
    setIsLimitedData(false);
    
    try {
      console.log("Fetching details for measurement ID:", id);
      
      // Try to fetch full details from API
      const details = await measurementStoreApi.getById(id);
      console.log("Received full details:", details);
      
      setSelectedMeasurement(details);
      setShowDetailsModal(true);
    } catch (error: any) {
      console.error("Error fetching measurement details:", error);
      
      if (error.response?.status === 403) {
        // If forbidden, try to use the data we already have from the list
        const summaryItem = items.find(item => item.id === id);
        
        if (summaryItem) {
          console.log("Using summary data as fallback for ID:", id);
          
          // Create a basic details object from summary
          const fallbackDetails: MeasurementModalData = {
            ...summaryItem,
            measurements: summaryItem.measurements ?? null,
            user: summaryItem.userId ? { 
              id: summaryItem.userId,
              name: `User #${summaryItem.userId}`,
              email: "Email not available"
            } : undefined
          };
          
          setSelectedMeasurement(fallbackDetails);
          setIsLimitedData(true);
          setShowDetailsModal(true);
          
          // Show a warning that detailed data is not available
          toast.warning("Showing limited data. Admin permissions required for full details.", {
            duration: 5000,
            icon: <FiAlertCircle className="text-yellow-500" />
          });
        } else {
          toast.error("Measurement not found in the list");
        }
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch measurement details");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const filtered = useMemo(() => {
    const matchText = (value: string, search: string) =>
      value?.toLowerCase().includes(search.trim().toLowerCase());

    return items.filter((m) =>
      (!columnFilters.id || matchText(String(m.id), columnFilters.id)) &&
      (!columnFilters.gender || matchText(m.gender, columnFilters.gender)) &&
      (!columnFilters.bodyType || columnFilters.bodyType === "All" || matchText(m.bodyType, columnFilters.bodyType)) &&
      (!columnFilters.bmiCategory || columnFilters.bmiCategory === "All" || matchText(m.bmiCategory, columnFilters.bmiCategory))
    );
  }, [items, columnFilters]);

  // Pagination
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const rowsPerPageOptions = [5, 10, 20, 50, 100];

  // Get unique options for dropdowns
  const bodyTypeOptions = ["All", ...Array.from(new Set(items.map(m => m.bodyType)))].filter(Boolean);
  const bmiCategoryOptions = ["All", ...Array.from(new Set(items.map(m => m.bmiCategory)))].filter(Boolean);
  const genderOptions = ["All", ...Array.from(new Set(items.map(m => m.gender)))].filter(Boolean);

  const getBmiColor = (category: string) => {
    const colors: Record<string, string> = {
      underweight: "text-blue-700 bg-blue-100",
      normal: "text-green-700 bg-green-100",
      overweight: "text-orange-700 bg-orange-100",
      obese: "text-red-700 bg-red-100",
    };
    return colors[category?.toLowerCase()] || "text-gray-700 bg-gray-100";
  };

  const getBodyTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      rectangle: "text-blue-700 bg-blue-100",
      hourglass: "text-purple-700 bg-purple-100",
      triangle: "text-orange-700 bg-orange-100",
      inverted_triangle: "text-indigo-700 bg-indigo-100",
    };
    return colors[type?.toLowerCase()] || "text-gray-700 bg-gray-100";
  };

  // Function to get icon for measurement type
  const getMeasurementIcon = (key: string) => {
    const iconMap: Record<string, any> = {
      bust: FiMaximize,
      waist: FiArrowDown,
      hips: FiArrowUp,
      shoulderWidth: FiMaximize,
      armLength: FiArrowRight,
      torsoLength: FiArrowDown,
      inseam: FiArrowDown,
      thighCircumference: FiActivity,
      calfCircumference: FiActivity,
      chest: FiMaximize,
      sleeveLength: FiArrowRight,
      neckCircumference: FiActivity,
    };
    return iconMap[key] || FiGitBranch;
  };

  // Function to safely render measurement value
  const renderMeasurementValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    
    // If it's a number, format it
    if (typeof value === 'number') {
      return `${value.toFixed(1)} cm`;
    }
    
    // If it's a string, return it
    if (typeof value === 'string') {
      return value;
    }
    
    // If it's an object, stringify it or show a placeholder
    if (typeof value === 'object') {
      // Check if it has specific properties we want to display
      if (value.hand_to_elbow || value.shoulder_to_elbow || value.total_length) {
        // This is a nested measurement object - return a summary
        return "Multiple values (click for details)";
      }
      return "Complex data";
    }
    
    return String(value);
  };

  // Function to check if value is a simple number (for styling)
  const isSimpleNumber = (value: any): boolean => {
    return typeof value === 'number';
  };

  // Function to recursively render nested measurements
  const renderNestedMeasurements = (obj: any, parentKey: string = '') => {
    if (!obj || typeof obj !== 'object') return [];
    
    return Object.entries(obj).map(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      
      if (value && typeof value === 'object') {
        // Recursively render nested objects
        return (
          <div key={fullKey} className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderNestedMeasurements(value, fullKey)}
              </div>
            </div>
          </div>
        );
      } else {
        // Render leaf values
        const Icon = getMeasurementIcon(key);
        return (
          <div key={fullKey} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Icon className="text-gray-600" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className={`text-lg font-semibold ${isSimpleNumber(value) ? 'text-gray-900' : 'text-gray-600'}`}>
                  {renderMeasurementValue(value)}
                </p>
              </div>
            </div>
          </div>
        );
      }
    });
  };

  useEffect(() => {
    const isModalOpen = showDetailsModal;
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDetailsModal]);

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Measurement Management</h2>
          <p className="text-gray-600 mt-1">{filtered.length} measurements found</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={load}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* --- TABLE WITH COLUMN FILTERS --- */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>USER</span>
                  <input
                    type="text"
                    placeholder="Search ID"
                    className="mt-1 px-2 py-1 text-xs border border-[#9caf88] rounded focus:outline-none focus:ring-1 focus:ring-[#6f8f63] focus:border-[#6f8f63] bg-white"
                    value={columnFilters.id}
                    onChange={(e) => handleColumnFilterChange("id", e.target.value)}
                  />
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>GENDER</span>
                  <select
                    className="mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
                    value={columnFilters.gender}
                    onChange={(e) => handleColumnFilterChange("gender", e.target.value)}
                  >
                    <option value="">All</option>
                    {genderOptions.filter(g => g !== "All").map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>BODY TYPE</span>
                  <select
                    className="mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
                    value={columnFilters.bodyType}
                    onChange={(e) => handleColumnFilterChange("bodyType", e.target.value)}
                  >
                    <option value="">All</option>
                    {bodyTypeOptions.filter(b => b !== "All").map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>REC. SIZE</span>
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>BMI CATEGORY</span>
                  <select
                    className="mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
                    value={columnFilters.bmiCategory}
                    onChange={(e) => handleColumnFilterChange("bmiCategory", e.target.value)}
                  >
                    <option value="">All</option>
                    {bmiCategoryOptions.filter(b => b !== "All").map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex flex-col">
                  <span>CREATED</span>
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FiLoader className="animate-spin text-green-600 mb-2" size={24} />
                    Loading measurements...
                  </div>
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FiGitBranch className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-lg font-medium mb-2">No measurements found</p>
                    <p className="text-sm text-gray-500">
                      {columnFilters.id || columnFilters.gender || columnFilters.bodyType || columnFilters.bmiCategory
                        ? "Try adjusting your filters"
                        : "No measurements have been recorded yet"}
                    </p>
                    {(columnFilters.id || columnFilters.gender || columnFilters.bodyType || columnFilters.bmiCategory) && (
                      <button
                        onClick={() => {
                          setColumnFilters({
                            id: "",
                            gender: "",
                            bodyType: "",
                            bmiCategory: "",
                          });
                        }}
                        className="mt-4 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((measurement) => (
                <tr key={measurement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-3 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <FiUser />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">
                          User ID: {measurement.userId ?? "N/A"}
                        </div>
                        {measurement.userName && (
                          <div className="text-xs text-black-800">
                            {measurement.userName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">
                      {measurement.gender || "N/A"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {measurement.bodyType ? (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBodyTypeColor(measurement.bodyType)}`}>
                        {measurement.bodyType}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {measurement.recommendedSize || "N/A"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {measurement.bmiCategory ? (
                      <>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBmiColor(measurement.bmiCategory)}`}>
                          {measurement.bmiCategory}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({measurement.bmi?.toFixed(1)})
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {measurement.createdAt
                        ? format(new Date(measurement.createdAt), "MMM dd, yyyy")
                        : "N/A"}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => fetchMeasurementDetails(measurement.id)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION & ROWS PER PAGE --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {filtered.length > 0 ? (page - 1) * rowsPerPage + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * rowsPerPage, filtered.length)}
              </span>{" "}
              of <span className="font-medium">{filtered.length}</span> results
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
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === i + 1
                    ? "z-10 bg-green-50 border-green-500 text-green-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* --- MEASUREMENT DETAILS MODAL --- */}
      {createPortal(
        <AnimatePresence mode="wait">
          {showDetailsModal && (
            <>
              {/* Overlay - without onClick handler */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.48)',
                  backdropFilter: 'blur(2px)',
                  zIndex: 9990
                }}
              />
              
              {/* Modal Container */}
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                zIndex: 9991,
                pointerEvents: 'none'
              }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    maxWidth: '56rem',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    pointerEvents: 'auto'
                  }}
                  // Optional: Add escape key handler
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowDetailsModal(false);
                    }
                  }}
                  // Make the modal focusable for keyboard events
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Measurement #{selectedMeasurement?.id || "..."}
                      </h2>
                      {selectedMeasurement && (
                        <p className="text-gray-600 mt-1">
                          Created: {selectedMeasurement.createdAt
                            ? format(new Date(selectedMeasurement.createdAt), "MMM dd, yyyy HH:mm")
                            : "N/A"}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => setShowDetailsModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Close"
                    >
                      <FiX size={24} className="text-gray-400 hover:text-gray-900" />
                    </button>
                  </div>

                  {/* Limited Data Warning */}
                  {isLimitedData && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                      <FiAlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h3 className="font-semibold text-yellow-800">Limited Data Available</h3>
                        <p className="text-sm text-yellow-700">
                          You're viewing summary data. For full measurement details, you need admin permissions.
                          Contact your system administrator to upgrade your access.
                        </p>
                      </div>
                    </div>
                  )}

                  {modalLoading || !selectedMeasurement ? (
                    <div className="flex justify-center items-center py-12">
                      <FiLoader className="animate-spin text-green-600" size={40} />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FiUser className="text-green-600" size={20} />
                            </div>
                            <div>
                              <p className="text-xs text-green-600">Gender</p>
                              <p className="text-lg font-semibold text-green-700 capitalize">
                                {selectedMeasurement.gender || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <FiActivity className="text-purple-600" size={20} />
                            </div>
                            <div>
                              <p className="text-xs text-purple-600">Body Type</p>
                              <p className="text-lg font-semibold text-purple-700 capitalize">
                                {selectedMeasurement.bodyType || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FiPercent className="text-blue-600" size={20} />
                            </div>
                            <div>
                              <p className="text-xs text-blue-600">BMI</p>
                              <p className="text-lg font-semibold text-blue-700">
                                {selectedMeasurement.bmi?.toFixed(1) || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <FiScissors className="text-orange-600" size={20} />
                            </div>
                            <div>
                              <p className="text-xs text-orange-600">Rec. Size</p>
                              <p className="text-lg font-semibold text-orange-700">
                                {selectedMeasurement.recommendedSize || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* User Information */}
                      {(selectedMeasurement.user || selectedMeasurement.userId) && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                          <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <FiUser className="text-green-600" size={24} />
                              </div>
                              <div className="space-y-1">
                                <p className="font-semibold text-gray-900">
                                  {selectedMeasurement.user?.name || selectedMeasurement.userName || "N/A"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {selectedMeasurement.user?.email || selectedMeasurement.userEmail || "N/A"}
                                </p>
                                {selectedMeasurement.userPhone && (
                                  <p className="text-sm text-gray-500">
                                    Phone: {selectedMeasurement.userPhone}
                                  </p>
                                )}
                                {selectedMeasurement.userAddress && (
                                  <p className="text-sm text-gray-500">
                                    {selectedMeasurement.userAddress}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  User ID: {selectedMeasurement.user?.id ?? selectedMeasurement.userId ?? "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* BMI Category */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white rounded-lg border border-green-200">
                              <FiHeart className="text-green-600" size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">BMI Category</h3>
                              <p className="text-sm text-gray-600">Body Mass Index classification</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getBmiColor(selectedMeasurement.bmiCategory)}`}>
                              {selectedMeasurement.bmiCategory || "N/A"}
                            </span>
                            {selectedMeasurement.bmi && (
                              <p className="text-xs text-gray-500 mt-1">
                                BMI Value: {selectedMeasurement.bmi.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Measurements Grid - Handle nested objects */}
                      {selectedMeasurement.measurements && Object.keys(selectedMeasurement.measurements).length > 0 ? (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Body Measurements</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {renderNestedMeasurements(selectedMeasurement.measurements)}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                          <FiGitBranch className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-gray-600">No detailed measurements available</p>
                          {isLimitedData && (
                            <p className="text-sm text-gray-500 mt-1">
                              Detailed measurements require admin permissions
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default AdminMeasurements;
