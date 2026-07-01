// @ts-nocheck
import { useState, useRef, createElement, useEffect } from "react";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import RichTextField from "../../components/admin/RichTextField";
import { cssSizeToPx, normalizeIconId, renderIconById } from "../../components/admin/iconHub";
import { blogAdminApi } from "../../api/blogApi";

const border = "#E2E8DE";
const ink = "#2C2C2C";
const muted = "#7A7A7A";
const white = "#FFFFFF";
const bg = "#F7F6F3";
const sage = "#6B7F5E";
const sageLight = "#EEF3EB";
const rose = "#B5505A";

/* ─── Utilities ─── */

const IMG_BASE = import.meta.env.VITE_API_IMG_URL || "";

/** Return true if hex color is light (use dark text for contrast) */
function isLightBg(hex) {
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

/** Resolve image URL: prepend backend base for relative paths */
function imgUrl(src) {
  if (!src || src.length === 0) return "";
  if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("blob:")) return src;
  return IMG_BASE + src;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE_MB = 5;
const uid = () => Math.random().toString(36).slice(2, 9);
const clone = (v) => JSON.parse(JSON.stringify(v));

/** Wrap plain text in <p> tags if it doesn't look like HTML already */
function ensureHtml(val) {
  if (typeof val !== "string" || !val.trim()) return val;
  if (val.trim().startsWith("<")) return val;
  return `<p>${val}</p>`;
}

/** Auto-migrate all string values in section data to HTML */
function migrateSectionData(data) {
  if (!data || typeof data !== "object") return data;
  const out = { ...data };
  for (const key of Object.keys(out)) {
    if (typeof out[key] === "string" && !["img", "alt", "color", "bgColor"].includes(key)) {
      out[key] = ensureHtml(out[key]);
    }
    if (Array.isArray(out[key])) {
      out[key] = out[key].map((item) => {
        if (!item || typeof item !== "object") return item;
        const it = { ...item };
        for (const k of Object.keys(it)) {
          if (typeof it[k] === "string" && !["img", "alt", "color", "bgColor"].includes(k)) {
            it[k] = ensureHtml(it[k]);
          }
        }
        return it;
      });
    }
  }
  return out;
}

/** Sanitize HTML for dangerouslySetInnerHTML, allowing data-icon attr */
function sanitize(html) {
  return DOMPurify.sanitize(html || "", {
    ADD_ATTR: ["data-icon", "data-icon-size", "data-icon-color", "contenteditable", "style"],
    ADD_TAGS: ["span"],
  });
}

/** Resolve data-icon spans to actual Lucide SVGs after mount */
function RichHtmlWithIcons({ html, style, className }) {
  const ref = useRef(null);
  const processIcons = () => {
    if (!ref.current) return;
    ref.current.querySelectorAll("[data-icon]").forEach((el) => {
      const raw = el.getAttribute("data-icon");
      const iconId = normalizeIconId(raw);
      if (iconId && !el.dataset.resolved) {
        el.dataset.resolved = "1";
        const size = el.getAttribute("data-icon-size") || "1em";
        const color = el.getAttribute("data-icon-color") || "#6B7F5E";
        const sizePx = cssSizeToPx(size, 16);
        el.innerHTML = "";
        el.style.display = "inline-flex";
        el.style.verticalAlign = "middle";
        el.style.width = size;
        el.style.height = size;
        el.style.color = color;
        el.style.background = "none";
        el.style.border = "none";
        el.style.padding = "0";
        el.style.margin = "0 1px";
        const svgWrap = document.createElement("span");
        svgWrap.style.display = "inline-flex";
        svgWrap.style.alignItems = "center";
        svgWrap.style.justifyContent = "center";
        svgWrap.style.width = "100%";
        svgWrap.style.height = "100%";
        el.appendChild(svgWrap);
        import("react-dom/client").then(({ createRoot }) => {
          const node = renderIconById(iconId, { sizePx, color: "currentColor" }) || createElement("span", null, "⬡");
          createRoot(svgWrap).render(node);
        });
      }
    });
  };
  return (
    <div
      ref={(node) => { ref.current = node; setTimeout(processIcons, 0); }}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitize(html || "") }}
    />
  );
}

/* ─── Constants ─── */

const TYPES = [
  { id: "intro", icon: "P", name: "Introduction" },
  { id: "heading", icon: "H", name: "Section Heading" },
  { id: "quote", icon: "Q", name: "Pull Quote" },
  { id: "takeaways", icon: "TK", name: "Key Takeaways" },
  { id: "stats", icon: "#", name: "Statistics" },
  { id: "imagetext", icon: "IT", name: "Image + Text" },
  { id: "cards3", icon: "C3", name: "3 Feature Cards" },
  { id: "imagecards", icon: "IC", name: "Image Cards" },
  { id: "darkbox", icon: "DB", name: "Dark Callout" },
  { id: "steps", icon: "1.", name: "Numbered Steps" },
  { id: "conclusion", icon: "CO", name: "Conclusion" },
];

const DEFAULTS = {
  intro: { p1: "<p>Start writing your first paragraph here.</p>", p2: "<p>A second paragraph.</p>" },
  heading: { text: "<p>New Section Heading</p>" },
  quote: { text: "<p>A powerful insight that deserves special attention.</p>", by: "<p>-- Source or Author</p>" },
  takeaways: { heading: "<p>Key Takeaways</p>", items: [{ title: "<p>Point</p>", desc: "<p>Description.</p>" }] },
  stats: { items: [{ val: "<p>100+</p>", lbl: "<p>Metric label</p>" }] },
  imagetext: { img: "", alt: "Image", left: true, text: "<p>Write your body copy here.</p>" },
  cards3: { items: [{ val: "<p>20 t</p>", lbl: "<p>Metric one</p>", color: "sage" }] },
  imagecards: { items: [{ img: "", heading: "<p>Card One</p>", text: "<p>Description.</p>" }] },
  darkbox: { heading: "<p>Important Notes:</p>", bullets: [{ text: "<p>First bullet point</p>" }] },
  steps: { heading: "<p>Step-by-Step Guide</p>", items: [{ title: "<p>Step One</p>", text: "<p>What to do.</p>" }] },
  conclusion: { heading: "<p>Conclusion</p>", text: "<p>Wrap up your article with key insights.</p>" },
};

const baseMeta = {
  title: "New Blog Post",
  category: "Fashion Tips",
  excerpt: "A short description of your blog post...",
  cover: "",
  author: "Babita Dahal",
  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  readTime: "5 min read",
};

const inputStyle = { width: "100%", border: `1px solid ${border}`, borderRadius: 8, padding: 8, fontSize: 14, outline: "none", boxSizing: "border-box" };
const labelStyle = { display: "block", fontSize: 11, color: muted, marginBottom: 4, marginTop: 10 };
const btnSmall = { border: `1px solid ${border}`, background: bg, color: ink, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11 };
const btnSage = { border: "none", background: sage, color: white, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 };
const btnDanger = { border: "none", background: rose, color: white, borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11 };

