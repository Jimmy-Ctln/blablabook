import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { User } from "@/@types/user";
import { useCurrentUser } from "./useCurrentUser";

vi.mock("@/stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

const { useAuthStore } = await import("@/stores/authStore");

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const mockUser: User = {
  id: 1,
  email: "test@example.com",
  username: "testuser",
  roles: "user",
  avatar_url: null,
};

describe("useCurrentUser Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return authenticated user data", () => {
    (useAuthStore as any).mockImplementation((selector: (state: AuthState) => any) =>
      selector({
        user: mockUser,
        isAuthenticated: true,
      }),
    );

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.data).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return false for isAuthenticated when user is null", () => {
    (useAuthStore as any).mockImplementation((selector: (state: AuthState) => any) =>
      selector({
        user: null,
        isAuthenticated: false,
      }),
    );

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.data).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle inconsistent state: user exists but not authenticated (error case)", () => {
    (useAuthStore as any).mockImplementation((selector: (state: AuthState) => any) =>
      selector({
        user: mockUser,
        isAuthenticated: false,
      }),
    );

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.data).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it("should handle inconsistent state: authenticated but no user (error case)", () => {
    (useAuthStore as any).mockImplementation((selector: (state: AuthState) => any) =>
      selector({
        user: null,
        isAuthenticated: true,
      }),
    );

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.data).toBeNull();
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it("should always return isLoading as false", () => {
    (useAuthStore as any).mockImplementation((selector: (state: AuthState) => any) =>
      selector({
        user: mockUser,
        isAuthenticated: true,
      }),
    );

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.isLoading).toBe(false);
  });

  it("should handle logout state (user null, not authenticated)", () => {
    (useAuthStore as any).mockImplementation((selector: (state: AuthState) => any) =>
      selector({
        user: null,
        isAuthenticated: false,
      }),
    );

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.data).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isError).toBe(true);
  });
});
