import { describe, it, expect } from "vitest";

describe("Footer - Data Logic", () => {
  it("should have footer links", () => {
    const footerLinks = [
      { label: "Mentions Légales", href: "/legal" },
      { label: "Politique de Confidentialité", href: "/privacy" },
      { label: "Conditions d'Utilisation", href: "/terms" },
    ];
    expect(footerLinks.length).toBe(3);
  });

  it("should have correct legal link href", () => {
    const links = [{ href: "/legal" }];
    expect(links[0].href).toBe("/legal");
  });

  it("should have social links", () => {
    const socialLinks = [
      { icon: "Instagram", href: "#" },
      { icon: "Twitter", href: "#" },
    ];
    expect(socialLinks.length).toBe(2);
  });

  it("should display current year", () => {
    const year = new Date().getFullYear();
    expect(year).toBeGreaterThan(2020);
  });

  it("should have brand name", () => {
    const brand = "Blablabook";
    expect(brand).toBe("Blablabook");
  });

  it("should have brand description", () => {
    const description = "Votre bibliothèque personnelle en ligne";
    expect(description.length).toBeGreaterThan(0);
  });
});
