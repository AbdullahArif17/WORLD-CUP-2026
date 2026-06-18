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
        background: "#070b14",
        surface: "#0f1629",
        "surface-elevated": "#141e33",
        pitch: "#0a1020",
        primary: "#DC2626",
        "primary-dark": "#991b1b",
        gold: "#FBBF24",
        "gold-dark": "#d97706",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["Cascadia Code", "Consolas", "monospace"],
      },
      boxShadow: {
        live: "0 0 24px rgba(220, 38, 38, 0.25), inset 0 1px 0 rgba(220, 38, 38, 0.1)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
        gold: "0 0 20px rgba(251, 191, 36, 0.15)",
      },
      backgroundImage: {
        "pitch-grid":
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(220,38,38,0.18), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(251,191,36,0.08), transparent)",
      },
      animation: {
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
