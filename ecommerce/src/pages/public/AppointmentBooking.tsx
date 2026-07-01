// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Calendar, Clock, User, Sparkles, ArrowRight } from "lucide-react";
// import { toast } from "sonner";
// import Navbar from "../../components/layout/Navbar";
// import { Footer } from "../../components/layout/Footer";
// const serviceTypes = [
//   {
//     id: "styling",
//     name: "Personal Styling",
//     description: "One-on-one styling consultation with our experts",
//     duration: "60 min",
//     icon: Sparkles,
//   },
//   {
//     id: "fitting",
//     name: "Private Fitting",
//     description: "Exclusive fitting session for special occasions",
//     duration: "90 min",
//     icon: User,
//   },
//   {
//     id: "consultation",
//     name: "Wardrobe Consultation",
//     description: "Comprehensive wardrobe review and recommendations",
//     duration: "120 min",
//     icon: Calendar,
//   },
// ];

// const timeSlots = [
//   "10:00 AM","11:00 AM","12:00 PM",
//   "2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM",
// ];

// export default function Appointment() {
//   const [selectedService, setSelectedService] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [formData, setFormData] = useState({
//     name: "", email: "", phone: "", notes: "",
//   });

//   const handleSubmit = (e:any) => {
//     e.preventDefault();
//     if (!selectedService || !selectedDate || !selectedTime) {
//       toast.error("Please complete all required fields");
//       return;
//     }
//     toast.success("Your appointment has been scheduled!");
//     setSelectedService("");
//     setSelectedDate("");
//     setSelectedTime("");
//     setFormData({ name: "", email: "", phone: "", notes: "" });
//   };

//   const handleChange = (e:any) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const getAvailableDates = () => {
//     const dates:any = [];
//     const today = new Date();
//     for (let i = 1; i <= 14; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       if (date.getDay() !== 0) dates.push(date);
//     }
//     return dates;
//   };

//   const formatDate = (date:any) =>
//     date.toLocaleDateString("en-US", {
//       weekday:"short",
//       month:"short",
//       day:"numeric",
//     });

//   return (
//     <div>

//       {/* HEADER */}
//       <section className="py-20 md:py-32 border-b">
//         <Navbar />
//         <div className="max-w-5xl mx-auto px-6 text-center">
//           <p className="text-[#6E9F7D] tracking-[0.3em] uppercase text-xs mb-4">
//             Personal Service
//           </p>

//           <h1 className="font-serif text-5xl md:text-7xl mb-6">
//             Book an Appointment
//           </h1>

//           <p className="text-gray-500 max-w-xl mx-auto">
//             Experience personalized styling services at our flagship boutique.
//           </p>
//         </div>
//       </section>

//       {/* FORM SECTION */}
//       <section className="py-20">
//         <div className="max-w-4xl mx-auto px-6">
//           <form onSubmit={handleSubmit} className="space-y-16">

//             {/* SERVICE SELECT */}
//             <div>
//               <h2 className="font-serif text-2xl mb-8">Select Service</h2>

//               <div className="grid md:grid-cols-3 gap-4">
//                 {serviceTypes.map(service => {
//                   const Icon = service.icon;
//                   return (
//                     <button
//                       key={service.id}
//                       type="button"
//                       onClick={() => setSelectedService(service.id)}
//                       className={
//                         `p-8 border text-left transition-all ${
//                           selectedService === service.id
//                             ? "border-[#6E9F7D] bg-[#6E9F7D]/10"
//                             : "hover:border-black/40"
//                         }`
//                       }
//                     >
//                       <Icon className="w-8 h-8 text-[#6E9F7D] mb-5" />

//                       <h3 className="font-medium mb-2">{service.name}</h3>

//                       <p className="text-sm text-gray-500 mb-3">
//                         {service.description}
//                       </p>

//                       <p className="text-sm font-medium text-[#6E9F7D]">
//                         {service.duration}
//                       </p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* DATE SELECT */}
//             <div>
//               <h2 className="font-serif text-2xl mb-8">Select Date</h2>

