// import { useState, useMemo, useEffect } from "react";
// import {
//   format,
//   startOfWeek,
//   addDays,
//   subDays,
//   isSameDay,
//   addWeeks,
//   subWeeks,
//   addMonths,
//   subMonths,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   getDay
// } from "date-fns";
// // import { ChevronLeft, ChevronRight } from "lucide-react";
// // import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import appointmentApi from "../../api/appointmentApi";
// import toast from "react-hot-toast";

// const cn = (...c: any[]) => c.filter(Boolean).join(" ");

// type ViewMode = "month" | "week" | "day";

// interface Appointment {
//   id: number;
//   name: string;
//   service: string;
//   date: Date;
//   time: string;
//   status: string;
// }

// // STATUS COLORS – DARK THEME
// const statusUI: any = {
//   pending: { color: "text-yellow-400", bg: "bg-yellow-400/20", border: "border-yellow-500" },
//   scheduled: { color: "text-blue-400", bg: "bg-blue-400/20", border: "border-blue-500" },
//   completed: { color: "text-green-400", bg: "bg-green-400/20", border: "border-green-500" },
//   cancelled: { color: "text-red-400", bg: "bg-red-400/20", border: "border-red-500" },
// };

// const AppointmentCard = ({
//   appt,
//   onApprove,
//   onReject,
// }: {
//   appt: Appointment;
//   onApprove: (id: number) => void;
//   onReject: (id: number) => void;
// }) => {
//   const ui = statusUI[appt.status] || statusUI.pending;

//   return (
//     <div
//       className={cn(
//         "rounded-md border-l-4 p-2 bg-dark-800 shadow-sm flex justify-between items-start gap-2",
//         ui.border
//       )}
//     >
//       {/* LEFT INFO */}
//       <div className="min-w-0">
//         <p className="text-[11px] text-dark-500 font-bold">{appt.time}</p>

//         <p className="font-semibold text-dark-800 text-sm truncate">
//           {appt.name}
//         </p>

//         <p className="text-[11px] text-dark-600 truncate">
//           {appt.service}
//         </p>

//         <span
//           className={cn(
//             "text-[10px] px-2 py-0.5 rounded font-semibold mt-1 inline-block",
//             ui.bg,
//             ui.color
//           )}
//         >
//           {appt.status.toUpperCase()}
//         </span>
//       </div>

//       {/* RIGHT ACTIONS (ONLY FOR PENDING) */}
//       {appt.status === "pending" && (
//         <div className="flex flex-col gap-2 pt-1">
//           {/* APPROVE */}
//           <button
//             onClick={() => onApprove(appt.id)}
//             className="text-green-500 hover:text-green-600 text-sm"
//             title="Approve"
//           >
//             ✓
//           </button>

//           {/* REJECT */}
//           <button
//             onClick={() => onReject(appt.id)}
//             className="text-red-500 hover:text-red-600 text-sm"
//             title="Reject"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default function AdminAppointment() {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Pagination
//   // const [page, setPage] = useState(0);
//   // const [totalPages, setTotalPages] = useState(1);

//   // Search
//   const [search, setSearch] = useState("");

//   // Calendar
//   const [viewMode, setViewMode] = useState<ViewMode>("week");
//   const [currentDate, setCurrentDate] = useState(new Date());

//   const loadAppointments = async () => {
//     try {
//       setLoading(true);
//       const res = await appointmentApi.getAllAppointments(0, 50);

//       const mapped = res.content.map((a: any) => ({
//         id: a.id,
//         name: a.name,
//         service: a.serviceType?.replace(/_/g, " ") || "SERVICE",
//         date: new Date(a.appointmentDate),
//         time: format(new Date(`2000-01-01T${a.appointmentTime}`), "hh:mm a"),
//         status: a.status?.toLowerCase() || "pending"
//       }));

//       setAppointments(mapped);
//       // setTotalPages(res.totalPages);
//     } catch {
//       toast.error("Failed to load appointments");
//     } finally {
//       setLoading(false);
//     }
//   };
// const handleApprove = async (id: number) => {
//   try {
//     const updated = await appointmentApi.approveAppointment(id);

//     setAppointments(prev =>
//       prev.map(a =>
//         a.id === id
//           ? { ...a, status: updated.status.toLowerCase() }
//           : a
//       )
//     );

//     toast.success("Appointment confirmed");
//   } catch {
//     toast.error("Failed to confirm appointment");
//   }
// };

// const handleReject = async (id: number) => {
//   try {
//     const updated = await appointmentApi.rejectAppointment(id);

//     setAppointments(prev =>
//       prev.map(a =>
//         a.id === id
//           ? { ...a, status: updated.status.toLowerCase() }
//           : a
//       )
//     );

//     toast.success("Appointment rejected");
//   } catch {
//     toast.error("Failed to reject appointment");
//   }
// };

//   useEffect(() => { loadAppointments(); }, []);

//   // -------- Calendar Logic ----------
//   const weekStart = startOfWeek(currentDate);
//   const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

//   const monthStart = startOfMonth(currentDate);
//   const monthEnd = endOfMonth(currentDate);
//   const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
//   const startPadding = getDay(monthStart);
//   const paddedMonth = [...Array(startPadding).fill(null), ...monthDays];

// const timeSlots = [
//   "09:00","10:00","11:00",
//   "12:00","13:00","14:00",
//   "15:00","16:00","17:00",
// ];

//   const filtered = useMemo(() => {
//     let data = appointments;

//     if (search.trim() !== "") {
//       data = data.filter(a =>
//         a.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     return data;
//   }, [appointments, search]);

// const navigate = (dir: "prev" | "next") => {
//   setCurrentDate(prev => {
//     if (viewMode === "month") {
//       return dir === "next" ? addMonths(prev, 1) : subMonths(prev, 1);
//     }

//     if (viewMode === "week") {
//       return dir === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1);
//     }

