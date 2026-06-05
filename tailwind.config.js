/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./resources/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ai-bg': '#F8FAFC',
        'ai-surface': '#FFFFFF',
        'ai-surface-alt': '#F1F5F9',
        'ai-primary': '#2563EB',   /* Blue 600 */
        'ai-secondary': '#8B5CF6', /* Violet 500 */
        'ai-text-primary': '#0F172A',
        'ai-text-muted': '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
