// import { useState } from "react";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { ArrowRight } from "lucide-react";

// export const Newsletter = () => {
//   const [email, setEmail] = useState("");
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (email) {
//       toast.success("Welcome to the STYLISTE circle");
//       setEmail("");
//     }
//   };
//   return (
//     <section className="py-28 md:py-40 relative overflow-hidden">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-foreground rounded-full" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-foreground rounded-full" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-foreground rounded-full" />
//       </div>
//       <div className="container mx-auto px-6 relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="max-w-2xl mx-auto text-center"
//         >
//           <div className="flex items-center justify-center gap-4 mb-4">
//             <div className="w-8 h-px bg-sage" />
//             <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//               Stay Connected
//             </p>
//             <div className="w-8 h-px bg-sage" />
//           </div>
//           <h2 className="font-serif text-5xl md:text-6xl mb-6">
//             Join the Circle
//           </h2>
//           <p className="text-muted-foreground mb-12 text-lg leading-relaxed">
//             Be the first to discover new collections, exclusive offers, and curated style inspiration.
//           </p>

//           <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="flex-1 h-14 px-6 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-sage"
//               required
//             />
//             <button type="submit" className="h-14 px-6 bg-sage text-dark-950 font-medium rounded-lg hover:bg-sage/90 transition-colors">
//               Subscribe
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
//             </button>
//           </form>
//           <p className="text-xs text-muted-foreground mt-6 tracking-wide">
//             By subscribing, you agree to our Privacy Policy
//           </p>
//         </motion.div>
//       </div>
//     </section>
//   );
// };



import { /* useState */ } from "react";
import { motion } from "framer-motion";
// import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Newsletter = () => {
  // const [email, setEmail] = useState("");

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (email) {
  //     toast.success("Welcome to the STYLISTE circle");
  //     setEmail("");
  //   }
  // };

  return (
    <>
      {/* CTA Section */}
      <section className="py-28 md:py-40 bg-[#6E9F7D] text-black">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-6xl mb-6"
          >
            Experience Styliste Couturier
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12 text-black/80 leading-relaxed"
          >
            Visit our boutique or schedule a personal styling appointment with one of our experts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/appointment"
              className="px-8 py-4 bg-black text-white font-medium hover:bg-black/90 transition group"
            >
              BOOK APPOINTMENT
              <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/contact"
              className="px-8 py-4 border border-black text-black hover:bg-black/10 transition"
            >
              CONTACT US
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};
