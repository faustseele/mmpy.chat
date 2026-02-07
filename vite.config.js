/* eslint-disable no-undef */
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  publicDir: 'static',
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      includeAssets: ["logo.ico", "icon-192.png", "icon-512.png", "*.svg"],
      manifest: {
        name: "MMPY Messenger",
        short_name: "MMPY-Msgr",
        description: "mmpy.messenger 💌 — portfolio pet-project",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/logo.ico",
            sizes: "any",
            type: "image/x-icon",
            purpose: "any",
          },
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
        ],
        screenshots: [
          {
            src: "/scr-1.jpg",
            sizes: "1380x1080",
            type: "image/jpg",
            form_factor: "wide",
            label: "Desktop View",
          },
          {
            src: "/scr-2.jpg",
            sizes: "1380x1080",
            type: "image/jpg",
            form_factor: "wide",
            label: "Desktop View",
          },
          {
            src: "/scr-mob-1.jpg",
            sizes: "429x931",
            type: "image/jpg",
            label: "Mobile View",
          },
          {
            src: "/scr-mob-2.jpg",
            sizes: "429x931",
            type: "image/jpg",
            label: "Mobile View",
          },
        ],
      },
    }),
  ],
  server: { port: 3000 },
  preview: { port: 3000 },
  build: { target: "es2022", outDir: "dist" },
  css: {
    modules: {
      scopeBehaviour: "local",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
    postcss: "./postcss.config.js",
  },
  resolve: {
    /* The resolve.extensions option tells Vite
      which file extensions to try when resolving imports.
      Including .ts and .d.ts ensures Vite can handle
      TypeScript files with explicit extensions */
    extensions: [".js", ".ts", ".d.ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});
