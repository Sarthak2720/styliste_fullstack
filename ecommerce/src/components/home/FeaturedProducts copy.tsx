// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowRight } from "lucide-react";

// /* ================= ASSET IMPORTS ================= */
// // ⚠️ Adjust paths if your file structure differs
// import westernFront from "../../assets/western-gown.jpg";
// import westernBack from "../../assets/western-gown-back.jpg";

// import lehengaFront from "../../assets/lehnga-front.jpg";
// import lehengaBack from "../../assets/lehnga-back.jpg";

// import sareeFront from "../../assets/saree-gown.jpg";
// import sareeBack from "../../assets/saree-gown-back.jpg";

// import blouseFront from "../../assets/baluse-front.png";
// import blouseBack from "../../assets/blause-back.jpg";

// /* ================= PRODUCT DATA ================= */
// const featuredProducts = [
//   {
//     id: 1,
//     name: "Indo-Western Gown",
//     price: "₹12,500",
//     frontImage: westernFront,
//     backImage: westernBack,
//   },
//   {
//     id: 2,
//     name: "Bridal Lehenga",
//     price: "₹28,000",
//     frontImage: lehengaFront,
//     backImage: lehengaBack,
//   },
//   {
//     id: 3,
//     name: "Saree Conversion Dress",
//     price: "₹9,800",
//     frontImage: sareeFront,
//     backImage: sareeBack,
//   },
//   {
//     id: 4,
//     name: "Designer Blouse",
//     price: "₹4,500",
//     frontImage: blouseFront,
//     backImage: blouseBack,
//   },
// ];

// /* ================= COMPONENT ================= */
// export const FeaturedProducts = () => {
//   return (
//     <section className="py-28 md:py-40 bg-[hsl(var(--primary))]">
//       <div className="container mx-auto px-6">

//         {/* ================= HEADER ================= */}
//         <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
//           <div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center gap-4 mb-4"
//             >
//               <div className="w-10 h-px bg-white/60" />
//               <p className="text-white/70 tracking-[0.35em] text-xs uppercase">
//                 Our Collection
//               </p>
//             </motion.div>

//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-5xl md:text-6xl text-white"
//             >
//               Featured{" "}
//               <span className="italic text-white/50">
//                 Products
//               </span>
//             </motion.h2>
//           </div>

//           {/* ================= CTA ================= */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="mt-6 md:mt-0"
//           >
//             <Link
//               to="/shop"
//               className="group inline-flex items-center gap-3
//                          rounded-full border border-white/40
//                          px-7 py-3 text-white
//                          backdrop-blur-sm
//                          transition-all duration-300
//                          hover:bg-white/10"
//             >
//               View All Products
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </Link>
//           </motion.div>
//         </div>

//         {/* ================= PRODUCTS GRID ================= */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//           {featuredProducts.map((product, index) => (
//             <motion.div
//               key={product.id}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.12 }}
//               // whileHover={{ y: -10 }}
//               className="group"
//             >
// <div className="relative w-full h-[420px] overflow-hidden rounded-2xl">

//   {/* BACK IMAGE */}
//   <img
//     src={product.backImage}
//     alt={`${product.name} back`}
//     className="
//       absolute inset-0 w-full h-full object-cover
//       opacity-0 scale-100
//       transition-all duration-[900ms]
//       ease-[cubic-bezier(0.4,0,0.2,1)]
//       group-hover:opacity-100 group-hover:scale-110
//     "
//   />

//   {/* FRONT IMAGE */}
//   <img
//     src={product.frontImage}
//     alt={`${product.name} front`}
//     className="
//       absolute inset-0 w-full h-full object-cover
//       opacity-100 scale-100
//       transition-all duration-[900ms]
//       ease-[cubic-bezier(0.4,0,0.2,1)]
//       group-hover:opacity-0 group-hover:scale-110
//     "
//   />

// </div>

//               {/* PRODUCT INFO */}
//               <div className="mt-5">
//                 <h3 className="font-serif text-xl text-white mb-1">
//                   {product.name}
//                 </h3>
//                 <p className="text-white/60 text-sm">
//                   {product.price}
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
import { ArrowRight } from "lucide-react";

/* ================= ASSET IMPORTS ================= */
import westernFront from "../../assets/western-gown.jpg";
import westernBack from "../../assets/western-gown-back.jpg";

import lehengaFront from "../../assets/lehnga-front.jpg";
import lehengaBack from "../../assets/lehnga-back.jpg";

import sareeFront from "../../assets/saree-gown.jpg";
import sareeBack from "../../assets/saree-gown-back.jpg";

import blouseFront from "../../assets/baluse-front.png";
import blouseBack from "../../assets/blause-back.jpg";

/* ================= PRODUCT DATA ================= */
const featuredProducts = [
  {
    id: 1,
    name: "Indo-Western Gown",
    price: "₹12,500",
    frontImage: westernFront,
    backImage: westernBack,
  },
  {
    id: 2,
    name: "Bridal Lehenga",
    price: "₹28,000",
    frontImage: lehengaFront,
    backImage: lehengaBack,
  },
  {
    id: 3,
    name: "Saree Conversion Dress",
    price: "₹9,800",
    frontImage: sareeFront,
    backImage: sareeBack,
  },
  {
    id: 4,
    name: "Designer Blouse",
    price: "₹4,500",
    frontImage: blouseFront,
    backImage: blouseBack,
  },
];

/* ================= COMPONENT ================= */
export const FeaturedProducts = () => {
  return (
    <section className="py-28 md:py-40 bg-[hsl(var(--primary))] overflow-hidden">
      <div className="container mx-auto px-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">

          {/* LEFT HEADER */}
          <motion.div
            initial={{ opacity: 0, x: -120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-px bg-white/60" />
              <p className="text-white/70 tracking-[0.35em] text-xs uppercase">
                Our Collection
              </p>
            </div>

            <h2 className="font-serif text-5xl md:text-6xl text-white">
              Featured{" "}
              <span className="italic text-white/50">
                Products
              </span>
            </h2>
          </motion.div>

          {/* RIGHT CTA */}
          <motion.div
            initial={{ opacity: 0, x: 120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            className="mt-6 md:mt-0"
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-3
                         rounded-full border border-white/40
                         px-7 py-3 text-white
                         backdrop-blur-sm
                         transition-all duration-300
                         hover:bg-white/10"
            >
              View All Products
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ================= PRODUCTS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -100 : 100,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.9,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              className="group"
            >
              <div className="relative w-full h-[420px] overflow-hidden rounded-2xl">

                {/* BACK IMAGE */}
                <img
                  src={product.backImage}
                  alt={`${product.name} back`}
                  className="
                    absolute inset-0 w-full h-full object-cover
                    opacity-0
                    transition-all duration-[900ms]
                    ease-[cubic-bezier(0.4,0,0.2,1)]
                    group-hover:opacity-100 group-hover:scale-110
                  "
                />

                {/* FRONT IMAGE */}
                <img
                  src={product.frontImage}
                  alt={`${product.name} front`}
                  className="
                    absolute inset-0 w-full h-full object-cover
                    opacity-100
                    transition-all duration-[900ms]
                    ease-[cubic-bezier(0.4,0,0.2,1)]
                    group-hover:opacity-0 group-hover:scale-110
                  "
                />
              </div>

              {/* PRODUCT INFO */}
              <div className="mt-5">
                <h3 className="font-serif text-xl text-white mb-1">
                  {product.name}
                </h3>
                <p className="text-white/60 text-sm">
                  {product.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
