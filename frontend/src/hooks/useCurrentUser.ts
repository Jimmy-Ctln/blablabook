import { useAuthStore } from "@/stores/authStore";

export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    data: user,
    isLoading: false,
    isError: !isAuthenticated,
    isAuthenticated,
  };
}
