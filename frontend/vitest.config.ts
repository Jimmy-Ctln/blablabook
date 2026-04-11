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
        "src/components/ui/**", // Exclude shadcn/ui components
        "src/@types/**",
        "src/*.loader.tsx",
      ],
      include: ["src/**/*.{ts,tsx}"],
    },
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
