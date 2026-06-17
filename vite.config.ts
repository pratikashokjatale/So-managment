import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      // "/upload": {
      //   target: "http://72.62.227.125:3002",
      //   changeOrigin: true,
      // },
      // "/uploads": {
      //   target: "http://72.62.227.125:3002",
      //   changeOrigin: true,

      "/upload": {
        target: "https://marbellasociety.4tech.in",
        changeOrigin: true,
        rewrite: (path) => `/api${path}`,
      },
      "/uploads": {
        target: "https://marbellasociety.4tech.in",
        changeOrigin: true,
        rewrite: (path) => `/api${path}`,
      },
    },
  },
});
