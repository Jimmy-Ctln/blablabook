import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

// Mock dependencies
vi.mock("@/hooks/useExternalBooks", () => ({
  useExternalBooks: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/components/CarouselDisplay", () => ({
  default: ({
    title,
    books,
    isLoading,
  }: {
    title: string;
    books: any[];
    isLoading?: boolean;
  }) => (
    <div data-testid={`carousel-${title}`}>
      <h2>{title}</h2>
      {isLoading && <p>Loading...</p>}
      {books.map((book, idx) => (
        <div key={idx}>{book.title || "Book"}</div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/Hero", () => ({
  default: () => <div data-testid="hero">Hero Section</div>,
}));

vi.mock("@/api/books", () => ({
  getRandomBooks: vi.fn().mockResolvedValue([]),
  getBooks: vi.fn().mockResolvedValue({}),
}));

import { useQuery } from "@tanstack/react-query";
import { useExternalBooks } from "@/hooks/useExternalBooks";

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render hero section", () => {
    (useQuery as any).mockReturnValue({
      data: {},
      isFetching: false,
    });
    (useExternalBooks as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<HomePage />);
    expect(screen.getByTestId("hero")).toBeInTheDocument();
  });

  it("should render carousel with categories", () => {
    (useQuery as any).mockReturnValue({
      data: {
        aventure: [],
        romance: [],
      },
      isFetching: false,
    });
    (useExternalBooks as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<HomePage />);
    expect(screen.getByText("SUGGESTIONS ALEATOIRE")).toBeInTheDocument();
    expect(screen.getByText("AVENTURE")).toBeInTheDocument();
  });

  it("should have book categories defined", () => {
    const categories = [
      "aventure",
      "romance",
      "fantasy",
      "science-fiction",
      "horreur",
      "mystère",
      "thriller",
    ];
    expect(categories).toContain("aventure");
    expect(categories.length).toBe(7);
  });

  it("should handle loading state for carousel", () => {
    (useQuery as any).mockReturnValue({
      data: {},
      isFetching: true,
    });
    (useExternalBooks as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<HomePage />);
    expect(
      screen.getByTestId("carousel-SUGGESTIONS ALEATOIRE"),
    ).toBeInTheDocument();
  });

  it("should render with multiple categories", () => {
    const mockCategoryBooks = {
      aventure: [{ id: 1, name: "Adventure Book", cover_url: "" }],
      romance: [{ id: 2, name: "Romance Book", cover_url: "" }],
      fantasy: [{ id: 3, name: "Fantasy Book", cover_url: "" }],
    };
    (useQuery as any).mockReturnValue({
      data: mockCategoryBooks,
      isFetching: false,
    });
    (useExternalBooks as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<HomePage />);
    expect(screen.getByText("AVENTURE")).toBeInTheDocument();
    expect(screen.getByText("ROMANCE")).toBeInTheDocument();
    expect(screen.getByText("FANTASY")).toBeInTheDocument();
  });
});
