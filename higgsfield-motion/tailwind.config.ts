import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './v2.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        lumen: {
          bg: '#0A0E1A',
          amber: '#F5A623',
          white: '#E8F0FF',
          purple: '#6B5B8E',
          text: '#D4DCE8',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
