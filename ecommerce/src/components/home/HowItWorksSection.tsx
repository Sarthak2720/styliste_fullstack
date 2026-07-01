// import { motion } from "framer-motion";
// import { MessageCircle, Ruler, Scissors, Truck, Sparkles } from "lucide-react";

// const steps = [
//   {
//     number: "01",
//     icon: MessageCircle,
//     title: "Consultation",
//     description: "Book an appointment online or call us. Share your requirements, design ideas, and occasion details.",
//   },
//   {
//     number: "02",
//     icon: Ruler,
//     title: "Measurement",
//     description: "We visit your doorstep for precise measurements in Thane & Mulund, or visit our boutique.",
//   },
//   {
//     number: "03",
//     icon: Scissors,
//     title: "Crafting",
//     description: "Our expert team crafts your outfit with premium fabrics and meticulous attention to every detail.",
//   },
//   {
//     number: "04",
//     icon: Truck,
//     title: "Delivery",
//     description: "Receive your perfectly fitted outfit at your doorstep. Express 48-hour delivery available!",
//   },
// ];

// export const HowItWorksSection = () => {
//   return (
//     <section className="py-24 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
//       {/* Background pattern */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-0 left-0 w-full h-full" style={{
//           backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)`,
//           backgroundSize: '40px 40px',
//         }} />
//       </div>

//       <div className="container mx-auto px-6 relative z-10">
//         <div className="text-center mb-16">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex items-center justify-center gap-4 mb-4"
//           >
//             <div className="w-8 h-px bg-primary-foreground/60" />
//             <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase flex items-center gap-2">
//               <Sparkles className="w-4 h-4" />
//               Our Process
//             </p>
//             <div className="w-8 h-px bg-primary-foreground/60" />
//           </motion.div>
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 text-primary-foreground"
//           >
//             How It <span className="italic text-accent">Works</span>
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="text-primary-foreground/80 max-w-xl mx-auto"
//           >
//             A simple and seamless journey from your idea to the perfect outfit
//           </motion.p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {steps.map((step, index) => (
//             <motion.div
//               key={step.number}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.15 }}
//               className="relative group"
//             >
//               {/* Connection line */}
//               {index < steps.length - 1 && (
//                 <div className="hidden lg:block absolute top-16 left-[60%] w-full h-px bg-gradient-to-r from-primary-foreground/30 to-transparent z-0" />
//               )}

//               <div className="relative z-10 text-center">
//                 {/* Number badge */}
//                 <motion.div
//                   initial={{ scale: 0.8 }}
//                   whileInView={{ scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.15 + 0.2, type: "spring" }}
//                   className="relative inline-block mb-6"
//                 >
//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: 5 }}
//                     className="w-20 h-20 mx-auto bg-primary-foreground/10 rounded-2xl flex items-center justify-center group-hover:bg-primary-foreground transition-all duration-500 group-hover:shadow-lg"
//                   >
//                     <step.icon className="w-10 h-10 text-primary-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
//                   </motion.div>
//                   <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground text-sm font-bold rounded-full flex items-center justify-center shadow-md">
//                     {step.number}
//                   </span>
//                 </motion.div>

//                 <h3 className="font-serif text-2xl mb-3 text-primary-foreground group-hover:text-accent transition-colors">
//                   {step.title}
//                 </h3>
//                 <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-[250px] mx-auto">
//                   {step.description}
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
import { MessageCircle, Ruler, Scissors, Truck, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Consultation",
    description:
      "Book an appointment online or call us. Share your requirements, design ideas, and occasion details.",
  },
  {
    number: "02",
    icon: Ruler,
    title: "Measurement",
    description:
      "We visit your doorstep for precise measurements in Thane & Mulund, or visit our boutique.",
  },
  {
    number: "03",
    icon: Scissors,
    title: "Crafting",
    description:
      "Our expert team crafts your outfit with premium fabrics and meticulous attention to every detail.",
  },
  {
    number: "04",
    icon: Truck,
    title: "Delivery",
    description:
      "Receive your perfectly fitted outfit at your doorstep. Express 48-hour delivery available!",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const stepVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.85,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
    },
  },
};

export const HowItWorksSection = () => {
  return (
    <section className="py-24 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-primary-foreground/60" />
            <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Our Process
            </p>
            <div className="w-8 h-px bg-primary-foreground/60" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
            How It <span className="italic text-accent">Works</span>
          </h2>

          <p className="text-primary-foreground/80 max-w-xl mx-auto">
            A simple and seamless journey from your idea to the perfect outfit
          </p>
        </motion.div>

        {/* STEPS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="relative group"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-px bg-gradient-to-r from-primary-foreground/30 to-transparent z-0" />
              )}

              <div className="relative z-10 text-center">
                {/* ICON BLOCK */}
                <div className="relative inline-block mb-6">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-20 h-20 mx-auto bg-primary-foreground/10 rounded-2xl flex items-center justify-center group-hover:bg-primary-foreground transition-all duration-500 shadow-lg"
                  >
                    <step.icon
                      className="w-10 h-10 text-primary-foreground group-hover:text-primary transition-colors"
                      strokeWidth={1.5}
                    />
                  </motion.div>

                  {/* NUMBER */}
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: index * 0.25 + 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground text-sm font-bold rounded-full flex items-center justify-center shadow-md"
                  >
                    {step.number}
                  </motion.span>
                </div>

                <h3 className="font-serif text-2xl mb-3 group-hover:text-accent transition-colors">
                  {step.title}
                </h3>

                <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-[250px] mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
