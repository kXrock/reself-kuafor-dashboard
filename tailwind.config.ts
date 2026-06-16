import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, elegant unisex-salon palette — disciplined, NOT SaaS blue/purple.
        cream: "#F6F1E9",
        surface: "#FBF8F3",
        ink: "#2B2520",
        muted: "#8A7E70",
        clay: "#B05B3B", // single accent (terracotta)
        "clay-soft": "#C9785A",
        hairline: "#E3DACC",
        olive: "#6B6A4E", // sparse secondary for charts only
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-work-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "5px",
        sm: "3px",
        lg: "7px",
      },
      boxShadow: {
        // Near-zero — depth comes from hairline borders, not shadows.
        soft: "0 1px 2px rgba(43, 37, 32, 0.04)",
        lift: "0 6px 24px -12px rgba(43, 37, 32, 0.18)",
      },
      letterSpacing: {
        tightish: "-0.01em",
      },
    },
  },
  plugins: [],
};

export default config;
