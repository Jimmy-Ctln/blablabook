import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";

// Mock the hooks
vi.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

import { useCurrentUser } from "@/hooks/useCurrentUser";

describe("Hero Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display authenticated welcome message", () => {
    (useCurrentUser as any).mockReturnValue({
      isAuthenticated: true,
      data: { username: "testuser" },
    });

    render(<Hero />);
    expect(screen.getByText(/Blablabook, testuser/)).toBeInTheDocument();
  });

  it("should display unauthenticated message", () => {
    (useCurrentUser as any).mockReturnValue({
      isAuthenticated: false,
      data: null,
    });

    render(<Hero />);
    expect(screen.getByText(/aventure littéraire/)).toBeInTheDocument();
  });

  it("should have sparkles icon text", () => {
    (useCurrentUser as any).mockReturnValue({
      isAuthenticated: true,
      data: { username: "john" },
    });

    const { container } = render(<Hero />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("should display hero section", () => {
    (useCurrentUser as any).mockReturnValue({
      isAuthenticated: false,
      data: null,
    });

    const { container } = render(<Hero />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("should have minimum height styling", () => {
    (useCurrentUser as any).mockReturnValue({
      isAuthenticated: true,
      data: { username: "user" },
    });

    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("min-h-[70vh]");
  });

  it("should display different greeting for authenticated users", () => {
    (useCurrentUser as any).mockReturnValue({
      isAuthenticated: true,
      data: { username: "alice" },
    });

    render(<Hero />);
    // Search for part of the text since it might be split by <br />
    expect(screen.getByText(/Que lit-on/)).toBeInTheDocument();
  });

  it("should render with background elements", () => {
    (useCurrentUser as any).mockReturnValue({
      isAuthenticated: false,
      data: null,
    });

    const { container } = render(<Hero />);
    // Check that there are divs for background
    const divs = container.querySelectorAll("div");
    expect(divs.length).toBeGreaterThan(0);
  });
});
