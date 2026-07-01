// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   Calendar,
//   Phone,
//   MapPin,
//   Clock,
//   ArrowRight,
//   Sparkles,
// } from "lucide-react";

// export const BookAppointmentSection = () => {
//   return (
//     <section className="py-24 md:py-32 bg-primary text-white relative overflow-hidden">
//       {/* Decorative elements */}
//       <motion.div
//         animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
//         transition={{ duration: 8, repeat: Infinity }}
//         className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
//       />
//       <motion.div
//         animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
//         transition={{ duration: 10, repeat: Infinity }}
//         className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
//       />

//       <div className="container mx-auto px-6 relative z-10">
//         <div className="max-w-4xl mx-auto text-center">
//           {/* Heading */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex items-center justify-center gap-4 mb-4"
//           >
//             <div className="w-8 h-px bg-white/60" />
//             <p className="text-white/80 tracking-[0.3em] text-xs uppercase flex items-center gap-2">
//               <Sparkles className="w-4 h-4" />
//               Get Started
//             </p>
//             <div className="w-8 h-px bg-white/60" />
//           </motion.div>

//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6"
//           >
//             Ready to Transform
//             <br />
//             <span className="italic text-white/70">Your Style?</span>
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="text-white/80 text-lg max-w-2xl mx-auto mb-10"
//           >
//             Book your personalized consultation today. We offer doorstep service
//             in Thane & Mulund areas, or visit our boutique for a complete fashion
//             experience.
//           </motion.p>

//           {/* Info Cards */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.3 }}
//             className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
//           >
//             {[
//               { icon: Phone, label: "Call Us", value: "+91 7020601937" },
//               { icon: Clock, label: "Working Hours", value: "Tue–Sun: 11–8" },
//               { icon: MapPin, label: "Location", value: "Thane West" },
//               { icon: Calendar, label: "Express", value: "48 Hrs Delivery" },
//             ].map(({ icon: Icon, label, value }) => (
//               <motion.div
//                 key={label}
//                 whileHover={{ y: -5 }}
//                 className="bg-white/10 p-5 rounded-xl border border-white/20"
//               >
//                 <Icon className="w-6 h-6 mx-auto mb-2" strokeWidth={1.5} />
//                 <p className="text-sm text-white/70">{label}</p>
//                 <p className="font-serif text-lg">{value}</p>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* CTA Buttons (INLINE LINKS) */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.4 }}
//             className="flex flex-col sm:flex-row gap-4 justify-center"
//           >
//             {/* Primary CTA */}
//             <Link
//               to="/appointment"
//               className="group inline-flex items-center justify-center gap-2
//                          rounded-xl bg-white px-8 py-4 text-primary
//                          font-medium tracking-wide
//                          transition-all duration-300
//                          hover:bg-white/90 hover:shadow-lg"
//             >
//               <Calendar className="w-5 h-5" strokeWidth={1.5} />
//               Book Appointment Now
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </Link>

//             {/* Secondary CTA */}
//             <a
//               href="tel:+917020601937"
//               className="group inline-flex items-center justify-center gap-2
//                          rounded-xl border border-white/40 px-8 py-4
//                          text-white font-medium tracking-wide
//                          transition-all duration-300
//                          hover:bg-white/10"
//             >
//               <Phone className="w-5 h-5" strokeWidth={1.5} />
//               Call: +91 7020601937
//             </a>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const BookAppointmentSection = () => {
  return (
    <section className="py-24 md:py-32 bg-primary text-white relative overflow-hidden">
      {/* Decorative elements (unchanged floating) */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small Heading → FROM TOP */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="w-8 h-px bg-white/60" />
            <p className="text-white/80 tracking-[0.3em] text-xs uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Get Started
            </p>
            <div className="w-8 h-px bg-white/60" />
          </motion.div>

          {/* Main Heading → FROM LEFT */}
          <motion.h2
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6"
          >
            Ready to Transform
            <br />
            <span className="italic text-white/70">Your Style?</span>
          </motion.h2>

          {/* Paragraph → FROM RIGHT */}
          <motion.p
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-white/80 text-lg max-w-2xl mx-auto mb-10"
          >
            Book your personalized consultation today. We offer doorstep service
            in Thane & Mulund areas, or visit our boutique for a complete fashion
            experience.
          </motion.p>

          {/* INFO CARDS → FROM ALL SIDES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Phone, label: "Call Us", value: "+91 7020601937", from: { x: -80 } },
              { icon: Clock, label: "Working Hours", value: "Tue–Sun: 11–8", from: { y: -80 } },
              { icon: MapPin, label: "Location", value: "Thane West", from: { y: 80 } },
              { icon: Calendar, label: "Express", value: "48 Hrs Delivery", from: { x: 80 } },
            ].map(({ icon: Icon, label, value, from }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, ...from }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{
                  duration: 1,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -6 }}
                className="bg-white/10 p-5 rounded-xl border border-white/20"
              >
                <Icon className="w-6 h-6 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-sm text-white/70">{label}</p>
                <p className="font-serif text-lg">{value}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA BUTTONS → FROM BOTTOM */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/appointment"
              className="group inline-flex items-center justify-center gap-2
                         rounded-xl bg-white px-8 py-4 text-primary
                         font-medium tracking-wide
                         transition-all duration-300
                         hover:bg-white/90 hover:shadow-lg"
            >
              <Calendar className="w-5 h-5" strokeWidth={1.5} />
              Book Appointment Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="tel:+917020601937"
              className="group inline-flex items-center justify-center gap-2
                         rounded-xl border border-white/40 px-8 py-4
                         text-white font-medium tracking-wide
                         transition-all duration-300
                         hover:bg-white/10"
            >
              <Phone className="w-5 h-5" strokeWidth={1.5} />
              Call: +91 7020601937
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

