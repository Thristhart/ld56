import { defineConfig } from "vite";
import path from "node:path";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "src"),
        },
    },
    plugins: [
        nodePolyfills(),
    ],
    base: "/ld56/",
    assetsInclude: ["**/*.entities", "**/*.terrain", "**/*.circuit"],
});
