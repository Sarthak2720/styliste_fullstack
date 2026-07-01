// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// // import { Layout } from "@/components/layout/Layout";
// // import { Button } from "@/components/ui/button";

// import {
//   ArrowRight,
//   Scissors,
//   Sparkles,
//   Shirt,
//   RefreshCw,
//   Palette,
//   Clock,
//   Truck,
//   Heart,
// } from "lucide-react";
// import Navbar from "../../components/layout/Navbar";
// import { Footer } from "../../components/layout/Footer";
// import bespokeTailoringImg from "../../assets/Bespoke Tailoring.jpg";
// import designerDressesImg from "../../assets/Designer Dresses.jpg";
// import bridalWearImg from "../../assets/Bridal Wear.jpg";
// import alterationsImg from "../../assets/Alterations & Repairs.jpg";
// import themeOutfitsImg from "../../assets/service-designing.jpg";
// import sareeTransformImg from "../../assets/service-saree-transform.jpg";


// const services = [
//   {
//     icon: Scissors,
//     title: "Bespoke Tailoring",
//     description:
//       "Expert craftsmanship for made-to-measure garments tailored precisely to your body and style.",
//     bgImage: bespokeTailoringImg,
//   },
//   {
//     icon: Shirt,
//     title: "Designer Dresses",
//     description:
//       "Elegant designer dresses crafted with premium fabrics, embroidery, and modern silhouettes.",
//     bgImage: designerDressesImg,
//   },
//   {
//     icon: RefreshCw,
//     title: "Upscaling Old Sarees",
//     description:
//       "Transform cherished sarees into contemporary outfits while preserving their sentimental value.",
//     bgImage: sareeTransformImg,
//   },
//   {
//     icon: Sparkles,
//     title: "Bridal Wear",
//     description:
//       "Luxury bridal outfits designed with intricate hand embroidery and flawless fitting.",
//     bgImage: bridalWearImg,
//   },
//   {
//     icon: Palette,
//     title: "Theme-Based Outfits",
//     description:
//       "Perfectly coordinated outfits for families, events, and themed celebrations.",
//     bgImage: themeOutfitsImg,
//   },
//   {
//     icon: Heart,
//     title: "Alterations & Repairs",
//     description:
//       "Professional alterations and invisible repairs to ensure a perfect, comfortable fit.",
//     bgImage: alterationsImg,
//   },
// ];

// const processSteps = [
//   {
//     number: "01",
//     title: "Consultation",
//     description:
//       "Visit our boutique or book a doorstep consultation. We understand your ideas, occasion details, and preferences.",
//   },
//   {
//     number: "02",
//     title: "Design & Measurement",
//     description:
//       "Our experts help you choose the perfect design while taking precise measurements for a flawless fit.",
//   },
//   {
//     number: "03",
//     title: "Crafting",
//     description:
//       "Our skilled tailors bring your vision to life with meticulous attention to detail and premium craftsmanship.",
//   },
//   {
//     number: "04",
//     title: "Delivery",
//     description:
//       "Your perfectly finished garment is delivered to your doorstep, ready to make you shine.",
//   },
// ];

// const Services = () => {
//   return (
//     <main>
//       {/* Hero */}
//       <section className="relative py-28 md:py-40 overflow-hidden bg-primary text-primary-foreground">
//         <Navbar />
//         <div className="absolute inset-0">
//           <img
//             src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
//             alt="STYLISTE services"
//             className="w-full h-full object-cover opacity-10"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
//         </div>
//         <div className="container mx-auto px-6 relative z-10">
//           <div className="max-w-3xl">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex items-center gap-4 mb-6"
//             >
//               <div className="w-8 h-px bg-primary-foreground/60" />
//               <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase">
//                 Our Services
//               </p>
//             </motion.div>
//             <motion.h1
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-primary-foreground"
//             >
//               Complete Fashion
//               <br />
//               <span className="italic text-accent">Solutions</span>
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="text-primary-foreground/80 text-lg leading-relaxed max-w-2xl"
//             >
//               From bespoke tailoring to transforming treasured sarees, we offer
//               comprehensive fashion services tailored to your unique style and
//               needs.
//             </motion.p>
//           </div>
//         </div>
//       </section>

