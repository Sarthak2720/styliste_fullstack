// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowUpRight, Sparkles, Scissors, Palette, RefreshCw, ChevronRight } from "lucide-react";
// import serviceTailoring from "../../assets/service-tailoring.jpg";
// import serviceDesigning from "../../assets/service-designing.jpg";
// import serviceSareeTransform from "../../assets/service-saree-transform.jpg";

// const services = [
//   {
//     id: 1,
//     icon: Scissors,
//     title: "Bespoke Tailoring",
//     description: "Custom-made garments crafted to your exact measurements with premium fabrics. Doorstep service available.",
//     image: serviceTailoring,
//     link: "/services",
//     badge: "Doorstep Service",
//   },
//   {
//     id: 2,
//     icon: Palette,
//     title: "Fashion Designing",
//     description: "Unique designs tailored to your preferences, body type, and occasion. From bridal to party wear.",
//     image: serviceDesigning,
//     link: "/services",
//     badge: "Custom Designs",
//   },
//   {
//     id: 3,
//     icon: RefreshCw,
//     title: "Saree Transformation",
//     description: "Transform your treasured sarees into stunning western & Indo-western dresses. Our specialty!",
//     image: serviceSareeTransform,
//     link: "/services",
//     badge: "Our USP",
//   },
// ];

// export const ServicesSection = () => {
//   return (
//     <section className="py-24 md:py-32 bg-background text-foreground relative overflow-hidden">
//       {/* Decorative elements */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 0.1 }}
//         viewport={{ once: true }}
//         className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full"
//       />
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 0.1 }}
//         viewport={{ once: true }}
//         transition={{ delay: 0.2 }}
//         className="absolute bottom-20 right-10 w-48 h-48 border border-accent/20 rounded-full"
//       />

//       <div className="container mx-auto px-6 relative z-10">
//         <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
//           <div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center gap-4 mb-4"
//             >
//               <div className="w-8 h-px bg-primary" />
//               <p className="text-primary font-sans tracking-[0.3em] text-xs uppercase flex items-center gap-2">
//                 <Sparkles className="w-4 h-4" />
//                 What We Offer
//               </p>
//             </motion.div>
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-4xl md:text-5xl lg:text-6xl"
//             >
//               Our <span className="italic text-primary">Services</span>
//             </motion.h2>
//           </div>
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="mt-6 md:mt-0"
//           >
//             <Link 
//               to="/services" 
//               className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium group"
//             >
//               View All
//               <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </Link>
//           </motion.div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {services.map((service, index) => (
//             <motion.div
//               key={service.id}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.1 }}
//               className="group"
//             >
//               <Link
//                 to={service.link}
//                 className="block relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-500"
//               >
//                 <div className="relative h-48 overflow-hidden">
//                   <img
//                     src={service.image}
//                     alt={service.title}
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  
//                   {/* Badge */}
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: 0.3 + index * 0.1 }}
//                     className="absolute top-4 left-4"
//                   >
//                     <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
//                       {service.badge}
//                     </span>
//                   </motion.div>
//                 </div>

//                 <div className="p-6">
//                   <div className="flex items-start justify-between gap-4">
//                     <div>
//                       <motion.div
//                         whileHover={{ rotate: 10 }}
//                         className="w-12 h-12 mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors"
//                       >
//                         <service.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" strokeWidth={1.5} />
//                       </motion.div>
//                       <h3 className="font-serif text-2xl mb-2 group-hover:text-primary transition-colors">
//                         {service.title}
//                       </h3>
//                       <p className="text-muted-foreground text-sm leading-relaxed">
//                         {service.description}
//                       </p>
//                     </div>
//                     <motion.div
//                       whileHover={{ scale: 1.1, rotate: 45 }}
//                       className="w-10 h-10 border border-border rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-300"
//                     >
//                       <ArrowUpRight className="w-4 h-4 group-hover:text-primary-foreground transition-colors" strokeWidth={1.5} />
//                     </motion.div>
//                   </div>
//                 </div>
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Sparkles,
  Scissors,
  Palette,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

import serviceTailoring from "../../assets/service-tailoring.jpg";
import serviceDesigning from "../../assets/service-designing.jpg";
import serviceSareeTransform from "../../assets/service-saree-transform.jpg";

const services = [
  {
    id: 1,
    icon: Scissors,
    title: "Bespoke Tailoring",
    description:
      "Custom-made garments crafted to your exact measurements with premium fabrics. Doorstep service available.",
    image: serviceTailoring,
    link: "/services",
    badge: "Doorstep Service",
  },
  {
    id: 2,
    icon: Palette,
    title: "Fashion Designing",
    description:
      "Unique designs tailored to your preferences, body type, and occasion. From bridal to party wear.",
    image: serviceDesigning,
    link: "/services",
    badge: "Custom Designs",
  },
  {
    id: 3,
    icon: RefreshCw,
    title: "Saree Transformation",
    description:
      "Transform your treasured sarees into stunning western & Indo-western dresses. Our specialty!",
    image: serviceSareeTransform,
    link: "/services",
    badge: "Our USP",
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background text-foreground relative overflow-hidden">
      {/* Decorative elements (unchanged) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true, margin: "-150px" }}
        className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-20 right-10 w-48 h-48 border border-accent/20 rounded-full"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          {/* HEADER FROM LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{
              duration: 1.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-primary" />
              <p className="text-primary font-sans tracking-[0.3em] text-xs uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                What We Offer
              </p>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Our <span className="italic text-primary">Services</span>
            </h2>
          </motion.div>

          {/* CTA FROM RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{
              duration: 1.3,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 md:mt-0"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium group"
            >
              View All
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ================= SERVICES GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const offset =
              index === 0
                ? { x: -80, y: 0 }
                : index === 1
                ? { x: 0, y: 80 }
                : { x: 80, y: 0 };

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, ...offset }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{
                  duration: 1.1,
                  delay: index * 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group"
              >
                <Link
                  to={service.link}
                  className="block relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {service.badge}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <motion.div
                          whileHover={{ rotate: 10 }}
                          className="w-12 h-12 mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors"
                        >
                          <service.icon
                            className="w-6 h-6 text
                            text-primary group-hover:text-primary-foreground transition-colors"
                            strokeWidth={1.5}
                          />
                        </motion.div>
                        <h3 className="font-serif text-2xl mb-2 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 45 }}
                        className="w-10 h-10 border border-border rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-300"
                      >
                        <ArrowUpRight
                          className="w-4 h-4 group-hover:text-primary-foreground transition-colors"
                          strokeWidth={1.5}
                        />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
