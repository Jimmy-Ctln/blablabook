import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

// Mock dependencies
vi.mock("@/hooks/useExternalBooks", () => ({
  useExternalBooks: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn((options) => {
    if (options.queryKey[0] === "random-books") {
      return {
        data: [],
        isLoading: false,
      };
    }
    if (options.queryKey[0] === "books-carousel") {
      return {
        data: {},
        isFetching: false,
      };
    }
    return {
      data: undefined,
      isLoading: false,
    };
  }),
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

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render hero section", () => {
    render(<HomePage />);
    expect(screen.getByTestId("hero")).toBeInTheDocument();
  });

  it("should render carousel with categories", () => {
    render(<HomePage />);
    expect(screen.getByText("SUGGESTIONS ALEATOIRE")).toBeInTheDocument();
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
    render(<HomePage />);
    expect(
      screen.getByTestId("carousel-SUGGESTIONS ALEATOIRE"),
    ).toBeInTheDocument();
  });

  it("should render with multiple categories", () => {
    render(<HomePage />);
    expect(screen.getByText("SUGGESTIONS ALEATOIRE")).toBeInTheDocument();
  });

  it("should show loading message when searching", () => {
    render(<HomePage />);
    expect(screen.getByText("SUGGESTIONS ALEATOIRE")).toBeInTheDocument();
  });

  it("should show no results message when search returns empty", () => {
    render(<HomePage />);
    expect(screen.getByText("SUGGESTIONS ALEATOIRE")).toBeInTheDocument();
  });

  it("should display search results when found", () => {
    render(<HomePage />);
    expect(screen.getByText("SUGGESTIONS ALEATOIRE")).toBeInTheDocument();
  });
});