//       {/* Services Grid */}
//       <section className="py-28 md:py-40 bg-background text-foreground">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {services.map((service, index) => (
//               <motion.div
//                 key={service.title}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="group p-8 border border-border bg-card hover:border-sage/50 hover:shadow-sage transition-all duration-500"
//               >
//                 <div className="w-16 h-16 mb-6 border border-sage/30 flex items-center justify-center group-hover:bg-sage group-hover:border-sage transition-all duration-500">
//                   <service.icon
//                     className="w-7 h-7 text-sage group-hover:text-primary-foreground transition-colors duration-500"
//                     strokeWidth={1}
//                   />
//                 </div>
//                 <h3 className="font-serif text-2xl mb-4 group-hover:text-sage transition-colors duration-300">
//                   {service.title}
//                 </h3>
//                 <p className="text-muted-foreground text-sm leading-relaxed mb-6">
//                   {service.description}
//                 </p>
//                 <ul className="space-y-2">
//                   {service.features.map((feature) => (
//                     <li
//                       key={feature}
//                       className="flex items-center gap-2 text-sm text-muted-foreground"
//                     >
//                       <div className="w-1 h-1 bg-sage rounded-full" />
//                       {feature}
//                     </li>
//                   ))}
//                 </ul>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Unique Features */}
//       <section className="py-28 md:py-40 bg-primary text-primary-foreground">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-20">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center justify-center gap-4 mb-4"
//             >
//               <div className="w-8 h-px bg-primary-foreground/60" />
//               <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase">
//                 Why Choose Us
//               </p>
//               <div className="w-8 h-px bg-primary-foreground/60" />
//             </motion.div>
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-4xl md:text-5xl text-primary-foreground"
//             >
//               The STYLISTE Difference
//             </motion.h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Truck,
//                 title: "Doorstep Service",
//                 description:
//                   "We come to you. Our tailors visit your home for measurements and fabric pickup.",
//               },
//               {
//                 icon: Clock,
//                 title: "Timely Delivery",
//                 description:
//                   "We value your time. Every order is delivered on schedule, guaranteed.",
//               },
//               {
//                 icon: Heart,
//                 title: "Personal Touch",
//                 description:
//                   "Every garment is crafted with love and attention to your unique preferences.",
//               },
//             ].map((feature, index) => (
//               <motion.div
//                 key={feature.title}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.15 }}
//                 className="group text-center p-8"
//               >
//                 <div className="w-20 h-20 mx-auto mb-6 border-2 border-primary-foreground/30 rounded-full flex items-center justify-center group-hover:bg-primary-foreground group-hover:border-primary-foreground transition-all duration-500">
//                   <feature.icon
//                     className="w-8 h-8 text-primary-foreground group-hover:text-primary transition-colors duration-500"
//                     strokeWidth={1}
//                   />
//                 </div>
//                 <h3 className="font-serif text-xl mb-4 text-primary-foreground group-hover:text-accent transition-colors duration-300">
//                   {feature.title}
//                 </h3>
//                 <p className="text-primary-foreground/70 text-sm leading-relaxed">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Process */}
//       <section className="py-28 md:py-40 bg-background text-foreground">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-20">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center justify-center gap-4 mb-4"
//             >
//               <div className="w-8 h-px bg-rose" />
//               <p className="text-rose font-sans tracking-[0.3em] text-xs uppercase">
//                 How It Works
//               </p>
//               <div className="w-8 h-px bg-rose" />
//             </motion.div>
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-4xl md:text-5xl"
//             >
//               Our Simple Process
//             </motion.h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {processSteps.map((step, index) => (
//               <motion.div
//                 key={step.number}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.15 }}
//                 className="group relative"
//               >
//                 <div className="text-8xl font-serif text-sage/20 group-hover:text-sage/40 transition-colors duration-500 mb-4">
//                   {step.number}
//                 </div>
//                 <h3 className="font-serif text-xl mb-3 group-hover:text-sage transition-colors duration-300">
//                   {step.title}
//                 </h3>
//                 <p className="text-muted-foreground text-sm leading-relaxed">
//                   {step.description}
//                 </p>
//                 {index < processSteps.length - 1 && (
//                   <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-border" />
//                 )}
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
//             Ready to Transform Your Style?
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="text-primary-foreground/80 max-w-xl mx-auto mb-12 leading-relaxed"
//           >
//             Book a consultation today and let our experts create the perfect
//             outfit for you.
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
//              hover:bg-primary-foreground/10"
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

