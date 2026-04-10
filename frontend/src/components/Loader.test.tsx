import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Loader } from "./Loader";

describe("Loader", () => {
  it("should render loader with default text", () => {
    render(<Loader />);
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("should render loader with custom text", () => {
    render(<Loader text="Loading data..." />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("should render loader without text when text is empty string", () => {
    render(<Loader text="" />);
    const container = document.querySelector("div");
    expect(container).toBeInTheDocument();
  });

  it("should apply small size class", () => {
    const { container } = render(<Loader size="sm" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("h-3", "w-3");
  });

  it("should apply medium size class", () => {
    const { container } = render(<Loader size="md" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("h-4", "w-4");
  });

  it("should apply large size class", () => {
    const { container } = render(<Loader size="lg" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("h-6", "w-6");
  });

  it("should apply custom className", () => {
    const { container } = render(<Loader className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should render spinner icon with animate-spin class", () => {
    const { container } = render(<Loader />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("animate-spin");
  });

  it("should render with all props combined", () => {
    render(<Loader text="Custom loading" size="lg" className="custom" />);
    expect(screen.getByText("Custom loading")).toBeInTheDocument();
  });
});
