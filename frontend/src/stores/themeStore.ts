import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "dark" | "light";

interface ThemeStoreProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStoreProps>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("light", next === "light");
        set({ theme: next });
      },
    }),
    {
      name: "theme_storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        document.documentElement.classList.toggle(
          "light",
          state?.theme === "light",
        );
      },
    },
  ),
);
