import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/routes/routes";

describe("RootLayout", () => {
  it("should render root layout", () => {
    const { container } = render(<RouterProvider router={router} />);
    expect(container).toBeInTheDocument();
  });

  it("should have container element", () => {
    const { container } = render(<RouterProvider router={router} />);
    const elements = container.querySelectorAll("*");
    expect(elements.length).toBeGreaterThan(0);
  });
});