//     // ✅ DAY VIEW — FIX
//     return dir === "next" ? addDays(prev, 1) : subDays(prev, 1);
//   });
// };


//   if (loading)
//     return <div className="p-10 text-white text-center">Loading calendar…</div>;


//   return (
//     <div className="bg-white border border-[#8FAE8B]/40 rounded-2xl shadow overflow-hidden">

//       {/* HEADER */}
// <div className="flex items-center justify-between p-4 border-b border-[#8FAE8B]/40 bg-[#F6F8F4] rounded-t-2xl">

//   {/* LEFT SIDE CONTROLS */}
//   <div className="flex items-center gap-2">

// {/* PREVIOUS */}
// {/* PREVIOUS */}
// <button
//   onClick={() => navigate("prev")}
//  className="h-9 w-6 flex items-center justify-center border border-[#8FAE8B] 
//            hover:bg-[#8FAE8B]/10 rounded text-dark-800 text-3xl leading-none"

// >
//   ‹
// </button>

// {/* NEXT */}
// <button
//   onClick={() => navigate("next")}
//   className="h-9 w-6 flex items-center justify-center border border-[#8FAE8B] 
//            hover:bg-[#8FAE8B]/10 rounded text-dark-800 text-3xl leading-none"
// >
//   ›
// </button>

//     {/* TODAY */}
//     <button
//   onClick={() => setCurrentDate(new Date())}
//   className="h-9 px-4 flex items-center justify-center border border-[#8FAE8B] 
//            hover:bg-[#8FAE8B]/10 rounded text-dark-800 text-xl leading-none"
// >
//   TODAY
// </button>

//     {/* DATE TITLE */}
//     <h2 className="text-dark-800 ml-4 text-lg font-semibold">
//       {viewMode === "week"
//         ? `${format(weekStart,"MMM d")} - ${format(addDays(weekStart,6),"d, yyyy")}`
//         : viewMode === "month"
//         ? format(currentDate,"MMMM yyyy")
//         : format(currentDate,"MMMM d, yyyy")}
//     </h2>
//   </div>

//   {/* MIDDLE SEARCH */}
//   <div className="flex items-center bg-white border border-[#8FAE8B] text-dark-800
//  rounded px-3 w-[300px]">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="w-9 h-9 text-gray-400 mr-2"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//         d="M21 21l-4.35-4.35m1.1-5.4a7.5 7.5 0 11-15.001.001A7.5 7.5 0 0117.75 11.25z"/>
//     </svg>

//     <input
//       placeholder="Search customer..."
//       value={search}
//       onChange={(e)=>setSearch(e.target.value)}
//       className="bg-transparent outline-none text-white w-full placeholder-gray-400"
//     />
//   </div>

//   {/* VIEW TOGGLE */}
//   <div className="flex border border-gray-600 rounded overflow-hidden">
//     {["month","week","day"].map(mode => (
//       <button
//         key={mode}
//         onClick={() => setViewMode(mode as ViewMode)}
//         className={`
//           px-4 py-1 text-sm font-medium
//           ${viewMode === mode
//   ? "bg-[#8FAE8B] text-white"
//   : "text-dark-700 hover:bg-[#8FAE8B]/10"
// }
//         `}
//       >
//         {mode}
//       </button>
//     ))}
//   </div>
// </div>

//       {/* ---------------- MONTH ---------------- */}
//       {viewMode === "month" && (
//         <div className="grid grid-cols-7">
//           {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
//             <div className="p-2 text-center text-dark-600 border-b border-[#8FAE8B]/30 bg-[#F6F8F4] text-xs font-semibold">
//               {d}
//             </div>
//           ))}

//           {paddedMonth.map((day,i)=>{
//             if(!day) return <div key={i} className="border border-[#8FAE8B]/30 h-[140px]" />;

//             const list = filtered.filter(a=>isSameDay(a.date, day));

//             return (
//               <div key={i} className="border border-[#8FAE8B]/30 p-2 h-[140px] overflow-auto">
//                 <p className="text-xs text-dark-800 mb-1 font-bold">{format(day,"d")}</p>

//                 {list.map(a=>(
//                   <AppointmentCard
//   key={a.id}
//   appt={a}
//   onApprove={handleApprove}
//   onReject={handleReject}
// />

//                 ))}
//               </div>
//             );
//           })}
//         </div>
//       )}


//       {/* ---------------- WEEK ---------------- */}
//       {viewMode === "week" && (
//         <div className="overflow-x-auto">
//           <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-700 bg-dark-800">
//             <div className="p-2 text-xs text-gray-400 border-r">Time</div>

//             {weekDays.map(d=>(
//               <div key={String(d)} className="p-2 text-center text-xs font-semibold border-r text-white">
//                 {format(d,"EEE d")}
//               </div>
//             ))}
//           </div>

//           {timeSlots.map(slot=>(
//   <div
//     key={slot}
//     className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-700 h-[140px]"
//   >
//     <div className="p-2 text-xs text-gray-400 border-r flex items-start">
//       {slot}
//     </div>

//     {weekDays.map(day => {
//       const list = filtered.filter(a =>
//         isSameDay(a.date, day) && a.time === slot
//       );

//       return (
//         <div
//           key={String(day)}
//           className="p-2 border-r border-gray-700 h-[140px] overflow-y-auto space-y-2"
//         >
//           {list.map(a => (
//             <AppointmentCard
//   key={a.id}
//   appt={a}
//   onApprove={handleApprove}
//   onReject={handleReject}
// />
//           ))}
//         </div>
//       );
//     })}
//   </div>
// ))}
//         </div>
//       )}


//       {/* ---------------- DAY ---------------- */}
//       {viewMode === "day" && (
//         <div className="p-4">
//           <h3 className="text-white text-lg mb-2">
//             {format(currentDate,"EEEE, MMM dd")}
//           </h3>

//           {timeSlots.map(slot=>{
//             const list = filtered.filter(a =>
//               isSameDay(a.date,currentDate) && a.time === slot
//             );

