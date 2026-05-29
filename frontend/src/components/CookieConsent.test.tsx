import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CookieConsent from "./CookieConsent";

// Link from @tanstack/react-router is used in the expanded view → mock it.
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <a {...(props as Record<string, unknown>)}>{children}</a>
  ),
}));

describe("CookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("is visible by default when no consent has been saved yet", () => {
    render(<CookieConsent />);

    expect(screen.getByText("Préférences de Cookies")).toBeInTheDocument();
  });

  it("stores a consent with marketing=true when the user clicks 'Accepter tout'", async () => {
    render(<CookieConsent />);

    await userEvent.click(screen.getByText("Accepter tout"));

    const stored = JSON.parse(localStorage.getItem("cookieConsent") || "{}");
    expect(stored.marketing).toBe(true);
    expect(stored.analytics).toBe(true);
    expect(stored.essential).toBe(true);
  });

  it("stores a consent with marketing=false when the user clicks 'Refuser'", async () => {
    render(<CookieConsent />);

    await userEvent.click(screen.getByText("Refuser"));

    const stored = JSON.parse(localStorage.getItem("cookieConsent") || "{}");
    expect(stored.marketing).toBe(false);
    expect(stored.analytics).toBe(false);
    // Essential cookies are always required, even when refusing.
    expect(stored.essential).toBe(true);
  });
});
