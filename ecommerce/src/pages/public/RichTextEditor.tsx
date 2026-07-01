import React, { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Highlighter,
  ImagePlus,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Palette,
  Redo2,
  Smile,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type ListMode = "none" | "ul" | "ol";
type AlignMode = "left" | "center" | "right" | "justify";

const FONT_OPTIONS = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
  "Courier New",
];

const SIZE_OPTIONS = [
  { label: "10", value: "1" },
  { label: "12", value: "2" },
  { label: "14", value: "3" },
  { label: "16", value: "4" },
  { label: "18", value: "5" },
  { label: "24", value: "6" },
  { label: "32", value: "7" },
];

const DEFAULT_STATE = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  superscript: false,
  subscript: false,
  list: "none" as ListMode,
  align: "left" as AlignMode,
  fontSize: "4",
  fontName: "Arial",
};

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Enter description...",
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState(DEFAULT_STATE);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const syncHtml = () => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  };

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    setTimeout(() => {
      syncHtml();
      updateActiveFormats();
    }, 0);
  };

  const handleInput = () => {
    syncHtml();
    updateActiveFormats();
  };

  const formatBlock = (tag: string) => {
    const valueTag = tag === "p" ? "<p>" : `<${tag}>`;
    runCommand("formatBlock", valueTag);
  };

  const formatFontName = (fontName: string) => {
    runCommand("fontName", fontName);
  };

  const formatFontSize = (size: string) => {
    runCommand("fontSize", size);
  };

  const setTextColor = () => {
    const color = window.prompt("Enter text color (name or hex):", "#111111");
    if (color) runCommand("foreColor", color);
  };

  const setHighlightColor = () => {
    const color = window.prompt("Enter highlight color (name or hex):", "#FFF3A3");
    if (color) runCommand("backColor", color);
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL:", "https://");
    if (url) runCommand("createLink", url);
  };

  const insertEmoji = () => {
    const emoji = window.prompt("Enter emoji:", "😊");
    if (emoji) runCommand("insertText", emoji);
  };

  const insertImage = () => {
    const imageUrl = window.prompt("Enter image URL:", "https://");
    if (imageUrl) runCommand("insertImage", imageUrl);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) runCommand("outdent");
      else runCommand("indent");
    }
  };

  const updateActiveFormats = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const anchorNode = selection.anchorNode;
    if (anchorNode && !editorRef.current.contains(anchorNode)) return;

    try {
      const isOrdered = document.queryCommandState("insertOrderedList");
      const isUnordered = document.queryCommandState("insertUnorderedList");
      const isCenter = document.queryCommandState("justifyCenter");
      const isRight = document.queryCommandState("justifyRight");
      const isJustify = document.queryCommandState("justifyFull");

      const queriedFont = String(document.queryCommandValue("fontName") || "Arial")
        .replace(/"/g, "")
        .split(",")[0]
        .trim();
      const queriedSize = String(document.queryCommandValue("fontSize") || "4");

      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough"),
        superscript: document.queryCommandState("superscript"),
        subscript: document.queryCommandState("subscript"),
        list: isOrdered ? "ol" : isUnordered ? "ul" : "none",
        align: isCenter ? "center" : isRight ? "right" : isJustify ? "justify" : "left",
        fontSize: queriedSize,
        fontName: queriedFont || "Arial",
      });
    } catch {
      // Ignore browser command state errors.
    }
  };

  useEffect(() => {
    const onSelectionChange = () => updateActiveFormats();
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const buttonClass = (isActive = false) =>
    `p-2 rounded border ${
      isActive
        ? "bg-[#8FAE8B] text-white border-[#7f9f7b]"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
    }`;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
        <button type="button" onClick={() => runCommand("bold")} className={buttonClass(activeFormats.bold)} title="Bold">
          <Bold size={14} />
        </button>
        <button type="button" onClick={() => runCommand("italic")} className={buttonClass(activeFormats.italic)} title="Italic">
          <Italic size={14} />
        </button>
        <button type="button" onClick={() => runCommand("underline")} className={buttonClass(activeFormats.underline)} title="Underline">
          <Underline size={14} />
        </button>
        <button type="button" onClick={() => runCommand("strikeThrough")} className={buttonClass(activeFormats.strikeThrough)} title="Strikethrough">
          <Strikethrough size={14} />
        </button>
        <button type="button" onClick={() => runCommand("removeFormat")} className={buttonClass()} title="Clear formatting">
          <Eraser size={14} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button type="button" onClick={() => runCommand("superscript")} className={buttonClass(activeFormats.superscript)} title="Superscript">
          <Superscript size={14} />
        </button>
        <button type="button" onClick={() => runCommand("subscript")} className={buttonClass(activeFormats.subscript)} title="Subscript">
          <Subscript size={14} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <select
          value={activeFormats.fontName}
          onChange={(e) => formatFontName(e.target.value)}
          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
          title="Font family"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        <select
          value={activeFormats.fontSize}
          onChange={(e) => formatFontSize(e.target.value)}
          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
          title="Font size"
        >
          {SIZE_OPTIONS.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => formatBlock(e.target.value)}
          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
          title="Block style"
          defaultValue="p"
        >
          <option value="p">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Quote</option>
          <option value="pre">Code</option>
        </select>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button type="button" onClick={() => runCommand("insertUnorderedList")} className={buttonClass(activeFormats.list === "ul")} title="Bullet list">
          <List size={14} />
        </button>
        <button type="button" onClick={() => runCommand("insertOrderedList")} className={buttonClass(activeFormats.list === "ol")} title="Numbered list">
          <ListOrdered size={14} />
        </button>

        <button type="button" onClick={() => runCommand("justifyLeft")} className={buttonClass(activeFormats.align === "left")} title="Align left">
          <AlignLeft size={14} />
        </button>
        <button type="button" onClick={() => runCommand("justifyCenter")} className={buttonClass(activeFormats.align === "center")} title="Align center">
          <AlignCenter size={14} />
        </button>
        <button type="button" onClick={() => runCommand("justifyRight")} className={buttonClass(activeFormats.align === "right")} title="Align right">
          <AlignRight size={14} />
        </button>
        <button type="button" onClick={() => runCommand("justifyFull")} className={buttonClass(activeFormats.align === "justify")} title="Justify">
          <AlignJustify size={14} />
        </button>

        <button type="button" onClick={() => runCommand("outdent")} className={buttonClass()} title="Outdent">
          <IndentDecrease size={14} />
        </button>
        <button type="button" onClick={() => runCommand("indent")} className={buttonClass()} title="Indent">
          <IndentIncrease size={14} />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button type="button" onClick={setTextColor} className={buttonClass()} title="Text color">
          <Palette size={14} />
        </button>
        <button type="button" onClick={setHighlightColor} className={buttonClass()} title="Highlight color">
          <Highlighter size={14} />
        </button>

        <button type="button" onClick={insertLink} className={buttonClass()} title="Insert link">
          <Link2 size={14} />
        </button>
        <button type="button" onClick={() => runCommand("unlink")} className={buttonClass()} title="Remove link">
          <Link2Off size={14} />
        </button>

        <button type="button" onClick={insertEmoji} className={buttonClass()} title="Insert emoji">
          <Smile size={14} />
        </button>
        <button type="button" onClick={insertImage} className={buttonClass()} title="Insert image by URL">
          <ImagePlus size={14} />
        </button>

        <button type="button" onClick={() => runCommand("undo")} className={buttonClass()} title="Undo">
          <Undo2 size={14} />
        </button>
        <button type="button" onClick={() => runCommand("redo")} className={buttonClass()} title="Redo">
          <Redo2 size={14} />
        </button>
      </div>

      <div
        ref={editorRef}
        className="min-h-[150px] max-h-[300px] p-3 bg-white outline-none overflow-y-auto rich-text-editor"
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onClick={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        data-placeholder={placeholder}
        style={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          minWidth: "0",
        }}
      />
    </div>
  );
};

export default RichTextEditor;