//               <div className="flex gap-3 overflow-auto pb-2">
//                 {getAvailableDates().map((date:any) => {
//                   const dateStr = date.toISOString().split("T")[0];
//                   return (
//                     <button
//                       key={dateStr}
//                       type="button"
//                       onClick={() => setSelectedDate(dateStr)}
//                       className={
//                         `px-5 py-4 border min-w-[110px] ${
//                           selectedDate === dateStr
//                             ? "border-[#6E9F7D] bg-[#6E9F7D]/10"
//                             : "hover:border-black/40"
//                         }`
//                       }
//                     >
//                       <p className="text-sm">{formatDate(date)}</p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* TIME SELECT */}
//             <div>
//               <h2 className="font-serif text-2xl mb-8">Select Time</h2>

//               <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
//                 {timeSlots.map(time => (
//                   <button
//                     key={time}
//                     type="button"
//                     onClick={() => setSelectedTime(time)}
//                     className={
//                       `px-3 py-3 border text-xs tracking-wide ${
//                         selectedTime === time
//                           ? "border-[#6E9F7D] bg-[#6E9F7D]/10"
//                           : "hover:border-black/40"
//                       }`
//                     }
//                   >
//                     {time}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* USER INFO */}
//             <div>
//               <h2 className="font-serif text-2xl mb-8">Your Information</h2>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="text-xs tracking-widest uppercase block mb-2">
//                     Full Name *
//                   </label>
//                   <input
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     className="w-full h-14 px-5 bg-[#1E2225] border border-[#2C3236] text-white placeholder-gray-400 focus:border-[#6E9F7D] outline-none transition"
//                     placeholder="Your name"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs tracking-widest uppercase block mb-2">
//                     Email *
//                   </label>
//                   <input
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="w-full h-14 px-5 bg-[#1E2225] border border-[#2C3236] text-white placeholder-gray-400 focus:border-[#6E9F7D] outline-none transition"
//                     placeholder="email@example.com"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs tracking-widest uppercase block mb-2">
//                     Phone *
//                   </label>
//                   <input
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                     className="w-full h-14 px-5 bg-[#1E2225] border border-[#2C3236] text-white placeholder-gray-400 focus:border-[#6E9F7D] outline-none transition"
//                     placeholder="+91 **********"
//                   />
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <label className="text-xs tracking-widest uppercase block mb-2">
//                   Additional Notes
//                 </label>
//                 <textarea
//                   name="notes"
//                   value={formData.notes}
//                   onChange={handleChange}
//                   rows={4}
//                   className="w-full h-14 px-5 bg-[#1E2225] border border-[#2C3236] text-white placeholder-gray-400 focus:border-[#6E9F7D] outline-none transition"
//                   placeholder="Any special requests?"
//                 />
//               </div>
//             </div>

//             {/* SUBMIT */}
//             <div className="flex flex-col items-center">
//             <button
//   type="submit"
//   className="px-14 py-5 bg-[#6E9F7D] text-black uppercase tracking-wide flex items-center gap-3 justify-center hover:bg-[#628c71] transition shadow-[0_0_25px_#00000040]"
// >
//   <Clock className="w-4 h-4" />
//   Confirm Appointment
//   <ArrowRight className="w-4 h-4" />
// </button>


//               <p className="text-sm text-gray-500 mt-6 mb-24 text-center">
//                 You'll receive a confirmation email with all the details.
//               </p>
//             </div>

//           </form>
//         </div>
//         <Footer />
//       </section>
//     </div>
//   );
// }




// import { useState } from "react";
// // import { motion } from "framer-motion";
// import { /* Calendar, */ Clock, /* User, */ Sparkles, ArrowRight } from "lucide-react";
// import { toast } from "sonner";
// import Navbar from "../../components/layout/Navbar";
// import { Footer } from "../../components/layout/Footer";

// import bookingApi from "../../api/BookingApi";
// import { useEffect } from "react";
// import { motion } from "framer-motion";
// // ---------------- SERVICE UI DATA ----------------

// // const timeSlots = [
// //   "10:00 AM",
// //   "11:00 AM",
// //   "12:00 PM",
// //   "2:00 PM",
// //   "3:00 PM",
// //   "4:00 PM",
// //   "5:00 PM",
// //   "6:00 PM",
// // ];

