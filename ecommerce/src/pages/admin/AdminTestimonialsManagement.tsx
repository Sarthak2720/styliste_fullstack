import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  MessageSquareText,
  Pencil,
  Play,
  Plus,
  Quote,
  Save,
  Star,
  Trash2,
  Video as VideoIcon,
  VolumeX,
  X,
} from "lucide-react";
import testimonialApi from "../../api/testimonialApi";

const OLIVE_DARK = "#5c6a42";
const OLIVE_BANNER = "#66713f";
const GOLD = "#c9a24a";
const CREAM = "#fbfaf6";
const INK = "#2f2b1e";
const MUTED = "#7a7566";

const IMG_BASE = import.meta.env.VITE_API_IMG_URL || "http://localhost:8080";

function getAssetUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/")) {
    return `${IMG_BASE}${url}`;
  }
  return `${IMG_BASE}/${url}`;
}

type Testimonial = {
  id?: string | number;
  name: string;
  location: string;
  rating: number;
  tag: string;
  message: string;
  photo: string;
};

type VideoItem = {
  id?: string | number;
  videoUrl: string;
  caption: string;
};

function emptyTestimonial(): Testimonial {
  return { name: "", location: "", rating: 5, tag: "", message: "", photo: "" };
}

function emptyVideo(): VideoItem {
  return { videoUrl: "", caption: "" };
}

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= count ? GOLD : "none"}
          color={n <= count ? GOLD : "#d8d4c4"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function SavedPing({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: OLIVE_DARK, fontWeight: 600 }}>
      <CheckCircle2 size={13} /> Saved
    </span>
  );
}

