import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "favicon-32.png", "apple-touch-icon.png"],
      manifest: {
        id: "/",
        name: "Guia Bateria",
        short_name: "Guia Bateria",
        description:
          "Ajustes de bateria para o seu iPhone, com instruções para iOS 26.",
        lang: "pt-BR",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Hashed assets are precached. The HTML shell is not: navigations go
        // to the network first so a reload always shows the latest release,
        // and fall back to the last cached shell only when offline.
        globPatterns: ["**/*.{js,css,png,svg,woff2}"],
        globIgnores: ["**/index.html"],
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              request.mode === "navigate" || url.pathname === "/",
            handler: "NetworkFirst",
            options: {
              cacheName: "guia-bateria-shell",
              networkTimeoutSeconds: 4,
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules/scheduler/")
          )
            return "react";
        },
      },
    },
  },
  server: { port: 5173 },
  preview: { port: 4173 },
});
