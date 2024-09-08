module.exports = {
  mode: "jit",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,html,mdx}", "./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        blue_gray: { 700: "#465765", 900: "#333333", "700_01": "#505e6c" },
        gray: { 300: "#dddddd", 600: "#808080", 700: "#5c5c5c", "300_01": "#e3e3e3", "300_02": "#e5e3df" },
        white: { a700: "#ffffff", a700_3f: "#ffffff3f" },
      },
      boxShadow: {},
      fontFamily: { inter: "Inter" },
      textShadow: { ts: "0px 1px 1px #ffffff3f", ts1: "1px 1px 1px #808080" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
