// import { Link } from "react-router-dom";
// import { Instagram, Facebook, Twitter } from "lucide-react";

// const footerLinks = {
//   shop: [
//     { name: "Women", href: "/shop?category=women" },
//     { name: "Men", href: "/shop?category=men" },
//     { name: "Accessories", href: "/shop?category=accessories" },
//     { name: "New Arrivals", href: "/shop?filter=new" },
//     { name: "Sale", href: "/shop?filter=sale" },
//   ],
//   company: [
//     { name: "About Us", href: "/about" },
//     { name: "Careers", href: "/careers" },
//     { name: "Press", href: "/press" },
//     { name: "Sustainability", href: "/sustainability" },
//   ],
//   support: [
//     { name: "Contact Us", href: "/contact" },
//     { name: "Shipping", href: "/shipping" },
//     { name: "Returns", href: "/returns" },
//     { name: "Size Guide", href: "/size-guide" },
//     { name: "Book Appointment", href: "/appointment" },
//   ],
// };

// export const Footer = () => {
//   return (
//     <footer className="bg-card border-t border-border">
//       <div className="container mx-auto px-6 py-20">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
//           {/* Brand */}
//           <div className="lg:col-span-2">
//             <Link to="/" className="inline-block">
//               <h2 className="font-serif text-4xl tracking-[0.2em] mb-6">STYLISTE</h2>
//             </Link>
//             <p className="text-muted-foreground max-w-sm mb-8 text-sm leading-relaxed">
//               Curated luxury fashion for the modern individual. Where timeless elegance meets contemporary design.
//             </p>
//             <div className="flex items-center gap-2">
//               <a
//                 href="https://instagram.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="p-3 border border-border hover:border-sage hover:text-sage transition-all"
//                 aria-label="Instagram"
//               >
//                 <Instagram className="w-4 h-4" strokeWidth={1.5} />
//               </a>
//               <a
//                 href="https://facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="p-3 border border-border hover:border-sage hover:text-sage transition-all"
//                 aria-label="Facebook"
//               >
//                 <Facebook className="w-4 h-4" strokeWidth={1.5} />
//               </a>
//               <a
//                 href="https://twitter.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="p-3 border border-border hover:border-sage hover:text-sage transition-all"
//                 aria-label="Twitter"
//               >
//                 <Twitter className="w-4 h-4" strokeWidth={1.5} />
//               </a>
//             </div>
//           </div>

//           {/* Links */}
//           <div>
//             <h3 className="font-serif text-xl mb-6 tracking-wide">Shop</h3>
//             <ul className="space-y-4">
//               {footerLinks.shop.map((link) => (
//                 <li key={link.name}>
//                   <Link
//                     to={link.href}
//                     className="text-muted-foreground hover:text-sage transition-colors text-sm tracking-wide"
//                   >
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-serif text-xl mb-6 tracking-wide">Company</h3>
//             <ul className="space-y-4">
//               {footerLinks.company.map((link) => (
//                 <li key={link.name}>
//                   <Link
//                     to={link.href}
//                     className="text-muted-foreground hover:text-sage transition-colors text-sm tracking-wide"
//                   >
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-serif text-xl mb-6 tracking-wide">Support</h3>
//             <ul className="space-y-4">
//               {footerLinks.support.map((link) => (
//                 <li key={link.name}>
//                   <Link
//                     to={link.href}
//                     className="text-muted-foreground hover:text-sage transition-colors text-sm tracking-wide"
//                   >
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
//           <p className="text-muted-foreground text-xs tracking-wider">
//             © {new Date().getFullYear()} STYLISTE. All rights reserved.
//           </p>
//           <div className="flex items-center gap-8">
//             <Link
//               to="/privacy"
//               className="text-muted-foreground hover:text-foreground transition-colors text-xs tracking-wider"
//             >
//               Privacy Policy
//             </Link>
//             <Link
//               to="/terms"
//               className="text-muted-foreground hover:text-foreground transition-colors text-xs tracking-wider"
//             >
//               Terms of Service
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };



