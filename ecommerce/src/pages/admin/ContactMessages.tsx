// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiEye, FiTrash2, FiX, FiSearch } from "react-icons/fi";
// import toast from "react-hot-toast";

// interface ContactMessage {
//   id: number;
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
//   createdAt: string;
// }

// const AdminContactMessages = () => {
//   // --- DATA ---
//   const [messages, setMessages] = useState<ContactMessage[]>([]);
//   const [loading, setLoading] = useState(true);

//   // --- VIEW MODAL ---
//   const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);

//   // --- COLUMN FILTERS ---
//   const [filters, setFilters] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- FETCH ---
//   const fetchMessages = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/admin/contact", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       const data = await res.json();
//       setMessages(Array.isArray(data) ? data : []);
//     } catch {
//       toast.error("Failed to load contact messages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   // --- FILTERED DATA ---
//   const filteredMessages = useMemo(() => {
//     return messages.filter((m) => {
//       return (
//         m.name.toLowerCase().includes(filters.name.toLowerCase()) &&
//         m.email.toLowerCase().includes(filters.email.toLowerCase()) &&
//         m.subject.toLowerCase().includes(filters.subject.toLowerCase()) &&
//         m.message.toLowerCase().includes(filters.message.toLowerCase())
//       );
//     });
//   }, [messages, filters]);

//   // --- PAGINATION ---
//   const paginatedMessages = useMemo(() => {
//     return filteredMessages.slice(
//       (page - 1) * rowsPerPage,
//       page * rowsPerPage
//     );
//   }, [filteredMessages, page, rowsPerPage]);

//   const totalPages = Math.ceil(filteredMessages.length / rowsPerPage);

//   // --- DELETE ---
//   const handleDelete = async (id: number) => {
//     if (!confirm("Delete this message?")) return;

//     try {
//       await fetch(`/api/admin/contact/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       toast.success("Message deleted");
//       fetchMessages();
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold">Contact Messages</h2>
//           <p className="text-gray-600 mt-1">
//             {filteredMessages.length} messages total
//           </p>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
//         <div className="overflow-x-auto flex-1">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {["Name", "Email", "Subject", "Message"].map((col) => (
//                   <th
//                     key={col}
//                     className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700"
//                   >
//                     <div className="flex flex-col">
//                       <span className="mb-1">{col}</span>
//                       <div className="flex items-center border rounded px-2">
//                         {/* <FiSearch className="text-gray-400" size={14} /> */}
//                         <input
//                           className="px-2 py-1 text-xs outline-none w-full"
//                           placeholder={`Search ${col}`}
//                           value={(filters as any)[col.toLowerCase()]}
//                           onChange={(e) =>
//                             setFilters((prev) => ({
//                               ...prev,
//                               [col.toLowerCase()]: e.target.value,
//                             }))
//                           }
//                         />
//                       </div>
//                     </div>
//                   </th>
//                 ))}
//                 {/* <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-700 w-32">
//                   Actions
//                 </th> */}
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y">
//               {loading ? (
//                 <tr>
//                   <td colSpan={5} className="text-center py-8">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : paginatedMessages.length > 0 ? (
//                 paginatedMessages.map((msg) => (
//                   <tr key={msg.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3">{msg.name}</td>
//                     <td className="px-4 py-3">{msg.email}</td>
//                     <td className="px-4 py-3">{msg.subject}</td>
//                     <td className="px-4 py-3 max-w-xs truncate">
//                       {msg.message}
//                     </td>
//                     <td className="px-4 py-3 flex gap-2">
//                       <button
//                         onClick={() => setViewMessage(msg)}
//                         className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
//                       >
//                         <FiEye />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(msg.id)}
//                         className="p-1.5 text-red-600 hover:bg-red-50 rounded"
//                       >
//                         <FiTrash2 />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="text-center py-8 text-gray-500">
//                     No messages found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex justify-between items-center px-4 py-3 border-t">
//           <div className="text-sm text-gray-600">
//             Page {page} of {totalPages || 1}
//           </div>
//           <div className="flex gap-2">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="btn-ghost"
//             >
//               Prev
//             </button>
//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage((p) => p + 1)}
//               className="btn-ghost"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* VIEW MODAL */}
//       <AnimatePresence>
//         {viewMessage && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 z-40"
//               onClick={() => setViewMessage(null)}
//             />
//             <motion.div
//               className="fixed inset-0 z-50 flex items-center justify-center p-4"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//             >
//               <div className="bg-white rounded-xl p-6 max-w-xl w-full">
//                 <div className="flex justify-between mb-4">
//                   <h3 className="text-xl font-bold">Message</h3>
//                   <button onClick={() => setViewMessage(null)}>
//                     <FiX />
//                   </button>
//                 </div>
//                 <div className="space-y-2">
//                   <p><b>Name:</b> {viewMessage.name}</p>
//                   <p><b>Email:</b> {viewMessage.email}</p>
//                   <p><b>Subject:</b> {viewMessage.subject}</p>
//                   <p className="mt-4 whitespace-pre-wrap">
//                     {viewMessage.message}
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminContactMessages;


// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiEye, FiTrash2, FiX, FiSearch } from "react-icons/fi";
// import toast from "react-hot-toast";
// import { ContactAdminApi, type ContactMessage,  } from "../../api/contactAdminApi"; // Adjust the import path as needed

// const AdminContactMessages = () => {
//   // --- DATA ---
//   const [messages, setMessages] = useState<ContactMessage[]>([]);
//   const [loading, setLoading] = useState(true);

//   // --- VIEW MODAL ---
//   const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);

//   // --- COLUMN FILTERS ---
//   const [filters, setFilters] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // --- FETCH ---
//   const fetchMessages = async () => {
//     try {
//       setLoading(true);
//       const data = await ContactAdminApi.getAllContacts();
//       setMessages(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       toast.error("Failed to load contact messages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   // --- FILTERED DATA ---
//   const filteredMessages = useMemo(() => {
//     return messages.filter((m) => {
//       return (
//         m.name.toLowerCase().includes(filters.name.toLowerCase()) &&
//         m.email.toLowerCase().includes(filters.email.toLowerCase()) &&
//         m.subject.toLowerCase().includes(filters.subject.toLowerCase()) &&
//         m.message.toLowerCase().includes(filters.message.toLowerCase())
//       );
//     });
//   }, [messages, filters]);

//   // --- PAGINATION ---
//   const paginatedMessages = useMemo(() => {
//     return filteredMessages.slice(
//       (page - 1) * rowsPerPage,
//       page * rowsPerPage
//     );
//   }, [filteredMessages, page, rowsPerPage]);

//   const totalPages = Math.ceil(filteredMessages.length / rowsPerPage);

//   // --- DELETE ---
//   const handleDelete = async (id: number) => {
//     if (!confirm("Delete this message?")) return;

//     try {
//       await ContactAdminApi.deleteContact(id);
//       toast.success("Message deleted");
//       fetchMessages(); // Refresh the list
//     } catch (error) {
//       console.error("Error deleting message:", error);
//       toast.error("Delete failed");
//     }
//   };

//   // Optional: Fetch single message for view modal (if needed)
//   const handleViewMessage = async (id: number) => {
//     try {
//       const message = await ContactAdminApi.getContactById(id);
//       setViewMessage(message);
//     } catch (error) {
//       console.error("Error fetching message details:", error);
//       toast.error("Failed to load message details");
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold">Contact Messages</h2>
//           <p className="text-gray-600 mt-1">
//             {filteredMessages.length} messages total
//           </p>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
//         <div className="overflow-x-auto flex-1">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {["Name", "Email", "Subject", "Action"].map((col) => (
//                   <th
//                     key={col}
//                     className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700"
//                   >
//                     <div className="flex flex-col">
//                       <span className="mb-1">{col}</span>
//                       {col !== "Action" && (
//                         <div className="flex items-center border rounded px-2">
//                           <input
//                             className="px-2 py-1 text-xs outline-none w-full"
//                             placeholder={`Search ${col}`}
//                             value={(filters as any)[col.toLowerCase()]}
//                             onChange={(e) =>
//                               setFilters((prev) => ({
//                                 ...prev,
//                                 [col.toLowerCase()]: e.target.value,
//                               }))
//                             }
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y">
//               {loading ? (
//                 <tr>
//                   <td colSpan={4} className="text-center py-8">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : paginatedMessages.length > 0 ? (
//                 paginatedMessages.map((msg) => (
//                   <tr key={msg.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3">{msg.name}</td>
//                     <td className="px-4 py-3">{msg.email}</td>
//                     <td className="px-4 py-3">{msg.subject}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => setViewMessage(msg)}
//                           // Alternative: If you want to fetch fresh data each time:
//                           // onClick={() => handleViewMessage(msg.id)}
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
//                           title="View full message"
//                         >
//                           <FiEye className="w-4 h-4" />
//                           {/* <span className="text-sm font-medium">View</span> */}
//                         </button>
//                         <button
//                           onClick={() => handleDelete(msg.id)}
//                           className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
//                           title="Delete message"
//                         >
//                           <FiTrash2 className="w-4 h-4" />
//                           {/* <span className="text-sm font-medium">Delete</span> */}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} className="text-center py-8 text-gray-500">
//                     No messages found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex justify-between items-center px-4 py-3 border-t">
//           <div className="text-sm text-gray-600">
//             Page {page} of {totalPages || 1}
//           </div>
//           <div className="flex gap-2">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Prev
//             </button>
//             <button
//               disabled={page === totalPages || totalPages === 0}
//               onClick={() => setPage((p) => p + 1)}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* VIEW MODAL */}
//       <AnimatePresence>
//         {viewMessage && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 z-40"
//               onClick={() => setViewMessage(null)}
//             />
//             <motion.div
//               className="fixed inset-0 z-50 flex items-center justify-center p-4"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//             >
//               <div className="bg-white rounded-xl p-6 max-w-xl w-full">
//                 <div className="flex justify-between mb-4">
//                   <h3 className="text-xl font-bold">Message Details</h3>
//                   <button 
//                     onClick={() => setViewMessage(null)}
//                     className="p-2 hover:bg-gray-100 rounded"
//                   >
//                     <FiX className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-500 mb-1">Name</p>
//                       <p className="font-medium">{viewMessage.name}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500 mb-1">Email</p>
//                       <p className="font-medium">{viewMessage.email}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Subject</p>
//                     <p className="font-medium">{viewMessage.subject}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Message</p>
//                     <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
//                       {viewMessage.message}
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Received</p>
//                     <p>{new Date(viewMessage.createdAt).toLocaleString()}</p>
//                   </div>
//                   <div className="pt-4 border-t">
//                     <p className="text-sm text-gray-500 mb-1">Message ID</p>
//                     <p className="font-mono text-sm">{viewMessage.id}</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminContactMessages;


// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiEye, FiTrash2, FiX } from "react-icons/fi";
// import toast from "react-hot-toast";
// import { ContactAdminApi, type ContactMessage } from "../../api/contactAdminApi";

// const AdminContactMessages = () => {
//   // --- DATA ---
//   const [messages, setMessages] = useState<ContactMessage[]>([]);
//   const [loading, setLoading] = useState(true);

//   // --- VIEW MODAL ---
//   const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);

//   // --- COLUMN FILTERS ---
//   const [filters, setFilters] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, _setRowsPerPage] = useState(10);

//   // --- FETCH ---
//   const fetchMessages = async () => {
//     try {
//       setLoading(true);
//       const data = await ContactAdminApi.getAllContacts();
//       setMessages(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       toast.error("Failed to load contact messages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   // --- SORT MESSAGES IN DESCENDING ORDER (NEWEST FIRST) ---
//   const sortedMessages = useMemo(() => {
//     return [...messages].sort((a, b) => {
//       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//     });
//   }, [messages]);

//   // --- FILTERED DATA ---
//   const filteredMessages = useMemo(() => {
//     return sortedMessages.filter((m) => {
//       return (
//         m.name.toLowerCase().includes(filters.name.toLowerCase()) &&
//         m.email.toLowerCase().includes(filters.email.toLowerCase()) &&
//         m.subject.toLowerCase().includes(filters.subject.toLowerCase()) &&
//         m.message.toLowerCase().includes(filters.message.toLowerCase())
//       );
//     });
//   }, [sortedMessages, filters]);

//   // --- PAGINATION ---
//   const paginatedMessages = useMemo(() => {
//     return filteredMessages.slice(
//       (page - 1) * rowsPerPage,
//       page * rowsPerPage
//     );
//   }, [filteredMessages, page, rowsPerPage]);

//   const totalPages = Math.ceil(filteredMessages.length / rowsPerPage);

//   // --- DELETE ---
//   const handleDelete = async (id: number) => {
//     if (!confirm("Delete this message?")) return;

//     try {
//       await ContactAdminApi.deleteContact(id);
//       toast.success("Message deleted");
//       fetchMessages(); // Refresh the list
//     } catch (error) {
//       console.error("Error deleting message:", error);
//       toast.error("Delete failed");
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold">Contact Messages</h2>
//           <p className="text-gray-600 mt-1">
//             {filteredMessages.length} messages total
//           </p>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
//         <div className="overflow-x-auto flex-1">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {/* Serial No Column */}
//                 <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700 w-20">
//                   <span>Sr No</span>
//                 </th>
                
//                 {/* Other Columns */}
//                 {["Name", "Email", "Subject", "Action"].map((col) => (
//                   <th
//                     key={col}
//                     className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700"
//                   >
//                     <div className="flex flex-col">
//                       <span className="mb-1">{col}</span>
//                       {col !== "Action" && (
//                         <div className="flex items-center border rounded px-2">
//                           <input
//                             className="px-2 py-1 text-xs outline-none w-full"
//                             placeholder={`Search ${col}`}
//                             value={(filters as any)[col.toLowerCase()]}
//                             onChange={(e) =>
//                               setFilters((prev) => ({
//                                 ...prev,
//                                 [col.toLowerCase()]: e.target.value,
//                               }))
//                             }
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y">
//               {loading ? (
//                 <tr>
//                   <td colSpan={5} className="text-center py-8">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : paginatedMessages.length > 0 ? (
//                 paginatedMessages.map((msg, index) => {
//                   // Calculate serial number based on current page and index
//                   const serialNumber = (page - 1) * rowsPerPage + index + 1;
                  
