import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BookCardSkeleton } from "./BookCardSkeleton";

describe("BookCardSkeleton", () => {
  it("renders without crashing and shows several skeleton blocks", () => {
    const { container } = render(<BookCardSkeleton />);
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(1);
  });
});