// export default function AppointmentBooking() {
//   const [selectedService, setSelectedService] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [services, setServices] = useState<string[]>([]);
// const [servicesLoading, setServicesLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     notes: "",
//   });
// const [availableSlots, setAvailableSlots] = useState<string[]>([]);
//   // Convert AM/PM → backend format HH:mm:ss
//   const convertTo24Hour = (timeStr: string) => {
//     const time = new Date(`1970-01-01 ${timeStr}`);
//     return time.toTimeString().split(" ")[0];
//   };

//   const storedUser = localStorage.getItem("user");
// const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

// // backend "HH:mm:ss" → "10:00 AM"
// const convertTo12Hour = (time24: string) => {
//   const [h, m] = time24.split(":").map(Number);
//   const d = new Date();
//   d.setHours(h, m);
//   return d.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
// };
// const formatServiceName = (service: string) =>
//   service
//     .toLowerCase()
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (l) => l.toUpperCase());

//   const getAvailableDates = () => {
//     const dates: Date[] = [];
//     const today = new Date();
//     for (let i = 1; i <= 14; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       if (date.getDay() !== 0) dates.push(date); // skip Sunday
//     }
//     return dates;
//   };

//   const formatDate = (date: Date) =>
//     date.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });

//   const handleChange = (e: any) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // ---------------- SUBMIT → API CALL ----------------
// const handleSubmit = async (e: any) => {
//   e.preventDefault();

//   if (!selectedService || !selectedDate || !selectedTime) {
//     toast.error("Please complete all required fields");
//     return;
//   }

//   try {
//     setLoading(true);

//     const baseData = {
//       appointmentDate: selectedDate,
//       appointmentTime: convertTo24Hour(selectedTime),
//       serviceType: selectedService,
//       notes: formData.notes || "",
//     };

//     let response;

//     if (loggedInUser) {
//       // ✅ LOGGED-IN USER
//       response = await bookingApi.createAppointment(baseData);
//     } else {
//       // ✅ GUEST USER
//       response = await bookingApi.createGuestAppointment({
//         ...baseData,
//         guestName: formData.name,
//         guestEmail: formData.email,
//         guestPhone: formData.phone,
//       });
//     }

//     toast.success("Appointment booked successfully!");
//     console.log("APPOINTMENT CREATED:", response);
//     setShowSuccessModal(true);

//     // reset
//     setSelectedService("");
//     setSelectedDate("");
//     setSelectedTime("");
//     setFormData({ name: "", email: "", phone: "", notes: "" });

