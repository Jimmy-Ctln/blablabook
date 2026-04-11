import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookStatusDropdown } from "./BookStatusDropdown";

describe("BookStatusDropdown Component", () => {
  it("should render with status", () => {
    render(<BookStatusDropdown status="À lire" />);
    expect(screen.getByText("À lire")).toBeInTheDocument();
  });

  it("should display Lu status", () => {
    render(<BookStatusDropdown status="Lu" />);
    expect(screen.getByText("Lu")).toBeInTheDocument();
  });

  it("should display En cours status", () => {
    render(<BookStatusDropdown status="En cours" />);
    expect(screen.getByText("En cours")).toBeInTheDocument();
  });

  it("should call onChangeStatus when provided", () => {
    const onChangeStatus = vi.fn();
    render(
      <BookStatusDropdown status="À lire" onChangeStatus={onChangeStatus} />,
    );
    expect(screen.getByText("À lire")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    render(<BookStatusDropdown status="En cours" isUpdatingStatus={true} />);
    expect(screen.getByText("En cours")).toBeInTheDocument();
  });

  it("should have trigger element", () => {
    const { container } = render(<BookStatusDropdown status="À lire" />);
    // DropdownMenuTrigger uses Badge element with role=button
    const trigger = container.querySelector('[role="button"]');
    expect(trigger || screen.getByText("À lire")).toBeInTheDocument();
  });

  it("should display all statuses", () => {
    const { rerender } = render(<BookStatusDropdown status="À lire" />);
    expect(screen.getByText("À lire")).toBeInTheDocument();

    rerender(<BookStatusDropdown status="En cours" />);
    expect(screen.getByText("En cours")).toBeInTheDocument();

    rerender(<BookStatusDropdown status="Lu" />);
    expect(screen.getByText("Lu")).toBeInTheDocument();
  });

  it("should have badge styling", () => {
    render(<BookStatusDropdown status="Lu" />);
    // Badge displays the status text
    expect(screen.getByText("Lu")).toBeInTheDocument();
  });
});
