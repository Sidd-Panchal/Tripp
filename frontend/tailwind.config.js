/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f4f6fe',
          100: '#e9edfc',
          200: '#ccd5f8',
          300: '#a3b4f3',
          400: '#738deb',
          500: '#4f6ee5',
          600: '#3850cb',
          700: '#2b3ea6',
          800: '#243285',
          900: '#212c6c',
          950: '#141940',
        },
      },
    },
  },
  plugins: [],
}
