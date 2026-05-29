import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormBtnReset from "./FormBtnReset";
import type { AnyFormApi } from "@tanstack/react-form";

describe("FormBtnReset", () => {
  it("renders a button labeled 'Effacer'", () => {
    const form = { reset: vi.fn() } as unknown as AnyFormApi;

    render(<FormBtnReset form={form} />);

    expect(screen.getByRole("button", { name: "Effacer" })).toBeInTheDocument();
  });

  it("calls form.reset() when clicked", async () => {
    const reset = vi.fn();
    const form = { reset } as unknown as AnyFormApi;

    render(<FormBtnReset form={form} />);
    await userEvent.click(screen.getByRole("button", { name: "Effacer" }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
