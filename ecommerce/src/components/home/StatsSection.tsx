import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Users, Award, Shirt, ThumbsUp } from "lucide-react";
import { useEffect, useRef } from "react";

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Happy Customers" },
  { icon: Award, value: 25, suffix: "+", label: "Years Experience" },
  { icon: Shirt, value: 1000, suffix: "+", label: "Garments Created" },
  { icon: ThumbsUp, value: 100, suffix: "%", label: "Satisfaction Rate" },
];

const AnimatedNumber = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const spring = useSpring(0, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${latest}${suffix}`;
      }
    });
    return unsubscribe;
  }, [display, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

export const StatsSection = () => {
  return (
    <section className="relative">
      {/* Top green bar */}
      <div className="h-2 bg-primary" />
      
      <div className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                >
                  <stat.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </motion.div>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-muted-foreground text-sm tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom green bar */}
      <div className="h-2 bg-primary" />
    </section>
  );
};
