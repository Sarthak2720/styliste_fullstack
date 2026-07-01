import { useEffect, useState, useCallback } from "react";

type ThemeType = "light" | "dark";

export const useVisibleSectionTheme = (): ThemeType => {
  const [theme, setTheme] = useState<ThemeType>("light");

  // Helper function to parse RGB string
  const parseRgb = (rgbString: string): [number, number, number] | null => {
    // Match both rgb() and rgba() formats
    const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  };

  // Helper function to determine luminance (0-1)
  const getLuminance = (rgb: [number, number, number]): number => {
    const [r, g, b] = rgb;
    // Using relative luminance formula from WCAG
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Check if a color is dark
  const isDarkColor = (rgbString: string): boolean => {
    const rgb = parseRgb(rgbString);
    if (!rgb) return false;
    const luminance = getLuminance(rgb);
    return luminance < 0.4; // Tuned threshold for sage detection
  };

  // Get the element's theme based on background
  const getElementTheme = useCallback((element: Element): ThemeType => {
    let el: Element | null = element;
    
    // Walk up the tree to find the element with actual background color
    while (el && el !== document.body) {
      const computed = window.getComputedStyle(el);
      const bgColor = computed.backgroundColor;

      // Skip transparent backgrounds
      if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
        el = el.parentElement;
        continue;
      }

      // Check if background is dark
      if (isDarkColor(bgColor)) {
        return "dark";
      }

      // If we found a non-transparent background that's light, return light
      if (bgColor.includes("rgb")) {
        return "light";
      }

      el = el.parentElement;
    }

    return "light";
  }, []);

  // Check viewport center color periodically
  const checkViewportCenter = useCallback(() => {
    // Get center of viewport
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Get element at center of viewport
    const elementAtCenter = document.elementFromPoint(centerX, centerY);
    
    if (elementAtCenter) {
      const detectedTheme = getElementTheme(elementAtCenter);
      setTheme(detectedTheme);
    }
  }, [getElementTheme]);

  useEffect(() => {
    // Check on mount
    checkViewportCenter();

    // Listen to scroll events
    window.addEventListener("scroll", checkViewportCenter, { passive: true });
    window.addEventListener("resize", checkViewportCenter, { passive: true });

    // Also check periodically for dynamic content
    const interval = setInterval(checkViewportCenter, 500);

    return () => {
      window.removeEventListener("scroll", checkViewportCenter);
      window.removeEventListener("resize", checkViewportCenter);
      clearInterval(interval);
    };
  }, [checkViewportCenter]);

  return theme;
};
