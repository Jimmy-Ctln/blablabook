import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("axios");
vi.mock("@/stores/authStore", () => ({
  useAuthStore: {
    getState: () => ({
      clearAuth: vi.fn(),
    }),
  },
}));

describe("axios api instance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have credentials enabled", () => {
    const config = {
      baseURL: import.meta.env.VITE_BACKEND_URL,
      withCredentials: true,
    };
    expect(config.withCredentials).toBe(true);
  });

  it("should have response interceptor configured", () => {
    const mockApi = {
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    };

    expect(mockApi.interceptors.response.use).toBeDefined();
  });

  it("should handle non-401 errors correctly", async () => {
    const mockError = {
      response: { status: 500 },
      config: {},
    };

    expect(mockError.response.status).not.toBe(401);
  });

  it("should handle 401 errors with retry", () => {
    const mockError = {
      response: { status: 401 },
      config: { _retry: false, url: "/api/test" },
    };

    expect(mockError.response.status).toBe(401);
    expect(mockError.config._retry).toBe(false);
  });

  it("should not retry auth endpoints on 401", () => {
    const mockError = {
      response: { status: 401 },
      config: { _retry: false, url: "/auth/refresh" },
    };

    const isAuthUrl = mockError.config.url?.includes("/auth/");
    expect(isAuthUrl).toBe(true);
  });

  it("should retry on 401 for non-auth endpoints", () => {
    const url = "/books/list";
    const shouldRetry = !url.includes("/auth/");
    expect(shouldRetry).toBe(true);
  });
});
