import { createElement, type ComponentType, type ReactElement } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import * as HugeFree from "@hugeicons/core-free-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FaSolid from "@fortawesome/free-solid-svg-icons";
import * as FaRegular from "@fortawesome/free-regular-svg-icons";
import * as FaBrands from "@fortawesome/free-brands-svg-icons";
import {
  Scissors, Leaf, Heart, Star, Sparkles, Crown, Shirt, Gem, Flower2,
  Sun, Moon, CloudSun, Flame, Droplets, Wind, Feather, Palette, Brush,
  PenTool, Ruler, Target, Award, Trophy, Medal, Gift, ShoppingBag,
  Watch, Glasses, Umbrella, Camera, Image, Film, Music, BookOpen,
  FileText, Mail, Phone, MapPin, Home, Building2, Globe, Plane,
  Car, Bike, Anchor, Rocket, Lightbulb, Zap, Battery, Wifi,
  CheckCircle2, XCircle, AlertTriangle, Info, HelpCircle, Bell,
  Clock, Calendar, Tag, Bookmark, Link, ExternalLink, Search,
  Eye, EyeOff, Lock, Unlock, Shield, Key, User, Users,
  ThumbsUp, ThumbsDown, MessageCircle, Share2, Send, Download,
  Upload, RefreshCw, RotateCw, ArrowRight, ArrowUp, TrendingUp,
  BarChart3, PieChart, Activity, Percent,
} from "lucide-react";

export type IconProvider = "huge" | "fa" | "lucide";

export interface IconItem {
  id: string; // stored in data-icon
  label: string; // used for search UI
  provider: IconProvider;
}

type LucideEntry = { name: string; Icon: ComponentType<{ size?: number; className?: string; color?: string }> };
const LUCIDE: LucideEntry[] = [
  { name: "scissors", Icon: Scissors }, { name: "leaf", Icon: Leaf }, { name: "heart", Icon: Heart },
  { name: "star", Icon: Star }, { name: "sparkles", Icon: Sparkles }, { name: "crown", Icon: Crown },
  { name: "shirt", Icon: Shirt }, { name: "gem", Icon: Gem }, { name: "flower", Icon: Flower2 },
  { name: "sun", Icon: Sun }, { name: "moon", Icon: Moon }, { name: "cloud-sun", Icon: CloudSun },
  { name: "flame", Icon: Flame }, { name: "droplets", Icon: Droplets }, { name: "wind", Icon: Wind },
  { name: "feather", Icon: Feather }, { name: "palette", Icon: Palette }, { name: "brush", Icon: Brush },
  { name: "pen-tool", Icon: PenTool }, { name: "ruler", Icon: Ruler }, { name: "target", Icon: Target },
  { name: "award", Icon: Award }, { name: "trophy", Icon: Trophy }, { name: "medal", Icon: Medal },
  { name: "gift", Icon: Gift }, { name: "shopping-bag", Icon: ShoppingBag }, { name: "watch", Icon: Watch },
  { name: "glasses", Icon: Glasses }, { name: "umbrella", Icon: Umbrella }, { name: "camera", Icon: Camera },
  { name: "image", Icon: Image }, { name: "film", Icon: Film }, { name: "music", Icon: Music },
  { name: "book-open", Icon: BookOpen }, { name: "file-text", Icon: FileText }, { name: "mail", Icon: Mail },
  { name: "phone", Icon: Phone }, { name: "map-pin", Icon: MapPin }, { name: "home", Icon: Home },
  { name: "building", Icon: Building2 }, { name: "globe", Icon: Globe }, { name: "plane", Icon: Plane },
  { name: "car", Icon: Car }, { name: "bike", Icon: Bike }, { name: "anchor", Icon: Anchor },
  { name: "rocket", Icon: Rocket }, { name: "lightbulb", Icon: Lightbulb }, { name: "zap", Icon: Zap },
  { name: "battery", Icon: Battery }, { name: "wifi", Icon: Wifi }, { name: "check-circle", Icon: CheckCircle2 },
  { name: "x-circle", Icon: XCircle }, { name: "alert", Icon: AlertTriangle }, { name: "info", Icon: Info },
  { name: "help", Icon: HelpCircle }, { name: "bell", Icon: Bell }, { name: "clock", Icon: Clock },
  { name: "calendar", Icon: Calendar }, { name: "tag", Icon: Tag }, { name: "bookmark", Icon: Bookmark },
  { name: "link", Icon: Link }, { name: "external-link", Icon: ExternalLink }, { name: "search", Icon: Search },
  { name: "eye", Icon: Eye }, { name: "eye-off", Icon: EyeOff }, { name: "lock", Icon: Lock },
  { name: "unlock", Icon: Unlock }, { name: "shield", Icon: Shield }, { name: "key", Icon: Key },
  { name: "user", Icon: User }, { name: "users", Icon: Users }, { name: "thumbs-up", Icon: ThumbsUp },
  { name: "thumbs-down", Icon: ThumbsDown }, { name: "message", Icon: MessageCircle }, { name: "share", Icon: Share2 },
  { name: "send", Icon: Send }, { name: "download", Icon: Download }, { name: "upload", Icon: Upload },
  { name: "refresh", Icon: RefreshCw }, { name: "rotate", Icon: RotateCw }, { name: "arrow-right", Icon: ArrowRight },
  { name: "arrow-up", Icon: ArrowUp }, { name: "trending-up", Icon: TrendingUp }, { name: "bar-chart", Icon: BarChart3 },
  { name: "pie-chart", Icon: PieChart }, { name: "activity", Icon: Activity }, { name: "percent", Icon: Percent },
];

