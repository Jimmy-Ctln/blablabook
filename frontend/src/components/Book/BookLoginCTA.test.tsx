import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookLoginCTA } from "./BookLoginCTA";

describe("BookLoginCTA Component", () => {
  it("should render login button", () => {
    render(<BookLoginCTA onClick={() => {}} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should display interested message", () => {
    render(<BookLoginCTA onClick={() => {}} />);
    expect(screen.getByText(/Intéressé par ce livre/)).toBeInTheDocument();
  });

  it("should display login button text", () => {
    render(<BookLoginCTA onClick={() => {}} />);
    expect(
      screen.getByText(/Connectez-vous pour l'ajouter/),
    ).toBeInTheDocument();
  });

  it("should call onClick when button clicked", async () => {
    const onClick = vi.fn();
    render(<BookLoginCTA onClick={onClick} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("should have login icon", () => {
    const { container } = render(<BookLoginCTA onClick={() => {}} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
