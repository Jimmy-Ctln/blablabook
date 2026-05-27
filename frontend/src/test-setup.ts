import "@testing-library/jest-dom";
import { vi } from "vitest";

// Added to suppress the JSDOM warning regarding `scrollTo` in the tests
window.scrollTo = () => {};

// Mock `window.matchMedia` for components that use media queries
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

// Stubs for browser APIs that are not included in jsdom but are used by
// third-party components (embla-carousel, radix-ui, etc.).
class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", ObserverStub);
vi.stubGlobal("ResizeObserver", ObserverStub);

// Suppresses act(...) warnings and other React errors in the test console
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("not wrapped in act")) {
    return;
  }
  originalError(...args);
};
