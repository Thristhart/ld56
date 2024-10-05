import { defineConfig } from "vite";
import path from "node:path";
import viteInkPlugin from "./vite-ink-plugin";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  plugins: [viteInkPlugin()],
  base: "/ld56/",
});