const LUCIDE_MAP: Record<string, ComponentType<any>> = Object.fromEntries(LUCIDE.map((i) => [i.name, i.Icon]));

function wordsFromKebab(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
function wordsFromCamel(s: string) {
  return s
    .replace(/Icon$/, "")
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function normalizeIconId(raw: string | null | undefined): string {
  const v = (raw || "").trim();
  if (!v) return "";
  if (v.includes(":")) return v;
  // Back-compat: older content stored only lucide name (e.g. "star")
  return `lucide:${v}`;
}

export function cssSizeToPx(size: string | null | undefined, basePx = 16): number {
  const v = (size || "").trim();
  if (!v) return basePx;
  const n = Number.parseFloat(v);
  if (!Number.isFinite(n)) return basePx;
  if (v.endsWith("px")) return Math.max(1, Math.round(n));
  if (v.endsWith("rem")) return Math.max(1, Math.round(n * basePx));
  if (v.endsWith("em")) return Math.max(1, Math.round(n * basePx));
  // fallback (number-like)
  return Math.max(1, Math.round(n));
}

type FaDef = any;
function isFaDef(v: any): v is FaDef {
  return v && typeof v === "object" && typeof v.prefix === "string" && typeof v.iconName === "string" && Array.isArray(v.icon);
}

function faPackToItems(mod: any, style: "solid" | "regular" | "brands") {
  const out: { items: IconItem[]; map: Record<string, FaDef> } = { items: [], map: {} };
  for (const [, val] of Object.entries(mod)) {
    if (!isFaDef(val)) continue;
    const id = `fa:${style}:${val.iconName}`;
    out.items.push({ id, label: `fa ${style} ${val.iconName}`.replace(/-/g, " "), provider: "fa" });
    out.map[id] = val;
  }
  // stable-ish ordering
  out.items.sort((a, b) => a.label.localeCompare(b.label));
  return out;
}

const faSolid = faPackToItems(FaSolid, "solid");
const faRegular = faPackToItems(FaRegular, "regular");
const faBrands = faPackToItems(FaBrands, "brands");
const FA_MAP: Record<string, FaDef> = { ...faSolid.map, ...faRegular.map, ...faBrands.map };

function hugePackToItems(mod: any) {
  const items: IconItem[] = [];
  const map: Record<string, any> = {};
  for (const [key, val] of Object.entries(mod)) {
    if (!key.endsWith("Icon")) continue;
    if (!val || typeof val !== "object") continue;
    const id = `huge:${key}`;
    items.push({ id, label: `huge ${wordsFromCamel(key)}`.toLowerCase(), provider: "huge" });
    map[id] = val;
  }
  items.sort((a, b) => a.label.localeCompare(b.label));
  return { items, map };
}

const hugeFree = hugePackToItems(HugeFree);
const HUGE_MAP: Record<string, any> = hugeFree.map;

const LUCIDE_ITEMS: IconItem[] = LUCIDE.map((i) => ({ id: `lucide:${i.name}`, label: `lucide ${wordsFromKebab(i.name)}`.toLowerCase(), provider: "lucide" }));

export const ICON_PROVIDER_TABS: { id: IconProvider; label: string; countHint?: string }[] = [
  { id: "huge", label: "Hugeicons (Free)", countHint: `${hugeFree.items.length}` },
  { id: "fa", label: "Font Awesome (Free)", countHint: `${faSolid.items.length + faRegular.items.length + faBrands.items.length}` },
  { id: "lucide", label: "Lucide", countHint: `${LUCIDE_ITEMS.length}` },
];

export function getIconItems(provider: IconProvider): IconItem[] {
  if (provider === "huge") return hugeFree.items;
  if (provider === "fa") return [...faSolid.items, ...faRegular.items, ...faBrands.items];
  return LUCIDE_ITEMS;
}

export function renderIconById(rawId: string, opts: { sizePx: number; color?: string; className?: string; style?: any }): ReactElement | null {
  const id = normalizeIconId(rawId);
  if (!id) return null;
  const [provider] = id.split(":", 1) as [IconProvider];
  const color = opts.color || "currentColor";
  const style = opts.style || {};
  const className = opts.className;

  if (provider === "fa") {
    const def = FA_MAP[id];
    if (!def) return null;
    return createElement(FontAwesomeIcon as any, { icon: def, color, className, style: { width: "100%", height: "100%", ...style } });
  }
  if (provider === "huge") {
    const def = HUGE_MAP[id];
    if (!def) return null;
    return createElement(HugeiconsIcon as any, { icon: def, size: opts.sizePx, color, className, style: { width: "100%", height: "100%", overflow: "visible", ...style } });
  }
  // lucide
  const name = id.slice("lucide:".length);
  const Comp = LUCIDE_MAP[name] as any;
  if (!Comp) return null;
  return createElement(Comp, { size: opts.sizePx, color, className, style: { width: "100%", height: "100%", ...style } });
}

