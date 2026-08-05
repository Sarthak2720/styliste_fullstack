// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// // import { Layout } from "@/components/layout/Layout";
// // import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";
// import Navbar from "../../components/layout/Navbar";
// import { Footer } from "../../components/layout/Footer";

// const About = () => {
//   return (
//     <div className="bg-background text-foreground">
//       <Navbar />
//       {/* Hero */}
//         <section className="py-20 md:py-32 border-b border-border">
//         <div className="container mx-auto px-6 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="flex items-center justify-center gap-4 mb-4"
//           >
//             <div className="w-8 h-px bg-sage" />
//             <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//               Our Story
//             </p>
//             <div className="w-8 h-px bg-sage" />
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="font-serif text-5xl md:text-7xl mb-6"
//           >
//             About Us
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-muted-foreground max-w-xl mx-auto leading-relaxed"
//           >
//             STYLISTE was born from a passion for exceptional craftsmanship and timeless design. We believe that true style transcends trends.
//           </motion.p>
//         </div>
//       </section>

//       {/* Mission */}
//       <section className="py-28 md:py-40 border-t border-border">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//             >
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-8 h-px bg-sage" />
//                 <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//                   Our Mission
//                 </p>
//               </div>
//               <h2 className="font-serif text-4xl md:text-5xl mb-8">
//                 Empowering Individual Style
//               </h2>
//               <p className="text-muted-foreground mb-6 leading-relaxed">
//                 At STYLISTE, we believe that fashion is a form of self-expression. Our mission is to provide exceptional pieces that empower individuals to express their unique style with confidence and elegance.
//               </p>
//               <p className="text-muted-foreground leading-relaxed">
//                 Every piece in our collection is carefully curated for its quality, design, and versatility. We work with artisans and designers who share our commitment to excellence and sustainability.
//               </p>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="aspect-[4/5] overflow-hidden"
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80"
//                 alt="Fashion craftsmanship"
//                 className="w-full h-full object-cover"
//               />
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Values */}
//       <section className="py-28 md:py-40 bg-card">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-20">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center justify-center gap-4 mb-4"
//             >
//               <div className="w-8 h-px bg-sage" />
//               <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//                 Our Values
//               </p>
//               <div className="w-8 h-px bg-sage" />
//             </motion.div>
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-4xl md:text-5xl"
//             >
//               What We Stand For
//             </motion.h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 title: "Quality",
//                 description:
//                   "We source only the finest materials and work with skilled artisans to create pieces that stand the test of time.",
//               },
//               {
//                 title: "Sustainability",
//                 description:
//                   "We're committed to ethical practices and sustainable fashion. Every purchase supports responsible production.",
//               },
//               {
//                 title: "Service",
//                 description:
//                   "Our dedicated team provides personalized styling advice and exceptional customer service at every touchpoint.",
//               },
//             ].map((value, index) => (
//               <motion.div
//                 key={value.title}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.15 }}
//                 className="bg-background border border-border p-10"
//               >
//                 <h3 className="font-serif text-2xl mb-5">{value.title}</h3>
//                 <p className="text-muted-foreground leading-relaxed">{value.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Team */}
//       <section className="py-28 md:py-40">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-20">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center justify-center gap-4 mb-4"
//             >
//               <div className="w-8 h-px bg-sage" />
//               <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//                 The Team
//               </p>
//               <div className="w-8 h-px bg-sage" />
//             </motion.div>
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-4xl md:text-5xl"
//             >
//               Meet Our Stylists
//             </motion.h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 name: "Alexandra Chen",
//                 role: "Creative Director",
//                 image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
//               },
//               {
//                 name: "Marcus Williams",
//                 role: "Head Stylist",
//                 image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
//               },
//               {
//                 name: "Sofia Martinez",
//                 role: "Personal Shopper",
//                 image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
//               },
//             ].map((member, index) => (
//               <motion.div
//                 key={member.name}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.15 }}
//                 className="text-center"
//               >
//                 <div className="aspect-[3/4] overflow-hidden mb-6">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
//                   />
//                 </div>
//                 <h3 className="font-serif text-xl mb-2">{member.name}</h3>
//                 <p className="text-muted-foreground text-sm tracking-wide">{member.role}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default About;

// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowRight, Scissors, Home, Shirt, Sparkles, Eye, Target, Users } from "lucide-react";
// import Navbar from "../../components/layout/Navbar";
// import { Footer } from "../../components/layout/Footer";

// const teamMembers = [
//   {
//     name: "Babita Dahal",
//     role: "Senior Fashion Designer",
//     description: "She has more than 25 years of experience in the fashion and lifestyle industry. She is also a professional Makeup Artist. Worked with multiple Indian brands and invited as faculty in various Fashion Institutes.",
//     image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",
//   },
//   {
//     name: "Istyak Ahemad",
//     role: "Cutting Master and Tailor",
//     description: "He has more than 20 years of experience in the ladies' garment industry—a very talented and down-to-earth individual.",
//     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
//   },
//   {
//     name: "Yaseen Shaikh",
//     role: "Tailor",
//     description: "Has vast experience in stitching all types of Ladies' Garments.",
//     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
//   },
//   {
//     name: "Pooja Gupta",
//     role: "Helping Hand of Babita Ma'am",
//     description: "She is a great help in completing small tasks like hand stitching, fall piko, thread work, hand embroidery, and helping Babita ma'am in her work.",
//     image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
//   },
// ];

// const About = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Hero */}
//       <Navbar/>
//       <section className="relative py-28 md:py-40 overflow-hidden">
//         <div className="absolute inset-0">
//           <img
//             src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
//             alt="STYLISTE boutique"
//             className="w-full h-full object-cover opacity-20"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
//         </div>
//         <div className="container mx-auto px-6 relative z-10">
//           <div className="max-w-3xl">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex items-center gap-4 mb-6"
//             >
//               <div className="w-8 h-px bg-sage" />
//               <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//                 About Us
//               </p>
//             </motion.div>
//             <motion.h1
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8"
//             >
//               Revolutionising
//               <br />
//               <span className="italic text-sage">Women's</span>
//               <br />
//               Fashion
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="text-muted-foreground text-lg leading-relaxed"
//             >
//               An innovative ladies' garments brand that aims to revolutionise the way women shop for clothing in India.
//             </motion.p>
//           </div>
//         </div>
//       </section>

//       {/* Vision & Goals */}
//       <section className="py-28 md:py-40 border-t border-border">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
//             {/* Vision */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="group p-8 md:p-12 border border-border bg-card hover:border-sage/50 hover:shadow-sage transition-all duration-500"
//             >
//               <div className="w-16 h-16 mb-8 border border-sage/30 flex items-center justify-center group-hover:bg-sage group-hover:border-sage transition-all duration-500">
//                 <Eye className="w-7 h-7 text-sage group-hover:text-primary-foreground transition-colors duration-500" strokeWidth={1} />
//               </div>
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-8 h-px bg-sage" />
//                 <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//                   Our Vision
//                 </p>
//               </div>
//               <h2 className="font-serif text-3xl md:text-4xl mb-6">
//                 Empowering Every Woman
//               </h2>
//               <p className="text-muted-foreground leading-relaxed">
//                 Our expert team is dedicated to helping every woman, regardless of age, feel confident in fashionable clothing thoughtfully designed to compliment her unique body type.
//               </p>
//             </motion.div>

