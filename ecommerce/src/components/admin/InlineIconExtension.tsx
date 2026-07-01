// @ts-nocheck
import { Node, mergeAttributes } from "@tiptap/react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { cssSizeToPx, normalizeIconId, renderIconById } from "./iconHub";

function InlineIconView({ node, selected }) {
  const iconNameRaw = node.attrs.iconName || "";
  const iconId = normalizeIconId(iconNameRaw);
  const iconSize = node.attrs.iconSize || "1em";
  const iconColor = node.attrs.iconColor || "#6B7F5E";
  const sizePx = cssSizeToPx(iconSize, 16);

  return (
    <NodeViewWrapper
      as="span"
      style={{
        display: "inline-flex",
        verticalAlign: "middle",
        alignItems: "center",
        justifyContent: "center",
        width: iconSize,
        height: iconSize,
        margin: "0 2px",
        color: iconColor,
        lineHeight: 1,
        outline: selected ? "2px solid #6B7F5E" : "none",
        outlineOffset: 1,
        borderRadius: 3,
        cursor: "pointer",
      }}
    >
      {renderIconById(iconId, { sizePx, color: "currentColor" }) || <span title={iconId}>⬡</span>}
    </NodeViewWrapper>
  );
}

const InlineIconNode = Node.create({
  name: "inlineIcon",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      iconName: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-icon") || "",
        renderHTML: (attributes) => {
          if (!attributes.iconName) return {};
          return { "data-icon": attributes.iconName };
        },
      },
      iconSize: {
        default: "1em",
        parseHTML: (element) => element.getAttribute("data-icon-size") || "1em",
        renderHTML: (attributes) => ({ "data-icon-size": attributes.iconSize || "1em" }),
      },
      iconColor: {
        default: "#6B7F5E",
        parseHTML: (element) => element.getAttribute("data-icon-color") || "#6B7F5E",
        renderHTML: (attributes) => ({ "data-icon-color": attributes.iconColor || "#6B7F5E" }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-icon]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const size = HTMLAttributes["data-icon-size"] || "1em";
    const color = HTMLAttributes["data-icon-color"] || "#6B7F5E";
    return ["span", mergeAttributes(HTMLAttributes, {
      style: `display:inline-flex;vertical-align:middle;width:${size};height:${size};margin:0 2px;color:${color}`,
      contenteditable: "false",
    })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InlineIconView);
  },
});

export default InlineIconNode;
