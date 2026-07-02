import { describe, it, expect } from "vite-plus/test";
import { LruMap } from "./lruMap";

describe("LruMap", () => {
  it("evicts least-recently-used entries when over capacity", () => {
    const cache = new LruMap<string, number>(3);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    cache.set("d", 4);

    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
    expect(cache.get("d")).toBe(4);
    expect(cache.size).toBe(3);
  });

  it("refreshes recency on get", () => {
    const cache = new LruMap<string, number>(3);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    expect(cache.get("a")).toBe(1);
    cache.set("d", 4);

    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("a")).toBe(1);
    expect(cache.get("c")).toBe(3);
    expect(cache.get("d")).toBe(4);
  });
});
