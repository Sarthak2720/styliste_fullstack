// @ts-nocheck
import { useEffect, useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import "./rich-text.css";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extension-placeholder";
import EmojiPickerPopover from "./EmojiPickerPopover";
import IconPickerPopover from "./IconPickerPopover";
import InlineIconNode from "./InlineIconExtension";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered,
  Smile, Shapes, Highlighter, Type, Undo2, Redo2, Palette, Maximize2,
} from "lucide-react";
 
const sage = "#6B7F5E";
const borderClr = "#E2E8DE";
const ICON_SIZES = [
  { label: "XS", value: "0.8em" },
  { label: "S", value: "1em" },
  { label: "M", value: "1.4em" },
  { label: "L", value: "1.8em" },
  { label: "XL", value: "2.4em" },
  { label: "2XL", value: "3em" },
  { label: "3XL", value: "4em" },
];
 
const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px"];
 
const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Georgia (Serif)", value: "Georgia, serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Palatino", value: "Palatino Linotype, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, sans-serif" },
  { label: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Segoe UI", value: "Segoe UI, sans-serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Open Sans", value: "Open Sans, sans-serif" },
  { label: "Lato", value: "Lato, sans-serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Courier New", value: "Courier New, monospace" },
  { label: "Consolas", value: "Consolas, monospace" },
  { label: "Comic Sans MS", value: "Comic Sans MS, cursive" },
  { label: "Brush Script", value: "Brush Script MT, cursive" },
];
 
function getSelectedIconNode(editor) {
  if (!editor) return null;
  const { state } = editor;
  const { selection } = state;
  if (selection.node && selection.node.type.name === "inlineIcon") {
    return { node: selection.node, pos: selection.from };
  }
  const { $from } = selection;
  if ($from.parent?.type?.name === "inlineIcon") {
    return { node: $from.parent, pos: $from.before() };
  }
  const nodeAfter = $from.nodeAfter;
  if (nodeAfter?.type?.name === "inlineIcon") {
    return { node: nodeAfter, pos: $from.pos };
  }
  return null;
}
 
interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}
 
