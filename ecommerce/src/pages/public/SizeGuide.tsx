// import { useState } from "react";
// import { motion } from "framer-motion";

// const SizeGuide = () => {
//   const [activeTab, setActiveTab] = useState("women");

//   return (
//     <section>
//       <div className="min-h-screen bg-background py-20">
//         <div className="container mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="max-w-4xl mx-auto"
//           >
//             <h1 className="font-serif text-4xl md:text-5xl mb-4 tracking-wide text-center">
//               Size Guide
//             </h1>

//             <p className="text-muted-foreground text-center mb-12">
//               Find your perfect fit with our comprehensive size charts
//             </p>

//             {/* ------------ CUSTOM TABS ------------ */}
//             <div className="grid grid-cols-3 mb-8 border border-border">
//               <button
//                 onClick={() => setActiveTab("women")}
//                 className={`py-3 text-sm uppercase tracking-wide ${
//                   activeTab === "women"
//                     ? "bg-foreground text-background"
//                     : "bg-card hover:bg-secondary"
//                 }`}
//               >
//                 Women
//               </button>

//               <button
//                 onClick={() => setActiveTab("men")}
//                 className={`py-3 text-sm uppercase tracking-wide ${
//                   activeTab === "men"
//                     ? "bg-foreground text-background"
//                     : "bg-card hover:bg-secondary"
//                 }`}
//               >
//                 Men
//               </button>

//               {/* <button
//                 onClick={() => setActiveTab("accessories")}
//                 className={`py-3 text-sm uppercase tracking-wide ${
//                   activeTab === "accessories"
//                     ? "bg-foreground text-background"
//                     : "bg-card hover:bg-secondary"
//                 }`}
//               >
//                 Accessories
//               </button> */}
//             </div>

//             {/* ------------ WOMEN TABLE ------------ */}
//             {activeTab === "women" && (
//               <div className="border border-border overflow-hidden">
//                 <table className="w-full">
//                   <thead className="bg-card">
//                     <tr>
//                       <th className="p-4 text-left font-serif text-sm">Size</th>
//                       <th className="p-4 text-left font-serif text-sm">Bust (in)</th>
//                       <th className="p-4 text-left font-serif text-sm">Waist (in)</th>
//                       <th className="p-4 text-left font-serif text-sm">Hips (in)</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {[
//                       { size: "XS", bust: "31-32", waist: "24-25", hips: "34-35" },
//                       { size: "S", bust: "33-34", waist: "26-27", hips: "36-37" },
//                       { size: "M", bust: "35-36", waist: "28-29", hips: "38-39" },
//                       { size: "L", bust: "37-39", waist: "30-32", hips: "40-42" },
//                       { size: "XL", bust: "40-42", waist: "33-35", hips: "43-45" },
//                     ].map((r, i) => (
//                       <tr key={r.size} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
//                         <td className="p-4 font-medium">{r.size}</td>
//                         <td className="p-4 text-muted-foreground">{r.bust}</td>
//                         <td className="p-4 text-muted-foreground">{r.waist}</td>
//                         <td className="p-4 text-muted-foreground">{r.hips}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* ------------ MEN TABLE ------------ */}
//             {activeTab === "men" && (
//               <div className="border border-border overflow-hidden">
//                 <table className="w-full">
//                   <thead className="bg-card">
//                     <tr>
//                       <th className="p-4 text-left font-serif text-sm">Size</th>
//                       <th className="p-4 text-left font-serif text-sm">Chest (in)</th>
//                       <th className="p-4 text-left font-serif text-sm">Waist (in)</th>
//                       <th className="p-4 text-left font-serif text-sm">Hips (in)</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {[
//                       { size: "S", chest: "34-36", waist: "28-30", hips: "34-36" },
//                       { size: "M", chest: "38-40", waist: "32-34", hips: "38-40" },
//                       { size: "L", chest: "42-44", waist: "36-38", hips: "42-44" },
//                       { size: "XL", chest: "46-48", waist: "40-42", hips: "46-48" },
//                       { size: "XXL", chest: "50-52", waist: "44-46", hips: "50-52" },
//                     ].map((r, i) => (
//                       <tr key={r.size} className={i % 2 === 0 ? "bg-secondary/30" : ""}>
//                         <td className="p-4 font-medium">{r.size}</td>
//                         <td className="p-4 text-muted-foreground">{r.chest}</td>
//                         <td className="p-4 text-muted-foreground">{r.waist}</td>
//                         <td className="p-4 text-muted-foreground">{r.hips}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* ------------ ACCESSORIES ------------ */}
//             {/* {activeTab === "accessories" && (
//               <div className="border border-border overflow-hidden">
//                 <h3 className="font-serif text-lg p-4 bg-card border-b">
//                   Ring Sizes
//                 </h3>

