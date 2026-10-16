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
        apple: {
          canvas: "#090a0f",
          surface: "#12141c",
          elevated: "#1a1d28",
          border: "#272b3b",
          subtle: "#363c50",
          text: "#f1f3f9",
          muted: "#9ba3b8",
          accent: "#2563eb",
          focus: "#38bdf8",
        },
        severity: {
          critical: "#ef4444",
          "critical-bg": "#450a0a",
          "critical-border": "#991b1b",
          serious: "#f97316",
          "serious-bg": "#431407",
          "serious-border": "#9a3412",
          moderate: "#eab308",
          "moderate-bg": "#422006",
          "moderate-border": "#854d0e",
          minor: "#06b6d4",
          "minor-bg": "#083344",
          "minor-border": "#155e75",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
