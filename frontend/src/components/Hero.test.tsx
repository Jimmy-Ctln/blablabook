import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { useAuthStore } from "@/stores/authStore";
import type { UserProps } from "@/@types/user";

// Link from @tanstack/react-router is used → mock it to avoid router setup.
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <a {...(props as Record<string, unknown>)}>{children}</a>
  ),
}));

const user: UserProps = {
  id: 1,
  username: "Jimmy",
  email: "jimmy@example.com",
  avatar_url: null,
  roles: "user",
};

describe("Hero", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it("shows the 'register' CTA when the visitor is not authenticated", () => {
    render(<Hero />);

    expect(screen.getByText("Commencer dès maintenant")).toBeInTheDocument();
    // The personalized greeting should NOT appear for visitors
    expect(screen.queryByText(/Bonjour,/i)).not.toBeInTheDocument();
  });

  it("greets the user by name when authenticated", () => {
    useAuthStore.setState({ user, isAuthenticated: true });

    render(<Hero />);

    expect(screen.getByText(/Bienvenue sur Blablabook, Jimmy/)).toBeInTheDocument();
    expect(screen.getByText("Ma Bibliothèque")).toBeInTheDocument();
  });
});