const SECTION_BG_SWATCHES = [
  "#3D5A36",
  "#4F6B3F",
  "#6B7F5E",
  "#1F3A4D",
  "#25304F",
  "#4A1F2F",
  "#7A2E3A",
  "#2C2C2C",
  "#FFFFFF",
  "#F7F6F3",
];

function SectionBackgroundControls({ value, onChange }) {
  const current = (value || "").toUpperCase();
  return (
    <div style={{ marginBottom: 10, padding: 10, borderRadius: 8, background: "#F5F7F2", border: `1px solid ${border}` }}>
      <p style={{ margin: 0, fontSize: 11, color: muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>
        Background colour
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6, alignItems: "center" }}>
        {SECTION_BG_SWATCHES.map((clr) => (
          <button
            key={clr}
            type="button"
            onClick={() => onChange(clr)}
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              border: current === clr.toUpperCase() ? `2px solid ${ink}` : "1px solid #D3D9CF",
              padding: 0,
              background: clr,
              cursor: "pointer",
            }}
          />
        ))}
        <span style={{ fontSize: 11, color: muted, marginLeft: 4 }}>Custom:</span>
        <input
          type="color"
          value={current || "#3D5A36"}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 26, height: 20, borderRadius: 4, border: `1px solid ${border}`, padding: 0, cursor: "pointer" }}
        />
        {current && (
          <button
            type="button"
            onClick={() => onChange("")}
            style={{ ...btnSmall, fontSize: 10 }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── ImageUpload (uploads to backend, returns URL) ─── */
function ImageUpload({ value, onChange, label = "Image" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) { toast.error("Choose JPEG, PNG, WebP or GIF."); return; }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) { toast.error(`Max ${MAX_IMAGE_SIZE_MB} MB.`); return; }
    setUploading(true);
    try {
      const { url } = await blogAdminApi.uploadImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  const hasImg = value && value.length > 0;
  return (
    <div style={{ marginTop: 6 }}>
      {label && <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 600, color: ink }}>{label}</p>}
      <input type="file" ref={inputRef} accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={handleFile} style={{ display: "none" }} />
      {hasImg && <img src={imgUrl(value)} alt="" style={{ maxWidth: "100%", maxHeight: 140, objectFit: "contain", borderRadius: 8, border: `1px solid ${border}`, marginBottom: 6 }} />}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} style={{ ...btnSage, opacity: uploading ? 0.6 : 1 }}>
          {uploading ? "Uploading..." : hasImg ? "Change" : "Upload"}
        </button>
        {hasImg && <button type="button" onClick={() => onChange("")} style={btnDanger}>Remove</button>}
      </div>
    </div>
  );
}

