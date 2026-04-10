import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BookCardCarousel from "./BookCardCarousel";
import type { BookDisplay } from "@/@types/books";

// Mock router
vi.mock("@tanstack/react-router", () => ({
  useRouter: vi.fn().mockReturnValue({
    navigate: vi.fn(),
  }),
}));

describe("BookCardCarousel Component", () => {
  const mockBook: BookDisplay = {
    id: 1,
    title: "Test Book",
    author: "Test Author",
    cover: "https://example.com/cover.jpg",
    isbn: "123-456-789",
    status: "À lire",
  };

  it("should render book card", () => {
    render(<BookCardCarousel book={mockBook} />);
    expect(
      screen.getByAltText(`Couverture de ${mockBook.title}`),
    ).toBeInTheDocument();
  });

  it("should display book cover image with correct src", () => {
    render(<BookCardCarousel book={mockBook} />);
    const image = screen.getByAltText(
      `Couverture de ${mockBook.title}`,
    ) as HTMLImageElement;
    expect(image.src).toContain("example.com/cover.jpg");
  });

  it("should have card role", () => {
    const { container } = render(<BookCardCarousel book={mockBook} />);
    const card = container.querySelector("[role='article']");
    expect(card).toBeInTheDocument();
  });

  it("should display book with title in alt text", () => {
    render(<BookCardCarousel book={mockBook} />);
    const image = screen.getByAltText(/Couverture de Test Book/);
    expect(image).toBeInTheDocument();
  });

  it("should render with rounded styling", () => {
    const { container } = render(<BookCardCarousel book={mockBook} />);
    const card = container.querySelector(".rounded-3xl");
    expect(card).toBeInTheDocument();
  });

  it("should render image with correct dimensions", () => {
    render(<BookCardCarousel book={mockBook} />);
    const image = screen.getByAltText(
      `Couverture de ${mockBook.title}`,
    ) as HTMLImageElement;
    expect(image.width).toBe(128);
    expect(image.height).toBe(192);
  });

  it("should render without ISBN", () => {
    const bookWithoutIsbn: BookDisplay = {
      ...mockBook,
      isbn: undefined,
    };
    render(<BookCardCarousel book={bookWithoutIsbn} />);
    expect(screen.getByAltText(/Couverture de/)).toBeInTheDocument();
  });

  it("should handle book with different cover URL", () => {
    const bookWithDifferentCover: BookDisplay = {
      ...mockBook,
      cover: "https://different.com/book.jpg",
    };
    render(<BookCardCarousel book={bookWithDifferentCover} />);
    const image = screen.getByAltText(
      `Couverture de ${mockBook.title}`,
    ) as HTMLImageElement;
    expect(image.src).toContain("different.com/book.jpg");
  });

  it("should render as clickable article", () => {
    const { container } = render(<BookCardCarousel book={mockBook} />);
    const article = container.querySelector("[role='article']");
    expect(article).toHaveClass("cursor-pointer");
  });

  it("should render complete card structure", () => {
    const { container } = render(<BookCardCarousel book={mockBook} />);
    const card = container.firstChild;
    expect(card).toBeInTheDocument();
    expect(
      screen.getByAltText(`Couverture de ${mockBook.title}`),
    ).toBeInTheDocument();
  });
});
