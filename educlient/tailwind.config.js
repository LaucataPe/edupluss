/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        1: "#349cfc",
        4: "#071426",
      },  
    },
  },
  darkMode: "class",
  plugins: [],
};
