/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px -15px rgba(2, 44, 34, 0.35)',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        pop: 'popIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
