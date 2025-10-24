/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFD166',
        light: '#F7FFF7',
        dark: '#292F36',
        success: '#06D6A0',
        warning: '#FFD166',
        danger: '#EF476F',
        info: '#118AB2'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Comic Sans MS', 'cursive', 'sans-serif']
      },
    },
  },
  plugins: [],
}