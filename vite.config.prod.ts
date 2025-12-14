import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  root: resolve(__dirname, "client"),

  resolve: {
    alias: {
      "@": resolve(__dirname, "client/src"),
    },
  },

  plugins: [react()],

  build: {
    outDir: resolve(__dirname, "dist/client"),
    emptyOutDir: true,
  },
});
