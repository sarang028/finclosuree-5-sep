/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        finclosure: {
          50: '#ecfdf5',
          100: '#e6f4f0',
          200: '#d1ebe3',
          300: '#a3d9ca',
          400: '#34d399',
          500: '#10b981',
          600: '#0d5c46',
          700: '#0b4f3c',
          800: '#064e3b',
          900: '#043e2e',
          950: '#02281d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
