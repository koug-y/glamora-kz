import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        brand: "var(--brand)",
        brandInk: "var(--brand-ink)",
        brandTint: "var(--brand-tint)",
        ink: "var(--ink)",
        mutedInk: "var(--muted-ink)",
        surface: "var(--surface)",
        surfaceAlt: "var(--surface-alt)",
        border: "var(--border)",
      },
      borderRadius: {
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