//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-secondary/30">
//                       <th className="p-4 text-left text-sm">US Size</th>
//                       <th className="p-4 text-left text-sm">Diameter (mm)</th>
//                       <th className="p-4 text-left text-sm">Circumference (mm)</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {[
//                       { us: "5", dia: "15.7", circ: "49.3" },
//                       { us: "6", dia: "16.5", circ: "51.8" },
//                       { us: "7", dia: "17.3", circ: "54.4" },
//                       { us: "8", dia: "18.2", circ: "57.0" },
//                     ].map((r, i) => (
//                       <tr key={r.us} className={i % 2 === 1 ? "bg-secondary/30" : ""}>
//                         <td className="p-4">{r.us}</td>
//                         <td className="p-4 text-muted-foreground">{r.dia}</td>
//                         <td className="p-4 text-muted-foreground">{r.circ}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )} */}

//             {/* ------------ HOW TO MEASURE ------------ */}
//             <div className="mt-12 p-6 bg-card border border-border">
//               <h3 className="font-serif text-xl mb-4">How to Measure</h3>

//               <ul className="space-y-3 text-muted-foreground text-sm">
//                 <li>
//                   <strong className="text-foreground">Bust/Chest:</strong> Measure around the fullest part.
//                 </li>
//                 <li>
//                   <strong className="text-foreground">Waist:</strong> Measure around your natural waistline.
//                 </li>
//                 <li>
//                   <strong className="text-foreground">Hips:</strong> Measure around the fullest part of hips.
//                 </li>
//               </ul>
//             </div>

//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SizeGuide;


// import { useState } from "react";
// import { motion } from "framer-motion";
// import Navbar from "../../components/layout/Navbar";
// import { Footer } from "../../components/layout/Footer";

// const SizeGuide = () => {
//   const [activeTab, setActiveTab] = useState("women");

//   return (
//     <section>
//       <div className="min-h-screen bg-[#0E1113] py-20">
//         <Navbar />
//         <div className="container mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="max-w-4xl mx-auto"
//           >
//             <h1 className="font-serif text-4xl md:text-5xl mb-4 tracking-wide text-center text-white">
//               Size Guide
//             </h1>

//             <p className="text-gray-400 text-center mb-12">
//               Find your perfect fit with our comprehensive size charts
//             </p>

//             {/* ------------ CUSTOM TABS ------------ */}
//             <div className="grid grid-cols-2 mb-8 bg-[#1B1F22] border border-[#2A3035]">
//               <button
//                 onClick={() => setActiveTab("women")}
//                 className={`py-3 text-sm uppercase tracking-wide border ${
//                   activeTab === "women"
//                     ? "border-[#6E9F7D] text-[#6E9F7D]"
//                     : "border-transparent text-gray-300 hover:bg-[#22272B]"
//                 }`}
//               >
//                 Women
//               </button>

//               <button
//                 onClick={() => setActiveTab("men")}
//                 className={`py-3 text-sm uppercase tracking-wide border ${
//                   activeTab === "men"
//                     ? "border-[#6E9F7D] text-[#6E9F7D]"
//                     : "border-transparent text-gray-300 hover:bg-[#22272B]"
//                 }`}
//               >
//                 Men
//               </button>

//               {/*
//               <button
//                 onClick={() => setActiveTab("accessories")}
//                 className={`py-3 text-sm uppercase tracking-wide border ${
//                   activeTab === "accessories"
//                     ? "border-[#6E9F7D] text-[#6E9F7D]"
//                     : "border-transparent text-gray-300 hover:bg-[#22272B]"
//                 }`}
//               >
//                 Accessories
//               </button>
//               */}
//             </div>

