/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        space: {
          dark: '#0a0a1a',
          blue: '#1a1a3a',
          purple: '#3a1a4a',
          neon: '#00ffff',
          pink: '#ff00ff',
        },
      },
    },
  },
  plugins: [],
}