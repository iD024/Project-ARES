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
        },
        obsidian: {
          950: '#020204',
          900: '#05070D',
          800: '#0A0D14',
          700: '#111622',
        },
        glass: {
          base: 'rgba(8, 10, 15, 0.78)',
          elevated: 'rgba(14, 18, 26, 0.88)',
          card: 'rgba(255, 255, 255, 0.035)',
          hover: 'rgba(255, 255, 255, 0.07)',
          active: 'rgba(255, 255, 255, 0.14)',
          border: 'rgba(255, 255, 255, 0.10)',
          'border-strong': 'rgba(255, 255, 255, 0.18)',
          'border-subtle': 'rgba(255, 255, 255, 0.06)',
        }
      },
      boxShadow: {
        'glass-sm': '0 8px 24px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.10)',
        'glass-md': '0 16px 40px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
        'glass-lg': '0 24px 64px rgba(0, 0, 0, 0.92), inset 0 1px 0 0 rgba(255, 255, 255, 0.16)',
        'glow-white': '0 0 20px rgba(255, 255, 255, 0.16)',
        'glow-cyan': '0 0 24px rgba(6, 182, 212, 0.25)',
        'glow-mars': '0 0 24px rgba(234, 88, 12, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
