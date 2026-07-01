import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar /* , Sparkles */ } from "lucide-react";
import { useVisibleSectionTheme } from "../../hooks/useVisibleSectionTheme";

export const FloatingAppointmentButton = () => {
  const theme = useVisibleSectionTheme();
  const isDarkSection = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 1 
      }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link to="/appointment">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          {/* Animated glow ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute inset-0 rounded-full opacity-30 blur-xl transition-colors duration-300 ${
              isDarkSection ? "bg-white" : "bg-sage"
            }`}
          />
          
          {/* Pulsing outer ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0, 0.4]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeOut"
            }}
            className={`absolute inset-0 rounded-full border-2 transition-colors duration-300 ${
              isDarkSection ? "border-white" : "border-sage"
            }`}
          />

          {/* Main button */}
          <div className={`relative flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300 group-hover:shadow-lg ${
            isDarkSection
              ? "bg-white text-sage shadow-white/40 hover:shadow-white/60"
              : "bg-sage hover:bg-sage-light text-primary-foreground shadow-sage"
          }`}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Calendar className="w-5 h-5" strokeWidth={1.5} />
            </motion.div>
            <span className="font-sans font-medium tracking-wide text-sm">Book Appointment</span>
            {/* <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            </motion.div> */}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};