//             {/* Goals */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.15 }}
//               className="group p-8 md:p-12 border border-border bg-card hover:border-rose/50 hover:shadow-rose transition-all duration-500"
//             >
//               <div className="w-16 h-16 mb-8 border border-rose/30 flex items-center justify-center group-hover:bg-rose group-hover:border-rose transition-all duration-500">
//                 <Target className="w-7 h-7 text-rose group-hover:text-primary-foreground transition-colors duration-500" strokeWidth={1} />
//               </div>
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-8 h-px bg-rose" />
//                 <p className="text-rose font-sans tracking-[0.3em] text-xs uppercase">
//                   Our Goals
//                 </p>
//               </div>
//               <h2 className="font-serif text-3xl md:text-4xl mb-6">
//                 Expanding Horizons
//               </h2>
//               <p className="text-muted-foreground leading-relaxed">
//                 To establish 4–5 boutiques within the next 2–3 years across Thane, Mumbai, and Pune.
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Mission */}
//       <section className="py-28 md:py-40 bg-secondary/30">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//             >
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-8 h-px bg-sage" />
//                 <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//                   Our Story
//                 </p>
//               </div>
//               <h2 className="font-serif text-4xl md:text-5xl mb-8">
//                 Seamless Fashion Experience
//               </h2>
//               <p className="text-muted-foreground mb-6 leading-relaxed">
//                 We provide customers with a seamless online shopping experience, offering a wide range of fashionable and affordable clothing items. Our unique selling proposition is our "Try Before You Buy Online" service, which allows customers to try their selected garments online using our AI Tool.
//               </p>
//               <p className="text-muted-foreground leading-relaxed">
//                 Additionally, we offer on-demand doorstep tailoring services in Thane & Mulund area, enabling customers to create custom designs, convert old sarees into designer wear, and request alterations, all from the comfort of their homes.
//               </p>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="aspect-[4/5] overflow-hidden group"
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"
//                 alt="Fashion craftsmanship"
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//               />
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="py-28 md:py-40 border-t border-border">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-20">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center justify-center gap-4 mb-4"
//             >
//               <div className="w-8 h-px bg-sage" />
//               <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//                 Meet Our Experts
//               </p>
//               <div className="w-8 h-px bg-sage" />
//             </motion.div>
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-4xl md:text-5xl mb-6"
//             >
//               Our Team
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.15 }}
//               className="text-muted-foreground max-w-2xl mx-auto"
//             >
//               A dedicated team of professionals committed to delivering excellence in every stitch.
//             </motion.p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {teamMembers.map((member, index) => (
//               <motion.div
//                 key={member.name}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="group"
//               >
//                 <div className="aspect-[3/4] overflow-hidden mb-6 relative">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 </div>
//                 <h3 className="font-serif text-xl mb-1 group-hover:text-sage transition-colors duration-300">{member.name}</h3>
//                 <p className="text-sage text-sm font-sans tracking-wide uppercase mb-3">{member.role}</p>
//                 <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section className="py-28 md:py-40 bg-secondary/30">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-20">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center justify-center gap-4 mb-4"
//             >
//               <div className="w-8 h-px bg-sage" />
//               <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//                 What We Offer
//               </p>
//               <div className="w-8 h-px bg-sage" />
//             </motion.div>
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-4xl md:text-5xl"
//             >
//               Your Trusted Fashion Partner
//             </motion.h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: Scissors,
//                 title: "Expert Designers",
//                 description: "Our team of expert designers will guide you through the entire design process with the latest style guide.",
//               },
//               {
//                 icon: Home,
//                 title: "Doorstep Service",
//                 description: "Our tailor will visit your home to confirm measurements and offer a free pick-up facility for fabric and samples.",
//               },
//               {
//                 icon: Shirt,
//                 title: "All Garment Types",
//                 description: "From classic patterns and Bollywood-inspired designs to the latest fashion trends - we stitch all types of garments.",
//               },
//               {
//                 icon: Sparkles,
//                 title: "Perfect Finish",
//                 description: "We stitch your garment to perfection - both in quality and finish, delivered hassle-free to your address.",
//               },
//             ].map((service, index) => (
//               <motion.div
//                 key={service.title}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.15 }}
//                 className="group bg-background border border-border p-8 hover:border-sage/50 hover:shadow-sage transition-all duration-500"
//               >
//                 <div className="w-14 h-14 mb-6 border border-sage/30 flex items-center justify-center group-hover:bg-sage group-hover:border-sage transition-all duration-500">
//                   <service.icon className="w-6 h-6 text-sage group-hover:text-primary-foreground transition-colors duration-500" strokeWidth={1} />
//                 </div>
//                 <h3 className="font-serif text-xl mb-4 group-hover:text-sage transition-colors duration-300">{service.title}</h3>
//                 <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How We Work */}
//       <section className="py-28 md:py-40">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="aspect-[4/5] overflow-hidden order-2 lg:order-1 group"
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
//                 alt="Tailoring process"
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//               />
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="order-1 lg:order-2"
//             >
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-8 h-px bg-sage" />
//                 <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
//                   Our Promise
//                 </p>
//               </div>
//               <h2 className="font-serif text-4xl md:text-5xl mb-8">
//                 Hassle-Free Fashion
//               </h2>
//               <p className="text-muted-foreground mb-6 leading-relaxed">
//                 Thanks to our online/doorstep tailoring service, you don't have to worry about finding the right tailor or finding a designer who understands your fashion needs. Our team of expert designers, tailors, and customer representatives will be your trusted partner in achieving a world-class, fashionable, customized wardrobe.
//               </p>
//               <p className="text-muted-foreground leading-relaxed">
//                 Our website is easy to use, with a detailed guide that helps you choose the dress length, neckline, sleeves, hemline, openings, and other specifics of your preference. When you place an order with us, our tailor will visit your home to confirm all measurements and offer a free pick-up facility to collect the fabric and sample from you.
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-28 md:py-40 bg-sage text-primary-foreground">
//         <div className="container mx-auto px-6 text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="font-serif text-4xl md:text-6xl mb-8"
//           >
//             Experience STYLISTE
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="text-primary-foreground/80 max-w-xl mx-auto mb-12 leading-relaxed"
//           >
//             Visit our boutique or book a doorstep consultation with one of our expert designers.
//           </motion.p>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="flex flex-col sm:flex-row gap-4 justify-center"
//           >
//           <Link
//   to="/appointment"
//   className="px-6 py-3 text-base font-medium bg-background text-foreground border rounded-md hover:bg-background/90 flex items-center gap-2 justify-center"
// >
//   Book Appointment
//   <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
// </Link>
//           <Link
//   to="/contact"
//   className="px-6 py-3 text-base font-medium border border-white/50 rounded-md hover:bg-white/10"
// >
//   Contact Us
// </Link>

