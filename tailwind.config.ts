import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury dark mode palette
        'midnight': '#0a0e27',
        'hunter': '#1a3a2e',
        'charcoal': '#1a1a1f',
        'gold': {
          DEFAULT: '#d4af37',
          50: '#f9f4e3',
          100: '#f0e8c2',
          200: '#e6daa1',
          300: '#dccb7f',
          400: '#d4af37',
          500: '#c49d2f',
          600: '#a67f24',
          700: '#7f5f1b',
          800: '#594114',
          900: '#33250d',
        },
        // Glass-specific colors
        'glass': {
          bg: 'rgba(26, 26, 31, 0.6)',
          border: 'rgba(255, 255, 255, 0.1)',
          'bg-dark': 'rgba(10, 14, 39, 0.7)',
          'border-light': 'rgba(255, 255, 255, 0.15)',
        },
      },
      backdropBlur: {
        '4xl': '80px',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'luxury-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'luxury-in': 'cubic-bezier(0.4, 0.0, 1, 1)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      screens: {
        'xs': '375px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
      backgroundImageSize: {
        '1/2': '50%',
        '1/3': '33.333%',
        '2/3': '66.666%',
        '1/4': '25%',
        '3/4': '75%',
      },
    },
  },
  plugins: [],
}
export default config
