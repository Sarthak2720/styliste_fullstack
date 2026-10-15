import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, ArrowRight, Quote, MessageSquare, ExternalLink } from "lucide-react";
import reviewsApi from "../../api/reviewsApi";
import type { GoogleReview } from "../../types";

export const TestimonialsSection = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const data = await reviewsApi.getGoogleReviews();
        if (isMounted) {
          if (Array.isArray(data)) {
            setReviews(data);
          } else {
            setReviews([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setReviews([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayReviews = reviews.slice(0, 6);

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background circles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-80 h-80 border border-sage/15 rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -left-40 w-96 h-96 border border-sage/10 rounded-full pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-px bg-sage/60" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage/15 border border-sage/30 rounded-full text-xs font-semibold text-sage uppercase tracking-wider">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google Maps Reviews</span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-sage"
            >
              Client <span className="italic text-sage/60">Love & Stories</span>
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

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-sage/5 rounded-2xl p-8 border border-sage/15 animate-pulse">
                <div className="w-10 h-10 bg-sage/20 rounded-md mb-4" />
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-4 h-4 bg-sage/20 rounded-full" />
                  ))}
                </div>
                <div className="h-4 bg-sage/15 rounded mb-2 w-full" />
                <div className="h-4 bg-sage/15 rounded mb-2 w-4/5" />
                <div className="h-4 bg-sage/15 rounded mb-6 w-2/3" />
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-12 h-12 rounded-full bg-sage/20" />
                  <div className="space-y-1.5">
                    <div className="w-24 h-4 bg-sage/20 rounded" />
                    <div className="w-16 h-3 bg-sage/15 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && displayReviews.length === 0 && (
          <div className="max-w-xl mx-auto text-center py-16 px-6 bg-sage/5 rounded-3xl border border-sage/15 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sage/10 flex items-center justify-center text-sage">
              <MessageSquare className="w-8 h-8 opacity-75" />
            </div>
            <h3 className="font-serif text-2xl text-sage font-medium mb-2">Verified Reviews Loading Soon</h3>
            <p className="text-sage/70 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              We sync verified reviews directly from our Google Business profile. Be the first to share your couture experience with us!
            </p>
            <a
              href="https://maps.google.com/?q=Styliste+Couturier+Thane"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-sage/30 bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-sage transition-all hover:bg-sage/10 hover:border-sage/50 shadow-sm"
            >
              <span>View On Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* REVIEWS GRID */}
        {!loading && displayReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayReviews.map((review, index) => {
              const authorName = review.authorName || "Google Reviewer";
              const initials = authorName.slice(0, 2).toUpperCase();

              return (
                <motion.div
                  key={review.reviewId || `${authorName}-${index}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 }}
                  whileHover={{ y: -8 }}
                  className="bg-sage/5 rounded-2xl p-8 border border-sage/15 relative flex flex-col justify-between transition-all hover:border-sage/40 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Quote className="w-9 h-9 text-sage/30" />
                      {review.reviewUrl && (
                        <a
                          href={review.reviewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sage/40 hover:text-sage transition-colors p-1"
                          title="View on Google Maps"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(Math.max(1, Math.min(5, review.rating || 5)))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-sage/90 leading-relaxed mb-6 text-sm line-clamp-4">
                      “{review.text}”
                    </p>
                  </div>

                  {/* Reviewer Details */}
                  <div className="flex items-center gap-3 pt-4 border-t border-sage/15 mt-auto">
                    {review.authorPhotoUrl ? (
                      <img
                        src={review.authorPhotoUrl}
                        alt={authorName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-sage/20"
                        onError={(e) => {
                          // Fallback to initials circle if Google image fails to load
                          e.currentTarget.style.display = "none";
                          const nextElem = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElem) nextElem.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Fallback avatar if no photo or photo load error */}
                    <div
                      style={{ display: review.authorPhotoUrl ? "none" : "flex" }}
                      className="w-12 h-12 rounded-full bg-sage/20 border border-sage/30 items-center justify-center font-bold text-sage text-sm"
                    >
                      {initials}
                    </div>

                    <div className="overflow-hidden">
                      <h4 className="font-serif text-base text-sage truncate font-semibold">
                        {authorName}
                      </h4>
                      <p className="text-sage/60 text-xs">
                        {review.date ? review.date : "Verified Google Review"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
