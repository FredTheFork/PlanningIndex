/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1B3F7A',
        'medium-blue': '#2C68C4',
        'accent-blue': '#4A90E2',
        'off-white': '#F0F4FF',
        'dark-text': '#1A1A2E',
        'secondary-text': '#4A5568',
        danger: '#E53E3E',
        success: '#38A169',
        border: '#E2E8F0',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
