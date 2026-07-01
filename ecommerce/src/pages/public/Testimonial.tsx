// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// // import { Layout } from "@/components/layout/Layout";
// // import { Button } from "@/components/ui/button";
// import { ArrowRight, Star, Quote } from "lucide-react";
// import Navbar from "../../components/layout/Navbar";
// import { Footer } from "../../components/layout/Footer";

// const testimonials = [
//   {
//     id: 1,
//     name: "Priya Sharma",
//     location: "Thane West",
//     rating: 5,
//     text: "Absolutely amazing experience! Babita ma'am transformed my mother's old Banarasi saree into a stunning lehenga for my engagement. The craftsmanship is impeccable and the fit was perfect.",
//     service: "Saree Upscaling",
//     image:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
//   },
//   {
//     id: 2,
//     name: "Ananya Patel",
//     location: "Mulund",
//     rating: 5,
//     text: "The doorstep service is so convenient! The tailor came home, took measurements, and delivered my blouse within a week. Perfect fitting and beautiful work.",
//     service: "Bespoke Tailoring",
//     image:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
//   },
//   {
//     id: 3,
//     name: "Sneha Desai",
//     location: "Thane",
//     rating: 5,
//     text: "Got my bridal lehenga designed here and it was beyond my expectations. The attention to detail, the embroidery work, everything was just perfect for my special day.",
//     service: "Bridal Wear",
//     image:
//       "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
//   },
//   {
//     id: 4,
//     name: "Kavita Mehta",
//     location: "Powai",
//     rating: 5,
//     text: "I had several old sarees sitting in my wardrobe. STYLISTE transformed them into beautiful kurtas and dresses. Now I can wear them proudly!",
//     service: "Saree Upscaling",
//     image:
//       "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
//   },
//   {
//     id: 5,
//     name: "Rashmi Kulkarni",
//     location: "Ghatkopar",
//     rating: 5,
//     text: "The team is so patient and understanding. They helped me choose the perfect design for my daughter's thread ceremony outfit. Highly recommended!",
//     service: "Designer Dresses",
//     image:
//       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
//   },
//   {
//     id: 6,
//     name: "Deepika Joshi",
//     location: "Thane West",
//     rating: 5,
//     text: "Got matching outfits designed for my entire family for Diwali. The color coordination and quality were outstanding. Will definitely come back!",
//     service: "Theme Outfits",
//     image:
//       "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
//   },
//   {
//     id: 7,
//     name: "Meera Iyer",
//     location: "Mulund West",
//     rating: 5,
//     text: "The alterations service is top-notch. My old dress fits perfectly now. Quick turnaround and very reasonable pricing.",
//     service: "Alterations",
//     image:
//       "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80",
//   },
//   {
//     id: 8,
//     name: "Sonali Rane",
//     location: "Thane",
//     rating: 5,
//     text: "Babita ma'am is incredibly talented. She understood exactly what I wanted and created a gorgeous cocktail dress. The premium lining makes it so comfortable!",
//     service: "Designer Dresses",
//     image:
//       "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
//   },
// ];

// const stats = [
//   { number: "500+", label: "Happy Customers" },
//   { number: "25+", label: "Years Experience" },
//   { number: "1000+", label: "Garments Created" },
//   { number: "100%", label: "Satisfaction Rate" },
// ];

// const Testimonials = () => {
//   return (
//     <main>
//       {/* Hero */}
//       <Navbar />
//       <section className="relative py-28 md:py-40 overflow-hidden bg-primary">
//   {/* Background */}
//   {/* <div className="absolute inset-0">
//     <img
//       src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80"
//       alt="Hero background"
//       className="w-full h-full object-cover opacity-10"
//     />
//     <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
//   </div> */}

//   {/* Video */}
//   <div className="container mx-auto px-6 relative z-10 flex justify-center">
//     <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl">
//       <video
//         controls
//         playsInline
//         poster="/images/video-poster.jpg"
//         className="w-full h-full object-cover"
//       >
//         <source src="/videos/hero-video.mp4" type="video/mp4" />
//       </video>
//     </div>
//   </div>
// </section>


//       {/* Stats */}
//       {/* <section className="py-16 bg-background text-foreground">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={stat.label}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="text-center group"
//               >
//                 <div className="font-serif text-4xl md:text-5xl text-sage mb-2 group-hover:scale-110 transition-transform duration-300">
//                   {stat.number}
//                 </div>
//                 <div className="text-muted-foreground text-sm font-sans tracking-wide">
//                   {stat.label}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section> */}

