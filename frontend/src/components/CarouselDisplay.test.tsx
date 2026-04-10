import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CarouselDisplay from "./CarouselDisplay";
import type { BookDisplay } from "@/@types/books";

// Mock IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock Carousel components
vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children, title }: any) => (
    <div data-testid="carousel">{children}</div>
  ),
  CarouselContent: ({ children }: any) => (
    <div data-testid="carousel-content">{children}</div>
  ),
  CarouselItem: ({ children, className }: any) => (
    <div data-testid="carousel-item" className={className}>
      {children}
    </div>
  ),
  CarouselNext: () => <button data-testid="carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="carousel-prev">Prev</button>,
}));

// Mock BookCardCarousel
vi.mock("./BookCardCarousel", () => ({
  default: ({ book }: { book: BookDisplay }) => (
    <div data-testid={`book-card-${book.id}`}>{book.title}</div>
  ),
}));

// Mock router
vi.mock("@tanstack/react-router", () => ({
  useRouter: vi.fn().mockReturnValue({
    navigate: vi.fn(),
  }),
}));

describe("CarouselDisplay Component", () => {
  const mockBooks: BookDisplay[] = [
    {
      id: 1,
      title: "Book 1",
      author: "Author 1",
      cover: "cover1.jpg",
      isbn: "isbn1",
      status: "À lire",
    },
    {
      id: 2,
      title: "Book 2",
      author: "Author 2",
      cover: "cover2.jpg",
      isbn: "isbn2",
      status: "Lu",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render carousel with title", () => {
    render(
      <CarouselDisplay
        title="Test Carousel"
        books={mockBooks}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Test Carousel")).toBeInTheDocument();
  });

  it("should display book cards", () => {
    render(
      <CarouselDisplay title="Books" books={mockBooks} isLoading={false} />,
    );
    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText("Book 2")).toBeInTheDocument();
  });

  it("should handle loading state", () => {
    render(<CarouselDisplay title="Loading" books={[]} isLoading={true} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("should render carousel controls", () => {
    render(
      <CarouselDisplay title="Test" books={mockBooks} isLoading={false} />,
    );
    expect(screen.getByTestId("carousel-prev")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-next")).toBeInTheDocument();
  });

  it("should handle empty books array", () => {
    render(<CarouselDisplay title="Empty" books={[]} isLoading={false} />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("should display multiple books correctly", () => {
    const manyBooks = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `Book ${i + 1}`,
      author: `Author ${i + 1}`,
      cover: `cover${i + 1}.jpg`,
      isbn: `isbn${i + 1}`,
      status: "À lire" as const,
    }));

    render(
      <CarouselDisplay
        title="Many Books"
        books={manyBooks}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText("Book 5")).toBeInTheDocument();
  });

  it("should render responsive carousel layout", () => {
    render(
      <CarouselDisplay
        title="Responsive"
        books={mockBooks}
        isLoading={false}
      />,
    );
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  it("should have title text displayed", () => {
    render(
      <CarouselDisplay
        title="Test Title"
        books={mockBooks}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should render properly", () => {
    render(
      <CarouselDisplay
        title="Structure Test"
        books={mockBooks}
        isLoading={false}
      />,
    );
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });
});
