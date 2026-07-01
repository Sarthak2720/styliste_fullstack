import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, ArrowRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Thane West",
    review:
      "Absolutely stunning work! They transformed my mother's old Kanjeevaram saree into a beautiful Indo-western gown.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80",
  },
  {
    name: "Anjali Mehta",
    location: "Mulund",
    review:
      "Got my wedding lehenga stitched from Styliste Couturier. The fitting was perfect and they delivered on time!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80",
  },
  {
    name: "Sunita Patel",
    location: "Thane",
    review:
      "Babita Ma'am personally ensured my outfit was exactly as I envisioned. Worth every rupee!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-80 h-80 border border-sage/15 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -left-40 w-96 h-96 border border-sage/10 rounded-full"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-8 h-px bg-sage/60" />
              <p className="text-sage/80 tracking-[0.3em] text-xs uppercase">
                Testimonials
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-sage"
            >
              Client <span className="italic text-sage/60">Love</span>
            </motion.h2>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 md:mt-0"
          >
            <Link
              to="/testimonials"
              className="group inline-flex items-center gap-3
                         rounded-xl border border-sage/40
                         px-7 py-3 text-sage
                         font-medium tracking-wide
                         transition-all duration-300
                         hover:bg-sage/10"
            >
              Read All Reviews
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>

        {/* TESTIMONIAL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="bg-sage/5 rounded-2xl p-8 border border-sage/15 relative"
            >
              <Quote className="w-10 h-10 text-sage/25 mb-4" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-sage text-sage" />
                ))}
              </div>

              <p className="text-sage/90 leading-relaxed mb-6">
                “{testimonial.review}”
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-serif text-lg text-sage">
                    {testimonial.name}
                  </h4>
                  <p className="text-sage/60 text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
