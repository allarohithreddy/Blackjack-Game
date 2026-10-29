/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        felt: {
          light: '#135d38',
          DEFAULT: '#0b4728',
          dark: '#07331c',
          border: '#042212'
        },
        gold: {
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        }
      },
      fontFamily: {
        casino: ['Cinzel', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'deal-card': 'dealCard 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'flip-card': 'flipCard 0.5s ease-in-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
        'bounce-short': 'bounceShort 0.5s ease-in-out',
      },
      keyframes: {
        dealCard: {
          '0%': { opacity: '0', transform: 'translateY(-60px) scale(0.85) rotate(-5deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1) rotate(0deg)' },
        },
        flipCard: {
          '0%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
