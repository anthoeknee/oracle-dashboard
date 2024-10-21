/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          700: "#2D3748",
          800: "#1A202C",
          900: "#171923",
        },
        blue: {
          500: "#4299E1",
        },
      },
    },
  },
  plugins: [],
};
