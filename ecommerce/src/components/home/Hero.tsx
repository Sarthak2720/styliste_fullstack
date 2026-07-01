// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';

// const HeroSection = () => {
//   return (
//     <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <motion.div
//           animate={{
//             scale: [1, 1.2, 1],
//             rotate: [0, 90, 0],
//           }}
//           transition={{
//             duration: 20,
//             repeat: Infinity,
//             ease: 'linear',
//           }}
//           className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
//         />
//         <motion.div
//           animate={{
//             scale: [1, 1.3, 1],
//             rotate: [0, -90, 0],
//           }}
//           transition={{
//             duration: 25,
//             repeat: Infinity,.max-w-7xl
//             ease: 'linear',
//           }}
//           className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"
//         />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center space-y-8">
//           {/* Badge */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full"
//           >
//             <FiTrendingUp className="text-primary-400" />
//             <span className="text-sm text-dark-300">New Collection 2025</span>
//           </motion.div>

//           {/* Main Heading */}
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-tight"
//           >
//             Elevate Your
//             <br />
//             <span className="gradient-text">Fashion Game</span>
//           </motion.h1>

//           {/* Subtitle */}
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto"
//           >
//             Discover exclusive designer pieces curated for the modern trendsetter.
//             Experience fashion reimagined.
//           </motion.p>

//           {/* CTA Buttons */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.6 }}
//             className="flex flex-col sm:flex-row items-center justify-center gap-4"
//           >
//             <Link to="/products">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
//               >
//                 <span>Shop Collection</span>
//                 <FiArrowRight />
//               </motion.button>
//             </Link>
//             <Link to="/products?category=new">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="btn-ghost flex items-center space-x-2 text-lg px-8 py-4"
//               >
//                 <span>Explore New Arrivals</span>
//               </motion.button>
//             </Link>
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.8 }}
//             className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12"
//           >
//             <div className="glass-card p-6 rounded-2xl">
//               <div className="text-3xl font-bold gradient-text">500+</div>
//               <div className="text-sm text-dark-400 mt-1">Products</div>
//             </div>
//             <div className="glass-card p-6 rounded-2xl">
//               <div className="text-3xl font-bold gradient-text">50K+</div>
//               <div className="text-sm text-dark-400 mt-1">Happy Customers</div>
//             </div>
//             <div className="glass-card p-6 rounded-2xl">
//               <div className="text-3xl font-bold gradient-text">4.9★</div>
//               <div className="text-sm text-dark-400 mt-1">Rating</div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6, delay: 1 }}
//         className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
//       >
//         <motion.div
//           animate={{ y: [0, 10, 0] }}
//           transition={{ duration: 1.5, repeat: Infinity }}
//           className="w-6 h-10 border-2 border-dark-600 rounded-full flex items-start justify-center p-2"
//         >
//           <motion.div className="w-1 h-2 bg-primary-500 rounded-full" />
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default HeroSection;

// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// // import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";

// export const Hero = () => {
//   return (
//     <section className="relative min-h-screen flex items-center overflow-hidden">
  
//       {/* Background Image */}
//       <div className="absolute inset-0">
//   <img
//     src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
//     alt="Fashion hero"
//     className="w-full h-full object-cover object-right"
//   />

//   {/* Dark left → transparent right */}
//   <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/90 to-transparent" />
// </div>


//       <div className="container mx-auto px-6 relative z-10">
//         <div className="max-w-2xl">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 0.2 }}
//             className="flex items-center gap-4 mb-8"
//           >
//             <div className="w-12 h-px bg-sage" />
//             {/* <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//               Collection 2025
//             </p> */}
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[1.1] mb-8"
//           >
//             Redefining
//             <br />
//             <span className="italic text-sage">Modern</span>
//             <br />
//             Luxury
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//             className="text-muted-foreground text-lg md:text-xl max-w-md mb-12 leading-relaxed"
//           >
//             Discover meticulously curated pieces that transcend seasons and define your unique aesthetic.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.8 }}
//             className="flex flex-col sm:flex-row gap-4"
//           >
//             <Link
//   to="/shop"
//   className="group px-8 py-4 bg-sage text-black border border-transparent hover:bg-sage/90 transition flex items-center gap-2 text-sm tracking-wide uppercase"
// >
//   Explore Collection
//   <ArrowRight
//     className="w-4 h-4 transition-transform group-hover:translate-x-1"
//     strokeWidth={1.5}
//   />
// </Link>

