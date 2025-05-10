import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      mono: ["ui-monospace", "SFMono-Regular", "sans-serif"],
      display: ["var(--font-baloo)"],
      subtitle: ["var(--font-montserrat)"],
      cta: ["var(--font-bebas)"],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          "40": "rgb(var(--primary-rgb), 0.4)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          light: "var(--secondary-light)",
          "40": "rgb(var(--secondary-rgb), 0.4)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          "5": "rgb(var(--accent-rgb), 0.05)",
          "40": "rgb(var(--accent-rgb), 0.4)",
        },
        green: {
          DEFAULT: "var(--green)",
          light: "var(--green-light)",
          "40": "rgb(var(--green-rgb), 0.4)",
        },
        default: "var(--default)",
        background: "var(--background)",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
export default config;
