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
        spa: {
          bg: "#121212",
          card: "#1a1a1a",
          surface: "#1f1f1f",
          secondary: "#161616",
          gold: "#c59d5f",
          "gold-light": "#dfbe82",
          "gold-dark": "#a88042",
          border: "rgba(197, 157, 95, 0.2)",
          "border-active": "rgba(197, 157, 95, 0.8)",
          muted: "#a0a0a0",
        },
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        alex: ["var(--font-alex)", "cursive"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        gold: "0 10px 30px rgba(197, 157, 95, 0.25)",
        "gold-glow": "0 0 20px rgba(197, 157, 95, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