export default function RichTextField({ value, onChange, placeholder = "Start writing...", minHeight = 80 }: Props) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [tick, setTick] = useState(0);
  const suppressUpdate = useRef(false);
 
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      TextStyleKit.configure({ backgroundColor: false, lineHeight: false }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"], alignments: ['left', 'center', 'right', 'justify'] }),
      Placeholder.configure({ placeholder }),
      InlineIconNode,
    ],
    content: value || "",
    onUpdate: ({ editor: ed }) => {
      if (suppressUpdate.current) return;
      onChange(ed.getHTML());
      setTick((t) => t + 1);
    },
    onSelectionUpdate: () => setTick((t) => t + 1),
  });
 
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      suppressUpdate.current = true;
      editor.commands.setContent(value || "", false);
      suppressUpdate.current = false;
    }
  }, [value, editor]);
 
  const insertEmoji = useCallback((emoji: string) => {
    editor?.chain().focus().insertContent(emoji).run();
  }, [editor]);
 
  const insertIcon = useCallback((iconName: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(`<span data-icon="${iconName}"></span>`).run();
  }, [editor]);
 
  const updateSelectedIconAttr = useCallback((attrKey: string, attrValue: string) => {
    if (!editor) return;
    const sel = getSelectedIconNode(editor);
    if (!sel) return;
    const { tr } = editor.state;
    tr.setNodeMarkup(sel.pos, undefined, { ...sel.node.attrs, [attrKey]: attrValue });
    editor.view.dispatch(tr);
    setTick((t) => t + 1);
  }, [editor]);
 
  if (!editor) return null;
 
  const active = (name, attrs) => { try { return editor.isActive(name, attrs); } catch { return false; } };
  const attr = (mark, key) => { try { return editor.getAttributes(mark)?.[key] || ""; } catch { return ""; } };
  const run = (fn) => () => fn();
  const selectedIcon = getSelectedIconNode(editor);
 
  const Btn = ({ on, click, children, title }) => (
    <button
      type="button"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); click(); }}
      title={title}
      style={{
        width: 28, height: 28,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        border: "none", borderRadius: 5,
        background: on ? `${sage}22` : "transparent",
        color: on ? sage : "#555",
        cursor: "pointer", flexShrink: 0,
      }}
    >{children}</button>
  );
 
  const Sep = () => <div style={{ width: 1, height: 20, background: borderClr, margin: "0 3px" }} />;
 
  return (
    <div style={{ border: `1px solid ${borderClr}`, borderRadius: 10, background: "#fff", position: "relative" }}>
      {/* Main Toolbar */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2,
        padding: "5px 6px", borderBottom: `1px solid ${borderClr}`,
        background: "#FAFAF8", borderRadius: selectedIcon ? "10px 10px 0 0" : "10px 10px 0 0",
      }}>
        <Btn click={run(() => editor.chain().focus().undo().run())} title="Undo"><Undo2 size={14} /></Btn>
        <Btn click={run(() => editor.chain().focus().redo().run())} title="Redo"><Redo2 size={14} /></Btn>
        <Sep />
        <Btn on={active("bold")} click={run(() => editor.chain().focus().toggleBold().run())} title="Bold"><Bold size={14} /></Btn>
        <Btn on={active("italic")} click={run(() => editor.chain().focus().toggleItalic().run())} title="Italic"><Italic size={14} /></Btn>
        <Btn on={active("underline")} click={run(() => editor.chain().focus().toggleUnderline().run())} title="Underline"><UnderlineIcon size={14} /></Btn>
        <Btn on={active("strike")} click={run(() => editor.chain().focus().toggleStrike().run())} title="Strikethrough"><Strikethrough size={14} /></Btn>
        <Sep />
        <select value={attr("textStyle", "fontFamily")} onChange={(e) => { if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run(); else editor.chain().focus().unsetFontFamily().run(); }} title="Font family" style={{ height: 26, border: `1px solid ${borderClr}`, borderRadius: 5, fontSize: 11, padding: "0 4px", outline: "none", cursor: "pointer", maxWidth: 130 }}>
          {FONT_FAMILIES.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
        </select>
        <select value={attr("textStyle", "fontSize")} onChange={(e) => { if (e.target.value) editor.chain().focus().setFontSize(e.target.value).run(); else editor.chain().focus().unsetFontSize().run(); }} title="Font size" style={{ height: 26, border: `1px solid ${borderClr}`, borderRadius: 5, fontSize: 11, padding: "0 4px", outline: "none", cursor: "pointer", width: 56 }}>
          <option value="">Size</option>
          {FONT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <Sep />
        <div style={{ position: "relative", width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center" }} title="Text color">
          <Type size={14} style={{ color: attr("textStyle", "color") || "#000" }} />
          <input type="color" value={attr("textStyle", "color") || "#000000"} onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
        </div>
        <div style={{ position: "relative", width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center" }} title="Highlight">
          <Highlighter size={14} style={{ color: active("highlight") ? sage : "#555" }} />
          <input type="color" value="#FFFF00" onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
        </div>
        <Sep />
        <Btn on={active("paragraph", { textAlign: "left" })} click={run(() => editor.chain().focus().setTextAlign("left").run())} title="Left"><AlignLeft size={14} /></Btn>
        <Btn on={active("paragraph", { textAlign: "center" })} click={run(() => editor.chain().focus().setTextAlign("center").run())} title="Center"><AlignCenter size={14} /></Btn>
        <Btn on={active("paragraph", { textAlign: "right" })} click={run(() => editor.chain().focus().setTextAlign("right").run())} title="Right"><AlignRight size={14} /></Btn>
        <Btn on={active("paragraph", { textAlign: "justify" })} click={run(() => editor.chain().focus().setTextAlign("justify").run())} title="Justify"><AlignJustify size={14} /></Btn>
        <Sep />
        <Btn on={active("bulletList")} click={run(() => editor.chain().focus().toggleBulletList().run())} title="Bullet list"><List size={14} /></Btn>
        <Btn on={active("orderedList")} click={run(() => editor.chain().focus().toggleOrderedList().run())} title="Ordered list"><ListOrdered size={14} /></Btn>
        <Sep />
        <Btn on={showEmoji} click={() => { setShowIcons(false); setShowEmoji((p) => !p); }} title="Emoji"><Smile size={14} /></Btn>
        <Btn on={showIcons} click={() => { setShowEmoji(false); setShowIcons((p) => !p); }} title="Insert icon"><Shapes size={14} /></Btn>
      </div>
 
      {/* Icon controls toolbar (shown when an icon node is selected) */}
      {selectedIcon && (
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
          padding: "6px 10px", borderBottom: `1px solid ${borderClr}`,
          background: "#EEF3EB",
        }}>
          <Shapes size={13} style={{ color: sage }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: sage, marginRight: 4 }}>Icon: {selectedIcon.node.attrs.iconName}</span>
          <Sep />
 
          {/* Icon color */}
          <Palette size={13} style={{ color: "#555" }} />
          <div style={{ position: "relative", width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center" }} title="Icon color">
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: selectedIcon.node.attrs.iconColor || sage, border: "1px solid #ccc" }} />
            <input
              type="color"
              value={selectedIcon.node.attrs.iconColor || sage}
              onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => updateSelectedIconAttr("iconColor", e.target.value)}
              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
            />
          </div>
          <Sep />
 
          {/* Icon size */}
          <Maximize2 size={13} style={{ color: "#555" }} />
          {ICON_SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateSelectedIconAttr("iconSize", s.value); }}
              style={{
                border: selectedIcon.node.attrs.iconSize === s.value ? `1px solid ${sage}` : `1px solid ${borderClr}`,
                background: selectedIcon.node.attrs.iconSize === s.value ? `${sage}22` : "#fff",
                borderRadius: 4,
                padding: "2px 6px",
                fontSize: 10,
                cursor: "pointer",
                color: "#2C2C2C",
                fontWeight: selectedIcon.node.attrs.iconSize === s.value ? 700 : 400,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
 
      {/* Popovers */}
      {showEmoji && (
        <div style={{ position: "absolute", zIndex: 700, top: 42, left: 0 }}>
          <EmojiPickerPopover onSelect={(emoji) => { insertEmoji(emoji); setShowEmoji(false); }} onClose={() => setShowEmoji(false)} />
        </div>
      )}
      {showIcons && (
        <div style={{ position: "absolute", zIndex: 700, top: 42, left: 0 }}>
          <IconPickerPopover onSelect={(iconName) => { insertIcon(iconName); setShowIcons(false); }} onClose={() => setShowIcons(false)} />
        </div>
      )}
 
      {/* Editor */}
      <div style={{ padding: "8px 12px", minHeight, cursor: "text" }} onClick={() => { if (!editor.isFocused) editor.chain().focus().run(); }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
 
 