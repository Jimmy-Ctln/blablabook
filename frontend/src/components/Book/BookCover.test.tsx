import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookCover } from "./BookCover";

describe("BookCover Component", () => {
  it("should render with image", () => {
    render(<BookCover src="https://example.com/cover.jpg" alt="Test Book" />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
  });

  it("should display alt text", () => {
    render(
      <BookCover src="https://example.com/cover.jpg" alt="Test Book Title" />,
    );
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Test Book Title");
  });

  it("should use provided src", () => {
    render(<BookCover src="https://example.com/my-book.jpg" alt="My Book" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/my-book.jpg");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <BookCover
        src="https://example.com/cover.jpg"
        alt="Test Book"
        className="custom-class"
      />,
    );
    const div = container.querySelector("div");
    expect(div).toHaveClass("custom-class");
  });

  it("should show fallback when no image", () => {
    render(<BookCover src="" alt="No Image Book" />);
    expect(screen.getByText("Pas d'image")).toBeInTheDocument();
  });

  it("should have correct aspect ratio class", () => {
    const { container } = render(
      <BookCover src="https://example.com/cover.jpg" alt="Test" />,
    );
    const div = container.querySelector("div");
    expect(div).toHaveClass("aspect-[2/3]");
  });
});
