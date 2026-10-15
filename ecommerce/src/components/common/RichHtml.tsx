import React, { useRef, createElement } from "react";
import DOMPurify from "dompurify";
import { cssSizeToPx, normalizeIconId, renderIconById } from "../admin/iconHub";
import "../admin/rich-text.css";

function sanitize(html: string) {
  return DOMPurify.sanitize(html || "", {
    ADD_ATTR: ["data-icon", "data-icon-size", "data-icon-color", "contenteditable", "style"],
  });
}

interface RichHtmlProps {
  html: string;
  style?: React.CSSProperties;
  className?: string;
}

export const RichHtml: React.FC<RichHtmlProps> = ({ html, style, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  const resolveIcons = () => {
    if (!ref.current) return;
    ref.current.querySelectorAll("[data-icon]").forEach((elNode) => {
      const el = elNode as HTMLElement;
      const raw = el.getAttribute("data-icon");
      const iconId = normalizeIconId(raw);
      if (iconId && !el.dataset.resolved) {
        el.dataset.resolved = "1";
        const size = el.getAttribute("data-icon-size") || "1em";
        const color = el.getAttribute("data-icon-color") || "currentColor";
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
      ref={(node) => {
        ref.current = node;
        setTimeout(resolveIcons, 0);
      }}
      className={`${className || ""} rich-text-content`}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitize(html) }}
    />
  );
};

export default RichHtml;
