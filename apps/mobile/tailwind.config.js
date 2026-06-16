/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Design system v1.0 — green accent, warm canvas
        accent: {
          DEFAULT: '#14C06A',
          600: '#0E8A4C',
          wash: '#E8F8EF',
          200: '#C9F2DD',
        },
        ink: {
          900: '#15161A',
          700: '#3A3B40',
          500: '#6B6C72',
          300: '#A7A8AD',
        },
        canvas: '#F6F5F2',
        paper: '#FFFFFF',
        line: '#E7E6E1',
        macro: {
          protein: '#14C06A',
          carbs: '#F5A524',
          fat: '#7C8CFF',
        },
        semantic: {
          danger: '#E0563E',
          hydration: '#21C7C7',
          energy: '#FF6B5E',
        },
      },
    },
  },
  plugins: [],
};