//                   return (
//                     <tr key={msg.id} className="hover:bg-gray-50">
//                       {/* Serial No Cell */}
//                       <td className="px-4 py-3 text-center text-gray-600 font-medium">
//                         {serialNumber}
//                       </td>
                      
//                       {/* Name */}
//                       <td className="px-4 py-3">{msg.name}</td>
                      
//                       {/* Email */}
//                       <td className="px-4 py-3">
//                         <a 
//                           href={`mailto:${msg.email}`}
//                           className="text-blue-600 hover:text-blue-800 hover:underline"
//                         >
//                           {msg.email}
//                         </a>
//                       </td>
                      
//                       {/* Subject */}
//                       <td className="px-4 py-3">{msg.subject}</td>
                      
//                       {/* Action */}
//                       <td className="px-4 py-3">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => setViewMessage(msg)}
//                             className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
//                             title="View full message"
//                           >
//                             <FiEye className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(msg.id)}
//                             className="flex items-center justify-center w-8 h-8 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
//                             title="Delete message"
//                           >
//                             <FiTrash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="text-center py-8 text-gray-500">
//                     No messages found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex justify-between items-center px-4 py-3 border-t">
//           <div className="text-sm text-gray-600">
//             Page {page} of {totalPages || 1}
//           </div>
//           <div className="flex gap-2">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Prev
//             </button>
//             <button
//               disabled={page === totalPages || totalPages === 0}
//               onClick={() => setPage((p) => p + 1)}
//               className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* VIEW MODAL */}
//       <AnimatePresence>
//         {viewMessage && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 z-40"
//               onClick={() => setViewMessage(null)}
//             />
//             <motion.div
//               className="fixed inset-0 z-50 flex items-center justify-center p-4"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//             >
//               <div className="bg-white rounded-xl p-6 max-w-xl w-full">
//                 <div className="flex justify-between mb-4">
//                   <h3 className="text-xl font-bold">Message Details</h3>
//                   <button 
//                     onClick={() => setViewMessage(null)}
//                     className="p-2 hover:bg-gray-100 rounded"
//                   >
//                     <FiX className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-500 mb-1">Name</p>
//                       <p className="font-medium">{viewMessage.name}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500 mb-1">Email</p>
//                       <p className="font-medium">
//                         <a 
//                           href={`mailto:${viewMessage.email}`}
//                           className="text-blue-600 hover:text-blue-800 hover:underline"
//                         >
//                           {viewMessage.email}
//                         </a>
//                       </p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Subject</p>
//                     <p className="font-medium">{viewMessage.subject}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Message</p>
//                     <div className="mt-2 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
//                       {viewMessage.message}
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Received</p>
//                     <p>{new Date(viewMessage.createdAt).toLocaleString()}</p>
//                   </div>
//                   {/* <div className="pt-4 border-t">
//                     <p className="text-sm text-gray-500 mb-1">Message ID</p>
//                     <p className="font-mono text-sm">{viewMessage.id}</p>
//                   </div> */}
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminContactMessages;


// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiEye, FiTrash2, FiX, FiCheck, FiClock, FiAlertCircle, FiMail } from "react-icons/fi";
// import toast from "react-hot-toast";
// import { ContactAdminApi, type ContactMessage, type ContactStatus } from "../../api/contactAdminApi";

// const AdminContactMessages = () => {
//   // --- DATA ---
//   const [messages, setMessages] = useState<ContactMessage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

//   // --- VIEW MODAL ---
//   const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);

//   // --- COLUMN FILTERS ---
//   const [filters, setFilters] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//     status: "", // Free text search for status
//   });

//   // --- PAGINATION ---
//   const [page, setPage] = useState(1);
//   const [rowsPerPage, _setRowsPerPage] = useState(10);

//   // --- FETCH ---
//   const fetchMessages = async () => {
//     try {
//       setLoading(true);
//       const data = await ContactAdminApi.getAllContacts();
//       setMessages(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       toast.error("Failed to load contact messages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   // --- HANDLE VIEW CLICK - Update status to RESOLVED when viewing ---
//   const handleViewClick = async (message: ContactMessage) => {
//     try {
//       setUpdatingStatus(message.id);
      
//       // Call the update API to mark as RESOLVED (or your "read" status)
//       await ContactAdminApi.updateContactStatus(message.id, "RESOLVED");
      
//       // Update local state
//       const updatedMessage = { ...message, status: "RESOLVED" as ContactStatus };
//       setMessages(prev => prev.map(msg => 
//         msg.id === message.id ? updatedMessage : msg
//       ));
      
//       // Open the modal with updated message
//       setViewMessage(updatedMessage);
      
//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast.error("Failed to update message status");
//       // Still open the modal even if status update fails
//       setViewMessage(message);
//     } finally {
//       setUpdatingStatus(null);
//     }
//   };