//             {/* ------------ WOMEN TABLE ------------ */}
//             {activeTab === "women" && (
//               <div className="border border-[#2A3035] overflow-hidden">
//                 <table className="w-full">
//                   <thead className="bg-[#1B1F22]">
//                     <tr>
//                       <th className="p-4 text-left text-sm text-white font-serif">Size</th>
//                       <th className="p-4 text-left text-sm text-white font-serif">
//                         Bust (in)
//                       </th>
//                       <th className="p-4 text-left text-sm text-white font-serif">
//                         Waist (in)
//                       </th>
//                       <th className="p-4 text-left text-sm text-white font-serif">
//                         Hips (in)
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {[
//                       { size: "XS", bust: "31-32", waist: "24-25", hips: "34-35" },
//                       { size: "S", bust: "33-34", waist: "26-27", hips: "36-37" },
//                       { size: "M", bust: "35-36", waist: "28-29", hips: "38-39" },
//                       { size: "L", bust: "37-39", waist: "30-32", hips: "40-42" },
//                       { size: "XL", bust: "40-42", waist: "33-35", hips: "43-45" },
//                     ].map((r, i) => (
//                       <tr key={r.size} className={i % 2 === 0 ? "bg-[#14181B]" : ""}>
//                         <td className="p-4 text-white font-medium">{r.size}</td>
//                         <td className="p-4 text-gray-400">{r.bust}</td>
//                         <td className="p-4 text-gray-400">{r.waist}</td>
//                         <td className="p-4 text-gray-400">{r.hips}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* ------------ HOW TO MEASURE ------------ */}
//             <div className="mt-12 p-6 bg-[#14181B] border border-[#2A3035]">
//               <h3 className="font-serif text-xl mb-4 text-white">How to Measure</h3>

//               <ul className="space-y-3 text-gray-400 text-sm">
//                 <li>
//                   <strong className="text-white">Bust/Chest:</strong> Measure around the fullest part.
//                 </li>
//                 <li>
//                   <strong className="text-white">Waist:</strong> Measure around your natural waistline.
//                 </li>
//                 <li>
//                   <strong className="text-white">Hips:</strong> Measure around the fullest part of hips.
//                 </li>
//               </ul>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//         <Footer />
//     </section>
//   );
// };

// export default SizeGuide;



import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";

const SizeGuide = () => {
  return (
    <section>
      <div className="min-h-screen bg-[#0E1113] py-20">
        <Navbar />

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-5xl mb-4 tracking-wide text-center text-white">
              Size Guide for Womens
            </h1>

            <p className="text-gray-400 text-center mb-12">
              Find your perfect fit with our detailed size chart
            </p>

            {/* ------------ SIZE TABLE ------------ */}
            <div className="border border-[#2A3035] overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-[#1B1F22]">
                  <tr>
                    {[
                      "Size",
                      "Bust (in)",
                      "Waist (in)",
                      "Hips (in)",
                      "UK & AU",
                      "Euro",
                      "USA",
                    ].map((h) => (
                      <th
                        key={h}
                        className="p-4 text-left text-sm text-white font-serif whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {[
                    {
                      size: "Small",
                      bust: "32-34",
                      waist: "24-26",
                      hips: "34-36",
                      uk: "6-8",
                      euro: "32-34",
                      usa: "4-6",
                    },
                    {
                      size: "Medium",
                      bust: "34-36",
                      waist: "26-28",
                      hips: "36-38",
                      uk: "8-10",
                      euro: "34-36",
                      usa: "6-8",
                    },
                    {
                      size: "Large",
                      bust: "36-38",
                      waist: "28-30",
                      hips: "38-40",
                      uk: "10-12",
                      euro: "36-38",
                      usa: "8-10",
                    },
                    {
                      size: "XL",
                      bust: "38-40",
                      waist: "30-32",
                      hips: "40-42",
                      uk: "12-14",
                      euro: "38-40",
                      usa: "10-12",
                    },
                    {
                      size: "2XL",
                      bust: "40-42",
                      waist: "32-34",
                      hips: "42-44",
                      uk: "14-16",
                      euro: "40-42",
                      usa: "12-14",
                    },
                    {
                      size: "3XL",
                      bust: "42-44",
                      waist: "34-36",
                      hips: "44-46",
                      uk: "16-18",
                      euro: "42-44",
                      usa: "14-16",
                    },
                    {
                      size: "4XL",
                      bust: "44-46",
                      waist: "36-38",
                      hips: "46-48",
                      uk: "18-20",
                      euro: "44-46",
                      usa: "16-18",
                    },
                    {
                      size: "5XL",
                      bust: "46-48",
                      waist: "38-40",
                      hips: "48-50",
                      uk: "20-22",
                      euro: "46-48",
                      usa: "18-20",
                    },
                    {
                      size: "6XL",
                      bust: "48-50",
                      waist: "40-42",
                      hips: "50-52",
                      uk: "22-24",
                      euro: "48-50",
                      usa: "20-22",
                    },
                    {
                      size: "OS",
                      bust: "34-38",
                      waist: "26-30",
                      hips: "36-40",
                      uk: "8-12",
                      euro: "34-38",
                      usa: "6-10",
                    },
                  ].map((r, i) => (
                    <tr
                      key={r.size}
                      className={i % 2 === 0 ? "bg-[#14181B]" : ""}
                    >
                      <td className="p-4 text-white font-medium">
                        {r.size}
                      </td>
                      <td className="p-4 text-gray-400">{r.bust}</td>
                      <td className="p-4 text-gray-400">{r.waist}</td>
                      <td className="p-4 text-gray-400">{r.hips}</td>
                      <td className="p-4 text-gray-400">{r.uk}</td>
                      <td className="p-4 text-gray-400">{r.euro}</td>
                      <td className="p-4 text-gray-400">{r.usa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ------------ HOW TO MEASURE ------------ */}
            <div className="mt-12 p-6 bg-[#14181B] border border-[#2A3035]">
              <h3 className="font-serif text-xl mb-4 text-white">
                How to Measure
              </h3>

              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <strong className="text-white">Bust:</strong> Measure around the fullest part of your chest.
                </li>
                <li>
                  <strong className="text-white">Waist:</strong> Measure around your natural waistline.
                </li>
                <li>
                  <strong className="text-white">Hips:</strong> Measure around the fullest part of your hips.
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default SizeGuide;