//       {/* Featured Testimonial */}
//       <section className="py-28 md:py-40 bg-primary text-primary-foreground">
//         <div className="container mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="max-w-4xl mx-auto text-center"
//           >
//             <Quote
//               className="w-16 h-16 text-primary-foreground/30 mx-auto mb-8"
//               strokeWidth={1}
//             />
//             <p className="font-serif text-2xl md:text-4xl leading-relaxed mb-8 italic text-primary-foreground">
//               "STYLISTE has transformed how I think about fashion. Their
//               attention to detail and personalized service makes every piece
//               feel special. I wouldn't trust anyone else with my wardrobe."
//             </p>
//             <div className="flex items-center justify-center gap-4">
//               <img
//                 src={testimonials[0].image}
//                 alt={testimonials[0].name}
//                 className="w-16 h-16 rounded-full object-cover"
//               />
//               <div className="text-left">
//                 <div className="font-serif text-lg text-primary-foreground">
//                   {testimonials[0].name}
//                 </div>
//                 <div className="text-primary-foreground/60 text-sm">
//                   {testimonials[0].location}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Testimonials Grid */}
//       <section className="py-20 bg-background text-foreground">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {testimonials.map((testimonial, index) => (
//               <motion.div
//                 key={testimonial.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="group bg-background border border-border p-8 hover:border-sage/50 hover:shadow-sage transition-all duration-500"
//               >
//                 <div className="flex items-center gap-1 mb-4">
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <Star key={i} className="w-4 h-4 fill-sage text-sage" />
//                   ))}
//                 </div>
//                 <p className="text-muted-foreground leading-relaxed mb-6 italic">
//                   "{testimonial.text}"
//                 </p>
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={testimonial.image}
//                     alt={testimonial.name}
//                     className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div>
//                     <div className="font-serif group-hover:text-sage transition-colors duration-300">
//                       {testimonial.name}
//                     </div>
//                     <div className="text-muted-foreground text-sm">
//                       {testimonial.location}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-4 pt-4 border-t border-border">
//                   <span className="inline-block px-3 py-1 bg-sage/10 text-sage text-xs font-sans tracking-wide">
//                     {testimonial.service}
//                   </span>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-28 md:py-40 bg-primary text-primary-foreground">
//         <div className="container mx-auto px-6 text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="font-serif text-4xl md:text-6xl mb-8"
//           >
//             Ready to Join Our Happy Clients?
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="text-primary-foreground/80 max-w-xl mx-auto mb-12 leading-relaxed"
//           >
//             Experience the STYLISTE difference. Book your consultation today.
//           </motion.p>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="flex flex-col sm:flex-row gap-4 justify-center"
//           >
//             <Link
//               to="/appointment"
//               className="group inline-flex items-center gap-2
//              bg-background text-foreground
//              px-8 py-4 rounded-xl
//              font-medium transition-all
//              hover:bg-background/90"
//             >
//               Book Appointment
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </Link>
//             <Link
//               to="/contact"
//               className="inline-flex items-center justify-center
//              px-8 py-4 rounded-xl
//              border border-primary-foreground/40
//              text-primary-foreground
//              transition-all
//              hover:bg-primary-foreground/10
//              hover:border-primary-foreground"
//             >
//               Contact Us
//             </Link>
//           </motion.div>
//         </div>
//       </section>
//       <Footer />
//     </main>
//   );
// };

// export default Testimonials;


// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import {
//   ArrowRight,
//   Star,
//   Quote,
//   Volume2,
//   VolumeX,
//   Play,
// } from "lucide-react";

// import Navbar from "../../components/layout/Navbar";
// import { Footer } from "../../components/layout/Footer";

// import desktopVideo from "../../assets/STYLISTE.mp4";
// import mobileVideo from "../../assets/STYLISTE.mp4";

