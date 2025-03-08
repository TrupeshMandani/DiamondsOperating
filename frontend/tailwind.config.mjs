/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      boxShadow: {
        "inner-deep": "inset 0 4px 8px rgba(0, 0, 0, 0.2)", // Deeper shadow
        "inner-deeper": "inset 0 12px 24px rgba(0, 0, 0, 0.5)", // Even deeper shadow
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
