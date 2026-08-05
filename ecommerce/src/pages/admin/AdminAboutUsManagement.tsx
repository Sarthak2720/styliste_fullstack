import React, { useState, useEffect } from "react";
import {
  Eye,
  Target,
  Scissors,
  Home,
  Shirt,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Save,
  Users,
  Award,
  Heart,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import aboutUsApi, { type AboutSection } from "../../api/aboutUsApi";

const OLIVE_DARK = "#5c6a42";
const CREAM = "#fbfaf6";
const INK = "#2f2b1e";
const MUTED = "#7a7566";

const IMG_BASE = import.meta.env.VITE_API_IMG_URL || "http://localhost:8080";

function getAssetUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/")) {
    return `${IMG_BASE}${url}`;
  }
  return `${IMG_BASE}/${url}`;
}

export function getIconComponent(name?: string) {
  switch (name?.toLowerCase()) {
    case "eye":
      return Eye;
    case "target":
      return Target;
    case "scissors":
      return Scissors;
    case "home":
      return Home;
    case "shirt":
      return Shirt;
    case "sparkles":
      return Sparkles;
    case "users":
      return Users;
    case "award":
      return Award;
    case "heart":
      return Heart;
    default:
      return HelpCircle;
  }
}

const ICONS_LIST = ["Eye", "Target", "Scissors", "Home", "Shirt", "Sparkles", "Users", "Award", "Heart"];

const ADDABLE_PAGE_LAYOUTS = [
  { id: "HERO", name: "Hero Banner", desc: "Top header with background image." },
  { id: "STORY_IMAGE_LEFT", name: "Story (Image Left)", desc: "Two column text block with image on the left." },
  { id: "STORY_IMAGE_RIGHT", name: "Story (Image Right)", desc: "Two column text block with image on the right." },
  { id: "CTA", name: "Call to Action Banner", desc: "Dark background consultation banner with buttons." },
  { id: "TEXT_ONLY", name: "Plain Text Block", desc: "Narrative paragraph block." },
];

