/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: '#25D366',
          darkgreen: '#128C7E',
          teal: '#075E54',
          light: '#DCF8C6',
          blue: '#34B7F1',
        }
      }
    },
  },
  plugins: [],
}