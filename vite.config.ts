import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        
    ],

    build: {
        rollupOptions: {
            input: {
                main: "./index.html",
            }
        }
    },

    server: {
        host: "0.0.0.0",
        port: 5173,
        open: true,
        strictPort: true,
        allowedHosts: ["eminent-lucina-naillike.ngrok-free.dev"],
        hmr: {
            overlay: true,
        },
    },
})