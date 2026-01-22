import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // Ensure absolute path for assets
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()], // Removed componentTagger to reduce risk
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
