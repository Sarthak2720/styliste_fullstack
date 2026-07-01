// @ts-nocheck
import { useEffect, useState, useRef, createElement } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import DOMPurify from "dompurify";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { blogPublicApi, type PublicBlogDetail } from "../../api/blogApi";
import { cssSizeToPx, normalizeIconId, renderIconById } from "../../components/admin/iconHub";

const IMG_BASE = import.meta.env.VITE_API_IMG_URL || "";
function imgUrl(src: string) {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:")) return src;
  return IMG_BASE + src;
}

const sage = "#6B7F5E";
const sageLight = "#EEF3EB";
const ink = "#2C2C2C";
const muted = "#7A7A7A";
const rose = "#B5505A";

function isLightBg(hex: string | undefined): boolean {
  if (!hex || typeof hex !== "string") return false;
  let h = hex.replace(/^#/, "").trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

function sanitize(html: string) {
  return DOMPurify.sanitize(html || "", {
    ADD_ATTR: ["data-icon", "data-icon-size", "data-icon-color", "contenteditable", "style"],
  });
}

function RichHtml({ html, style, className }: { html: string; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const resolveIcons = () => {
    if (!ref.current) return;
    ref.current.querySelectorAll("[data-icon]").forEach((el: HTMLElement) => {
      const raw = el.getAttribute("data-icon");
      const iconId = normalizeIconId(raw);
      if (iconId && !el.dataset.resolved) {
        el.dataset.resolved = "1";
        const size = el.getAttribute("data-icon-size") || "1em";
        const color = el.getAttribute("data-icon-color") || sage;
        const sizePx = cssSizeToPx(size, 16);
        el.innerHTML = "";
        el.style.display = "inline-flex";
        el.style.verticalAlign = "middle";
        el.style.width = size;
        el.style.height = size;
        el.style.color = color;
        const w = document.createElement("span");
        w.style.display = "inline-flex";
        w.style.width = "100%";
        w.style.height = "100%";
        w.style.alignItems = "center";
        w.style.justifyContent = "center";
        el.appendChild(w);
        import("react-dom/client").then(({ createRoot }) => {
          const node = renderIconById(iconId, { sizePx, color: "currentColor" }) || createElement("span", null, "⬡");
          createRoot(w).render(node);
        });
      }
    });
  };
  return (
    <div
      ref={(node) => { ref.current = node; setTimeout(resolveIcons, 0); }}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  );
}

function SectionRenderer({ section }: { section: any }) {
  const d = section.data;
  const hasImg = (src: string) => src && src.length > 0;

  switch (section.type) {
    case "intro":
      return (
        <div style={{ fontSize: 18, lineHeight: 1.7, color: ink }}>
          <RichHtml html={d.p1} style={{ marginBottom: 12 }} />
          {d.p2 && <RichHtml html={d.p2} />}
        </div>
      );
    case "heading":
      return <RichHtml html={d.text} style={{ fontFamily: "Georgia,serif", fontSize: 28, color: ink }} />;
    case "quote":
      return (
        <blockquote style={{ borderLeft: `4px solid ${sage}`, margin: 0, padding: "12px 20px", background: sageLight, fontStyle: "italic", color: ink }}>
          <RichHtml html={d.text} />
          {d.by && <RichHtml html={d.by} style={{ marginTop: 8, fontSize: 14, color: muted }} />}
        </blockquote>
      );
    case "takeaways":
      return (
        <div style={{ background: sageLight, border: `1px solid ${sage}33`, borderRadius: 12, padding: 20 }}>
          <RichHtml html={d.heading} style={{ fontFamily: "Georgia,serif", fontSize: 22, color: ink, marginBottom: 12 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {d.items?.map((it: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 28, height: 28, background: `${sage}33`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: sage, flexShrink: 0 }}>{i + 1}</div>
                <div><RichHtml html={it.title} style={{ fontWeight: 600, color: ink }} /><RichHtml html={it.desc} style={{ fontSize: 13, color: muted, marginTop: 2 }} /></div>
              </div>
            ))}
          </div>
        </div>
      );
    case "stats":
      return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(d.items?.length || 1, 4)}, 1fr)`, gap: 12 }}>
          {d.items?.map((it: any, i: number) => (
            <div key={i} style={{ textAlign: "center", padding: 16, background: `${rose}11`, borderRadius: 10, border: `1px solid ${rose}22` }}>
              <RichHtml html={it.val} style={{ fontFamily: "Georgia,serif", fontSize: 32, color: rose }} />
              <RichHtml html={it.lbl} style={{ fontSize: 12, color: muted, marginTop: 4 }} />
            </div>
          ))}
        </div>
      );
    case "imagetext":
      return (
        <div style={{ display: "grid", gridTemplateColumns: d.left ? "1fr 1.2fr" : "1.2fr 1fr", gap: 20, alignItems: "center" }}>
          {hasImg(d.img) ? <img src={imgUrl(d.img)} alt={d.alt || ""} style={{ width: "100%", borderRadius: 12, objectFit: "cover" }} /> : <div style={{ aspectRatio: "4/3", background: "#eee", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: muted }}>No image</div>}
          <RichHtml html={d.text} style={{ fontSize: 16, lineHeight: 1.7, color: ink }} />
        </div>
      );
    case "cards3":
      return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(d.items?.length || 1, 3)}, 1fr)`, gap: 12 }}>
          {d.items?.map((it: any, i: number) => {
            const c = it.color === "rose" ? rose : sage;
            return (
              <div key={i} style={{ textAlign: "center", padding: 16, border: `1px solid ${c}22`, borderRadius: 10 }}>
                <RichHtml html={it.val} style={{ fontFamily: "Georgia,serif", fontSize: 28, color: c }} />
                <RichHtml html={it.lbl} style={{ fontSize: 12, color: muted, marginTop: 4 }} />
              </div>
            );
          })}
        </div>
      );
    case "imagecards":
      return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(d.items?.length || 1, 2)}, 1fr)`, gap: 16 }}>
          {d.items?.map((it: any, i: number) => (
            <div key={i} style={{ border: "1px solid #E2E8DE", borderRadius: 10, overflow: "hidden" }}>
              {hasImg(it.img) ? <img src={imgUrl(it.img)} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} /> : <div style={{ aspectRatio: "4/3", background: "#eee" }} />}
              <div style={{ padding: 14 }}>
                <RichHtml html={it.heading} style={{ fontFamily: "Georgia,serif", fontSize: 18, color: ink, marginBottom: 6 }} />
                <RichHtml html={it.text} style={{ fontSize: 14, color: muted }} />
              </div>
            </div>
          ))}
        </div>
      );
    case "darkbox": {
      const boxBg = d.bgColor || ink;
      const textClr = isLightBg(boxBg) ? ink : "#fff";
      const dotClr = isLightBg(boxBg) ? sage : sageLight;
      return (
        <div style={{ background: boxBg, color: textClr, padding: 20, borderRadius: 10 }}>
          <RichHtml html={d.heading} style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }} />
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {d.bullets?.map((b: any, i: number) => (
              <li key={i} style={{ display: "flex", alignItems: "start", gap: 8, marginBottom: 6, fontSize: 14 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotClr, marginTop: 6, flexShrink: 0 }} />
                <RichHtml html={b.text} />
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case "steps":
      return (
        <div>
          {d.heading && <RichHtml html={d.heading} style={{ fontFamily: "Georgia,serif", fontSize: 22, color: ink, marginBottom: 14 }} />}
          {d.items?.map((it: any, i: number) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: i % 2 === 0 ? sage : rose, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: 18, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <RichHtml html={it.title} style={{ fontSize: 16, fontWeight: 600, color: ink, marginBottom: 4 }} />
                <RichHtml html={it.text} style={{ fontSize: 14, color: muted }} />
              </div>
            </div>
          ))}
        </div>
      );
    case "conclusion":
      return (
        <div>
          {d.heading && <RichHtml html={d.heading} style={{ fontFamily: "Georgia,serif", fontSize: 24, color: ink, marginBottom: 12 }} />}
          <RichHtml html={d.text} style={{ fontSize: 16, lineHeight: 1.7, color: ink }} />
        </div>
      );
    default:
      return null;
  }
}

const BlogPost = () => {
  const { id: slug } = useParams();
  const [post, setPost] = useState<PublicBlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    blogPublicApi
      .getBySlug(slug)
      .then(setPost)
      .catch((err) => setError(err?.message || "Blog post not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <p className="text-muted-foreground text-lg">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <p className="text-destructive text-lg">{error || "Blog post not found"}</p>
          <Link to="/blog" className="text-sage font-medium hover:underline">Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {post.coverUrl ? (
            <img src={imgUrl(post.coverUrl)} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${sage} 0%, #4a5a40 100%)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative z-10 pb-16 md:pb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm tracking-wide">Back to Blog</span>
            </Link>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 bg-sage text-white text-xs font-sans tracking-wide uppercase rounded-full">{post.category}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight max-w-4xl mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" strokeWidth={1.5} />{dateStr}</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" strokeWidth={1.5} />{post.readTime}</div>
              <div className="flex items-center gap-2"><User className="w-4 h-4" strokeWidth={1.5} />{post.author}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Author & Share */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-sage/20 flex items-center justify-center text-sage font-serif text-xl">
                {post.author?.[0] || "A"}
              </div>
              <div>
                <p className="font-serif text-lg text-foreground">{post.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground mr-2">Share:</span>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-sage/10 transition-colors"><Facebook className="w-4 h-4" /></button>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-sage/10 transition-colors"><Twitter className="w-4 h-4" /></button>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-sage/10 transition-colors"><Linkedin className="w-4 h-4" /></button>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-sage/10 transition-colors"><Share2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {post.sections?.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginBottom: 32 }}
              >
                <SectionRenderer section={section} />
              </motion.div>
            ))}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">Ready to Transform Your Style?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Our expert designers are here to help bring your vision to life.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/appointment" className="px-8 py-3 rounded-xl bg-sage text-white font-medium hover:bg-sage/90 transition-colors">Book Appointment</Link>
            <Link to="/contact" className="px-8 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition-colors">Contact Us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
