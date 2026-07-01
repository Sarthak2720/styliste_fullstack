// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowUpRight } from "lucide-react";
// import { productApi } from "../../api/productApi";
// // import { categories } from "@/data/products";

// export const Categories = () => {
//   return (
//     <section className="py-28 md:py-40 bg-card">
//       <div className="container mx-auto px-6">
//         <div className="text-center mb-16">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex items-center justify-center gap-4 mb-4"
//           >
//             <div className="w-8 h-px bg-sage" />
//             <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//               Explore
//             </p>
//             <div className="w-8 h-px bg-sage" />
//           </motion.div>
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="font-serif text-5xl md:text-6xl"
//           >
//             Shop by Category
//           </motion.h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {categories.map((category, index) => (
//             <motion.div
//               key={category.id}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.15 }}
//             >
//               <Link
//                 to={`/shop?category=${category.slug}`}
//                 className="group block relative aspect-[3/4] overflow-hidden"
//               >
//                 <img
//                   src={category.image}
//                   alt={category.name}
//                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
//                 <div className="absolute inset-0 flex flex-col justify-end p-8">
//                   <div className="flex items-end justify-between">
//                     <div>
//                       <h3 className="font-serif text-4xl text-foreground mb-2">
//                         {category.name}
//                       </h3>
//                       <span className="text-muted-foreground text-sm tracking-[0.15em] uppercase">
//                         Explore Collection
//                       </span>
//                     </div>
//                     <div className="w-12 h-12 border border-foreground/30 flex items-center justify-center group-hover:bg-sage group-hover:border-sage transition-all">
//                       <ArrowUpRight className="w-5 h-5 group-hover:text-primary-foreground transition-colors" strokeWidth={1.5} />
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </motion.div>
//           )
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };



// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowUpRight } from "lucide-react";
// import { productApi } from "../../api/productApi";
// import toast from "react-hot-toast";

// export const Categories = () => {
//   const [categories, setCategories] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCategoriesFromProducts();
//   }, []);

//   const fetchCategoriesFromProducts = async () => {
//     try {
//       const res = await productApi.searchProducts({
//         page: 0,
//         pageSize: 100,
//       });

//       const list = res.content;

//       // 👉 Build unique categories from product list
//       const uniqueCategories = [
//         ...new Map(
//           list.map((p: any) => [
//             p.category,
//             {
//               id: p.category,
//               name: p.category,
//               slug: p.category,
//               image:
//                 p.images?.[0] ||
//                 "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
//             },
//           ])
//         ).values(),
//       ];

//       setCategories(uniqueCategories);
//     } catch (err) {
//       toast.error("Failed to load categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="py-28 md:py-40 bg-card">
//       <div className="container mx-auto px-6">
//         {/* Heading */}
//         <div className="text-center mb-16">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex items-center justify-center gap-4 mb-4"
//           >
//             <div className="w-8 h-px bg-sage" />
//             <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//               Explore
//             </p>
//             <div className="w-8 h-px bg-sage" />
//           </motion.div>

//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="font-serif text-5xl md:text-6xl"
//           >
//             Shop by Category
//           </motion.h2>
//         </div>

//         {/* Categories Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {loading ? (
//             // Skeleton Loading
//             [...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="aspect-[3/4] bg-secondary animate-pulse rounded"
//               />
//             ))
//           ) : (
//             categories.map((category, index) => (
//               <motion.div
//                 key={category.id}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.15 }}
//               >
//                 <Link
//                   to={`/shop?category=${category.slug}`}
//                   className="group block relative aspect-[3/4] overflow-hidden"
//                 >
//                   <img
//                     src={category.image}
//                     alt={category.name}
//                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                   />

//                   <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

//                   <div className="absolute inset-0 flex flex-col justify-end p-8">
//                     <div className="flex items-end justify-between">
//                       <div>
//                         <h3 className="font-serif text-4xl text-foreground mb-2">
//                           {category.name}
//                         </h3>
//                         <span className="text-muted-foreground text-sm tracking-[0.15em] uppercase">
//                           Explore Collection
//                         </span>
//                       </div>

//                       <div className="w-12 h-12 border border-foreground/30 flex items-center justify-center group-hover:bg-sage group-hover:border-sage transition-all">
//                         <ArrowUpRight
//                           className="w-5 h-5 group-hover:text-primary-foreground transition-colors"
//                           strokeWidth={1.5}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </motion.div>
//             ))
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };


// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowUpRight } from "lucide-react";
// import { productApi } from "../../api/productApi";
// import toast from "react-hot-toast";

// interface CategoryType {
//   id: string;
//   name: string;
//   slug: string;
//   image: string;
//   disabled?: boolean;
// }

// const DEFAULT_CATEGORIES: CategoryType[] = [
//   {
//     id: "women",
//     name: "Women",
//     slug: "Women",
//     image:
//       "https://img.freepik.com/free-photo/attractive-stylish-smiling-woman-choosing-apparel-clothing-store_285396-4642.jpg",
//     disabled: true,
//   },

//   {
//     id: "men",
//     name: "Men",
//     slug: "Men",
//     image:
//       "https://www.shutterstock.com/image-photo/man-clothing-260nw-521350294.jpg",
//     disabled: true,
//   },