export default function AdminAboutUsManagement() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("hero");
  
  // Section Select Modal
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);

  // Save & Upload states
  const [savingId, setSavingId] = useState<string | number | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [openListIdx, setOpenListIdx] = useState<number | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const data = await aboutUsApi.getAboutSections();
      setSections(data);
    } catch (err) {
      console.error("Failed to load sections:", err);
      showNotification("Failed to load sections", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Group sections by tab logic:
  // Standard list section types:
  const visionSections = sections.filter(s => s.layoutType === "VISION_GOAL");
  const teamSections = sections.filter(s => s.layoutType === "TEAM_MEMBER");
  const serviceSections = sections.filter(s => s.layoutType === "SERVICE_CARD");

  // For single-item types, we find the first occurrence in standard tabs:
  const firstHero = sections.find(s => s.layoutType === "HERO");
  const firstStory = sections.find(s => s.layoutType === "STORY_IMAGE_RIGHT");
  const firstPromise = sections.find(s => s.layoutType === "STORY_IMAGE_LEFT");
  const firstCta = sections.find(s => s.layoutType === "CTA");

  // Dynamic tabs are created for any custom sections or extra sections of these types:
  const getDynamicTabsList = () => {
    const list: { id: string; label: string; section: AboutSection }[] = [];
    sections.forEach((s) => {
      // If it is a list type, it's grouped under standard list tabs:
      if (["VISION_GOAL", "TEAM_MEMBER", "SERVICE_CARD"].includes(s.layoutType)) {
        return;
      }
      
      // If it is the first standard instance, it maps to standard tabs:
      if (s.id === firstHero?.id) return;
      if (s.id === firstStory?.id) return;
      if (s.id === firstPromise?.id) return;
      if (s.id === firstCta?.id) return;

      // Otherwise, it gets a dynamic custom section tab:
      let prefix = "Text Block";
      if (s.layoutType === "HERO") prefix = "Extra Hero";
      if (s.layoutType === "STORY_IMAGE_RIGHT") prefix = "Extra Story (Right)";
      if (s.layoutType === "STORY_IMAGE_LEFT") prefix = "Extra Story (Left)";
      if (s.layoutType === "CTA") prefix = "Extra CTA Banner";

      list.push({
        id: `section-${s.id}`,
        label: `${prefix}: ${s.title.substring(0, 15) || "Untitled"}`,
        section: s,
      });
    });
    return list;
  };

  const dynamicTabs = getDynamicTabsList();

  const handleUpdateField = (id: string | number, patch: Partial<AboutSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const handleSaveSection = async (id?: string | number) => {
    if (!id) return;
    const section = sections.find(s => s.id === id);
    if (!section) return;

    if (!section.title.trim()) {
      showNotification("Title is required", "error");
      return;
    }

    try {
      setSavingId(id);
      await aboutUsApi.updateAboutSection(id, section);
      showNotification("Saved successfully!");
      fetchSections();
    } catch (err) {
      console.error(err);
      showNotification("Failed to save changes", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleCreateNewSection = async (layoutType: string) => {
    const nextOrder = sections.length > 0 ? Math.max(...sections.map(s => s.sortOrder || 0)) + 1 : 1;
    const newSection: AboutSection = {
      title: `New ${layoutType.replace("_", " ")} Block`,
      subtitle: "",
      content: "Enter description here...",
      layoutType: layoutType,
      sortOrder: nextOrder,
    };

    try {
      setLoading(true);
      const created = await aboutUsApi.createAboutSection(newSection);
      showNotification("New page section added!");
      setIsAddSectionModalOpen(false);
      
      // Determine what tab we should open
      const dynamicList = [...sections, created];
      setSections(dynamicList);
      
      // If it's a dynamic block, focus on it
      setActiveTab(`section-${created.id}`);
    } catch (err) {
      console.error(err);
      showNotification("Failed to add page section", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSectionBlock = async (id?: string | number, tabRedirect: string = "hero") => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this entire page section block?")) return;

    try {
      setLoading(true);
      await aboutUsApi.deleteAboutSection(id);
      showNotification("Section block deleted");
      setActiveTab(tabRedirect);
      fetchSections();
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete section", "error");
      setLoading(false);
    }
  };

  const handleAddListItem = async (layoutType: string) => {
    const nextOrder = sections.length > 0 ? Math.max(...sections.map(s => s.sortOrder || 0)) + 1 : 1;
    let label = "New Item";
    if (layoutType === "TEAM_MEMBER") label = "New Team Member";
    if (layoutType === "SERVICE_CARD") label = "New Service Card";
    if (layoutType === "VISION_GOAL") label = "New Goal";

    const newItem: AboutSection = {
      title: label,
      subtitle: layoutType === "TEAM_MEMBER" ? "Role / Title" : "",
      content: "Description text...",
      layoutType: layoutType,
      sortOrder: nextOrder,
      icon: ["VISION_GOAL", "SERVICE_CARD"].includes(layoutType) ? "Eye" : undefined,
    };

    try {
      setLoading(true);
      const created = await aboutUsApi.createAboutSection(newItem);
      showNotification("Added successfully!");
      
      // Fetch sections and expand the newly created item
      const fetched = await aboutUsApi.getAboutSections();
      setSections(fetched);
      
      // Open the accordion card of the newly added list item
      const filteredList = fetched.filter(s => s.layoutType === layoutType);
      const index = filteredList.findIndex(s => s.id === created.id);
      if (index !== -1) setOpenListIdx(index);
    } catch (err) {
      console.error(err);
      showNotification("Failed to add item", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListItem = async (id?: string | number) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this list item?")) return;

    try {
      setLoading(true);
      await aboutUsApi.deleteAboutSection(id);
      showNotification("Deleted successfully");
      setOpenListIdx(null);
      fetchSections();
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete", "error");
      setLoading(false);
    }
  };

  const handleMoveListItem = async (filteredList: AboutSection[], index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === filteredList.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    // Find absolute indices in main sections list
    const sectionA = filteredList[index];
    const sectionB = filteredList[targetIndex];
    
    const indexA = sections.findIndex(s => s.id === sectionA.id);
    const indexB = sections.findIndex(s => s.id === sectionB.id);

    const newSections = [...sections];
    // Swap
    const temp = newSections[indexA];
    newSections[indexA] = newSections[indexB];
    newSections[indexB] = temp;

    setSections(newSections);

    try {
      const ids = newSections.map(s => s.id).filter((id): id is string | number => id !== undefined);
      await aboutUsApi.reorderAboutSections(ids);
      showNotification("Sequence updated");
    } catch (err) {
      console.error(err);
      showNotification("Failed to update sequence", "error");
      fetchSections();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string | number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIdx(id as number);
      const res = await aboutUsApi.uploadFile(file);
      handleUpdateField(id, { imageUrl: res.url });
      showNotification("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      showNotification("Image upload failed", "error");
    } finally {
      setUploadingIdx(null);
    }
  };

  // Group sections consecutive helper for preview rendering
  const renderPreviewGroups = () => {
    const groups: { type: string; items: AboutSection[] }[] = [];
    const groupableTypes = ["VISION_GOAL", "TEAM_MEMBER", "SERVICE_CARD"];

    sections.forEach((section) => {
      const lastGroup = groups[groups.length - 1];
      if (
        lastGroup &&
        lastGroup.type === section.layoutType &&
        groupableTypes.includes(section.layoutType)
      ) {
        lastGroup.items.push(section);
      } else {
        groups.push({
          type: section.layoutType,
          items: [section],
        });
      }
    });

    return groups.map((group, idx) => {
      const { type, items } = group;
      
      switch (type) {
        case "HERO":
          const hero = items[0];
          return (
            <div key={`prev-${idx}`} className="relative py-20 bg-[#5E6E54] text-white overflow-hidden rounded-lg mb-8">
              {hero.imageUrl && (
                <div className="absolute inset-0">
                  <img
                    src={getAssetUrl(hero.imageUrl)}
                    alt="Hero background"
                    className="w-full h-full object-cover opacity-25"
                  />
                  <div className="absolute inset-0 bg-[#5E6E54]/70" />
                </div>
              )}
              <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
                <span className="text-xs uppercase tracking-widest text-gray-200 block mb-2">{hero.subtitle || "About Us"}</span>
                <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">{hero.title}</h1>
                <p className="text-sm md:text-base text-gray-100">{hero.content}</p>
              </div>
            </div>
          );

        case "VISION_GOAL":
          return (
            <div key={`prev-${idx}`} className="py-12 bg-white border border-gray-100 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {items.map((item, itemIdx) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <div key={`prev-vg-${itemIdx}`} className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 mb-4 bg-gray-50 border border-[#5E6E54]/20 flex items-center justify-center rounded">
                        <IconComponent className="w-6 h-6 text-[#5E6E54]" />
                      </div>
                      <span className="text-xs uppercase tracking-wider text-[#5E6E54] font-semibold">{item.subtitle}</span>
                      <h3 className="font-serif text-xl font-semibold mt-1 mb-3">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );

        case "STORY_IMAGE_RIGHT":
          const storyR = items[0];
          return (
            <div key={`prev-${idx}`} className="py-12 bg-gray-50 rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#5E6E54] font-semibold block mb-2">{storyR.subtitle}</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">{storyR.title}</h2>
                <div className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: storyR.content || "" }} />
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                <img src={getAssetUrl(storyR.imageUrl)} alt={storyR.title} className="w-full h-full object-cover" />
              </div>
            </div>
          );

        case "STORY_IMAGE_LEFT":
          const storyL = items[0];
          return (
            <div key={`prev-${idx}`} className="py-12 bg-gray-50 rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 order-2 md:order-1">
                <img src={getAssetUrl(storyL.imageUrl)} alt={storyL.title} className="w-full h-full object-cover" />
              </div>
              <div className="order-1 md:order-2">
                <span className="text-xs uppercase tracking-wider text-[#5E6E54] font-semibold block mb-2">{storyL.subtitle}</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">{storyL.title}</h2>
                <div className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: storyL.content || "" }} />
              </div>
            </div>
          );

        case "TEAM_MEMBER":
          return (
            <div key={`prev-${idx}`} className="py-12 bg-white border border-gray-100 rounded-lg p-6 mb-8">
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-wider text-[#5E6E54] font-semibold">Our Experts</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1">Our Team</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, itemIdx) => (
                  <div key={`prev-team-${itemIdx}`} className="text-center group border border-gray-100 p-4 rounded-lg">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-gray-100">
                      <img src={getAssetUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                    </div>
                    <h4 className="font-serif text-lg font-bold">{item.title}</h4>
                    <p className="text-xs uppercase tracking-wider text-[#5E6E54] mb-2">{item.subtitle}</p>
                    <p className="text-xs text-gray-600 line-clamp-3">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          );

        case "SERVICE_CARD":
          return (
            <div key={`prev-${idx}`} className="py-12 bg-[#5E6E54]/5 rounded-lg p-6 mb-8">
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-wider text-[#5E6E54] font-semibold">What We Offer</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1">Your Trusted Fashion Partner</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, itemIdx) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <div key={`prev-service-${itemIdx}`} className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm">
                      <div className="w-12 h-12 mb-4 bg-[#5E6E54]/10 flex items-center justify-center rounded">
                        <IconComponent className="w-6 h-6 text-[#5E6E54]" />
                      </div>
                      <h4 className="font-serif text-lg font-bold mb-2">{item.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{item.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );

        case "CTA":
          const cta = items[0];
          return (
            <div key={`prev-${idx}`} className="py-12 bg-[#5E6E54] text-white rounded-lg p-8 mb-8 text-center">
              <h2 className="font-serif text-2xl md:text-4xl font-bold mb-4">{cta.title}</h2>
              <p className="text-sm md:text-base text-gray-100 max-w-xl mx-auto mb-6">{cta.content}</p>
              <div className="flex justify-center gap-4">
                <button className="px-6 py-2 bg-white text-[#5E6E54] rounded-md font-semibold text-sm hover:bg-gray-100">
                  Book Appointment
                </button>
                <button className="px-6 py-2 border border-white/40 text-white rounded-md font-semibold text-sm hover:bg-white/10">
                  Contact Us
                </button>
              </div>
            </div>
          );

        default:
          const textBlock = items[0];
          return (
            <div key={`prev-${idx}`} className="py-8 border-b border-gray-100 mb-8 max-w-2xl mx-auto">
              <h3 className="font-serif text-xl font-bold mb-2">{textBlock.title}</h3>
              {textBlock.subtitle && <h5 className="text-xs uppercase text-gray-500 mb-2">{textBlock.subtitle}</h5>}
              <p className="text-sm text-gray-600 leading-relaxed">{textBlock.content}</p>
            </div>
          );
      }
    });
  };

  // Helper to render form fields for a single block
  const renderSingleBlockForm = (section?: AboutSection, isDynamic: boolean = false, dynamicTabId: string = "") => {
    if (!section) return null;

    const isSaving = savingId === section.id;

    return (
      <div style={{ background: "#fffefb", border: "1px solid #eee9da", borderRadius: 10, padding: 18 }} className="space-y-4">
        <div style={{ borderBottom: "1.5px solid #eae5d8", paddingBottom: 10, marginBottom: 14 }} className="flex justify-between items-center">
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: OLIVE_DARK, textTransform: "uppercase" }}>
            Section Parameters ({section.layoutType})
          </span>
          {isDynamic && (
            <button
              onClick={() => handleDeleteSectionBlock(section.id, "hero")}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#a5452f", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              <Trash2 size={13} /> Delete Entire Section Block
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>
              Title Heading
            </label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleUpdateField(section.id!, { title: e.target.value })}
              style={{ border: "1px solid #ddd8c8", borderRadius: 7, padding: "8px 10px", fontSize: 13, width: "100%", boxSizing: "border-box" }}
              placeholder="Main header text"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>
              Subtitle Label
            </label>
            <input
              type="text"
              value={section.subtitle || ""}
              onChange={(e) => handleUpdateField(section.id!, { subtitle: e.target.value })}
              style={{ border: "1px solid #ddd8c8", borderRadius: 7, padding: "8px 10px", fontSize: 13, width: "100%", boxSizing: "border-box" }}
              placeholder="Tagline or label"
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>
            Description / Content Text (HTML allowed)
          </label>
          <textarea
            value={section.content || ""}
            onChange={(e) => handleUpdateField(section.id!, { content: e.target.value })}
            rows={5}
            style={{ border: "1px solid #ddd8c8", borderRadius: 7, padding: "8px 10px", fontSize: 13, width: "100%", boxSizing: "border-box", fontFamily: "system-ui, sans-serif" }}
            placeholder="Main description"
          />
        </div>

        {["HERO", "STORY_IMAGE_LEFT", "STORY_IMAGE_RIGHT"].includes(section.layoutType) && (
          <div style={{ background: "#f7f5ec", border: "1px dashed #d8d3c0", borderRadius: 8, padding: 14 }} className="space-y-3">
            <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase" }}>
              Cover Image Source
            </span>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                value={section.imageUrl || ""}
                onChange={(e) => handleUpdateField(section.id!, { imageUrl: e.target.value })}
                placeholder="Image file path or URL"
                style={{ border: "1px solid #ddd8c8", borderRadius: 7, padding: "8px 10px", fontSize: 13, width: "100%", boxSizing: "border-box", background: "#fff" }}
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, section.id!)}
                  className="hidden"
                  id={`single-file-upload-${section.id}`}
                  disabled={uploadingIdx === section.id}
                />
                <label
                  htmlFor={`single-file-upload-${section.id}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 7, border: `1px solid ${OLIVE_DARK}`, background: "#fff", color: OLIVE_DARK, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                >
                  {uploadingIdx === section.id ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Browse File
                    </>
                  )}
                </label>
              </div>
            </div>
            {section.imageUrl && (
              <div className="flex items-center gap-3">
                <img
                  src={getAssetUrl(section.imageUrl)}
                  alt="Thumbnail"
                  className="w-16 h-16 object-cover rounded border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateField(section.id!, { imageUrl: "" })}
                  className="text-xs text-red-700 hover:underline"
                >
                  Clear Image
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-[#eee9da]">
          <button
            type="button"
            onClick={() => handleSaveSection(section.id)}
            disabled={isSaving}
            style={{ display: "flex", alignItems: "center", gap: 6, background: OLIVE_DARK, color: "#fff", border: "none", borderRadius: 7, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {isSaving ? (
              <>
                <Loader2 size={12} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={12} /> Save Section
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Helper to render lists of sub-blocks (Team, Services, Vision & Goals)
  const renderListBlockForm = (listSections: AboutSection[], layoutType: string, addLabel: string) => {
    return (
      <div className="space-y-4">
        {/* Add button restored */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f7f5ec", border: "1px dashed #d8d3c0", padding: 14, borderRadius: 10 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: INK }}>Manage {addLabel} List Elements</h3>
            <p style={{ margin: "2px 0 0", color: MUTED, fontSize: 12 }}>Expand elements to configure details, reorder with sequences, or delete items.</p>
          </div>
          <button
            onClick={() => handleAddListItem(layoutType)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: OLIVE_DARK, color: "#fff", border: "none", borderRadius: 7, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Plus size={14} /> Add {addLabel}
          </button>
        </div>

        {listSections.length === 0 ? (
          <div style={{ background: "#fffefb", border: "1px solid #eee9da", borderRadius: 10, padding: 18, color: MUTED }} className="text-center italic">
            No items configure. Click "Add {addLabel}" above to insert.
          </div>
        ) : (
          <div className="space-y-3">
            {listSections.map((item, idx) => {
              const isOpen = openListIdx === idx;
              const isSaving = savingId === item.id;
              const IconComponent = getIconComponent(item.icon);
              
              return (
                <div
                  key={item.id || idx}
                  style={{
                    background: "#fffefb",
                    border: isOpen ? `1.5px solid ${OLIVE_DARK}` : "1px solid #eee9da",
                    borderRadius: 10,
                    overflow: "hidden"
                  }}
                >
                  {/* Collapsible item header */}
                  <div
                    onClick={() => setOpenListIdx(isOpen ? null : idx)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span style={{ fontSize: 11, fontWeight: 700, background: "#eef0e4", color: OLIVE_DARK, padding: "2px 6px", borderRadius: 4 }}>
                        {idx + 1}
                      </span>
                      {item.imageUrl ? (
                        <img src={getAssetUrl(item.imageUrl)} alt="" className="w-8 h-8 rounded object-cover border border-[#eee9da]" />
                      ) : item.icon ? (
                        <div style={{ width: 32, height: 32, border: "1px solid #e2ddca", background: "#fff", borderRadius: 6 }} className="flex items-center justify-center text-gray-500">
                          <IconComponent size={14} />
                        </div>
                      ) : null}
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>
                        {item.title} {item.subtitle ? `(${item.subtitle})` : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMoveListItem(listSections, idx, "up")}
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "1px solid #e2ddca", background: "#fff", borderRadius: 6, cursor: "pointer", color: INK, opacity: idx === 0 ? 0.3 : 1 }}
                        title="Move Up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        disabled={idx === listSections.length - 1}
                        onClick={() => handleMoveListItem(listSections, idx, "down")}
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "1px solid #e2ddca", background: "#fff", borderRadius: 6, cursor: "pointer", color: INK, opacity: idx === listSections.length - 1 ? 0.3 : 1 }}
                        title="Move Down"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteListItem(item.id)}
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "1px solid #f2dede", background: "#fff", borderRadius: 6, cursor: "pointer", color: "#a5452f" }}
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Collapsible item body */}
                  {isOpen && (
                    <div className="p-5 bg-white border-t border-gray-100 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>
                            Heading Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleUpdateField(item.id!, { title: e.target.value })}
                            style={{ border: "1px solid #ddd8c8", borderRadius: 7, padding: "8px 10px", fontSize: 13, width: "100%", boxSizing: "border-box" }}
                            placeholder="Name / Title"
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>
                            Subtitle / Label
                          </label>
                          <input
                            type="text"
                            value={item.subtitle || ""}
                            onChange={(e) => handleUpdateField(item.id!, { subtitle: e.target.value })}
                            style={{ border: "1px solid #ddd8c8", borderRadius: 7, padding: "8px 10px", fontSize: 13, width: "100%", boxSizing: "border-box" }}
                            placeholder="Role / Tagline"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: 11, color: MUTED, marginBottom: 4 }}>
                          Description Content
                        </label>
                        <textarea
                          value={item.content || ""}
                          onChange={(e) => handleUpdateField(item.id!, { content: e.target.value })}
                          rows={3}
                          style={{ border: "1px solid #ddd8c8", borderRadius: 7, padding: "8px 10px", fontSize: 13, width: "100%", boxSizing: "border-box", fontFamily: "system-ui, sans-serif" }}
                          placeholder="Description details..."
                        />
                      </div>

                      {/* Optional Image */}
                      {layoutType === "TEAM_MEMBER" && (
                        <div style={{ background: "#f7f5ec", border: "1px dashed #d8d3c0", borderRadius: 8, padding: 14 }} className="space-y-2">
                          <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase" }}>
                            Member Photo
                          </span>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={item.imageUrl || ""}
                              onChange={(e) => handleUpdateField(item.id!, { imageUrl: e.target.value })}
                              placeholder="Photo URL path"
                              style={{ border: "1px solid #ddd8c8", borderRadius: 7, padding: "8px 10px", fontSize: 13, width: "100%", boxSizing: "border-box", background: "#fff" }}
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, item.id!)}
                                className="hidden"
                                id={`list-image-upload-${item.id}`}
                                disabled={uploadingIdx === item.id}
                              />
                              <label
                                htmlFor={`list-image-upload-${item.id}`}
                                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 7, border: `1px solid ${OLIVE_DARK}`, background: "#fff", color: OLIVE_DARK, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                              >
                                {uploadingIdx === item.id ? "Uploading..." : "Browse Photo"}
                              </label>
                            </div>
                          </div>
                          {item.imageUrl && (
                            <img src={getAssetUrl(item.imageUrl)} alt="" className="w-12 h-12 object-cover rounded border border-[#eee9da]" />
                          )}
                        </div>
                      )}

                      {/* Optional Icons */}
                      {["VISION_GOAL", "SERVICE_CARD"].includes(layoutType) && (
                        <div style={{ background: "#f7f5ec", border: "1px dashed #d8d3c0", borderRadius: 8, padding: 14 }} className="space-y-2">
                          <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase" }}>
                            Icon Selection
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {ICONS_LIST.map((iconName) => {
                              const IconOptComponent = getIconComponent(iconName);
                              const isSelected = item.icon === iconName;
                              return (
                                <button
                                  key={iconName}
                                  type="button"
                                  onClick={() => handleUpdateField(item.id!, { icon: iconName })}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    padding: "4px 8px",
                                    borderRadius: 5,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    border: isSelected ? `1px solid ${OLIVE_DARK}` : "1px solid #ddd8c8",
                                    background: isSelected ? "#eef0e4" : "#fff",
                                    color: isSelected ? OLIVE_DARK : "#555",
                                    cursor: "pointer"
                                  }}
                                >
                                  <IconOptComponent size={12} />
                                  {iconName}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Save panel */}
                      <div className="flex justify-end pt-3 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleSaveSection(item.id)}
                          disabled={isSaving}
                          style={{ display: "flex", alignItems: "center", gap: 6, background: OLIVE_DARK, color: "#fff", border: "none", borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          {isSaving ? "Saving..." : "Save Item"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const TABS = [
    { id: "hero", label: "Hero Banner" },
    { id: "vision", label: "Vision & Goals"},
    { id: "story", label: "Our Story" },
    { id: "team", label: "Our Experts (Team)" },
    { id: "services", label: "What We Offer" },
    { id: "promise", label: "Our Promise"},
    { id: "cta", label: "CTA Banner"},
  ];

  return (
    <div style={{ fontFamily: "Georgia, serif", background: CREAM, minHeight: "100%", color: INK }}>
      {/* Toast notifications */}
      {notification && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 20px",
          borderRadius: 8,
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          border: notification.type === "success" ? "1px solid #d1ebd1" : "1px solid #fbdad0",
          background: notification.type === "success" ? "#f4fff4" : "#fff5f4",
          color: notification.type === "success" ? "#2e7d32" : "#c62828",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{notification.message}</span>
        </div>
      )}

      {/* Header and description matching other admin pages */}
      <div style={{ padding: "0 0 18px", borderBottom: "1.5px solid #eae5d8", marginBottom: 20 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
              About Us Management
            </h2>
            <p style={{ margin: "6px 0 0", color: MUTED, fontSize: 14 }}>
              Configure headers, narratives, core goals, services, team members, and graphics for your About page.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <Loader2 size={32} className="animate-spin text-[#5c6a42] mb-3" />
          <p className="text-sm font-medium">Loading layout configuration files...</p>
        </div>
      ) : (
        /* Workspace grid matching other pages but showing sidebar tabs */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* Tab Button Panel */}
          <div className="space-y-1.5">
            <span style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: MUTED, letterSpacing: 0.6, paddingLeft: 8, marginBottom: 8 }}>
              Standard Sections
            </span>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setOpenListIdx(null);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1px solid ${isActive ? OLIVE_DARK : "#eae5d8"}`,
                    background: isActive ? OLIVE_DARK : "#fff",
                    color: isActive ? "#fff" : INK,
                    fontWeight: 600,
                    fontSize: 12.5,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span className="text-sm">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}

            {/* Dynamic Custom Sections Tabs Category */}
            {dynamicTabs.length > 0 && (
              <>
                <div style={{ height: 8 }} />
                <span style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: MUTED, letterSpacing: 0.6, paddingLeft: 8, marginBottom: 8 }}>
                  Custom Blocks
                </span>
                {dynamicTabs.map((dt) => {
                  const isActive = activeTab === dt.id;
                  return (
                    <button
                      key={dt.id}
                      onClick={() => {
                        setActiveTab(dt.id);
                        setOpenListIdx(null);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: `1px solid ${isActive ? OLIVE_DARK : "#eae5d8"}`,
                        background: isActive ? OLIVE_DARK : "#fff",
                        color: isActive ? "#fff" : INK,
                        fontWeight: 600,
                        fontSize: 12.5,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {dt.label}
                    </button>
                  );
                })}
              </>
            )}

            {/* Add section action button */}
            <div style={{ height: 12 }} />
            <button
              onClick={() => setIsAddSectionModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: `2px dashed ${OLIVE_DARK}`,
                background: "none",
                color: OLIVE_DARK,
                fontWeight: 700,
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              <Plus size={14} /> Add New Page Section
            </button>

            {/* Preview link */}
            <div style={{ height: 16 }} />
            <button
              onClick={() => {
                setActiveTab("preview");
                setOpenListIdx(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${activeTab === "preview" ? OLIVE_DARK : "#eae5d8"}`,
                background: activeTab === "preview" ? OLIVE_DARK : "#fff",
                color: activeTab === "preview" ? "#fff" : INK,
                fontWeight: 600,
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              <span></span>
              Live Layout Preview
            </button>
          </div>

          {/* Configuration Form Workspace Panel */}
          <div className="md:col-span-3">
            
            {activeTab === "hero" && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: INK }}>Hero Banner Settings</h3>
                {renderSingleBlockForm(firstHero)}
              </div>
            )}

            {activeTab === "vision" && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: INK }}>Vision & Core Goals</h3>
                {renderListBlockForm(visionSections, "VISION_GOAL", "Vision & Goal")}
              </div>
            )}

            {activeTab === "story" && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: INK }}>Our Story Block</h3>
                {renderSingleBlockForm(firstStory)}
              </div>
            )}

            {activeTab === "team" && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: INK }}>Team Experts Directory</h3>
                {renderListBlockForm(teamSections, "TEAM_MEMBER", "Team Member")}
              </div>
            )}

            {activeTab === "services" && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: INK }}>Custom Service Cards</h3>
                {renderListBlockForm(serviceSections, "SERVICE_CARD", "Service Card")}
              </div>
            )}

            {activeTab === "promise" && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: INK }}>Our Promise Block</h3>
                {renderSingleBlockForm(firstPromise)}
              </div>
            )}

            {activeTab === "cta" && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: INK }}>CTA Call to Action</h3>
                {renderSingleBlockForm(firstCta)}
              </div>
            )}

            {/* Render any dynamic tabs content workspace */}
            {dynamicTabs.map((dt) => {
              if (activeTab !== dt.id) return null;
              return (
                <div key={dt.id}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: INK }}>
                    Custom Block Settings ({dt.section.layoutType})
                  </h3>
                  {renderSingleBlockForm(dt.section, true, dt.id)}
                </div>
              );
            })}

            {activeTab === "preview" && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: INK }}>Live Content Simulator</h3>
                <div style={{ background: "#fff", border: "1px solid #e5e0d0", borderRadius: 12, padding: 18 }}>
                  {sections.length === 0 ? (
                    <div style={{ fontSize: 13, fontStyle: "italic", color: MUTED }}>No dynamic content sections found.</div>
                  ) : (
                    renderPreviewGroups()
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Choose Layout Type Modal for adding section blocks */}
      {isAddSectionModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: 20,
        }} onClick={() => setIsAddSectionModalOpen(false)}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            maxWidth: 520,
            width: "100%",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
            border: "1px solid #eae5d8",
            overflow: "hidden"
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ padding: 14, background: "#f7f5ec", borderBottom: "1.5px solid #eae5d8" }} className="flex justify-between items-center">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: INK }}>Add New Page Section Block</h3>
              <button
                onClick={() => setIsAddSectionModalOpen(false)}
                style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div style={{ padding: 16 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADDABLE_PAGE_LAYOUTS.map((lay) => (
                <button
                  key={lay.id}
                  onClick={() => handleCreateNewSection(lay.id)}
                  style={{
                    border: "1px solid #ddd8c8",
                    borderRadius: 10,
                    padding: 12,
                    background: "#fbfaf6",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = OLIVE_DARK;
                    e.currentTarget.style.background = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#ddd8c8";
                    e.currentTarget.style.background = "#fbfaf6";
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: INK }}>{lay.name}</h4>
                  <p style={{ margin: "4px 0 0", fontSize: 10.5, color: MUTED, lineHeight: 1.4 }}>{lay.desc}</p>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
