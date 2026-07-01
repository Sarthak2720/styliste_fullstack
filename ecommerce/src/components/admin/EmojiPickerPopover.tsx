import { useEffect, useRef } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

interface Props {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPickerPopover({ onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (Date.now() - mountedAt.current < 200) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        boxShadow: "0 8px 30px rgba(0,0,0,.18)",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <EmojiPicker
        onEmojiClick={(data: EmojiClickData) => {
          onSelect(data.emoji);
        }}
        width={320}
        height={380}
        searchPlaceholder="Search emoji..."
        previewConfig={{ showPreview: false }}
      />
    </div>
  );
}
