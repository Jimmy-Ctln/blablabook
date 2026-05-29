import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CarouselDisplay from "./CarouselDisplay";
import type { BookDisplay } from "@/@types/books";

// react-router Link must be mocked because the inner BookCardCarousel uses it.
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <a {...(props as Record<string, unknown>)}>{children}</a>
  ),
}));

const books: BookDisplay[] = [
  { id: "1", name: "Dune", author: "Herbert", isbn: "9780441013593" },
  { id: "2", name: "Foundation", author: "Asimov", isbn: "9780553293357" },
];

describe("CarouselDisplay", () => {
  it("shows the section title", () => {
    render(<CarouselDisplay title="Nouveautés" books={books} isLoading={false} />);

    expect(screen.getByRole("heading", { name: "Nouveautés" })).toBeInTheDocument();
  });

  it("renders one card per book when not loading", () => {
    render(<CarouselDisplay title="Mes livres" books={books} isLoading={false} />);

    expect(screen.getByText("Dune")).toBeInTheDocument();
    expect(screen.getByText("Foundation")).toBeInTheDocument();
  });

  it("renders skeletons (not book cards) while loading", () => {
    const { container } = render(
      <CarouselDisplay title="Chargement" books={[]} isLoading={true} />,
    );

    // No book name visible while loading; skeleton placeholders are shown instead.
    expect(screen.queryByText("Dune")).not.toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });
});
