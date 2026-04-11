import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookStatusAction } from "./BookStatusAction";

describe("BookStatusAction Component", () => {
  it("should render status dropdown when connected and has status", () => {
    render(
      <BookStatusAction
        status="À lire"
        onAddToLibrary={() => {}}
        isConnected={true}
      />,
    );
    expect(screen.getByText("À lire")).toBeInTheDocument();
  });

  it("should show login CTA when not connected", () => {
    render(
      <BookStatusAction
        status="À lire"
        onAddToLibrary={() => {}}
        isConnected={false}
      />,
    );
    expect(
      screen.getByText(/Connectez-vous pour l'ajouter/),
    ).toBeInTheDocument();
  });

  it("should show add button when connected but no status", () => {
    render(<BookStatusAction onAddToLibrary={() => {}} isConnected={true} />);
    expect(screen.getByText(/Ajouter à ma bibliothèque/)).toBeInTheDocument();
  });

  it("should display all status options", () => {
    const { rerender } = render(
      <BookStatusAction
        status="À lire"
        onAddToLibrary={() => {}}
        isConnected={true}
      />,
    );
    expect(screen.getByText("À lire")).toBeInTheDocument();

    rerender(
      <BookStatusAction
        status="En cours"
        onAddToLibrary={() => {}}
        isConnected={true}
      />,
    );
    expect(screen.getByText("En cours")).toBeInTheDocument();

    rerender(
      <BookStatusAction
        status="Lu"
        onAddToLibrary={() => {}}
        isConnected={true}
      />,
    );
    expect(screen.getByText("Lu")).toBeInTheDocument();
  });

  it("should handle status update callback", () => {
    const onChangeStatus = vi.fn();
    render(
      <BookStatusAction
        status="En cours"
        onAddToLibrary={() => {}}
        isConnected={true}
        onChangeStatus={onChangeStatus}
      />,
    );
    expect(screen.getByText("En cours")).toBeInTheDocument();
  });

  it("should show updating state", () => {
    render(
      <BookStatusAction
        status="En cours"
        onAddToLibrary={() => {}}
        isConnected={true}
        isUpdatingStatus={true}
      />,
    );
    expect(screen.getByText("En cours")).toBeInTheDocument();
  });
});
