import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

export default function SustainabilityComingSoon() {
  return (
    <section className="min-h-screen bg-[#0E1113] flex flex-col">
      <Navbar />

      <div className="min-h-screen flex-grow flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-center"
        >
          {/* Tag */}
          <p className="text-[#6E9F7D] tracking-[0.3em] uppercase text-xs mb-6">
            Sustainability
          </p>

          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-6">
            Coming Soon
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            We are building a thoughtful sustainability framework focused on
            ethical practices, responsible sourcing, and long-term environmental
            care — without compromising on quality or craftsmanship.
          </p>

          {/* Divider */}
          <div className="w-24 h-[1px] bg-[#6E9F7D] mx-auto mb-10" />

          {/* Footer Note */}
          <p className="text-sm text-gray-500">
            A more responsible future is on its way.
          </p>
        </motion.div>
      </div>

      <Footer />
    </section>
  );
}
