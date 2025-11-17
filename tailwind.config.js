/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      scale: {
        '98': '0.98',
      },
    },
  },
  plugins: [],
};
