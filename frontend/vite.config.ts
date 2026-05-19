import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // active le hot reload
    watch: {
      usePolling: true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-router": ["@tanstack/react-router"],
          "vendor-query": [
            "@tanstack/react-query",
            "@tanstack/react-query-persist-client",
            "@tanstack/query-sync-storage-persister",
          ],
          "vendor-ui": ["lucide-react", "sonner"],
        },
      },
    },
  },
  test: {
    coverage: {
      reporter: ["text", "json", "json-summary", "html"],
    },
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
  base: "/",
});