// export default Services;



import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// import { Layout } from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  Scissors,
  Sparkles,
  Shirt,
  RefreshCw,
  Palette,
  Clock,
  Truck,
  Heart,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

import bespokeTailoringImg from "../../assets/Bespoke Tailoring.jpg";
import designerDressesImg from "../../assets/Designer Dresses.jpg";
import bridalWearImg from "../../assets/Bridal Wear.jpg";
import alterationsImg from "../../assets/Alterations & Repairs.jpg";
import themeOutfitsImg from "../../assets/Theme-Based Outfits.jpg";
import sareeTransformImg from "../../assets/Upscaling Old Sarees.jpg";
import heroServices from "../../assets/hero-services.jpg";

const services = [
  {
    icon: Scissors,
    title: "Bespoke Tailoring",
    description:
      "Expert craftsmanship for made-to-measure garments tailored precisely to your body and style.",
    bgImage: bespokeTailoringImg,
  },
  {
    icon: Shirt,
    title: "Designer Dresses",
    description:
      "Elegant designer dresses crafted with premium fabrics, embroidery, and modern silhouettes.",
    bgImage: designerDressesImg,
  },
  {
    icon: RefreshCw,
    title: "Upscaling Old Sarees",
    description:
      "Transform cherished sarees into contemporary outfits while preserving their sentimental value.",
    bgImage: sareeTransformImg,
  },
  {
    icon: Sparkles,
    title: "Bridal Wear",
    description:
      "Luxury bridal outfits designed with intricate hand embroidery and flawless fitting.",
    bgImage: bridalWearImg,
  },
  {
    icon: Palette,
    title: "Theme-Based Outfits",
    description:
      "Perfectly coordinated outfits for families' events, and themed celebrations.",
    bgImage: themeOutfitsImg,
  },
  {
    icon: Heart,
    title: "Alterations & Repairs",
    description:
      "Professional alterations and invisible repairs to ensure a perfect, comfortable fit.",
    bgImage: alterationsImg,
  },
];

const processSteps = [
  {
    number: "01",
    title: "Consultation",
    description:
      "Visit our boutique or book a doorstep consultation. We understand your ideas, occasion details, and preferences.",
  },
  {
    number: "02",
    title: "Design & Measurement",
    description:
      "Our experts help you choose the perfect design while taking precise measurements for a flawless fit.",
  },
  {
    number: "03",
    title: "Crafting",
    description:
      "Our skilled tailors bring your vision to life with meticulous attention to detail and premium craftsmanship.",
  },
  {
    number: "04",
    title: "Delivery",
    description:
      "Your perfectly finished garment is delivered to your doorstep, ready to make you shine.",
  },
];

