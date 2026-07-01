// import { motion } from "framer-motion";
// import { Plus, Minus } from "lucide-react";
// import { useState } from "react";
// // import Navbar from "../../components/layout/Navbar";

// const faqs = [
//   {
//     question: "Do you stitch blouses, dresses, salwar suits, etc., like normal tailors?",
//     answer: "Yes, we do stitch all types of garments as per your requirements with premium quality and perfect fitting guaranteed.",
//   },
//   {
//     question: "Do you provide doorstep service in Thane & Mulund areas?",
//     answer: "Yes, currently we are providing doorstep pickup and measurement service in Thane & Mulund areas for your convenience.",
//   },
//   {
//     question: "Do you create bridal outfits?",
//     answer: "Yes, we customise any type of garments as per your body type and occasion, including bridal lehengas, sarees, and complete wedding trousseau.",
//   },
//   {
//     question: "Do you stitch theme-based costumes?",
//     answer: "Yes, we do stitch theme-based costumes for events, parties, and special occasions with custom designs.",
//   },
//   {
//     question: "Can you stitch Twining dresses?",
//     answer: "Yes, we do stitch twining dresses from both fresh materials and old sarees for mother-daughter or family matching outfits.",
//   },
//   {
//     question: "Do you create ready-to-wear sarees?",
//     answer: "Yes, we do create ready-to-wear sarees that are pre-stitched for easy wearing without the hassle of draping.",
//   },
//   {
//     question: "If we need urgent delivery, how fast can you deliver any garments?",
//     answer: "We can deliver in 48 working hours with our Express service (Extra Charges Applicable). Quality is never compromised!",
//   },
// ];

// export const FAQSection = () => {
//   const [openIndex, setOpenIndex] = useState<number | null>(0);

//   return (
    
//     <section className="py-5 md:py-9 bg-background text-foreground relative overflow-hidden">
//       {/* Background decoration */}
//       <motion.div
//         animate={{ rotate: 360 }}
//         transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
//         className="absolute top-20 right-20 w-64 h-64 border border-primary/10 rounded-full"
//       />

//       <div className="container mx-auto px-6 relative z-10">
//         <div className="max-w-3xl mx-auto">
//           <div className="text-center mb-12">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="flex items-center justify-center gap-4 mb-4"
//             >
//               <div className="w-8 h-px bg-primary" />
//               <p className="text-primary font-sans tracking-[0.3em] text-xs uppercase">
//                 FAQs
//               </p>
//               <div className="w-8 h-px bg-primary" />
//             </motion.div>
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.1 }}
//               className="font-serif text-4xl md:text-5xl mb-4"
//             >
//               Frequently Asked <span className="italic text-primary">Questions</span>
//             </motion.h2>
//           </div>

//           <div className="space-y-4">
//             {faqs.map((faq, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.05 }}
//                 className="border border-border rounded-xl overflow-hidden bg-background"
//               >
//                 <button
//                   onClick={() => setOpenIndex(openIndex === index ? null : index)}
//                   className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
//                 >
//                   <span className="font-serif text-lg pr-4">{faq.question}</span>
//                   <motion.div
//                     animate={{ rotate: openIndex === index ? 180 : 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="flex-shrink-0"
//                   >
//                     {openIndex === index ? (
//                       <Minus className="w-5 h-5 text-primary" />
//                     ) : (
//                       <Plus className="w-5 h-5 text-muted-foreground" />
//                     )}
//                   </motion.div>
//                 </button>
//                 <motion.div
//                   initial={false}
//                   animate={{
//                     height: openIndex === index ? "auto" : 0,
//                     opacity: openIndex === index ? 1 : 0,
//                   }}
//                   transition={{ duration: 0.3 }}
//                   className="overflow-hidden"
//                 >
//                   <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
//                     {faq.answer}
//                   </p>
//                 </motion.div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question:
      "Do you stitch blouses, dresses, salwar suits, etc., like normal tailors?",
    answer:
      "Yes, we do stitch all types of garments as per your requirements with premium quality and perfect fitting guaranteed.",
  },
  {
    question:
      "Do you provide doorstep service in Thane & Mulund areas?",
    answer:
      "Yes, currently we are providing doorstep pickup and measurement service in Thane & Mulund areas for your convenience.",
  },
  {
    question: "Do you create bridal outfits?",
    answer:
      "Yes, we customise any type of garments as per your body type and occasion, including bridal lehengas, sarees, and complete wedding trousseau.",
  },
  {
    question: "Do you stitch theme-based costumes?",
    answer:
      "Yes, we do stitch theme-based costumes for events, parties, and special occasions with custom designs.",
  },
  {
    question: "Can you stitch Twining dresses?",
    answer:
      "Yes, we do stitch twining dresses from both fresh materials and old sarees for mother-daughter or family matching outfits.",
  },
  {
    question: "Do you create ready-to-wear sarees?",
    answer:
      "Yes, we do create ready-to-wear sarees that are pre-stitched for easy wearing without the hassle of draping.",
  },
  {
    question:
      "If we need urgent delivery, how fast can you deliver any garments?",
    answer:
      "We can deliver in 48 working hours with our Express service (Extra Charges Applicable). Quality is never compromised!",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-5 md:py-9 bg-background text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-20 w-64 h-64 border border-primary/10 rounded-full"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* HEADER */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-4 mb-4"
            >
              <div className="w-8 h-px bg-primary" />
              <p className="text-primary font-sans tracking-[0.3em] text-xs uppercase">
                FAQs
              </p>
              <div className="w-8 h-px bg-primary" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl mb-4"
            >
              Frequently Asked{" "}
              <span className="italic text-primary">Questions</span>
            </motion.h2>
          </div>

          {/* FAQ LIST */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -80 : 80,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: index * 0.08,
                }}
                className="border border-border rounded-xl overflow-hidden bg-background"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-serif text-lg pr-4">
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-primary" />
                    ) : (
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    )}
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
