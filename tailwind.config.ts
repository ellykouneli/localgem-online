import typography from "@tailwindcss/typography"; // ✅ Import the plugin properly
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#49c7eeff", // lighter blue
          blueDark: "#1d5592ff", // darker blue
          emerald: "#5FE1B9", // light emerald
          emeraldDark: "#10B981", // darker emerald
        },
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(0,0,0,.18)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [
    typography, // ✅ Enables beautiful prose (Markdown) styles
  ],
};

export default config;
