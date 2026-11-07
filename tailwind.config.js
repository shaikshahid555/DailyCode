/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#09090B',
          card: '#141418',
          'card-hover': '#1A1A22',
          border: '#27272A',
          'border-subtle': '#1F1F23',
          muted: '#18181B'
        },
        brand: {
          purple: '#8B5CF6',
          'purple-light': '#A78BFA',
          'purple-dark': '#7C3AED',
          blue: '#6366F1',
          'blue-light': '#818CF8',
          'blue-dark': '#4F46E5',
          text: '#F4F4F5',
          subtext: '#A1A1AA',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.25)',
        'glow-blue': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'glow-success': '0 0 25px -5px rgba(34, 197, 94, 0.25)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
