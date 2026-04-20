import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", "sans-serif"],
        serif: ["var(--font-serif)", "Noto Serif TC", "Songti TC", "serif"],
        display: ["ZCOOL XiaoWei", "Noto Serif TC", "serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        ring: "hsl(var(--ring))",
        input: "hsl(var(--input))",
        border: "hsl(var(--border))",
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