// <Link
//   to="/about"
//   className="px-8 py-4 border border-sage text-sage hover:bg-sage/10 transition text-sm tracking-wide uppercase"
// >
//   Our Story
// </Link>

//           </motion.div>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1.2 }}
//         className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
//       >
//         {/* <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Scroll</span> */}
//         <motion.div
//           animate={{ y: [0, 8, 0] }}
//           transition={{ repeat: Infinity, duration: 1.5 }}
//           className="w-px h-8 bg-gradient-to-b from-sage to-transparent"
//         />
//       </motion.div>
//     </section>
//   );
// };


// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowRight } from "lucide-react";

// export const Hero = () => {
//   return (
//     <section className="relative min-h-screen flex items-center overflow-hidden">
//       {/* Background Image */}
//       <div className="absolute inset-0">
//         <img
//           src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
//           alt="Fashion hero"
//           className="w-full h-full object-cover object-right"
//         />

//         {/* Dark left → fade right */}
//         <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/90 to-transparent" />
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-6 pt-15 md:pt-20 lg:pt-20 relative z-10">
//         <div className="max-w-2xl">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 0.2 }}
//             className="flex items-center gap-4 mb-8"
//           >
//             <div className="w-12 h-px bg-sage" />
//             {/* <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//               Collection 2025
//             </p> */}
//           </motion.div>

//           {/* Heading */}
//           <motion.h1
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-light mb-8"
//           >
//             Redefining
//             <br />
//             <span className="italic  text-[hsl(var(--sage))]">Modern</span>
//             <br />
//             Luxury
//           </motion.h1>

//           {/* Description */}
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//             className="text-gray-300 text-lg md:text-xl max-w-md mb-12 leading-relaxed"
//           >
//             Discover meticulously curated pieces that transcend seasons and define your unique aesthetic.
//           </motion.p>

//           {/* Buttons */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.8 }}
//             className="flex flex-col sm:flex-row gap-4"
//           >
//             {/* Explore Button */}
//             <Link
//               to="/shop"
//               className="group px-8 py-4 bg-white text-black border border-white hover:bg-white/90 transition flex items-center gap-2 text-sm tracking-wide uppercase"
//             >
//               Explore Collection
//               <ArrowRight
//                 className="w-4 h-4 transition-transform group-hover:translate-x-1"
//                 strokeWidth={1.5}
//               />
//             </Link>

//             {/* Our Story */}
//             <Link
//               to="/about"
//               className="px-8 py-4 border border-sage text-sage hover:bg-sage/10 transition text-sm tracking-wide uppercase"
//             >
//               Our Story
//             </Link>
//           </motion.div>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1.2 }}
//         className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
//       >
//         {/* <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
//           Scroll
//         </span> */}
//         <motion.div
//           animate={{ y: [0, 8, 0] }}
//           transition={{ repeat: Infinity, duration: 1.5 }}
//           className="w-px h-8 bg-gradient-to-b from-sage to-transparent"
//         />
//       </motion.div>
//     </section>
//   );
// };


// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import type { Variants } from "framer-motion";

// import { Link } from "react-router-dom";
// import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// import hero1 from "../../assets/hero-1.jpg";
// import hero2 from "../../assets/hero-2.jpg";
// import hero3 from "../../assets/hero-3.png";

