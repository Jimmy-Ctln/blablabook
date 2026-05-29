import { describe, it, expect } from "vitest";
import { cn, resizeOpenLibraryCover, getRandomQuery } from "./utils";

describe("cn", () => {
  it("merges several class strings into one", () => {
    expect(cn("p-2", "text-sm")).toBe("p-2 text-sm");
  });

  it("resolves Tailwind conflicts by keeping the last class", () => {
    // tailwind-merge: when two utilities target the same property, the last one wins.
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("resizeOpenLibraryCover", () => {
  it("swaps the size suffix on an OpenLibrary cover URL", () => {
    const url = "https://covers.openlibrary.org/b/id/12345-M.jpg";

    expect(resizeOpenLibraryCover(url, "L")).toBe(
      "https://covers.openlibrary.org/b/id/12345-L.jpg",
    );
  });

  it("returns the same URL untouched when it is not an OpenLibrary cover", () => {
    const url = "https://example.com/photo.jpg";
    expect(resizeOpenLibraryCover(url, "L")).toBe(url);
  });

  it("returns undefined when no URL is provided", () => {
    expect(resizeOpenLibraryCover(undefined, "M")).toBeUndefined();
    expect(resizeOpenLibraryCover(null, "M")).toBeUndefined();
  });
});

describe("getRandomQuery", () => {
  it("returns a non-empty string", () => {
    const result = getRandomQuery();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
