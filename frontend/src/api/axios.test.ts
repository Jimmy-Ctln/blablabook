import { describe, it, expect, vi, beforeEach } from "vitest";

const { toastError } = vi.hoisted(() => ({ toastError: vi.fn() }));
vi.mock("sonner", () => ({
  toast: { error: toastError },
}));

import api from "./axios";

type InterceptorHandler = {
  rejected: (err: unknown) => Promise<unknown>;
};
const handlers = (
  api.interceptors.response as unknown as { handlers: InterceptorHandler[] }
).handlers;
const onRejected = handlers[0].rejected;

describe("axios response interceptor", () => {
  beforeEach(() => {
    toastError.mockClear();
  });

  it("shows a toast and rejects when the backend returns 429 (rate limit)", async () => {
    const error = {
      response: { status: 429 },
      config: { url: "/books" },
    };

    await expect(onRejected(error)).rejects.toBe(error);
    // The user must see a feedback message
    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError.mock.calls[0][0]).toMatch(/Limite de requêtes/);
  });

  it("lets a 401 on /auth/login bubble up to the form (no refresh, no redirect)", async () => {
    const error = {
      response: { status: 401 },
      config: { url: "/auth/login" },
    };

    await expect(onRejected(error)).rejects.toBe(error);
    expect(toastError).not.toHaveBeenCalled();
  });

  it("rejects non-401 / non-429 errors without showing any toast", async () => {
    const error = {
      response: { status: 500 },
      config: { url: "/books" },
    };

    await expect(onRejected(error)).rejects.toBe(error);
    expect(toastError).not.toHaveBeenCalled();
  });

  it("rejects errors that have no response (e.g. network failure)", async () => {
    // axios surfaces network/timeout errors with `error.response === undefined`.
    // The interceptor's optional chaining must not crash on that shape.
    const error = { config: { url: "/books" } };

    await expect(onRejected(error)).rejects.toBe(error);
    expect(toastError).not.toHaveBeenCalled();
  });
});