// const slides = [
//   {
//     image: hero1,
//     subtitle: "Premium Custom Tailoring",
//     title: "Elegance Crafted",
//     titleHighlight: "Just For You",
//     description:
//       "Experience bespoke fashion with personalized measurements and doorstep service in Thane & Mulund areas.",
//   },
//   {
//     image: hero2,
//     subtitle: "Transform Your Wardrobe",
//     title: "Saree to Western",
//     titleHighlight: "Magic in 48 Hours",
//     description:
//       "Give your cherished sarees a new life. We transform old sarees into stunning western & Indo-western dresses.",
//   },
//   {
//     image: hero3,
//     subtitle: "Fashion Designing",
//     title: "Every Woman",
//     titleHighlight: "Deserves Confidence",
//     description:
//       "Our expert team helps every woman feel confident in fashionable clothing designed to complement her unique body type.",
//   },
// ];

// export const Hero = () => {
//   const [current, setCurrent] = useState(0);
//   const [direction, setDirection] = useState(1);
//   const timerRef = useRef<number | null>(null);

// useEffect(() => {
//   timerRef.current = window.setInterval(() => {
//     setDirection(1);
//     setCurrent((p) => (p + 1) % slides.length);
//   }, 6000);

//   return () => {
//     if (timerRef.current !== null) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//   };
// }, []);

//   const imageVariants: Variants = {
//     enter: (d) => ({ x: d > 0 ? "100%" : "-100%" }),
//     center: { x: 0 },
//     exit: (d) => ({ x: d > 0 ? "-100%" : "100%" }),
//   };

//   const textVariants: Variants = {
//     enter: { opacity: 0, x: -60 },
//     center: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: 60 },
//   };

//   const next = () => {
//     setDirection(1);
//     setCurrent((p) => (p + 1) % slides.length);
//   };

//   const prev = () => {
//     setDirection(-1);
//     setCurrent((p) => (p - 1 + slides.length) % slides.length);
//   };

//   return (
//     <section className="relative w-full min-h-screen overflow-hidden pt-24 md:pt-28 pb-32">
//       {/* IMAGE */}
//       <AnimatePresence initial={false} custom={direction}>
//         <motion.img
//           key={current}
//           src={slides[current].image}
//           alt={slides[current].title}
//           className="absolute inset-0 w-screen h-screen object-cover object-top"
//           custom={direction}
//           variants={imageVariants}
//           initial="enter"
//           animate="center"
//           exit="exit"
//           transition={{ duration: 1.1, ease: "easeInOut" }}
//           draggable={false}
//         />
//       </AnimatePresence>

//       {/* LEFT GRADIENT FOR TEXT READABILITY */}
//       <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

//       {/* OPTIONAL SOFT BOTTOM FADE */}
//       <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

//       {/* CONTENT */}
//       <div className="relative z-10 h-full flex items-start">
//         <div className="w-full px-8 md:px-16 lg:px-24">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={current}
//               variants={textVariants}
//               initial="enter"
//               animate="center"
//               exit="exit"
//               transition={{ duration: 0.6 }}
//               className="max-w-xl text-left"
//             >
//               <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-6 border border-white/30">
//                 <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
//                 <span className="text-sm tracking-[0.25em] uppercase text-white">
//                   {slides[current].subtitle}
//                 </span>
//               </div>

//               <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl 
//                mb-5 text-white leading-[1.08]">
//                 {slides[current].title}
//                 <br />
//                 <span className="italic text-accent">
//                   {slides[current].titleHighlight}
//                 </span>
//               </h1>

//               <p className="text-white/80 text-base md:text-m mb-8">
//                 {slides[current].description}
//               </p>

//               <div className="flex gap-4">
//                <Link
//   to="/appointment"
//   className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl 
//              bg-[#9CAF88] text-white font-medium 
//              hover:bg-[#8FA17A] transition-colors"
// >

//                   Book Appointment
//                   <ArrowRight className="w-4 h-4" />
//                 </Link>

//                 <Link
//                   to="/services"
//                   className="inline-flex items-center px-8 py-4 rounded-xl border border-white/40 text-white hover:bg-white/10"
//                 >
//                   Explore Services
//                 </Link>
//               </div>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* ARROWS */}
//       {/* <button
//         onClick={prev}
//         className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-20"
//       >
//         <ChevronLeft className="w-6 h-6" />
//       </button>