const Services = () => {
  return (
    <main>
      {/* Hero */}
      <section className="relative py-28 md:py-40 overflow-hidden bg-primary text-primary-foreground">
        <Navbar />
        <div className="absolute inset-0">
          <img
            src={heroServices}
            alt="Styliste Couturier services"
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
                Our Services
              </p>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-primary-foreground"
            >
              Complete Fashion
              <br />
              <span className="italic text-accent">Solutions</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-primary-foreground/80 text-lg leading-relaxed max-w-2xl"
            >
              From bespoke tailoring to transforming treasured sarees, we offer
              comprehensive fashion services tailored to your unique style and
              needs.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ================= SERVICES GRID (FIXED) ================= */}
   <section className="py-28 md:py-40 bg-background text-foreground">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <motion.div
          key={service.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative group h-[360px] border border-border overflow-hidden transition-all duration-500 hover:border-sage/50 hover:shadow-sage"
        >
          {/* ================= FRONT (DEFAULT) ================= */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 bg-card transition-opacity duration-300 group-hover:opacity-0">
            <div className="w-16 h-16 mb-6 rounded-full bg-sage/10 flex items-center justify-center">
              <service.icon className="w-7 h-7 text-sage" strokeWidth={1} />
            </div>
            <h3 className="font-serif text-2xl">{service.title}</h3>
          </div>

          {/* ================= HOVER ================= */}
{/* ================= HOVER ================= */}
<div className="absolute inset-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out">
  
  {/* IMAGE WRAPPER (IMPORTANT) */}
  <div className="absolute inset-0 overflow-hidden">
    <img
      src={service.bgImage}
      alt={service.title}
      className="
        w-full h-full object-cover
        scale-110 blur-[3px]
      "
    />
  </div>

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

  {/* Content */}
  <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
    <div className="w-14 h-14 mb-4 rounded-full bg-white/90 flex items-center justify-center">
      <service.icon className="w-6 h-6 text-sage" strokeWidth={1} />
    </div>

    <h3 className="font-serif text-2xl mb-2">
      {service.title}
    </h3>
    <p className="text-sm leading-relaxed text-white/90">
      {service.description}
    </p>
  </div>
</div>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Unique Features */}
      <section className="py-28 md:py-40 bg-primary text-primary-foreground">
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
                Why Choose Us
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
              The Styliste Couturier Difference
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Doorstep Service",
                description: "We come to you. Our tailors visit your home for measurements and fabric pickup.",
              },
              {
                icon: Clock,
                title: "Timely Delivery",
                description: "We value your time. Every order is delivered on schedule, guaranteed.",
              },
              {
                icon: Heart,
                title: "Personal Touch",
                description: "Every garment is crafted with love and attention to your unique preferences.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group text-center p-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 border-2 border-primary-foreground/30 rounded-full flex items-center justify-center group-hover:bg-primary-foreground group-hover:border-primary-foreground transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-primary-foreground group-hover:text-primary transition-colors duration-500" strokeWidth={1} />
                </div>
                <h3 className="font-serif text-xl mb-4 text-primary-foreground group-hover:text-accent transition-colors duration-300">{feature.title}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-28 md:py-40 bg-background text-foreground">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-4 mb-4"
            >
              <div className="w-8 h-px bg-rose" />
              <p className="text-rose font-sans tracking-[0.3em] text-xs uppercase">
                How It Works
              </p>
              <div className="w-8 h-px bg-rose" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl"
            >
              Our Simple Process
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative"
              >
                <div className="text-8xl font-serif text-sage/20 group-hover:text-sage/40 transition-colors duration-500 mb-4">
                  {step.number}
                </div>
                <h3 className="font-serif text-xl mb-3 group-hover:text-sage transition-colors duration-300">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 md:py-40 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-6xl mb-8"
          >
            Ready to Transform Your Style?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-primary-foreground/80 max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Book a consultation today and let our experts create the perfect outfit for you.
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
    className="
      group inline-flex items-center justify-center gap-2
      px-8 py-4 rounded-xl
      bg-background text-foreground
      font-medium
      transition-all duration-300
      hover:bg-background/90
    "
  >
    Book Appointment
    <ArrowRight
      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
      strokeWidth={1.5}
    />
  </Link>

  {/* Contact Us */}
  <Link
    to="/contact"
    className="
      inline-flex items-center justify-center
      px-8 py-4 rounded-xl
      border border-primary-foreground/40
      text-primary-foreground
      font-medium
      transition-all duration-300
      hover:bg-primary-foreground/10
      hover:border-primary-foreground
    "
  >
    Contact Us
  </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
