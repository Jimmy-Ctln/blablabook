import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookAddAction } from "./BookAddAction";

describe("BookAddAction Component", () => {
  it("should render with text", () => {
    render(<BookAddAction onAdd={() => {}} isAdding={false} />);
    expect(screen.getByText("Intéressé par ce livre ?")).toBeInTheDocument();
  });

  it("should display add button text when not adding", () => {
    render(<BookAddAction onAdd={() => {}} isAdding={false} />);
    expect(screen.getByText("Ajouter à ma bibliothèque")).toBeInTheDocument();
  });

  it("should display loading text when adding", () => {
    render(<BookAddAction onAdd={() => {}} isAdding={true} />);
    expect(screen.getByText("Ajout...")).toBeInTheDocument();
  });

  it("should call onAdd when button clicked", async () => {
    const onAdd = vi.fn();
    render(<BookAddAction onAdd={onAdd} isAdding={false} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(onAdd).toHaveBeenCalled();
  });

  it("should disable button when isAdding is true", () => {
    render(<BookAddAction onAdd={() => {}} isAdding={true} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should not disable button when isAdding is false", () => {
    render(<BookAddAction onAdd={() => {}} isAdding={false} />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("should have heart icon when not adding", () => {
    const { container } = render(
      <BookAddAction onAdd={() => {}} isAdding={false} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
