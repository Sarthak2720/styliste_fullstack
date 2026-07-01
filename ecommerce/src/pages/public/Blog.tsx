import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import heroBlog from "../../assets/hero-blog.jpg";
import { Footer } from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import { blogPublicApi, type PublicBlogSummary } from "../../api/blogApi";

const IMG_BASE = import.meta.env.VITE_API_IMG_URL || "";
function imgUrl(src: string) {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:")) return src;
  return IMG_BASE + src;
}

const Blog = () => {
  const [posts, setPosts] = useState<PublicBlogSummary[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [activeCategory, page]);

  const loadCategories = async () => {
    try {
      const cats = await blogPublicApi.getCategories();
      setCategories(cats);
    } catch {
      // fallback empty
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await blogPublicApi.list({
        category: activeCategory === "All" ? undefined : activeCategory,
        page,
        size: 10,
      });
      setPosts(res.content);
      setTotalPages(res.totalPages);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <main className="bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-28 md:py-40 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBlog} alt="Styliste Blog" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/60" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-primary-foreground/60" />
              <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase">Our Blog</p>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-primary-foreground">
              Fashion<br /><span className="italic text-accent">Insights</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-primary-foreground/80 text-lg leading-relaxed max-w-2xl">
              Discover styling tips, fashion trends, and expert advice from our team of designers and tailoring professionals.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-background text-foreground border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => { setActiveCategory("All"); setPage(0); }}
              className={`px-6 py-2 text-sm font-sans tracking-wide transition-all duration-300 hover:bg-sage hover:text-primary-foreground ${activeCategory === "All" ? "bg-sage text-primary-foreground" : "border border-border"}`}
            >
              All
            </motion.button>
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.05 }}
                onClick={() => { setActiveCategory(category); setPage(0); }}
                className={`px-6 py-2 text-sm font-sans tracking-wide transition-all duration-300 hover:bg-sage hover:text-primary-foreground ${activeCategory === category ? "bg-sage text-primary-foreground" : "border border-border"}`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {loading && (
        <section className="py-20 text-center">
          <p className="text-muted-foreground">Loading articles...</p>
        </section>
      )}

      {/* Featured Post */}
      {!loading && featured && (
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="aspect-[4/3] overflow-hidden">
                {featured.coverUrl ? (
                  <img src={imgUrl(featured.coverUrl)} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/40">No image</div>
                )}
              </div>
              <div>
                <span className="inline-block px-4 py-1 bg-primary-foreground/10 text-primary-foreground text-xs font-sans tracking-wide uppercase mb-6">{featured.category}</span>
                <h2 className="font-serif text-3xl md:text-4xl mb-6 text-primary-foreground group-hover:text-accent transition-colors duration-300">{featured.title}</h2>
                <p className="text-primary-foreground/80 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-primary-foreground/70 mb-8">
                  <div className="flex items-center gap-2"><User className="w-4 h-4" strokeWidth={1.5} />{featured.author}</div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" strokeWidth={1.5} />{new Date(featured.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" strokeWidth={1.5} />{featured.readTime}</div>
                </div>
                <Link to={`/blog/${featured.slug}`} className="inline-flex items-center gap-2 text-accent font-sans tracking-wide text-sm group/link">
                  Read More <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" strokeWidth={1.5} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      {!loading && rest.length > 0 && (
        <section className="py-20 bg-background text-foreground">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post, index) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group bg-background border border-border hover:border-sage/50 hover:shadow-sage transition-all duration-500">
                  <Link to={`/blog/${post.slug}`}>
                    <div className="aspect-[16/10] overflow-hidden">
                      {post.coverUrl ? (
                        <img src={imgUrl(post.coverUrl)} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No image</div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="inline-block px-3 py-1 bg-sage/10 text-sage text-xs font-sans tracking-wide uppercase mb-4">{post.category}</span>
                      <h3 className="font-serif text-xl mb-3 group-hover:text-sage transition-colors duration-300">{post.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{post.excerpt}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="text-center mt-16 flex justify-center gap-4">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="px-6 py-2 border border-sage text-sage font-sans tracking-wide text-sm hover:bg-sage hover:text-primary-foreground transition-all duration-300 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-2 border border-sage text-sage font-sans tracking-wide text-sm hover:bg-sage hover:text-primary-foreground transition-all duration-300 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {!loading && posts.length === 0 && (
        <section className="py-20 text-center">
          <p className="text-muted-foreground text-lg">No articles found.</p>
        </section>
      )}

      {/* CTA */}
      <section className="py-28 md:py-40 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-4xl md:text-6xl mb-8">
            Ready to Transform Your Style?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-primary-foreground/80 max-w-xl mx-auto mb-12 leading-relaxed">
            Book a consultation today and let our experts create the perfect outfit for you.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/appointment" className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-background text-foreground font-medium transition-all duration-300 hover:bg-background/90">
              Book Appointment <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-primary-foreground/40 text-primary-foreground font-medium transition-all duration-300 hover:bg-primary-foreground/10 hover:border-primary-foreground">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Blog;