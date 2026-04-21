/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFC220', // Vibrant Yellow
        black: '#000000',   // Pure Black
        dark: '#1A1A1A',    // Dark Gray
        accent: '#FF6B4A',
        cream: '#FDF4EC',
        'primary-dark': '#E5AF00',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