// /* ================= TESTIMONIAL DATA (UNCHANGED) ================= */
// const testimonials = [
//   {
//     id: 1,
//     name: "Priya Sharma",
//     location: "Thane West",
//     rating: 5,
//     text: "Absolutely amazing experience! Babita ma'am transformed my mother's old Banarasi saree into a stunning lehenga for my engagement. The craftsmanship is impeccable and the fit was perfect.",
//     service: "Saree Upscaling",
//     image:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
//   },
//   {
//     id: 2,
//     name: "Ananya Patel",
//     location: "Mulund",
//     rating: 5,
//     text: "The doorstep service is so convenient! The tailor came home, took measurements, and delivered my blouse within a week. Perfect fitting and beautiful work.",
//     service: "Bespoke Tailoring",
//     image:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
//   },
//   {
//     id: 3,
//     name: "Sneha Desai",
//     location: "Thane",
//     rating: 5,
//     text: "Got my bridal lehenga designed here and it was beyond my expectations. The attention to detail, the embroidery work, everything was just perfect for my special day.",
//     service: "Bridal Wear",
//     image:
//       "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
//   },
//   {
//     id: 4,
//     name: "Kavita Mehta",
//     location: "Powai",
//     rating: 5,
//     text: "I had several old sarees sitting in my wardrobe. STYLISTE transformed them into beautiful kurtas and dresses. Now I can wear them proudly!",
//     service: "Saree Upscaling",
//     image:
//       "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
//   },
//   {
//     id: 5,
//     name: "Rashmi Kulkarni",
//     location: "Ghatkopar",
//     rating: 5,
//     text: "The team is so patient and understanding. They helped me choose the perfect design for my daughter's thread ceremony outfit. Highly recommended!",
//     service: "Designer Dresses",
//     image:
//       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
//   },
//   {
//     id: 6,
//     name: "Deepika Joshi",
//     location: "Thane West",
//     rating: 5,
//     text: "Got matching outfits designed for my entire family for Diwali. The color coordination and quality were outstanding. Will definitely come back!",
//     service: "Theme Outfits",
//     image:
//       "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
//   },
//   {
//     id: 7,
//     name: "Meera Iyer",
//     location: "Mulund West",
//     rating: 5,
//     text: "The alterations service is top-notch. My old dress fits perfectly now. Quick turnaround and very reasonable pricing.",
//     service: "Alterations",
//     image:
//       "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80",
//   },
//   {
//     id: 8,
//     name: "Sonali Rane",
//     location: "Thane",
//     rating: 5,
//     text: "Babita ma'am is incredibly talented. She understood exactly what I wanted and created a gorgeous cocktail dress. The premium lining makes it so comfortable!",
//     service: "Designer Dresses",
//     image:
//       "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
//   },
// ];

// /* ================= HERO VIDEO ================= */
// function HeroVideo() {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const rippleRef = useRef<HTMLSpanElement | null>(null);

//   const [isMuted, setIsMuted] = useState(true);
//   const [isPlaying, setIsPlaying] = useState(true);

//   const isMobile = window.matchMedia("(max-width: 768px)").matches;
//   const videoSrc = isMobile ? mobileVideo : desktopVideo;

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     video.currentTime = 0;
//     video.muted = true;
//     video.play().catch(() => {});
//     setIsPlaying(true);

//     return () => {
//       video.pause();
//       video.currentTime = 0;
//     };
//   }, []);

//   useEffect(() => {
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.code === "Space") {
//         e.preventDefault();
//         togglePlay();
//       }
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, []);

//   const togglePlay = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (video.paused) {
//       video.play();
//       setIsPlaying(true);
//     } else {
//       video.pause();
//       setIsPlaying(false);
//     }

//     triggerRipple();
//   };

//   const toggleMute = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     const video = videoRef.current;
//     if (!video) return;

//     video.muted = !video.muted;
//     setIsMuted(video.muted);
//   };

//   const triggerRipple = () => {
//     if (!rippleRef.current) return;
//     rippleRef.current.classList.remove("animate-ripple");
//     void rippleRef.current.offsetWidth;
//     rippleRef.current.classList.add("animate-ripple");
//   };

//   return (
//     <section className="relative h-screen w-full overflow-hidden">
//       <video
//         ref={videoRef}
//         loop
//         muted
//         playsInline
//         preload="none"
//         className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-500 ${
//           isPlaying ? "opacity-100" : "opacity-70"
//         }`}
//       >
//         <source src={videoSrc} type="video/mp4" />
//       </video>

//       {/* CENTER CLICK AREA */}
//       <div
//         onClick={togglePlay}
//         className="absolute inset-0 flex items-center justify-center cursor-pointer"
//       >
//         {!isPlaying && (
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-black/50 backdrop-blur-md p-6 rounded-full"
//           >
//             <Play className="w-10 h-10 text-white" />
//           </motion.div>
//         )}

//         <span
//           ref={rippleRef}
//           className="absolute w-24 h-24 rounded-full bg-white/20 opacity-0 pointer-events-none"
//         />
//       </div>

