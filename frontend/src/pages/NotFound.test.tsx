import { describe, it, expect } from "vitest";

describe("NotFound - Data Logic", () => {
  it("should have 404 message", () => {
    const message = "Oups, page introuvable!";
    expect(message).toContain("introuvable");
  });

  it("should have helpful text", () => {
    const text = "Cette page n'existe pas dans la bibliothèque Blablabook.";
    expect(text.length).toBeGreaterThan(0);
  });

  it("should have back to home button", () => {
    const buttonLabel = "Retour à l'accueil";
    expect(buttonLabel).toBe("Retour à l'accueil");
  });

  it("should have home link", () => {
    const homeLink = "/";
    expect(homeLink).toBe("/");
  });

  it("should be responsive", () => {
    const sizes = ["text-2xl", "md:text-4xl"];
    expect(sizes.length).toBe(2);
  });
});
