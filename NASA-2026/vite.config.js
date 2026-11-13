import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // На GitHub Pages проєкт живе за адресою /<назва-репозиторію>/.
  // Локально (npm run dev) залишаємо корінь "/".
  base: process.env.GITHUB_ACTIONS ? "/NASA-hakaton-2026/" : "/",
  plugins: [react(), tailwindcss()],
});