//   } catch (error: any) {
//     console.error(error);
//     toast.error(
//       error?.response?.data?.message || "Failed to book appointment"
//     );
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   if (!selectedDate) {
//     setAvailableSlots([]);
//     return;
//   }

//   const loadAvailableSlots = async () => {
//     try {
//       const slots24 =
//         await bookingApi.getAvailableSlots(selectedDate);

//       // convert backend 24h → frontend AM/PM
//       const slots12 = slots24.map(convertTo12Hour);

//       setAvailableSlots(slots12);
//     } catch (err) {
//       console.error("Failed to load available slots", err);
//       setAvailableSlots([]);
//     }
//   };

//   loadAvailableSlots();
// }, [selectedDate]);



// useEffect(() => {
//   if (loggedInUser) {
//     setFormData({
//       name: loggedInUser.name || "",
//       email: loggedInUser.email || "",
//       phone: loggedInUser.phone || "",
//       notes: "",
//     });
//   }
// }, []);

// useEffect(() => {
//   const loadServices = async () => {
//     try {
//       setServicesLoading(true);
//       const data = await bookingApi.getAppointmentTypes();
//       setServices(data);
//     } catch (err) {
//       toast.error("Failed to load services");
//     } finally {
//       setServicesLoading(false);
//     }
//   };

//   loadServices();
// }, []);

//   return (
//     <div>
//       {/* HEADER */}
//       <section className="py-20 md:py-32 border-b">
//         <Navbar />
//         <div className="max-w-5xl mx-auto px-6 text-center">
//           <p className="text-[#6E9F7D] tracking-[0.3em] uppercase text-xs mb-4">
//             Personal Service
//           </p>

//           <h1 className="font-serif text-5xl md:text-7xl mb-6">
//             Book an Appointment
//           </h1>

//           <p className="text-gray-500 max-w-xl mx-auto">
//             Experience personalized styling services at our flagship boutique.
//           </p>
//         </div>
//       </section>

//       {/* FORM */}
//       <section className="py-20">
//         <div className="max-w-4xl mx-auto px-6">
//           <form onSubmit={handleSubmit} className="space-y-16">
//             {/* SERVICE SELECT */}
//            <div>
//   <h2 className="font-serif text-2xl mb-8">Select Service</h2>

//   {servicesLoading ? (
//     <p className="text-gray-500">Loading services…</p>
//   ) : (
//     <div className="grid md:grid-cols-3 gap-4">
//       {services.map((service) => (
//         <button
//           key={service}
//           type="button"
//           onClick={() => setSelectedService(service)}
//           className={`p-8 border text-left transition-all rounded-lg
//             ${
//               selectedService === service
//                 ? "border-[#6E9F7D] bg-[#6E9F7D]/10"
//                 : "hover:border-black/40"
//             }`}
//         >
//           <Sparkles className="w-8 h-8 text-[#6E9F7D] mb-5" />

//           <h3 className="font-medium mb-2">
//             {formatServiceName(service)}
//           </h3>

//           <p className="text-sm text-gray-500">
//             Premium personalized service
//           </p>
//         </button>
//       ))}
//     </div>
//   )}
// </div>

//             {/* DATE */}
//             <div>
//               <h2 className="font-serif text-2xl mb-8">Select Date</h2>

//               <div className="flex gap-3 overflow-auto pb-2">
//                 {getAvailableDates().map((date) => {
//                   const dateStr = date.toISOString().split("T")[0];
//                   return (
//                     <button
//                       key={dateStr}
//                       type="button"
//                       onClick={() => setSelectedDate(dateStr)}
//                       className={`px-5 py-4 border min-w-[110px] ${
//                         selectedDate === dateStr
//                           ? "border-[#6E9F7D] bg-[#6E9F7D]/10"
//                           : "hover:border-black/40"
//                       }`}
//                     >
//                       <p className="text-sm">{formatDate(date)}</p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* TIME */}
//             <div>
//               <h2 className="font-serif text-2xl mb-8">Select Time</h2>
// <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
//   {availableSlots.length === 0 ? (
//     <p className="col-span-full text-sm text-gray-500">
//       No slots available for this date
//     </p>
//   ) : (
//     availableSlots.map((time) => (
//       <button
//         key={time}
//         type="button"
//         onClick={() => setSelectedTime(time)}
//         className={`px-3 py-3 border text-xs tracking-wide transition
//           ${
//             selectedTime === time
//               ? "border-[#6E9F7D] bg-[#6E9F7D]/10"
//               : "hover:border-black/40"
//           }
//         `}
//       >
//         {time}
//       </button>
//     ))
//   )}
// </div>
//             </div>

//             {/* USER INFO */}
//             <div>
//               <h2 className="font-serif text-2xl mb-8">Your Information</h2>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="text-xs tracking-widest uppercase block mb-2 text-gray-800">
//                     Full Name *
//                   </label>
//                   <input
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                    className="w-full h-14 px-5 
// bg-[#F4EBE6] 
// border border-[#E2D6CF] 
// text-gray-900 
// placeholder-gray-500 
// focus:border-[#6E9F7D] 
// focus:bg-[#F8F1ED]
// outline-none transition rounded-md"

//                     placeholder="Your name"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs tracking-widest uppercase block mb-2 text-gray-800">
//                     Email *
//                   </label>
//                   <input
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="w-full h-14 px-5 
// bg-[#F4EBE6] 
// border border-[#E2D6CF] 
// text-gray-900 
// placeholder-gray-500 
// focus:border-[#6E9F7D] 
// focus:bg-[#F8F1ED]
// outline-none transition rounded-md"

//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs tracking-widest uppercase block mb-2 text-gray-800">
//                     Phone *
//                   </label>
//                   <input
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                     className="w-full h-14 px-5 
// bg-[#F4EBE6] 
// border border-[#E2D6CF] 
// text-gray-900 
// placeholder-gray-500 
// focus:border-[#6E9F7D] 
// focus:bg-[#F8F1ED]
// outline-none transition rounded-md"
//                     placeholder="+91 **********"
//                   />
//                 </div>
//               </div>

//              <div className="mt-6">
//   <label className="text-xs tracking-widest uppercase block mb-2 text-gray-800">
//     Additional Notes
//   </label>
//   <textarea
//     name="notes"
//     value={formData.notes}
//     onChange={handleChange}
//     rows={4}
//     placeholder="Any special requests or preferences..."
//     className="w-full px-5 py-4 
//     bg-[#F4EBE6] 
//     border border-[#E2D6CF] 
//     text-gray-900 
//     placeholder-gray-500 
//     focus:border-[#6E9F7D] 
//     focus:bg-[#F8F1ED]
//     outline-none transition rounded-md"
//   />
// </div>

//             </div>

//             {/* SUBMIT */}
//             <div className="flex flex-col items-center">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-14 py-5 bg-[#6E9F7D] text-black uppercase tracking-wide flex items-center gap-3 justify-center hover:bg-[#628c71] transition shadow-[0_0_25px_#00000040]"
//               >
//                 {loading ? "Booking..." : (
//                   <>
//                     <Clock className="w-4 h-4" />
//                     Confirm Appointment
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>

//               <p className="text-sm text-gray-500 mt-6 mb-24 text-center">
//                 You'll receive a confirmation email with all the details.
//               </p>
//             </div>
//           </form>
//         </div>
// {showSuccessModal && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//     <motion.div
//       initial={{ opacity: 0, scale: 0.85 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.85 }}
//       transition={{ type: "spring", stiffness: 260, damping: 20 }}
//       className="relative bg-white rounded-2xl max-w-lg w-full p-10 text-center shadow-2xl overflow-hidden"
//     >
//       {/* CONFETTI DOTS */}
//       <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle,#6E9F7D_1px,transparent_1px)] bg-[length:20px_20px]" />

//       {/* CHECK ICON */}
//       <div className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-full border-4 border-green-500 flex items-center justify-center">
//         <svg
//           className="w-12 h-12 text-green-500"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth={3}
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M5 13l4 4L19 7"
//           />
//         </svg>
//       </div>

//       {/* TITLE */}
//       <h2 className="relative z-10 text-3xl font-serif font-semibold mb-2 text-gray-900">
//         Appointment Booked Successfully
//       </h2>

//       <p className="relative z-10 text-gray-600 mb-8">
//         Thank you for patronizing us today. <br />
//         We value you!
//       </p>

//       {/* CTA */}
//       <button
//         onClick={() => setShowSuccessModal(false)}
//         className="relative z-10 px-10 py-3 bg-[#6E9F7D] text-white rounded-md font-medium hover:bg-[#628c71] transition"
//       >
//         Return Home
//       </button>
//     </motion.div>
//   </div>
// )}
//         <Footer />
//       </section>
//     </div>
//   );
// }




import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import bookingApi from "../../api/BookingApi";
import heroAppointment from "../../assets/hero-appointment.jpg";

export default function AppointmentBooking() {
  type LoggedInUser = {
    name?: string;
    email?: string;
    phone?: string;
  };

  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  // Added: Form validation states
  const [formErrors, setFormErrors] = useState({
    service: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: ""
  });
  const serviceSectionRef = useRef<HTMLDivElement>(null);
  const dateSectionRef = useRef<HTMLDivElement>(null);
  const timeSectionRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const scrollToInvalidField = (field: keyof typeof formErrors) => {
    const targetMap: Record<keyof typeof formErrors, HTMLElement | null> = {
      service: serviceSectionRef.current,
      date: dateSectionRef.current,
      time: timeSectionRef.current,
      name: nameInputRef.current,
      email: emailInputRef.current,
      phone: phoneInputRef.current,
    };

    const target = targetMap[field];
    if (!target) return;

    const targetTop = target.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });

    window.setTimeout(() => {
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLButtonElement
      ) {
        target.focus({ preventScroll: true });
        return;
      }
      const firstButton = target.querySelector("button");
      firstButton?.focus({ preventScroll: true });
    }, 250);
  };

  const convertTo24Hour = (timeStr: string) => {
    const time = new Date(`1970-01-01 ${timeStr}`);
    return time.toTimeString().split(" ")[0];
  };

  const storedUser = localStorage.getItem("user");
  const loggedInUser = useMemo<LoggedInUser | null>(() => {
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as LoggedInUser;
    } catch {
      return null;
    }
  }, [storedUser]);

  const convertTo12Hour = (time24: string) => {
    const [h, m] = time24.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  const formatServiceName = (service: string) =>
    service
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const getAvailableDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) dates.push(date); // skip Sunday
    }
    return dates;
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  const fieldName = name as keyof typeof formData;

  if (name === "phone") {
    const numericValue = value.replace(/\D/g, ""); // Allow only digits
    if (numericValue.length <= 10) {
      setFormData((prev) => ({ ...prev, phone: numericValue }));
    }
  } else {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  }

  // Clear error when user starts typing
  if (formErrors[name as keyof typeof formErrors]) {
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  }
};

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

