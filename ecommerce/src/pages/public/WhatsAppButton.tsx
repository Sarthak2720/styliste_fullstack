import { motion } from "framer-motion";

export const WhatsAppButton = () => {
  const phoneNumber = "917020601937"; // your WhatsApp number
  const message = "Hello! I'm interested in your tailoring services.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed left-6 bottom-6 z-50 group"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="relative">
        {/* Pulse animation */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-green-500 rounded-full"
        />

        {/* Main button */}
        <div className="relative flex items-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 overflow-hidden">
          <div className="w-14 h-14 flex items-center justify-center">
            {/* ✅ Font Awesome WhatsApp Icon */}
            <i className="fa-brands fa-whatsapp text-3xl"></i>
          </div>

          <motion.span
            initial={{ width: 0, opacity: 0, paddingRight: 0 }}
            whileHover={{ width: "auto", opacity: 1, paddingRight: 20 }}
            className="font-sans text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            Chat with us !
          </motion.span>
        </div>
      </div>
    </motion.a>
  );
};