//       {/* MUTE BUTTON */}
//       <button
//         onClick={toggleMute}
//         className="absolute bottom-6 right-6 z-10 bg-black/40 backdrop-blur-md p-3 rounded-full text-white hover:bg-black/60"
//       >
//         {isMuted ? <VolumeX /> : <Volume2 />}
//       </button>
//     </section>
//   );
// }

// /* ================= PAGE ================= */
// const Testimonials = () => {
//   return (
//     <main>
//       <Navbar />

//       <HeroVideo />

//       {/* FEATURED TESTIMONIAL */}
//       <section className="py-28 bg-primary text-primary-foreground">
//         <div className="container mx-auto px-6 text-center max-w-4xl">
//           <Quote className="w-16 h-16 mx-auto mb-8 opacity-30" />
//           <p className="font-serif text-2xl md:text-4xl italic mb-8">
//             "STYLISTE has transformed how I think about fashion. Every piece feels
//             special."
//           </p>
//         </div>
//       </section>

//       {/* TESTIMONIAL GRID (UNCHANGED) */}
//       <section className="py-20 bg-background text-foreground">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {testimonials.map((testimonial, index) => (
//               <motion.div
//                 key={testimonial.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="group bg-background border border-border p-8 hover:border-sage/50 hover:shadow-sage transition-all duration-500"
//               >
//                 <div className="flex items-center gap-1 mb-4">
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <Star key={i} className="w-4 h-4 fill-sage text-sage" />
//                   ))}
//                 </div>
//                 <p className="text-muted-foreground leading-relaxed mb-6 italic">
//                   "{testimonial.text}"
//                 </p>
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={testimonial.image}
//                     alt={testimonial.name}
//                     className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div>
//                     <div className="font-serif group-hover:text-sage transition-colors duration-300">
//                       {testimonial.name}
//                     </div>
//                     <div className="text-muted-foreground text-sm">
//                       {testimonial.location}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-4 pt-4 border-t border-border">
//                   <span className="inline-block px-3 py-1 bg-sage/10 text-sage text-xs font-sans tracking-wide">
//                     {testimonial.service}
//                   </span>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </main>
//   );
// };

// export default Testimonials;
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
import {
  // ArrowRight,
  Star,
  Quote,
  Volume2,
  VolumeX,
  Play,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

import desktopVideo from "../../assets/STYLISTE.mp4";
import mobileVideo from "../../assets/STYLISTE.mp4";
import leftVideo from "../../assets/video 1.mp4";
import rightVideo from "../../assets/video 2.mp4";
import heroTestimonials from "../../assets/hero-testimonials.jpg";

/* ================= TESTIMONIAL DATA ================= */
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Thane West",
    rating: 5,
    text:
      "Absolutely amazing experience! Babita ma'am transformed my mother's old Banarasi saree into a stunning lehenga for my engagement. The craftsmanship is impeccable and the fit was perfect.",
    service: "Saree Upscaling",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    id: 2,
    name: "Ananya Patel",
    location: "Mulund",
    rating: 5,
    text:
      "The doorstep service is so convenient! The tailor came home, took measurements, and delivered my blouse within a week. Perfect fitting and beautiful work.",
    service: "Bespoke Tailoring",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
  {
    id: 3,
    name: "Sneha Desai",
    location: "Thane",
    rating: 5,
    text:
      "Got my bridal lehenga designed here and it was beyond my expectations. The attention to detail, the embroidery work, everything was just perfect for my special day.",
    service: "Bridal Wear",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
  },
  {
    id: 4,
    name: "Kavita Mehta",
    location: "Powai",
    rating: 5,
    text:
      "I had several old sarees sitting in my wardrobe. STYLISTE transformed them into beautiful kurtas and dresses. Now I can wear them proudly!",
    service: "Saree Upscaling",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
  },
  {
    id: 5,
    name: "Rashmi Kulkarni",
    location: "Ghatkopar",
    rating: 5,
    text:
      "The team is so patient and understanding. They helped me choose the perfect design for my daughter's thread ceremony outfit. Highly recommended!",
    service: "Designer Dresses",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  },
  {
    id: 6,
    name: "Deepika Joshi",
    location: "Thane West",
    rating: 5,
    text:
      "Got matching outfits designed for my entire family for Diwali. The color coordination and quality were outstanding. Will definitely come back!",
    service: "Theme Outfits",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
  },
  {
    id: 7,
    name: "Meera Iyer",
    location: "Mulund West",
    rating: 5,
    text:
      "The alterations service is top-notch. My old dress fits perfectly now. Quick turnaround and very reasonable pricing.",
    service: "Alterations",
    image:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80",
  },
  {
    id: 8,
    name: "Sonali Rane",
    location: "Thane",
    rating: 5,
    text:
      "Babita ma'am is incredibly talented. She understood exactly what I wanted and created a gorgeous cocktail dress. The premium lining makes it so comfortable!",
    service: "Designer Dresses",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
  },
];

