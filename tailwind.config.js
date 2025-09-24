/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pumpkin: '#F9943B',
        eerie: '#232323',
        davy: '#555555'
      },
      borderRadius: {
        '2xl': '1rem'
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