//             return (
//               <div key={slot} className="border border-[#8FAE8B]/30 rounded p-3 mb-2">
//                 <p className="text-xs text-gray-400 mb-2">{slot}</p>

//                 {list.length === 0 && (
//                   <p className="text-gray-500 text-xs">No appointment</p>
//                 )}

//                 {list.map(a=>(
//                   <AppointmentCard
//   key={a.id}
//   appt={a}
//   onApprove={handleApprove}
//   onReject={handleReject}
// />

//                 ))}
//               </div>
//             );
//           })}
//         </div>
//       )}


//       {/* ---------------- PAGINATION ---------------- */}
//       <div className="flex justify-between p-4 border-t border-gray-700 text-white">

//         {/* <button
//           disabled={page===0}
//           onClick={()=>setPage(p=>p-1)}
//           className="px-4 py-2 border border-gray-600 rounded disabled:opacity-40"
//         >
//           Prev
//         </button> */}

//         {/* <span>Page {page+1} / {totalPages}</span> */}

//         {/* <button
//           disabled={page+1>=totalPages}
//           onClick={()=>setPage(p=>p+1)}
//           className="px-4 py-2 border border-gray-600 rounded disabled:opacity-40"
//         >
//           Next
//         </button> */}

//       </div>
//     </div>
//   );
// }












// import { useEffect, useMemo, useState } from "react";
// import {
//   format,
//   startOfWeek,
//   addDays,
//   subDays,
//   addWeeks,
//   subWeeks,
//   addMonths,
//   subMonths,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   isSameDay,
//   getDay,
// } from "date-fns";
// import { Lock, X } from "lucide-react";
// import toast from "react-hot-toast";

// import appointmentApi from "../../api/appointmentApi";
// import adminAvailabilityApi from "../../api/adminAvailabilityApi";
// import type { AdminAvailability } from "../../api/adminAvailabilityApi";

// /* -------------------------------- TYPES -------------------------------- */

// type ViewMode = "month" | "week" | "day";

// interface Appointment {
//   id: number;
//   name: string;
//   service: string;
//   date: Date;
//   time: string; // HH:mm
//   status: string;
// }

// const cn = (...c: any[]) => c.filter(Boolean).join(" ");

// const statusUI: any = {
//   pending: { color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-500" },
//   confirmed: { color: "text-green-600", bg: "bg-green-100", border: "border-green-500" },
//   completed: { color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-500" },
//   cancelled: { color: "text-red-600", bg: "bg-red-100", border: "border-red-500" },
// };

// /* --------------------------- BUSINESS RULES ----------------------------- */

// // ✅ Admin can block ONLY today → next 7 days
// const isBlockAllowed = (date: Date) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const max = new Date(today);
//   max.setDate(today.getDate() + 7);

//   return date >= today && date <= max;
// };

// /* --------------------------- BLOCK INDICATOR ---------------------------- */

// const BlockedIndicator = ({
//   availability,
//   onRemove,
// }: {
//   availability: AdminAvailability;
//   onRemove: (id: number) => void;
// }) => (
//   <div className="bg-red-50 border-l-4 border-red-500 rounded p-2 text-xs mb-1">
//     <div className="flex justify-between items-center">
//       <span className="font-semibold text-red-700 flex items-center gap-1">
//         <Lock className="w-3 h-3" />
//         {availability.isFullDayBlocked
//           ? "Full day blocked"
//           : `${availability.blockedTimeStart} – ${availability.blockedTimeEnd}`}
//       </span>
//       <button onClick={() => onRemove(availability.id)}>
//         <X className="w-3 h-3 text-red-600" />
//       </button>
//     </div>
//     {availability.reason && (
//       <p className="text-red-600 mt-1">{availability.reason}</p>
//     )}
//   </div>
// );

// /* ----------------------------- MODAL ------------------------------------ */

// const AvailabilityModal = ({
//   open,
//   date,
//   onClose,
//   onSubmit,
// }: any) => {
//   const [fullDay, setFullDay] = useState(true);
//   const [start, setStart] = useState("10:00");
//   const [end, setEnd] = useState("11:00");
//   const [reason, setReason] = useState("");

//   if (!open) return null;

//   const submit = () => {
//     if (!fullDay && start >= end) {
//       toast.error("End time must be after start time");
//       return;
//     }

//     onSubmit({
//       blockedDate: date,
//       isFullDayBlocked: fullDay,
//       blockedTimeStart: fullDay ? null : start,
//       blockedTimeEnd: fullDay ? null : end,
//       reason: reason || null,
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-xl w-[420px] p-6 space-y-4">
//         <h3 className="font-semibold text-lg">Block Availability</h3>

//         <p className="text-sm text-gray-600">
//           {format(new Date(date), "EEEE, MMM dd yyyy")}
//         </p>

//         <label className="flex gap-2 text-sm">
//           <input
//             type="checkbox"
//             checked={fullDay}
//             onChange={(e) => setFullDay(e.target.checked)}
//           />
//           Block full day
//         </label>

//         {!fullDay && (
//           <div className="grid grid-cols-2 gap-3">
//             <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
//             <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
//           </div>
//         )}

//         <textarea
//           placeholder="Reason (optional)"
//           className="w-full border rounded p-2 text-sm"
//           value={reason}
//           onChange={(e) => setReason(e.target.value)}
//         />

//         <div className="flex justify-end gap-3 pt-2">
//           <button onClick={onClose} className="px-4 py-2 border rounded">
//             Cancel
//           </button>
//           <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">
//             Block
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ============================ MAIN PAGE ================================ */

// export default function AdminAppointment() {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [availability, setAvailability] = useState<AdminAvailability[]>([]);
//   const [viewMode, setViewMode] = useState<ViewMode>("month");
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [loading, setLoading] = useState(true);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<string>("");

//   /* ----------------------------- LOAD ----------------------------------- */

