import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  base: "/ld56/",
  assetsInclude: ["**/*.entities", "**/*.ground"],
});