//   // --- SORT MESSAGES IN DESCENDING ORDER (NEWEST FIRST) ---
//   const sortedMessages = useMemo(() => {
//     return [...messages].sort((a, b) => {
//       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//     });
//   }, [messages]);

//   // --- FILTERED DATA ---
//   const filteredMessages = useMemo(() => {
//     return sortedMessages.filter((m) => {
//       const statusMatch = filters.status === "" || 
//         m.status.toLowerCase().includes(filters.status.toLowerCase()) ||
//         m.status.replace("_", " ").toLowerCase().includes(filters.status.toLowerCase());
      
//       return (
//         m.name.toLowerCase().includes(filters.name.toLowerCase()) &&
//         m.email.toLowerCase().includes(filters.email.toLowerCase()) &&
//         m.subject.toLowerCase().includes(filters.subject.toLowerCase()) &&
//         m.message.toLowerCase().includes(filters.message.toLowerCase()) &&
//         statusMatch
//       );
//     });
//   }, [sortedMessages, filters]);

//   // --- PAGINATION ---
//   const paginatedMessages = useMemo(() => {
//     return filteredMessages.slice(
//       (page - 1) * rowsPerPage,
//       page * rowsPerPage
//     );
//   }, [filteredMessages, page, rowsPerPage]);

//   const totalPages = Math.ceil(filteredMessages.length / rowsPerPage);

//   // --- DELETE ---
//   const handleDelete = async (id: number) => {
//     if (!confirm("Delete this message?")) return;

//     try {
//       await ContactAdminApi.deleteContact(id);
//       toast.success("Message deleted");
//       fetchMessages(); // Refresh the list
//       if (viewMessage?.id === id) {
//         setViewMessage(null);
//       }
//     } catch (error) {
//       console.error("Error deleting message:", error);
//       toast.error("Delete failed");
//     }
//   };

//   // --- STATUS BADGE COMPONENT ---
//   const StatusBadge = ({ status }: { status: ContactStatus }) => {
//     const getStatusConfig = (status: ContactStatus) => {
//       switch (status) {
//         case "PENDING":
//           return { 
//             color: "bg-yellow-100 text-yellow-800 border border-yellow-200", 
//             icon: <FiClock className="w-3 h-3" />, 
//             label: "Pending" 
//           };
//         case "IN_PROGRESS":
//           return { 
//             color: "bg-blue-100 text-blue-800 border border-blue-200", 
//             icon: <FiAlertCircle className="w-3 h-3" />, 
//             label: "In Progress" 
//           };
//         case "RESOLVED":
//           return { 
//             color: "bg-green-100 text-green-800 border border-green-200", 
//             icon: <FiCheck className="w-3 h-3" />, 
//             label: "Resolved" 
//           };
//         default:
//           return { 
//             color: "bg-gray-100 text-gray-800 border border-gray-200", 
//             icon: null, 
//             label: status 
//           };
//       }
//     };

//     const config = getStatusConfig(status);

//     return (
//       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
//         {config.icon}
//         {config.label}
//       </span>
//     );
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
//           <p className="text-gray-600 mt-1">
//             {filteredMessages.length} messages total
//           </p>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
//         <div className="overflow-x-auto flex-1">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {/* Serial No Column */}
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-700 tracking-wider w-20">
//                   <span>Sr No</span>
//                 </th>
                
//                 {/* Other Columns */}
//                 {["Name", "Email", "Subject", "Status", "Action"].map((col) => (
//                   <th
//                     key={col}
//                     className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-700 tracking-wider"
//                   >
//                     <div className="flex flex-col">
//                       <span className="mb-2">{col}</span>
//                       <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
//                         <input
//                           className="px-2 py-1 text-xs outline-none w-full bg-transparent placeholder-gray-500"
//                           placeholder={`Search ${col}`}
//                           value={(filters as any)[col.toLowerCase()]}
//                           onChange={(e) =>
//                             setFilters((prev) => ({
//                               ...prev,
//                               [col.toLowerCase()]: e.target.value,
//                             }))
//                           }
//                         />
//                       </div>
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-12">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//                       <p className="mt-3 text-gray-600">Loading messages...</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : paginatedMessages.length > 0 ? (
//                 paginatedMessages.map((msg, index) => {
//                   // Calculate serial number based on current page and index
//                   const serialNumber = (page - 1) * rowsPerPage + index + 1;
                  
//                   return (
//                     <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
//                       {/* Serial No Cell */}
//                       <td className="px-6 py-4 text-center text-gray-600 font-medium">
//                         {serialNumber}
//                       </td>
                      
//                       {/* Name */}
//                       <td className="px-6 py-4">
//                         <div className="font-medium text-gray-900">{msg.name}</div>
//                       </td>
                      
//                       {/* Email */}
//                       <td className="px-6 py-4">
//                         <a 
//                           href={`mailto:${msg.email}`}
//                           className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1"
//                         >
//                           <FiMail className="w-4 h-4" />
//                           {msg.email}
//                         </a>
//                       </td>
                      
