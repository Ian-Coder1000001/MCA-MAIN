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
        forest: {
          900: "#071f10",
          800: "#0a2d18",
          700: "#0f3d24",
          600: "#165230",
          500: "#1f6b3a",
          400: "#3d8a57",
          300: "#6fab82",
          100: "#d4e6d9",
          50:  "#eef4f0",
        },
        clay: {
          400: "#e07f3a",
          300: "#eda46a",
          200: "#f5c99e",
        },
        gold: "#c9a84c",
        stone: {
          50:  "#f8f7f5",
          100: "#eeecea",
          200: "#d9d6d1",
          400: "#9e9890",
          600: "#625d56",
          800: "#32302a",
          900: "#1c1a16",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans:  ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