export default function AdminTestimonialsManagement() {
  const [tab, setTab] = useState<"admin" | "preview">("admin");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [quote, setQuote] = useState<string>("");
  const [tLoaded, setTLoaded] = useState(false);
  const [vLoaded, setVLoaded] = useState(false);
  const [qLoaded, setQLoaded] = useState(false);

  const [tForm, setTForm] = useState<Testimonial | null>(null);
  const [vForm, setVForm] = useState<VideoItem | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [quoteDraft, setQuoteDraft] = useState(quote);
  const [pingT, setPingT] = useState(false);
  const [pingV, setPingV] = useState(false);
  const [pingQ, setPingQ] = useState(false);

  useEffect(() => {
    testimonialApi.getTestimonials()
      .then((data) => {
        setTestimonials(data);
        setTLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load testimonials:", err);
        setTLoaded(true);
      });

    testimonialApi.getVideoTestimonials()
      .then((data) => {
        setVideos(data);
        setVLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load videos:", err);
        setVLoaded(true);
      });

    testimonialApi.getFeaturedQuote()
      .then((data) => {
        setQuote(data);
        setQuoteDraft(data);
        setQLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load quote:", err);
        setQLoaded(true);
      });
  }, []);

  const ready = tLoaded && vLoaded && qLoaded;

  const flash = useCallback((setter: (value: boolean) => void) => {
    setter(true);
    window.setTimeout(() => setter(false), 1400);
  }, []);

  function startAddTestimonial() {
    setTForm(emptyTestimonial());
  }

  function startEditTestimonial(item: Testimonial) {
    setTForm({ ...item });
  }

  async function submitTestimonial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tForm?.name.trim() || !tForm.message.trim()) return;

    try {
      if (tForm.id) {
        const updated = await testimonialApi.updateTestimonial(tForm.id, tForm);
        setTestimonials(testimonials.map((item) => (item.id === tForm.id ? updated : item)));
      } else {
        const created = await testimonialApi.createTestimonial(tForm);
        setTestimonials([...testimonials, created]);
      }
      setTForm(null);
      flash(setPingT);
    } catch (err) {
      console.error("Failed to save testimonial:", err);
      window.alert("Failed to save testimonial.");
    }
  }

  async function deleteTestimonial(id: string | number) {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await testimonialApi.deleteTestimonial(id);
      setTestimonials(testimonials.filter((item) => item.id !== id));
      flash(setPingT);
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      window.alert("Failed to delete testimonial.");
    }
  }

  function startAddVideo() {
    setVForm(emptyVideo());
  }

  function startEditVideo(item: VideoItem) {
    setVForm({ ...item });
  }

  async function submitVideo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!vForm?.caption.trim()) return;

    try {
      if (vForm.id) {
        const updated = await testimonialApi.updateVideoTestimonial(vForm.id, vForm);
        setVideos(videos.map((item) => (item.id === vForm.id ? updated : item)));
      } else {
        const created = await testimonialApi.createVideoTestimonial(vForm);
        setVideos([...videos, created]);
      }
      setVForm(null);
      flash(setPingV);
    } catch (err) {
      console.error("Failed to save video:", err);
      window.alert("Failed to save video.");
    }
  }

  async function deleteVideo(id: string | number) {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await testimonialApi.deleteVideoTestimonial(id);
      setVideos(videos.filter((item) => item.id !== id));
      flash(setPingV);
    } catch (err) {
      console.error("Failed to delete video:", err);
      window.alert("Failed to delete video.");
    }
  }

  async function submitQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const updatedQuote = await testimonialApi.updateFeaturedQuote(quoteDraft);
      setQuote(updatedQuote);
      flash(setPingQ);
    } catch (err) {
      console.error("Failed to save quote banner:", err);
      window.alert("Failed to update banner.");
    }
  }

  const previewVideos = useMemo(() => videos, [videos]);

  if (!ready) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 320, color: MUTED, fontFamily: "Georgia, serif" }}>
        <Loader2 size={18} className="spin" style={{ marginRight: 8 }} />
        Loading testimonials CRM…
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg);} }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Georgia, serif", background: CREAM, minHeight: "100%", color: INK }}>
      <style>{`
        .video-thumbnail-container:hover .play-overlay {
          opacity: 1 !important;
        }
      `}</style>
      <div style={{ padding: "0 0 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
              Testimonials Management
            </h2>
            <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
              Manage featured quotes, video testimonials, and client messages.
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <TabButton active={tab === "admin"} onClick={() => setTab("admin")} icon={<LayoutDashboard size={14} />} label="Manage" />
            <TabButton active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye size={14} />} label="Preview" />
          </div>
        </div>
      </div>

      {tab === "admin" ? (
        <AdminPanel
          testimonials={testimonials}
          videos={videos}
          quoteDraft={quoteDraft}
          setQuoteDraft={setQuoteDraft}
          tForm={tForm}
          setTForm={setTForm}
          vForm={vForm}
          setVForm={setVForm}
          startAddTestimonial={startAddTestimonial}
          startEditTestimonial={startEditTestimonial}
          submitTestimonial={submitTestimonial}
          deleteTestimonial={deleteTestimonial}
          startAddVideo={startAddVideo}
          startEditVideo={startEditVideo}
          submitVideo={submitVideo}
          deleteVideo={deleteVideo}
          submitQuote={submitQuote}
          pingT={pingT}
          pingV={pingV}
          pingQ={pingQ}
          onViewVideo={setActiveVideoUrl}
        />
      ) : (
        <PreviewPage testimonials={testimonials} videos={previewVideos} quote={quote} />
      )}

      {activeVideoUrl && (
        <div 
          onClick={() => setActiveVideoUrl(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              maxWidth: 640,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <button 
              onClick={() => setActiveVideoUrl(null)}
              style={{
                position: "absolute",
                top: -35,
                right: 0,
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <X size={18} /> Close
            </button>
            <video 
              src={getAssetUrl(activeVideoUrl)} 
              controls 
              autoPlay 
              style={{
                width: "100%",
                borderRadius: 8,
                maxHeight: "75vh",
                background: "#000",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 999,
        border: `1px solid ${OLIVE_DARK}`,
        background: active ? OLIVE_DARK : "#fff",
        color: active ? "#fff" : OLIVE_DARK,
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {icon} {label}
    </button>
  );
}

function AdminPanel(props: {
  testimonials: Testimonial[];
  videos: VideoItem[];
  quoteDraft: string;
  setQuoteDraft: (value: string) => void;
  tForm: Testimonial | null;
  setTForm: (value: Testimonial | null) => void;
  vForm: VideoItem | null;
  setVForm: (value: VideoItem | null) => void;
  startAddTestimonial: () => void;
  startEditTestimonial: (item: Testimonial) => void;
  submitTestimonial: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  startAddVideo: () => void;
  startEditVideo: (item: VideoItem) => void;
  submitVideo: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  submitQuote: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  pingT: boolean;
  pingV: boolean;
  pingQ: boolean;
  onViewVideo: (url: string) => void;
}) {
  const {
    testimonials,
    videos,
    quoteDraft,
    setQuoteDraft,
    tForm,
    setTForm,
    vForm,
    setVForm,
    startAddTestimonial,
    startEditTestimonial,
    submitTestimonial,
    deleteTestimonial,
    startAddVideo,
    startEditVideo,
    submitVideo,
    deleteVideo,
    submitQuote,
    pingT,
    pingV,
    pingQ,
    onViewVideo,
  } = props;

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      window.alert("Please choose a valid video file.");
      return;
    }

    setIsUploadingVideo(true);
    try {
      const response = await testimonialApi.uploadFile(file, 'video');
      setVForm((current) => ({
        ...current!,
        videoUrl: response.url,
        caption: current?.caption?.trim() || file.name.replace(/\.[^.]+$/, ""),
      }));
    } catch (err) {
      console.error("Failed to upload video:", err);
      window.alert("Failed to upload video. Please check file size and try again.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please choose a valid image file.");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const response = await testimonialApi.uploadFile(file, 'image');
      setTForm((current) => ({
        ...current!,
        photo: response.url,
      }));
    } catch (err) {
      console.error("Failed to upload photo:", err);
      window.alert("Failed to upload photo. Please check file size and try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Section title="Featured quote banner" icon={<Quote size={16} color={OLIVE_DARK} />} ping={<SavedPing show={pingQ} />}>
        <form onSubmit={submitQuote} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
          <textarea
            value={quoteDraft}
            onChange={(e) => setQuoteDraft(e.target.value)}
            rows={2}
            placeholder="The big quote shown on the green banner…"
            style={inputStyle({ flex: "1 1 320px", resize: "vertical" })}
          />
          <button type="submit" style={primaryBtn}>
            <Save size={14} /> Update banner
          </button>
        </form>
      </Section>

      <Section title="Video testimonials" icon={<VideoIcon size={16} color={OLIVE_DARK} />} ping={<SavedPing show={pingV} />} action={!vForm && <button onClick={startAddVideo} style={ghostBtn}><Plus size={14} /> Add video</button>}>
        {vForm && (
          <form onSubmit={submitVideo} style={cardFormStyle}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Video file or URL">
                <div style={{ display: "grid", gap: 8 }}>
                  <input value={vForm.videoUrl} onChange={(e) => setVForm({ ...vForm, videoUrl: e.target.value })} placeholder="https://…" style={inputStyle()} disabled={isUploadingVideo} />
                  {isUploadingVideo ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED, padding: "7px 0" }}>
                      <Loader2 size={14} className="spin" /> Uploading video...
                    </span>
                  ) : (
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content", padding: "7px 12px", borderRadius: 7, border: `1px solid ${OLIVE_DARK}`, background: "#fff", color: OLIVE_DARK, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      <input type="file" accept="video/*" onChange={handleVideoUpload} style={{ display: "none" }} />
                      Upload video
                    </label>
                  )}
                </div>
              </Field>
              <Field label="Caption">
                <input value={vForm.caption} onChange={(e) => setVForm({ ...vForm, caption: e.target.value })} placeholder="Draping a bridal lehenga" style={inputStyle()} disabled={isUploadingVideo} />
              </Field>
            </div>
            <FormActions onCancel={() => setVForm(null)} disabled={isUploadingVideo} />
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 12 }}>
          {videos.map((video) => (
            <div key={video.id} style={rowCardStyle}>
              <div 
                onClick={() => video.videoUrl && onViewVideo(video.videoUrl)}
                style={{ 
                  background: "#111", 
                  borderRadius: 8, 
                  height: 90, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  marginBottom: 8, 
                  position: "relative", 
                  overflow: "hidden",
                  cursor: video.videoUrl ? "pointer" : "default"
                }}
                className="video-thumbnail-container"
              >
                {video.videoUrl ? (
                  <>
                    <video src={getAssetUrl(video.videoUrl)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "rgba(0,0,0,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                    }} className="play-overlay">
                      <Play size={24} color="#fff" fill="#fff" />
                    </div>
                  </>
                ) : (
                  <Play size={22} color="#888" />
                )}
                <VolumeX size={14} color="#eee" style={{ position: "absolute", bottom: 6, right: 8 }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{video.caption || "Untitled clip"}</div>
              <RowActions onView={video.videoUrl ? () => onViewVideo(video.videoUrl) : undefined} onEdit={() => startEditVideo(video)} onDelete={() => deleteVideo(video.id)} />
            </div>
          ))}
          {videos.length === 0 && <EmptyNote text="No videos yet — add one above." />}
        </div>
      </Section>

      <Section title="Client messages & photos" icon={<MessageSquareText size={16} color={OLIVE_DARK} />} ping={<SavedPing show={pingT} />} action={!tForm && <button onClick={startAddTestimonial} style={ghostBtn}><Plus size={14} /> Add testimonial</button>}>
        {tForm && (
          <form onSubmit={submitTestimonial} style={cardFormStyle}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Client name"><input value={tForm.name} onChange={(e) => setTForm({ ...tForm, name: e.target.value })} style={inputStyle()} required disabled={isUploadingPhoto} /></Field>
              <Field label="Location"><input value={tForm.location} onChange={(e) => setTForm({ ...tForm, location: e.target.value })} style={inputStyle()} disabled={isUploadingPhoto} /></Field>
              <Field label="Service tags (press Enter to add)">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {tForm.tag ? tForm.tag.split(",").map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                      <span key={idx} style={{ ...tagStyle, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        {tag}
                        <X 
                          size={11} 
                          style={{ cursor: "pointer" }} 
                          onClick={() => {
                            const newTags = tForm.tag.split(",").map((t) => t.trim()).filter(Boolean).filter((_, i) => i !== idx);
                            setTForm({ ...tForm, tag: newTags.join(", ") });
                          }}
                        />
                      </span>
                    )) : null}
                  </div>
                  <input 
                    placeholder="e.g. Bridal Wear (type and press Enter)" 
                    style={inputStyle()} 
                    disabled={isUploadingPhoto}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim();
                        if (!val) return;
                        const currentTags = tForm.tag ? tForm.tag.split(",").map((t) => t.trim()).filter(Boolean) : [];
                        if (currentTags.includes(val)) {
                          e.currentTarget.value = "";
                          return;
                        }
                        const newTags = [...currentTags, val];
                        setTForm({ ...tForm, tag: newTags.join(", ") });
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>
              </Field>
              <Field label="Photo URL or File">
                <div style={{ display: "grid", gap: 8 }}>
                  <input value={tForm.photo} onChange={(e) => setTForm({ ...tForm, photo: e.target.value })} placeholder="https://…" style={inputStyle()} disabled={isUploadingPhoto} />
                  {isUploadingPhoto ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED, padding: "7px 0" }}>
                      <Loader2 size={14} className="spin" /> Uploading photo...
                    </span>
                  ) : (
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content", padding: "7px 12px", borderRadius: 7, border: `1px solid ${OLIVE_DARK}`, background: "#fff", color: OLIVE_DARK, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                      Upload photo
                    </label>
                  )}
                </div>
              </Field>
              <Field label="Rating">
                <select value={tForm.rating} onChange={(e) => setTForm({ ...tForm, rating: Number(e.target.value) })} style={inputStyle()} disabled={isUploadingPhoto}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
                </select>
              </Field>
            </div>
            <Field label="Message">
              <textarea value={tForm.message} onChange={(e) => setTForm({ ...tForm, message: e.target.value })} rows={3} style={inputStyle({ resize: "vertical" })} required disabled={isUploadingPhoto} />
            </Field>
            <FormActions onCancel={() => setTForm(null)} disabled={isUploadingPhoto} />
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginTop: 12 }}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} style={rowCardStyle}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e7e3d5", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {testimonial.photo ? <img src={getAssetUrl(testimonial.photo)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageIcon size={14} color={MUTED} />}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{testimonial.name}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{testimonial.location}</div>
                </div>
              </div>
              <Stars count={testimonial.rating} />
              <div style={{ fontSize: 12.5, color: "#4a4636", margin: "6px 0 8px", lineHeight: 1.4 }}>{testimonial.message.length > 110 ? testimonial.message.slice(0, 110) + "…" : testimonial.message}</div>
              {testimonial.tag && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                  {testimonial.tag.split(",").map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                    <span key={idx} style={tagStyle}>{tag}</span>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 8 }}><RowActions onEdit={() => startEditTestimonial(testimonial)} onDelete={() => deleteTestimonial(testimonial.id)} /></div>
            </div>
          ))}
          {testimonials.length === 0 && <EmptyNote text="No testimonials yet — add one above." />}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon, action, ping, children }: { title: string; icon: React.ReactNode; action?: React.ReactNode; ping?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 30, background: "#fff", border: "1px solid #eae6d8", borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon}
          <h3 style={{ margin: 0, fontSize: 16, fontFamily: "Georgia, serif", color: INK }}>{title}</h3>
          {ping}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: MUTED, marginBottom: 10 }}>{label}{children}</label>;
}

