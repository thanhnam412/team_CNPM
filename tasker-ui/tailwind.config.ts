import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./store/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7f9fb", surface: "#f7f9fb", "surface-container-lowest": "#ffffff", "surface-container-low": "#f2f4f6", "surface-container": "#eceef0", "surface-container-high": "#e6e8ea", "surface-container-highest": "#e0e3e5", "surface-bright": "#f7f9fb", "surface-dim": "#d8dadc", "surface-variant": "#e0e3e5", "surface-tint": "#4d44e3",
        "on-background": "#191c1e", "on-surface": "#191c1e", "on-surface-variant": "#464555", outline: "#777587", "outline-variant": "#c7c4d8",
        primary: "#3525cd", "primary-container": "#4f46e5", "on-primary": "#ffffff", "on-primary-container": "#dad7ff", "primary-fixed": "#e2dfff", "primary-fixed-dim": "#c3c0ff", "on-primary-fixed": "#0f0069", "on-primary-fixed-variant": "#3323cc", "accent-primary": "#4d44e3",
        secondary: "#505f76", "secondary-container": "#d0e1fb", "on-secondary": "#ffffff", "on-secondary-container": "#54647a", "secondary-fixed": "#d3e4fe", "secondary-fixed-dim": "#b7c8e1",
        tertiary: "#41485e", "tertiary-container": "#586076", error: "#ba1a1a", "error-container": "#ffdad6", "on-error": "#ffffff", "on-error-container": "#93000a",
      },
      fontFamily: { inter: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"], syne: ["Be Vietnam Pro", "Inter", "sans-serif"], heading: ["Be Vietnam Pro", "Inter", "sans-serif"], mono: ["Space Mono", "ui-monospace", "monospace"] },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem" },
      boxShadow: { glow: "0 0 15px rgba(79,70,229,0.12)" },
    },
  },
  plugins: [],
};
export default config;
