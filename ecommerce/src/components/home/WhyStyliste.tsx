import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Home, Clock, Award, Heart, Truck, Scissors, ChevronRight } from "lucide-react";

const reasons = [
  {
    icon: Scissors,
    title: "Expert Team",
    description: "25+ years of combined experience with Babita Dahal leading our talented team of craftsmen.",
  },
  {
    icon: Home,
    title: "Doorstep Service",
    description: "Convenient pickup and measurement service available in Thane & Mulund areas.",
  },
  {
    icon: Clock,
    title: "48 Hrs Express",
    description: "Urgent delivery available in 48 working hours with no compromise on quality.",
  },
  {
    icon: Award,
    title: "Saree Transformation",
    description: "Unique expertise in converting old sarees into stunning western & Indo-western dresses.",
  },
  {
    icon: Heart,
    title: "Perfect Fitting",
    description: "Personalized measurements and trial sessions to ensure your outfit fits perfectly.",
  },
  {
    icon: Truck,
    title: "B2B Services",
    description: "Creating professional samples for fashion designers and established brands.",
  },
];

// Show only first 4 items on homepage
const displayReasons = reasons.slice(0, 4);

export const WhyStyliste = () => {
  return (
    <section className="py-24 md:py-32 bg-background text-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center md:justify-start gap-4 mb-4"
            >
              <div className="w-8 h-px bg-primary" />
              <p className="text-primary font-sans tracking-[0.3em] text-xs uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Why Choose Us
              </p>
              <div className="w-8 h-px bg-primary" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4"
            >
              Why Women Trust
              <br />
              <span className="italic text-primary">Styliste Couturier</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-xl"
            >
              Experience excellence in every stitch with our premium boutique services
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 md:mt-0"
          >
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium group"
            >
              View All
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayReasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative bg-background rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-500"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 mb-6 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:shadow-lg transition-all duration-300"
                >
                  <reason.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" strokeWidth={1.5} />
                </motion.div>
                <h3 className="font-serif text-2xl mb-3 group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};