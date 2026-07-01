// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowRight, Sparkles } from "lucide-react";

// export const AboutIntro = () => {
//   return (
//     <section className="py-24 md:py-32 bg-primary text-white relative overflow-hidden">
//       {/* Background decorations */}
//       <motion.div
//         animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
//         transition={{ duration: 8, repeat: Infinity }}
//         className="absolute top-20 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
//       />
//       <motion.div
//         animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
//         transition={{ duration: 10, repeat: Infinity }}
//         className="absolute bottom-20 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
//       />

//       <div className="container mx-auto px-6 relative z-10">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           {/* Image */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="relative"
//           >
//             <div className="relative">
//               <motion.div
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 whileInView={{ scale: 1, opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.2, duration: 0.6 }}
//                 className="absolute -top-6 -left-6 w-32 h-32 border-2 border-white/30 rounded-tl-3xl"
//               />
//               <motion.div
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 whileInView={{ scale: 1, opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.3, duration: 0.6 }}
//                 className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-white/30 rounded-br-3xl"
//               />

//               <div className="relative overflow-hidden rounded-2xl">
//                 <img
//                   src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
//                   alt="STYLISTE Boutique"
//                   className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
//               </div>

//               {/* Experience badge */}
//               <motion.div
//                 initial={{ scale: 0, rotate: -10 }}
//                 whileInView={{ scale: 1, rotate: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
//                 className="absolute -bottom-8 -right-4 md:right-8 bg-white text-primary px-6 py-4 rounded-xl shadow-lg"
//               >
//                 <div className="text-center">
//                   <span className="font-serif text-4xl font-bold">7+</span>
//                   <p className="text-xs tracking-wide uppercase mt-1">
//                     Years Experience
//                   </p>
//                 </div>
//               </motion.div>
//             </div>
//           </motion.div>

//           {/* Content */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center gap-4 mb-4"
//             >
//               <div className="w-8 h-px bg-white/60" />
//               <p className="text-white/80 tracking-[0.3em] text-xs uppercase flex items-center gap-2">
//                 <Sparkles className="w-4 h-4" />
//                 About STYLISTE
//               </p>
//             </motion.div>

//             <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight text-white">
//               Where Tradition Meets
//               <br />
//               <span className="italic text-white/70">Modern Elegance</span>
//             </h2>

//             <p className="text-white/80 text-lg leading-relaxed mb-6">
//               Founded by{" "}
//               <strong className="text-white">Swanand Madhav Oak</strong>, STYLISTE
//               COUTURIER is dedicated to helping every woman, regardless of age,
//               feel confident in fashionable clothing thoughtfully designed to
//               complement her unique body type.
//             </p>

//             <p className="text-white/70 leading-relaxed mb-8">
//               Our USP is transforming old sarees into stunning western &
//               Indo-western dresses with our unique doorstep pickup and
//               measurement service in Thane & Mulund areas. With 7+ years of
//               industry experience and a passionate team, we bring your fashion
//               dreams to life.
//             </p>

//             <div className="grid grid-cols-2 gap-6 mb-10">
//               <motion.div
//                 whileHover={{ y: -5 }}
//                 className="bg-white/10 p-5 rounded-xl border border-white/20"
//               >
//                 <h4 className="font-serif text-2xl text-white mb-1">B2C</h4>
//                 <p className="text-sm text-white/70">
//                   Custom garments, alterations & bespoke tailoring
//                 </p>
//               </motion.div>

//               <motion.div
//                 whileHover={{ y: -5 }}
//                 className="bg-white/10 p-5 rounded-xl border border-white/20"
//               >
//                 <h4 className="font-serif text-2xl text-white mb-1">B2B</h4>
//                 <p className="text-sm text-white/70">
//                   Samples for fashion designers & brands
//                 </p>
//               </motion.div>
//             </div>

//             <Link
//               to="/about"
//               className="group inline-flex items-center gap-3 rounded-xl
//                          bg-white px-8 py-4 text-primary
//                          font-medium tracking-wide
//                          transition-all duration-300
//                          hover:bg-white/90 hover:shadow-lg"
//             >
//               Read More About Us
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
//             </Link>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export const AboutIntro = () => {
  return (
    <section className="py-24 md:py-32 bg-primary text-white relative overflow-hidden">
      {/* 🌫 Ambient Background Motion */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.3, 1, 1.3], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* 🖼 IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <motion.div
              whileHover={{ rotateX: 4, rotateY: -4 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="relative"
            >
              {/* Corner Frames */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute -top-6 -left-6 w-32 h-32 border-2 border-white/30 rounded-tl-3xl"
              />
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-white/30 rounded-br-3xl"
              />

              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl">
                <motion.img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Styliste Couturier Boutique"
                  className="w-full h-[500px] object-cover"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Light Sweep */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Experience Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                whileInView={{ scale: 1, rotate: 0 }}
                animate={{ scale: [1, 1.06, 1] }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.6,
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-8 -right-4 md:right-8 bg-white text-primary px-6 py-4 rounded-xl shadow-lg"
              >
                <div className="text-center">
                  <span className="font-serif text-4xl font-bold">7+</span>
                  <p className="text-xs tracking-wide uppercase mt-1">
                    Years Experience
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* 📝 CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-8 h-px bg-white/60" />
              <p className="text-white/80 tracking-[0.3em] text-xs uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                About Styliste Couturier
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight text-white"
            >
              Where Tradition Meets
              <br />
              <span className="italic text-white/70">Modern Elegance</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="text-white/80 text-lg leading-relaxed mb-6"
            >
              Founded by{" "}
              <strong className="text-white">Swanand Madhav Oak</strong>, STYLISTE
              COUTURIER is dedicated to helping every woman, regardless of age,
              feel confident in fashionable clothing thoughtfully designed to
              complement her unique body type.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="text-white/70 leading-relaxed mb-8"
            >
              Our USP is transforming old sarees into stunning western &
              Indo-western dresses with our unique doorstep pickup and
              measurement service in Thane & Mulund areas. With 7+ years of
              industry experience and a passionate team, we bring your fashion
              dreams to life.
            </motion.p>

            {/* B2C / B2B */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {[["B2C", "Custom garments, alterations & bespoke tailoring"],
                ["B2B", "Samples for fashion designers & brands"]].map(
                ([title, desc], i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="bg-white/10 p-5 rounded-xl border border-white/20"
                  >
                    <h4 className="font-serif text-2xl text-white mb-1">
                      {title}
                    </h4>
                    <p className="text-sm text-white/70">{desc}</p>
                  </motion.div>
                )
              )}
            </div>

            {/* CTA */}
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 rounded-xl
                         bg-white px-8 py-4 text-primary
                         font-medium tracking-wide
                         transition-all duration-300
                         hover:bg-white/90 hover:shadow-xl"
            >
              Read More About Us
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
