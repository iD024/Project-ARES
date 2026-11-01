/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ares: {
          space: '#05070D',
          surface: '#0B0F19',
          card: 'rgba(15, 23, 42, 0.85)',
          border: 'rgba(51, 65, 85, 0.6)',
          rust: '#EA580C',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          emerald: '#10B981',
          crimson: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
