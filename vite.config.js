import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        services: "services/index.html",
        towing: "services/towing/index.html",
        roadside: "services/roadside/index.html",
        heavy: "services/heavy/index.html",
        about: "about/index.html",
        contact: "contact/index.html",
      },
    },
  },
});
