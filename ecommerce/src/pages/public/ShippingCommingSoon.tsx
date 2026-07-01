import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

export default function ComingSoon() {
  return (
    <section className="min-h-screen flex flex-col bg-[#0E1113]">
      <Navbar />

      {/* HERO */}
      <div className="min-h-screen flex-grow flex items-center justify-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center max-w-4xl"
        >
          {/* Small label */}
          <p className="text-[#9BB48F] tracking-[0.35em] uppercase text-xs md:text-sm mb-6">
            Shipping
          </p>

          {/* Main Title */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-6xl text-white mb-8 leading-tight">
            Project Under Construction
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            We are currently working behind the scenes to bring you something
            meaningful and refined. This section is under development and will
            be available very soon.
          </p>

          {/* Divider */}
          <div className="w-32 h-[1px] bg-[#9BB48F] mx-auto mb-10 opacity-70" />

          {/* Footer line */}
          <p className="text-sm md:text-base text-gray-500 tracking-wide">
            Thank you for your patience.
          </p>
        </motion.div>
      </div>

      <Footer />
    </section>
  );
}