/* ─── OG Preview ─── */
function OGPreview({ meta }) {
  const imgSrc = meta.cover && meta.cover.length > 0 ? meta.cover : "";
  return (
    <div style={{ border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden", background: white, maxWidth: 400, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}>
      <p style={{ margin: 0, padding: "8px 12px", fontSize: 10, color: muted, background: bg, borderBottom: `1px solid ${border}` }}>
        Social share preview (og:image, og:title, og:description)
      </p>
      {imgSrc ? (
        <div style={{ aspectRatio: "1.91/1", background: "#f0f0f0" }}>
          <img src={imgUrl(imgSrc)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ) : (
        <div style={{ aspectRatio: "1.91/1", background: "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", color: muted, fontSize: 12 }}>No cover image</div>
      )}
      <div style={{ padding: 12 }}>
        <p style={{ margin: 0, fontSize: 11, color: muted, textTransform: "uppercase" }}>{meta.category || "Category"}</p>
        <p style={{ margin: "4px 0 0", fontWeight: 700, color: ink, fontSize: 16, lineHeight: 1.25 }}>{meta.title || "Post title"}</p>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: muted, lineHeight: 1.4 }}>{meta.excerpt || "Short description"}</p>
      </div>
    </div>
  );
}

/* ─── AddModal ─── */
function AddModal({ onClose, onAdd }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ width: 520, maxHeight: "80vh", overflow: "auto", background: white, borderRadius: 12, padding: 14 }} onClick={(e) => e.stopPropagation()}>
        <p style={{ margin: 0, fontFamily: "Georgia,serif", fontSize: 20, color: ink }}>Add a Section</p>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {TYPES.map((t) => (
            <button key={t.id} onClick={() => onAdd(t.id)} style={{ textAlign: "left", border: `1px solid ${border}`, background: bg, borderRadius: 9, padding: "10px 12px", cursor: "pointer" }}>
              <p style={{ margin: 0, color: ink, fontWeight: 700, fontSize: 12 }}>{t.name}</p>
              <p style={{ margin: "2px 0 0", color: muted, fontSize: 11 }}>{t.id}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toggle({ value, onChange, opts }) {
  return (
    <div style={{ display: "flex", gap: 0 }}>
      {opts.map((o, i) => (
        <button
          key={o.v}
          type="button"
          onClick={e => { e.stopPropagation(); onChange(o.v); }}
          style={{
            flex: 1,
            padding: "8px 14px",
            fontSize: 12,
            fontFamily: "inherit",
            cursor: "pointer",
            background: value === o.v ? sageLight : white,
            color: value === o.v ? sage : muted,
            border: `1.5px solid ${value === o.v ? sage : border}`,
            borderRadius: i === 0 ? "7px 0 0 7px" : "0 7px 7px 0",
            fontWeight: value === o.v ? 700 : 400,
            transition: "all .15s",
          }}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

/* ─── SectionEditor: visual rich-text form per type ─── */
function SectionEditor({ section, onChange }) {
  const d = section.data;
  const set = (patch) => onChange({ ...d, ...patch });
  const setItem = (arr, idx, patch) => arr.map((it, j) => (j === idx ? { ...it, ...patch } : it));
  const addItem = (arr, template) => [...arr, template];
  const removeItem = (arr, idx) => arr.filter((_, j) => j !== idx);

  const bg = d.bgColor || "";
  const bgControls = (
    <SectionBackgroundControls
      value={bg}
      onChange={(val) => set({ bgColor: val })}
    />
  );

  switch (section.type) {
    case "intro":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bgControls}
          <div><p style={{ margin: "0 0 4px", fontSize: 11, color: muted }}>Paragraph 1</p><RichTextField value={d.p1} onChange={(v) => set({ p1: v })} minHeight={60} /></div>
          <div><p style={{ margin: "0 0 4px", fontSize: 11, color: muted }}>Paragraph 2 (optional)</p><RichTextField value={d.p2 || ""} onChange={(v) => set({ p2: v })} minHeight={40} /></div>
        </div>
      );
    case "heading":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bgControls}
          <RichTextField value={d.text} onChange={(v) => set({ text: v })} minHeight={40} placeholder="Section heading..." />
        </div>
      );
    case "quote":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bgControls}
          <div><p style={{ margin: "0 0 4px", fontSize: 11, color: muted }}>Quote</p><RichTextField value={d.text} onChange={(v) => set({ text: v })} minHeight={50} /></div>
          <div><p style={{ margin: "0 0 4px", fontSize: 11, color: muted }}>Attribution</p><RichTextField value={d.by || ""} onChange={(v) => set({ by: v })} minHeight={30} /></div>
        </div>
      );
    case "takeaways":
      return (
        <div>
          {bgControls}
          <p style={{ margin: "0 0 4px", fontSize: 11, color: muted }}>Heading</p>
          <RichTextField value={d.heading} onChange={(v) => set({ heading: v })} minHeight={30} />
          {d.items.map((it, idx) => (
            <div key={idx} style={{ border: `1px solid ${border}`, borderRadius: 8, padding: 10, marginTop: 8, background: bg }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: muted }}>Point #{idx + 1}</span>
                <button onClick={() => set({ items: removeItem(d.items, idx) })} style={btnDanger}>x</button>
              </div>
              <RichTextField value={it.title} onChange={(v) => set({ items: setItem(d.items, idx, { title: v }) })} minHeight={30} placeholder="Title" />
              <div style={{ height: 6 }} />
              <RichTextField value={it.desc} onChange={(v) => set({ items: setItem(d.items, idx, { desc: v }) })} minHeight={30} placeholder="Description" />
            </div>
          ))}
          <button onClick={() => set({ items: addItem(d.items, { title: "", desc: "" }) })} style={{ ...btnSmall, marginTop: 8 }}>+ Add point</button>
        </div>
      );
    case "stats":
      return (
        <div>
          {bgControls}
          {d.items.map((it, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "start" }}>
              <div style={{ flex: "0 0 120px" }}><RichTextField value={it.val} onChange={(v) => set({ items: setItem(d.items, idx, { val: v }) })} minHeight={30} placeholder="Value" /></div>
              <div style={{ flex: 1 }}><RichTextField value={it.lbl} onChange={(v) => set({ items: setItem(d.items, idx, { lbl: v }) })} minHeight={30} placeholder="Label" /></div>
              <button onClick={() => set({ items: removeItem(d.items, idx) })} style={{ ...btnDanger, marginTop: 4 }}>x</button>
            </div>
          ))}
          <button onClick={() => set({ items: addItem(d.items, { val: "", lbl: "" }) })} style={btnSmall}>+ Add stat</button>
        </div>
      );
    case "imagetext":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bgControls}
          <ImageUpload value={d.img} onChange={(url) => set({ img: url })} label="Section image" />
          <input value={d.alt || ""} onChange={(e) => set({ alt: e.target.value })} placeholder="Alt text" style={inputStyle} />
          <RichTextField value={d.text} onChange={(v) => set({ text: v })} minHeight={60} />
          
          <div style={{ marginTop: 4 }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: 0.4 }}>IMAGE POSITION</p>
            <Toggle
              value={d.left ? "left" : "right"}
              onChange={(v) => set({ left: v === "left" })}
              opts={[
                { v: "left",  l: "Image on Left"  },
                { v: "right", l: "Image on Right" },
              ]}
            />
          </div>
        </div>
      );
    case "cards3":
      return (
        <div>
          {bgControls}
          {d.items.map((it, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "start" }}>
              <div style={{ flex: "0 0 100px" }}><RichTextField value={it.val} onChange={(v) => set({ items: setItem(d.items, idx, { val: v }) })} minHeight={30} placeholder="Value" /></div>
              <div style={{ flex: 1 }}><RichTextField value={it.lbl} onChange={(v) => set({ items: setItem(d.items, idx, { lbl: v }) })} minHeight={30} placeholder="Label" /></div>
              <select value={it.color || "sage"} onChange={(e) => set({ items: setItem(d.items, idx, { color: e.target.value }) })} style={{ ...inputStyle, width: 72, flex: "0 0 auto", marginTop: 4 }}>
                <option value="sage">Sage</option><option value="rose">Rose</option>
              </select>
              <button onClick={() => set({ items: removeItem(d.items, idx) })} style={{ ...btnDanger, marginTop: 4 }}>x</button>
            </div>
          ))}
          <button onClick={() => set({ items: addItem(d.items, { val: "", lbl: "", color: "sage" }) })} style={btnSmall}>+ Add card</button>
        </div>
      );
    case "imagecards":
      return (
        <div>
          {bgControls}
          {d.items.map((it, idx) => (
            <div key={idx} style={{ border: `1px solid ${border}`, borderRadius: 8, padding: 10, marginBottom: 8, background: bg }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 11, color: muted }}>Card #{idx + 1}</span><button onClick={() => set({ items: removeItem(d.items, idx) })} style={btnDanger}>x</button></div>
              <ImageUpload value={it.img} onChange={(url) => set({ items: setItem(d.items, idx, { img: url }) })} label="" />
              <div style={{ marginTop: 6 }}><RichTextField value={it.heading} onChange={(v) => set({ items: setItem(d.items, idx, { heading: v }) })} minHeight={30} placeholder="Heading" /></div>
              <div style={{ marginTop: 4 }}><RichTextField value={it.text} onChange={(v) => set({ items: setItem(d.items, idx, { text: v }) })} minHeight={30} placeholder="Description" /></div>
            </div>
          ))}
          <button onClick={() => set({ items: addItem(d.items, { img: "", heading: "", text: "" }) })} style={btnSmall}>+ Add card</button>
        </div>
      );
    case "darkbox":
      return (
        <div>
          {bgControls}
          {/* Live preview bar so user sees the selected background */}
          <div style={{ marginBottom: 10, padding: "8px 12px", borderRadius: 8, background: bg || ink, color: isLightBg(bg || ink) ? ink : white, fontSize: 12, fontWeight: 600 }}>
            Preview: {(typeof d.heading === "string" ? d.heading.replace(/<[^>]*>/g, "").trim() : "") || "Important Notes"}
          </div>
          <p style={{ margin: "0 0 4px", fontSize: 11, color: muted }}>Heading</p>
          <RichTextField value={d.heading} onChange={(v) => set({ heading: v })} minHeight={30} />
          {d.bullets.map((b, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "start" }}>
              <div style={{ flex: 1 }}><RichTextField value={b.text} onChange={(v) => set({ bullets: setItem(d.bullets, idx, { text: v }) })} minHeight={30} /></div>
              <button onClick={() => set({ bullets: removeItem(d.bullets, idx) })} style={{ ...btnDanger, marginTop: 4 }}>x</button>
            </div>
          ))}
          <button onClick={() => set({ bullets: addItem(d.bullets, { text: "" }) })} style={{ ...btnSmall, marginTop: 6 }}>+ Add bullet</button>
        </div>
      );
    case "steps":
      return (
        <div>
          {bgControls}
          <p style={{ margin: "0 0 4px", fontSize: 11, color: muted }}>Heading</p>
          <RichTextField value={d.heading} onChange={(v) => set({ heading: v })} minHeight={30} />
          {d.items.map((it, idx) => (
            <div key={idx} style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "start" }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: idx % 2 === 0 ? sage : rose, color: white, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 4 }}>{idx + 1}</span>
              <div style={{ flex: 1 }}>
                <RichTextField value={it.title} onChange={(v) => set({ items: setItem(d.items, idx, { title: v }) })} minHeight={30} placeholder="Step title" />
                <div style={{ height: 4 }} />
                <RichTextField value={it.text} onChange={(v) => set({ items: setItem(d.items, idx, { text: v }) })} minHeight={30} placeholder="Details" />
              </div>
              <button onClick={() => set({ items: removeItem(d.items, idx) })} style={{ ...btnDanger, marginTop: 4 }}>x</button>
            </div>
          ))}
          <button onClick={() => set({ items: addItem(d.items, { title: "", text: "" }) })} style={{ ...btnSmall, marginTop: 8 }}>+ Add step</button>
        </div>
      );
    case "conclusion":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bgControls}
          <div><p style={{ margin: "0 0 4px", fontSize: 11, color: muted }}>Heading</p><RichTextField value={d.heading} onChange={(v) => set({ heading: v })} minHeight={30} /></div>
          <div><p style={{ margin: "0 0 4px", fontSize: 11, color: muted }}>Body</p><RichTextField value={d.text} onChange={(v) => set({ text: v })} minHeight={80} /></div>
        </div>
      );
    default:
      return <pre style={{ whiteSpace: "pre-wrap", fontFamily: "Consolas, monospace", fontSize: 12, color: ink }}>{JSON.stringify(d, null, 2)}</pre>;
  }
}

