import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookDataGrid } from "./BookDataGrid";

// Mock BookDataItem
vi.mock("@/components/ui/item", () => ({
  BookDataItem: ({
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
  }) => (
    <div data-testid={`item-${label}`}>
      {label}: {value}
    </div>
  ),
}));

describe("BookDataGrid Component", () => {
  const mockBookData = {
    isbn: "978-3-16-148410-0",
    publisher: "Penguin Books",
    language: "Français",
    pages: 250,
    publishedAt: "2024-01-15",
    categories: ["Fiction", "Mystery"],
    rating: 4.5,
  };

  it("should render book data grid", () => {
    render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories={mockBookData.categories}
        rating={mockBookData.rating}
      />,
    );
    const container = screen.getByTestId("item-code ISBN").parentElement;
    expect(container).toBeInTheDocument();
  });

  it("should display ISBN field", () => {
    render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories={mockBookData.categories}
      />,
    );
    expect(screen.getByTestId("item-code ISBN")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockBookData.isbn))).toBeInTheDocument();
  });

  it("should display language field", () => {
    render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories={mockBookData.categories}
      />,
    );
    expect(screen.getByTestId("item-Langues")).toBeInTheDocument();
  });

  it("should display publisher field", () => {
    render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories={mockBookData.categories}
      />,
    );
    expect(screen.getByTestId("item-Éditeur")).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(mockBookData.publisher)),
    ).toBeInTheDocument();
  });

  it("should display published date field", () => {
    render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories={mockBookData.categories}
      />,
    );
    expect(screen.getByTestId("item-Date de publication")).toBeInTheDocument();
  });

  it("should display pages field", () => {
    render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories={mockBookData.categories}
      />,
    );
    expect(screen.getByTestId("item-Pages")).toBeInTheDocument();
    expect(screen.getByText(/250/)).toBeInTheDocument();
  });

  it("should display categories field", () => {
    render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories={mockBookData.categories}
      />,
    );
    expect(screen.getByTestId("item-Catégories")).toBeInTheDocument();
  });

  it("should display rating when provided", () => {
    render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories={mockBookData.categories}
        rating={4.5}
      />,
    );
    expect(screen.getByText(/4\.5\/5/)).toBeInTheDocument();
  });

  it("should not display rating when not provided", () => {
    render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories={mockBookData.categories}
      />,
    );
    expect(screen.queryByText(/\/5/)).not.toBeInTheDocument();
  });

  it("should handle string categories", () => {
    render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories="Fiction, Mystery"
      />,
    );
    expect(screen.getByTestId("item-Catégories")).toBeInTheDocument();
  });

  it("should render grid layout container", () => {
    const { container } = render(
      <BookDataGrid
        isbn={mockBookData.isbn}
        publisher={mockBookData.publisher}
        language={mockBookData.language}
        pages={mockBookData.pages}
        publishedAt={mockBookData.publishedAt}
        categories={mockBookData.categories}
      />,
    );
    expect(container.querySelector(".grid")).toBeInTheDocument();
  });
});
