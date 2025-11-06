/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD700",
        secondary: "#545050",
        accent: "#FF4081",
        background: "#f5f5f5",
        'dark-bg': '#1a1a1a',
        'light-text': '#ffffff',
        'dark-text': '#333333',
        'hover-color': '#FFE44D'
      },
      fontFamily: {
        figtree: ['Figtree', 'sans-serif'],
        playfair: ['Playfair Display', 'serif']
      },
      fontSize: {
        'heading': ['3.5rem', { lineHeight: '1.2' }],
        'subheading': ['2rem', { lineHeight: '1.5' }]
      },
      height: {
        'screen-90': '90vh'
      },
      maxWidth: {
        '8xl': '88rem'
      },
      keyframes: {
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
      },
    },
  },
  plugins: [],
}
