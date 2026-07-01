// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { Scissors, Ruler, Sparkles, ChevronRight } from "lucide-react";

// const features = [
//   {
//     icon: Scissors,
//     title: "Expert Tailoring",
//     description: "Precision cutting and stitching by experienced artisans with years of expertise in custom fashion.",
//   },
//   {
//     icon: Ruler,
//     title: "Perfect Fitting",
//     description: "Personalized measurements and multiple trial sessions to ensure your outfit fits like a dream.",
//   },
//   {
//     icon: Sparkles,
//     title: "Premium Fabrics",
//     description: "Carefully curated collection of finest quality fabrics from trusted suppliers across the country.",
//   },
// ];

// export const WhyChooseUs = () => {
//   return (
//     <section className="py-28 md:py-40 bg-card relative overflow-hidden">
//       {/* Background decorations */}
//       <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
//       <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      
//       <div className="container mx-auto px-6 relative z-10">
//         <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
//           <div className="text-center md:text-left">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center justify-center md:justify-start gap-4 mb-4"
//             >
//               <div className="w-8 h-px bg-primary" />
//               <p className="text-primary font-sans tracking-[0.3em] text-xs uppercase">
//                 Why STYLISTE
//               </p>
//               <div className="w-8 h-px bg-primary" />
//             </motion.div>
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4"
//             >
//               Why Women Trust Us For
//               <br />
//               Their Fashion Needs
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.2 }}
//               className="text-muted-foreground max-w-xl"
//             >
//               Experience excellence in every stitch with our premium boutique services
//             </motion.p>
//           </div>
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="mt-6 md:mt-0"
//           >
//             <Link 
//               to="/about" 
//               className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium group"
//             >
//               View All
//               <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </Link>
//           </motion.div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <motion.div
//               key={feature.title}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.1 }}
//               whileHover={{ y: -8, transition: { duration: 0.3 } }}
//               className="group relative bg-background rounded-xl p-8 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-500"
//             >
//               {/* Gradient overlay on hover */}
//               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              
//               <div className="relative z-10">
//                 <motion.div
//                   whileHover={{ rotate: 10, scale: 1.1 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                   className="w-16 h-16 mb-6 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors"
//                 >
//                   <feature.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
//                 </motion.div>
//                 <h3 className="font-serif text-2xl mb-3 group-hover:text-primary transition-colors">
//                   {feature.title}
//                 </h3>
//                 <p className="text-muted-foreground leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Scissors, Ruler, Sparkles, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Scissors,
    title: "Expert Tailoring",
    description:
      "Precision cutting and stitching by experienced artisans with years of expertise in custom fashion.",
  },
  {
    icon: Ruler,
    title: "Perfect Fitting",
    description:
      "Personalized measurements and multiple trial sessions to ensure your outfit fits like a dream.",
  },
  {
    icon: Sparkles,
    title: "Premium Fabrics",
    description:
      "Carefully curated collection of finest quality fabrics from trusted suppliers across the country.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-28 md:py-40 bg-card relative overflow-hidden">
      {/* Ambient background motion */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.3, 1, 1.3], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center md:justify-start gap-4 mb-4"
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "2rem" }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="h-px bg-primary"
              />
              <p className="text-primary font-sans tracking-[0.3em] text-xs uppercase">
                Why Styliste Couturier
              </p>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "2rem" }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="h-px bg-primary"
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4"
            >
              Why Women Trust Us For
              <br />
              Their Fashion Needs
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="text-muted-foreground max-w-xl"
            >
              Experience excellence in every stitch with our premium boutique
              services
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 md:mt-0"
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium group"
            >
              View All
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* FEATURES */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.18,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.96 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              }}
              whileHover={{
                y: -12,
                boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
              }}
              className="group relative bg-background rounded-xl p-8 border border-border hover:border-primary/30 transition-all duration-500"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ rotate: 12, scale: 1.12 }}
                  className="w-16 h-16 mb-6 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                >
                  <feature.icon
                    className="w-8 h-8 text-primary"
                    strokeWidth={1.5}
                  />
                </motion.div>

                <h3 className="font-serif text-2xl mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