const testimonialVideos = [
  {
    id: "left",
    desktopSrc: leftVideo,
    mobileSrc: leftVideo,
    featured: false,
    orderClassName: "order-2 lg:order-1",
  },
  {
    id: "center",
    desktopSrc: desktopVideo,
    mobileSrc: mobileVideo,
    featured: true,
    orderClassName: "order-1 lg:order-2",
  },
  {
    id: "right",
    desktopSrc: rightVideo,
    mobileSrc: rightVideo,
    featured: false,
    orderClassName: "order-3",
  },
] as const;

type TestimonialVideoCardProps = {
  desktopSrc: string;
  mobileSrc?: string;
  featured?: boolean;
};

/* ================= VIDEO CARD ================= */
function TestimonialVideoCard({
  desktopSrc,
  mobileSrc = desktopSrc,
  featured = false,
}: TestimonialVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false
  );

  const videoSrc = isMobile ? mobileSrc : desktopSrc;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) =>
      setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = true;
    setIsMuted(true);
    setIsPlaying(true);
    video.play().catch(() => {
      setIsPlaying(false);
    });

    return () => {
      video.pause();
      video.currentTime = 0;
    };
  }, [videoSrc]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      onClick={togglePlay}
      className={`relative w-full aspect-video rounded-3xl overflow-hidden cursor-pointer bg-black ${
        featured
          ? "shadow-2xl ring-1 ring-black/5"
          : "shadow-xl lg:scale-[0.94] lg:shadow-[0_20px_45px_rgba(0,0,0,0.14)]"
      }`}
    >
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isPlaying ? "opacity-100" : "opacity-70"
        }`}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 backdrop-blur-md p-6 rounded-full">
            <Play className="w-10 h-10 text-white" />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute testimonial video" : "Mute testimonial video"}
        className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md p-3 rounded-full text-white"
      >
        {isMuted ? <VolumeX /> : <Volume2 />}
      </button>
    </div>
  );
}

function HeroVideo() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.18fr)_minmax(0,0.95fr)]">
          {testimonialVideos.map((video) => (
            <div key={video.id} className={video.orderClassName}>
              <TestimonialVideoCard
                desktopSrc={video.desktopSrc}
                mobileSrc={video.mobileSrc}
                featured={video.featured}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center max-w-xl mx-auto">
          <div className="w-20 h-px bg-primary/20 mx-auto mb-4" />
          <p className="text-slate-600 text-sm leading-relaxed">
            A glimpse into the craftsmanship, precision, and passion behind every
            Styliste Couturier creation.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================= PAGE ================= */
const Testimonials = () => {
  return (
    <main>
      <Navbar />

      {/* ================= HERO TEXT ================= */}
      <section className="relative py-28 md:py-40 overflow-hidden bg-primary text-primary-foreground">
        <Navbar />
        <div className="absolute inset-0">
          <img
            src={heroTestimonials}
            alt="Styliste Couturier testimonials"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/60" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="w-8 h-px bg-primary-foreground/60" />
              <p className="text-primary-foreground/80 tracking-[0.3em] text-xs uppercase">
                Testimonials
              </p>
              <div className="w-8 h-px bg-primary-foreground/60" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-primary-foreground"
            >
              What Our
              <br />
              <span className="italic text-accent">Clients Say</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-primary-foreground/80 text-lg max-w-2xl mx-auto"
            >
              Real stories from our valued customers who trusted us with their
              fashion dreams.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ================= VIDEO CARD ================= */}
      <HeroVideo />

      {/* ================= FEATURED QUOTE ================= */}
      <section className="py-28 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <Quote className="w-16 h-16 mx-auto mb-8 opacity-30" />
          <p className="font-serif text-2xl md:text-4xl italic mb-8">
            "Styliste Couturier has transformed how I think about fashion. Every piece feels
            special."
          </p>
        </div>
      </section>

      {/* ================= TESTIMONIAL GRID ================= */}
      <section className="py-20 bg-background text-foreground">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-background border border-border p-8 hover:border-sage/50 hover:shadow-sage transition-all duration-500"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-sage text-sage" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-serif">
                      {testimonial.name}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="inline-block px-3 py-1 bg-sage/10 text-sage text-xs">
                    {testimonial.service}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Testimonials;
