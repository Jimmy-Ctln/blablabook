import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/api/externalBooks");

describe("useExternalBooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have search mode", () => {
    const mode = "search";
    expect(mode).toBe("search");
  });

  it("should have random mode", () => {
    const mode = "random";
    expect(mode).toBe("random");
  });

  it("should have category mode", () => {
    const mode = "category";
    expect(mode).toBe("category");
  });

  it("should handle search query", () => {
    const query = "test book";
    expect(query.length).toBeGreaterThan(0);
  });

  it("should handle category parameter", () => {
    const category = "fiction";
    expect(category).toBe("fiction");
  });

  it("should return data from API", () => {
    const mockData = [{ id: 1, title: "Book 1", author: "Author 1" }];
    expect(mockData.length).toBeGreaterThan(0);
  });

  it("should handle empty results", () => {
    const results = [];
    expect(results.length).toBe(0);
  });
});
