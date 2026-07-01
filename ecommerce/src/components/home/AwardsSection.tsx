// import { motion } from "framer-motion";
// import { Trophy } from "lucide-react";

// const awards = [
//   {
//     title: "Best Bespoke Tailoring Service – 2024",
//     description:
//       "Honoured for premium craftsmanship and deeply personalised tailoring experiences for modern women.",
//   },
//   {
//     title: "Excellence in Saree Transformation",
//     description:
//       "Recognised for innovative saree-to-western and Indo-western design artistry.",
//   },
// //   {
// //     title: "Women-Led Fashion Brand Award",
// //     description:
// //       "Celebrating empowerment, creativity, and confidence through thoughtful fashion design.",
// //   },
// ];

// export const AwardsSection = () => {
//   return (
//     <section className="relative pt-2 pb-10 overflow-hidden bg-[#F6F5F2]">
//       {/* Decorative flowing shapes */}
//       <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#9CAF88]/20 blur-3xl" />
//       <div className="absolute -bottom-32 -left-32 w-[460px] h-[460px] rounded-full bg-[#A8B79A]/30 blur-3xl" />

//       <div className="container mx-auto px-6 relative z-10">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="max-w-xl mb-14"
//         >
//           {/* <h2 className="font-serif text-3xl md:text-4xl text-[#2f3a2f] mb-4">
//             Awards & Accolades
//           </h2>
//           <p className="text-[#5f6f5f]">
//             A journey of dedication, artistry, and recognition in bespoke fashion.
//           </p> */}
//         </motion.div>

//         <div className="grid lg:grid-cols-12 gap-10 items-center">
//           {/* LEFT – Illustration style badge */}
//           <motion.div
//   initial={{ opacity: 0, x: -30 }}
//   whileInView={{ opacity: 1, x: 0 }}
//   viewport={{ once: true }}
//   transition={{ duration: 0.6 }}
//   className="lg:col-span-5 flex items-center"
// >
//   <div className="max-w-md">
//     {/* Small label */}
//     <span className="inline-block mb-4 px-4 py-1 rounded-full
//                      text-xs tracking-widest uppercase
//                      bg-[#9CAF88]/20 text-[#7F8F72]">
//       Recognition
//     </span>

//     {/* Heading */}
//     <h3 className="font-serif text-3xl md:text-4xl text-[#2f3a2f] mb-4">
//       Awards & Accolades
//     </h3>

//     {/* Description */}
//     <p className="text-[#5f6f5f] leading-relaxed mb-6">
//       Honouring our journey of craftsmanship, innovation, and dedication
//       to bespoke fashion for modern women.
//     </p>

//     {/* Gold divider */}
//     <div className="w-16 h-[2px] bg-[#C9A227]" />
//   </div>
// </motion.div>


//           {/* RIGHT – Award cards */}
//           <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
//             {awards.map((award, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.15 }}
//                 className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
//               >
//                 <div className="w-10 h-10 rounded-full bg-[#9CAF88]/20 flex items-center justify-center mb-4">
//                   <Trophy className="w-5 h-5 text-[#C9A227]" />
//                 </div>
//                 <h3 className="font-serif text-lg text-[#2f3a2f] mb-2">
//                   {award.title}
//                 </h3>
//                 <p className="text-sm text-[#5f6f5f] leading-relaxed">
//                   {award.description}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };


// import { motion } from "framer-motion";
// import awardImage from "../../assets/award.png";
// import awardIcon from "../../assets/award icon.png";
// import awardBg from "../../assets/award bg.jpg";

// const awards = [
//   {
//     title: "Best Bespoke Tailoring Service – 2024",
//     description:
//       "Recognised for premium craftsmanship and deeply personalised tailoring experiences for modern women.",
//   },
//   {
//     title: "Excellence in Saree Transformation",
//     description:
//       "Awarded for innovative saree-to-western and Indo-western design artistry.",
//   },
// ];

// export const AwardsSection = () => {
//   return (
//     <section className="py-14 bg-[#F6F7F4]">
//       <div className="container mx-auto px-6">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="relative rounded-3xl shadow-xl overflow-hidden"
//         >
//           {/* 🔹 BACKGROUND IMAGE INSIDE CARD */}
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{ backgroundImage: `url(${awardBg})` }}
//           />

//           {/* 🔹 SAGE OVERLAY (replaces blue tone) */}
//           <div className="absolute inset-0 bg-gradient-to-r from-[#F6F7F4]/95 via-[#EEF2EC]/90 to-[#F6F7F4]/95" />

