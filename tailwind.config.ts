// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        brand: "#7c3aed",
        "brand-light": "#a78bfa",
        "brand-dark": "#4c1d95",
        olive: "#59684a",
      },
      boxShadow: {
        header: "0 8px 20px rgba(0,0,0,0.06)",
        card: "0 6px 16px rgba(0,0,0,0.08)",
        glow: "0 0 0 4px rgba(124, 58, 237, 0.20)",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: [
          "Poppins",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [], // ← must be an array; leave empty if you don't use plugins
} satisfies Config;
