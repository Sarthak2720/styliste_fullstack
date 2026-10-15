import { useEffect, useRef } from "react";
import EmojiPicker, { type EmojiClickData, EmojiStyle } from "emoji-picker-react";

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
        boxShadow: "0 12px 35px rgba(0,0,0,.22)",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        zIndex: 9999,
      }}
    >
      <EmojiPicker
        onEmojiClick={(data: EmojiClickData) => {
          onSelect(data.emoji);
        }}
        emojiStyle={EmojiStyle.NATIVE}
        width={320}
        height={380}
        searchPlaceholder="Search emoji..."
        previewConfig={{ showPreview: false }}
        lazyLoadEmojis={true}
      />
    </div>
  );
}
