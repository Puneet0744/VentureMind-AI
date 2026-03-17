/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#ecfffb',
          100: '#d1fff6',
          200: '#a9fbed',
          300: '#74f1e0',
          400: '#3ee3d0',
          500: '#19c7b5',
          600: '#109f92',
          700: '#0d7f77',
          800: '#0f6660',
          900: '#11544f',
        },
        accent: {
          300: '#ffd79a',
          400: '#ffc167',
          500: '#ffab36',
          600: '#f78a1f',
        },
        cyan: {
          300: '#9be8ff',
          400: '#54d3ff',
          500: '#20b6ff',
          600: '#138ecd',
        },
        dark: {
          800: '#0c1b22',
          850: '#09161d',
          900: '#061015',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      fontFamily: {
        sans: ['DM Sans', 'Segoe UI', 'sans-serif'],
        display: ['Bricolage Grotesque', 'DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

