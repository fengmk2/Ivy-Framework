import { describe, it, expect } from "vite-plus/test";
import { getApiUrl, getCommitsUrl } from "../GitHubContributors";

describe("GitHubContributors utility functions", () => {
  describe("getApiUrl", () => {
    it("should return null for invalid URLs", () => {
      expect(getApiUrl("not-a-url")).toBeNull();
      expect(getApiUrl("https://example.com/not/enough/parts")).toBeNull();
      expect(getApiUrl("https://github.com/owner/repo/tree/main/path/to/file")).toBeNull(); // not 'blob'
    });

    it("should extract branch and path for standard repositories", () => {
      const url = "https://github.com/owner/repo/blob/feature-branch/src/file.ts";
      const expectedApiUrl =
        "https://api.github.com/repos/owner/repo/commits?path=src%2Ffile.ts&sha=feature-branch&per_page=20";
      expect(getApiUrl(url)).toBe(expectedApiUrl);
    });

    it("should NOT remap Ivy-Tendril to the Ivy monorepo", () => {
      const url =
        "https://github.com/Ivy-Interactive/Ivy-Tendril/blob/development/src/Docs/01_Introduction.md";
      const expectedApiUrl =
        "https://api.github.com/repos/Ivy-Interactive/Ivy-Tendril/commits?path=src%2FDocs%2F01_Introduction.md&sha=development&per_page=20";
      expect(getApiUrl(url)).toBe(expectedApiUrl);
    });

    it("should NOT remap Ivy-Framework to the Ivy monorepo", () => {
      const url =
        "https://github.com/Ivy-Interactive/Ivy-Framework/blob/main/src/frontend/src/file.tsx";
      const expectedApiUrl =
        "https://api.github.com/repos/Ivy-Interactive/Ivy-Framework/commits?path=src%2Ffrontend%2Fsrc%2Ffile.tsx&sha=main&per_page=20";
      expect(getApiUrl(url)).toBe(expectedApiUrl);
    });

    it("should handle other Ivy-Interactive repos directly", () => {
      const url = "https://github.com/Ivy-Interactive/OtherRepo/blob/main/src/file.ts";
      const expectedApiUrl =
        "https://api.github.com/repos/Ivy-Interactive/OtherRepo/commits?path=src%2Ffile.ts&sha=main&per_page=20";
      expect(getApiUrl(url)).toBe(expectedApiUrl);
    });
  });

  describe("getCommitsUrl", () => {
    it("should fallback to original replacement if parsing fails", () => {
      expect(getCommitsUrl("https://github.com/owner/repo/blob/main")).toBe(
        "https://github.com/owner/repo/commits/main",
      );
      expect(getCommitsUrl("not-a-url")).toBe("not-a-url");
    });

    it("should extract branch and path for standard repositories", () => {
      const url = "https://github.com/owner/repo/blob/feature-branch/src/file.ts";
      const expectedCommitsUrl = "https://github.com/owner/repo/commits/feature-branch/src/file.ts";
      expect(getCommitsUrl(url)).toBe(expectedCommitsUrl);
    });

    it("should NOT remap Ivy-Tendril commits URL", () => {
      const url =
        "https://github.com/Ivy-Interactive/Ivy-Tendril/blob/development/src/Docs/01_Introduction.md";
      const expectedCommitsUrl =
        "https://github.com/Ivy-Interactive/Ivy-Tendril/commits/development/src/Docs/01_Introduction.md";
      expect(getCommitsUrl(url)).toBe(expectedCommitsUrl);
    });

    it("should NOT remap Ivy-Framework commits URL", () => {
      const url =
        "https://github.com/Ivy-Interactive/Ivy-Framework/blob/main/src/frontend/src/file.tsx";
      const expectedCommitsUrl =
        "https://github.com/Ivy-Interactive/Ivy-Framework/commits/main/src/frontend/src/file.tsx";
      expect(getCommitsUrl(url)).toBe(expectedCommitsUrl);
    });
  });
});
