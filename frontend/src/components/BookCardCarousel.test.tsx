import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BookCardCarousel from "./BookCardCarousel";
import type { BookDisplay } from "@/@types/books";

// Mock react-router Link so the component can render outside a real router context.
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <a data-testid="link" {...(props as Record<string, unknown>)}>
      {children}
    </a>
  ),
}));

const baseBook: BookDisplay = {
  id: "1",
  name: "Dune",
  author: "Frank Herbert",
  isbn: "9780441013593",
  categories: ["science-fiction"],
};

describe("BookCardCarousel", () => {
  it("displays the book title and author", () => {
    render(<BookCardCarousel book={baseBook} />);

    expect(screen.getByText("Dune")).toBeInTheDocument();
    expect(screen.getByText("Frank Herbert")).toBeInTheDocument();
  });

  it("falls back to 'Auteur inconnu' when the author is missing", () => {
    const noAuthor: BookDisplay = { ...baseBook, author: "" };
    render(<BookCardCarousel book={noAuthor} />);

    expect(screen.getByText("Auteur inconnu")).toBeInTheDocument();
  });

  it("does not wrap the card in a link when the book has no ISBN", () => {
    const noIsbn: BookDisplay = { ...baseBook, isbn: "" };
    render(<BookCardCarousel book={noIsbn} />);

    // No Link should be rendered — only the static wrapper.
    expect(screen.queryByTestId("link")).not.toBeInTheDocument();
  });
});
