import { useEffect, useMemo, useRef, useState } from "react";
import { getIconItems, ICON_PROVIDER_TABS, renderIconById, type IconProvider } from "./iconHub";

interface Props {
  onSelect: (iconId: string) => void;
  onClose: () => void;
}

export default function IconPickerPopover({ onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(Date.now());
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<IconProvider>("huge");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (Date.now() - mountedAt.current < 100) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = useMemo(() => getIconItems(provider), [provider]);
  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter((i) => i.label.includes(q) || i.id.includes(q));
  }, [q, items]);
  const MAX_RENDER = q ? 1200 : 480;
  const shown = filtered.slice(0, MAX_RENDER);

  return (
    <div
      ref={ref}
      style={{
        width: 320,
        maxHeight: 380,
        background: "#fff",
        border: "1px solid #E2E8DE",
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,.18)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", gap: 6, padding: "8px 10px", borderBottom: "1px solid #E2E8DE", background: "#FAFAF8", flexWrap: "wrap" }}>
        {ICON_PROVIDER_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setProvider(t.id); setQuery(""); }}
            style={{
              border: provider === t.id ? "1px solid #6B7F5E" : "1px solid #E2E8DE",
              background: provider === t.id ? "#EEF3EB" : "#fff",
              color: "#2C2C2C",
              borderRadius: 999,
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: provider === t.id ? 700 : 600,
            }}
            title={t.countHint ? `${t.countHint} icons` : undefined}
          >
            {t.label}{t.countHint ? ` · ${t.countHint}` : ""}
          </button>
        ))}
      </div>
      <div style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8DE" }}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Search icons..."
          style={{
            width: "100%",
            border: "1px solid #E2E8DE",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <div style={{ marginTop: 6, fontSize: 11, color: "#7A7A7A" }}>
          {filtered.length > MAX_RENDER ? `Showing ${MAX_RENDER} of ${filtered.length}. Type more to narrow.` : `${filtered.length} icons`}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: 8,
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 2,
        }}
      >
        {shown.map((item) => (
          <button
            key={item.id}
            title={item.id}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(item.id);
            }}
            style={{
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: 6,
              background: "transparent",
              cursor: "pointer",
              color: "#2C2C2C",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#EEF3EB"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            <span style={{ display: "inline-flex", width: 18, height: 18, alignItems: "center", justifyContent: "center" }}>
              {renderIconById(item.id, { sizePx: 18, color: "currentColor" })}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#7A7A7A", fontSize: 12, padding: 20 }}>
            No icons found
          </p>
        )}
      </div>
    </div>
  );
}
