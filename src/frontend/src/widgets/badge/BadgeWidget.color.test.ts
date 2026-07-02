import type { CSSProperties } from "react";
import { describe, it, expect } from "vite-plus/test";
import { getColor } from "@/lib/styles";

/**
 * Mirrors the `color` prop merge in `BadgeWidget.tsx` — keep in sync when that widget changes.
 */
function customBadgeColorStyles(color: string | undefined): CSSProperties {
  if (!color) return {};
  return {
    ...getColor(color, "backgroundColor", "background"),
    ...getColor(color, "color", "foreground"),
  };
}

function cssVarBase(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const m = value.match(/^var\((--[\w-]+)\)$/);
  return m?.[1];
}

const BADGE_FLAT_COLOR_NAMES = [
  "Black",
  "White",
  "Slate",
  "Gray",
  "Zinc",
  "Neutral",
  "Stone",
  "Red",
  "Orange",
  "Amber",
  "Yellow",
  "Lime",
  "Green",
  "Emerald",
  "Teal",
  "Cyan",
  "Sky",
  "Blue",
  "Indigo",
  "Violet",
  "Purple",
  "Fuchsia",
  "Pink",
  "Rose",
  "Primary",
  "Secondary",
  "Destructive",
  "Success",
  "Warning",
  "Info",
  "Muted",
  "IvyGreen",
] as const;

describe("BadgeWidget custom color (fill + label)", () => {
  it.each(BADGE_FLAT_COLOR_NAMES)(
    "pairs background and text with the same token base (%s)",
    (color) => {
      const style = customBadgeColorStyles(color);
      const base = cssVarBase(style.backgroundColor as string);
      expect(
        base,
        `expected var(--token), got ${JSON.stringify(style.backgroundColor)}`,
      ).toBeDefined();
      expect(style.color).toBe(`var(${base}-foreground)`);
    },
  );
});