//   {
//     id: "kids",
//     name: "Kids",
//     slug: "Kids",
//     image:
//       "https://cdn.prod.website-files.com/641eada4b0bfffd36ddfe298/646dd97df5f28af14e23bbfc_Rectangle%2012%20(1).png",
//     disabled: true,
//   },
// ];


// export const Categories = () => {
//   const [categories, setCategories] = useState<CategoryType[]>(DEFAULT_CATEGORIES);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCategoriesStatus();
//   }, []);

//   const fetchCategoriesStatus = async () => {
//     try {
//       const res = await productApi.searchProducts({
//         page: 0,
//         pageSize: 100,
//       });

//       const list = res.content;

//       const updated = DEFAULT_CATEGORIES.map((cat) => ({
//         ...cat,
//         disabled: !list.some(
//           (p: any) =>
//             p.category?.toLowerCase() === cat.slug.toLowerCase()
//         ),
//       }));

//       setCategories(updated);
//     } catch (err) {
//       toast.error("Failed to load categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="py-28 md:py-40 bg-card">
//       <div className="container mx-auto px-6">

//         {/* Heading */}
//         <div className="text-center mb-16">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="flex items-center justify-center gap-4 mb-4"
//           >
//             <div className="w-8 h-px bg-sage" />
//             <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//               Explore
//             </p>
//             <div className="w-8 h-px bg-sage" />
//           </motion.div>

//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="font-serif text-5xl md:text-6xl"
//           >
//             Shop by Category
//           </motion.h2>
//         </div>

//         {/* Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {loading
//             ? [...Array(3)].map((_, i) => (
//                 <div key={i} className="aspect-[3/4] bg-secondary animate-pulse rounded" />
//               ))
//             : categories.map((category, index) => (
//                 <motion.div
//                   key={category.id}
//                   initial={{ opacity: 0, y: 40 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.15 }}
//                 >
//                   <Link
//                     to={
//                       category.disabled
//                         ? "/products"
//                         : `/products?category=${category.slug}`
//                     }
//                     className="group block relative aspect-[3/4] overflow-hidden"
//                   >
//                     <img
//                       src={category.image}
//                       alt={category.name}
//                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                     />

//                     {/* Gradient */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

//                     <div className="absolute inset-0 flex flex-col justify-end p-8">
//                       <div className="flex items-end justify-between">
//                         <div>
//                           <h3 className="font-serif text-4xl text-white mb-2">
//                             {category.name}
//                           </h3>
//                           <span className="text-gray-300 text-sm tracking-[0.15em] uppercase">
//                             {category.disabled
//                               ? "Explore Collection"
//                               : "Explore Collection"}
//                           </span>
//                         </div>

//                         <div
//                           className={`w-12 h-12 border flex items-center justify-center transition-all 
//                           ${
//                             category.disabled
//                               ? "border-gray-400 cursor-not-allowed"
//                               : "border-white group-hover:bg-sage group-hover:border-sage"
//                           }`}
//                         >
//                           <ArrowUpRight
//                             className={`w-5 h-5 transition-colors 
//                             ${
//                               category.disabled
//                                 ? "text-gray-400"
//                                 : "group-hover:text-black"
//                             }`}
//                             strokeWidth={1.5}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 </motion.div>
//               ))}
//         </div>
//       </div>
//     </section>
//   );
// };


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";
import { categoryApi } from "../../api/categoryApi";

interface CategoryType {
  id: string;
  name: string;
  slug: string;
  image: string;
}

// fallback images if backend doesn’t send image
const FALLBACK_IMAGES: Record<string, string> = {
  Women:
    "https://img.freepik.com/free-photo/attractive-stylish-smiling-woman-choosing-apparel-clothing-store_285396-4642.jpg",
  Men:
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
  Kids:
    "https://cdn.prod.website-files.com/641eada4b0bfffd36ddfe298/646dd97df5f28af14e23bbfc_Rectangle%2012%20(1).png",
};

export const Categories = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories(); // <-- your API
      /**
       * Expected API response example:
       * [
       *   { id:"1", name:"Women", slug:"Women", image:"..." },
       *   { id:"2", name:"Men", slug:"Men", image:"..." },
       *   ...
       * ]
       **/

      const mapped: CategoryType[] = res.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name, // fallback if backend doesn't send slug
        image: cat.image || FALLBACK_IMAGES[cat.name] || FALLBACK_IMAGES["Women"],
      }));

      setCategories(mapped);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-28 md:py-40 bg-card">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="w-8 h-px bg-sage" />
            <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
              Explore
            </p>
            <div className="w-8 h-px bg-sage" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl"
          >
            Shop by Category
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-secondary animate-pulse rounded" />
              ))
            : categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="group block relative aspect-[3/4] overflow-hidden"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="font-serif text-4xl text-white mb-2">
                            {category.name}
                          </h3>
                          <span className="text-gray-300 text-sm tracking-[0.15em] uppercase">
                            Explore Collection
                          </span>
                        </div>

                        <div className="w-12 h-12 border border-white flex items-center justify-center group-hover:bg-sage group-hover:border-sage transition-all">
                          <ArrowUpRight
                            className="w-5 h-5 group-hover:text-black"
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};
