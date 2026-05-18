/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#dea402',
          'gold-light': '#f5cc3a',
          dark: '#1a0405',
          'dark-card': '#241010',
          'dark-deep': '#120303',
          'dark-surface': '#2e1215',
          'dark-hover': '#351518',
        },
      },
      keyframes: {
        slideInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'pulse-ring-slow': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'pulse-ring-slow': 'pulse-ring-slow 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite 0.5s',
        'float': 'float 3s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
