/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          2: "#0066F2",
        },
        neutrals: {
          1: "#141416",
          2: "#23262F",
          3: "#353945",
          4: "#777E90",
          8: "#FCFCFD",
        },
        grey: {
          50: "#A4ABB1",
          70: "#5E6B74",
        },
        background: "#090909",
      },
      fontFamily: {
        sans: ["Sora", ...defaultTheme.fontFamily.sans],
        code: ["Source Code Pro", ...defaultTheme.fontFamily.mono],
        // mont: ["SVN-Mont", ...defaultTheme.fontFamily.sans],
      },
    },
    backgroundImage: {
      signin: "url(./public/grid.svg)",
    },
  },
  plugins: [],
};
