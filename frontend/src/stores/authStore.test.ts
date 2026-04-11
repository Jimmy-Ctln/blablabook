import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "./authStore";
import api from "@/api/axios";
import type { UserProps } from "@/@types/user";

vi.mock("@/api/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
  });

  it("should initialize with null user and false auth", () => {
    const store = useAuthStore.getState();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it("should login user correctly", () => {
    const testUser: UserProps = {
      id: 1,
      email: "test@example.com",
      username: "testuser",
      roles: "user",
      avatar_url: null,
    };

    const store = useAuthStore.getState();
    store.login(testUser);

    const updatedStore = useAuthStore.getState();
    expect(updatedStore.user).toEqual(testUser);
    expect(updatedStore.isAuthenticated).toBe(true);
  });

  it("should logout user and call api.post", async () => {
    const testUser: UserProps = {
      id: 1,
      email: "test@example.com",
      username: "testuser",
      roles: "user",
      avatar_url: null,
    };

    const store = useAuthStore.getState();
    store.login(testUser);

    vi.mocked(api.post).mockResolvedValue({ data: {} });

    await store.logout();

    expect(api.post).toHaveBeenCalledWith("/auth/logout");
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("should handle logout error gracefully", async () => {
    const testUser: UserProps = {
      id: 1,
      email: "test@example.com",
      username: "testuser",
      roles: "user",
      avatar_url: null,
    };

    const store = useAuthStore.getState();
    store.login(testUser);

    vi.mocked(api.post).mockRejectedValue(new Error("Network error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await store.logout();

    expect(consoleSpy).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    consoleSpy.mockRestore();
  });

  it("should update user correctly", () => {
    const initialUser: UserProps = {
      id: 1,
      email: "test@example.com",
      username: "testuser",
      roles: "user",
      avatar_url: null,
    };

    const updatedUser: UserProps = {
      ...initialUser,
      username: "newusername",
      email: "newemail@example.com",
    };

    const store = useAuthStore.getState();
    store.login(initialUser);
    store.updateUser(updatedUser);

    expect(useAuthStore.getState().user).toEqual(updatedUser);
  });

  it("should clear auth state", () => {
    const testUser: UserProps = {
      id: 1,
      email: "test@example.com",
      username: "testuser",
      roles: "user",
      avatar_url: null,
    };

    const store = useAuthStore.getState();
    store.login(testUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    store.clearAuth();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