//                       {/* Subject */}
//                       <td className="px-6 py-4">
//                         <div className="line-clamp-2 text-gray-900">{msg.subject}</div>
//                       </td>
                      
//                       {/* Status */}
//                       <td className="px-6 py-4">
//                         <StatusBadge status={msg.status} />
//                       </td>
                      
//                       {/* Action */}
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleViewClick(msg)}
//                             disabled={updatingStatus === msg.id}
//                             className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
//                               updatingStatus === msg.id
//                                 ? "bg-blue-100 text-blue-600 cursor-wait"
//                                 : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-sm"
//                             }`}
//                             title="View message (will mark as read)"
//                           >
//                             {updatingStatus === msg.id ? (
//                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                             ) : (
//                               <FiEye className="w-4 h-4" />
//                             )}
//                           </button>
//                           <button
//                             onClick={() => handleDelete(msg.id)}
//                             className="flex items-center justify-center w-9 h-9 bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-sm rounded-lg transition-all"
//                             title="Delete message"
//                           >
//                             <FiTrash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan={6} className="text-center py-12">
//                     <div className="flex flex-col items-center justify-center text-gray-500">
//                       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                         <FiMail className="w-8 h-8 text-gray-400" />
//                       </div>
//                       <p className="text-lg font-medium">No messages found</p>
//                       <p className="text-sm mt-1">Try adjusting your search filters</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
//           <div className="text-sm text-gray-600">
//             Showing {paginatedMessages.length} of {filteredMessages.length} messages
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="text-sm text-gray-600">
//               Page {page} of {totalPages || 1}
//             </div>
//             <div className="flex gap-2">
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="px-4 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Previous
//               </button>
//               <button
//                 disabled={page === totalPages || totalPages === 0}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="px-4 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* VIEW MODAL - Reduced Size */}
//       <AnimatePresence>
//         {viewMessage && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 z-40"
//               onClick={() => setViewMessage(null)}
//             />
//             <motion.div
//               className="fixed inset-0 z-50 flex items-center justify-center p-4"
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//             >
//               <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
//                 {/* Modal Header - Compact */}
//                 <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <FiMail className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-gray-900">Message Details</h3>
//                       <div className="flex items-center gap-2 mt-0.5">
//                         <StatusBadge status={viewMessage.status} />
//                         <span className="text-xs text-gray-500">
//                           ID: #{viewMessage.id}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <button 
//                     onClick={() => setViewMessage(null)}
//                     className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <FiX className="w-5 h-5 text-gray-500" />
//                   </button>
//                 </div>

//                 {/* Modal Content - Compact */}
//                 <div className="flex-1 overflow-y-auto p-4">
//                   <div className="space-y-4">
//                     {/* Sender Info - Compact */}
//                     <div className="bg-gray-50 rounded-lg p-3">
//                       <h4 className="font-medium text-gray-900 mb-2 text-sm">Sender Information</h4>
//                       <div className="space-y-2">
//                         <div>
//                           <label className="block text-xs text-gray-500 mb-1">Name</label>
//                           <div className="p-2 bg-white rounded border border-gray-200">
//                             <p className="text-gray-900 font-medium">{viewMessage.name}</p>
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-500 mb-1">Email</label>
//                           <a 
//                             href={`mailto:${viewMessage.email}?subject=Re: ${viewMessage.subject}`}
//                             className="block p-2 bg-white rounded border border-gray-200 hover:bg-blue-50 transition-colors"
//                           >
//                             <div className="flex items-center gap-1.5">
//                               <FiMail className="w-3.5 h-3.5 text-blue-600" />
//                               <span className="text-blue-600 text-sm font-medium">{viewMessage.email}</span>
//                             </div>
//                           </a>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Subject */}
//                     <div>
//                       <label className="block text-xs text-gray-500 mb-1 uppercase">Subject</label>
//                       <div className="p-3 bg-gray-50 rounded-lg border-l-2 border-blue-500">
//                         <h2 className="font-semibold text-gray-900">{viewMessage.subject}</h2>
//                       </div>
//                     </div>

