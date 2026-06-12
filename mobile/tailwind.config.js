/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}" // <--- THIS IS THE MISSING MAGIC LINE!
  ],
  theme: {
    extend: {
      colors: {
        background: '#141313',
        surface: '#1c1b1b',
        'surface-container': '#201f1f',
        'surface-container-high': '#2a2a2a',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#c5c7c9',
        outline: '#8f9194',
        primary: '#ffffff',
        'on-primary': '#2f3132',
        secondary: '#c8c6c8',
        error: '#ffb4ab',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '16px',
        full: '9999px'
      }
    },
  },
  plugins: [],
}