import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookHeaderInfo } from "./BookHeaderInfo";

describe("BookHeaderInfo Component", () => {
  it("should display book title", () => {
    render(<BookHeaderInfo title="The Great Adventure" author="John Doe" />);
    expect(screen.getByText("The Great Adventure")).toBeInTheDocument();
  });

  it("should display book author", () => {
    render(<BookHeaderInfo title="Test Book" author="Jane Smith" />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should show 'par' before author", () => {
    render(<BookHeaderInfo title="Test" author="Author" />);
    expect(screen.getByText("par")).toBeInTheDocument();
  });

  it("should have h2 title element", () => {
    const { container } = render(
      <BookHeaderInfo title="My Book" author="Writer" />,
    );
    const h2 = container.querySelector("h2");
    expect(h2).toHaveTextContent("My Book");
  });

  it("should handle long titles", () => {
    const longTitle = "This is a Very Long Book Title That Should Still Render";
    render(<BookHeaderInfo title={longTitle} author="Author" />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it("should have proper flex layout", () => {
    const { container } = render(
      <BookHeaderInfo title="Test" author="Author" />,
    );
    const div = container.querySelector(".flex");
    expect(div).toHaveClass("flex-col");
  });
});
