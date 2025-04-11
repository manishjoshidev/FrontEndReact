import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    allowedHosts: [
      "all", // allows all external hosts
      "b080-2405-201-c009-6127-c64-7358-7308-e318.ngrok-free.app", // your ngrok domain
    ],
  },
});
