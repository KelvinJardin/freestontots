module.exports = {
  mode: "jit",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,html,mdx}", "./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        blue_gray: { 700: "#465765", 900: "#333333", "700_01": "#505e6c" },
        gray: { 300: "#dddddd", 600: "#808080", 700: "#5c5c5c", "300_01": "#e3e3e3", "300_02": "#e5e3df" },
        white: { a700: "#ffffff", a700_3f: "#ffffff3f" },
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
        teal: {
          50: "#f0fdfa",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)",
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      },
      fontFamily: { inter: "Inter" },
      textShadow: { ts: "0px 1px 1px #ffffff3f", ts1: "1px 1px 1px #808080" },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};