function FormActions({ onCancel, disabled }: { onCancel: () => void; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
      <button type="submit" style={disabled ? { ...primaryBtn, opacity: 0.5, cursor: "not-allowed" } : primaryBtn} disabled={disabled}><Save size={14} /> Save</button>
      <button type="button" onClick={onCancel} style={ghostBtn} disabled={disabled}><X size={14} /> Cancel</button>
    </div>
  );
}

function RowActions({ onEdit, onDelete, onView }: { onEdit: () => void; onDelete: () => void; onView?: () => void }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {onView && <button onClick={onView} style={iconBtn} title="View / Play"><Eye size={13} /></button>}
      <button onClick={onEdit} style={iconBtn} title="Edit"><Pencil size={13} /></button>
      <button onClick={onDelete} style={{ ...iconBtn, color: "#a5452f" }} title="Delete"><Trash2 size={13} /></button>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <div style={{ fontSize: 12.5, color: MUTED, fontStyle: "italic" }}>{text}</div>;
}

const inputStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  border: "1px solid #ddd8c8",
  borderRadius: 7,
  padding: "8px 10px",
  fontSize: 13,
  fontFamily: "system-ui, sans-serif",
  width: "100%",
  boxSizing: "border-box",
  ...extra,
});

const cardFormStyle = { background: "#f7f5ec", border: "1px dashed #d8d3c0", borderRadius: 10, padding: 14, marginBottom: 8 };
const rowCardStyle = { border: "1px solid #eee9da", borderRadius: 10, padding: 12, background: "#fffefb" };
const primaryBtn = { display: "flex", alignItems: "center", gap: 6, background: OLIVE_DARK, color: "#fff", border: "none", borderRadius: 7, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const ghostBtn = { display: "flex", alignItems: "center", gap: 6, background: "#fff", color: OLIVE_DARK, border: `1px solid ${OLIVE_DARK}`, borderRadius: 7, padding: "7px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const iconBtn = { display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, border: "1px solid #e2ddca", background: "#fff", borderRadius: 6, cursor: "pointer", color: INK };
const tagStyle = { fontSize: 10.5, background: "#eef0e4", color: OLIVE_DARK, padding: "3px 8px", borderRadius: 5, fontFamily: "system-ui, sans-serif", fontWeight: 600 };

function PreviewPage({ testimonials, videos, quote }: { testimonials: Testimonial[]; videos: VideoItem[]; quote: string }) {
  return (
    <div style={{ background: "#fff" }}>
      <div style={{ background: `linear-gradient(rgba(92,106,66,0.55), rgba(92,106,66,0.55))`, backgroundSize: "cover", padding: "70px 20px", textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 12, letterSpacing: 3, opacity: 0.85, marginBottom: 8 }}>— TESTIMONIALS —</div>
        <h1 style={{ fontSize: 40, margin: "0 0 4px", fontWeight: 700 }}>What Our</h1>
        <h1 style={{ fontSize: 40, margin: "0 0 14px", fontStyle: "italic", color: "#d7dcc0" }}>Clients Say</h1>
        <p style={{ opacity: 0.9, maxWidth: 480, margin: "0 auto", fontSize: 14 }}>Real stories from our valued customers who trusted us with their fashion dreams.</p>
      </div>
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
          {videos.map((video, i) => (
            <div key={video.id} style={{ background: "#000", borderRadius: 10, width: i === 1 ? 340 : 270, height: i === 1 ? 200 : 165, position: "relative", overflow: "hidden" }}>
              {video.videoUrl ? <video src={getAssetUrl(video.videoUrl)} muted controls style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={28} color="#555" /></div>}
              <VolumeX size={16} color="#eee" style={{ position: "absolute", bottom: 8, right: 10 }} />
            </div>
          ))}
        </div>
        <p style={{ color: MUTED, fontSize: 13.5, maxWidth: 480, margin: "0 auto" }}>A glimpse into the craftsmanship, precision, and passion behind every Styliste Couturier creation.</p>
      </div>
      <div style={{ background: OLIVE_BANNER, color: "#fff", padding: "60px 20px", textAlign: "center" }}>
        <Quote size={36} color="rgba(255,255,255,0.35)" style={{ marginBottom: 10 }} />
        <p style={{ fontSize: 24, fontStyle: "italic", maxWidth: 640, margin: "0 auto", lineHeight: 1.5, fontWeight: 500 }}>"{quote}"</p>
      </div>
      <div style={{ padding: "40px 20px 70px", display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} style={{ border: "1px solid #ece8d9", borderRadius: 10, padding: 18, width: 300, background: "#fff" }}>
            <Stars count={testimonial.rating} size={13} />
            <p style={{ fontSize: 13, color: "#5a5744", fontStyle: "italic", lineHeight: 1.5, margin: "10px 0 14px" }}>"{testimonial.message}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid #f0ede0", paddingTop: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", background: "#e7e3d5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {testimonial.photo ? <img src={getAssetUrl(testimonial.photo)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageIcon size={14} color={MUTED} />}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: INK }}>{testimonial.name}</div>
                <div style={{ fontSize: 11.5, color: MUTED }}>{testimonial.location}</div>
              </div>
            </div>
            {testimonial.tag && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
                {testimonial.tag.split(",").map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                  <span key={idx} style={tagStyle}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
