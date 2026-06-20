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
        "pitch-black": "#0A0E0A",
        pitch: "#102217",
        "surface-elevated": "#111A13",
        floodlight: "#F8FFF4",
        "turf-green": "#1B5E3F",
        "goal-net": "#ECF5E8",
        "card-gold": "#D4AF37",
        gold: "#D4AF37",
        "live-red": "#E63946",
        primary: "#47C77A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
      },
      boxShadow: {
        turf: "0 8px 32px rgba(27, 94, 63, 0.35)",
        live: "0 0 28px rgba(230, 57, 70, 0.4)",
        bloom: "0 0 40px rgba(248, 255, 244, 0.08)",
      },
      backgroundImage: {
        "pitch-lines":
          "linear-gradient(rgba(236,245,232,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(236,245,232,0.04) 1px, transparent 1px)",
        "floodlight-radial":
          "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(248,255,244,0.12) 0%, transparent 70%)",
        "pitch-texture":
          "linear-gradient(135deg, rgba(27,94,63,0.05) 0%, transparent 50%), linear-gradient(rgba(236,245,232,0.03) 1px, transparent 1px)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "radio-wave": "radio-wave 1.8s ease-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "radio-wave": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
