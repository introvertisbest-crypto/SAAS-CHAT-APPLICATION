/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Space Grey Design System
        space: {
          900: '#1C1C1E', // Background
          800: '#2C2C2E', // Card/Section
          700: '#3A3A3C', // Borders
          600: '#48484A',
          500: '#636366',
          400: '#8E8E93', // Secondary text muted
          300: '#A1A1AA', // Secondary text
          200: '#C7C7CC',
          100: '#FFFFFF', // Primary text
        },
        accent: {
          DEFAULT: '#0A84FF', // Apple blue accent
          hover: '#0066CC',
          light: '#5AC8FA',
        },
        // Keep primary for backward compatibility, map to accent
        primary: {
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B0FF',
          400: '#3396FF',
          500: '#0A84FF',
          600: '#0066CC',
          700: '#0059B3',
          800: '#004D99',
          900: '#003D7A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      transitionDuration: {
        '300': '300ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
