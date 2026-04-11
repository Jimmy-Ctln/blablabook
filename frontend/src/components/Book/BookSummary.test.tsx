import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookSummary } from "./BookSummary";

describe("BookSummary Component", () => {
  it("should display description", () => {
    render(<BookSummary description="This is a great book" />);
    expect(screen.getByText("This is a great book")).toBeInTheDocument();
  });

  it("should show fallback when no description", () => {
    render(<BookSummary />);
    expect(screen.getByText(/Aucune description fournie/)).toBeInTheDocument();
  });

  it("should have résumé title", () => {
    render(<BookSummary description="Test description" />);
    expect(screen.getByText("Résumé")).toBeInTheDocument();
  });

  it("should render with empty string description", () => {
    render(<BookSummary description="" />);
    expect(screen.getByText(/Aucune description fournie/)).toBeInTheDocument();
  });

  it("should have correct styling classes", () => {
    const { container } = render(<BookSummary description="Test" />);
    const div = container.querySelector(".prose");
    expect(div).toBeInTheDocument();
  });

  it("should preserve line breaks in description", () => {
    const desc = "Line 1\nLine 2\nLine 3";
    const { container } = render(<BookSummary description={desc} />);
    const content = container.querySelector(".prose");
    expect(content).toHaveTextContent("Line 1");
    expect(content).toHaveTextContent("Line 2");
    expect(content).toHaveTextContent("Line 3");
  });
});