/* ─── SectionPreview: rendered visual for preview page ─── */
function SectionPreview({ section }) {
  const d = section.data;
  const hasImg = (src) => src && src.length > 0;
  const bg = d.bgColor || "";

  switch (section.type) {
    case "intro":
      return (
        <div style={{ fontSize: 18, lineHeight: 1.7, color: ink, background: bg || "transparent", borderRadius: bg ? 12 : 0, padding: bg ? 18 : 0 }}>
          <RichHtmlWithIcons html={d.p1} style={{ marginBottom: 12 }} />
          {d.p2 && <RichHtmlWithIcons html={d.p2} />}
        </div>
      );
    case "heading":
      return (
        <div style={{ background: bg || "transparent", borderRadius: bg ? 12 : 0, padding: bg ? 12 : 0 }}>
          <RichHtmlWithIcons html={d.text} style={{ fontFamily: "Georgia,serif", fontSize: 28, color: ink }} />
        </div>
      );
    case "quote":
      return (
        <blockquote style={{ borderLeft: `4px solid ${sage}`, margin: 0, padding: "12px 20px", background: bg || sageLight, fontStyle: "italic", color: ink, borderRadius: 10 }}>
          <RichHtmlWithIcons html={d.text} />
          {d.by && <RichHtmlWithIcons html={d.by} style={{ marginTop: 8, fontSize: 14, color: muted }} />}
        </blockquote>
      );
    case "takeaways":
      return (
        <div style={{ background: bg || sageLight, border: `1px solid ${sage}33`, borderRadius: 12, padding: 20 }}>
          <RichHtmlWithIcons html={d.heading} style={{ fontFamily: "Georgia,serif", fontSize: 22, color: ink, marginBottom: 12 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {d.items.map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 28, height: 28, background: `${sage}33`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: sage, flexShrink: 0 }}>{i + 1}</div>
                <div><RichHtmlWithIcons html={it.title} style={{ fontWeight: 600, color: ink }} /><RichHtmlWithIcons html={it.desc} style={{ fontSize: 13, color: muted, marginTop: 2 }} /></div>
              </div>
            ))}
          </div>
        </div>
      );
    case "stats":
      return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(d.items.length, 4)}, 1fr)`, gap: 12, background: bg || "transparent", borderRadius: bg ? 12 : 0, padding: bg ? 16 : 0 }}>
          {d.items.map((it, i) => (
            <div key={i} style={{ textAlign: "center", padding: 16, background: `${rose}11`, borderRadius: 10, border: `1px solid ${rose}22` }}>
              <RichHtmlWithIcons html={it.val} style={{ fontFamily: "Georgia,serif", fontSize: 32, color: rose }} />
              <RichHtmlWithIcons html={it.lbl} style={{ fontSize: 12, color: muted, marginTop: 4 }} />
            </div>
          ))}
        </div>
      );
    case "imagetext":
      const imgElement = hasImg(d.img) ? <img src={imgUrl(d.img)} alt={d.alt || ""} style={{ width: "100%", borderRadius: 12, objectFit: "cover" }} /> : <div style={{ aspectRatio: "4/3", background: "#eee", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: muted }}>No image</div>;
      const textElement = <RichHtmlWithIcons html={d.text} style={{ fontSize: 16, lineHeight: 1.7, color: ink }} />;
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, alignItems: "center", background: bg || "transparent", borderRadius: bg ? 12 : 0, padding: bg ? 18 : 0 }}>
          {d.left ? imgElement : textElement}
          {d.left ? textElement : imgElement}
        </div>
      );
    case "cards3":
      return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(d.items.length, 3)}, 1fr)`, gap: 12, background: bg || "transparent", borderRadius: bg ? 12 : 0, padding: bg ? 16 : 0 }}>
          {d.items.map((it, i) => {
            const c = it.color === "rose" ? rose : sage;
            return (
              <div key={i} style={{ textAlign: "center", padding: 16, border: `1px solid ${c}22`, borderRadius: 10 }}>
                <RichHtmlWithIcons html={it.val} style={{ fontFamily: "Georgia,serif", fontSize: 28, color: c }} />
                <RichHtmlWithIcons html={it.lbl} style={{ fontSize: 12, color: muted, marginTop: 4 }} />
              </div>
            );
          })}
        </div>
      );
    case "imagecards":
      return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(d.items.length, 2)}, 1fr)`, gap: 16, background: bg || "transparent", borderRadius: bg ? 12 : 0, padding: bg ? 16 : 0 }}>
          {d.items.map((it, i) => (
            <div key={i} style={{ border: `1px solid ${border}`, borderRadius: 10, overflow: "hidden" }}>
              {hasImg(it.img) ? <img src={imgUrl(it.img)} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} /> : <div style={{ aspectRatio: "4/3", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: muted }}>No image</div>}
              <div style={{ padding: 14 }}>
                <RichHtmlWithIcons html={it.heading} style={{ fontFamily: "Georgia,serif", fontSize: 18, color: ink, marginBottom: 6 }} />
                <RichHtmlWithIcons html={it.text} style={{ fontSize: 14, color: muted }} />
              </div>
            </div>
          ))}
        </div>
      );
    case "darkbox": {
      const boxBg = bg || ink;
      const textClr = isLightBg(boxBg) ? ink : white;
      const dotClr = isLightBg(boxBg) ? sage : sageLight;
      return (
        <div style={{ background: boxBg, color: textClr, padding: 20, borderRadius: 10 }}>
          <RichHtmlWithIcons html={d.heading} style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }} />
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {d.bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", alignItems: "start", gap: 8, marginBottom: 6, fontSize: 14 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotClr, marginTop: 6, flexShrink: 0 }} />
                <RichHtmlWithIcons html={b.text} />
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case "steps":
      return (
        <div style={{ background: bg || "transparent", borderRadius: bg ? 12 : 0, padding: bg ? 16 : 0 }}>
          {d.heading && <RichHtmlWithIcons html={d.heading} style={{ fontFamily: "Georgia,serif", fontSize: 22, color: ink, marginBottom: 14 }} />}
          {d.items.map((it, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: i % 2 === 0 ? sage : rose, color: white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: 18, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <RichHtmlWithIcons html={it.title} style={{ fontSize: 16, fontWeight: 600, color: ink, marginBottom: 4 }} />
                <RichHtmlWithIcons html={it.text} style={{ fontSize: 14, color: muted }} />
              </div>
            </div>
          ))}
        </div>
      );
    case "conclusion":
      return (
        <div style={{ background: bg || "transparent", borderRadius: bg ? 12 : 0, padding: bg ? 16 : 0 }}>
          {d.heading && <RichHtmlWithIcons html={d.heading} style={{ fontFamily: "Georgia,serif", fontSize: 24, color: ink, marginBottom: 12 }} />}
          <RichHtmlWithIcons html={d.text} style={{ fontSize: 16, lineHeight: 1.7, color: ink }} />
        </div>
      );
    default:
      return <pre style={{ whiteSpace: "pre-wrap", fontFamily: "Consolas,monospace", fontSize: 12, color: ink, margin: 0 }}>{JSON.stringify(d, null, 2)}</pre>;
  }
}

/* ─── EditablePreviewBlock: click-to-edit in preview mode ─── */
function EditablePreviewBlock({ html, onChange, style }) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <div style={{ position: "relative" }}>
        <RichTextField value={html} onChange={onChange} minHeight={40} />
        <button
          onClick={() => setEditing(false)}
          style={{ position: "absolute", top: -8, right: -8, ...btnSage, padding: "3px 8px", fontSize: 10, borderRadius: 20, zIndex: 10 }}
        >
          Done
        </button>
      </div>
    );
  }
  return (
    <div
      onClick={() => setEditing(true)}
      style={{ ...style, cursor: "pointer", borderRadius: 6, transition: "outline .15s", outline: "2px solid transparent" }}
      onMouseEnter={(e) => { e.currentTarget.style.outline = `2px solid ${sage}44`; }}
      onMouseLeave={(e) => { e.currentTarget.style.outline = "2px solid transparent"; }}
      title="Click to edit"
    >
      <RichHtmlWithIcons html={html} />
    </div>
  );
}

/* ═════════════ Main Component ═════════════ */

/** Convert API response to internal editor format */
function apiToEditor(blog) {
  return {
    id: blog.id,
    slug: blog.slug,
    status: blog.status?.toLowerCase() || "draft",
    meta: {
      title: blog.title || "",
      category: blog.category || "",
      excerpt: blog.excerpt || "",
      cover: blog.coverUrl || "",
      author: blog.author || "",
      date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "",
      readTime: blog.readTime || "",
    },
    sections: (blog.sections || []).map((s) => ({ ...s, data: migrateSectionData(s.data) })),
    sectionsCount: blog.sectionsCount,
  };
}

/** Convert internal editor format to API request */
function editorToApi(blog) {
  return {
    title: blog.meta.title,
    category: blog.meta.category,
    excerpt: blog.meta.excerpt,
    coverUrl: blog.meta.cover,
    author: blog.meta.author,
    readTime: blog.meta.readTime,
    status: blog.status === "published" ? "PUBLISHED" : "DRAFT",
    sections: blog.sections,
  };
}

export default function AdminBlogCreate() {
  const [view, setView] = useState("dashboard");
  const [blogs, setBlogs] = useState([]);
  const [current, setCurrent] = useState(null);
  const [openIdx, setOpenIdx] = useState(null);
  const [insertAt, setInsertAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load blogs from API on mount
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogAdminApi.list();
      setBlogs(data.map(apiToEditor));
    } catch (err) {
      toast.error(err?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const persist = (blog) => {
    setCurrent(blog);
    setBlogs((prev) => prev.map((b) => (b.id === blog.id ? blog : b)));
  };

  const updateSectionData = (sectionIdx, data) => {
    const next = current.sections.map((s, idx) => (idx === sectionIdx ? { ...s, data } : s));
    persist({ ...current, sections: next });
  };

  const moveSection = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= current.sections.length) return;
    const arr = [...current.sections];
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    persist({ ...current, sections: arr });
    setOpenIdx(target);
  };

  const deleteSection = (idx) => {
    persist({ ...current, sections: current.sections.filter((_, i) => i !== idx) });
    setOpenIdx(null);
  };

  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await blogAdminApi.delete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("Blog deleted");
    } catch (err) {
      toast.error(err?.message || "Failed to delete blog");
    }
  };

  const createBlog = () => {
    const blog = {
      id: null,
      slug: null,
      status: "draft",
      meta: { ...baseMeta, date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
      sections: [{ id: uid(), type: "intro", data: clone(DEFAULTS.intro) }],
    };
    setCurrent(blog);
    setOpenIdx(0);
    setView("editor");
  };

  const saveBlog = async (statusOverride) => {
    if (!current) return;
    const blogToSave = statusOverride ? { ...current, status: statusOverride } : current;
    setSaving(true);
    try {
      const payload = editorToApi(blogToSave);
      let saved;
      if (current.id) {
        saved = await blogAdminApi.update(current.id, payload);
      } else {
        saved = await blogAdminApi.create(payload);
      }
      const editorFormat = apiToEditor(saved);
      setCurrent(editorFormat);
      setBlogs((prev) => {
        const exists = prev.find((b) => b.id === editorFormat.id);
        if (exists) return prev.map((b) => (b.id === editorFormat.id ? editorFormat : b));
        return [...prev, editorFormat];
      });
      toast.success(statusOverride === "published" ? "Published!" : "Saved as draft");
    } catch (err) {
      toast.error(err?.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const openEditor = async (blog) => {
    if (blog.id && !blog.sections?.length) {
      setLoading(true);
      try {
        const full = await blogAdminApi.getById(blog.id);
        setCurrent(apiToEditor(full));
      } catch (err) {
        toast.error(err?.message || "Failed to load blog");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    } else {
      setCurrent({
        ...blog,
        sections: (blog.sections || []).map((s) => ({ ...s, data: migrateSectionData(s.data) })),
      });
    }
    setOpenIdx(null);
    setView("editor");
  };

  const openPreview = async (blog) => {
    if (blog.id && !blog.sections?.length) {
      setLoading(true);
      try {
        const full = await blogAdminApi.getById(blog.id);
        setCurrent(apiToEditor(full));
      } catch (err) {
        toast.error(err?.message || "Failed to load blog");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    } else {
      setCurrent({
        ...blog,
        sections: (blog.sections || []).map((s) => ({ ...s, data: migrateSectionData(s.data) })),
      });
    }
    setView("preview");
  };

  /* ─── Dashboard ─── */
  if (view === "dashboard") {
    return (
      <div style={{ fontFamily: "'Trebuchet MS','Lucida Grande',sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "Georgia,serif", fontSize: 24, color: ink }}>Blog Management</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: muted }}>{blogs.length} post{blogs.length !== 1 ? "s" : ""}</p>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={createBlog} style={{ ...btnSage, padding: "10px 18px", fontSize: 14 }}>+ New Blog Post</button>
        </div>
        {loading && <p style={{ textAlign: "center", padding: 40, color: muted }}>Loading blogs...</p>}
        {!loading && blogs.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: muted }}>
            <p style={{ fontSize: 16 }}>No blog posts yet.</p>
            <button onClick={createBlog} style={{ ...btnSage, marginTop: 12 }}>Create your first post</button>
          </div>
        )}
        <div style={{ display: "grid", gap: 10 }}>
          {blogs.map((b) => {
            const hasImg = b.meta?.cover && b.meta.cover.length > 0;
            const sCount = b.sectionsCount ?? b.sections?.length ?? 0;
            return (
              <div key={b.id || b.slug} style={{ background: white, border: `1px solid ${border}`, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                {hasImg ? <img src={imgUrl(b.meta.cover)} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }} /> : <div style={{ width: 72, height: 72, borderRadius: 8, background: sageLight, display: "flex", alignItems: "center", justifyContent: "center", color: sage, fontSize: 11 }}>No img</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: sage, background: sageLight, padding: "2px 8px", borderRadius: 20 }}>{b.meta?.category}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: b.status === "published" ? "#2E7D32" : "#E65100", background: b.status === "published" ? "#E8F5E9" : "#FFF3E0", padding: "2px 8px", borderRadius: 20 }}>{b.status}</span>
                  </div>
                  <p style={{ margin: 0, color: ink, fontFamily: "Georgia,serif", fontSize: 17, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.meta?.title}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: muted }}>{b.meta?.author} · {b.meta?.date} · {sCount} sections</p>
                </div>
                <button onClick={() => openEditor(clone(b))} style={{ ...btnSmall, color: sage, borderColor: `${sage}55` }}>Edit</button>
                <button onClick={() => openPreview(clone(b))} style={btnSmall}>Preview</button>
                <button onClick={() => deleteBlog(b.id)} style={{ ...btnDanger, padding: "5px 10px" }}>Delete</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!current) return null;

  /* ─── Preview (with inline editing) ─── */
  if (view === "preview") {
    const coverSrc = current.meta.cover && current.meta.cover.length > 0 ? current.meta.cover : "";

    const updatePreviewSection = (sectionIdx, dataKey, value) => {
      const sec = current.sections[sectionIdx];
      const newData = { ...sec.data, [dataKey]: value };
      const next = current.sections.map((s, i) => (i === sectionIdx ? { ...s, data: newData } : s));
      persist({ ...current, sections: next });
    };

    const updatePreviewItemField = (sectionIdx, itemsKey, itemIdx, fieldKey, value) => {
      const sec = current.sections[sectionIdx];
      const newItems = sec.data[itemsKey].map((it, j) => (j === itemIdx ? { ...it, [fieldKey]: value } : it));
      const newData = { ...sec.data, [itemsKey]: newItems };
      const next = current.sections.map((s, i) => (i === sectionIdx ? { ...s, data: newData } : s));
      persist({ ...current, sections: next });
    };

    return (
      <div style={{ minHeight: "100vh", background: white, fontFamily: "'Trebuchet MS','Lucida Grande',sans-serif" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 50, padding: "8px 14px", background: "#FFFCE8", borderBottom: "2px solid #F0C030", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, background: "#FDE68A", borderRadius: 20, padding: "3px 8px" }}>Preview + Edit</span>
          <div style={{ flex: 1, color: "#777", fontSize: 12 }}>Click any text to edit it with rich text tools</div>
          <button onClick={() => setView("editor")} style={{ border: "none", background: ink, color: white, borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>Back to editor</button>
        </div>
        <header style={{ position: "relative", minHeight: "50vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
          {coverSrc ? (
            <>
              <img src={imgUrl(coverSrc)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.7), transparent 50%)" }} />
            </>
          ) : (
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${sage} 0%, #4a5a40 100%)` }} />
          )}
          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 900, margin: "0 auto", padding: "24px 20px 32px" }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.9)", background: "rgba(0,0,0,.3)", display: "inline-block", padding: "4px 10px", borderRadius: 20 }}>{current.meta.category}</p>
            <h1 style={{ margin: "12px 0 0", fontFamily: "Georgia,serif", fontWeight: 400, color: white, fontSize: "2.25rem", lineHeight: 1.2 }}>{current.meta.title}</h1>
            <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.85)", fontSize: 14 }}>{current.meta.author} · {current.meta.date} · {current.meta.readTime}</p>
          </div>
        </header>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 60px" }}>
          {current.sections.map((s, si) => (
            <div key={s.id} style={{ marginBottom: 28 }}>
              {/* Render editable blocks for simple text fields, fallback to SectionPreview for complex ones */}
              {s.type === "intro" && (
                <div style={{ fontSize: 18, lineHeight: 1.7, color: ink, background: s.data.bgColor || "transparent", borderRadius: s.data.bgColor ? 12 : 0, padding: s.data.bgColor ? 18 : 0 }}>
                  <EditablePreviewBlock html={s.data.p1} onChange={(v) => updatePreviewSection(si, "p1", v)} />
                  {s.data.p2 && <EditablePreviewBlock html={s.data.p2} onChange={(v) => updatePreviewSection(si, "p2", v)} style={{ marginTop: 12 }} />}
                </div>
              )}
              {s.type === "heading" && (
                <EditablePreviewBlock
                  html={s.data.text}
                  onChange={(v) => updatePreviewSection(si, "text", v)}
                  style={{ fontFamily: "Georgia,serif", fontSize: 28, color: ink, background: s.data.bgColor || "transparent", borderRadius: s.data.bgColor ? 12 : 0, padding: s.data.bgColor ? 12 : 0 }}
                />
              )}
              {s.type === "quote" && (
                <blockquote style={{ borderLeft: `4px solid ${sage}`, margin: 0, padding: "12px 20px", background: s.data.bgColor || sageLight, fontStyle: "italic", color: ink, borderRadius: 10 }}>
                  <EditablePreviewBlock html={s.data.text} onChange={(v) => updatePreviewSection(si, "text", v)} />
                  {s.data.by && <EditablePreviewBlock html={s.data.by} onChange={(v) => updatePreviewSection(si, "by", v)} style={{ marginTop: 8, fontSize: 14, color: muted }} />}
                </blockquote>
              )}
              {s.type === "conclusion" && (
                <div style={{ background: s.data.bgColor || "transparent", borderRadius: s.data.bgColor ? 12 : 0, padding: s.data.bgColor ? 16 : 0 }}>
                  {s.data.heading && <EditablePreviewBlock html={s.data.heading} onChange={(v) => updatePreviewSection(si, "heading", v)} style={{ fontFamily: "Georgia,serif", fontSize: 24, color: ink, marginBottom: 12 }} />}
                  <EditablePreviewBlock html={s.data.text} onChange={(v) => updatePreviewSection(si, "text", v)} style={{ fontSize: 16, lineHeight: 1.7, color: ink }} />
                </div>
              )}
              {s.type === "imagetext" && ((imgBlock) => {
                const txtBlock = <EditablePreviewBlock html={s.data.text} onChange={(v) => updatePreviewSection(si, "text", v)} style={{ fontSize: 16, lineHeight: 1.7, color: ink }} />;
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, alignItems: "center", background: s.data.bgColor || "transparent", borderRadius: s.data.bgColor ? 12 : 0, padding: s.data.bgColor ? 18 : 0 }}>
                    {s.data.left ? imgBlock : txtBlock}
                    {s.data.left ? txtBlock : imgBlock}
                  </div>
                );
              })(s.data.img ? <img src={imgUrl(s.data.img)} alt={s.data.alt || ""} style={{ width: "100%", borderRadius: 12 }} /> : <div style={{ aspectRatio: "4/3", background: "#eee", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: muted }}>No image</div>)}
              {s.type === "steps" && (
                <div style={{ background: s.data.bgColor || "transparent", borderRadius: s.data.bgColor ? 12 : 0, padding: s.data.bgColor ? 16 : 0 }}>
                  {s.data.heading && <EditablePreviewBlock html={s.data.heading} onChange={(v) => updatePreviewSection(si, "heading", v)} style={{ fontFamily: "Georgia,serif", fontSize: 22, color: ink, marginBottom: 14 }} />}
                  {s.data.items.map((it, ii) => (
                    <div key={ii} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: ii % 2 === 0 ? sage : rose, color: white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: 18, flexShrink: 0 }}>{ii + 1}</div>
                      <div style={{ flex: 1 }}>
                        <EditablePreviewBlock html={it.title} onChange={(v) => updatePreviewItemField(si, "items", ii, "title", v)} style={{ fontSize: 16, fontWeight: 600, color: ink, marginBottom: 4 }} />
                        <EditablePreviewBlock html={it.text} onChange={(v) => updatePreviewItemField(si, "items", ii, "text", v)} style={{ fontSize: 14, color: muted }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {s.type === "darkbox" && (() => {
                const boxBg = s.data.bgColor || ink;
                const textClr = isLightBg(boxBg) ? ink : white;
                const dotClr = isLightBg(boxBg) ? sage : sageLight;
                return (
                  <div style={{ background: boxBg, color: textClr, padding: 20, borderRadius: 10 }}>
                    <EditablePreviewBlock html={s.data.heading} onChange={(v) => updatePreviewSection(si, "heading", v)} style={{ marginBottom: 10, fontSize: 16, fontWeight: 600 }} />
                    {s.data.bullets.map((b, bi) => (
                      <div key={bi} style={{ display: "flex", alignItems: "start", gap: 8, marginBottom: 6, fontSize: 14 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotClr, marginTop: 6, flexShrink: 0 }} />
                        <EditablePreviewBlock html={b.text} onChange={(v) => updatePreviewItemField(si, "bullets", bi, "text", v)} />
                      </div>
                    ))}
                  </div>
                );
              })()}
              {s.type === "takeaways" && (
                <div style={{ background: sageLight, border: `1px solid ${sage}33`, borderRadius: 12, padding: 20 }}>
                  <EditablePreviewBlock html={s.data.heading} onChange={(v) => updatePreviewSection(si, "heading", v)} style={{ fontFamily: "Georgia,serif", fontSize: 22, color: ink, marginBottom: 12 }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {s.data.items.map((it, ii) => (
                      <div key={ii} style={{ display: "flex", gap: 10 }}>
                        <div style={{ width: 28, height: 28, background: `${sage}33`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: sage, flexShrink: 0 }}>{ii + 1}</div>
                        <div>
                          <EditablePreviewBlock html={it.title} onChange={(v) => updatePreviewItemField(si, "items", ii, "title", v)} style={{ fontWeight: 600, color: ink }} />
                          <EditablePreviewBlock html={it.desc} onChange={(v) => updatePreviewItemField(si, "items", ii, "desc", v)} style={{ fontSize: 13, color: muted, marginTop: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {s.type === "stats" && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(s.data.items.length, 4)}, 1fr)`, gap: 12 }}>
                  {s.data.items.map((it, ii) => (
                    <div key={ii} style={{ textAlign: "center", padding: 16, background: `${rose}11`, borderRadius: 10, border: `1px solid ${rose}22` }}>
                      <EditablePreviewBlock html={it.val} onChange={(v) => updatePreviewItemField(si, "items", ii, "val", v)} style={{ fontFamily: "Georgia,serif", fontSize: 32, color: rose }} />
                      <EditablePreviewBlock html={it.lbl} onChange={(v) => updatePreviewItemField(si, "items", ii, "lbl", v)} style={{ fontSize: 12, color: muted, marginTop: 4 }} />
                    </div>
                  ))}
                </div>
              )}
              {s.type === "cards3" && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(s.data.items.length, 3)}, 1fr)`, gap: 12 }}>
                  {s.data.items.map((it, ii) => {
                    const c = it.color === "rose" ? rose : sage;
                    return (
                      <div key={ii} style={{ textAlign: "center", padding: 16, border: `1px solid ${c}22`, borderRadius: 10 }}>
                        <EditablePreviewBlock html={it.val} onChange={(v) => updatePreviewItemField(si, "items", ii, "val", v)} style={{ fontFamily: "Georgia,serif", fontSize: 28, color: c }} />
                        <EditablePreviewBlock html={it.lbl} onChange={(v) => updatePreviewItemField(si, "items", ii, "lbl", v)} style={{ fontSize: 12, color: muted, marginTop: 4 }} />
                      </div>
                    );
                  })}
                </div>
              )}
              {s.type === "imagecards" && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(s.data.items.length, 2)}, 1fr)`, gap: 16 }}>
                  {s.data.items.map((it, ii) => (
                    <div key={ii} style={{ border: `1px solid ${border}`, borderRadius: 10, overflow: "hidden" }}>
                      {it.img ? <img src={imgUrl(it.img)} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} /> : <div style={{ aspectRatio: "4/3", background: "#eee" }} />}
                      <div style={{ padding: 14 }}>
                        <EditablePreviewBlock html={it.heading} onChange={(v) => updatePreviewItemField(si, "items", ii, "heading", v)} style={{ fontFamily: "Georgia,serif", fontSize: 18, color: ink, marginBottom: 6 }} />
                        <EditablePreviewBlock html={it.text} onChange={(v) => updatePreviewItemField(si, "items", ii, "text", v)} style={{ fontSize: 14, color: muted }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── Editor ─── */
  return (
    <div style={{ minHeight: "100vh", background: "#EAEDE7", fontFamily: "'Trebuchet MS','Lucida Grande',sans-serif" }}>
      <div style={{ height: 50, background: ink, color: white, display: "flex", alignItems: "center", gap: 10, padding: "0 14px" }}>
        <button onClick={() => { loadBlogs(); setView("dashboard"); }} style={{ border: "none", background: "none", color: "rgba(255,255,255,.65)", cursor: "pointer", fontSize: 13 }}>← Back</button>
        <span style={{ color: "rgba(255,255,255,.2)" }}>|</span>
        <span style={{ flex: 1, color: "#C9A84C", fontFamily: "Georgia,serif", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current.meta.title}</span>
        <button onClick={() => setView("preview")} style={{ border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.09)", color: white, borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>Preview</button>
        <button disabled={saving} onClick={() => saveBlog("draft")} style={{ border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.09)", color: white, borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontSize: 12, opacity: saving ? 0.6 : 1 }}>{saving ? "Saving..." : "Save Draft"}</button>
        <button disabled={saving} onClick={() => saveBlog("published")} style={{ border: "none", background: sage, color: white, borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700, opacity: saving ? 0.6 : 1 }}>{saving ? "Saving..." : "Publish"}</button>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "20px 14px 60px" }}>
        {/* Meta form */}
        <div style={{ background: white, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,.08)", marginBottom: 16, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", background: sageLight, borderBottom: `1px solid ${border}` }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: sage, textTransform: "uppercase" }}>Post Details & Cover</p>
          </div>
          <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input value={current.meta.title} onChange={(e) => persist({ ...current, meta: { ...current.meta, title: e.target.value } })} style={{ ...inputStyle, fontFamily: "Georgia,serif", fontSize: 18 }} />
              <label style={labelStyle}>Category</label>
              <input value={current.meta.category} onChange={(e) => persist({ ...current, meta: { ...current.meta, category: e.target.value } })} style={inputStyle} />
              <label style={labelStyle}>Excerpt (listing & OG description)</label>
              <textarea value={current.meta.excerpt} onChange={(e) => persist({ ...current, meta: { ...current.meta, excerpt: e.target.value } })} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
              <label style={labelStyle}>Author</label>
              <input value={current.meta.author} onChange={(e) => persist({ ...current, meta: { ...current.meta, author: e.target.value } })} style={inputStyle} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                <div><label style={labelStyle}>Date</label><input value={current.meta.date} onChange={(e) => persist({ ...current, meta: { ...current.meta, date: e.target.value } })} style={inputStyle} /></div>
                <div><label style={labelStyle}>Read time</label><input value={current.meta.readTime} onChange={(e) => persist({ ...current, meta: { ...current.meta, readTime: e.target.value } })} style={inputStyle} /></div>
              </div>
              <div style={{ marginTop: 10 }}>
                <ImageUpload label="Cover image" value={current.meta.cover} onChange={(url) => persist({ ...current, meta: { ...current.meta, cover: url } })} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>OG / Social share preview</label>
              <OGPreview meta={current.meta} />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div style={{ background: white, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,.08)", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", background: sageLight, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: sage, textTransform: "uppercase", flex: 1 }}>Content Sections ({current.sections.length})</p>
          </div>
          <div style={{ padding: 16 }}>
            {current.sections.map((section, i) => (
              <div key={section.id} style={{ marginBottom: 8 }}>
                <div onClick={() => setOpenIdx((p) => (p === i ? null : i))} style={{ border: `2px solid ${openIdx === i ? sage : border}`, borderRadius: openIdx === i ? "10px 10px 0 0" : 10, background: openIdx === i ? sage : white, color: openIdx === i ? white : ink, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px" }}>
                  <span style={{ width: 28, height: 28, borderRadius: 7, background: openIdx === i ? "rgba(255,255,255,.2)" : sageLight, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{TYPES.find((t) => t.id === section.type)?.icon || "?"}</span>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{TYPES.find((t) => t.id === section.type)?.name || section.type}</span>
                  <span style={{ fontSize: 10, opacity: 0.5 }}>#{i + 1}</span>
                  <div style={{ flex: 1 }} />
                  {openIdx === i && (
                    <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
                      <button disabled={i === 0} onClick={() => moveSection(i, -1)} style={{ ...btnSmall, opacity: i === 0 ? 0.3 : 1 }} title="Move up">↑</button>
                      <button disabled={i === current.sections.length - 1} onClick={() => moveSection(i, 1)} style={{ ...btnSmall, opacity: i === current.sections.length - 1 ? 0.3 : 1 }} title="Move down">↓</button>
                      <button onClick={() => deleteSection(i)} style={btnDanger} title="Delete section">x</button>
                    </div>
                  )}
                </div>
                {openIdx === i && (
                  <div style={{ border: `2px solid ${sage}`, borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden", padding: 14, background: white }}>
                    <SectionEditor
                      section={section}
                      onChange={(data) => updateSectionData(i, data)}
                    />
                  </div>
                )}
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <button onClick={() => setInsertAt(current.sections.length - 1)} style={{ border: `2px dashed #C8D8C2`, borderRadius: 10, background: "none", color: sage, padding: "10px 24px", cursor: "pointer", fontWeight: 700, fontFamily: "inherit", fontSize: 13 }}>+ Add Section</button>
            </div>
          </div>
        </div>
      </div>

      {insertAt !== null && (
        <AddModal
          onClose={() => setInsertAt(null)}
          onAdd={(type) => {
            const next = [...current.sections];
            next.splice(insertAt + 1, 0, { id: uid(), type, data: clone(DEFAULTS[type]) });
            persist({ ...current, sections: next });
            setOpenIdx(insertAt + 1);
            setInsertAt(null);
          }}
        />
      )}
    </div>
  );
}
