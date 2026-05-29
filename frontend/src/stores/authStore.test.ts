import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "./authStore";
import api from "@/api/axios";
import type { UserProps } from "@/@types/user";

// We mock the axios client used inside the store so no HTTP call is made.
// `logout` calls `api.post("/auth/logout")` — we replace it with a vi.fn().
vi.mock("@/api/axios", () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

// `logout` triggers `window.location.href = "/"` which jsdom doesn't support.
// We stub window.location with a writable object so the test doesn't throw.
beforeEach(() => {
  Object.defineProperty(window, "location", {
    value: { href: "" },
    writable: true,
    configurable: true,
  });
});

const sampleUser: UserProps = {
  id: 1,
  username: "jimmy",
  email: "jimmy@example.com",
  avatar_url: null,
  roles: "user",
};

describe("authStore", () => {
  // Reset the store before each test so they stay independent.
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
    localStorage.clear();
  });

  it("login stores the user and marks the session as authenticated", () => {
    useAuthStore.getState().login(sampleUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(sampleUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("clearAuth resets the user and removes the localStorage entry", () => {
    // Set an authenticated state first
    useAuthStore.getState().login(sampleUser);
    localStorage.setItem("auth_storage", "something");

    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem("auth_storage")).toBeNull();
  });

  it("updateUser replaces the current user", () => {
    useAuthStore.getState().login(sampleUser);

    const updated: UserProps = { ...sampleUser, username: "jimmy-updated" };
    useAuthStore.getState().updateUser(updated);

    expect(useAuthStore.getState().user?.username).toBe("jimmy-updated");
  });

  it("logout calls /auth/logout and resets the state on success", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} });
    useAuthStore.getState().login(sampleUser);

    await (useAuthStore.getState().logout() as unknown as Promise<void>);

    expect(api.post).toHaveBeenCalledWith("/auth/logout");
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem("auth_storage")).toBeNull();
    // The store redirects the user back to "/" once logged out
    expect(window.location.href).toBe("/");
  });

  it("logout still clears the state even when the backend call fails", async () => {
    // Silence the console.error logged inside the store's catch branch
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(api.post).mockRejectedValueOnce(new Error("Server down"));
    useAuthStore.getState().login(sampleUser);

    await (useAuthStore.getState().logout() as unknown as Promise<void>);

    // The "finally" branch must run regardless of API outcome
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(window.location.href).toBe("/");

    errSpy.mockRestore();
  });
});