// 


import { Link } from "react-router-dom";
import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from "lucide-react";
import logo from "../../assets/logo.png"
const footerLinks = {
  services: [
    { name: "Bespoke Tailoring", href: "/services" },
    { name: "Designer Dresses", href: "/services" },
    { name: "Upscaling Sarees", href: "/services" },
    { name: "Bridal Wear", href: "/services" },
    { name: "Alterations", href: "/services" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Process", href: "/services" },
    { name: "Testimonials", href: "/testimonials" },
    {name: "Blog", href: "/blog"},
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    // { name: "Shipping", href: "/shipping" },
    // { name: "Returns", href: "/returns" },
    { name: "Size Guide", href: "/sizeGuide" },
    { name: "Book Appointment", href: "/appointment" },
  ],
 legal: [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Terms & Conditions", href: "/terms-of-service" },
],
};
 
export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
         <div className="lg:col-span-2">
  <Link to="/" className="inline-flex items-center gap-4 mb-6">
    {/* LOGO */}
    <img
      src={logo}
      alt="Styliste Couturier Logo"
      className="w-22 h-14 object-contain"
    />
  </Link>
 
 
            <p className="text-muted-foreground max-w-sm mb-6 text-sm leading-relaxed">
              Your trusted destination for premium custom fashion. We specialise
              in upscaling old sarees, all types of ladies garments, bridal wear,
              and theme-based outfits with perfect fitting and timely delivery.
            </p>
 
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="tel:+917020601937"
                className="flex items-center gap-2 text-muted-foreground hover:text-sage transition-colors text-sm"
              >
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                +91 7020601937
              </a>
 
              <a
                href="mailto:info@styliste-couturier.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-sage transition-colors text-sm"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                info@styliste-couturier.com
              </a>
 
              <div className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <span>
                  F-44, 1st Floor, Raymond Realty TenX Vibes, Next to Suniti Devi
                  Singhania School, Pokharan Rd. No. 2, Thane West - 400606
                </span>
              </div>
 
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" strokeWidth={1.5} />
                Tue–Sun: 11 AM – 8 PM
              </div>
            </div>
 
            {/* Social */}
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-border hover:border-sage hover:text-sage transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-border hover:border-sage hover:text-sage transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
 
          {/* Services */}
          <div>
            <h3 className="font-serif text-xl mb-6 tracking-wide text-sage">
              Services
            </h3>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-sage transition-colors text-sm tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Company */}
          <div>
            <h3 className="font-serif text-xl mb-6 tracking-wide text-sage">
              Company
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-sage transition-colors text-sm tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Support */}
          <div>
            <h3 className="font-serif text-xl mb-6 tracking-wide text-sage">
              Support
            </h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-sage transition-colors text-sm tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Legal */}
          <div>
            <h3 className="font-serif text-xl mb-6 tracking-wide text-sage">
              Legal
            </h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-sage transition-colors text-sm tracking-wide"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
 
        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-border grid gap-4 text-center md:grid-cols-[1fr_auto_1fr] md:items-center">
          <p className="text-muted-foreground text-xs tracking-wider md:justify-self-start">
            © {new Date().getFullYear()} STYLISTE COUTURIER. All rights reserved.
          </p>
 
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground md:justify-self-center">
            Designed &amp; developed by{" "}
            <a
              href="https://maximusatlas.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage hover:text-foreground transition-colors"
            >
              Maximus Atlas
            </a>
          </p>

          <div className="flex items-center justify-center gap-8 md:justify-self-end">
            <Link
              to="/privacy-policy"
              className="text-muted-foreground hover:text-foreground transition-colors text-xs tracking-wider"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-muted-foreground hover:text-foreground transition-colors text-xs tracking-wider"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
 
