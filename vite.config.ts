import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages sirve el sitio bajo /casino-app/, Render lo sirve en la raíz de su
// propio dominio. BASE_PATH permite compilar para ambos sin duplicar el proyecto.
export default defineConfig({
  base: process.env.BASE_PATH || "/casino-app/",
  plugins: [react()],
});
