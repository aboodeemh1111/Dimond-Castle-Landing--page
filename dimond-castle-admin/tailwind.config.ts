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
        admin: {
          primary: "#6366f1", // indigo-500
          secondary: "#8b5cf6", // violet-500
          bg: "#f8fafc", // slate-50
          sidebar: "#1e293b", // slate-800
          text: "#0f172a", // slate-900
          textLight: "#64748b", // slate-500
          border: "#e2e8f0", // slate-200
          success: "#10b981", // emerald-500
          danger: "#ef4444", // red-500
          warning: "#f59e0b", // amber-500
        },
      },
    },
  },
  plugins: [],
};

export default config;