//           <div className="relative z-10 grid lg:grid-cols-12 gap-10 p-8 md:p-12 items-center">
//             {/* LEFT – Award list */}
//             <div className="lg:col-span-7 space-y-10">
//               {awards.map((award, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: index * 0.15 }}
//                   className="flex items-start gap-6"
//                 >
//                   {/* 🏆 BIG AWARD ICON WITH BG */}
//                   <div className="relative flex-shrink-0">
//                     {/* Soft circular bg */}
//                     <div className="absolute inset-0 -z-10 rounded-full bg-[#9CAF88]/25 blur-xl" />

//                     {/* Sparkle */}
//                     <motion.span
//                       animate={{
//                         opacity: [0, 1, 0],
//                         scale: [0.8, 1.4, 0.8],
//                       }}
//                       transition={{
//                         duration: 2.5,
//                         repeat: Infinity,
//                         ease: "easeInOut",
//                       }}
//                       className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-[#C9A227]"
//                     />

//                     {/* Icon */}
//                     <motion.img
//                       src={awardIcon}
//                       alt="Award Icon"
//                       className="w-16 h-16 md:w-20 md:h-20"
//                       animate={{ y: [0, -6, 0] }}
//                       transition={{
//                         duration: 3,
//                         repeat: Infinity,
//                         ease: "easeInOut",
//                       }}
//                     />
//                   </div>

//                   {/* Text */}
//                   <div>
//                     <h3 className="font-serif text-lg md:text-xl text-[#2F3A2F] mb-1">
//                       {award.title}
//                     </h3>
//                     <p className="text-sm md:text-base text-[#5F6F5F] leading-relaxed">
//                       {award.description}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* RIGHT – Award Image */}
//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.7 }}
//               className="lg:col-span-5 flex justify-center"
//             >
//               <div className="relative">
//                 {/* Glow */}
//                 <div className="absolute inset-0 -z-10 rounded-full bg-[#9CAF88]/30 blur-3xl" />

//                 <img
//                   src={awardImage}
//                   alt="Awards & Recognition"
//                   className="w-72 md:w-80 lg:w-96 object-contain"
//                 />
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

import { motion } from "framer-motion";
import awardImage from "../../assets/award.png";
import awardIcon from "../../assets/award icon.png";
import awardBg from "../../assets/award bg.jpg";

const awards = [
  {
    title: "Best Bespoke Tailoring Service – 2024",
    description:
      "Recognised for premium craftsmanship and deeply personalised tailoring experiences for modern women.",
  },
  {
    title: "Excellence in Saree Transformation",
    description:
      "Awarded for innovative saree-to-western and Indo-western design artistry.",
  },
];

export const AwardsSection = () => {
  return (
    <section className="py-14 bg-[#F6F7F4] overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative rounded-3xl shadow-xl overflow-hidden"
        >
          {/* 🔹 BACKGROUND IMAGE */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${awardBg})` }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* 🔹 SAGE OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F6F7F4]/95 via-[#EEF2EC]/90 to-[#F6F7F4]/95" />

          {/* 🔹 GOLDEN LIGHT SWEEP */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A227]/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 p-8 md:p-12 items-center">
            {/* LEFT – Award list */}
            <div className="lg:col-span-7 space-y-12">
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.25,
                    ease: "easeOut",
                  }}
                  className="flex items-start gap-6"
                >
                  {/* 🏆 ICON */}
                  <div className="relative flex-shrink-0">
                    {/* Aura */}
                    <motion.div
                      className="absolute inset-0 -z-10 rounded-full bg-[#9CAF88]/30 blur-2xl"
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Spark */}
                    <motion.span
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.6, 1.6, 0.6],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-[#C9A227]"
                    />

                    {/* Floating Icon */}
                    <motion.img
                      src={awardIcon}
                      alt="Award Icon"
                      className="w-16 h-16 md:w-20 md:h-20"
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, 2, -2, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="font-serif text-lg md:text-xl text-[#2F3A2F] mb-1">
                      {award.title}
                    </h3>
                    <p className="text-sm md:text-base text-[#5F6F5F] leading-relaxed">
                      {award.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RIGHT – Award Image */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:col-span-5 flex justify-center"
            >
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 1.2, -1.2, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Glow */}
                <div className="absolute inset-0 -z-10 rounded-full bg-[#9CAF88]/35 blur-3xl" />

                <img
                  src={awardImage}
                  alt="Awards & Recognition"
                  className="w-72 md:w-80 lg:w-96 object-contain"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
