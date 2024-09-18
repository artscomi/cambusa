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
      display: ['var(--font-poppins)'],
      subtitle: ['var(--font-montserrat)'],
      body: ['var(--font-roboto)'],
    },
    extend: {
      colors: {
        primary: "var(--primary)",
        default: "var(--default)",
        secondary: "var(--secondary)",
        ["secondary-light"]: "var(--secondary-light)",
        tertiary: "var(--tertiary)",
        accent: "var(--accent)",
        ['accent-light']: "var(--accent-light)",
        background: "var(--background)",
      },
    },
  },

  plugins: [],
};
export default config;
