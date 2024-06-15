/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'yellow-opacity': 'rgba(255, 199, 0, 0.5)', // Cambia '0.5' para ajustar la opacidad
      },
      lineClamp: {
        8: '8',
      },
    },
  },
  plugins: [require('flowbite/plugin'), require('@tailwindcss/typography'),],
}

