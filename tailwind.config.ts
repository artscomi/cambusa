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
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        secondaryLighter: "var(--secondary-lighter)",
        tertiary: "var(--tertiary)",
        background: "var(--background)",
      },
    },
  },

  plugins: [],
};
export default config;
