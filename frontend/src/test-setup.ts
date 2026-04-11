import "@testing-library/jest-dom";
import { vi } from "vitest";

// Ajouté pour supprimer le warning JSDOM sur scrollTo dans les tests
window.scrollTo = () => {};

// Mock window.matchMedia pour les composants utilisant les media queries
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Supprime les warnings act(...) et autres erreurs React dans la console des tests
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("not wrapped in act")) {
    return;
  }
  originalError(...args);
};
