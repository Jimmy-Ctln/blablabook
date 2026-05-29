import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SearchResultsSkeleton from "./SearchResultsSkeleton";

describe("SearchResultsSkeleton", () => {
  it("renders the 'Résultats' heading and several skeleton placeholders", () => {
    const { container } = render(<SearchResultsSkeleton />);

    expect(screen.getByRole("heading", { name: "Résultats" })).toBeInTheDocument();

    // The component renders 6 BookCardSkeletons, each with several skeleton blocks.
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(6);
  });
});
