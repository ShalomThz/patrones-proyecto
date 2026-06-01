import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(new URL(".", import.meta.url).pathname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Las llamadas /api se redirigen al backend Express.
      "/api": "http://localhost:4000",
    },
  },
});