//           </motion.div>
//         </div>

//       </section>
//       <Footer />
//     </div>
//   );
// };

// export default About;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Scissors,
  Home,
  Shirt,
  Sparkles,
  Eye,
  Target,
  Users,
  Award,
  Heart,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import heroAbout from "../../assets/hero-about.jpg";
import aboutUsApi, { type AboutSection } from "../../api/aboutUsApi";

const IMG_BASE = import.meta.env.VITE_API_IMG_URL || "http://localhost:8080";

function getAssetUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/")) {
    return `${IMG_BASE}${url}`;
  }
  return `${IMG_BASE}/${url}`;
}

export function getIconComponent(name?: string) {
  switch (name?.toLowerCase()) {
    case "eye":
      return Eye;
    case "target":
      return Target;
    case "scissors":
      return Scissors;
    case "home":
      return Home;
    case "shirt":
      return Shirt;
    case "sparkles":
      return Sparkles;
    case "users":
      return Users;
    case "award":
      return Award;
    case "heart":
      return Heart;
    default:
      return HelpCircle;
  }
}

interface Group {
  type: string;
  items: AboutSection[];
}

const About = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aboutUsApi.getAboutSections()
      .then((data) => {
        setSections(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load About Us sections:", err);
        setLoading(false);
      });
  }, []);

  const renderGroups = () => {
    const groups: Group[] = [];
    const groupableTypes = ["VISION_GOAL", "TEAM_MEMBER", "SERVICE_CARD"];

    sections.forEach((section) => {
      const lastGroup = groups[groups.length - 1];
      if (
        lastGroup &&
        lastGroup.type === section.layoutType &&
        groupableTypes.includes(section.layoutType)
      ) {
        lastGroup.items.push(section);
      } else {
        groups.push({
          type: section.layoutType,
          items: [section],
        });
      }
    });

    return groups.map((group, idx) => {
      const { type, items } = group;

      switch (type) {
        case "HERO":
          const hero = items[0];
          return (
            <section key={`sec-${idx}`} className="relative py-28 md:py-40 overflow-hidden bg-primary text-primary-foreground">
              <div className="absolute inset-0">
                <img
                  src={hero.imageUrl ? getAssetUrl(hero.imageUrl) : heroAbout}
                  alt="Styliste Couturier boutique"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/60" />
              </div>
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-6"
                  >
                    <div className="w-8 h-px bg-primary-foreground/60" />
                    <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase">
                      {hero.subtitle || "About Us"}
                    </p>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-primary-foreground"
                  >
                    {hero.title.split('\n').map((line, lIdx) => (
                      <React.Fragment key={lIdx}>
                        {line}
                        {lIdx < hero.title.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-primary-foreground/80 text-lg leading-relaxed mb-8"
                  >
                    {hero.content}
                  </motion.p>
                </div>
              </div>
            </section>
          );

        case "VISION_GOAL":
          return (
            <section key={`sec-${idx}`} className="py-28 md:py-40 bg-background text-foreground">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                  {items.map((item, itemIdx) => {
                    const IconComponent = getIconComponent(item.icon);
                    return (
                      <motion.div
                        key={`vg-${itemIdx}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: itemIdx * 0.15 }}
                        className="group p-8 md:p-12 border border-border bg-card hover:border-sage/50 hover:shadow-sage transition-all duration-500"
                      >
                        <div className="w-16 h-16 mb-8 border border-sage/30 flex items-center justify-center group-hover:bg-sage group-hover:border-sage transition-all duration-500 rounded">
                          <IconComponent
                            className="w-7 h-7 text-sage group-hover:text-primary-foreground transition-colors duration-500"
                            strokeWidth={1}
                          />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-8 h-px bg-sage" />
                          <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
                            {item.subtitle}
                          </p>
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl mb-6">
                          {item.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          {item.content}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

        case "STORY_IMAGE_RIGHT":
          const storyR = items[0];
          return (
            <section key={`sec-${idx}`} className="py-28 md:py-40 bg-primary text-primary-foreground">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-px bg-primary-foreground/60" />
                      <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase">
                        {storyR.subtitle}
                      </p>
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl mb-8 text-primary-foreground">
                      {storyR.title}
                    </h2>
                    <div 
                      className="text-primary-foreground/80 mb-6 leading-relaxed text-sm md:text-base space-y-4"
                      dangerouslySetInnerHTML={{ __html: storyR.content || "" }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="aspect-[4/5] overflow-hidden group rounded-lg"
                  >
                    <img
                      src={getAssetUrl(storyR.imageUrl)}
                      alt={storyR.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </motion.div>
                </div>
              </div>
            </section>
          );

        case "STORY_IMAGE_LEFT":
          const storyL = items[0];
          return (
            <section key={`sec-${idx}`} className="py-28 md:py-40 bg-background text-foreground">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="aspect-[4/5] overflow-hidden order-2 lg:order-1 group rounded-lg"
                  >
                    <img
                      src={getAssetUrl(storyL.imageUrl)}
                      alt={storyL.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="order-1 lg:order-2"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-px bg-sage" />
                      <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
                        {storyL.subtitle}
                      </p>
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl mb-8">
                      {storyL.title}
                    </h2>
                    <div 
                      className="text-muted-foreground mb-6 leading-relaxed text-sm md:text-base space-y-4"
                      dangerouslySetInnerHTML={{ __html: storyL.content || "" }}
                    />
                  </motion.div>
                </div>
              </div>
            </section>
          );

        case "TEAM_MEMBER":
          return (
            <section key={`sec-${idx}`} className="py-28 md:py-40 bg-background text-foreground border-t border-border">
              <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-4 mb-4"
                  >
                    <div className="w-8 h-px bg-sage" />
                    <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase">
                      Meet Our Experts
                    </p>
                    <div className="w-8 h-px bg-sage" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="font-serif text-4xl md:text-5xl mb-6"
                  >
                    Our Team
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base"
                  >
                    A dedicated team of professionals committed to delivering
                    excellence in every stitch.
                  </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {items.map((member, itemIdx) => (
                    <motion.div
                      key={`member-${itemIdx}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: itemIdx * 0.1 }}
                      className="group"
                    >
                      <div className="aspect-[3/4] overflow-hidden mb-6 relative rounded-lg">
                        <img
                          src={getAssetUrl(member.imageUrl)}
                          alt={member.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <h3 className="font-serif text-xl mb-1 group-hover:text-sage transition-colors duration-300">
                        {member.title}
                      </h3>
                      <p className="text-sage text-sm font-sans tracking-wide uppercase mb-3">
                        {member.subtitle}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {member.content}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );

        case "SERVICE_CARD":
          return (
            <section key={`sec-${idx}`} className="py-28 md:py-40 bg-primary text-primary-foreground">
              <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-4 mb-4"
                  >
                    <div className="w-8 h-px bg-primary-foreground/60" />
                    <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase">
                      What We Offer
                    </p>
                    <div className="w-8 h-px bg-primary-foreground/60" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="font-serif text-4xl md:text-5xl text-primary-foreground"
                  >
                    Your Trusted Fashion Partner
                  </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {items.map((service, itemIdx) => {
                    const IconComponent = getIconComponent(service.icon);
                    return (
                      <motion.div
                        key={`service-${itemIdx}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: itemIdx * 0.15 }}
                        className="group bg-primary-foreground/10 border border-primary-foreground/20 p-8 hover:bg-primary-foreground/20 transition-all duration-500 rounded-lg"
                      >
                        <div className="w-14 h-14 mb-6 border border-primary-foreground/30 flex items-center justify-center group-hover:bg-primary-foreground group-hover:border-primary-foreground transition-all duration-500 rounded">
                          <IconComponent
                            className="w-6 h-6 text-primary-foreground group-hover:text-primary transition-colors duration-500"
                            strokeWidth={1}
                          />
                        </div>
                        <h3 className="font-serif text-xl mb-4 text-primary-foreground group-hover:text-accent transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-primary-foreground/70 text-sm leading-relaxed">
                          {service.content}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

        case "CTA":
          const cta = items[0];
          return (
            <section key={`sec-${idx}`} className="py-28 md:py-40 bg-primary text-primary-foreground border-t border-primary-foreground/10">
              <div className="container mx-auto px-6 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-serif text-4xl md:text-6xl mb-8"
                >
                  {cta.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-primary-foreground/80 max-w-xl mx-auto mb-12 leading-relaxed"
                >
                  {cta.content}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link
                    to="/appointment"
                    className="group inline-flex items-center gap-2
                   px-8 py-4 rounded-xl
                   bg-background text-foreground
                   font-medium transition-all
                   hover:bg-background/90"
                  >
                    Book Appointment
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center
                   px-8 py-4 rounded-xl
                   border border-primary-foreground/40
                   text-primary-foreground
                   transition hover:bg-primary-foreground/10"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </section>
          );

        default:
          const textBlock = items[0];
          return (
            <section key={`sec-${idx}`} className="py-20 bg-background text-foreground border-b border-border">
              <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="font-serif text-3xl mb-6">{textBlock.title}</h2>
                {textBlock.subtitle && (
                  <h4 className="text-xs uppercase text-sage font-sans tracking-widest mb-4">{textBlock.subtitle}</h4>
                )}
                <p className="text-muted-foreground leading-relaxed text-base">{textBlock.content}</p>
              </div>
            </section>
          );
      }
    });
  };

  return (
    <main>
      <Helmet>
        <title>About Styliste Couturier | Premium Designer Boutique in Thane</title>
        <meta
          name="description"
          content="Styliste Couturier is a Thane-based fashion boutique offering bespoke women’s wear, bridal tailoring, and personalized styling services."
        />
      </Helmet>

      {loading ? (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-[#5E6E54]">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 size={36} className="animate-spin mb-4" />
            <p className="font-serif text-lg tracking-wide">Loading About Styliste...</p>
          </div>
          <Footer />
        </div>
      ) : (
        <>
          <Navbar />
          {sections.length === 0 ? (
            <div className="min-h-screen flex items-center justify-center text-gray-400">
              No sections found. Please add sections in the Admin panel.
            </div>
          ) : (
            renderGroups()
          )}
          <Footer />
        </>
      )}
    </main>
  );
};

export default About;
