import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";

extend([namesPlugin]);

export const resolveColor = (name: string): string => {
  if (!name) return "#e5e7eb"; // neutral gray

  const normalized = name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .trim();

  const color = colord(normalized);

  return color.isValid() ? color.toHex() : "#e5e7eb";
};
