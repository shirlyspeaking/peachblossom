import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans TC", "system-ui", "sans-serif"],
        serif: ["Noto Serif TC", "Songti TC", "serif"],
        display: ["ZCOOL XiaoWei", "Noto Serif TC", "serif"],
      },
      colors: {
        primary: {
          50: "#fdf5f7",
          100: "#fce8ed",
          200: "#f5ccd8",
          300: "#e8a3b8",
          400: "#d47292",
          500: "#b84d6f",
          600: "#9a3e5c",
          700: "#7f334c",
          800: "#5f2639",
          900: "#451c2a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
