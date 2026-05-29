import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useExternalBooks } from "./useExternalBooks";
import * as externalApi from "@/api/externalBooks";
import type { ReactNode } from "react";
import React from "react";

// Mock the external API module → the hook calls our fake instead of OpenLibrary.
vi.mock("@/api/externalBooks");

const makeWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useExternalBooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call the API in 'search' mode if the term is shorter than 3 characters", async () => {
    renderHook(() => useExternalBooks({ mode: "search", param: "ab" }), {
      wrapper: makeWrapper(),
    });

    // Give React Query a tick to potentially fire
    await new Promise((r) => setTimeout(r, 50));
    expect(externalApi.searchExternalBooks).not.toHaveBeenCalled();
  });

  it("returns the books fetched in 'random' mode and computes hasMore correctly", async () => {
    vi.mocked(externalApi.searchExternalBooks).mockResolvedValue({
      books: [
        {
          key: "OL1W",
          title: "Dune",
          author: "Herbert",
          isbn: "9780441013593",
          categories: [],
        },
      ],
      numFound: 100, // far more than itemsPerPage (20) → hasMore = true
      offset: 0,
    });

    const { result } = renderHook(() => useExternalBooks({ mode: "random" }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toHaveLength(1);
    });

    expect(result.current.numFound).toBe(100);
    expect(result.current.hasMore).toBe(true);
    expect(externalApi.searchExternalBooks).toHaveBeenCalledWith({
      type: "random",
      limit: 20,
      offset: 0,
    });
  });
});
