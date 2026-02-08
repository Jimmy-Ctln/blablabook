import api from "@/api/axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserProps {
  id: number;
  image: string | null;
  email: string;
  username: string;
  roles: string;
}

interface AuthStoreProps {
  user: UserProps | null;
  isAuthenticated: boolean;

  login: (user: UserProps) => void;
  logout: () => void;
  updateUser: (user: Partial<UserProps>) => void;
}

export const useAuthStore = create<AuthStoreProps>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => {
        set({ user, isAuthenticated: true });
      },
      logout: async () => {
        try {
          await api.post("/auth/logout"); // back end is only one who can destroy cookie
          // if promise failed, auto go to the catch
        } catch (err) {
          console.error("erreur server: ", err);
        } finally {
          // if request failed, we cleared the user's data but cookie is not deleted
          // with finally bloc, user is not stopped when serveur is down
          // reset the global state
          set({ user: null, isAuthenticated: false });
          // delete the local storage
          localStorage.removeItem("auth_storage");
          // redirect user to homepage and reload all state
          window.location.href = "/";
        }
      },
      updateUser: (updatedFields) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        }));
      },
    }),
    {
      name: "auth_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
