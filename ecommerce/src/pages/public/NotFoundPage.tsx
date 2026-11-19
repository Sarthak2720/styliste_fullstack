import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, PhoneCall } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import SEO from '../../components/common/SEO';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <SEO
        title="404 - Page Not Found | Styliste Couturier"
        description="The page you are looking for does not exist or has been moved. Explore custom fashion, bespoke tailoring and designer wear at Styliste Couturier Thane."
        canonical="https://styliste-couturier.com/404"
        noindex={true}
      />
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Subtle Accent Label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-sage/60" />
            <p className="text-sage font-sans tracking-[0.3em] text-xs uppercase font-medium">
              404 Error
            </p>
            <div className="w-8 h-px bg-sage/60" />
          </motion.div>

          {/* Big Stylized 404 Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-7xl sm:text-9xl font-bold tracking-tight text-sage/80 mb-4 select-none"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-3xl sm:text-4xl text-foreground mb-4"
          >
            Lost in Couture? Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto"
          >
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable. Let us help you find your way back.
          </motion.p>

          {/* Action Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-sage px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-sage/90 transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-sage/40 px-6 py-3 text-sm font-medium text-foreground hover:bg-sage/10 transition-all duration-300"
            >
              <Compass className="w-4 h-4" />
              Explore Collections
            </Link>

            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300"
            >
              <PhoneCall className="w-4 h-4" />
              Contact Us
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
