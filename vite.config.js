import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pages, seo } from "./seo.config.js";

export default defineConfig({
  plugins: [react(), seo()],
  resolve: {
    // "@/components/ui/..." resolves to src/components/ui/..., the usual home
    // for shared UI components.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page.key, page.entry])),
    },
  },
});
