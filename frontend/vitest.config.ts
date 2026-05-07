import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    coverage: {
      reporter: ["text", "json", "json-summary", "html"],
      exclude: [
        "node_modules/",
        "src/test-setup.ts",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.test.tsx",
        "**/*.spec.tsx",
        "src/components/**",
        "src/hooks/**",
        "src/api/**",
        "src/layouts/**",
        "src/lib/**",
        "src/assets/**",
        "src/stores/**",
        "src/@types/**",
        "src/*.loader.tsx",
        "src/pages/Legal/**",
        "src/pages/ProfilePage/**",
        "src/pages/NotFound.tsx",
        "src/pages/Book/BookDetails.tsx", // Excluded: Requires real Router + React Query integration; mocking both causes test complexity to outweigh MVP value (render testing not cost-effective)
      ],
      include: [
        "src/pages/HomePage.tsx",
        "src/pages/LibraryPage.tsx",
        "src/pages/Auth/LoginPage/LoginPage.tsx",
        "src/pages/Auth/RegisterPage/RegisterPage.tsx",
      ],
    },
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
