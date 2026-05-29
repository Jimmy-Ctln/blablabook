import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookCoverImage } from "./BookCoverImage";

describe("BookCoverImage", () => {
  it("renders an <img> with the provided src and alt when a URL is given", () => {
    render(<BookCoverImage src="https://example.com/cover.jpg" alt="Couverture de Dune" />);

    const img = screen.getByAltText("Couverture de Dune") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe("https://example.com/cover.jpg");
  });

  it("falls back to the placeholder when no src is provided", () => {
    const { container } = render(<BookCoverImage alt="aucune couverture" />);

    // The fallback uses the local /book.svg logo (aria-hidden, decorative).
    const fallback = container.querySelector('img[src="/book.svg"]');
    expect(fallback).toBeInTheDocument();
  });

  it("switches to the placeholder when the image fails to load", () => {
    const { container } = render(
      <BookCoverImage src="https://broken.example/cover.jpg" alt="cover" />,
    );

    const img = screen.getByAltText("cover");
    // Simulate a failed image load → component should swap to fallback
    fireEvent.error(img);

    expect(container.querySelector('img[src="/book.svg"]')).toBeInTheDocument();
  });
});