//       <button
//         onClick={next}
//         className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-20"
//       >
//         <ChevronRight className="w-6 h-6" />
//       </button> */}
//     </section>
//   );
// };

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* ---------- DESKTOP IMAGES ---------- */
import hero1 from "../../assets/hero-1.jpg";
import hero2 from "../../assets/hero-2.jpg";
import hero3 from "../../assets/hero-3.png";

/* ---------- MOBILE IMAGES ---------- */
import heroM1 from "../../assets/hero M-1.jpg";
import heroM2 from "../../assets/hero M-2.jpg";
import heroM3 from "../../assets/hero M-3.jpg";

const slides = [
  {
    desktopImage: hero1,
    mobileImage: heroM1,
    subtitle: "Premium Custom Tailoring",
    title: "Elegance Crafted",
    titleHighlight: "Just For You",
    description:
      "Experience bespoke fashion with personalized measurements and doorstep service in Thane & Mulund areas.",
  },
  {
    desktopImage: hero2,
    mobileImage: heroM2,
    subtitle: "Transform Your Wardrobe",
    title: "Saree to Western",
    titleHighlight: "Magic in 48 Hours",
    description:
      "Give your cherished sarees a new life. We transform old sarees into stunning western & Indo-western dresses.",
  },
  {
    desktopImage: hero3,
    mobileImage: heroM3,
    subtitle: "Fashion Designing",
    title: "Every Woman",
    titleHighlight: "Deserves Confidence",
    description:
      "Our expert team helps every woman feel confident in fashionable clothing designed to complement her unique body type.",
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<number | null>(null);

  /* ---------- AUTO SLIDER ---------- */
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 6000);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  /* ---------- PURE FADE IMAGE ANIMATION ---------- */
  const imageVariants: Variants = {
    enter: {
      opacity: 0,
      scale: 1.03, // very subtle depth
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 1.4, ease: "easeInOut" },
        scale: { duration: 2.5, ease: "easeOut" },
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      transition: {
        opacity: { duration: 1.4, ease: "easeInOut" },
      },
    },
  };

  const textVariants: Variants = {
    enter: { opacity: 0, y: 20 },
    center: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section className="relative w-full h-[100svh] overflow-hidden">
      {/* ---------- IMAGE (CROSS FADE) ---------- */}
      <AnimatePresence mode="sync">
        <motion.picture
          key={current}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <source
            media="(max-width: 640px)"
            srcSet={slides[current].mobileImage}
          />
          <img
            src={slides[current].desktopImage}
            alt={slides[current].title}
            loading={current === 0 ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-cover object-top"
            draggable={false}
          />
        </motion.picture>
      </AnimatePresence>

      {/* ---------- GRADIENTS ---------- */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

      {/* ---------- CONTENT ---------- */}
      <div className="relative z-10 h-full flex items-center sm:items-start">
        <div
          className="
            w-full
            px-4 sm:px-8 md:px-16 lg:px-24
            text-center sm:text-left
            mt-10 sm:mt-24
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-xl mx-auto sm:mx-0"
            >
              {/* Subtitle */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-4 border border-white/30">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white">
                  {slides[current].subtitle}
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-white leading-tight">
                {slides[current].title}
                <br />
                <span className="italic text-accent">
                  {slides[current].titleHighlight}
                </span>
              </h1>

              {/* Description */}
              <p className="hidden sm:block text-white/80 text-base md:text-lg mb-6">
                {slides[current].description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-2 sm:gap-4">
                <Link
                  to="/appointment"
                  className="inline-flex items-center justify-center gap-1.5
                             px-3 py-1.5 text-[10px]
                             w-[160px] sm:w-auto
                             sm:px-5 sm:py-3 sm:text-sm
                             rounded-md
                             bg-[#9CAF88] text-white font-medium
                             hover:bg-[#8FA17A]
                             transition-colors"
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/services"
                  className="hidden sm:inline-flex sm:w-auto items-center justify-center
                             px-4 py-2.5 text-xs
                             sm:px-5 sm:py-3 sm:text-sm
                             rounded-lg
                             border border-white/40
                             text-white
                             hover:bg-white/10
                             transition"
                >
                  Explore Services
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
