import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        terracotta: {
          50: '#fdf6f4',
          100: '#fbece5',
          200: '#f6d8ce',
          300: '#efbeac',
          400: '#e59c83',
          500: '#da7c60',
          600: '#c4633b', // Primary Terracotta
          700: '#a54d2e',
          800: '#864129',
          900: '#6c3825',
          950: '#3a1b10',
        },
        granola: {
          100: '#f7f3ea', // Primary Background
          200: '#e9e1cd',
        }
      },
    },
  },
  plugins: [],
};
export default config;
