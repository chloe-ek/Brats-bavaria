/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Outfit: ['Outfit', 'sans-serif'],
        Ovo: ['Ovo', 'serif'],
        Playfair: ['Playfair Display', 'serif'],
        Roboto: ['Roboto', 'sans-serif'],
        Satoshi: ['Satoshi', 'sans-serif'],
        Cinzel: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
}

