import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vis: ["vis-timeline", "vis-data"],
                    react: ["react", "react-dom"],
                    date: ["react-datepicker", "date-fns"],
                },
                chunkFileNames: "assets/[name]-[hash].js",
                entryFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash][extname]",
            },
        },
        chunkSizeWarningLimit: 800,
    },
    optimizeDeps: {
        exclude: ["vis-timeline", "vis-data"],
    },
});