//   const loadAppointments = async () => {
//     const res = await appointmentApi.getAllAppointments(0, 100);

//     setAppointments(
//       res.content.map((a: any) => ({
//         id: a.id,
//         name: a.name,
//         service: a.serviceType?.replace(/_/g, " ") || "SERVICE",
//         date: new Date(a.appointmentDate),
//         time: format(new Date(`2000-01-01T${a.appointmentTime}`), "HH:mm"),
//         status: a.status.toLowerCase(),
//       }))
//     );
//   };

//   const loadAvailability = async () => {
//     const data = await adminAvailabilityApi.getUpcomingUnavailability();
//     setAvailability(data);
//   };

//   useEffect(() => {
//     Promise.all([loadAppointments(), loadAvailability()])
//       .finally(() => setLoading(false));
//   }, []);

//   /* ----------------------------- ACTIONS -------------------------------- */

//   const handleApprove = async (id: number) => {
//     await appointmentApi.approveAppointment(id);
//     toast.success("Appointment approved");
//     loadAppointments();
//   };

//   const handleReject = async (id: number) => {
//     await appointmentApi.rejectAppointment(id);
//     toast.success("Appointment rejected");
//     loadAppointments();
//   };

//   const createBlock = async (data: any) => {
//     await adminAvailabilityApi.createUnavailability(data);
//     toast.success("Availability blocked");
//     setModalOpen(false);
//     loadAvailability();
//   };

//   const removeBlock = async (id: number) => {
//     await adminAvailabilityApi.deleteUnavailability(id);
//     toast.success("Block removed");
//     loadAvailability();
//   };

//   const blocksForDate = (date: Date) =>
//     availability.filter(a => isSameDay(new Date(a.blockedDate), date));

//   /* ----------------------------- CALENDAR ------------------------------- */

//   const weekStart = startOfWeek(currentDate);
//   const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

//   const monthStart = startOfMonth(currentDate);
//   const monthEnd = endOfMonth(currentDate);
//   const paddedMonth = [
//     ...Array(getDay(monthStart)).fill(null),
//     ...eachDayOfInterval({ start: monthStart, end: monthEnd }),
//   ];

//   const timeSlots = [
//     "09:00","10:00","11:00",
//     "12:00","13:00","14:00",
//     "15:00","16:00","17:00",
//   ];

//   if (loading) return <div className="p-10 text-center">Loading…</div>;

//   /* ----------------------------- RENDER --------------------------------- */

//   return (
//     <>
//       <AvailabilityModal
//         open={modalOpen}
//         date={selectedDate}
//         onClose={() => setModalOpen(false)}
//         onSubmit={createBlock}
//       />

//       <div className="bg-white rounded-2xl shadow overflow-hidden">

//         {/* HEADER */}
//         <div className="flex justify-between items-center p-4 border-b bg-[#F6F8F4]">
//           <div className="flex gap-2 items-center">
//             <button onClick={() => setCurrentDate(d => subMonths(d, 1))}>‹</button>
//             <button onClick={() => setCurrentDate(new Date())}>Today</button>
//             <button onClick={() => setCurrentDate(d => addMonths(d, 1))}>›</button>

//             <h2 className="ml-4 font-semibold">
//               {format(currentDate, "MMMM yyyy")}
//             </h2>
//           </div>

//           <div className="flex gap-2">
//             {["month","week","day"].map(m => (
//               <button
//                 key={m}
//                 onClick={() => setViewMode(m as ViewMode)}
//                 className={cn(
//                   "px-4 py-1 rounded",
//                   viewMode === m && "bg-green-600 text-white"
//                 )}
//               >
//                 {m}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* MONTH VIEW */}
//         {viewMode === "month" && (
//           <div className="grid grid-cols-7">
//             {paddedMonth.map((day: any, i: number) => (
//               <div key={i} className="border p-2 h-[140px] overflow-y-auto">
//                 {day && (
//                   <>
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="font-semibold">{format(day, "d")}</span>

//                       {isBlockAllowed(day) && (
//                         <button
//                           onClick={() => {
//                             setSelectedDate(format(day, "yyyy-MM-dd"));
//                             setModalOpen(true);
//                           }}
//                         >
//                           <Lock className="w-4 h-4 text-gray-700 hover:text-red-600" />
//                         </button>
//                       )}
//                     </div>

//                     {blocksForDate(day).map(b => (
//                       <BlockedIndicator
//                         key={b.id}
//                         availability={b}
//                         onRemove={removeBlock}
//                       />
//                     ))}

//                     {appointments
//                       .filter(a => isSameDay(a.date, day))
//                       .map(a => (
//                         <div
//                           key={a.id}
//                           className={cn(
//                             "p-2 mb-1 rounded border-l-4 text-xs",
//                             statusUI[a.status]?.border,
//                             statusUI[a.status]?.bg
//                           )}
//                         >
//                           <p className="font-semibold">
//                             {format(new Date(`2000-01-01T${a.time}`), "hh:mm a")}
//                           </p>
//                           <p>{a.name}</p>
//                         </div>
//                       ))}
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }


// src/pages/admin/AdminAppointment.tsx
// src/pages/admin/AdminAppointment.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getDay,
} from "date-fns";
import { Lock, X, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

import appointmentApi from "../../api/appointmentApi";
import adminAvailabilityApi from "../../api/adminAvailabilityApi";
import type { AdminAvailability } from "../../api/adminAvailabilityApi";

/* ================= TYPES ================= */

type ViewMode = "month" | "week" | "day";

interface Appointment {
  id: number;
  name: string;
  service: string;
  date: Date;
  time: string; // "HH:mm"
  status: string; // lowercased: "pending" | "confirmed" | "cancelled"
}

/* ================= CONFIG ================= */

const timeSlots = [
  "09:00","10:00","11:00",
  "12:00","13:00","14:00",
  "15:00","16:00","17:00",
];

const statusUI: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: "bg-yellow-100", color: "text-yellow-700", border: "border-yellow-500" },
  confirmed: { bg: "bg-green-100", color: "text-green-700", border: "border-green-500" },
  cancelled: { bg: "bg-red-100", color: "text-red-700", border: "border-red-500" },
};

