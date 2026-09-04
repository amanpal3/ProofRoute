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
        background: "var(--background)",
        foreground: "var(--foreground)",
        proof: {
          dark: "#080c14",
          surface: "#0f172a",
          card: "rgba(15, 23, 42, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          emerald: "#10b981",
          "emerald-glow": "rgba(16, 185, 129, 0.25)",
          indigo: "#6366f1",
          "indigo-glow": "rgba(99, 102, 241, 0.25)",
          crimson: "#ef4444",
          "crimson-glow": "rgba(239, 68, 68, 0.25)",
          amber: "#f59e0b",
          cyan: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px -5px var(--tw-shadow-color)",
        "glow-sm": "0 0 15px -3px var(--tw-shadow-color)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        scan: "scanline 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
