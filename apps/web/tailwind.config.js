/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design system v1.0 — green accent, warm canvas
        accent: {
          DEFAULT: '#14C06A',
          600: '#0E8A4C',
          wash: '#E8F8EF',
          200: '#C9F2DD',
          ink: '#062815',
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
        // Top-level aliases for design system shorthand (bg-energy, bg-hydration, bg-danger)
        energy: '#FF6B5E',
        hydration: '#21C7C7',
        danger: '#E0563E',
        // Keep dark.* aliases for dark-mode backward compat
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        flat: '0 1px 2px rgba(20,22,30,0.04)',
        card: '0 1px 2px rgba(20,22,30,0.05),0 10px 26px -18px rgba(20,22,30,0.22)',
        overlay: '0 2px 6px rgba(20,22,30,0.06),0 18px 40px -16px rgba(20,22,30,0.24)',
        btn: '0 6px 16px -8px rgba(20,192,106,0.7)',
      },
      letterSpacing: {
        display: '-0.035em',
        overline: '0.12em',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideUp: 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
