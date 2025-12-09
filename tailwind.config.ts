import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        primary: "#6366f1",
        secondary: "#22c55e",
      },
    },
  },
  plugins: [],
};
export default config;
