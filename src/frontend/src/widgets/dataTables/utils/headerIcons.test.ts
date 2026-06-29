import { describe, it, expect, vi, afterEach } from "vite-plus/test";
import type { SpriteMap, SpriteProps } from "@glideapps/glide-data-grid";
import { generateHeaderIcons, mergeSortIndicatorSprites } from "./headerIcons";

const props: SpriteProps = { fgColor: "#aabbcc", bgColor: "#112233" };

describe("headerIcons", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("generateHeaderIcons", () => {
    it("registers a Lucide sprite for each distinct column icon", () => {
      const map = generateHeaderIcons([{ icon: "User" }, { icon: "User" }, { icon: "Flag" }]);
      expect(typeof map.User).toBe("function");
      expect(typeof map.Flag).toBe("function");
      const svg = map.User!(props);
      expect(svg).toContain("<svg");
      expect(svg.length).toBeGreaterThan(40);
    });

    it("registers PascalCase and camelCase variants for column icons", () => {
      const map = generateHeaderIcons([{ icon: "User" }]);
      expect(map.User).toBe(map.user);
      const svg = map.user!(props);
      expect(svg).toContain("<svg");
    });

    it("applies custom SVG templates with fg/bg placeholders", () => {
      const template = `
        <svg xmlns="http://www.w3.org/2000/svg">
          <rect fill="{bgColor}" />
          <path stroke="{fgColor}" />
        </svg>`;
      const map = generateHeaderIcons([{ icon: "Flag" }], { Flag: template });
      const svg = map.Flag!(props);
      expect(svg).toContain("#112233");
      expect(svg).toContain("#aabbcc");
      expect(svg).not.toContain("{bgColor}");
      expect(svg).not.toContain("{fgColor}");
    });

    it("lets HeaderIcons override Lucide for the same key (custom wins)", () => {
      const custom = `<svg xmlns="http://www.w3.org/2000/svg"><text fill="{fgColor}">X</text></svg>`;
      const map = generateHeaderIcons([{ icon: "Star" }], { Star: custom });
      const svg = map.Star!(props);
      expect(svg).toContain(">X<");
      expect(svg).toContain("#aabbcc");
    });

    it("matches camelCase HeaderIcons keys to PascalCase column icons", () => {
      const custom = `<svg xmlns="http://www.w3.org/2000/svg"><circle fill="{fgColor}"/></svg>`;
      const map = generateHeaderIcons([{ icon: "User" }], { user: custom });
      expect(map.User).toBe(map.user);
      expect(map.User!(props)).toContain("circle");
    });

    it("matches PascalCase HeaderIcons keys to camelCase column icons", () => {
      const custom = `<svg xmlns="http://www.w3.org/2000/svg"><rect fill="{fgColor}"/></svg>`;
      const map = generateHeaderIcons([{ icon: "user" }], { User: custom });
      expect(map.user!(props)).toContain("rect");
    });

    it("returns empty svg for unknown Lucide icon names and warns only in development", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const map = generateHeaderIcons([{ icon: "TotallyNonexistentLucideIcon987" }]);
      const fn = map.TotallyNonexistentLucideIcon987;
      expect(fn).toBeDefined();
      const svg = fn!(props);
      if (import.meta.env.DEV) {
        expect(warn).toHaveBeenCalled();
      } else {
        expect(warn).not.toHaveBeenCalled();
      }
      expect(svg).toContain("<svg");
      expect(svg.length).toBeLessThan(200);
    });
  });

  describe("mergeSortIndicatorSprites", () => {
    it("adds ArrowUp and ArrowDown when missing", () => {
      const base = generateHeaderIcons([{ icon: "User" }]);
      const merged = mergeSortIndicatorSprites(base);
      expect(typeof merged.ArrowUp).toBe("function");
      expect(typeof merged.ArrowDown).toBe("function");
      expect(merged.ArrowUp!(props)).toContain("<svg");
      expect(merged.ArrowDown!(props)).toContain("<svg");
    });

    it("does not replace existing ArrowUp / ArrowDown entries", () => {
      const base: SpriteMap = {
        ArrowUp: (p) =>
          `<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="${p.fgColor}"/></svg>`,
      };
      const merged = mergeSortIndicatorSprites(base);
      expect(merged.ArrowUp!(props)).toContain('d="M0 0"');
      expect(typeof merged.ArrowDown).toBe("function");
    });
  });
});
