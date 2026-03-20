/* eslint-disable no-undef */
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const base = mode === "production" ? "/mmpy.chat/" : "/";

  return {
    base,
    publicDir: "static",
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "script-defer",
        devOptions: { enabled: false },
        includeAssets: ["logo.ico", "icon-192.png", "icon-512.png", "*.svg"],
        manifest: {
          name: "MMPY-Chat",
          short_name: "MMPY-Chat",
          description: "mmpy-chat 💌 — chats with notes",
          theme_color: "#b9dfa5",
          background_color: "#101607",
          display: "standalone",
          scope: base,
          start_url: base,
          icons: [
            {
              src: "logo.ico",
              sizes: "any",
              type: "image/x-icon",
              purpose: "any",
            },
            {
              src: "icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
          ],
          screenshots: [
            {
              src: "scr_sign-in.jpg",
              sizes: "700x890",
              type: "image/jpeg",
              form_factor: "wide",
              label: "Sign In",
            },
            {
              src: "scr_chat.png",
              sizes: "874x889",
              type: "image/png",
              form_factor: "wide",
              label: "Chat",
            },
          ],
        },
      }),
    ],
    server: { port: 3000 },
    preview: { port: 3000 },
    build: {
      target: "es2022",
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks: { handlebars: ["handlebars"] },
        },
      },
    },
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
  };
});