/* ================= RULES ================= */

// Admin can block only today → next 7 days
const isBlockAllowed = (date: Date) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const max = new Date(today);
  max.setDate(today.getDate() + 15);
  return date >= today && date <= max;
};

/* ================= HELPERS ================= */

/**
 * Normalize time string to "HH:mm".
 * Accepts "HH:mm", "HH:mm:ss", or sometimes "H:mm:ss".
 */
function normalizeTimeToHHmm(t?: string | null): string | null {
  if (!t) return null;
  const parts = t.split(":");
  if (parts.length < 2) return null;
  const hh = parts[0].padStart(2, "0");
  const mm = parts[1].padStart(2, "0");
  return `${hh}:${mm}`;
}

/** format "HH:mm" to "hh:mm a" for display */
function formatTimeDisplay(t?: string | null): string {
  const normalized = normalizeTimeToHHmm(t);
  if (!normalized) return "";
  try {
    const dt = new Date(`2000-01-01T${normalized}:00`);
    return format(dt, "hh:mm a");
  } catch (e) {
    return normalized;
  }
}

/** check if slot (HH:mm) is inside [start, end) (start/end may include seconds) */
function slotIsWithin(slotHHmm: string, startRaw?: string | null, endRaw?: string | null) {
  const s = normalizeTimeToHHmm(startRaw);
  const e = normalizeTimeToHHmm(endRaw);
  if (!s || !e) return false;
  return !(slotHHmm < s || slotHHmm >= e); // slot >= s && slot < e
}

/**
 * Build a map from date iso (yyyy-MM-dd) -> Set of blocked HH:mm slots
 * This makes rendering slot-level status very fast and consistent.
 */
function buildBlockedSlotMap(avail: AdminAvailability[]) {
  const map = new Map<string, Set<string>>();
  for (const b of avail || []) {
    const date = b.blockedDate;
    if (!map.has(date)) map.set(date, new Set<string>());
    const set = map.get(date)!;

    if (b.isFullDayBlocked) {
      for (const t of timeSlots) set.add(t);
    } else if (b.blockedTimeStart && b.blockedTimeEnd) {
      const s = normalizeTimeToHHmm(b.blockedTimeStart)!;
      const e = normalizeTimeToHHmm(b.blockedTimeEnd)!;
      for (const slot of timeSlots) {
        if (!(slot < s || slot >= e)) set.add(slot);
      }
    }
  }
  return map;
}

/* ================= UI SUBCOMPONENTS ================= */

