import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    tailwindcss(),
    metaImagesPlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  // Load .env* from the project root (where this config lives) too — by
  // default Vite only reads them from `root` (client/), so an .env.local at
  // the repo root would be silently ignored.
  envDir: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    allowedHosts: [".replit.dev", ".replit.app"], host: "0.0.0.0",
    port: 5000,
    proxy: {
      "/api": {
        // Local dev talks to the kwikm-api NestJS instance on 5181; prod
        // still routes to api.kwikm.in. Override with API_PROXY_TARGET when
        // running the API on a different port locally.
        target: process.env.NODE_ENV === "production"
          ? "https://api.kwikm.in"
          : process.env.API_PROXY_TARGET || "http://localhost:5181",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