//                     {/* Message */}
//                     <div>
//                       <label className="block text-xs text-gray-500 mb-1 uppercase">Message</label>
//                       <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                         <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
//                           {viewMessage.message}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Metadata - Compact */}
//                     <div className="bg-gray-50 rounded-lg p-3">
//                       <h4 className="font-medium text-gray-900 mb-2 text-sm">Message Details</h4>
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2">
//                           <FiClock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
//                           <div>
//                             <p className="text-xs text-gray-500">Received</p>
//                             <p className="text-sm text-gray-900 font-medium">
//                               {new Date(viewMessage.createdAt).toLocaleDateString('en-US', {
//                                 month: 'short',
//                                 day: 'numeric',
//                                 year: 'numeric',
//                                 hour: '2-digit',
//                                 minute: '2-digit'
//                               })}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="pt-2 border-t border-gray-200">
//                           <p className="text-xs text-gray-500 mb-1">Status</p>
//                           <div className="flex items-center gap-2">
//                             <StatusBadge status={viewMessage.status} />
//                             <span className="text-xs text-gray-600">
//                               {viewMessage.status === "RESOLVED" ? "Marked as read" : "Pending"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Modal Footer - Simple */}
//                 <div className="p-4 border-t border-gray-200 bg-gray-50">
//                   <div className="flex justify-end">
//                     <button
//                       onClick={() => setViewMessage(null)}
//                       className="px-4 py-2 text-sm text-gray-700 hover:bg-white hover:shadow rounded-lg transition-colors font-medium"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default AdminContactMessages;



import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiX, FiCheck, FiClock, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import { ContactAdminApi, type ContactMessage, type ContactStatus } from "../../api/contactAdminApi";