const validatePhone = (phone: string) => {
  const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits only
  return phoneRegex.test(phone);
};

  // Added: Validate form before submission
  const validateForm = () => {
    const errors = {
      service: "",
      date: "",
      time: "",
      name: "",
      email: "",
      phone: ""
    };

    let isValid = true;
    let firstInvalidField: keyof typeof errors | null = null;

    const markInvalid = (field: keyof typeof errors, message: string) => {
      errors[field] = message;
      if (!firstInvalidField) firstInvalidField = field;
      isValid = false;
    };

    // Validate service
    if (!selectedService.trim()) {
      markInvalid("service", "Please select a service");
    }

    // Validate date
    if (!selectedDate.trim()) {
      markInvalid("date", "Please select a date");
    }

    // Validate time
    if (!selectedTime.trim()) {
      markInvalid("time", "Please select a time");
    }

    // Validate name
    if (!formData.name.trim()) {
      markInvalid("name", "Name is required");
    }

    // Validate email
    if (!formData.email.trim()) {
      markInvalid("email", "Email is required");
    } else if (!validateEmail(formData.email)) {
      markInvalid("email", "Please enter a valid email address");
    }

    // Validate phone
    if (!formData.phone.trim()) {
      markInvalid("phone", "Phone number is required");
    } else if (!validatePhone(formData.phone)) {
      markInvalid("phone", "Phone number must be exactly 10 digits");
    }

    setFormErrors(errors);
    if (firstInvalidField) {
      window.requestAnimationFrame(() => scrollToInvalidField(firstInvalidField!));
    }
    return isValid;
  };

  // ---------------- SUBMIT → API CALL ----------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      const baseData = {
        appointmentDate: selectedDate,
        appointmentTime: convertTo24Hour(selectedTime),
        serviceType: selectedService,
        notes: formData.notes || "",
      };

      let response;

      if (loggedInUser) {
        // ✅ LOGGED-IN USER
        response = await bookingApi.createAppointment(baseData);
      } else {
        // ✅ GUEST USER
        response = await bookingApi.createGuestAppointment({
          ...baseData,
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhone: formData.phone,
        });
      }

      toast.success("Appointment booked successfully!");
      console.log("APPOINTMENT CREATED:", response);
      setShowSuccessModal(true);

      // reset
      setSelectedService("");
      setSelectedDate("");
      setSelectedTime("");
      setFormData({ name: "", email: "", phone: "", notes: "" });
      setFormErrors({ service: "", date: "", time: "", name: "", email: "", phone: "" });

    } catch (error: unknown) {
      console.error(error);
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(
        message || "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const loadAvailableSlots = async () => {
      try {
        const slots24 = await bookingApi.getAvailableSlots(selectedDate);
        const slots12 = slots24.map(convertTo12Hour);
        setAvailableSlots(slots12);
      } catch (err) {
        console.error("Failed to load available slots", err);
        setAvailableSlots([]);
      }
    };

    loadAvailableSlots();
  }, [selectedDate]);

  useEffect(() => {
    if (!loggedInUser) return;
    setFormData((prev) => {
      const isAlreadyEdited = Boolean(prev.name || prev.email || prev.phone || prev.notes);
      if (isAlreadyEdited) return prev;
      return {
        ...prev,
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        phone: loggedInUser.phone || "",
      };
    });
  }, [loggedInUser]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setServicesLoading(true);
        const data = await bookingApi.getAppointmentTypes();
        setServices(data);
      } catch {
        toast.error("Failed to load services");
      } finally {
        setServicesLoading(false);
      }
    };

    loadServices();
  }, []);

  // Added: Clear error when selecting service
  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    if (formErrors.service) {
      setFormErrors(prev => ({ ...prev, service: "" }));
    }
  };

  // Added: Clear error when selecting date
  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    if (formErrors.date) {
      setFormErrors(prev => ({ ...prev, date: "" }));
    }
    // Reset time when date changes
    setSelectedTime("");
  };

  // Added: Clear error when selecting time
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (formErrors.time) {
      setFormErrors(prev => ({ ...prev, time: "" }));
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[56vh] min-h-[420px] max-h-[620px] overflow-hidden bg-primary text-primary-foreground">
        <Navbar />
        <div className="absolute inset-0">
          <img
            src={heroAppointment}
            alt="Book Appointment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/60" />
        </div>
        <div className="absolute inset-0 z-10 flex items-center px-6 pt-20">
          <div className="container mx-auto">
            <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-8 h-px bg-primary-foreground/60" />
              <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase">
                Personal Service
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-primary-foreground"
            >
              Book an Appointment
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-primary-foreground/80 text-lg leading-relaxed max-w-2xl"
            >
              Experience personalized styling services at our flagship boutique.
            </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-16">
            {/* SERVICE SELECT */}
            <div ref={serviceSectionRef}>
              <h2 className="font-serif text-2xl mb-8">Select Service *</h2>
              {formErrors.service && (
                <p className="text-red-500 text-sm mb-2">{formErrors.service}</p>
              )}
              {servicesLoading ? (
                <p className="text-gray-500">Loading services…</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceSelect(service)}
                      className={`p-8 border text-left transition-all rounded-lg
                        ${
                          selectedService === service
                            ? "border-[#6E9F7D] bg-[#6E9F7D]/10"
                            : "hover:border-black/40"
                        }
                        ${formErrors.service ? "border-red-200" : ""}
                      `}
                    >
                      <Sparkles className="w-8 h-8 text-[#6E9F7D] mb-5" />

                      <h3 className="font-medium mb-2">
                        {formatServiceName(service)}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Premium personalized service
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DATE */}
            <div ref={dateSectionRef}>
              <h2 className="font-serif text-2xl mb-8">Select Date *</h2>
              {formErrors.date && (
                <p className="text-red-500 text-sm mb-2">{formErrors.date}</p>
              )}
              <div className="flex gap-3 overflow-auto pb-2">
                {getAvailableDates().map((date) => {
                  const dateStr = date.toISOString().split("T")[0];
                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => handleDateSelect(dateStr)}
                      className={`px-5 py-4 border min-w-[110px] rounded-md
                        ${formErrors.date ? "border-red-200" : ""}
                        ${
                          selectedDate === dateStr
                            ? "border-[#6E9F7D] bg-[#6E9F7D]/10"
                            : "hover:border-black/40"
                        }`}
                    >
                      <p className="text-sm">{formatDate(date)}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TIME */}
            <div ref={timeSectionRef}>
              <h2 className="font-serif text-2xl mb-8">Select Time *</h2>
              {formErrors.time && (
                <p className="text-red-500 text-sm mb-2">{formErrors.time}</p>
              )}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {availableSlots.length === 0 ? (
                  <p className="col-span-full text-sm text-gray-500">
                    No slots available for this date
                  </p>
                ) : (
                  availableSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`px-3 py-3 border text-xs tracking-wide transition rounded-md
                        ${formErrors.time ? "border-red-200" : ""}
                        ${
                          selectedTime === time
                            ? "border-[#6E9F7D] bg-[#6E9F7D]/10"
                            : "hover:border-black/40"
                        }
                      `}
                    >
                      {time}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* USER INFO */}
            <div>
              <h2 className="font-serif text-2xl mb-8">Your Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-2 text-gray-800">
                    Full Name *
                  </label>
                  <input
                    ref={nameInputRef}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full h-14 px-5 rounded-md
                      bg-[#F4EBE6] 
                      border
                      text-gray-900 
                      placeholder-gray-500 
                      focus:border-[#6E9F7D] 
                      focus:bg-[#F8F1ED]
                      outline-none transition
                      ${formErrors.name ? "border-red-500" : "border-[#E2D6CF]"}
                    `}
                    placeholder="Your name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs tracking-widest uppercase block mb-2 text-gray-800">
                    Email *
                  </label>
                  <input
                    ref={emailInputRef}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full h-14 px-5 rounded-md
                      bg-[#F4EBE6] 
                      border
                      text-gray-900 
                      placeholder-gray-500 
                      focus:border-[#6E9F7D] 
                      focus:bg-[#F8F1ED]
                      outline-none transition
                      ${formErrors.email ? "border-red-500" : "border-[#E2D6CF]"}
                    `}
                    placeholder="example@email.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs tracking-widest uppercase block mb-2 text-gray-800">
                    Phone *
                  </label>
                  <input
                    ref={phoneInputRef}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
  inputMode="numeric"
  pattern="[0-9]{10}"
                    className={`w-full h-14 px-5 rounded-md
                      bg-[#F4EBE6] 
                      border
                      text-gray-900 
                      placeholder-gray-500 
                      focus:border-[#6E9F7D] 
                      focus:bg-[#F8F1ED]
                      outline-none transition
                      ${formErrors.phone ? "border-red-500" : "border-[#E2D6CF]"}
                    `}
                    placeholder="+91 9876543210"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

             <div className="mt-6">
                <label className="text-xs tracking-widest uppercase block mb-2 text-gray-800">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any special requests or preferences..."
                  className="w-full px-5 py-4 rounded-md
                    bg-[#F4EBE6] 
                    border border-[#E2D6CF] 
                    text-gray-900 
                    placeholder-gray-500 
                    focus:border-[#6E9F7D] 
                    focus:bg-[#F8F1ED]
                    outline-none transition"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={loading}
                className="px-14 py-5 bg-[#6E9F7D] text-black uppercase tracking-wide flex items-center gap-3 justify-center hover:bg-[#628c71] transition shadow-[0_0_25px_#00000040] rounded-md"
              >
                {loading ? "Booking..." : (
                  <>
                    <Clock className="w-4 h-4" />
                    Confirm Appointment
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 mt-6 mb-24 text-center">
                All fields marked with * are mandatory
              </p>
            </div>
          </form>
        </div>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative bg-white rounded-2xl max-w-lg w-full p-10 text-center shadow-2xl overflow-hidden"
            >
              {/* CONFETTI DOTS */}
              <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle,#6E9F7D_1px,transparent_1px)] bg-[length:20px_20px]" />

              {/* CHECK ICON */}
              <div className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-full border-4 border-green-500 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* TITLE */}
              <h2 className="relative z-10 text-3xl font-serif font-semibold mb-2 text-gray-900">
                Appointment Booked Successfully
              </h2>

              <p className="relative z-10 text-gray-600 mb-8">
                Thank you for patronizing us today. <br />
                We value you!
              </p>

              {/* CTA */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="relative z-10 px-10 py-3 bg-[#6E9F7D] text-white rounded-md font-medium hover:bg-[#628c71] transition"
              >
                Return Home
              </button>
            </motion.div>
          </div>
        )}
        <Footer />
      </section>
    </div>
  );
}