const AppointmentCard: React.FC<{
  appt: Appointment;
  onApprove: (id:number)=>void;
  onReject: (id:number)=>void;
}> = ({ appt, onApprove, onReject }) => {
  const ui = statusUI[appt.status] ?? statusUI.pending;
  return (
    <div className={`rounded-md border-l-4 p-2 bg-white shadow-sm mb-2 ${ui.border}`}>
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-bold">
            {format(new Date(`2000-01-01T${appt.time}`), "hh:mm a")}
          </p>
          <p className="font-semibold text-sm truncate">{appt.name}</p>
          <p className="text-[11px] text-gray-600 truncate">{appt.service}</p>
          <div className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] ${ui.bg} ${ui.color}`}>
            {appt.status.toUpperCase()}
          </div>
        </div>
        {appt.status === "pending" && (
          <div className="flex flex-col gap-2 pt-1">
            <button onClick={() => onApprove(appt.id)} className="text-green-600">✓</button>
            <button onClick={() => onReject(appt.id)} className="text-red-600">✕</button>
          </div>
        )}
      </div>
    </div>
  );
};

const BlockedIndicator: React.FC<{ availability: AdminAvailability; onRemove: (id:number)=>void }> =
  ({ availability, onRemove }) => {
    const start = formatTimeDisplay(availability.blockedTimeStart ?? null);
    const end = formatTimeDisplay(availability.blockedTimeEnd ?? null);
    return (
      <div className="bg-red-50 border-l-4 border-red-500 rounded p-2 text-xs mb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700 font-semibold">
            <Lock className="w-3 h-3" />
            <span>
              {availability.isFullDayBlocked ? "Full day blocked" : `${start} – ${end}`}
            </span>
          </div>
          <button onClick={() => onRemove(availability.id)}><X className="w-3 h-3 text-red-600" /></button>
        </div>
        {availability.reason && <p className="text-red-600 mt-1">{availability.reason}</p>}
      </div>
    );
  };

/* ================= Availability Modal (same as your current modal) */

const AvailabilityModal: React.FC<{
  open: boolean;
  dateIso: string | null; // yyyy-MM-dd
  onClose: ()=>void;
  existingBlocks: AdminAvailability[]; // blocks for this date (from parent)
  onCreateMultiple: (payloads: {
    blockedDate: string;
    isFullDayBlocked: boolean;
    blockedTimeStart?: string | null;
    blockedTimeEnd?: string | null;
    reason?: string | null;
  }[]) => Promise<void>;
  onDeleteSingle: (id:number) => Promise<void>;
  onDeleteAllForDate: (dateIso: string) => Promise<void>;
}> = ({ open, dateIso, onClose, existingBlocks, onCreateMultiple, onDeleteSingle, onDeleteAllForDate }) => {
  const [isFullDay, setIsFullDay] = useState(false);
  const [slots, setSlots] = useState<Array<{start:string; end:string; reason?:string}>>([]);
  const [generalReason, setGeneralReason] = useState("");

  const hasFullDay = existingBlocks.some(b => b.isFullDayBlocked);

  useEffect(() => {
    setIsFullDay(false);
    setSlots([{ start: "10:00", end: "11:00", reason: "" }]);
    setGeneralReason("");
  }, [open, dateIso]);

  if (!open || !dateIso) return null;

  const slotConflicts = (sStart:string, sEnd:string) => {
    if (hasFullDay) return true;
    for (const b of existingBlocks) {
      if (!b.isFullDayBlocked && b.blockedTimeStart && b.blockedTimeEnd) {
        const ns = normalizeTimeToHHmm(sStart);
        const ne = normalizeTimeToHHmm(sEnd);
        const bs = normalizeTimeToHHmm(b.blockedTimeStart ?? undefined);
        const be = normalizeTimeToHHmm(b.blockedTimeEnd ?? undefined);
        if (!ns || !ne || !bs || !be) continue;
        if (!(ne <= bs || ns >= be)) return true;
      }
    }
    return false;
  };

  const hasSelfOverlap = (list: Array<{start:string; end:string}>) => {
    for (let i=0;i<list.length;i++) {
      const a = list[i];
      for (let j=i+1;j<list.length;j++) {
        const b = list[j];
        const as = normalizeTimeToHHmm(a.start);
        const ae = normalizeTimeToHHmm(a.end);
        const bs = normalizeTimeToHHmm(b.start);
        const be = normalizeTimeToHHmm(b.end);
        if (!as || !ae || !bs || !be) continue;
        if (!(ae <= bs || as >= be)) return true;
      }
    }
    return false;
  };

  const submit = async () => {
    if (hasFullDay) {
      toast.error("Full day block already exists for this date. Remove it first to add other blocks.");
      return;
    }

    if (isFullDay) {
      await onCreateMultiple([{
        blockedDate: dateIso,
        isFullDayBlocked: true,
        blockedTimeStart: null,
        blockedTimeEnd: null,
        reason: generalReason || null,
      }]);
      return;
    }

    const normalized = slots.map(s => ({ start: s.start, end: s.end }));
    if (normalized.some(s => !s.start || !s.end || normalizeTimeToHHmm(s.end)! <= normalizeTimeToHHmm(s.start)!)) {
      toast.error("Fix slot start/end times (end must be after start).");
      return;
    }
    if (hasSelfOverlap(normalized)) {
      toast.error("Slots overlap each other. Fix overlapping slots.");
      return;
    }
    for (const s of normalized) {
      if (slotConflicts(s.start, s.end)) {
        toast.error(`Slot ${s.start} - ${s.end} conflicts with existing blocks.`);
        return;
      }
    }

    const payloads = slots.map(s => ({
      blockedDate: dateIso!,
      isFullDayBlocked: false,
      blockedTimeStart: s.start,
      blockedTimeEnd: s.end,
      reason: s.reason || generalReason || null,
    }));

    await onCreateMultiple(payloads);
  };

  const addSlot = () => setSlots(prev => [...prev, { start: "10:00", end: "11:00", reason: "" }]);
  const updateSlot = (idx:number, partial: Partial<{start:string; end:string; reason:string}>) =>
    setSlots(prev => prev.map((s,i) => i===idx ? {...s, ...partial} : s));
  const removeSlot = (idx:number) => setSlots(prev => prev.filter((_,i)=>i!==idx));

  return (
    
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Block availability — {format(new Date(dateIso), "EEE, MMM dd yyyy")}</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {hasFullDay ? (
          <div className="p-4 bg-red-50 rounded">
            <p className="text-red-700 mb-2">This date is already blocked for the full day.</p>
            <div className="flex gap-2">
              {existingBlocks.filter(b=>b.isFullDayBlocked).map(b => (
                <div key={b.id} className="flex gap-2 items-center">
                  <div className="text-sm text-gray-700">{b.reason ?? "No reason"}</div>
                  <button onClick={() => onDeleteSingle(b.id)} className="px-3 py-1 bg-red-600 text-white rounded">Remove full-day block</button>
                </div>
              ))}
              <button onClick={() => onDeleteAllForDate(dateIso)} className="px-3 py-1 border rounded">Remove all blocks (including time slots)</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isFullDay} onChange={(e)=>setIsFullDay(e.target.checked)} />
                <span>Block full day</span>
              </label>
            </div>

            {isFullDay ? (
              <div className="mb-3">
                <label className="block text-sm mb-1">Reason (optional)</label>
                <input className="w-full border rounded p-2" value={generalReason} onChange={(e)=>setGeneralReason(e.target.value)} placeholder="Reason" />
                <div className="text-xs text-gray-500 mt-2">Creating a full-day block will prevent any further time-slot blocks for this date.</div>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Reason for slots (optional)</label>
                  <input className="w-full border rounded p-2 mb-2" value={generalReason} onChange={(e)=>setGeneralReason(e.target.value)} placeholder="General reason for these slots" />
                  <div className="text-xs text-gray-500">Add one or more time slots below. They will be created together.</div>
                </div>

                <div className="space-y-2 max-h-56 overflow-auto mb-3">
                  {slots.map((s, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                      <input type="time" value={s.start} onChange={(e)=>updateSlot(idx, { start: e.target.value })} className="border rounded p-1" />
                      <input type="time" value={s.end} onChange={(e)=>updateSlot(idx, { end: e.target.value })} className="border rounded p-1" />
                      <div className="flex gap-2 items-center">
                        <input placeholder="slot reason (optional)" value={s.reason} onChange={(e)=>updateSlot(idx, { reason: e.target.value })} className="border rounded p-1 flex-1" />
                        <button onClick={()=>removeSlot(idx)} className="px-2 py-1 border rounded">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-3">
                  <button onClick={addSlot} className="px-3 py-1 border rounded">Add slot</button>
                  <button onClick={() => onDeleteAllForDate(dateIso)} className="px-3 py-1 border rounded">Remove all existing blocks for this date</button>
                </div>
              </>
            )}
          </>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
          {!hasFullDay && <button onClick={submit} className="px-3 py-1 bg-green-600 text-white rounded">Create block(s)</button>}
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */

export default function AdminAppointment() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<AdminAvailability[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDateIso, setModalDateIso] = useState<string | null>(null);

  // load data
  const loadAppointments = async () => {
    try {
      const res = await appointmentApi.getAllAppointments(0, 200);
      setAppointments(res.content.map((a:any) => ({
        id: a.id,
        name: a.name,
        service: a.serviceType?.replace(/_/g," ") ?? "SERVICE",
        date: new Date(a.appointmentDate),
        time: format(new Date(`2000-01-01T${a.appointmentTime}`), "HH:mm"),
        status: (a.status ?? "pending").toLowerCase(),
      })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
    }
  };

  const loadAvailability = async () => {
    try {
      const res = await adminAvailabilityApi.getUpcomingUnavailability();
      // Normalize times on client-side (ensure HH:mm or null)
      const normalized = (res || []).map((r:any) => ({
        ...r,
        blockedTimeStart: normalizeTimeToHHmm(r.blockedTimeStart),
        blockedTimeEnd: normalizeTimeToHHmm(r.blockedTimeEnd),
      }));
      setAvailability(normalized);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load availability");
    }
  };

  useEffect(() => {
    Promise.all([loadAppointments(), loadAvailability()]).finally(()=>setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approve = async (id:number) => {
    try {
      await appointmentApi.approveAppointment(id);
      toast.success("Appointment approved");
      loadAppointments();
    } catch (err) { toast.error("Failed to approve"); }
  };

  const reject = async (id:number) => {
    try {
      await appointmentApi.rejectAppointment(id);
      toast.success("Appointment rejected");
      loadAppointments();
    } catch (err) { toast.error("Failed to reject"); }
  };

  // blocked slot map memoized
  const blockedSlotMap = useMemo(() => buildBlockedSlotMap(availability), [availability]);

  const blocksForDate = (d: Date) => availability.filter(b => isSameDay(new Date(b.blockedDate), d));

  const deleteBlock = async (id:number) => {
    try {
      await adminAvailabilityApi.deleteUnavailability(id);
      toast.success("Block removed");
      await loadAvailability();
      await loadAppointments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove block");
    }
  };

  const deleteAllBlocksForDate = async (dateIso: string) => {
    try {
      const blocks = availability.filter(b => b.blockedDate === dateIso);
      for (const b of blocks) {
        await adminAvailabilityApi.deleteUnavailability(b.id);
      }
      toast.success("All blocks removed for date");
      await loadAvailability();
      await loadAppointments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove blocks");
    }
  };

  const createMultipleBlocks = async (payloads: {
    blockedDate: string;
    isFullDayBlocked: boolean;
    blockedTimeStart?: string | null;
    blockedTimeEnd?: string | null;
    reason?: string | null;
  }[]) => {
    try {
      for (const p of payloads) {
        await adminAvailabilityApi.createUnavailability(p);
      }
      toast.success("Blocks created");
      setModalOpen(false);
      setModalDateIso(null);
      await loadAvailability();
      await loadAppointments();
    } catch (err:any) {
      const msg = err?.response?.data?.message;
      toast.error(msg ?? "Failed to create block(s)");
      console.error(err);
    }
  };

  // navigation helpers (prev/next adapt to view)
  const goPrev = () => {
    if (viewMode === "month") setCurrentDate(d => subMonths(d, 1));
    else if (viewMode === "week") setCurrentDate(d => subWeeks(d, 1));
    else setCurrentDate(d => subDays(d, 1));
  };
  const goNext = () => {
    if (viewMode === "month") setCurrentDate(d => addMonths(d, 1));
    else if (viewMode === "week") setCurrentDate(d => addWeeks(d, 1));
    else setCurrentDate(d => addDays(d, 1));
  };
  const goToday = () => setCurrentDate(new Date());

  const openModal = (d: Date) => {
    if (!isBlockAllowed(d)) {
      toast.error("You can block only today → next 15 days.");
      return;
    }
    setModalDateIso(format(d, "yyyy-MM-dd"));
    setModalOpen(true);
  };

  // month helpers
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startPad = getDay(monthStart);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const paddedMonth = [...Array(startPad).fill(null), ...monthDays];

  if (loading) return <div className="p-8 text-center">Loading…</div>;

  return (

    <>
    {/* PAGE HEADER */}
    <div className="mb-8">
      <h1 className="text-4xl font-display font-bold text-darkC-dark-900 mb-2">
        Appointment Management
      </h1>
      <p className="text-dark-600">
        Manage bookings, availability, and customer appointments
      </p>
    </div>
      <AvailabilityModal
        open={modalOpen}
        dateIso={modalDateIso}
        onClose={() => { setModalOpen(false); setModalDateIso(null); }}
        existingBlocks={modalDateIso ? availability.filter(b=>b.blockedDate===modalDateIso) : []}
        onCreateMultiple={createMultipleBlocks}
        onDeleteSingle={async (id)=>{ await deleteBlock(id); }}
        onDeleteAllForDate={async (dateIso)=>{ await deleteAllBlocksForDate(dateIso); }}
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#F6F8F4]">
          <div className="flex items-center gap-2">
            <button onClick={goPrev} className="p-2 border rounded"><ChevronLeft /></button>
            <button onClick={goToday} className="px-3 py-1 border rounded">Today</button>
            <button onClick={goNext} className="p-2 border rounded"><ChevronRight /></button>

            <h2 className="ml-4 font-semibold">
              {viewMode === "month" && format(currentDate, "MMMM yyyy")}
              {viewMode === "week" && `${format(startOfWeek(currentDate), "MMM d")} – ${format(endOfWeek(currentDate), "MMM d, yyyy")}`}
              {viewMode === "day" && format(currentDate, "EEEE, MMM d yyyy")}
            </h2>
          </div>

          <div className="flex gap-2">
            {(["month","week","day"] as ViewMode[]).map(v => (
              <button key={v} onClick={() => setViewMode(v)} className={`px-4 py-1 rounded ${viewMode===v ? "bg-green-600 text-white" : "border"}`}>{v}</button>
            ))}
          </div>
        </div>

        {/* Month */}
        {viewMode === "month" && (
          <div className="grid grid-cols-7">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
              <div key={day} className="p-2 text-center font-semibold border-b bg-gray-50">{day}</div>
            ))}

            {paddedMonth.map((d, idx) => (
              <div key={idx} className="border p-2 h-[160px] overflow-auto">
                {!d ? null : (
                  <>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold">{format(d, "d")}</span>
                      <button onClick={()=>openModal(d)} className={`p-1 rounded ${isBlockAllowed(d) ? "text-red-600" : "text-gray-300 cursor-not-allowed"}`} title="Block this date"><Lock /></button>
                    </div>

                    {/* blocks - show all blocks for the date */}
                    {blocksForDate(d).map(b => <BlockedIndicator key={b.id} availability={b} onRemove={deleteBlock} />)}

                    {/* appointments */}
                    {appointments.filter(a=>isSameDay(a.date, d)).map(a => (
                      <AppointmentCard key={a.id} appt={a} onApprove={approve} onReject={reject} />
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Week */}
        {viewMode === "week" && (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b">
              <div className="p-2" />
              {eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) }).map(d => (
                <div key={d.toString()} className="p-2 text-center border-l">
                  <div className="flex items-center justify-center gap-2">
                    <div className="font-semibold">{format(d, "EEE d")}</div>
                    <button onClick={()=>openModal(d)} className={`p-1 rounded ${isBlockAllowed(d) ? "text-red-600" : "text-gray-300 cursor-not-allowed"}`} title="Block this date"><Lock /></button>
                  </div>

                  {/* header small list of blocked times for quick glance */}
                  <div className="mt-1 flex flex-col gap-1 items-center">
                    {blocksForDate(d).map(b => (
                      b.isFullDayBlocked ? (
                        <div key={b.id} className="text-xs text-red-600">Full day blocked</div>
                      ) : (
                        <div key={b.id} className="text-xs text-red-600">
                          {formatTimeDisplay(b.blockedTimeStart)} – {formatTimeDisplay(b.blockedTimeEnd)}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {timeSlots.map(slot => (
              <div key={slot} className="grid grid-cols-[100px_repeat(7,1fr)] border-b">
                <div className="p-2 text-xs text-gray-500">{format(new Date(`2000-01-01T${slot}`),"hh:mm a")}</div>
                {eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) }).map(day => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const blockedSet = blockedSlotMap.get(dateKey);
                  const isBlocked = blockedSet ? blockedSet.has(slot) : false;

                  return (
                    <div key={day.toString()} className="p-2 border-l min-h-[60px]">
                      {/* blocked slot (slot-level) */}
                      {isBlocked && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded text-xs mb-2 flex justify-between items-center">
                          <span className="text-red-700 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Unavailable
                          </span>
                          <button
                            onClick={() => {
                              // find the block that covers this slot and delete it
                              const block = availability.find(b =>
                                b.blockedDate === dateKey &&
                                (b.isFullDayBlocked || (b.blockedTimeStart && b.blockedTimeEnd && slotIsWithin(slot, b.blockedTimeStart, b.blockedTimeEnd)))
                              );
                              if (block) deleteBlock(block.id);
                            }}
                            className="text-red-600"
                            title="Remove block for this slot"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* appointments at this slot */}
                      {appointments.filter(a => isSameDay(a.date, day) && a.time === slot).map(a => (
                        <AppointmentCard key={a.id} appt={a} onApprove={approve} onReject={reject} />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Day */}
        {viewMode === "day" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{format(currentDate, "EEEE, MMM dd yyyy")}</h3>
              <button onClick={()=>openModal(currentDate)} className={`p-2 rounded ${isBlockAllowed(currentDate) ? "text-red-600" : "text-gray-300 cursor-not-allowed"}`}><Lock /></button>
            </div>

            {/* day header: show blocks */}
            <div className="mb-3">
              {blocksForDate(currentDate).map(b => (
                b.isFullDayBlocked ? (
                  <div key={b.id} className="inline-block px-2 py-1 bg-red-50 text-red-700 rounded mr-2">Full day blocked</div>
                ) : (
                  <div key={b.id} className="inline-block px-2 py-1 bg-red-50 text-red-700 rounded mr-2">
                    {formatTimeDisplay(b.blockedTimeStart)} – {formatTimeDisplay(b.blockedTimeEnd)}
                    <button onClick={() => deleteBlock(b.id)} className="ml-2 text-red-600"><X className="w-3 h-3" /></button>
                  </div>
                )
              ))}
            </div>

            {timeSlots.map(slot => {
              const dateKey = format(currentDate, "yyyy-MM-dd");
              const blockedSet = blockedSlotMap.get(dateKey);
              const isBlocked = blockedSet ? blockedSet.has(slot) : false;

              return (
                <div key={slot} className="border p-3 mb-2 rounded min-h-[70px]">
                  <p className="text-xs text-gray-500 mb-2">{format(new Date(`2000-01-01T${slot}`), "hh:mm a")}</p>

                  {isBlocked && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded text-xs mb-2 flex justify-between items-center">
                      <span className="text-red-700 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Unavailable
                      </span>
                      <button
                        onClick={() => {
                          const block = availability.find(b =>
                            b.blockedDate === dateKey &&
                            (b.isFullDayBlocked || (b.blockedTimeStart && b.blockedTimeEnd && slotIsWithin(slot, b.blockedTimeStart, b.blockedTimeEnd)))
                          );
                          if (block) deleteBlock(block.id);
                        }}
                        className="text-red-600"
                        title="Remove block for this slot"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {appointments.filter(a => isSameDay(a.date, currentDate) && a.time === slot).map(a => (
                    <AppointmentCard key={a.id} appt={a} onApprove={approve} onReject={reject} />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