const AdminContactMessages = () => {
  // --- DATA ---
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // --- VIEW MODAL ---
  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null);

  // --- COLUMN FILTERS ---
  const [columnFilters, setColumnFilters] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    status: "",
  });

  // --- PAGINATION ---
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- FETCH ---
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await ContactAdminApi.getAllContacts();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // --- HANDLE VIEW CLICK - Update status to RESOLVED when viewing ---
  const handleViewClick = async (message: ContactMessage) => {
    try {
      setUpdatingStatus(message.id);
      
      // Call the update API to mark as RESOLVED (or your "read" status)
      await ContactAdminApi.updateContactStatus(message.id, "RESOLVED");
      
      // Update local state
      const updatedMessage = { ...message, status: "RESOLVED" as ContactStatus };
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? updatedMessage : msg
      ));
      
      // Open the modal with updated message
      setViewMessage(updatedMessage);
      
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update message status");
      // Still open the modal even if status update fails
      setViewMessage(message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // --- SORT MESSAGES IN DESCENDING ORDER (NEWEST FIRST) ---
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [messages]);

  // --- FILTERED DATA ---
  const filteredMessages = useMemo(() => {
    return sortedMessages.filter((m) => {
      const statusMatch = columnFilters.status === "" || 
        m.status.toLowerCase().includes(columnFilters.status.toLowerCase()) ||
        m.status.replace("_", " ").toLowerCase().includes(columnFilters.status.toLowerCase());
      
      return (
        m.name.toLowerCase().includes(columnFilters.name.toLowerCase()) &&
        m.email.toLowerCase().includes(columnFilters.email.toLowerCase()) &&
        m.subject.toLowerCase().includes(columnFilters.subject.toLowerCase()) &&
        m.message.toLowerCase().includes(columnFilters.message.toLowerCase()) &&
        statusMatch
      );
    });
  }, [sortedMessages, columnFilters]);

  // --- PAGINATION ---
  const paginatedMessages = useMemo(() => {
    return filteredMessages.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );
  }, [filteredMessages, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredMessages.length / rowsPerPage);


  // --- STATUS BADGE COMPONENT ---
  const StatusBadge = ({ status }: { status: ContactStatus }) => {
    const getStatusConfig = (status: ContactStatus) => {
      switch (status) {
        case "PENDING":
          return { 
            color: "bg-yellow-100 text-yellow-800 border border-yellow-200", 
            icon: <FiClock className="w-3 h-3" />, 
            label: "Pending" 
          };
        case "RESOLVED":
          return { 
            color: "bg-green-100 text-green-800 border border-green-200", 
            icon: <FiCheck className="w-3 h-3" />, 
            label: "Resolved" 
          };
        default:
          return { 
            color: "bg-gray-100 text-gray-800 border border-gray-200", 
            icon: null, 
            label: status 
          };
      }
    };

    const config = getStatusConfig(status);

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // --- COLUMN FILTER HANDLER ---
  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setPage(1);
  };

  // --- ROWS PER PAGE OPTIONS ---
  const rowsPerPageOptions = [5, 10, 20, 50, 100];

  return (
    <div className="h-full flex flex-col">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-dark-900">Contact Messages</h2>
          <p className="text-dark-600 mt-1">
            {filteredMessages.length} messages total
          </p>
        </div>
      </div>

      {/* --- SEARCH BAR (LIKE REFERENCE IMAGE) --- */}
      {/* <div className="mb-6">
        <div className="
          flex items-center space-x-2 p-3
          bg-white
          border-2 border-slate-400
          rounded-lg
          shadow-sm
          focus-within:border-[#8FAE8B]
          focus-within:ring-2 focus-within:ring-[#8FAE8B]/30
        ">
          <FiSearch className="text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search messages..."
            className="flex-1 bg-transparent border-none focus:outline-none text-dark-900 placeholder-gray-500"
            value={columnFilters.name}
            onChange={(e) => handleColumnFilterChange("name", e.target.value)}
          />
          {columnFilters.name && (
            <button
              onClick={() => handleColumnFilterChange("name", "")}
              className="text-gray-500 hover:text-dark-700"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div> */}

      {/* --- MAIN CONTENT WITH SCROLLABLE TABLE --- */}
      <div className="flex-1 flex flex-col min-h-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-8">Loading...</div>
          </div>
        ) : (
          <>
            {/* MESSAGES TABLE */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                          Sr. No.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                          <div className="flex flex-col">
                            <span className="mb-1">Name</span>
                            <input
                              type="text"
                              placeholder="Search Name"
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                              value={columnFilters.name}
                              onChange={(e) => handleColumnFilterChange("name", e.target.value)}
                            />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">
                          <div className="flex flex-col">
                            <span className="mb-1">Email</span>
                            <input
                              type="text"
                              placeholder="Search Email"
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                              value={columnFilters.email}
                              onChange={(e) => handleColumnFilterChange("email", e.target.value)}
                            />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                          <div className="flex flex-col">
                            <span className="mb-1">Subject</span>
                            <input
                              type="text"
                              placeholder="Search Subject"
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                              value={columnFilters.subject}
                              onChange={(e) => handleColumnFilterChange("subject", e.target.value)}
                            />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                          <div className="flex flex-col">
                            <span className="mb-1">Status</span>
                            <input
                              type="text"
                              placeholder="Search Status"
                              className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
                              value={columnFilters.status}
                              onChange={(e) => handleColumnFilterChange("status", e.target.value)}
                            />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedMessages.length > 0 ? (
                        paginatedMessages.map((msg, index) => (
                          <tr key={msg.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {(page - 1) * rowsPerPage + index + 1}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">
                                {msg.name}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <a 
                                href={`mailto:${msg.email}`}
                                className="text-blue-600 hover:text-blue-900 hover:underline font-medium flex items-center gap-1 text-sm"
                              >
                                <FiMail className="w-4 h-4" />
                                {msg.email}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 max-w-[200px]">
                              <div className="truncate">
                                {msg.subject}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={msg.status as ContactStatus} />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleViewClick(msg)}
                                  disabled={updatingStatus === msg.id}
                                  className={`p-1.5 rounded ${updatingStatus === msg.id ? "bg-blue-100 text-blue-600 cursor-wait" : "text-blue-600 hover:text-blue-900 hover:bg-blue-50"}`}
                                  title="View message (will mark as read)"
                                >
                                  {updatingStatus === msg.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                  ) : (
                                    <FiEye size={16} />
                                  )}
                                </button>
                                {/* <button
                                  onClick={() => handleDelete(msg.id)}
                                  className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                  title="Delete message"
                                >
                                  <FiTrash2 size={16} />
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            {loading ? "Loading messages..." : "No messages found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* --- PAGINATION & ROWS PER PAGE --- */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Rows per page:</span>
                  <select
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#8FAE8B] focus:border-[#8FAE8B]"
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
                      {(page - 1) * rowsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(page * rowsPerPage, filteredMessages.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredMessages.length}
                    </span>{" "}
                    results
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
                          ? "z-10 bg-[#8FAE8B]/10 border-[#8FAE8B] text-[#8FAE8B]"
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
          </>
        )}
      </div>

      {/* --- VIEW MODAL --- */}
      <AnimatePresence>
        {viewMessage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewMessage(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto custom-scrollbar border border-gray-200"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FiMail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Message Details</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StatusBadge status={viewMessage.status as ContactStatus} />
                          <span className="text-xs text-gray-500">
                            ID: #{viewMessage.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setViewMessage(null)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Sender Info */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Sender Information</h4>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Name</label>
                          <div className="p-2 bg-white rounded border border-gray-200">
                            <p className="text-gray-900 font-medium">{viewMessage.name}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Email</label>
                          <a 
                            href={`mailto:${viewMessage.email}?subject=Re: ${viewMessage.subject}`}
                            className="block p-2 bg-white rounded border border-gray-200 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-center gap-1.5">
                              <FiMail className="w-3.5 h-3.5 text-blue-600" />
                              <span className="text-blue-600 text-sm font-medium">{viewMessage.email}</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 uppercase">Subject</label>
                      <div className="p-3 bg-gray-50 rounded-lg border-l-2 border-blue-500">
                        <h2 className="font-semibold text-gray-900">{viewMessage.subject}</h2>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 uppercase">Message</label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {viewMessage.message}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Message Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FiClock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Received</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {new Date(viewMessage.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={viewMessage.status as ContactStatus} />
                            <span className="text-xs text-gray-600">
                              {viewMessage.status === "RESOLVED" ? "Marked as read" : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setViewMessage(null)}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        /* Custom scrollbar for modal */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #c1c1c1;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #a0a0a0;
        }
      `}</style>
    </div>
  );
};

export default AdminContactMessages;